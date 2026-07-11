import { useState, useEffect } from 'react'
import { Trophy, Clock, Apple, Scale, Brain, Zap } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { Card } from '../ui/Card'
import { QuizCard } from './QuizCard'
import { QUIZZES } from './quizData'

const ICONS = {
  basics: Apple,
  macros: Scale,
  supplementation: Zap,
  advanced: Brain,
}

export const QuizModule = () => {
  const { user } = useAuth()
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchHistory = async () => {
    if (!user) return
    const { data } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)
    setHistory(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchHistory()
  }, [user])

  const handleBack = () => {
    setActiveQuiz(null)
    fetchHistory()
  }

  if (activeQuiz) {
    return <QuizCard quiz={activeQuiz} onBack={handleBack} />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-1">Quizy edukacyjne EBM</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Sprawdz swoja wiedze o dietetyce opartej na dowodach naukowych
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QUIZZES.map((quiz) => {
          const Icon = ICONS[quiz.id] || Apple
          const bestScore = history
            .filter((h) => h.quiz_name === quiz.title)
            .reduce((max, h) => Math.max(max, h.score), 0)

          return (
            <button
              key={quiz.id}
              onClick={() => setActiveQuiz(quiz)}
              className="text-left group"
            >
              <div className="card hover:shadow-lg hover:scale-[1.02] transition-all">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${quiz.color} text-white mb-3`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-lg mb-1">{quiz.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  {quiz.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {quiz.questions.length} pytan
                  </span>
                  {bestScore > 0 && (
                    <span className="text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1">
                      <Trophy size={12} />
                      Najlepszy: {bestScore}/{quiz.questions.length}
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <Card title="Twoja historia" icon={Clock} subtitle="Ostatnie 10 prob">
        {loading ? (
          <p className="text-slate-500 text-center py-4">Ladowanie...</p>
        ) : history.length === 0 ? (
          <p className="text-slate-500 text-center py-4">
            Brak rozwiazanych quizow. Rozpocznij pierwszy!
          </p>
        ) : (
          <div className="space-y-2">
            {history.map((h) => {
              const pct = Math.round((h.score / h.max_score) * 100)
              return (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                >
                  <div>
                    <p className="font-medium">{h.quiz_name}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(h.created_at).toLocaleString('pl-PL')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${pct >= 70 ? 'text-brand-600' : 'text-amber-500'}`}>
                      {h.score}/{h.max_score}
                    </p>
                    <p className="text-xs text-slate-500">{pct}%</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
