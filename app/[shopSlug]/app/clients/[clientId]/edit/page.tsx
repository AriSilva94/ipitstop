import { notFound } from 'next/navigation'
import { db } from '../../../../../../lib/db'
import EditClientForm from './EditClientForm'

type Props = { params: Promise<{ shopSlug: string; clientId: string }> }

export default async function EditClientPage({ params }: Props) {
  const { shopSlug, clientId } = await params
  const shop = await db.shop.findUnique({ where: { slug: shopSlug } })
  if (!shop) notFound()

  const client = await db.client.findFirst({ where: { id: clientId, shopId: shop.id } })
  if (!client) notFound()

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-1">Editar Cliente</h1>
      <p className="text-slate-500 text-sm mb-6">Atualize os dados do cliente.</p>
      <EditClientForm shopSlug={shopSlug} client={client} />
    </div>
  )
}
