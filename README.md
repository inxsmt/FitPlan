# 🥗 FitPlan

**Aplikacja webowa wspierająca żywienie osób aktywnych fizycznie, oparta na dowodach naukowych (EBM).**

Projekt edukacyjny — Uniwersytet VIZJA
Autor: **Marcel Tryniszewski**, nr albumu 55074, III rok dietetyki

---

## Cel projektu

W internecie dominują sprzeczne porady żywieniowe, reklamy suplementów bez udowodnionego działania i płatne plany diet niemające pokrycia w badaniach. Jednocześnie osoby zaczynające przygodę z treningiem najczęściej nie potrafią samodzielnie oszacować własnego zapotrzebowania energetycznego ani rozłożyć makroskładników.

FitPlan odpowiada na ten problem: łączy **narzędzia obliczeniowe** (zapotrzebowanie, makroskładniki, nawodnienie), **monitorowanie** (dziennik posiłków, masa ciała, samopoczucie) i **edukację** (baza mikroskładników, artykuły, quizy) w jednej, bezpłatnej aplikacji. Każda wartość liczbowa w aplikacji ma źródło w normach żywienia lub publikacjach naukowych — nie w opiniach.

**Grupa docelowa:** osoby trenujące rekreacyjnie i amatorsko, które chcą świadomie zarządzać dietą bez wiedzy dietetycznej na poziomie eksperckim.

---

## Podstawy merytoryczne

Wszystkie wartości odżywcze, normy i zalecenia w aplikacji pochodzą z uznanych źródeł:

| Źródło | Zastosowanie w aplikacji |
|---|---|
| **Normy żywienia dla populacji Polski** (NIZP-PZH, 2020) | Wartości RDA/AI mikroskładników, górne limity spożycia |
| **Tabele wartości odżywczej żywności** (IŻŻ / Kunachowicz i wsp.) | Makroskładniki produktów w bazie lokalnej, przepisach i planach żywieniowych |
| **Wzór Mifflina-St Jeora** | Obliczanie podstawowej przemiany materii (PPM/BMR) |
| **Współczynniki PAL** (WHO/FAO/UNU) | Przeliczenie PPM na całkowitą przemianę materii (CPM/TDEE) |
| **Progi WHR wg WHO** | Ocena ryzyka zdrowotnego związanego z otyłością brzuszną |
| **Skala Bristolska** | Kliniczna ocena konsystencji stolca w dzienniku samopoczucia |
| **Publikacje naukowe** (identyfikatory PMID/PMC) | Artykuły blogowe, uzasadnienia dawek suplementów, pytania quizowe |

---

## Funkcjonalności

### 🧮 Kalkulator zapotrzebowania energetycznego (TDEE)

Podstawowe narzędzie aplikacji. Obliczenia w trzech krokach:

1. **PPM** — wzór Mifflina-St Jeora, z rozróżnieniem na płeć:
   - mężczyźni: `10 × masa + 6,25 × wzrost − 5 × wiek + 5`
   - kobiety: `10 × masa + 6,25 × wzrost − 5 × wiek − 161`
2. **CPM** — PPM przemnożona przez współczynnik aktywności fizycznej (PAL) w 5 stopniach: od 1,2 (tryb siedzący) do 1,9 (sportowiec, dwa treningi dziennie)
3. **Cel kaloryczny** — modyfikacja o ±250 kcal (±0,25 kg/tydz.) lub ±500 kcal (±0,5 kg/tydz.), zgodnie z zaleceniem bezpiecznego tempa zmiany masy ciała

**Rozkład makroskładników** wyliczany automatycznie: białko **1,6 g/kg masy ciała** (dolna granica zakresu rekomendowanego dla osób trenujących siłowo), tłuszcze **25% energii** (zabezpieczenie gospodarki hormonalnej), węglowodany jako pozostała energia. Użytkownik może nadpisać każdą wartość ręcznie — aplikacja pokazuje wtedy na bieżąco przelicznik **g/kg masy ciała** oraz sumę kcal, co pozwala świadomie zweryfikować własny rozkład.

### 📊 Panel główny (dashboard)

- Bilans energetyczny dnia: CPM, cel kaloryczny, spożycie i wynikający z nich **deficyt lub nadwyżka**
- Pierścieniowe wykresy realizacji celu dla białka, węglowodanów i tłuszczów (% i gramy)
- Wykres spożycia kalorii z **ostatnich 7 dni** na tle celu — pozwala ocenić konsekwencję, a nie tylko pojedynczy dzień

### 🍽️ Dziennik posiłków

- Podział na **5 posiłków** (śniadanie, II śniadanie, obiad, przekąska, kolacja) z automatycznym podpowiadaniem posiłku na podstawie pory dnia
- **Wyszukiwarka produktów** działająca dwustopniowo: najpierw przeszukiwana jest lokalna baza **68 podstawowych produktów** opracowana na podstawie polskich tabel IŻŻ (warzywa, owoce, nabiał, mięso i ryby, zboża, strączki i orzechy), a dopiero potem otwarte API Open Food Facts. Dzięki takiej kolejności dla „pomidora" czy „ryżu" użytkownik otrzymuje czystą wartość z tabel, a nie przypadkowy produkt markowy z kodem kreskowym
- Automatyczne przeliczanie makroskładników na wprowadzoną gramaturę
- Kalendarz posiłków z historią i podsumowaniem realizacji celów makro

