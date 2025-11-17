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

  // 2. ADMIN USER (solo User, sin perfil adicional)
  console.log('Creating admin user...')
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rcbeautysalon.org' },
    update: {},
    create: {
      name: 'Admin RC Beauty',
      email: 'admin@rcbeautysalon.org',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Admin user created')

  // 3. STAFF USER + STAFF PROFILE (puede hacer login)
  console.log('Creating staff user with profile...')
  const staffPassword = await hash('staff123', 12)
  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@rcbeautysalon.org' },
    update: {},
    create: {
      name: 'Laura Thompson',
      email: 'staff@rcbeautysalon.org',
      password: staffPassword,
      role: 'STAFF',
      emailVerified: new Date(),
    },
  })

  // Crear Staff profile vinculado al User
  const staffProfile = await prisma.staff.upsert({
    where: { userId: staffUser.id },
    update: {},
    create: {
      name: 'Laura Thompson',
      email: 'staff@rcbeautysalon.org',
      phone: '+1 (555) 100-1001',
      bio: 'Staff member with login access to manage appointments',
      userId: staffUser.id,
      isActive: true,
    },
  })
  console.log('✅ Staff user + profile created')

  // 4. CLIENT USER + CUSTOMER PROFILE (puede hacer login)
  console.log('Creating client user with profile...')
  const clientPassword = await hash('cliente123', 12)
  const clientUser = await prisma.user.upsert({
    where: { email: 'cliente@rcbeautysalon.org' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'cliente@rcbeautysalon.org',
      password: clientPassword,
      role: 'CLIENTE',
      emailVerified: new Date(),
    },
  })

  // Crear Customer profile vinculado al User
  const customerProfile = await prisma.customer.upsert({
    where: { userId: clientUser.id },
    update: {},
    create: {
      name: 'John Doe',
      email: 'cliente@rcbeautysalon.org',
      phone: '+1 (555) 200-2002',
      notes: 'Regular customer with account access',
      userId: clientUser.id,
    },
  })
  console.log('✅ Client user + profile created')

  // 5. Crear categorías
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

  // 6. Crear servicios
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

  // 7. STAFF MEMBERS SIN LOGIN (solo trabajan, no acceden al sistema)
  console.log('Creating staff members without login...')
  const maria = await prisma.staff.create({
    data: {
      name: 'Maria Rodriguez',
      email: 'maria@rcbeautysalon.org',
      phone: '+1 (555) 111-2222',
      bio: 'Expert hair stylist with 10+ years of experience',
      userId: null, // NO tiene cuenta de usuario
      isActive: true,
    },
  })

  const sofia = await prisma.staff.create({
    data: {
      name: 'Sofia Martinez',
      email: 'sofia@rcbeautysalon.org',
      phone: '+1 (555) 333-4444',
      bio: 'Certified nail technician and beauty specialist',
      userId: null, // NO tiene cuenta de usuario
      isActive: true,
    },
  })

  const ana = await prisma.staff.create({
    data: {
      name: 'Ana Garcia',
      email: 'ana@rcbeautysalon.org',
      phone: '+1 (555) 555-6666',
      bio: 'Licensed esthetician specializing in facial treatments',
      userId: null, // NO tiene cuenta de usuario
      isActive: true,
    },
  })
  console.log('✅ Staff members (without login) created')

  // 8. Asignar servicios a staff (incluyendo Laura que tiene login)
  console.log('Assigning services to staff...')
  await prisma.staffService.createMany({
    data: [
      // Laura (con login) - All services
      { staffId: staffProfile.id, serviceId: haircut.id },
      { staffId: staffProfile.id, serviceId: manicure.id },
      { staffId: staffProfile.id, serviceId: facial.id },
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

  // 9. Crear horarios de trabajo (Lunes a Viernes, 9am-6pm)
  console.log('Creating working hours...')
  const workingHoursData = []
  const allStaff = [staffProfile, maria, sofia, ana]

  for (const staff of allStaff) {
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

  // 10. Crear productos de ejemplo
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

  // 11. WALK-IN CUSTOMER SIN LOGIN
  console.log('Creating walk-in customers...')
  const walkinCustomer = await prisma.customer.create({
    data: {
      name: 'Jessica Smith',
      email: 'jessica@example.com',
      phone: '+1 (555) 777-8888',
      notes: 'Walk-in customer, prefers morning appointments',
      userId: null, // NO tiene cuenta de usuario
    },
  })
  console.log('✅ Walk-in customer created')

  console.log('\n✨ Seeding completed successfully!')
  console.log('\n📋 Summary:')
  console.log(`  - Salon: ${salonConfig.name}`)
  console.log(`\n👥 Users (can login):`)
  console.log(`  - Admin: ${admin.email} / admin123 (FULL ACCESS)`)
  console.log(`  - Staff: ${staffUser.email} / staff123 (${staffProfile.name})`)
  console.log(`  - Client: ${clientUser.email} / cliente123 (${customerProfile.name})`)
  console.log(`\n👷 Staff Members (work only, no login):`)
  console.log(`  - ${maria.name} (${maria.email})`)
  console.log(`  - ${sofia.name} (${sofia.email})`)
  console.log(`  - ${ana.name} (${ana.email})`)
  console.log(`\n🛍️ Customers:`)
  console.log(`  - ${customerProfile.name} (has account)`)
  console.log(`  - ${walkinCustomer.name} (walk-in, no account)`)
  console.log(`\n📊 Data:`)
  console.log(`  - Categories: 4`)
  console.log(`  - Services: 5`)
  console.log(`  - Total Staff: 4 (1 with login, 3 without)`)
  console.log(`  - Products: 4`)
  console.log(`  - Total Customers: 2 (1 with account, 1 walk-in)`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
