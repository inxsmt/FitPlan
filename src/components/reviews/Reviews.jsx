import { useState, useEffect } from 'react'
import { Star, Send, MessageSquareText, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { Card } from '../ui/Card'

const StarInput = ({ value, onChange, size = 30 }) => {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
          aria-label={`Oceń na ${n}`}
        >
          <Star
            size={size}
            className={(hover || value) >= n ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}
          />
        </button>
      ))}
    </div>
  )
}

const StarDisplay = ({ value, size = 16 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={size}
        className={value >= n ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}
      />
    ))}
  </div>
)

export const Reviews = () => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('app_reviews')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) {
      setReviews(data || [])
      const mine = (data || []).find((r) => r.user_id === user?.id)
      if (mine) {
        setRating(mine.rating)
        setComment(mine.comment || '')
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const myReview = reviews.find((r) => r.user_id === user?.id)
  const count = reviews.length
  const avg = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    n: reviews.filter((r) => r.rating === star).length,
  }))

  const handleSubmit = async () => {
    if (!rating) {
      setError('Wybierz ocenę — od 1 do 5 gwiazdek.')
      return
    }
    setSubmitting(true)
    setError('')
    // author_name i updated_at ustawia trigger w bazie (set_review_author),
    // zeby nie dalo sie podpisac opinii cudza nazwa ani sfalszowac daty.
    const { error } = await supabase.from('app_reviews').upsert(
      {
        user_id: user.id,
        rating,
        comment: comment.trim().slice(0, 500) || null,
      },
      { onConflict: 'user_id' }
    )
    setSubmitting(false)
    if (error) {
      setError('Nie udało się zapisać opinii. Spróbuj ponownie.')
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    fetchReviews()
  }

  const handleDelete = async () => {
    if (!myReview) return
    const { error } = await supabase.from('app_reviews').delete().eq('user_id', user.id)
    if (!error) {
      setRating(0)
      setComment('')
      fetchReviews()
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-1">Oceń aplikację</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Twoja opinia pomaga rozwijać FitPlan — i jest widoczna dla innych użytkowników
        </p>
      </div>

      {/* Podsumowanie ocen */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="text-center sm:border-r sm:border-slate-200 dark:sm:border-dark-border sm:pr-6">
            <p className="text-5xl font-bold text-amber-500 leading-none mb-1">
              {count ? avg.toFixed(1) : '—'}
            </p>
            <div className="flex justify-center mb-1">
              <StarDisplay value={Math.round(avg)} size={18} />
            </div>
            <p className="text-xs text-slate-500">
              {count} {count === 1 ? 'ocena' : count >= 2 && count <= 4 ? 'oceny' : 'ocen'}
            </p>
          </div>
          <div className="flex-1 space-y-1.5">
            {distribution.map(({ star, n }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-slate-500">{star}</span>
                <Star size={12} className="fill-amber-400 text-amber-400 shrink-0" />
                <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: count ? `${(n / count) * 100}%` : '0%' }}
                  />
                </div>
                <span className="w-6 text-right text-slate-400">{n}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Formularz oceny */}
      <Card title={myReview ? 'Twoja ocena' : 'Wystaw ocenę'} icon={Star}>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500 mb-2">Jak oceniasz FitPlan?</p>
            <StarInput value={rating} onChange={(n) => { setRating(n); setError('') }} />
          </div>

          <div>
            <label className="label">Komentarz (opcjonalnie)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Co Ci się podoba, czego brakuje, co poprawić?"
              className="input-field resize-none"
            />
            <p className="text-xs text-slate-400 mt-1 text-right">{comment.length}/500</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition disabled:opacity-60"
            >
              <Send size={16} />
              {submitting ? 'Zapisywanie...' : saved ? 'Zapisano!' : myReview ? 'Zaktualizuj ocenę' : 'Wyślij ocenę'}
            </button>
            {myReview && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold transition"
              >
                <Trash2 size={15} /> Usuń
              </button>
            )}
          </div>
          {myReview && (
            <p className="text-xs text-slate-400">
              Twoja opinia jest już widoczna na liście poniżej. Możesz ją w każdej chwili zmienić lub usunąć.
            </p>
          )}
        </div>
      </Card>

      {/* Lista opinii */}
      <Card title="Opinie użytkowników" icon={MessageSquareText} subtitle={`${count} ${count === 1 ? 'opinia' : 'opinii'}`}>
        {loading ? (
          <p className="text-slate-500 text-center py-6">Ładowanie...</p>
        ) : count === 0 ? (
          <p className="text-slate-500 text-center py-6">
            Jeszcze nikt nie ocenił aplikacji. Bądź pierwszy!
          </p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className={`p-4 rounded-xl border ${
                  r.user_id === user?.id
                    ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-dark-border'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {(r.author_name || 'U').slice(0, 1).toUpperCase()}
                    </div>
                    <span className="font-semibold text-sm">
                      {r.author_name || 'Użytkownik'}
                      {r.user_id === user?.id && (
                        <span className="ml-1.5 text-xs font-normal text-brand-600 dark:text-brand-400">(Ty)</span>
                      )}
                    </span>
                  </div>
                  <StarDisplay value={r.rating} size={14} />
                </div>
                {r.comment && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-10">{r.comment}</p>
                )}
                <p className="text-xs text-slate-400 mt-1.5 pl-10">
                  {new Date(r.created_at).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