### 💊 Baza mikroskładników

Najbardziej rozbudowany moduł edukacyjny — **27 witamin, minerałów i kwasów tłuszczowych**, każdy opisany według jednolitego schematu:

- **Norma RDA** z rozróżnieniem dla kobiet i mężczyzn
- **Znaczenie dla osób aktywnych** — dlaczego trening zwiększa zapotrzebowanie lub straty danego składnika
- **Objawy niedoboru** oraz **grupy podwyższonego ryzyka**
- **Źródła pokarmowe** z konkretną zawartością na 100 g
- **Wskazówka praktyczna** dotycząca przyswajalności (np. żelazo niehemowe z witaminą C, unikanie tanin z kawy i herbaty do posiłku)
- **Górny limit spożycia** i ostrzeżenie przed suplementacją „na zapas"
- **Piśmiennictwo** — publikacje i normy, na których oparto opis

Moduł zawiera dwa mechanizmy wykraczające poza zwykłą listę:

**Filtr grup ryzyka** — składniki można przefiltrować pod kątem czterech grup: weganie i wegetarianie, kobiety, intensywnie trenujący, osoby na redukcji. Użytkownik od razu widzi, na co powinien zwrócić uwagę w swojej sytuacji.

**Mapa interakcji** — zaznaczone **synergie i antagonizmy** między składnikami (np. witamina C zwiększa wchłanianie żelaza niehemowego; wapń konkuruje z żelazem o wchłanianie i nie powinien być z nim łączony w jednym posiłku; magnez jest kofaktorem aktywacji witaminy D; nadmiar cynku obniża poziom miedzi). To zagadnienie pomijane w większości aplikacji dietetycznych, a mające realne znaczenie praktyczne przy planowaniu suplementacji.

### 🥘 Przepisy

**12 przepisów** z pełnym rozpisaniem makroskładników, przeliczonych ze składników na podstawie tabel IŻŻ (a nie przepisanych z innych serwisów). Każdy zawiera gramatury, czas przygotowania, liczbę porcji i instrukcję krok po kroku. Filtrowanie po typie posiłku oraz po tagach: wysokobiałkowe, redukcja, masa, wegetariańskie, szybkie.

### 📋 Gotowe plany żywieniowe

**Trzy całodzienne jadłospisy** — 2000, 2500 i 3000 kcal — odpowiadające trzem celom (redukcja tkanki tłuszczowej, utrzymanie masy, budowa masy). Każdy plan zawiera:

- rozpisane posiłki z godzinami i gramaturami, wraz z posiłkiem okołotreningowym
- makroskładniki w gramach **oraz w przeliczeniu na kilogram masy ciała** (g/kg) — kluczowe dla oceny adekwatności podaży białka
- uzasadnienie doboru produktów (np. w wariancie redukcyjnym najwyższa podaż białka na kg chroni masę mięśniową w deficycie)

Nagłówek pliku z danymi zawiera **wartości referencyjne wszystkich użytych produktów**, co pozwala zweryfikować poprawność każdego przeliczenia.

### 💧 Monitorowanie nawodnienia

