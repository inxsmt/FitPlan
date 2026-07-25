// Plany żywieniowe — makroskładniki przeliczone na podstawie polskich tabel
// wartości odżywczej żywności (IŻŻ / Kunachowicz i wsp.). Wartości referencyjne
// na 100 g produktu (surowe/suche o ile nie zaznaczono inaczej):
//   płatki owsiane 370/12/62/7 · ryż biały suchy 349/7/79/1 · kasza gryczana sucha 336/12,6/70/3
//   makaron pełnoziarnisty suchy 340/12/66/2,5 · chleb żytni razowy 223/6,5/43/1,7
//   pierś z kurczaka surowa 99/21,5/0/1,3 · pierś z indyka surowa 84/19,2/0/0,7
//   wołowina mielona chuda surowa 137/21,5/0/5,3 · łosoś 208/20/0/13,6 · dorsz 78/17,7/0/0,7
//   jaja 139/12,5/0,6/9,7 · twaróg półtłusty 133/18,7/3,7/4,7 · twaróg chudy 99/19,8/3,5/0,5
//   skyr 63/11/4/0,2 · mleko 2% 50/3,3/4,8/2 · odżywka białkowa 375/80/8/6 · ser żółty 350/25/0/27
//   oliwa 884/0/0/100 · masło orzechowe 588/25/12/50 · orzechy włoskie 654/15/14/65
//   banan 95/1/23/0,3 · miód 324/0/80/0 · bataty 86/1,6/20/0,1 · ziemniaki got. 77/2/17/0,1

