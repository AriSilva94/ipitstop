'use client'

import { useState } from 'react'
import { updateMaintenanceAction } from '../../actions'

type Maintenance = {
  id: string
  description: string
  date: string
  notes: string | null
  status: 'open' | 'closed'
}

const inputClass = "w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5"

export default function EditMaintenanceForm({
  shopSlug, clientId, carId, maintenance,
}: {
  shopSlug: string
  clientId: string
  carId: string
  maintenance: Maintenance
}) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await updateMaintenanceAction(shopSlug, clientId, carId, maintenance.id, formData)
    if (result && !result.ok) setError(result.error)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
      <div>
        <label className={labelClass}>Descrição *</label>
        <input name="description" required type="text" defaultValue={maintenance.description}
          className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Data *</label>
        <input name="date" required type="date" defaultValue={maintenance.date}
          className={`${inputClass} scheme-dark`} />
      </div>
      <div>
        <label className={labelClass}>Status</label>
        <select name="status" defaultValue={maintenance.status}
          className={`${inputClass} scheme-dark`}>
          <option value="open">Aberta</option>
          <option value="closed">Fechada</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Observações</label>
        <textarea name="notes" rows={3} defaultValue={maintenance.notes ?? ''}
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
        <a href={`/${shopSlug}/app/clients/${clientId}/cars/${carId}/maintenance/${maintenance.id}`}
          className="px-5 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors">
          Cancelar
        </a>
      </div>
    </form>
  )
}
