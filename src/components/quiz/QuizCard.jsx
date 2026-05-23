import { useState } from 'react'
import { Check, X, ArrowRight, Trophy, RotateCcw } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export const QuizCard = ({ quiz, onBack }) => {
  const { user } = useAuth()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const currentQ = quiz.questions[currentIdx]
  const isLast = currentIdx === quiz.questions.length - 1

  const handleSelect = (optIdx) => {
    if (showFeedback) return
    setSelected(optIdx)
    setShowFeedback(true)
    if (optIdx === currentQ.correct) {
      setScore((s) => s + 1)
    }
  }

  const handleNext = async () => {
    if (isLast) {
      setSaving(true)
      const { error } = await supabase.from('quiz_attempts').insert([
        {
          user_id: user.id,
          quiz_name: quiz.title,
          score: score,
          max_score: quiz.questions.length,
        },
      ])
      setSaving(false)
      if (error) setSaveError(error.message)
      setFinished(true)
    } else {
      setCurrentIdx((i) => i + 1)
      setSelected(null)
      setShowFeedback(false)
    }
  }

  const handleRestart = () => {
    setCurrentIdx(0)
    setSelected(null)
    setShowFeedback(false)
    setScore(0)
    setFinished(false)
    setSaveError(null)
  }

  if (finished) {
    const percentage = Math.round((score / quiz.questions.length) * 100)
    const isGood = percentage >= 70

    return (
      <Card className="max-w-2xl mx-auto text-center animate-fade-in">
        <div className="py-8">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
            isGood
              ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600'
              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
          }`}>
            <Trophy size={48} />
          </div>

          <h2 className="text-3xl font-bold mb-2">
            {isGood ? 'Swietna robota!' : 'Mozesz lepiej!'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Twoj wynik w quizie "{quiz.title}":
          </p>

          <div className="text-6xl font-bold text-brand-600 mb-2">
            {score} / {quiz.questions.length}
          </div>
          <div className="text-xl text-slate-500 mb-6">
            {percentage}% poprawnych
          </div>

          {saving && (
            <p className="text-sm text-slate-500 mb-4">Zapisywanie wyniku...</p>
          )}
          {saveError && (
            <p className="text-sm text-red-500 mb-4">Blad zapisu: {saveError}</p>
          )}
          {!saving && !saveError && (
            <p className="text-sm text-brand-600 mb-6">
              Wynik zapisany w Twojej historii
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleRestart} variant="secondary" icon={RotateCcw}>
              Sprobuj ponownie
            </Button>
            <Button onClick={onBack}>
              Wybierz inny quiz
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>Pytanie {currentIdx + 1} z {quiz.questions.length}</span>
          <span>Wynik: {score}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-brand-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-xl font-bold mb-6">{currentQ.question}</h3>

      <div className="space-y-2 mb-6">
        {currentQ.options.map((opt, idx) => {
          const isSelected = selected === idx
          const isCorrect = idx === currentQ.correct
          const showAsCorrect = showFeedback && isCorrect
          const showAsWrong = showFeedback && isSelected && !isCorrect

          let cls = 'border-slate-300 dark:border-dark-border hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/10'
          if (showAsCorrect) cls = 'border-brand-500 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
          else if (showAsWrong) cls = 'border-red-500 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          else if (showFeedback) cls = 'border-slate-300 dark:border-dark-border opacity-50'

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${cls}`}
            >
              <span>{opt}</span>
              {showAsCorrect && <Check size={20} />}
              {showAsWrong && <X size={20} />}
            </button>
          )
        })}
      </div>

      {showFeedback && (
        <div className={`p-4 rounded-xl mb-4 animate-fade-in ${
          selected === currentQ.correct
            ? 'bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800'
            : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
        }`}>
          <p className="font-semibold mb-1">
            {selected === currentQ.correct ? 'Poprawnie!' : 'Niestety, blad'}
          </p>
          <p className="text-sm">{currentQ.explanation}</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button onClick={onBack} variant="ghost">
          Wroc
        </Button>
        {showFeedback && (
          <Button onClick={handleNext} icon={ArrowRight}>
            {isLast ? 'Zakoncz quiz' : 'Nastepne pytanie'}
          </Button>
        )}
      </div>
    </Card>
  )
}
