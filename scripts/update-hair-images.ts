import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Updating Hair Services images...\n')

  // Update Balayage
  await prisma.service.updateMany({
    where: {
      slug: 'balayage'
    },
    data: {
      imageUrl: 'Beauty Salon/services/balayage_z1w8xj'
    }
  })
  console.log('✅ Updated Balayage image')

  // Update Classic Haircut
  await prisma.service.updateMany({
    where: {
      slug: 'classic-haircut'
    },
    data: {
      imageUrl: 'Beauty Salon/services/classic-haircut_inzgrp'
    }
  })
  console.log('✅ Updated Classic Haircut image')

  // Update Hair Treatment
  await prisma.service.updateMany({
    where: {
      slug: 'hair-treatment'
    },
    data: {
      imageUrl: 'Beauty Salon/services/hair-treatment_hs60yv'
    }
  })
  console.log('✅ Updated Hair Treatment image')

  // Update Highlights
  await prisma.service.updateMany({
    where: {
      slug: 'highlights'
    },
    data: {
      imageUrl: 'Beauty Salon/services/highlights_mrhaba'
    }
  })
  console.log('✅ Updated Highlights image')

  console.log('\n✅ All Hair Services images updated successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
