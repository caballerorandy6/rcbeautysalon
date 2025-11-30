import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const services = await prisma.service.findMany({
    select: {
      name: true,
      imageUrl: true,
    },
    take: 5
  })

  console.log('Services with images:')
  services.forEach(service => {
    console.log(`\n${service.name}:`)
    console.log(`  URL: ${service.imageUrl}`)
    console.log(`  Starts with http: ${service.imageUrl?.startsWith('http')}`)
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
