-- ============================================================
-- FITPLAN - Utwardzenie bezpieczenstwa przed wdrozeniem produkcyjnym
--
-- Skrypt jest idempotentny: mozna go uruchomic wielokrotnie bez skutkow ubocznych.
--
-- URUCHAMIANIE: wklejaj i uruchamiaj CZESC PO CZESCI (1 -> 5).
-- Kazda czesc jest samodzielna. Dzieki temu ewentualny blad od razu
-- wskazuje, ktory fragment go wywolal.
--
-- Naprawia:
--   1. Brak limitow dlugosci pol tekstowych (zapchanie bazy)
--   2. Brak limitu liczby wpisow na dobe (zalanie bazy rekordami)
--   3. author_name / updated_at kontrolowane przez klienta (podszywanie sie)
--   4. handle_new_user() bez SET search_path (eskalacja uprawnien)
--   5. Rozjazd schematu z kodem aplikacji (brakujace kolumny w profiles)
--
-- Uwaga techniczna: kazdy blok kodu uzywa WLASNEGO znacznika cudzyslowu
-- dolarowego ($do$, $fn1$, ...). Powtarzanie tego samego $$ w wielu blokach
-- bywa zle dzielone przez edytory SQL i konczy sie bledem
-- "syntax error at or near DECLARE".
-- ============================================================


-- ============================================================
-- CZESC 1 - BRAKUJACE KOLUMNY W profiles
-- Aplikacja zapisuje te kolumny (Dashboard.jsx, WeightTracker.jsx,
-- ProfileSettings.jsx, TDEECalculator.jsx), ale nie bylo ich w schemacie.
-- ============================================================

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS weight         NUMERIC(5,1);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS height         NUMERIC(5,1);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_protein INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_carbs   INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_fat     INTEGER;


-- ============================================================
-- CZESC 2 - LIMITY WARTOSCI I DLUGOSCI TEKSTU
--
-- Walidacja w React (np. maxLength={500}) chroni tylko wlasny interfejs.
-- Klucz anon jest publiczny, wiec kazdy zalogowany uzytkownik moze wyslac
-- zadanie bezposrednio do REST API Supabase z dowolna trescia.
-- Te ograniczenia egzekwuje juz sama baza - ominac sie ich nie da.
--
-- NOT VALID: regula obowiazuje wszystkie NOWE i modyfikowane wiersze,
-- ale nie blokuje skryptu, jesli w bazie sa juz starsze dane
-- naruszajace limit.
-- ============================================================

DO $do$
DECLARE
  c RECORD;
BEGIN
  FOR c IN
    SELECT * FROM (VALUES
      ('profiles',       'chk_profiles_first_name_len', 'char_length(first_name) <= 50'),
      ('profiles',       'chk_profiles_last_name_len',  'char_length(last_name) <= 50'),
      ('profiles',       'chk_profiles_initials_len',   'char_length(initials) <= 10'),
      ('profiles',       'chk_profiles_weight',         'weight IS NULL OR (weight > 20 AND weight < 500)'),
      ('profiles',       'chk_profiles_height',         'height IS NULL OR (height > 50 AND height < 300)'),
      ('profiles',       'chk_profiles_protein',        'target_protein IS NULL OR target_protein BETWEEN 0 AND 1000'),
      ('profiles',       'chk_profiles_carbs',          'target_carbs   IS NULL OR target_carbs   BETWEEN 0 AND 2000'),
      ('profiles',       'chk_profiles_fat',            'target_fat     IS NULL OR target_fat     BETWEEN 0 AND 1000'),
      ('profiles',       'chk_profiles_target_cal',     'target_calories IS NULL OR target_calories BETWEEN 0 AND 20000'),

      ('meal_logs',      'chk_meal_name_len',           'char_length(meal_name) BETWEEN 1 AND 200'),
      ('meal_logs',      'chk_meal_type_len',           'char_length(meal_type) <= 30'),
      ('meal_logs',      'chk_meal_calories_max',       'calories <= 30000'),
      ('meal_logs',      'chk_meal_macros_max',         'protein <= 5000 AND carbs <= 5000 AND fat <= 5000'),

      ('water_logs',     'chk_water_amount_max',        'amount_ml <= 10000'),

      ('weight_logs',    'chk_weight_max',              'weight_kg < 500'),
      ('weight_logs',    'chk_waist_max',               'waist_cm IS NULL OR waist_cm < 300'),
      ('weight_logs',    'chk_hips_max',                'hips_cm  IS NULL OR hips_cm  < 300'),

      ('wellbeing_logs', 'chk_wellbeing_note_len',      'char_length(note) <= 1000'),
      ('wellbeing_logs', 'chk_wellbeing_symptoms_len',  'array_length(symptoms, 1) IS NULL OR array_length(symptoms, 1) <= 20'),

      ('quiz_attempts',  'chk_quiz_name_len',           'char_length(quiz_name) BETWEEN 1 AND 120'),
      ('quiz_attempts',  'chk_quiz_score_sane',         'score <= max_score AND max_score <= 1000'),

      ('app_reviews',    'chk_review_comment_len',      'char_length(comment) <= 500'),
      ('app_reviews',    'chk_review_author_len',       'char_length(author_name) <= 60')
    ) AS t(tbl, name, expr)
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint
       WHERE conname = c.name
         AND conrelid = format('public.%I', c.tbl)::regclass
    ) THEN
      EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I CHECK (%s) NOT VALID',
                     c.tbl, c.name, c.expr);
      RAISE NOTICE 'Dodano ograniczenie %.%', c.tbl, c.name;
    END IF;
  END LOOP;
