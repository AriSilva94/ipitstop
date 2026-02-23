'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClientAction } from '../actions'

const inputClass = "w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5"

export default function NewClientPage() {
  const { shopSlug } = useParams<{ shopSlug: string }>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await createClientAction(shopSlug, formData)
    if (result && !result.ok) {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-1">Novo Cliente</h1>
      <p className="text-slate-500 text-sm mb-6">Preencha os dados do cliente.</p>

      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
        <div>
          <label className={labelClass}>Nome *</label>
          <input name="name" required type="text" placeholder="Nome completo"
            className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Telefone</label>
          <input name="phone" type="tel" placeholder="(11) 99999-9999"
            className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Observações</label>
          <textarea name="notes" rows={3} placeholder="Informações adicionais..."
            className={inputClass} />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button type="submit" disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <a href={`/${shopSlug}/app/clients`}
            className="px-5 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
