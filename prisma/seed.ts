import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Crear configuración del salón
  console.log('Creating salon configuration...')
  const salonConfig = await prisma.salonConfig.upsert({
    where: { id: 'salon_config' },
    update: {},
    create: {
      id: 'salon_config',
      name: 'RC Beauty Salon',
      email: 'info@rcbeautysalon.org',
      phone: '+1 (555) 123-4567',
      address: '123 Beauty Street',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'US',
      timezone: 'America/New_York',
      currency: 'USD',
      locale: 'en',
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      accentColor: '#d4af37',
      bookingDeposit: 50.00,
      depositRefundable: false,
      minBookingAdvance: 24,
      maxBookingAdvance: 30,
      cancellationPolicy: 'Cancellations must be made at least 24 hours in advance. The $50 deposit is non-refundable.',
    },
  })
  console.log('✅ Salon configuration created')

  // 2. Crear usuario admin
  console.log('Creating admin user...')
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rcbeautysalon.org' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@rcbeautysalon.org',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Admin user created (email: admin@rcbeautysalon.org, password: admin123)')

  // 3. Crear categorías
  console.log('Creating categories...')
  const hairCategory = await prisma.category.upsert({
    where: { slug: 'hair' },
    update: {},
    create: {
      name: 'Hair Services',
      slug: 'hair',
    },
  })

  const nailsCategory = await prisma.category.upsert({
    where: { slug: 'nails' },
    update: {},
    create: {
      name: 'Nails',
      slug: 'nails',
    },
  })

  const facialCategory = await prisma.category.upsert({
    where: { slug: 'facial' },
    update: {},
    create: {
      name: 'Facial & Skin',
      slug: 'facial',
    },
  })

  const productsCategory = await prisma.category.upsert({
    where: { slug: 'products' },
    update: {},
    create: {
      name: 'Beauty Products',
      slug: 'products',
    },
  })
  console.log('✅ Categories created')

  // 4. Crear servicios
  console.log('Creating services...')
  const haircut = await prisma.service.create({
    data: {
      name: 'Haircut & Style',
      description: 'Professional haircut with styling',
      duration: 60,
      price: 75.00,
      categoryId: hairCategory.id,
      isActive: true,
    },
  })

  const coloring = await prisma.service.create({
    data: {
      name: 'Hair Coloring',
      description: 'Full hair coloring service',
      duration: 120,
      price: 150.00,
      categoryId: hairCategory.id,
      isActive: true,
    },
  })

  const manicure = await prisma.service.create({
    data: {
      name: 'Manicure',
      description: 'Classic manicure with polish',
      duration: 45,
      price: 35.00,
      categoryId: nailsCategory.id,
      isActive: true,
    },
  })

  const pedicure = await prisma.service.create({
    data: {
      name: 'Pedicure',
      description: 'Relaxing pedicure with massage',
      duration: 60,
      price: 50.00,
      categoryId: nailsCategory.id,
      isActive: true,
    },
  })

  const facial = await prisma.service.create({
    data: {
      name: 'Facial Treatment',
      description: 'Deep cleansing facial',
      duration: 90,
      price: 120.00,
      categoryId: facialCategory.id,
      isActive: true,
    },
  })
  console.log('✅ Services created')

  // 5. Crear staff
  console.log('Creating staff members...')
  const maria = await prisma.staff.create({
    data: {
      name: 'Maria Rodriguez',
      email: 'maria@rcbeautysalon.org',
      phone: '+1 (555) 111-2222',
      bio: 'Expert hair stylist with 10+ years of experience',
      isActive: true,
    },
  })

  const sofia = await prisma.staff.create({
    data: {
      name: 'Sofia Martinez',
      email: 'sofia@rcbeautysalon.org',
      phone: '+1 (555) 333-4444',
      bio: 'Certified nail technician and beauty specialist',
      isActive: true,
    },
  })

  const ana = await prisma.staff.create({
    data: {
      name: 'Ana Garcia',
      email: 'ana@rcbeautysalon.org',
      phone: '+1 (555) 555-6666',
      bio: 'Licensed esthetician specializing in facial treatments',
      isActive: true,
    },
  })
  console.log('✅ Staff members created')

  // 6. Asignar servicios a staff
  console.log('Assigning services to staff...')
  await prisma.staffService.createMany({
    data: [
      // Maria - Hair services
      { staffId: maria.id, serviceId: haircut.id },
      { staffId: maria.id, serviceId: coloring.id },
      // Sofia - Nail services
      { staffId: sofia.id, serviceId: manicure.id },
      { staffId: sofia.id, serviceId: pedicure.id },
      // Ana - Facial services
      { staffId: ana.id, serviceId: facial.id },
    ],
  })
  console.log('✅ Services assigned to staff')

  // 7. Crear horarios de trabajo (Lunes a Viernes, 9am-6pm)
  console.log('Creating working hours...')
  const workingHoursData = []
  const staffMembers = [maria, sofia, ana]

  for (const staff of staffMembers) {
    // Lunes (1) a Viernes (5)
    for (let day = 1; day <= 5; day++) {
      workingHoursData.push({
        staffId: staff.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '18:00',
        isActive: true,
      })
    }
  }

  await prisma.workingHours.createMany({
    data: workingHoursData,
  })
  console.log('✅ Working hours created')

  // 8. Crear productos de ejemplo
  console.log('Creating products...')
  await prisma.product.createMany({
    data: [
      {
        name: 'Premium Shampoo',
        description: 'Professional grade shampoo for all hair types',
        price: 28.00,
        compareAtPrice: 35.00,
        sku: 'SHP-001',
        stockQuantity: 50,
        categoryId: productsCategory.id,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Hair Conditioner',
        description: 'Deep conditioning treatment',
        price: 32.00,
        compareAtPrice: 40.00,
        sku: 'CND-001',
        stockQuantity: 45,
        categoryId: productsCategory.id,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Facial Serum',
        description: 'Anti-aging facial serum with vitamin C',
        price: 65.00,
        compareAtPrice: 80.00,
        sku: 'SRM-001',
        stockQuantity: 30,
        categoryId: productsCategory.id,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Nail Polish Set',
        description: 'Set of 5 premium nail polishes',
        price: 45.00,
        sku: 'NPL-001',
        stockQuantity: 25,
        categoryId: productsCategory.id,
        isActive: true,
        isFeatured: false,
      },
    ],
  })
  console.log('✅ Products created')

  // 9. Crear un cliente de ejemplo
  console.log('Creating sample customer...')
  const customer = await prisma.customer.create({
    data: {
      name: 'Jessica Smith',
      email: 'jessica@example.com',
      phone: '+1 (555) 777-8888',
      notes: 'Prefers morning appointments',
    },
  })
  console.log('✅ Sample customer created')

  console.log('✨ Seeding completed successfully!')
  console.log('\n📋 Summary:')
  console.log(`  - Salon: ${salonConfig.name}`)
  console.log(`  - Admin: ${admin.email} (password: admin123)`)
  console.log(`  - Categories: 4`)
  console.log(`  - Services: 5`)
  console.log(`  - Staff: 3`)
  console.log(`  - Products: 4`)
  console.log(`  - Customers: 1`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
