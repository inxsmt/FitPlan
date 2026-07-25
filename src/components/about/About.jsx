import { GraduationCap, Code2, Dumbbell, HeartHandshake, Salad, FlaskConical, Sparkles, Rocket, MessageSquare } from 'lucide-react'
import { Card } from '../ui/Card'

const PassionCard = ({ icon: Icon, title, text, color }) => (
  <div className="card h-full">
    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${color} text-white mb-3`}>
      <Icon size={24} />
    </div>
    <h3 className="font-bold text-lg mb-1">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{text}</p>
  </div>
)

export const About = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-1">O autorze</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Kto i po co stworzył FitPlan
        </p>
      </div>

      {/* Hero */}
      <Card className="overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
            <GraduationCap size={44} />
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-semibold">
                <Sparkles size={12} /> Projekt społeczny
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">
                <Rocket size={12} /> Wersja beta
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-0.5">Cześć, nazywam się Marcel Tryniszewski 👋</h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-2">nr albumu 55074</p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Jestem <span className="font-semibold text-slate-800 dark:text-slate-100">studentem III roku dietetyki</span>,
              a na co dzień łączę dwie pasje, które rzadko chodzą w parze — <span className="font-semibold">żywienie człowieka</span> i{' '}
              <span className="font-semibold">programowanie</span>. Do tego trening siłowy, który nauczył mnie, że
              najlepsze efekty daje konsekwencja i dobra wiedza, a nie cudowne diety. FitPlan to miejsce, w którym
              te trzy światy się spotykają.
            </p>
          </div>
        </div>
      </Card>

      {/* Pasje */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PassionCard
          icon={Salad}
          title="Dietetyka"
          color="from-green-500 to-emerald-600"
          text="Studiuję dietetykę i najbardziej kręci mnie żywienie osób aktywnych — jak jedzeniem realnie wspierać trening, regenerację i zdrowie. Bez mitów, w oparciu o badania."
        />
        <PassionCard
          icon={Code2}
          title="Programowanie"
          color="from-blue-500 to-indigo-600"
          text="Kod to moje drugie hobby. Zamiast trzymać wiedzę w notatkach, postanowiłem zamienić ją w narzędzie, z którego mogą korzystać inni — i tak powstał FitPlan."
        />
        <PassionCard
          icon={Dumbbell}
          title="Siłownia"
          color="from-amber-500 to-orange-600"
          text="Trenuję siłowo i wiem, jak trudno na starcie połapać się w kaloriach, makro i suplementach. Chcę, żeby ta apka była tym, czego sam potrzebowałem na początku."
        />
      </div>

      {/* Misja */}
      <Card>
        <div className="flex items-start gap-3 mb-3">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white">
            <HeartHandshake size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Dlaczego robię to za darmo?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">FitPlan jako projekt społeczny</p>
          </div>
        </div>
        <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Rzetelna wiedza o żywieniu nie powinna być towarem luksusowym. W sieci pełno jest sprzecznych porad,
            reklam „cudownych" suplementów i płatnych planów, które często nie mają pokrycia w nauce. Chciałem
            stworzyć coś przeciwnego — <span className="font-semibold text-slate-800 dark:text-slate-100">darmowe,
            proste i uczciwe narzędzie</span>, które pomaga ludziom zapanować nad własnym odżywianiem.
          </p>
          <p>
            FitPlan łączy kalkulator zapotrzebowania, tracker posiłków, bazę przepisów i diet z makrami, quizy oraz
            blog i bazę mikroskładników — wszystko przeliczone na podstawie polskich tabel wartości odżywczej i
            opisane językiem, który zrozumie każdy, nie tylko dietetyk. Jeśli komuś oszczędzi to błędów, które sam
            kiedyś popełniałem, to znaczy, że projekt spełnił swój cel.
          </p>
        </div>
      </Card>

      {/* Wersja beta */}
      <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3 mb-3">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
            <Rocket size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-amber-900 dark:text-amber-200">Aplikacja w wersji beta</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400">Pracuję nad nią na bieżąco</p>
          </div>
        </div>
        <div className="space-y-3 text-amber-900/90 dark:text-amber-100/90 leading-relaxed text-sm">
          <p>
            FitPlan jest obecnie w <span className="font-semibold">wersji beta</span> — to znaczy, że aplikacja
            wciąż się rozwija i będzie <span className="font-semibold">regularnie aktualizowana</span>. Na bieżąco
            poprawiam błędy, które się pojawią, a jeśli coś nie działa tak, jak powinno — traktuję to jako priorytet.
          </p>
          <p className="flex items-start gap-2">
            <MessageSquare size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              Nowe funkcje i usprawnienia będę dodawał <span className="font-semibold">na podstawie opinii
              użytkowników</span> — jeśli masz pomysł, coś Ci przeszkadza albo czegoś brakuje, Twoja opinia
              realnie wpłynie na to, w którą stronę pójdzie FitPlan. Dziękuję, że testujesz apkę na tym etapie! 🙌
            </span>
          </p>
        </div>
      </Card>

      {/* EBM / stopka */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex gap-3">
          <FlaskConical className="text-blue-600 shrink-0" size={20} />
          <div className="text-sm text-blue-900 dark:text-blue-200">
            <p className="font-semibold mb-1">Wiedza oparta na dowodach (EBM)</p>
            <p className="leading-relaxed">
              Treści w aplikacji opieram na aktualnych badaniach i uznanych źródłach (m.in. tabele IŻŻ,
              zalecenia towarzystw naukowych). To projekt edukacyjny stworzony w ramach studiów — nie zastępuje
              indywidualnej konsultacji z dietetykiem czy lekarzem, ale ma dać solidne, uczciwe podstawy do
              samodzielnych, świadomych decyzji.
            </p>
            <p className="mt-2 text-xs text-blue-700/80 dark:text-blue-300/70">
              Autor: Marcel Tryniszewski, nr albumu 55074
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
