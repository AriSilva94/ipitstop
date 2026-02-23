'use server'

import bcrypt from 'bcryptjs'
import { db } from '../../lib/db'

type SignupResult =
  | { ok: true; shopSlug: string; shopName: string }
  | { ok: false; error: string }

export async function signupAction(formData: FormData): Promise<SignupResult> {
  const shopSlug = (formData.get('shopSlug') as string)?.trim().toLowerCase()
  const shopName = (formData.get('shopName') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string

  if (!shopSlug || !shopName || !email || !password) {
    return { ok: false, error: 'Todos os campos são obrigatórios.' }
  }
  if (!/^[a-z0-9-]+$/.test(shopSlug)) {
    return { ok: false, error: 'Slug da oficina: use apenas letras minúsculas, números e hífens.' }
  }
  if (password.length < 6) {
    return { ok: false, error: 'A senha deve ter pelo menos 6 caracteres.' }
  }

  const existing = await db.shop.findUnique({ where: { slug: shopSlug } })
  if (existing) {
    return { ok: false, error: 'Este slug de oficina já está em uso.' }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await db.shop.create({
    data: {
      slug: shopSlug,
      name: shopName,
      users: {
        create: {
          email,
          password: hashedPassword,
          role: 'owner',
        },
      },
    },
  })

  return { ok: true, shopSlug, shopName }
}
