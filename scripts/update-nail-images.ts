import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Updating Nail Services images...\n')

  // Update Acrylic Nails
  await prisma.service.updateMany({
    where: {
      slug: 'acrylic-nails'
    },
    data: {
      imageUrl: 'Beauty Salon/services/acrylic-nails_jazb10'
    }
  })
  console.log('✅ Updated Acrylic Nails image')

  // Update Gel Manicure
  await prisma.service.updateMany({
    where: {
      slug: 'gel-manicure'
    },
    data: {
      imageUrl: 'Beauty Salon/services/gel-manicure_e7k2gb'
    }
  })
  console.log('✅ Updated Gel Manicure image')

  // Update Spa Pedicure
  await prisma.service.updateMany({
    where: {
      slug: 'spa-pedicure'
    },
    data: {
      imageUrl: 'Beauty Salon/services/spa-pedicure_fpbjgq'
    }
  })
  console.log('✅ Updated Spa Pedicure image')

  console.log('\n✅ All Nail Services images updated successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
