-- ============================================================
-- USUNIECIE KONT DEMONSTRACYJNYCH
--
-- Uruchom w Supabase: SQL Editor -> New query -> Run.
-- Kasuje wylacznie konta z domeny example.com, czyli te utworzone
-- przez skrypt scripts/seed-demo-users.mjs. Realnych uzytkownikow
-- nie dotyka.
--
-- Klucze obce sa ustawione kaskadowo (auth.users -> profiles -> logi),
-- wiec jedno DELETE usuwa konto razem z profilem, posilkami, waga,
-- woda, samopoczuciem i quizami.
-- ============================================================


-- 1. NAJPIERW SPRAWDZ, co zostanie usuniete.
--    Powinny byc widoczne wylacznie adresy @example.com.
SELECT id, email, created_at
  FROM auth.users
 WHERE email LIKE '%@example.com'
 ORDER BY created_at;


-- 2. Dopiero gdy lista sie zgadza, odkomentuj ponizsze i uruchom.
-- DELETE FROM auth.users
--  WHERE email LIKE '%@example.com';


-- 3. Kontrola po usunieciu - oba zapytania maja zwrocic 0.
-- SELECT COUNT(*) AS pozostale_konta_demo
--   FROM auth.users
--  WHERE email LIKE '%@example.com';
--
-- SELECT COUNT(*) AS osierocone_profile
--   FROM public.profiles p
--   LEFT JOIN auth.users u ON u.id = p.id
--  WHERE u.id IS NULL;
