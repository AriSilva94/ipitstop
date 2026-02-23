import Link from 'next/link'
import { db } from '../../../../lib/db'

type Props = {
  params: Promise<{ shopSlug: string }>
  searchParams: Promise<{ q?: string }>
}

export default async function ClientsPage({ params, searchParams }: Props) {
  const { shopSlug } = await params
  const { q } = await searchParams

  const shop = await db.shop.findUnique({ where: { slug: shopSlug } })
  if (!shop) return null

  const clients = await db.client.findMany({
    where: {
      shopId: shop.id,
      OR: q
        ? [
            { name: { contains: q } },
            { phone: { contains: q } },
          ]
        : undefined,
    },
    orderBy: { name: 'asc' },
    include: { _count: { select: { cars: true } } },
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-slate-500 text-sm mt-0.5">{clients.length} {clients.length === 1 ? 'cliente' : 'clientes'}{q ? ` encontrados para "${q}"` : ' cadastrados'}</p>
        </div>
        <Link
          href={`/${shopSlug}/app/clients/new`}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Novo Cliente
        </Link>
      </div>

      {/* Search */}
      <form method="GET" className="mb-5">
        <div className="relative w-full sm:max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            name="q"
            defaultValue={q ?? ''}
            type="text"
            placeholder="Buscar por nome ou telefone..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>
      </form>

      {/* Table / Empty state */}
      {clients.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl py-20 text-center">
          <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <p className="text-slate-400 font-medium">Nenhum cliente encontrado.</p>
          {!q && (
            <Link
              href={`/${shopSlug}/app/clients/new`}
              className="text-amber-500 hover:text-amber-400 text-sm mt-2 inline-block transition-colors"
            >
              Cadastrar primeiro cliente →
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-x-auto">
          <table className="w-full min-w-[36rem] text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nome</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Telefone</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Veículos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/${shopSlug}/app/clients/${client.id}`}
                      className="font-medium text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      {client.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">{client.phone ?? '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                      </svg>
                      {client._count.cars}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
