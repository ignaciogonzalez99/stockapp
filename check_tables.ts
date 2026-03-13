import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        // Query to list all tables in the public schema
        const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
        console.log('Tables in database:', tables)
    } catch (e) {
        console.error('Error querying database:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
