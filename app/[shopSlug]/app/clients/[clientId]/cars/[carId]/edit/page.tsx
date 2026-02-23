import { notFound } from 'next/navigation'
import { db } from '../../../../../../../../lib/db'
import EditCarForm from './EditCarForm'

type Props = { params: Promise<{ shopSlug: string; clientId: string; carId: string }> }

export default async function EditCarPage({ params }: Props) {
  const { shopSlug, clientId, carId } = await params
  const shop = await db.shop.findUnique({ where: { slug: shopSlug } })
  if (!shop) notFound()

  const car = await db.car.findFirst({ where: { id: carId, shopId: shop.id, clientId } })
  if (!car) notFound()

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-1">Editar Veículo</h1>
      <p className="text-slate-500 text-sm mb-6">Atualize os dados do veículo.</p>
      <EditCarForm shopSlug={shopSlug} clientId={clientId} car={car} />
    </div>
  )
}