Dzienny cel wyliczany indywidualnie według **35 ml na kilogram masy ciała** (zamiast powielanego mitu o „2 litrach dla każdego"), zaokrąglany do pełnych 50 ml. Szybkie dodawanie standardowej szklanki (250 ml), pasek postępu i karta z zaleceniami dotyczącymi nawodnienia okołotreningowego.

### ⚖️ Monitorowanie masy ciała i obwodów

- Historia pomiarów masy ciała z wykresem
- **Wskaźnik WHR** (talia/biodra) z automatyczną klasyfikacją ryzyka zdrowotnego według progów WHO, osobnych dla kobiet (<0,80 / 0,80–0,84 / ≥0,85) i mężczyzn (<0,90 / 0,90–0,99 / ≥1,0). WHR uzupełnia samą masę ciała o informację o **rozmieszczeniu tkanki tłuszczowej**, co ma większą wartość prognostyczną niż BMI
- Analiza trendu: kierunek zmiany i **tempo tygodniowe**, liczone wyłącznie gdy między pomiarami minęła co najmniej doba (przy krótszym okresie ekstrapolacja byłaby niemiarodajna)

### 🩺 Dziennik samopoczucia i tolerancji pokarmowej

Moduł o największym znaczeniu klinicznym — pozwala powiązać dietę z reakcją organizmu:

- Ocena **energii, nastroju i jakości snu** w skali punktowej
- **Skala Bristolska** (7 typów) — standardowe narzędzie oceny pracy jelit
- Rejestr **9 objawów** ze strony przewodu pokarmowego i ogólnych (wzdęcia, ból brzucha, zgaga, nudności, zaparcia, biegunka, bóle głowy, zmęczenie, wysypka/świąd skóry)
- **Oś czasu dnia** zestawiająca posiłki z wpisami samopoczucia — narzędzie do wychwytywania zależności między konkretnym posiłkiem a dolegliwością
- **Zestawienie najczęstszych objawów z 30 dni** oraz wykres trendu energii i nastroju z 14 dni

To funkcjonalność zbliżona do dziennika żywieniowego stosowanego przy diagnostyce nietolerancji pokarmowych i diecie eliminacyjnej.

### 🧠 Quizy edukacyjne (EBM)

**4 quizy, łącznie 40 pytań** o rosnącym poziomie trudności:
- *Quiz z bloga FitPlan* — weryfikacja wiedzy z artykułów
- *Jedzenie dla aktywnych* — podstawy: kalorie, białko, węglowodany, tłuszcze
- *Przed i po treningu* — żywienie okołotreningowe
- *Mity żywieniowe — prawda czy fałsz?* — obalanie najpopularniejszych mitów

Każda odpowiedź opatrzona jest wyjaśnieniem merytorycznym. Wyniki podejść są zapisywane, co pozwala śledzić postęp wiedzy.

### 📖 Blog naukowy

**6 artykułów** opartych na publikacjach naukowych, każdy z listą źródeł opatrzonych identyfikatorami PMID/PMC:
- Witamina E a testosteron u osób trenujących
- Magnez i potas a stężenie kortyzolu
- Cynk a kortyzol
- Zapotrzebowanie na białko u sportowców — konkretne wartości
- Suplementacja przedtreningowa cz. 1 (kofeina, cytrulina, beta-alanina)
- Suplementacja przedtreningowa cz. 2 (glicerol, sok z buraka, kapsaicyna)

Artykuły napisane językiem przystępnym dla osoby bez wykształcenia kierunkowego, ale bez uproszczeń zmieniających wymowę badań — z podanymi dawkami, czasem przyjmowania i wielkością spodziewanego efektu.

### ⭐ System opinii i zgłaszanie uwag

Publiczne oceny aplikacji wystawiane przez użytkowników oraz formularz zgłaszania błędów i propozycji funkcji. Autor opinii ustawiany jest po stronie bazy danych (trigger), co uniemożliwia podpisanie się cudzym imieniem.

---

## Ochrona danych osobowych

Aplikacja przetwarza **dane dotyczące zdrowia** (masa ciała, obwody, objawy, dieta), czyli szczególną kategorię danych w rozumieniu art. 9 RODO. Zastosowane rozwiązania:

- **Row Level Security** na poziomie bazy danych — każdy użytkownik ma dostęp wyłącznie do własnych rekordów, niezależnie od tego, co wyśle aplikacja kliencka
- **Klauzula informacyjna** (art. 13 RODO) widoczna przy rejestracji oraz w ustawieniach profilu
- **Zgoda na udział w prezentacji projektu** jako odrębne, dobrowolne pole — domyślnie odznaczone i niewymagane do założenia konta (art. 7 ust. 4 i motyw 32 RODO), możliwe do wycofania w każdej chwili
- Data udzielenia zgody stemplowana **po stronie bazy danych**, a nie przez klienta — dzięki temu stanowi wiarygodny dowód jej udzielenia
- Ograniczenia `CHECK` i limity liczby wpisów na dobę chroniące integralność danych

---

## Stos technologiczny

| Warstwa | Technologia |
|---|---|
| Frontend | React 18 + Vite |
| Style | Tailwind CSS (pełny tryb ciemny, RWD mobile-first) |
| Ikony | Lucide React |
| Wykresy | Recharts |
| Routing | React Router 7 |
| Backend | Supabase — PostgreSQL, uwierzytelnianie, Row Level Security |
| Zewnętrzne API | Open Food Facts (baza produktów spożywczych) |
| Hosting | Vercel |

**Model danych:** 7 tabel — `profiles`, `meal_logs`, `water_logs`, `weight_logs`, `wellbeing_logs`, `quiz_attempts`, `app_reviews`.

---

## Autor

**Marcel Tryniszewski** — nr albumu 55074
Student III roku dietetyki, Uniwersytet VIZJA

Projekt łączy trzy obszary: dietetykę, programowanie i trening siłowy. Powstał jako bezpłatne narzędzie o charakterze społecznym — rzetelna wiedza o żywieniu nie powinna być towarem luksusowym.

**Kontakt:** trynima1545_aeh@students.vizja.pl

---

## Zastrzeżenie

FitPlan jest projektem edukacyjnym. Treści opierają się na aktualnych badaniach i uznanych normach żywienia, ale **nie zastępują indywidualnej konsultacji z dietetykiem ani lekarzem**. Aplikacja nie służy do diagnozowania ani leczenia. Suplementację należy wdrażać wyłącznie na podstawie wyników badań, a nie samodzielnej oceny objawów.

---

*Projekt edukacyjny — Uniwersytet VIZJA. Do swobodnego użytku w celach naukowych.*
