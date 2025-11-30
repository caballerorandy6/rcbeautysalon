import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Updating Massage Therapy images...\n')

  // Update Deep Tissue Massage
  await prisma.service.updateMany({
    where: {
      slug: 'deep-tissue-massage'
    },
    data: {
      imageUrl: 'Beauty Salon/services/deep-tissue-massage_tf24iu'
    }
  })
  console.log('✅ Updated Deep Tissue Massage image')

  // Update Hot Stone Massage
  await prisma.service.updateMany({
    where: {
      slug: 'hot-stone-massage'
    },
    data: {
      imageUrl: 'Beauty Salon/services/hot-stone-massage_krxtkc'
    }
  })
  console.log('✅ Updated Hot Stone Massage image')

  // Update Swedish Massage
  await prisma.service.updateMany({
    where: {
      slug: 'swedish-massage'
    },
    data: {
      imageUrl: 'Beauty Salon/services/swedish-massage_degn1f'
    }
  })
  console.log('✅ Updated Swedish Massage image')

  console.log('\n✅ All Massage Therapy images updated successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
