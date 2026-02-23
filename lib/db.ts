import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import fs from 'fs'
import path from 'path'

function createClient() {
  const dbUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'
  // Convert "file:./relative/path" to absolute path string for the adapter
  const relativePath = dbUrl.replace(/^file:/, '')
  const absolutePath = path.isAbsolute(relativePath)
    ? relativePath
    : path.join(process.cwd(), relativePath)

  // Vercel filesystem is ephemeral; when DATABASE_URL points to /tmp,
  // bootstrap the DB from the repository seed file if needed.
  if (absolutePath.startsWith('/tmp/')) {
    const needsBootstrap =
      !fs.existsSync(absolutePath) || (fs.existsSync(absolutePath) && fs.statSync(absolutePath).size === 0)

    if (needsBootstrap) {
      const sourceDbPath = path.join(process.cwd(), 'dev.db')
      if (fs.existsSync(sourceDbPath)) {
        fs.mkdirSync(path.dirname(absolutePath), { recursive: true })
        fs.copyFileSync(sourceDbPath, absolutePath)
      }
    }
  }

  const adapter = new PrismaBetterSqlite3({ url: absolutePath })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
