'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { addItemAction } from '../actions'

export default function AddItemForm({ shopSlug, maintenanceId }: { shopSlug: string; maintenanceId: string }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await addItemAction(shopSlug, maintenanceId, formData)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      formRef.current?.reset()
      router.refresh()
    }
  }

  const inputClass = "w-full bg-slate-900 border border-slate-600 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
  const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5"

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-12 gap-3 items-end">
      <div className="col-span-5">
        <label className={labelClass}>Descrição *</label>
        <input name="description" required type="text" placeholder="Óleo 5W30, Troca de filtro..."
          className={inputClass} />
      </div>
      <div className="col-span-2">
        <label className={labelClass}>Qtd. *</label>
        <input name="quantity" required type="number" step="0.01" min="0.01" placeholder="1"
          className={inputClass} />
      </div>
      <div className="col-span-3">
        <label className={labelClass}>Vlr. Unit. (R$) *</label>
        <input name="unitPrice" required type="number" step="0.01" min="0" placeholder="0,00"
          className={inputClass} />
      </div>
      <div className="col-span-2">
        <button type="submit" disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 py-2.5 rounded-xl text-sm font-bold transition-colors">
          {loading ? '...' : 'Adicionar'}
        </button>
      </div>
      {error && (
        <p className="col-span-12 text-sm text-red-400">{error}</p>
      )}
    </form>
  )
}
