# 🥗 FitPlan

Aplikacja webowa do śledzenia diety, obliczania zapotrzebowania kalorycznego (TDEE) oraz edukacji w zakresie dietetyki opartej na dowodach (EBM).

**Projekt edukacyjny – Uniwersytet VIZJA**

## 🚀 Tech Stack

- **Frontend:** Vite + React 18 + Tailwind CSS + Lucide Icons
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Wykresy:** Recharts
- **Routing:** React Router v6

## 📦 Instalacja krok po kroku

### 1. Klonowanie / pobranie projektu

Rozpakuj ZIP do dowolnego folderu i otwórz go w VS Code.

### 2. Instalacja zależności

Otwórz terminal w VS Code (Ctrl + `) i wpisz:

```bash
npm install
```

### 3. Konfiguracja Supabase

1. Wejdź na https://supabase.com i załóż projekt
2. Skopiuj plik `.env.example` jako `.env.local`
3. W Supabase: **Project Settings → API** skopiuj URL i anon key
4. Wklej do `.env.local`:

```env
VITE_SUPABASE_URL=https://twoj-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=twoj-anon-key
```

### 4. Uruchom skrypt SQL

W Supabase Dashboard → **SQL Editor** → wklej zawartość pliku `supabase-schema.sql` → kliknij **Run**.

### 5. Uruchomienie aplikacji

```bash
npm run dev
```

Aplikacja będzie dostępna na **http://localhost:3000**

## 🔧 Komendy

```bash
npm run dev      # Tryb deweloperski
npm run build    # Build produkcyjny do folderu dist/
npm run preview  # Podgląd buildu produkcyjnego
```

## 📁 Struktura projektu

```
fitplan/
├── public/              # Pliki statyczne
├── src/
│   ├── components/      # Komponenty React
│   │   ├── auth/        # Login, Register
│   │   ├── dashboard/   # Dashboard + wykresy
│   │   ├── meals/       # Tracker posiłków
│   │   ├── tdee/        # Kalkulator TDEE
│   │   ├── quiz/        # Moduł quizów EBM
│   │   ├── layout/      # Navbar, Sidebar
│   │   └── ui/          # Button, Input, Card
│   ├── context/         # AuthContext
│   ├── hooks/           # useProfile, useMeals
│   ├── lib/             # supabaseClient
│   ├── utils/           # Funkcje obliczeniowe
│   ├── App.jsx          # Routing
│   └── main.jsx         # Entry point
├── .env.local           # Twoje klucze (NIE COMMITUJ!)
├── supabase-schema.sql  # Schema bazy danych
└── tailwind.config.js
```

## 🎯 Funkcjonalności

- ✅ Rejestracja + logowanie (Supabase Auth)
- ✅ Dashboard z pierścieniowymi wykresami makroskładników
- ✅ Wykres spożycia kalorii z ostatnich 7 dni (Recharts)
- ✅ Kalkulator TDEE (wzór Mifflina-St Jeora + PAL)
- ✅ Tracker posiłków z natychmiastową aktualizacją
- ✅ 4 quizy edukacyjne EBM (20 pytań łącznie)
- ✅ Pełny dark mode + RWD (mobile-first)
- ✅ Row Level Security – każdy widzi tylko swoje dane

## 📚 Licencja

Projekt edukacyjny – Uniwersytet VIZJA. Do swobodnego użytku w celach naukowych.
