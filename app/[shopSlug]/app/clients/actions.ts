'use server'

import { redirect } from 'next/navigation'
import { db } from '../../../../lib/db'
import { getSession } from '../../../../lib/auth'

async function getShopId(shopSlug: string) {
  const shop = await db.shop.findUnique({ where: { slug: shopSlug } })
  return shop?.id ?? null
}

type ClientResult = { ok: false; error: string }

export async function createClientAction(shopSlug: string, formData: FormData): Promise<ClientResult> {
  const session = await getSession()
  if (!session || (session.shopSlug !== shopSlug && session.role !== 'admin')) {
    return { ok: false, error: 'Não autorizado.' }
  }

  const name = (formData.get('name') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim() || null
  const notes = (formData.get('notes') as string)?.trim() || null

  if (!name) return { ok: false, error: 'Nome é obrigatório.' }

  const shopId = await getShopId(shopSlug)
  if (!shopId) return { ok: false, error: 'Oficina não encontrada.' }

  const client = await db.client.create({
    data: { name, phone, notes, shopId },
  })

  redirect(`/${shopSlug}/app/clients/${client.id}`)
}

export async function updateClientAction(shopSlug: string, clientId: string, formData: FormData): Promise<ClientResult> {
  const session = await getSession()
  if (!session || (session.shopSlug !== shopSlug && session.role !== 'admin')) {
    return { ok: false, error: 'Não autorizado.' }
  }

  const name = (formData.get('name') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim() || null
  const notes = (formData.get('notes') as string)?.trim() || null

  if (!name) return { ok: false, error: 'Nome é obrigatório.' }

  const shopId = await getShopId(shopSlug)
  if (!shopId) return { ok: false, error: 'Oficina não encontrada.' }

  await db.client.update({
    where: { id: clientId, shopId },
    data: { name, phone, notes },
  })

  redirect(`/${shopSlug}/app/clients/${clientId}`)
}

export async function deleteClientAction(shopSlug: string, clientId: string) {
  const session = await getSession()
  if (!session || (session.shopSlug !== shopSlug && session.role !== 'admin')) return

  const shopId = await getShopId(shopSlug)
  if (!shopId) return

  // Delete in order: items → maintenances → cars → client
  const maintenances = await db.maintenance.findMany({
    where: { shopId, car: { clientId } },
    select: { id: true },
  })
  const maintenanceIds = maintenances.map((m) => m.id)
  await db.maintenanceItem.deleteMany({ where: { maintenanceId: { in: maintenanceIds } } })
  await db.maintenance.deleteMany({ where: { id: { in: maintenanceIds } } })
  await db.car.deleteMany({ where: { clientId, shopId } })
  await db.client.delete({ where: { id: clientId, shopId } })

  redirect(`/${shopSlug}/app/clients`)
}
