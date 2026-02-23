'use server'

import { redirect } from 'next/navigation'
import { db } from '../../../../../../lib/db'
import { getSession } from '../../../../../../lib/auth'

async function getShopId(shopSlug: string) {
  const shop = await db.shop.findUnique({ where: { slug: shopSlug } })
  return shop?.id ?? null
}

type CarResult = { ok: false; error: string }

export async function createCarAction(shopSlug: string, clientId: string, formData: FormData): Promise<CarResult> {
  const session = await getSession()
  if (!session || (session.shopSlug !== shopSlug && session.role !== 'admin')) {
    return { ok: false, error: 'Não autorizado.' }
  }

  const plate = (formData.get('plate') as string)?.trim().toUpperCase()
  const model = (formData.get('model') as string)?.trim()
  const yearRaw = formData.get('year') as string
  const year = yearRaw ? parseInt(yearRaw) : null
  const notes = (formData.get('notes') as string)?.trim() || null

  if (!plate || !model) return { ok: false, error: 'Placa e modelo são obrigatórios.' }

  const shopId = await getShopId(shopSlug)
  if (!shopId) return { ok: false, error: 'Oficina não encontrada.' }

  const car = await db.car.create({
    data: { plate, model, year, notes, clientId, shopId },
  })

  redirect(`/${shopSlug}/app/clients/${clientId}/cars/${car.id}`)
}

export async function updateCarAction(shopSlug: string, clientId: string, carId: string, formData: FormData): Promise<CarResult> {
  const session = await getSession()
  if (!session || (session.shopSlug !== shopSlug && session.role !== 'admin')) {
    return { ok: false, error: 'Não autorizado.' }
  }

  const plate = (formData.get('plate') as string)?.trim().toUpperCase()
  const model = (formData.get('model') as string)?.trim()
  const yearRaw = formData.get('year') as string
  const year = yearRaw ? parseInt(yearRaw) : null
  const notes = (formData.get('notes') as string)?.trim() || null

  if (!plate || !model) return { ok: false, error: 'Placa e modelo são obrigatórios.' }

  const shopId = await getShopId(shopSlug)
  if (!shopId) return { ok: false, error: 'Oficina não encontrada.' }

  await db.car.update({
    where: { id: carId, shopId },
    data: { plate, model, year, notes },
  })

  redirect(`/${shopSlug}/app/clients/${clientId}/cars/${carId}`)
}

export async function deleteCarAction(shopSlug: string, clientId: string, carId: string) {
  const session = await getSession()
  if (!session || (session.shopSlug !== shopSlug && session.role !== 'admin')) return

  const shopId = await getShopId(shopSlug)
  if (!shopId) return

  const maintenances = await db.maintenance.findMany({
    where: { carId, shopId },
    select: { id: true },
  })
  const ids = maintenances.map((m) => m.id)
  await db.maintenanceItem.deleteMany({ where: { maintenanceId: { in: ids } } })
  await db.maintenance.deleteMany({ where: { id: { in: ids } } })
  await db.car.delete({ where: { id: carId, shopId } })

  redirect(`/${shopSlug}/app/clients/${clientId}`)
}
