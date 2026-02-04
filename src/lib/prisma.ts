import { env } from '@/env/index.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client'

const globalForPrisma = globalThis as { prisma?: PrismaClient }

function createPrismaClient() {
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
        throw new Error('DATABASE_URL is not set')
    }

    const schema = new URL(databaseUrl).searchParams.get('schema') || 'public'
    const adapter = new PrismaPg({ connectionString: databaseUrl }, { schema })

    return new PrismaClient({
        adapter,
        log: env.NODE_ENV === 'dev' ? ['query'] : [],
    })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}