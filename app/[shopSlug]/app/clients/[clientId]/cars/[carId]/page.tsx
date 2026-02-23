import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '../../../../../../../lib/db'
import { deleteCarAction } from '../actions'

type Props = { params: Promise<{ shopSlug: string; clientId: string; carId: string }> }

export default async function CarDetailPage({ params }: Props) {
  const { shopSlug, clientId, carId } = await params
  const shop = await db.shop.findUnique({ where: { slug: shopSlug } })
  if (!shop) notFound()

  const car = await db.car.findFirst({
    where: { id: carId, shopId: shop.id, clientId },
    include: {
      client: true,
      maintenances: {
        orderBy: { date: 'desc' },
        include: { _count: { select: { items: true } } },
      },
    },
  })
  if (!car) notFound()

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-5 flex-wrap">
        <Link href={`/${shopSlug}/app/clients`} className="hover:text-slate-300 transition-colors">Clientes</Link>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <Link href={`/${shopSlug}/app/clients/${clientId}`} className="hover:text-slate-300 transition-colors">{car.client.name}</Link>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="font-mono text-amber-400/80">{car.plate}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono font-bold tracking-[0.15em] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg uppercase text-base">
              {car.plate}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-2">{car.model}{car.year ? ` · ${car.year}` : ''}</h1>
          {car.notes && <p className="text-slate-500 text-sm italic mt-1">{car.notes}</p>}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/${shopSlug}/app/clients/${clientId}/cars/${carId}/edit`}
            className="flex items-center gap-1.5 border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Editar
          </Link>
          <form
            action={async () => {
              'use server'
              await deleteCarAction(shopSlug, clientId, carId)
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-1.5 border border-red-900 text-red-400 hover:bg-red-950 hover:text-red-300 px-4 py-2 rounded-xl text-sm transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Excluir
            </button>
          </form>
        </div>
      </div>

      {/* Maintenance History */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
          </svg>
          Histórico de Manutenções
        </h2>
        <Link
          href={`/${shopSlug}/app/clients/${clientId}/cars/${carId}/maintenance/new`}
          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 px-3 py-2 rounded-xl text-sm font-bold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nova OS
        </Link>
      </div>

      {car.maintenances.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 border-dashed rounded-2xl py-12 text-center">
          <p className="text-slate-500 text-sm">Nenhuma manutenção registrada para este veículo.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {car.maintenances.map((m) => (
            <Link
              key={m.id}
              href={`/${shopSlug}/app/clients/${clientId}/cars/${carId}/maintenance/${m.id}`}
              className="group flex items-center justify-between bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-2xl px-5 py-4 transition-all hover:shadow-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-100 group-hover:text-white truncate">{m.description}</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {new Date(m.date).toLocaleDateString('pt-BR')}
                  <span className="mx-1.5">·</span>
                  {m._count.items} {m._count.items === 1 ? 'item' : 'itens'}
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  m.status === 'open'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {m.status === 'open' ? 'Aberta' : 'Fechada'}
                </span>
                <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
