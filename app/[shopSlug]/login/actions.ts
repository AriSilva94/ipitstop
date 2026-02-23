'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { db } from '../../../lib/db'
import { setSessionCookie } from '../../../lib/auth'

type LoginResult = { ok: false; error: string }

export async function loginAction(shopSlug: string, formData: FormData): Promise<LoginResult> {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { ok: false, error: 'E-mail e senha são obrigatórios.' }
  }

  const shop = await db.shop.findUnique({ where: { slug: shopSlug } })
  if (!shop) {
    return { ok: false, error: 'Oficina não encontrada.' }
  }

  const user = await db.user.findFirst({
    where: { email, shopId: shop.id },
  })

  if (!user) {
    return { ok: false, error: 'Credenciais inválidas.' }
  }

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) {
    return { ok: false, error: 'Credenciais inválidas.' }
  }

  await setSessionCookie({
    userId: user.id,
    shopId: shop.id,
    shopSlug: shop.slug,
    role: user.role as 'admin' | 'owner' | 'collaborator',
  })

  redirect(`/${shopSlug}/app`)
}
