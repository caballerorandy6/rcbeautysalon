import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Simple slugify function
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

async function main() {
  console.log('Fixing service slugs...\n')

  // Get all services
  const services = await prisma.service.findMany({
    select: {
      id: true,
      name: true,
      slug: true
    }
  })

  console.log(`Found ${services.length} services\n`)

  // Update each service with proper slug
  for (const service of services) {
    const newSlug = slugify(service.name)

    if (service.slug !== newSlug) {
      await prisma.service.update({
        where: { id: service.id },
        data: { slug: newSlug }
      })

      console.log(`✅ Updated: "${service.name}"`)
      console.log(`   Old slug: ${service.slug || '(empty)'}`)
      console.log(`   New slug: ${newSlug}\n`)
    } else {
      console.log(`✓ Already correct: "${service.name}" -> ${newSlug}`)
    }
  }

  console.log('\n✅ All service slugs have been fixed!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
