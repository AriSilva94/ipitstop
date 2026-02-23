import Link from 'next/link'
import { Suspense } from 'react'
import { db } from '../../../../lib/db'
import { notFound } from 'next/navigation'
import SearchInput from './SearchInput'
import DateFilter from './DateFilter'

type Props = {
  params: Promise<{ shopSlug: string }>
  searchParams: Promise<{
    q?: string
    status?: string
    datePreset?: string
    dateFrom?: string
    dateTo?: string
  }>
}

function presetToDateFilter(preset: string): { gte?: Date; lte?: Date } {
  const now = new Date()
  switch (preset) {
    case 'today': {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
      return { gte: start, lte: end }
    }
    case 'week': {
      const d   = new Date(now)
      const day = d.getDay()
      d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
      d.setHours(0, 0, 0, 0)
      return { gte: d }
    }
    case 'month':
      return { gte: new Date(now.getFullYear(), now.getMonth(), 1) }
    case '30d': {
      const d = new Date(now)
      d.setDate(d.getDate() - 30)
      d.setHours(0, 0, 0, 0)
      return { gte: d }
    }
    case '3m': {
      const d = new Date(now)
      d.setMonth(d.getMonth() - 3)
      d.setHours(0, 0, 0, 0)
      return { gte: d }
    }
    case 'year':
      return { gte: new Date(now.getFullYear(), 0, 1) }
    default:
      return {}
  }
}

export default async function MaintenancesPage({ params, searchParams }: Props) {
  const { shopSlug } = await params
  const {
    q          = '',
    status     = 'all',
    datePreset = '',
    dateFrom   = '',
    dateTo     = '',
  } = await searchParams

  const shop = await db.shop.findUnique({ where: { slug: shopSlug } })
  if (!shop) notFound()

  const statusFilter = status === 'open' ? 'open' : status === 'closed' ? 'closed' : undefined

  // Resolve date filter
  let dateFilter: { gte?: Date; lte?: Date } = {}
  if (datePreset && datePreset !== 'all') {
    dateFilter = presetToDateFilter(datePreset)
  } else if (dateFrom || dateTo) {
    if (dateFrom) dateFilter.gte = new Date(dateFrom + 'T00:00:00')
    if (dateTo)   dateFilter.lte = new Date(dateTo   + 'T23:59:59.999')
  }
  const dateWhere = Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {}

  const maintenances = await db.maintenance.findMany({
    where: {
      shopId: shop.id,
      ...(statusFilter ? { status: statusFilter } : {}),
      ...dateWhere,
      ...(q ? {
        OR: [
          { description: { contains: q } },
          { car: { client: { name: { contains: q } } } },
          { car: { plate: { contains: q } } },
          { car: { model: { contains: q } } },
        ],
      } : {}),
    },
    include: {
      car: { include: { client: true } },
      items: true,
    },
    orderBy: { date: 'desc' },
  })

  // Global counts (unaffected by active filters — useful as category totals)
  const counts = await db.maintenance.groupBy({
    by: ['status'],
    where: { shopId: shop.id },
    _count: true,
  })
  const totalOpen   = counts.find((c) => c.status === 'open')?._count   ?? 0
  const totalClosed = counts.find((c) => c.status === 'closed')?._count ?? 0
  const totalAll    = totalOpen + totalClosed

  const tabs = [
    { label: 'Todas',    value: 'all',    count: totalAll    },
    { label: 'Abertas',  value: 'open',   count: totalOpen   },
    { label: 'Fechadas', value: 'closed', count: totalClosed },
  ]

  function tabHref(tabValue: string) {
    const p = new URLSearchParams()
    if (q)                            p.set('q',          q)
    if (tabValue !== 'all')           p.set('status',     tabValue)
    if (datePreset && datePreset !== 'all') p.set('datePreset', datePreset)
    if (dateFrom)                     p.set('dateFrom',   dateFrom)
    if (dateTo)                       p.set('dateTo',     dateTo)
    const qs = p.toString()
    return `/${shopSlug}/app/maintenances${qs ? `?${qs}` : ''}`
  }

  const hasFilters = q || datePreset || dateFrom || dateTo

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Ordens de Serviço</h1>
        <p className="text-slate-500 text-sm mt-1">Histórico de manutenções da oficina</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        {/* Search */}
        <Suspense>
          <SearchInput defaultValue={q} />
        </Suspense>

        {/* Date filter */}
        <Suspense>
          <DateFilter />
        </Suspense>

        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1 flex-shrink-0">
          {tabs.map((tab) => {
            const active = status === tab.value || (tab.value === 'all' && !['open', 'closed'].includes(status))
            return (
              <Link
                key={tab.value}
                href={tabHref(tab.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-foreground text-background'
                    : 'text-text-secondary hover:bg-surface-light hover:text-foreground'
                }`}
              >
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  active
                    ? 'bg-background/15 text-background'
                    : 'bg-surface-light text-text-secondary border border-border'
                }`}>
                  {tab.count}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Result count */}
      {hasFilters && (
        <p className="text-xs text-slate-500 mb-4">
          {maintenances.length} {maintenances.length === 1 ? 'resultado' : 'resultados'} encontrados
        </p>
      )}

      {/* List */}
      {maintenances.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
          </svg>
          <p className="text-sm">Nenhuma ordem encontrada.</p>
          {hasFilters && <p className="text-xs mt-1">Tente ajustar os filtros.</p>}
        </div>
      ) : (
        <div className="space-y-2">
          {maintenances.map((m) => {
            const href    = `/${shopSlug}/app/clients/${m.car.clientId}/cars/${m.carId}/maintenance/${m.id}`
            const dateStr = new Date(m.date).toLocaleDateString('pt-BR', {
              day: '2-digit', month: 'short', year: 'numeric',
            })
            const total  = m.items.reduce((sum, item) => sum + item.subtotal, 0)
            const isOpen = m.status === 'open'

            return (
              <Link
                key={m.id}
                href={href}
                className="flex items-center gap-4 bg-slate-800 border border-slate-700 hover:border-slate-600 hover:bg-slate-800/80 rounded-xl px-5 py-4 transition-all group"
              >
                {/* Status bar */}
                <div className={`w-1 h-10 rounded-full shrink-0 ${isOpen ? 'bg-emerald-500' : 'bg-slate-600'}`} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      isOpen
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                        : 'bg-slate-700/60 text-slate-400 border-slate-600/50'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      {isOpen ? 'Aberta' : 'Fechada'}
                    </span>
                    <span className="text-xs text-slate-500">{dateStr}</span>
                  </div>

                  <p className="text-sm font-semibold text-white truncate leading-snug">{m.description}</p>

                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span className="truncate">{m.car.client.name}</span>
                    <span className="text-slate-700">·</span>
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                    <span className="font-mono tracking-wide">{m.car.plate}</span>
                    <span className="text-slate-700 hidden sm:inline">·</span>
                    <span className="hidden sm:inline truncate">
                      {m.car.model}{m.car.year ? ` (${m.car.year})` : ''}
                    </span>
                  </div>
                </div>

                {/* Right: total + items + arrow */}
                <div className="shrink-0 flex flex-col items-end gap-1 min-w-20">
                  {total > 0 && (
                    <span className="text-sm font-bold text-white">
                      {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  )}
                  {m.items.length > 0 && (
                    <span className="text-xs text-slate-500">
                      {m.items.length} {m.items.length === 1 ? 'item' : 'itens'}
                    </span>
                  )}
                  <svg className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