END;
$do$;


-- ============================================================
-- CZESC 3 - LIMIT LICZBY WPISOW NA DOBE
--
-- RLS pozwala uzytkownikowi wstawiac wlasne wiersze bez ograniczen,
-- wiec petla insertow moze zapchac baze (darmowy plan: 500 MB).
-- Trigger liczy wiersze uzytkownika z ostatnich 24 h. Limit przekazywany
-- jest argumentem, wiec jedna funkcja obsluguje wszystkie tabele.
-- ============================================================

CREATE OR REPLACE FUNCTION public.enforce_daily_row_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn1$
DECLARE
  used     INTEGER;
  max_rows INTEGER := COALESCE(NULLIF(TG_ARGV[0], '')::INTEGER, 200);
BEGIN
  EXECUTE format(
    'SELECT COUNT(*) FROM public.%I WHERE user_id = $1 AND created_at > NOW() - INTERVAL ''1 day''',
    TG_TABLE_NAME
  ) INTO used USING NEW.user_id;

  IF used >= max_rows THEN
    RAISE EXCEPTION
      'Przekroczono dzienny limit wpisow (%) w tabeli %. Sprobuj ponownie jutro.',
      max_rows, TG_TABLE_NAME
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NEW;
END;
$fn1$;

DROP TRIGGER IF EXISTS trg_limit_meal_logs      ON public.meal_logs;
DROP TRIGGER IF EXISTS trg_limit_water_logs     ON public.water_logs;
DROP TRIGGER IF EXISTS trg_limit_weight_logs    ON public.weight_logs;
DROP TRIGGER IF EXISTS trg_limit_wellbeing_logs ON public.wellbeing_logs;
DROP TRIGGER IF EXISTS trg_limit_quiz_attempts  ON public.quiz_attempts;

-- Limity dobrane z duzym zapasem wzgledem realnego uzycia aplikacji.
CREATE TRIGGER trg_limit_meal_logs      BEFORE INSERT ON public.meal_logs
  FOR EACH ROW EXECUTE FUNCTION public.enforce_daily_row_limit('200');
CREATE TRIGGER trg_limit_water_logs     BEFORE INSERT ON public.water_logs
  FOR EACH ROW EXECUTE FUNCTION public.enforce_daily_row_limit('100');
CREATE TRIGGER trg_limit_weight_logs    BEFORE INSERT ON public.weight_logs
  FOR EACH ROW EXECUTE FUNCTION public.enforce_daily_row_limit('50');
