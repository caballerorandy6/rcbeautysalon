import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Updating Facial & Skin service images...\n')

  // Update Anti-Aging Facial
  await prisma.service.updateMany({
    where: {
      slug: 'anti-aging-facial'
    },
    data: {
      imageUrl: 'Beauty Salon/services/anti-aging-facial_qgusgu'
    }
  })
  console.log('✅ Updated Anti-Aging Facial image')

  // Update Deep Cleansing Facial
  await prisma.service.updateMany({
    where: {
      slug: 'deep-cleansing-facial'
    },
    data: {
      imageUrl: 'Beauty Salon/services/deep-cleansing-facial_jzjp7l'
    }
  })
  console.log('✅ Updated Deep Cleansing Facial image')

  // Update Hydrating Facial
  await prisma.service.updateMany({
    where: {
      slug: 'hydrating-facial'
    },
    data: {
      imageUrl: 'Beauty Salon/services/hydrating-facial_sliwao'
    }
  })
  console.log('✅ Updated Hydrating Facial image')

  console.log('\n✅ All Facial & Skin images updated successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
