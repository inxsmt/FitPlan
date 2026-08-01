-- ============================================================
-- ZGODA NA UDZIAL W PROJEKCIE (RODO)
--
-- Uruchom w Supabase: SQL Editor -> New query -> Run.
-- Skrypt jest idempotentny - mozna go puscic wielokrotnie.
--
-- Dodaje:
--   1. Kolumne profiles.presentation_consent_at (znacznik czasu zgody)
--   2. Trigger pilnujacy, ze daty zgody nie da sie sfalszowac z klienta
--   3. Obsluge zgody w handle_new_user() - przenosi ja z formularza
--      rejestracji do profilu
--
-- NULL w presentation_consent_at = brak zgody.
-- Data                            = zgoda udzielona wtedy i wtedy.
-- Przechowujemy date, a nie TRUE/FALSE, bo w razie pytania trzeba
-- wykazac nie tylko fakt zgody, ale i moment jej udzielenia.
-- ============================================================


-- ============================================================
-- CZESC 1 - KOLUMNA
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS presentation_consent_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN public.profiles.presentation_consent_at IS
  'Data udzielenia dobrowolnej zgody na wykorzystanie danych konta w prezentacji projektu. NULL = brak zgody.';


-- ============================================================
-- CZESC 2 - DATA ZGODY USTAWIANA PRZEZ BAZE
--
-- Klucz anon jest publiczny, wiec klient moze wyslac dowolna wartosc
-- wprost do REST API. Gdyby date przyjmowac bez kontroli, mozna by
-- wpisac zgode z przeszlosci - a to wlasnie ta data ma byc dowodem.
-- Ten sam wzorzec co set_review_author() w supabase-hardening.sql.
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_consent_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
BEGIN
  IF NEW.presentation_consent_at IS NULL THEN
    -- Wycofanie zgody (albo jej brak) - zostawiamy NULL.
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' OR OLD.presentation_consent_at IS NULL THEN
    -- Zgoda wlasnie udzielona - baza sama stempluje aktualnym czasem.
    NEW.presentation_consent_at := NOW();
  ELSE
    -- Zgoda juz byla - pierwotnej daty nie wolno nadpisac.
    NEW.presentation_consent_at := OLD.presentation_consent_at;
  END IF;

  RETURN NEW;
END;
$fn$;

DROP TRIGGER IF EXISTS trg_set_consent_timestamp ON public.profiles;
CREATE TRIGGER trg_set_consent_timestamp
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_consent_timestamp();


-- ============================================================
-- CZESC 3 - ZGODA Z FORMULARZA REJESTRACJI
--
-- Rozszerza handle_new_user() z supabase-hardening.sql o odczyt
-- pola presentation_consent przekazywanego w options.data przy signUp().
-- Reszta funkcji bez zmian.
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn3$
DECLARE
  fn      TEXT := NULLIF(TRIM(NEW.raw_user_meta_data ->> 'first_name'), '');
  ln      TEXT := NULLIF(TRIM(NEW.raw_user_meta_data ->> 'last_name'), '');
  consent BOOLEAN := COALESCE(
    (NEW.raw_user_meta_data ->> 'presentation_consent')::BOOLEAN, FALSE
  );
BEGIN
  INSERT INTO public.profiles (
    id, first_name, last_name, initials, target_calories, presentation_consent_at
  )
  VALUES (
    NEW.id,
    LEFT(fn, 50),
    LEFT(ln, 50),
    COALESCE(
      NULLIF(UPPER(LEFT(COALESCE(fn, ''), 1) || LEFT(COALESCE(ln, ''), 1)), ''),
      UPPER(LEFT(split_part(NEW.email, '@', 1), 10)),
      'USR'
    ),
    2000,
    CASE WHEN consent THEN NOW() ELSE NULL END
  );
  RETURN NEW;
END;
$fn3$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- WERYFIKACJA - uruchom osobno po wykonaniu skryptu
-- ============================================================

-- a) Kto zgodzil sie na wykorzystanie danych w prezentacji
-- SELECT p.first_name, p.last_name, u.email, p.presentation_consent_at
--   FROM public.profiles p
--   JOIN auth.users u ON u.id = p.id
--  WHERE p.presentation_consent_at IS NOT NULL
--  ORDER BY p.presentation_consent_at;

-- b) Podsumowanie
-- SELECT COUNT(*) FILTER (WHERE presentation_consent_at IS NOT NULL) AS ze_zgoda,
--        COUNT(*) FILTER (WHERE presentation_consent_at IS NULL)     AS bez_zgody
--   FROM public.profiles;
