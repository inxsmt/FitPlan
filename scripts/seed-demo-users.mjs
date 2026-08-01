/**
 * Zaklada przykladowe konta demonstracyjne w Supabase.
 *
 * Sluzy do przygotowania zrzutow ekranu do dokumentacji projektu -
 * wszystkie dane sa fikcyjne, wiec nic nie trzeba zamazywac.
 * Domena example.com jest zarezerwowana przez IANA (RFC 2606)
 * i nigdy nie nalezy do zadnej realnej osoby.
 *
 * Uruchomienie:  npm run seed:demo
 *
 * Wymaga wylaczonej opcji "Confirm email" w Supabase
 * (Authentication -> Sign In / Providers), inaczej konta zostana
 * utworzone jako niepotwierdzone i nie da sie na nie zalogowac.
 *
 * Uzywa wylacznie klucza anon - tego samego, ktory i tak jest publiczny
 * w zbudowanym froncie. Zadne klucze serwisowe nie sa potrzebne.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')

// Wspolne haslo dla wszystkich kont demo - konta sa jednorazowe
// i kasowane po zrobieniu zrzutow, wiec nie ma sensu komplikowac.
const DEMO_PASSWORD = 'FitPlanDemo2026!'

const DEMO_USERS = [
  { firstName: 'Jan',      lastName: 'Kowalski',   email: 'jan.kowalski@example.com' },
  { firstName: 'Anna',     lastName: 'Nowak',      email: 'anna.nowak@example.com' },
  { firstName: 'Piotr',    lastName: 'Wisniewski', email: 'piotr.wisniewski@example.com' },
  { firstName: 'Katarzyna', lastName: 'Wojcik',    email: 'katarzyna.wojcik@example.com' },
  { firstName: 'Tomasz',   lastName: 'Kaminski',   email: 'tomasz.kaminski@example.com' },
  { firstName: 'Magdalena', lastName: 'Lewandowska', email: 'magdalena.lewandowska@example.com' },
]

/** Czyta .env bez dodatkowej zaleznosci (dotenv nie jest w projekcie). */
const readEnv = () => {
  let raw
  try {
    raw = readFileSync(join(rootDir, '.env'), 'utf8')
  } catch {
    console.error('Nie znaleziono pliku .env w katalogu projektu.')
    console.error('Skopiuj .env.example do .env i uzupelnij dane projektu Supabase.')
    process.exit(1)
  }

  const env = {}
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/)
    if (!match || line.trimStart().startsWith('#')) continue
    env[match[1]] = match[2].replace(/^['"]|['"]$/g, '')
  }
  return env
}

const env = readEnv()
const url = env.VITE_SUPABASE_URL
const anonKey = env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.error('Brak VITE_SUPABASE_URL lub VITE_SUPABASE_ANON_KEY w pliku .env.')
  process.exit(1)
}

/**
 * Rejestracja przez REST API Supabase Auth zamiast przez @supabase/supabase-js.
 * Biblioteka tworzy przy starcie klienta realtime, ktory na Node 20 wymaga
 * doinstalowania paczki "ws" - dla skryptu pomocniczego to zbedna zaleznosc.
 * Endpoint /auth/v1/signup jest dokladnie tym, ktore wola supabase.auth.signUp().
 */
const signUp = async ({ email, password, firstName, lastName }) => {
  const response = await fetch(`${url}/auth/v1/signup`, {
    method: 'POST',
    headers: { apikey: anonKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      data: { first_name: firstName, last_name: lastName },
    }),
  })

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    return { error: { message: body.msg || body.error_description || body.message || `HTTP ${response.status}` } }
  }
  // Przy wylaczonym potwierdzaniu maila odpowiedz zawiera od razu access_token.
  return { data: { session: body.access_token ? body : null } }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

console.log(`Tworzenie ${DEMO_USERS.length} kont demonstracyjnych...\n`)

let created = 0
let skipped = 0
let failed = 0

for (const user of DEMO_USERS) {
  const { data, error } = await signUp({
    email: user.email,
    password: DEMO_PASSWORD,
    firstName: user.firstName,
    lastName: user.lastName,
  })

  if (error) {
    // Konto o tym adresie juz istnieje - to nie jest blad, tylko ponowne
    // uruchomienie skryptu.
    if (/already registered|already exists/i.test(error.message)) {
      console.log(`  =  ${user.email} - juz istnieje, pomijam`)
      skipped++
    } else {
      console.log(`  !  ${user.email} - ${error.message}`)
      failed++
    }
  } else if (data.session) {
    console.log(`  +  ${user.email} - utworzone (${user.firstName} ${user.lastName})`)
    created++
  } else {
    console.log(`  ?  ${user.email} - utworzone, ale czeka na potwierdzenie mailem`)
    console.log('     Wylacz "Confirm email" w Supabase i usun to konto przed ponowna proba.')
    created++
  }

  // Odstep miedzy zadaniami, zeby nie zahaczyc o limity Supabase.
  await sleep(1000)
}

console.log(`\nGotowe. Utworzone: ${created}, pominiete: ${skipped}, bledy: ${failed}.`)
if (created > 0) {
  console.log(`Haslo do wszystkich kont demo: ${DEMO_PASSWORD}`)
}
