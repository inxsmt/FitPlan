-- ============================================================
-- ZGODA NA UDZIAL W PROJEKCIE - WYLACZNIE KONTA DEMONSTRACYJNE
--
-- Uruchom w Supabase: SQL Editor -> New query -> Run.
--
-- Ustawia zgode kontom z domeny example.com, czyli fikcyjnym postaciom
-- utworzonym przez scripts/seed-demo-users.mjs. Dzieki temu na zrzutach
-- ekranu do dokumentacji widac dzialajaca funkcje zgody.
--
-- UWAGA: skrypt CELOWO nie dotyka realnych kont.
-- Kolumna presentation_consent_at przechowuje date i godzine udzielenia
-- zgody. Wpisanie jej osobie, ktora zgody nie wyrazila, tworzy w bazie
-- nieprawdziwy zapis o tej osobie. Realni uzytkownicy zaznaczaja zgode
-- sami - przy rejestracji albo w Ustawieniach profilu.
-- ============================================================


-- 1. SPRAWDZ, czego dotyczy zmiana (same adresy @example.com).
SELECT u.email, p.first_name, p.last_name, p.presentation_consent_at
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.id
 WHERE u.email LIKE '%@example.com'
 ORDER BY u.email;


-- 2. Gdy lista sie zgadza, odkomentuj i uruchom.
--    Trigger set_consent_timestamp() i tak wstawi aktualny czas -
--    NOW() ponizej jest tylko sygnalem "zgoda ma byc niepusta".
-- UPDATE public.profiles p
--    SET presentation_consent_at = NOW()
--   FROM auth.users u
--  WHERE u.id = p.id
--    AND u.email LIKE '%@example.com'
--    AND p.presentation_consent_at IS NULL;


-- 3. Cofniecie (gdyby bylo potrzebne).
-- UPDATE public.profiles p
--    SET presentation_consent_at = NULL
--   FROM auth.users u
--  WHERE u.id = p.id
--    AND u.email LIKE '%@example.com';


-- 4. Kontrola - realne konta musza zostac nietkniete.
-- SELECT u.email LIKE '%@example.com' AS konto_demo,
--        COUNT(*) FILTER (WHERE p.presentation_consent_at IS NOT NULL) AS ze_zgoda,
--        COUNT(*) FILTER (WHERE p.presentation_consent_at IS NULL)     AS bez_zgody
--   FROM public.profiles p
--   JOIN auth.users u ON u.id = p.id
--  GROUP BY 1;