CREATE TRIGGER trg_limit_wellbeing_logs BEFORE INSERT ON public.wellbeing_logs
  FOR EACH ROW EXECUTE FUNCTION public.enforce_daily_row_limit('50');
CREATE TRIGGER trg_limit_quiz_attempts  BEFORE INSERT ON public.quiz_attempts
  FOR EACH ROW EXECUTE FUNCTION public.enforce_daily_row_limit('100');


-- ============================================================
-- CZESC 4 - AUTOR OPINII USTAWIANY PO STRONIE BAZY
--
-- Dotychczas author_name i updated_at przychodzily z przegladarki, a RLS
-- sprawdzalo wylacznie user_id. Pozwalalo to podpisac opinie dowolna nazwa
-- (np. "Administrator FitPlan") i sfalszowac date modyfikacji.
-- Teraz baza nadpisuje oba pola niezaleznie od tego, co przysle klient.
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_review_author()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn2$
DECLARE
  p RECORD;
BEGIN
  SELECT first_name, last_name, initials
    INTO p
    FROM public.profiles
   WHERE id = NEW.user_id;

  NEW.author_name := COALESCE(
    NULLIF(TRIM(
      COALESCE(p.first_name, '') ||
      CASE WHEN NULLIF(TRIM(COALESCE(p.last_name, '')), '') IS NOT NULL
           THEN ' ' || LEFT(p.last_name, 1) || '.'
           ELSE '' END
    ), ''),
    NULLIF(p.initials, ''),
    'Uzytkownik'
  );

  NEW.updated_at := NOW();

  IF TG_OP = 'UPDATE' THEN
    NEW.created_at := OLD.created_at;   -- data dodania jest niezmienna
  END IF;

  RETURN NEW;
END;
$fn2$;

DROP TRIGGER IF EXISTS trg_set_review_author ON public.app_reviews;
CREATE TRIGGER trg_set_review_author
  BEFORE INSERT OR UPDATE ON public.app_reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_review_author();


-- ============================================================
-- CZESC 5 - PRZYPIETY search_path W FUNKCJACH SECURITY DEFINER
--
-- Funkcja SECURITY DEFINER bez ustalonego search_path to klasyczny wektor
-- eskalacji uprawnien w PostgreSQL
-- (linter Supabase: function_search_path_mutable).
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn3$
DECLARE
  fn TEXT := NULLIF(TRIM(NEW.raw_user_meta_data ->> 'first_name'), '');
  ln TEXT := NULLIF(TRIM(NEW.raw_user_meta_data ->> 'last_name'), '');
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, initials, target_calories)
  VALUES (
    NEW.id,
    LEFT(fn, 50),
    LEFT(ln, 50),
    COALESCE(
      NULLIF(UPPER(LEFT(COALESCE(fn, ''), 1) || LEFT(COALESCE(ln, ''), 1)), ''),
      UPPER(LEFT(split_part(NEW.email, '@', 1), 10)),
      'USR'
    ),
    2000
  );
  RETURN NEW;
END;
$fn3$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $fn4$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$fn4$;


-- ============================================================
-- WERYFIKACJA - uruchom KAZDE ZAPYTANIE OSOBNO
-- ============================================================

-- a) RLS musi byc wlaczony na kazdej tabeli (rowsecurity = true)
-- SELECT tablename, rowsecurity
--   FROM pg_tables
--  WHERE schemaname = 'public'
--  ORDER BY tablename;

-- b) Lista dodanych ograniczen (oczekiwane: 23 wiersze)
-- SELECT conrelid::regclass AS tabela, conname AS ograniczenie, convalidated AS zwalidowane
--   FROM pg_constraint
--  WHERE conname LIKE 'chk_%'
--  ORDER BY 1, 2;

-- c) Funkcje SECURITY DEFINER musza miec przypiety search_path
-- SELECT p.proname AS funkcja, p.prosecdef AS security_definer, p.proconfig AS konfiguracja
--   FROM pg_proc p
--   JOIN pg_namespace n ON n.oid = p.pronamespace
--  WHERE n.nspname = 'public' AND p.prosecdef
--  ORDER BY 1;

-- ============================================================
-- GOTOWE.
-- ============================================================
