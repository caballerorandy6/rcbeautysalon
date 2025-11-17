import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ============================================
  // 1. SALON CONFIGURATION
  // ============================================
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
      bookingDeposit: 50.0,
      depositRefundable: false,
      minBookingAdvance: 24,
      maxBookingAdvance: 30,
      cancellationPolicy:
        'Cancellations must be made at least 24 hours in advance. The $50 deposit is non-refundable.',
    },
  })
  console.log(`✅ Salon: ${salonConfig.name}`)

  // ============================================
  // 2. USERS (Authentication)
  // ============================================
  console.log('\nCreating users...')

  // ADMIN (no staff/customer profile)
  const adminPassword = await hash('admin123', 12)
  const adminUser = await prisma.user.upsert({
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
  console.log(`✅ Admin: ${adminUser.email}`)

  // STAFF USER (con Staff profile)
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
  console.log(`✅ Staff User: ${staffUser.email}`)

  // CLIENT USER (con Customer profile)
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
  console.log(`✅ Client User: ${clientUser.email}`)

  // ============================================
  // 3. CATEGORIES
  // ============================================
  console.log('\nCreating categories...')
  const hairCategory = await prisma.category.upsert({
    where: { slug: 'hair' },
    update: {},
    create: { name: 'Hair Services', slug: 'hair' },
  })

  const nailsCategory = await prisma.category.upsert({
    where: { slug: 'nails' },
    update: {},
    create: { name: 'Nails', slug: 'nails' },
  })

  const facialCategory = await prisma.category.upsert({
    where: { slug: 'facial' },
    update: {},
    create: { name: 'Facial & Skin', slug: 'facial' },
  })

  const productsCategory = await prisma.category.upsert({
    where: { slug: 'products' },
    update: {},
    create: { name: 'Beauty Products', slug: 'products' },
  })
  console.log('✅ Categories: 4')

  // ============================================
  // 4. SERVICES
  // ============================================
  console.log('\nCreating services...')
  const haircut = await prisma.service.upsert({
    where: { id: 'service_haircut' },
    update: {},
    create: {
      id: 'service_haircut',
      name: 'Haircut & Style',
      description: 'Professional haircut with styling',
      duration: 60,
      price: 75.0,
      categoryId: hairCategory.id,
      isActive: true,
    },
  })

  const coloring = await prisma.service.upsert({
    where: { id: 'service_coloring' },
    update: {},
    create: {
      id: 'service_coloring',
      name: 'Hair Coloring',
      description: 'Full hair coloring service',
      duration: 120,
      price: 150.0,
      categoryId: hairCategory.id,
      isActive: true,
    },
  })

  const manicure = await prisma.service.upsert({
    where: { id: 'service_manicure' },
    update: {},
    create: {
      id: 'service_manicure',
      name: 'Manicure',
      description: 'Classic manicure with polish',
      duration: 45,
      price: 35.0,
      categoryId: nailsCategory.id,
      isActive: true,
    },
  })

  const pedicure = await prisma.service.upsert({
    where: { id: 'service_pedicure' },
    update: {},
    create: {
      id: 'service_pedicure',
      name: 'Pedicure',
      description: 'Relaxing pedicure with massage',
      duration: 60,
      price: 50.0,
      categoryId: nailsCategory.id,
      isActive: true,
    },
  })

  const facial = await prisma.service.upsert({
    where: { id: 'service_facial' },
    update: {},
    create: {
      id: 'service_facial',
      name: 'Facial Treatment',
      description: 'Deep cleansing facial',
      duration: 90,
      price: 120.0,
      categoryId: facialCategory.id,
      isActive: true,
    },
  })
  console.log('✅ Services: 5')

  // ============================================
  // 5. STAFF PROFILES
  // ============================================
  console.log('\nCreating staff profiles...')

  // Staff CON login (conectado a staffUser)
  const staffLaura = await prisma.staff.upsert({
    where: { id: 'staff_laura' },
    update: {},
    create: {
      id: 'staff_laura',
      name: 'Laura Thompson',
      email: 'staff@rcbeautysalon.org',
      phone: '+1 (555) 100-1001',
      bio: 'Staff member with login access to manage appointments',
      isActive: true,
      userId: staffUser.id,
    },
  })

  // Staff SIN login
  const staffMaria = await prisma.staff.upsert({
    where: { id: 'staff_maria' },
    update: {},
    create: {
      id: 'staff_maria',
      name: 'Maria Rodriguez',
      email: 'maria@rcbeautysalon.org',
      phone: '+1 (555) 111-2222',
      bio: 'Expert hair stylist with 10+ years of experience',
      isActive: true,
    },
  })

  const staffSofia = await prisma.staff.upsert({
    where: { id: 'staff_sofia' },
    update: {},
    create: {
      id: 'staff_sofia',
      name: 'Sofia Martinez',
      email: 'sofia@rcbeautysalon.org',
      phone: '+1 (555) 333-4444',
      bio: 'Certified nail technician and beauty specialist',
      isActive: true,
    },
  })

  const staffAna = await prisma.staff.upsert({
    where: { id: 'staff_ana' },
    update: {},
    create: {
      id: 'staff_ana',
      name: 'Ana Garcia',
      email: 'ana@rcbeautysalon.org',
      phone: '+1 (555) 555-6666',
      bio: 'Licensed esthetician specializing in facial treatments',
      isActive: true,
    },
  })
  console.log('✅ Staff: 4 (1 with login, 3 without)')

  // ============================================
  // 6. CUSTOMER PROFILES
  // ============================================
  console.log('\nCreating customer profiles...')

  // Customer CON cuenta (conectado a clientUser)
  const customerJohn = await prisma.customer.upsert({
    where: { id: 'customer_john' },
    update: {},
    create: {
      id: 'customer_john',
      name: 'John Doe',
      email: 'cliente@rcbeautysalon.org',
      phone: '+1 (555) 200-2002',
      notes: 'Regular customer with account access',
      userId: clientUser.id,
    },
  })

  // Customer SIN cuenta (walk-in)
  const customerJessica = await prisma.customer.upsert({
    where: { id: 'customer_jessica' },
    update: {},
    create: {
      id: 'customer_jessica',
      name: 'Jessica Smith',
      email: 'jessica@example.com',
      phone: '+1 (555) 777-8888',
      notes: 'Walk-in customer, prefers morning appointments',
    },
  })
  console.log('✅ Customers: 2 (1 with account, 1 walk-in)')

  // ============================================
  // 7. STAFF SERVICES (assign services to staff)
  // ============================================
  console.log('\nAssigning services to staff...')

  // Limpiar asignaciones existentes
  await prisma.staffService.deleteMany({
    where: {
      staffId: {
        in: [staffLaura.id, staffMaria.id, staffSofia.id, staffAna.id],
      },
    },
  })

  await prisma.staffService.createMany({
    data: [
      // Laura - All services
      { staffId: staffLaura.id, serviceId: haircut.id },
      { staffId: staffLaura.id, serviceId: manicure.id },
      { staffId: staffLaura.id, serviceId: facial.id },
      // Maria - Hair services
      { staffId: staffMaria.id, serviceId: haircut.id },
      { staffId: staffMaria.id, serviceId: coloring.id },
      // Sofia - Nail services
      { staffId: staffSofia.id, serviceId: manicure.id },
      { staffId: staffSofia.id, serviceId: pedicure.id },
      // Ana - Facial services
      { staffId: staffAna.id, serviceId: facial.id },
    ],
  })
  console.log('✅ Staff services assigned')

  // ============================================
  // 8. WORKING HOURS (Monday-Friday, 9am-6pm)
  // ============================================
  console.log('\nCreating working hours...')

  // Limpiar horarios existentes
  await prisma.workingHours.deleteMany({
    where: {
      staffId: {
        in: [staffLaura.id, staffMaria.id, staffSofia.id, staffAna.id],
      },
    },
  })

  const workingHoursData = []
  const allStaff = [staffLaura, staffMaria, staffSofia, staffAna]

  for (const staff of allStaff) {
    // Monday (1) to Friday (5)
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
  console.log('✅ Working hours: 20 entries (4 staff x 5 days)')

  // ============================================
  // 9. PRODUCTS
  // ============================================
  console.log('\nCreating products...')

  // Limpiar productos existentes para evitar duplicados
  await prisma.product.deleteMany({
    where: {
      sku: {
        in: ['SHP-001', 'CND-001', 'SRM-001', 'NPL-001'],
      },
    },
  })

  await prisma.product.createMany({
    data: [
      {
        name: 'Premium Shampoo',
        description: 'Professional grade shampoo for all hair types',
        price: 28.0,
        compareAtPrice: 35.0,
        sku: 'SHP-001',
        stockQuantity: 50,
        categoryId: productsCategory.id,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Hair Conditioner',
        description: 'Deep conditioning treatment',
        price: 32.0,
        compareAtPrice: 40.0,
        sku: 'CND-001',
        stockQuantity: 45,
        categoryId: productsCategory.id,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Facial Serum',
        description: 'Anti-aging facial serum with vitamin C',
        price: 65.0,
        compareAtPrice: 80.0,
        sku: 'SRM-001',
        stockQuantity: 30,
        categoryId: productsCategory.id,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Nail Polish Set',
        description: 'Set of 5 premium nail polishes',
        price: 45.0,
        sku: 'NPL-001',
        stockQuantity: 25,
        categoryId: productsCategory.id,
        isActive: true,
        isFeatured: false,
      },
    ],
  })
  console.log('✅ Products: 4')

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n' + '='.repeat(50))
  console.log('✨ Seeding completed successfully!')
  console.log('='.repeat(50))
  console.log('\n📋 SUMMARY:')
  console.log(`Salon: ${salonConfig.name}`)

  console.log('\n👥 USERS (can login):')
  console.log(`  • Admin: admin@rcbeautysalon.org / admin123`)
  console.log(`    → Full access to all areas`)
  console.log(`  • Staff: staff@rcbeautysalon.org / staff123 (${staffLaura.name})`)
  console.log(`    → Access to /staff-portal only`)
  console.log(`  • Client: cliente@rcbeautysalon.org / cliente123 (${customerJohn.name})`)
  console.log(`    → Access to /my-account only`)

  console.log('\n👷 STAFF (no login):')
  console.log(`  • ${staffMaria.name} (${staffMaria.email})`)
  console.log(`  • ${staffSofia.name} (${staffSofia.email})`)
  console.log(`  • ${staffAna.name} (${staffAna.email})`)

  console.log('\n🛍️ CUSTOMERS:')
  console.log(`  • ${customerJohn.name} (has account) → can login`)
  console.log(`  • ${customerJessica.name} (walk-in) → no login`)

  console.log('\n📊 DATA:')
  console.log(`  • Categories: 4`)
  console.log(`  • Services: 5`)
  console.log(`  • Staff: 4 (1 with login, 3 without)`)
  console.log(`  • Customers: 2 (1 with account, 1 walk-in)`)
  console.log(`  • Products: 4`)
  console.log(`  • Working Hours: 20 entries`)
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