export const diets = [
  {
    id: '2000',
    calories: 2000,
    label: '2000 kcal',
    goal: 'Redukcja tkanki tłuszczowej',
    description: 'Dieta na deficycie oparta o chude źródła białka (ryby, indyk, twaróg, jaja) i dużą ilość warzyw. Najwyższa podaż białka na kg chroni mięśnie podczas odchudzania, a mniej węglowodanów ułatwia utrzymanie deficytu.',
    bodyWeight: 80,
    macros: { protein: 186, carbs: 202, fat: 56 },
    perKg: { protein: 2.3, carbs: 2.5, fat: 0.7 },
    meals: [
      {
        name: 'Śniadanie',
        time: '7:00',
        items: [
          'Jaja (3 szt. / 150g)',
          'Płatki owsiane (40g)',
          'Borówki (80g)',
          'Szczypta soli i pieprzu',
        ],
        macros: { calories: 400, protein: 24, carbs: 37, fat: 18 },
      },
      {
        name: 'II Śniadanie',
        time: '10:30',
        items: [
          'Skyr naturalny (200g)',
          'Orzechy włoskie (15g)',
          'Jabłko (150g)',
        ],
        macros: { calories: 300, protein: 25, carbs: 31, fat: 10 },
      },
      {
        name: 'Obiad',
        time: '14:00',
        items: [
          'Pierś z indyka (surowa, 220g)',
          'Kasza gryczana sucha (60g)',
          'Brokuły + marchew + papryka (200g)',
          'Oliwa z oliwek (1 łyżka / 10g)',
        ],
        macros: { calories: 530, protein: 55, carbs: 52, fat: 14 },
      },
      {
        name: 'Przekąska przed treningiem',
        time: '16:30',
        items: [
          'Twaróg chudy (180g)',
          'Wafle ryżowe (3 szt.)',
          'Banan (80g)',
        ],
        macros: { calories: 355, protein: 39, carbs: 47, fat: 2 },
      },
      {
        name: 'Kolacja',
        time: '19:30',
        items: [
          'Dorsz (surowy, 220g)',
          'Bataty (150g)',
          'Sałatka (mix sałat, pomidor, ogórek)',
          'Oliwa z oliwek (1 łyżka / 10g)',
        ],
        macros: { calories: 420, protein: 43, carbs: 35, fat: 12 },
      },
    ],
  },
  {
    id: '2500',
    calories: 2500,
    label: '2500 kcal',
    goal: 'Utrzymanie masy / rekompozycja',
    description: 'Zbilansowana dieta na klasycznych produktach: owsianka, kanapki żytnie, makaron z wołowiną. Umiarkowane białko i średnia ilość węglowodanów utrzymują masę mięśniową i dobrą energię na treningach.',
    bodyWeight: 80,
    macros: { protein: 166, carbs: 298, fat: 63 },
    perKg: { protein: 2.1, carbs: 3.7, fat: 0.8 },
    meals: [
      {
        name: 'Śniadanie',
        time: '7:00',
        items: [
          'Płatki owsiane (80g)',
          'Odżywka białkowa (30g)',
          'Mleko 2% (200ml)',
          'Banan (120g)',
          'Masło orzechowe (15g)',
        ],
        macros: { calories: 710, protein: 45, carbs: 91, fat: 19 },
      },
      {
        name: 'II Śniadanie',
        time: '10:30',
        items: [
          'Chleb żytni razowy (100g / 2–3 kromki)',
          'Pierś z kurczaka gotowana (60g)',
          'Ser żółty (20g)',
          'Pomidor + ogórek',
        ],
        macros: { calories: 395, protein: 30, carbs: 46, fat: 9 },
      },
      {
        name: 'Obiad',
        time: '14:00',
        items: [
          'Makaron pełnoziarnisty suchy (100g)',
          'Wołowina mielona chuda (surowa, 120g)',
          'Passata pomidorowa (150g)',
          'Oliwa z oliwek (1 łyżka / 10g)',
          'Parmezan (10g)',
        ],
        macros: { calories: 675, protein: 43, carbs: 74, fat: 22 },
      },
      {
        name: 'Posiłek przed treningiem',
        time: '16:30',
        items: [
          'Ryż biały suchy (70g)',
          'Pierś z kurczaka (surowa, 80g)',
          'Papryka + cukinia (150g)',
          'Oliwa z oliwek (1 łyżeczka / 5g)',
        ],
        macros: { calories: 410, protein: 25, carbs: 62, fat: 7 },
      },
      {
        name: 'Kolacja',
        time: '20:00',
        items: [
          'Twaróg półtłusty (100g)',
          'Chleb żytni (40g)',
          'Pomidor + rzodkiewka + szczypiorek',
        ],
        macros: { calories: 245, protein: 23, carbs: 25, fat: 6 },
      },
    ],
  },
  {
    id: '3000',
    calories: 3000,
    label: '3000 kcal',
    goal: 'Budowanie masy mięśniowej',
    description: 'Dieta na nadwyżce z bardzo wysoką podażą węglowodanów (5g/kg) na energię i regenerację. Kaloryczne posiłki, shake masowy po treningu i zdrowe tłuszcze z orzechów, oliwy i łososia pomagają wypracować dodatkowe kalorie.',
    bodyWeight: 80,
    macros: { protein: 161, carbs: 415, fat: 88 },
    perKg: { protein: 2.0, carbs: 5.2, fat: 1.1 },
    meals: [
      {
        name: 'Śniadanie',
        time: '7:00',
        items: [
          'Płatki owsiane (100g)',
          'Mleko 2% (250ml)',
          'Banan (120g)',
          'Miód (20g)',
          'Orzechy włoskie (10g)',
        ],
        macros: { calories: 740, protein: 23, carbs: 119, fat: 19 },
      },
      {
        name: 'II Śniadanie',
        time: '10:30',
        items: [
          'Chleb żytni razowy (120g)',
          'Jaja (2 szt. / 100g)',
          'Awokado (50g)',
          'Pomidor',
        ],
        macros: { calories: 505, protein: 22, carbs: 60, fat: 19 },
      },
      {
        name: 'Obiad',
        time: '14:00',
        items: [
          'Makaron pełnoziarnisty suchy (110g)',
          'Pierś z kurczaka (surowa, 110g)',
          'Passata pomidorowa (150g)',
          'Oliwa z oliwek (1 łyżka / 10g)',
          'Parmezan (10g)',
        ],
        macros: { calories: 655, protein: 43, carbs: 81, fat: 16 },
      },
      {
        name: 'Shake potreningowy',
        time: '17:00',
        items: [
          'Odżywka białkowa (30g)',
          'Banan (150g)',
          'Płatki owsiane (40g)',
          'Mleko 2% (250ml)',
          'Miód (15g)',
        ],
        macros: { calories: 575, protein: 40, carbs: 85, fat: 11 },
      },
      {
        name: 'Kolacja',
        time: '20:00',
        items: [
          'Ryż biały suchy (80g)',
          'Łosoś (surowy, 120g)',
          'Brokuły + marchew (150g)',
          'Oliwa z oliwek (1 łyżeczka / 5g)',
        ],
        macros: { calories: 615, protein: 33, carbs: 70, fat: 23 },
      },
    ],
  },
]
