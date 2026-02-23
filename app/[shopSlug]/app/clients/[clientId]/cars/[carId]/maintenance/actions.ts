'use server'

import { redirect } from 'next/navigation'
import { db } from '../../../../../../../../lib/db'
import { getSession } from '../../../../../../../../lib/auth'

async function getShopId(shopSlug: string) {
  const shop = await db.shop.findUnique({ where: { slug: shopSlug } })
  return shop?.id ?? null
}

type Result = { ok: false; error: string }

export async function createMaintenanceAction(
  shopSlug: string, clientId: string, carId: string, formData: FormData
): Promise<Result> {
  const session = await getSession()
  if (!session || (session.shopSlug !== shopSlug && session.role !== 'admin')) {
    return { ok: false, error: 'Não autorizado.' }
  }

  const description = (formData.get('description') as string)?.trim()
  const dateRaw = formData.get('date') as string
  const notes = (formData.get('notes') as string)?.trim() || null
  const status = (formData.get('status') as string) === 'closed' ? 'closed' : 'open'

  if (!description || !dateRaw) return { ok: false, error: 'Descrição e data são obrigatórios.' }

  const shopId = await getShopId(shopSlug)
  if (!shopId) return { ok: false, error: 'Oficina não encontrada.' }

  const maintenance = await db.maintenance.create({
    data: {
      description,
      date: new Date(dateRaw),
      notes,
      status,
      carId,
      shopId,
    },
  })

  redirect(`/${shopSlug}/app/clients/${clientId}/cars/${carId}/maintenance/${maintenance.id}`)
}

export async function updateMaintenanceAction(
  shopSlug: string, clientId: string, carId: string, maintenanceId: string, formData: FormData
): Promise<Result> {
  const session = await getSession()
  if (!session || (session.shopSlug !== shopSlug && session.role !== 'admin')) {
    return { ok: false, error: 'Não autorizado.' }
  }

  const description = (formData.get('description') as string)?.trim()
  const dateRaw = formData.get('date') as string
  const notes = (formData.get('notes') as string)?.trim() || null
  const status = (formData.get('status') as string) === 'closed' ? 'closed' : 'open'

  if (!description || !dateRaw) return { ok: false, error: 'Descrição e data são obrigatórios.' }

  const shopId = await getShopId(shopSlug)
  if (!shopId) return { ok: false, error: 'Oficina não encontrada.' }

  await db.maintenance.update({
    where: { id: maintenanceId, shopId },
    data: { description, date: new Date(dateRaw), notes, status },
  })

  redirect(`/${shopSlug}/app/clients/${clientId}/cars/${carId}/maintenance/${maintenanceId}`)
}

export async function deleteMaintenanceAction(
  shopSlug: string, clientId: string, carId: string, maintenanceId: string
) {
  const session = await getSession()
  if (!session || (session.shopSlug !== shopSlug && session.role !== 'admin')) return

  const shopId = await getShopId(shopSlug)
  if (!shopId) return

  await db.maintenanceItem.deleteMany({ where: { maintenanceId } })
  await db.maintenance.delete({ where: { id: maintenanceId, shopId } })

  redirect(`/${shopSlug}/app/clients/${clientId}/cars/${carId}`)
}

export async function addItemAction(
  shopSlug: string, maintenanceId: string, formData: FormData
): Promise<Result> {
  const session = await getSession()
  if (!session || (session.shopSlug !== shopSlug && session.role !== 'admin')) {
    return { ok: false, error: 'Não autorizado.' }
  }

  const description = (formData.get('description') as string)?.trim()
  const quantity = parseFloat(formData.get('quantity') as string)
  const unitPrice = parseFloat(formData.get('unitPrice') as string)

  if (!description || isNaN(quantity) || isNaN(unitPrice)) {
    return { ok: false, error: 'Preencha todos os campos do item.' }
  }
  if (quantity <= 0 || unitPrice < 0) {
    return { ok: false, error: 'Quantidade deve ser positiva e preço não pode ser negativo.' }
  }

  const shopId = await getShopId(shopSlug)
  if (!shopId) return { ok: false, error: 'Oficina não encontrada.' }

  const subtotal = quantity * unitPrice

  await db.maintenanceItem.create({
    data: { description, quantity, unitPrice, subtotal, maintenanceId },
  })

  return { ok: false, error: '' } // trigger will revalidate
}

export async function deleteItemAction(
  shopSlug: string, itemId: string
): Promise<void> {
  const session = await getSession()
  if (!session || (session.shopSlug !== shopSlug && session.role !== 'admin')) return

  await db.maintenanceItem.delete({ where: { id: itemId } })
}
