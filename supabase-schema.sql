-- ============================================================
-- FITPLAN - Schema bazy danych z RLS
-- Wklej w Supabase Dashboard -> SQL Editor -> RUN
-- ============================================================

-- ============================================================
-- 1. TABELA: profiles
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  initials TEXT,
  age INTEGER CHECK (age > 0 AND age < 150),
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  target_calories INTEGER DEFAULT 2000 CHECK (target_calories > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Uzytkownik widzi wlasny profil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Uzytkownik tworzy wlasny profil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Uzytkownik aktualizuje wlasny profil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Uzytkownik usuwa wlasny profil"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- ============================================================
-- 2. TABELA: meal_logs
-- ============================================================
CREATE TABLE public.meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  meal_name TEXT NOT NULL,
  calories INTEGER NOT NULL CHECK (calories >= 0),
  protein INTEGER NOT NULL DEFAULT 0 CHECK (protein >= 0),
  carbs INTEGER NOT NULL DEFAULT 0 CHECK (carbs >= 0),
  fat INTEGER NOT NULL DEFAULT 0 CHECK (fat >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_meal_logs_user_date ON public.meal_logs(user_id, created_at DESC);

ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Uzytkownik widzi wlasne posilki"
  ON public.meal_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Uzytkownik dodaje wlasne posilki"
  ON public.meal_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Uzytkownik edytuje wlasne posilki"
  ON public.meal_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Uzytkownik usuwa wlasne posilki"
  ON public.meal_logs FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 3. TABELA: quiz_attempts
-- ============================================================
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_name TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0),
  max_score INTEGER NOT NULL CHECK (max_score > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_quiz_attempts_user ON public.quiz_attempts(user_id, created_at DESC);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Uzytkownik widzi wlasne quizy"
  ON public.quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Uzytkownik zapisuje wlasne quizy"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 3b. TABELA: water_logs
-- ============================================================
CREATE TABLE public.water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL CHECK (amount_ml > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_water_logs_user_date ON public.water_logs(user_id, created_at DESC);

ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Uzytkownik widzi wlasne logi wody"
  ON public.water_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Uzytkownik dodaje wlasne logi wody"
  ON public.water_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Uzytkownik usuwa wlasne logi wody"
  ON public.water_logs FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 3c. TABELA: weight_logs
-- ============================================================
CREATE TABLE public.weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  weight_kg NUMERIC(5,1) NOT NULL CHECK (weight_kg > 0),
  waist_cm NUMERIC(5,1) CHECK (waist_cm > 0),
  hips_cm NUMERIC(5,1) CHECK (hips_cm > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_weight_logs_user_date ON public.weight_logs(user_id, created_at DESC);

ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Uzytkownik widzi wlasne logi wagi"
  ON public.weight_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Uzytkownik dodaje wlasne logi wagi"
  ON public.weight_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Uzytkownik usuwa wlasne logi wagi"
  ON public.weight_logs FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 4. TRIGGER: Automatyczne tworzenie profilu po rejestracji
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, initials, target_calories)
  VALUES (
    NEW.id,
    COALESCE(split_part(NEW.email, '@', 1), 'USR'),
    2000
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 5. TRIGGER: Auto-update updated_at w profiles
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 6. MIGRACJA: dodanie obwodow (talia/biodra) do weight_logs
-- Uruchom tylko jesli tabela weight_logs juz istnieje bez tych kolumn
-- ============================================================
ALTER TABLE public.weight_logs ADD COLUMN IF NOT EXISTS waist_cm NUMERIC(5,1) CHECK (waist_cm > 0);
ALTER TABLE public.weight_logs ADD COLUMN IF NOT EXISTS hips_cm NUMERIC(5,1) CHECK (hips_cm > 0);

-- ============================================================
-- GOTOWE! Sprawdz w zakladce Table Editor czy tabele istnieja.
-- ============================================================
