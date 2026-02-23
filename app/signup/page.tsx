'use client'

import { useState } from 'react'
import { signupAction } from './actions'

export default function SignupPage() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ shopSlug: string; shopName: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await signupAction(formData)
    setLoading(false)
    if (result.ok) {
      setSuccess({ shopSlug: result.shopSlug, shopName: result.shopName })
    } else {
      setError(result.error)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-125 h-125 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md text-center">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Oficina criada!</h1>
            <p className="text-slate-400 mb-2">
              <span className="text-amber-400 font-semibold">{success.shopName}</span> está pronta para uso.
            </p>
            <p className="text-slate-500 text-sm mb-8">Use o link abaixo para acessar o sistema:</p>

            <a
              href={`/${success.shopSlug}/login`}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-8 py-3 rounded-xl font-bold transition-colors"
            >
              Ir para o login
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>

            <p className="mt-6 text-xs text-slate-600 font-mono break-all">
              {typeof window !== 'undefined' ? window.location.origin : ''}/{success.shopSlug}/login
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-500 rounded-2xl mb-4 shadow-lg shadow-amber-500/20">
            <svg className="w-7 h-7 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">
            iPit<span className="text-amber-500">Stop</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Sistema para Oficinas Mecânicas</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-1">Cadastrar Oficina</h2>
          <p className="text-slate-500 text-sm mb-6">Crie sua conta e comece a usar gratuitamente.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Slug da Oficina
              </label>
              <input
                name="shopSlug"
                type="text"
                placeholder="minha-oficina"
                required
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
              <p className="text-xs text-slate-600 mt-1.5">Apenas letras minúsculas, números e hífens. Ex: oficina-silva</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Nome da Oficina
              </label>
              <input
                name="shopName"
                type="text"
                placeholder="Auto Center Silva"
                required
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                E-mail do Proprietário
              </label>
              <input
                name="email"
                type="email"
                placeholder="voce@email.com"
                required
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Senha
              </label>
              <input
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 py-3 rounded-xl font-bold text-sm transition-colors mt-2"
            >
              {loading ? 'Criando oficina...' : 'Criar Oficina'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-600 mt-5">
          Já tem uma conta?{' '}
          <span className="text-slate-500">Acesse pelo link da sua oficina.</span>
        </p>
      </div>
    </div>
  )
}
