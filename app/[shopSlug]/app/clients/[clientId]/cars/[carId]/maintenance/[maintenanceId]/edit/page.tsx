import { notFound } from 'next/navigation'
import { db } from '../../../../../../../../../../lib/db'
import EditMaintenanceForm from './EditMaintenanceForm'

type Props = { params: Promise<{ shopSlug: string; clientId: string; carId: string; maintenanceId: string }> }

export default async function EditMaintenancePage({ params }: Props) {
  const { shopSlug, clientId, carId, maintenanceId } = await params
  const shop = await db.shop.findUnique({ where: { slug: shopSlug } })
  if (!shop) notFound()

  const maintenance = await db.maintenance.findFirst({
    where: { id: maintenanceId, shopId: shop.id, carId },
  })
  if (!maintenance) notFound()

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-bold text-white mb-1">Editar OS</h1>
      <p className="text-slate-500 text-sm mb-6">Atualize os dados da ordem de serviço.</p>
      <EditMaintenanceForm
        shopSlug={shopSlug}
        clientId={clientId}
        carId={carId}
        maintenance={{
          ...maintenance,
          date: maintenance.date.toISOString().split('T')[0],
          status: maintenance.status as 'open' | 'closed',
        }}
      />
    </div>
  )
}
