import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Updating Body Treatments service images...\n')

  // Update Body Wrap
  await prisma.service.updateMany({
    where: {
      slug: 'body-wrap'
    },
    data: {
      imageUrl: 'Beauty Salon/services/body-wrap_yo0eox'
    }
  })
  console.log('✅ Updated Body Wrap image')

  // Update Body Scrub
  await prisma.service.updateMany({
    where: {
      slug: 'body-scrub'
    },
    data: {
      imageUrl: 'Beauty Salon/services/body-scrub_als75s'
    }
  })
  console.log('✅ Updated Body Scrub image')

  // Update Waxing Full Legs
  await prisma.service.updateMany({
    where: {
      slug: 'waxing-full-legs'
    },
    data: {
      imageUrl: 'Beauty Salon/services/waxing-full-legs_hv4lbq'
    }
  })
  console.log('✅ Updated Waxing Full Legs image')

  console.log('\n✅ All Body Treatments images updated successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
