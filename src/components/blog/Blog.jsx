import { useState } from 'react'
import { ArrowLeft, Clock, Tag } from 'lucide-react'
import { Card } from '../ui/Card'
import { posts } from './blogData'

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })

const renderContent = (content) => {
  return content.split('\n').map((line, i) => {
    if (line.startsWith('## ')) {
      return <h2 key={i} className="text-xl font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="font-semibold mt-3">{line.replace(/\*\*/g, '')}</p>
    }
    if (line.startsWith('- ')) {
      return <li key={i} className="ml-4 text-slate-600 dark:text-slate-400">{line.replace('- ', '')}</li>
    }
    if (line.startsWith('> ')) {
      return (
        <blockquote key={i} className="border-l-4 border-brand-500 pl-4 my-4 text-slate-600 dark:text-slate-400 italic">
          {line.replace('> ', '')}
        </blockquote>
      )
    }
    if (line.trim() === '') return <div key={i} className="h-2" />
    return <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed">{line}</p>
  })
}

export const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null)

  if (selectedPost) {
    return (
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        <button
          onClick={() => setSelectedPost(null)}
          className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold"
        >
          <ArrowLeft size={18} /> Powrot do bloga
        </button>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs bg-brand-100 dark:bg-brand-900/30 text-brand-600 px-2 py-1 rounded-full font-semibold">
              {selectedPost.category}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock size={12} /> {selectedPost.readTime} czytania
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{selectedPost.title}</h1>
          <p className="text-sm text-slate-500 mb-6">{formatDate(selectedPost.date)}</p>
          <div className="prose space-y-1">
            {renderContent(selectedPost.content)}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-1">Blog</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Artykuly oparte na badaniach naukowych — dieta, suplementacja i zdrowie
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="text-left"
          >
            <Card className="h-full hover:border-brand-500 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-brand-100 dark:bg-brand-900/30 text-brand-600 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                  <Tag size={10} /> {post.category}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock size={10} /> {post.readTime}
                </span>
              </div>
              <h2 className="font-bold text-lg mb-2 leading-snug">{post.title}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">{post.excerpt}</p>
              <p className="text-xs text-slate-400">{formatDate(post.date)}</p>
            </Card>
          </button>
        ))}
      </div>
    </div>
  )
}
