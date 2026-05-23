/**
 * 4 quizy edukacyjne oparte na Evidence-Based Medicine (EBM)
 * Zrodla: WHO, EFSA, Academy of Nutrition and Dietetics, Cochrane Reviews
 */
export const QUIZZES = [
  {
    id: 'basics',
    title: 'Podstawy dietetyki',
    description: 'Fundamenty zywienia: makroskladniki, kalorie, bilans energetyczny',
    icon: 'BasicIcon',
    color: 'from-green-500 to-emerald-600',
    questions: [
      {
        question: 'Ile kalorii dostarcza 1 gram bialka?',
        options: ['4 kcal', '7 kcal', '9 kcal', '2 kcal'],
        correct: 0,
        explanation: 'Bialko i weglowodany dostarczaja 4 kcal/g, tluszcze 9 kcal/g, alkohol 7 kcal/g (Atwater factors).',
      },
      {
        question: 'Ktory makroskladnik jest najbardziej kaloryczny?',
        options: ['Bialko', 'Weglowodany', 'Tluszcze', 'Blonnik'],
        correct: 2,
        explanation: 'Tluszcze dostarczaja 9 kcal/g - ponad dwukrotnie wiecej niz bialko i weglowodany (po 4 kcal/g).',
      },
      {
        question: 'Co oznacza skrot TDEE?',
        options: [
          'Total Daily Energy Expenditure',
          'Total Diet Energy Equivalent',
          'Test Daily Eating Excess',
          'True Diet Energy Estimate',
        ],
        correct: 0,
        explanation: 'TDEE = Total Daily Energy Expenditure - calkowite dzienne zapotrzebowanie energetyczne.',
      },
      {
        question: 'Jaka jest minimalna zalecana podaz bialka dla osoby doroslej (wg WHO)?',
        options: ['0.4 g/kg masy ciala', '0.8 g/kg masy ciala', '2.0 g/kg masy ciala', '3.5 g/kg masy ciala'],
        correct: 1,
        explanation: 'WHO i EFSA zalecaja minimum 0.8 g bialka/kg masy ciala dziennie dla zdrowej osoby doroslej. Sportowcy moga potrzebowac 1.4-2.0 g/kg.',
      },
      {
        question: 'Aby schudnac 1 kg tkanki tluszczowej, nalezy uzyskac deficyt okolo:',
        options: ['1000 kcal', '3500-7700 kcal', '500 kcal', '15000 kcal'],
        correct: 1,
        explanation: '1 kg tkanki tluszczowej to ok. 7700 kcal energii zmagazynowanej. Bezpieczny deficyt to 500-1000 kcal/dzien.',
      },
    ],
  },
  {
    id: 'macros',
    title: 'Makroskladniki w praktyce',
    description: 'Jak prawidlowo rozkladac bialko, weglowodany i tluszcze',
    icon: 'MacrosIcon',
    color: 'from-blue-500 to-cyan-600',
    questions: [
      {
        question: 'Ktore zrodlo bialka ma najwyzsza wartosc biologiczna (PDCAAS = 1.0)?',
        options: ['Mieso wolowe', 'Bialko serwatkowe (whey)', 'Soja', 'Bialko jaja'],
        correct: 3,
        explanation: 'Bialko jaja kurzego ma PDCAAS = 1.0 i jest wzorcem aminokwasowym. Whey, mleko, kazeina i soja rowniez osiagaja wartosc 1.0.',
      },
      {
        question: 'Jaki procent dziennej energii powinny stanowic tluszcze (zalecenia WHO)?',
        options: ['5-10%', '20-35%', '50-60%', '70-80%'],
        correct: 1,
        explanation: 'WHO zaleca 20-35% energii z tluszczow, z czego < 10% nasycone i < 1% trans.',
      },
      {
        question: 'Jakie sa niezbedne nienasycone kwasy tluszczowe (NNKT)?',
        options: ['Omega-3 i Omega-6', 'Omega-9 i Omega-12', 'Tylko nasycone', 'Trans i nasycone'],
        correct: 0,
        explanation: 'NNKT to kwas alfa-linolenowy (omega-3) i linolowy (omega-6) - organizm nie potrafi ich syntetyzowac.',
      },
      {
        question: 'Indeks glikemiczny (IG) opisuje:',
        options: [
          'Ilosc kalorii w produkcie',
          'Wplyw produktu na poziom glukozy we krwi',
          'Zawartosc bialka',
          'Ilosc blonnika',
        ],
        correct: 1,
        explanation: 'IG to wskaznik szybkosci wzrostu poziomu glukozy po spozyciu produktu, w skali 0-100 wzgledem glukozy.',
      },
      {
        question: 'Ile gramow blonnika dziennie zaleca EFSA dla doroslych?',
        options: ['5 g', '15 g', '25 g', '60 g'],
        correct: 2,
        explanation: 'EFSA zaleca minimum 25 g blonnika dziennie. Polskie normy mowia o 25-40 g/dzien.',
      },
    ],
  },
  {
    id: 'myths',
    title: 'Mity i fakty zywieniowe',
    description: 'Czy detoks dziala? Czy gluten jest szkodliwy? Sprawdz sie!',
    icon: 'MythsIcon',
    color: 'from-purple-500 to-pink-600',
    questions: [
      {
        question: 'Czy "diety detoksykujace" wymagaja wsparcia naukowego?',
        options: [
          'Tak, sa dobrze przebadane',
          'Nie - watroba i nerki same detoksuja organizm',
          'Tylko dla wegan',
          'Tylko po swietach',
        ],
        correct: 1,
        explanation: 'Wedlug przegladu Cochrane i stanowiska American Dietetic Association, nie ma dowodow na skutecznosc "detoksow". Organizm sam usuwa toksyny przez watrobe, nerki i skore.',
      },
      {
        question: 'Czy zdrowi ludzie bez celiakii powinni unikac glutenu?',
        options: [
          'Tak, jest zawsze szkodliwy',
          'Nie - bez wskazan medycznych nie ma korzysci',
          'Tylko kobiety w ciazy',
          'Tylko sportowcy',
        ],
        correct: 1,
        explanation: 'Bez celiakii, NCGS lub alergii na pszenice, dieta bezglutenowa nie przynosi korzysci, a moze prowadzic do niedoborow (American College of Gastroenterology).',
      },
      {
        question: 'Czy "okno anaboliczne" po treningu trwa tylko 30 minut?',
        options: [
          'Tak - musisz zjesc w 30 min',
          'Nie - to mit, okno trwa kilka godzin',
          'Tylko dla bodybuilderow',
          'Tylko rano',
        ],
        correct: 1,
        explanation: 'Metaanalizy (Schoenfeld 2013, ISSN Position Stand) pokazuja, ze okno anaboliczne to 3-6 godzin. Liczy sie calkowite spozycie bialka w ciagu dnia.',
      },
      {
        question: 'Czy jedzenie po 18:00 powoduje przyrost masy?',
        options: [
          'Tak, zawsze',
          'Nie - liczy sie calkowity bilans kaloryczny w ciagu doby',
          'Tylko jesli to slodycze',
          'Tylko u kobiet',
        ],
        correct: 1,
        explanation: 'Bilans kaloryczny w ciagu doby/tygodnia decyduje o masie ciala. Pora posilku ma minimalne znaczenie metaboliczne (Mayo Clinic).',
      },
      {
        question: 'Czy slodziki (np. aspartam) sa bezpieczne w zalecanych dawkach?',
        options: [
          'Nie, wszystkie sa rakotworcze',
          'Tak - dopuszczone przez EFSA i FDA w ADI',
          'Tylko stewia',
          'Tylko dla dzieci',
        ],
        correct: 1,
        explanation: 'EFSA, FDA i WHO uznaja aspartam, sukraloze, acesulfam K za bezpieczne w dopuszczalnym dziennym spozyciu (ADI). Dawka ADI aspartamu to 40 mg/kg masy ciala.',
      },
    ],
  },
  {
    id: 'micronutrients',
    title: 'Witaminy i mikroelementy',
    description: 'Niedobory, suplementacja i zrodla pokarmowe',
    icon: 'MicroIcon',
    color: 'from-amber-500 to-orange-600',
    questions: [
      {
        question: 'Witamina D jest syntezowana w skorze pod wplywem:',
        options: [
          'Promieni UVA',
          'Promieni UVB',
          'Promieni IR',
          'Swiatla ksiezyca',
        ],
        correct: 1,
        explanation: 'UVB (280-315 nm) inicjuje synteze cholekalcyferolu w skorze. W Polsce od pazdziernika do marca synteza jest niewystarczajaca - rekomendowana suplementacja.',
      },
      {
        question: 'Glowne zrodlo witaminy B12 to:',
        options: [
          'Owoce cytrusowe',
          'Lisciaste warzywa',
          'Produkty pochodzenia zwierzecego',
          'Orzechy',
        ],
        correct: 2,
        explanation: 'Wit. B12 (kobalamina) wystepuje praktycznie tylko w produktach zwierzecych. Weganie musza ja suplementowac (zalecenia PTD, Academy of Nutrition).',
      },
      {
        question: 'Niedobor zelaza najczesciej objawia sie:',
        options: [
          'Lysieniem plackowatym',
          'Niedokrwistoscia mikrocytarna',
          'Dna moczanowa',
          'Otyloscia',
        ],
        correct: 1,
        explanation: 'Anemia z niedoboru zelaza (IDA) to najczestszy niedobor na swiecie wg WHO. Charakteryzuje sie malymi (mikrocytarnymi) i bladymi krwinkami.',
      },
      {
        question: 'Witaminy rozpuszczalne w tluszczach to:',
        options: ['B, C', 'A, D, E, K', 'C, B12', 'Tylko D'],
        correct: 1,
        explanation: 'ADEK - witaminy A, D, E, K rozpuszczaja sie w tluszczach i sa magazynowane w watrobie. Wymagaja obecnosci tluszczu do wchlaniania.',
      },
      {
        question: 'Zalecane dzienne spozycie wapnia dla doroslych (EFSA):',
        options: ['200 mg', '500 mg', '950-1000 mg', '5000 mg'],
        correct: 2,
        explanation: 'EFSA zaleca 950-1000 mg wapnia dziennie dla doroslych. Glowne zrodla: nabial, tofu, sardynki, sezam, jarmuz.',
      },
    ],
  },
]
