import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '../../../../../lib/db'
import DeleteClientButton from './DeleteClientButton'

type Props = { params: Promise<{ shopSlug: string; clientId: string }> }

export default async function ClientDetailPage({ params }: Props) {
  const { shopSlug, clientId } = await params
  const shop = await db.shop.findUnique({ where: { slug: shopSlug } })
  if (!shop) notFound()

  const client = await db.client.findFirst({
    where: { id: clientId, shopId: shop.id },
    include: {
      cars: {
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { maintenances: true } } },
      },
    },
  })
  if (!client) notFound()

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-5">
        <Link href={`/${shopSlug}/app/clients`} className="hover:text-slate-300 transition-colors">Clientes</Link>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-slate-300">{client.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{client.name}</h1>
          {client.phone && (
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {client.phone}
            </p>
          )}
          {client.notes && (
            <p className="text-slate-500 text-sm mt-1.5 italic">{client.notes}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/${shopSlug}/app/clients/${client.id}/edit`}
            className="flex items-center gap-1.5 border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Editar
          </Link>
          <DeleteClientButton shopSlug={shopSlug} clientId={clientId} />
        </div>
      </div>

      {/* Cars Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
          Veículos
        </h2>
        <Link
          href={`/${shopSlug}/app/clients/${client.id}/cars/new`}
          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 px-3 py-2 rounded-xl text-sm font-bold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Adicionar Veículo
        </Link>
      </div>

      {client.cars.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 border-dashed rounded-2xl py-12 text-center">
          <p className="text-slate-500 text-sm">Nenhum veículo cadastrado para este cliente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {client.cars.map((car) => (
            <Link
              key={car.id}
              href={`/${shopSlug}/app/clients/${client.id}/cars/${car.id}`}
              className="group bg-slate-800 border border-slate-700 hover:border-amber-500/40 rounded-2xl p-5 transition-all hover:shadow-lg hover:shadow-amber-500/5"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="font-mono font-bold text-sm tracking-[0.15em] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg uppercase">
                  {car.plate}
                </span>
                <svg className="w-4 h-4 text-slate-600 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
              <p className="font-semibold text-slate-200 text-sm">{car.model}{car.year ? ` · ${car.year}` : ''}</p>
              <p className="text-xs text-slate-500 mt-2">{car._count.maintenances} OS</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
