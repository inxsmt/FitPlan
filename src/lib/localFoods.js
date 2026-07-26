// Lokalna baza najczęstszych produktów spożywczych (wartości na 100 g/ml)
// na podstawie polskich tabel wartości odżywczej żywności (IŻŻ / Kunachowicz).
// Przeszukiwana PRZED Open Food Facts — dzięki temu dla podstawowych produktów
// (pomidor, jabłko, ryż, kurczak) użytkownik dostaje czyste, wiarygodne wartości,
// a nie przypadkowe produkty markowe z kodem kreskowym.
// Format: [nazwa, kcal, białko, węgle, tłuszcz, (opcjonalnie aliasy do wyszukiwania)]

const RAW = [
  // Warzywa
  ['Pomidor', 18, 0.9, 3.9, 0.2, 'pomidory'],
  ['Ogórek', 15, 0.7, 3.6, 0.1, 'ogorki'],
  ['Papryka czerwona', 31, 1, 6, 0.3, 'papryka'],
  ['Brokuł', 34, 2.8, 7, 0.4, 'brokuly'],
  ['Marchew', 41, 0.9, 10, 0.2, 'marchewka'],
  ['Cukinia', 17, 1.2, 3.1, 0.3],
  ['Sałata', 15, 1.4, 2.9, 0.2],
  ['Szpinak', 23, 2.9, 3.6, 0.4],
  ['Cebula', 40, 1.1, 9, 0.1],
  ['Ziemniaki gotowane', 77, 2, 17, 0.1, 'ziemniak kartofle'],
  ['Bataty', 86, 1.6, 20, 0.1, 'batat slodkie ziemniaki'],
  ['Kukurydza konserwowa', 90, 3, 19, 1.2, 'kukurydza'],
  ['Pieczarki', 22, 3.1, 3.3, 0.3, 'grzyby'],
  ['Fasolka szparagowa', 31, 1.8, 7, 0.1],

  // Owoce
  ['Banan', 95, 1, 23, 0.3, 'banany'],
  ['Jabłko', 52, 0.3, 14, 0.2, 'jablka'],
  ['Pomarańcza', 47, 0.9, 12, 0.1, 'pomarancza'],
  ['Truskawki', 32, 0.7, 8, 0.3, 'truskawka'],
  ['Borówki', 57, 0.7, 14, 0.3, 'borowki jagody'],
  ['Maliny', 52, 1.2, 12, 0.7, 'malina'],
  ['Winogrona', 69, 0.7, 18, 0.2, 'winogrono'],
  ['Gruszka', 57, 0.4, 15, 0.1, 'gruszki'],
  ['Arbuz', 30, 0.6, 8, 0.2],
  ['Awokado', 160, 2, 9, 15],

  // Nabiał i jaja
  ['Jajko kurze', 139, 12.5, 0.6, 9.7, 'jajka jaja jajo'],
  ['Mleko 2%', 50, 3.3, 4.8, 2, 'mleko'],
  ['Mleko 3,2%', 61, 3.2, 4.7, 3.2],
  ['Jogurt naturalny 2%', 60, 4.3, 6, 2, 'jogurt'],
  ['Jogurt grecki', 115, 5.7, 4, 9],
  ['Skyr naturalny', 63, 11, 4, 0.2, 'skyr jogurt islandzki'],
  ['Kefir', 51, 3.3, 4, 2],
  ['Twaróg chudy', 99, 19.8, 3.5, 0.5, 'twarog serek'],
  ['Twaróg półtłusty', 133, 18.7, 3.7, 4.7, 'twarog serek'],
  ['Ser żółty gouda', 356, 25, 0, 27, 'ser zolty'],
  ['Mozzarella', 253, 18, 1, 20],
  ['Masło', 735, 0.7, 0.7, 82, 'maslo'],

  // Mięso, ryby, wędliny
  ['Pierś z kurczaka (surowa)', 99, 21.5, 0, 1.3, 'kurczak kurczaka filet'],
  ['Pierś z indyka (surowa)', 84, 19.2, 0, 0.7, 'indyk indyka'],
  ['Wołowina mielona chuda (surowa)', 137, 21.5, 0, 5.3, 'wolowina mielone'],
  ['Schab wieprzowy (surowy)', 137, 21, 0, 6, 'wieprzowina schab'],
  ['Łosoś', 208, 20, 0, 13.6, 'losos'],
  ['Dorsz', 78, 17.7, 0, 0.7],
  ['Tuńczyk w sosie własnym', 99, 23.5, 0, 0.5, 'tunczyk'],
  ['Szynka drobiowa', 110, 18, 1, 3.5, 'szynka wedlina'],
  ['Krewetki', 85, 18, 0.9, 1.2],

  // Zboża, pieczywo, makarony (waga sucha dla kasz/ryżu/makaronu)
  ['Ryż biały (suchy)', 349, 7, 79, 1, 'ryz'],
  ['Ryż brązowy (suchy)', 337, 7.5, 72, 2.7, 'ryz brazowy'],
  ['Kasza gryczana (sucha)', 336, 12.6, 70, 3.1, 'kasza gryka'],
  ['Kasza jaglana (sucha)', 346, 10.5, 72, 3.3, 'kasza jaglana'],
  ['Płatki owsiane', 370, 12, 62, 7, 'platki owies owsianka'],
  ['Makaron (suchy)', 360, 12, 72, 1.5, 'makaron'],
  ['Makaron pełnoziarnisty (suchy)', 340, 12, 66, 2.5, 'makaron pelnoziarnisty'],
  ['Komosa ryżowa / quinoa (sucha)', 368, 14, 64, 6, 'quinoa komosa'],
  ['Chleb żytni razowy', 223, 6.5, 43, 1.7, 'chleb pieczywo razowy'],
  ['Chleb pszenny', 250, 8, 49, 2.5, 'chleb pieczywo bulka'],
  ['Tortilla pełnoziarnista', 310, 8, 50, 7, 'tortilla wrap'],

  // Rośliny strączkowe, orzechy, tłuszcze
  ['Soczewica (sucha)', 353, 25, 60, 1, 'soczewica'],
  ['Ciecierzyca (sucha)', 364, 19, 61, 6, 'ciecierzyca'],
  ['Fasola czerwona (sucha)', 333, 23, 60, 1.2, 'fasola'],
  ['Tofu', 144, 15, 1.9, 8.7],
  ['Orzechy włoskie', 654, 15, 14, 65, 'orzechy'],
  ['Migdały', 579, 21, 22, 50, 'migdaly'],
  ['Masło orzechowe', 588, 25, 12, 50, 'maslo orzechowe'],
  ['Oliwa z oliwek', 884, 0, 0, 100, 'oliwa olej'],
  ['Olej rzepakowy', 884, 0, 0, 100, 'olej'],
  ['Miód', 324, 0.3, 80, 0, 'miod'],
  ['Hummus', 230, 8, 15, 16],
  ['Odżywka białkowa (whey)', 375, 80, 8, 6, 'odzywka bialko whey protein'],
]

// Usuwa polskie znaki i sprowadza do małych liter — do wyszukiwania
const strip = (s) =>
  s.toLowerCase()
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

export const LOCAL_FOODS = RAW.map(([name, calories, protein, carbs, fat, aliases]) => ({
  id: `local-${strip(name).replace(/[^a-z0-9]+/g, '-')}`,
  name,
  brand: '',
  source: 'local',
  search: strip(`${name} ${aliases || ''}`),
  per100: { calories, protein, carbs, fat },
}))

/**
 * Wyszukuje w lokalnej bazie (bez znaków diakrytycznych, dopasowanie częściowe).
 */
export const searchLocalFoods = (query) => {
  const q = strip(query.trim())
  if (q.length < 2) return []
  return LOCAL_FOODS
    .map((food) => {
      const idx = food.search.indexOf(q)
      if (idx === -1) return null
      // Nazwa zaczynająca się od frazy = wyżej
      const score = food.search.startsWith(q) ? 0 : idx
      return { food, score }
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score)
    .map((s) => s.food)
}
