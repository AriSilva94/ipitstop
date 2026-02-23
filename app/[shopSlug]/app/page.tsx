import Link from 'next/link'
import { db } from '../../../lib/db'

type Props = { params: Promise<{ shopSlug: string }> }

export default async function DashboardPage({ params }: Props) {
  const { shopSlug } = await params
  const shop = await db.shop.findUnique({ where: { slug: shopSlug } })
  if (!shop) return null

  const [clientCount, openMaintenanceCount] = await Promise.all([
    db.client.count({ where: { shopId: shop.id } }),
    db.maintenance.count({ where: { shopId: shop.id, status: 'open' } }),
  ])

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Visão geral da sua oficina</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mb-8 sm:mb-10">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl" />
          <div className="w-10 h-10 bg-amber-500/15 border border-amber-500/20 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <p className="text-4xl font-bold text-white">{clientCount}</p>
          <p className="text-slate-400 text-sm mt-1">Clientes Cadastrados</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full blur-xl" />
          <div className="w-10 h-10 bg-orange-500/15 border border-orange-500/20 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <p className="text-4xl font-bold text-white">{openMaintenanceCount}</p>
          <p className="text-slate-400 text-sm mt-1">Ordens de Serviço Abertas</p>
        </div>
      </div>

      {/* Quick access */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Acesso Rápido</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/${shopSlug}/app/clients`}
            className="flex items-center justify-center sm:justify-start gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
            Ver clientes
          </Link>
          <Link
            href={`/${shopSlug}/app/clients/new`}
            className="flex items-center justify-center sm:justify-start gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Novo cliente
          </Link>
        </div>
      </div>
    </div>
  )
}
