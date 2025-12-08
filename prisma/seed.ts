import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { addDays, setHours, setMinutes } from 'date-fns'

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
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'US',
      timezone: 'America/Chicago',
      currency: 'USD',
      locale: 'en',
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      accentColor: '#d4af37',
      bookingDeposit: 50.0,
      depositRefundable: false,
      minBookingAdvance: 0,
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

  // STAFF USERS (all staff can login)
  const staffPassword = await hash('staff123', 12)

  const lauraUser = await prisma.user.upsert({
    where: { email: 'laura@rcbeautysalon.org' },
    update: {},
    create: {
      name: 'Laura Thompson',
      email: 'laura@rcbeautysalon.org',
      password: staffPassword,
      role: 'STAFF',
      emailVerified: new Date(),
    },
  })

  const mariaUser = await prisma.user.upsert({
    where: { email: 'maria@rcbeautysalon.org' },
    update: {},
    create: {
      name: 'Maria Rodriguez',
      email: 'maria@rcbeautysalon.org',
      password: staffPassword,
      role: 'STAFF',
      emailVerified: new Date(),
    },
  })

  const sofiaUser = await prisma.user.upsert({
    where: { email: 'sofia@rcbeautysalon.org' },
    update: {},
    create: {
      name: 'Sofia Martinez',
      email: 'sofia@rcbeautysalon.org',
      password: staffPassword,
      role: 'STAFF',
      emailVerified: new Date(),
    },
  })

  const anaUser = await prisma.user.upsert({
    where: { email: 'ana@rcbeautysalon.org' },
    update: {},
    create: {
      name: 'Ana Garcia',
      email: 'ana@rcbeautysalon.org',
      password: staffPassword,
      role: 'STAFF',
      emailVerified: new Date(),
    },
  })
  console.log(`✅ Staff Users: 4`)

  // CLIENT USERS (with Customer profiles)
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

  const emilyUser = await prisma.user.upsert({
    where: { email: 'emily@example.com' },
    update: {},
    create: {
      name: 'Emily Johnson',
      email: 'emily@example.com',
      password: clientPassword,
      role: 'CLIENTE',
      emailVerified: new Date(),
    },
  })

  const michaelUser = await prisma.user.upsert({
    where: { email: 'michael@example.com' },
    update: {},
    create: {
      name: 'Michael Chen',
      email: 'michael@example.com',
      password: clientPassword,
      role: 'CLIENTE',
      emailVerified: new Date(),
    },
  })
  console.log(`✅ Client Users: 3`)

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

  const massageCategory = await prisma.category.upsert({
    where: { slug: 'massage' },
    update: {},
    create: { name: 'Massage & Spa', slug: 'massage' },
  })

  const productsCategory = await prisma.category.upsert({
    where: { slug: 'products' },
    update: {},
    create: { name: 'Beauty Products', slug: 'products' },
  })
  console.log('✅ Categories: 5')

  // ============================================
  // 4. SERVICES (Enhanced with images and featured)
  // ============================================
  console.log('\nCreating services...')
  const haircut = await prisma.service.upsert({
    where: { slug: 'haircut-style' },
    update: {
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763611761/Beauty%20Salon/services/classic-haircut_inzgrp.avif',
    },
    create: {
      name: 'Haircut & Style',
      slug: 'haircut-style',
      description: 'Professional haircut tailored to your face shape and lifestyle, finished with expert styling for a polished look.',
      duration: 60,
      price: 75.0,
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763611761/Beauty%20Salon/services/classic-haircut_inzgrp.avif',
      categoryId: hairCategory.id,
      isActive: true,
      isFeatured: true,
      order: 1,
    },
  })

  const coloring = await prisma.service.upsert({
    where: { slug: 'hair-coloring' },
    update: {
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763538513/Beauty%20Salon/services/coloring_aiw6e3.avif',
    },
    create: {
      name: 'Hair Coloring',
      slug: 'hair-coloring',
      description: 'Full hair coloring service with premium products. Includes color consultation, application, and deep conditioning treatment.',
      duration: 120,
      price: 150.0,
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763538513/Beauty%20Salon/services/coloring_aiw6e3.avif',
      categoryId: hairCategory.id,
      isActive: true,
      isFeatured: true,
      order: 2,
    },
  })

  const highlights = await prisma.service.upsert({
    where: { slug: 'highlights' },
    update: {
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763612088/Beauty%20Salon/services/highlights_mrhaba.avif',
    },
    create: {
      name: 'Highlights & Balayage',
      slug: 'highlights',
      description: 'Sun-kissed highlights or hand-painted balayage for natural-looking dimension and depth.',
      duration: 150,
      price: 180.0,
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763612088/Beauty%20Salon/services/highlights_mrhaba.avif',
      categoryId: hairCategory.id,
      isActive: true,
      isFeatured: false,
    },
  })

  const keratin = await prisma.service.upsert({
    where: { slug: 'keratin-treatment' },
    update: {
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763611939/Beauty%20Salon/services/hair-treatment_hs60yv.avif',
    },
    create: {
      name: 'Keratin Treatment',
      slug: 'keratin-treatment',
      description: 'Smoothing keratin treatment that eliminates frizz and reduces styling time for up to 3 months.',
      duration: 180,
      price: 250.0,
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763611939/Beauty%20Salon/services/hair-treatment_hs60yv.avif',
      categoryId: hairCategory.id,
      isActive: true,
      isFeatured: false,
    },
  })

  const manicure = await prisma.service.upsert({
    where: { slug: 'manicure' },
    update: {
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763538512/Beauty%20Salon/services/manicure_hyudpf.avif',
    },
    create: {
      name: 'Classic Manicure',
      slug: 'manicure',
      description: 'Classic manicure with nail shaping, cuticle care, hand massage, and polish application.',
      duration: 45,
      price: 35.0,
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763538512/Beauty%20Salon/services/manicure_hyudpf.avif',
      categoryId: nailsCategory.id,
      isActive: true,
      isFeatured: true,
      order: 3,
    },
  })

  const pedicure = await prisma.service.upsert({
    where: { slug: 'pedicure' },
    update: {
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763613172/Beauty%20Salon/services/spa-pedicure_fpbjgq.avif',
    },
    create: {
      name: 'Spa Pedicure',
      slug: 'pedicure',
      description: 'Relaxing spa pedicure with foot soak, exfoliation, massage, and polish. Perfect for tired feet.',
      duration: 60,
      price: 50.0,
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763613172/Beauty%20Salon/services/spa-pedicure_fpbjgq.avif',
      categoryId: nailsCategory.id,
      isActive: true,
      isFeatured: true,
      order: 4,
    },
  })

  const gelNails = await prisma.service.upsert({
    where: { slug: 'gel-nails' },
    update: {
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763613072/Beauty%20Salon/services/gel-manicure_e7k2gb.avif',
    },
    create: {
      name: 'Gel Manicure',
      slug: 'gel-nails',
      description: 'Long-lasting gel manicure with LED curing. Lasts up to 3 weeks without chipping.',
      duration: 60,
      price: 55.0,
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763613072/Beauty%20Salon/services/gel-manicure_e7k2gb.avif',
      categoryId: nailsCategory.id,
      isActive: true,
      isFeatured: false,
    },
  })

  const facial = await prisma.service.upsert({
    where: { slug: 'facial-treatment' },
    update: {
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763611175/Beauty%20Salon/services/deep-cleansing-facial_jzjp7l.avif',
    },
    create: {
      name: 'Deep Cleansing Facial',
      slug: 'facial-treatment',
      description: 'Professional facial treatment with deep cleansing, exfoliation, extraction, and hydrating mask for glowing skin.',
      duration: 90,
      price: 120.0,
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763611175/Beauty%20Salon/services/deep-cleansing-facial_jzjp7l.avif',
      categoryId: facialCategory.id,
      isActive: true,
      isFeatured: true,
      order: 5,
    },
  })

  const antiAging = await prisma.service.upsert({
    where: { slug: 'anti-aging-facial' },
    update: {
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763611000/Beauty%20Salon/services/anti-aging-facial_qgusgu.avif',
    },
    create: {
      name: 'Anti-Aging Facial',
      slug: 'anti-aging-facial',
      description: 'Advanced anti-aging facial with peptides and collagen boost to reduce fine lines and improve skin firmness.',
      duration: 75,
      price: 140.0,
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763611000/Beauty%20Salon/services/anti-aging-facial_qgusgu.avif',
      categoryId: facialCategory.id,
      isActive: true,
      isFeatured: false,
    },
  })

  const microdermabrasion = await prisma.service.upsert({
    where: { slug: 'microdermabrasion' },
    update: {
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763611296/Beauty%20Salon/services/hydrating-facial_sliwao.avif',
    },
    create: {
      name: 'Microdermabrasion',
      slug: 'microdermabrasion',
      description: 'Non-invasive exfoliation treatment that reveals smoother, younger-looking skin.',
      duration: 60,
      price: 110.0,
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763611296/Beauty%20Salon/services/hydrating-facial_sliwao.avif',
      categoryId: facialCategory.id,
      isActive: true,
      isFeatured: false,
    },
  })

  const massage = await prisma.service.upsert({
    where: { slug: 'relaxing-massage' },
    update: {
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763612585/Beauty%20Salon/services/swedish-massage_degn1f.avif',
    },
    create: {
      name: 'Relaxing Massage',
      slug: 'relaxing-massage',
      description: 'Full body massage designed to release tension, improve circulation, and promote deep relaxation.',
      duration: 60,
      price: 90.0,
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763612585/Beauty%20Salon/services/swedish-massage_degn1f.avif',
      categoryId: massageCategory.id,
      isActive: true,
      isFeatured: false,
    },
  })

  const hotStone = await prisma.service.upsert({
    where: { slug: 'hot-stone-massage' },
    update: {
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763612414/Beauty%20Salon/services/hot-stone-massage_krxtkc.avif',
    },
    create: {
      name: 'Hot Stone Massage',
      slug: 'hot-stone-massage',
      description: 'Therapeutic massage using heated stones to melt away stress and muscle tension.',
      duration: 90,
      price: 130.0,
      imageUrl: 'https://res.cloudinary.com/caballerorandy/image/upload/v1763612414/Beauty%20Salon/services/hot-stone-massage_krxtkc.avif',
      categoryId: massageCategory.id,
      isActive: true,
      isFeatured: false,
    },
  })
  console.log('✅ Services: 12 (5 featured)')

  // ============================================
  // 5. STAFF PROFILES (all with login)
  // ============================================
  console.log('\nCreating staff profiles...')

  const staffLaura = await prisma.staff.upsert({
    where: { userId: lauraUser.id },
    update: {
      image: 'https://res.cloudinary.com/caballerorandy/image/upload/v1764141936/Beauty%20Salon/services/laura-thompson_asbi3t.avif',
    },
    create: {
      name: 'Laura Thompson',
      email: 'laura@rcbeautysalon.org',
      phone: '+1 (555) 100-1001',
      bio: 'Senior stylist with 15+ years of experience specializing in cuts, color transformations, and keratin treatments',
      image: 'https://res.cloudinary.com/caballerorandy/image/upload/v1764141936/Beauty%20Salon/services/laura-thompson_asbi3t.avif',
      isActive: true,
      userId: lauraUser.id,
    },
  })

  const staffMaria = await prisma.staff.upsert({
    where: { userId: mariaUser.id },
    update: {
      image: 'https://res.cloudinary.com/caballerorandy/image/upload/v1764142469/Beauty%20Salon/services/maria-rodriguez_uzksdw.avif',
    },
    create: {
      name: 'Maria Rodriguez',
      email: 'maria@rcbeautysalon.org',
      phone: '+1 (555) 111-2222',
      bio: 'Expert hair colorist and balayage specialist with a passion for creating natural-looking highlights',
      image: 'https://res.cloudinary.com/caballerorandy/image/upload/v1764142469/Beauty%20Salon/services/maria-rodriguez_uzksdw.avif',
      isActive: true,
      userId: mariaUser.id,
    },
  })

  const staffSofia = await prisma.staff.upsert({
    where: { userId: sofiaUser.id },
    update: {
      image: 'https://res.cloudinary.com/caballerorandy/image/upload/v1764142586/Beauty%20Salon/services/sofia-martinez_vc28m8.avif',
    },
    create: {
      name: 'Sofia Martinez',
      email: 'sofia@rcbeautysalon.org',
      phone: '+1 (555) 333-4444',
      bio: 'Certified nail technician specializing in gel manicures, nail art, and spa pedicures',
      image: 'https://res.cloudinary.com/caballerorandy/image/upload/v1764142586/Beauty%20Salon/services/sofia-martinez_vc28m8.avif',
      isActive: true,
      userId: sofiaUser.id,
    },
  })

  const staffAna = await prisma.staff.upsert({
    where: { userId: anaUser.id },
    update: {
      image: 'https://res.cloudinary.com/caballerorandy/image/upload/v1764142701/Beauty%20Salon/services/ana-garcia_cl0tgj.avif',
    },
    create: {
      name: 'Ana Garcia',
      email: 'ana@rcbeautysalon.org',
      phone: '+1 (555) 555-6666',
      bio: 'Licensed esthetician and massage therapist specializing in anti-aging facials and therapeutic massage',
      image: 'https://res.cloudinary.com/caballerorandy/image/upload/v1764142701/Beauty%20Salon/services/ana-garcia_cl0tgj.avif',
      isActive: true,
      userId: anaUser.id,
    },
  })
  console.log('✅ Staff: 4 (all with login access)')

  // ============================================
  // 6. CUSTOMER PROFILES
  // ============================================
  console.log('\nCreating customer profiles...')

  const customerJohn = await prisma.customer.upsert({
    where: { userId: clientUser.id },
    update: {},
    create: {
      name: 'John Doe',
      email: 'cliente@rcbeautysalon.org',
      phone: '+1 (555) 200-2002',
      notes: 'Regular customer, prefers Laura for haircuts',
      userId: clientUser.id,
    },
  })

  const customerEmily = await prisma.customer.upsert({
    where: { userId: emilyUser.id },
    update: {},
    create: {
      name: 'Emily Johnson',
      email: 'emily@example.com',
      phone: '+1 (555) 300-3003',
      notes: 'Loves facials and spa treatments',
      userId: emilyUser.id,
    },
  })

  const customerMichael = await prisma.customer.upsert({
    where: { userId: michaelUser.id },
    update: {},
    create: {
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '+1 (555) 400-4004',
      userId: michaelUser.id,
    },
  })

  // Walk-in customer (no account)
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
  console.log('✅ Customers: 4 (3 with accounts, 1 walk-in)')

  // ============================================
  // 7. STAFF SERVICES (assign services to staff)
  // ============================================
  console.log('\nAssigning services to staff...')

  await prisma.staffService.deleteMany({})

  await prisma.staffService.createMany({
    data: [
      // Laura - Hair services
      { staffId: staffLaura.id, serviceId: haircut.id },
      { staffId: staffLaura.id, serviceId: coloring.id },
      { staffId: staffLaura.id, serviceId: highlights.id },
      { staffId: staffLaura.id, serviceId: keratin.id },
      // Maria - Hair services
      { staffId: staffMaria.id, serviceId: haircut.id },
      { staffId: staffMaria.id, serviceId: coloring.id },
      { staffId: staffMaria.id, serviceId: highlights.id },
      // Sofia - Nail services
      { staffId: staffSofia.id, serviceId: manicure.id },
      { staffId: staffSofia.id, serviceId: pedicure.id },
      { staffId: staffSofia.id, serviceId: gelNails.id },
      // Ana - Facial and Massage services
      { staffId: staffAna.id, serviceId: facial.id },
      { staffId: staffAna.id, serviceId: antiAging.id },
      { staffId: staffAna.id, serviceId: microdermabrasion.id },
      { staffId: staffAna.id, serviceId: massage.id },
      { staffId: staffAna.id, serviceId: hotStone.id },
    ],
  })
  console.log('✅ Staff services assigned')

  // ============================================
  // 8. WORKING HOURS (Monday-Friday, 9am-6pm)
  // ============================================
  console.log('\nCreating working hours...')

  await prisma.workingHours.deleteMany({})

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
  // 9. REVIEWS / TESTIMONIALS
  // ============================================
  console.log('\nCreating service reviews...')

  await prisma.review.deleteMany({})

  await prisma.review.createMany({
    data: [
      {
        rating: 5,
        comment: 'Laura gave me the best haircut I\'ve ever had! She really listened to what I wanted and the result was perfect. Highly recommend!',
        serviceId: haircut.id,
        userId: customerJohn.userId!,
        isActive: true,
      },
      {
        rating: 5,
        comment: 'Maria is amazing with color! My balayage looks so natural and beautiful. I get compliments everywhere I go.',
        serviceId: coloring.id,
        userId: customerEmily.userId!,
        isActive: true,
      },
      {
        rating: 5,
        comment: 'The facial was incredible! My skin feels so soft and refreshed. Ana really knows what she\'s doing.',
        serviceId: facial.id,
        userId: customerMichael.userId!,
        isActive: true,
      },
      {
        rating: 5,
        comment: 'Best pedicure ever! Sofia is so detail-oriented and the massage was heavenly. Will definitely be back!',
        serviceId: pedicure.id,
        userId: customerEmily.userId!,
        isActive: true,
      },
      {
        rating: 4,
        comment: 'Great service and friendly staff. The gel manicure lasted 3 weeks without chipping!',
        serviceId: gelNails.id,
        userId: customerJohn.userId!,
        isActive: true,
      },
    ],
  })
  console.log('✅ Reviews: 5')

  // ============================================
  // 10. SERVICE GALLERY (Before/After photos)
  // ============================================
  console.log('\nCreating service gallery...')

  await prisma.serviceGallery.deleteMany({})

  await prisma.serviceGallery.createMany({
    data: [
      { imageUrl: 'gallery/hair-1', caption: 'Beautiful balayage transformation', order: 1, serviceId: coloring.id },
      { imageUrl: 'gallery/hair-2', caption: 'Before and after haircut', order: 2, serviceId: haircut.id },
      { imageUrl: 'gallery/nails-1', caption: 'Gel manicure with nail art', order: 1, serviceId: gelNails.id },
      { imageUrl: 'gallery/facial-1', caption: 'Glowing skin after facial treatment', order: 1, serviceId: facial.id },
      { imageUrl: 'gallery/hair-3', caption: 'Keratin treatment results', order: 1, serviceId: keratin.id },
    ],
  })
  console.log('✅ Gallery: 5 images')

  // ============================================
  // 11. SERVICE FAQs
  // ============================================
  console.log('\nCreating service FAQs...')

  await prisma.serviceFAQ.deleteMany({})

  await prisma.serviceFAQ.createMany({
    data: [
      {
        question: 'How long will my color last?',
        answer: 'With proper care, your hair color should last 4-6 weeks. We recommend using color-safe shampoo and conditioner.',
        order: 1,
        serviceId: coloring.id,
      },
      {
        question: 'What should I do before my haircut appointment?',
        answer: 'Come with clean, dry hair if possible. Bring inspiration photos if you have a specific style in mind!',
        order: 1,
        serviceId: haircut.id,
      },
      {
        question: 'How often should I get a facial?',
        answer: 'For best results, we recommend monthly facials. However, the frequency depends on your skin type and concerns.',
        order: 1,
        serviceId: facial.id,
      },
      {
        question: 'How long does gel manicure last?',
        answer: 'Gel manicures typically last 2-3 weeks without chipping when properly maintained.',
        order: 1,
        serviceId: gelNails.id,
      },
      {
        question: 'Can I wash my hair after keratin treatment?',
        answer: 'Wait 72 hours after the treatment before washing your hair to allow the keratin to fully set.',
        order: 1,
        serviceId: keratin.id,
      },
    ],
  })
  console.log('✅ FAQs: 5')

  // ============================================
  // 12. SAMPLE APPOINTMENTS (for testing)
  // ============================================
  console.log('\nCreating sample appointments...')

  await prisma.appointment.deleteMany({})

  const today = new Date()
  const tomorrow = addDays(today, 1)
  const dayAfterTomorrow = addDays(today, 2)
  const nextWeek = addDays(today, 7)
  const twoDaysAgo = addDays(today, -2)
  const threeDaysAgo = addDays(today, -3)
  const lastWeek = addDays(today, -7)
  const twoWeeksAgo = addDays(today, -14)

  // === FUTURE APPOINTMENTS ===

  // Tomorrow - Confirmed (paid)
  await prisma.appointment.create({
    data: {
      staffId: staffLaura.id,
      customerId: customerJohn.id,
      startTime: setMinutes(setHours(tomorrow, 10), 0),
      endTime: setMinutes(setHours(tomorrow, 11), 0),
      status: 'CONFIRMED',
      notes: 'Regular haircut - prefers shorter on sides',
      totalPrice: 75.0,
      depositAmount: 50.0,
      depositPaid: true,
      services: {
        create: [{ serviceId: haircut.id }],
      },
    },
  })

  // Tomorrow - Confirmed (paid) - Another client
  await prisma.appointment.create({
    data: {
      staffId: staffSofia.id,
      customerId: customerEmily.id,
      startTime: setMinutes(setHours(tomorrow, 14), 0),
      endTime: setMinutes(setHours(tomorrow, 15), 0),
      status: 'CONFIRMED',
      totalPrice: 55.0,
      depositAmount: 50.0,
      depositPaid: true,
      services: {
        create: [{ serviceId: gelNails.id }],
      },
    },
  })

  // Day after tomorrow - Pending payment
  await prisma.appointment.create({
    data: {
      staffId: staffAna.id,
      customerId: customerMichael.id,
      startTime: setMinutes(setHours(dayAfterTomorrow, 11), 0),
      endTime: setMinutes(setHours(dayAfterTomorrow, 12), 30),
      status: 'PENDING',
      totalPrice: 120.0,
      depositAmount: 50.0,
      depositPaid: false,
      services: {
        create: [{ serviceId: facial.id }],
      },
    },
  })

  // Next week - Confirmed (multiple services)
  await prisma.appointment.create({
    data: {
      staffId: staffMaria.id,
      customerId: customerEmily.id,
      startTime: setMinutes(setHours(nextWeek, 10), 0),
      endTime: setMinutes(setHours(nextWeek, 14), 30),
      status: 'CONFIRMED',
      notes: 'Full color transformation',
      totalPrice: 330.0,
      depositAmount: 50.0,
      depositPaid: true,
      services: {
        create: [
          { serviceId: coloring.id },
          { serviceId: highlights.id },
        ],
      },
    },
  })

  // === PAST APPOINTMENTS ===

  // 2 days ago - Completed
  await prisma.appointment.create({
    data: {
      staffId: staffSofia.id,
      customerId: customerEmily.id,
      startTime: setMinutes(setHours(twoDaysAgo, 11), 0),
      endTime: setMinutes(setHours(twoDaysAgo, 12), 0),
      status: 'COMPLETED',
      totalPrice: 50.0,
      depositAmount: 50.0,
      depositPaid: true,
      services: {
        create: [{ serviceId: pedicure.id }],
      },
    },
  })

  // 3 days ago - Completed
  await prisma.appointment.create({
    data: {
      staffId: staffLaura.id,
      customerId: customerMichael.id,
      startTime: setMinutes(setHours(threeDaysAgo, 15), 0),
      endTime: setMinutes(setHours(threeDaysAgo, 16), 0),
      status: 'COMPLETED',
      totalPrice: 75.0,
      depositAmount: 50.0,
      depositPaid: true,
      services: {
        create: [{ serviceId: haircut.id }],
      },
    },
  })

  // Last week - NO_SHOW (client didn't show up, lost deposit)
  await prisma.appointment.create({
    data: {
      staffId: staffAna.id,
      customerId: customerJessica.id,
      startTime: setMinutes(setHours(lastWeek, 14), 0),
      endTime: setMinutes(setHours(lastWeek, 15), 30),
      status: 'NO_SHOW',
      notes: 'Client did not show up - deposit forfeited',
      totalPrice: 130.0,
      depositAmount: 50.0,
      depositPaid: true,
      services: {
        create: [{ serviceId: hotStone.id }],
      },
    },
  })

  // Last week - CANCELLED by client
  await prisma.appointment.create({
    data: {
      staffId: staffMaria.id,
      customerId: customerJohn.id,
      startTime: setMinutes(setHours(lastWeek, 10), 0),
      endTime: setMinutes(setHours(lastWeek, 12), 0),
      status: 'CANCELLED',
      notes: 'Cancelled by client - emergency',
      totalPrice: 150.0,
      depositAmount: 50.0,
      depositPaid: true,
      services: {
        create: [{ serviceId: coloring.id }],
      },
    },
  })

  // 2 weeks ago - Completed
  await prisma.appointment.create({
    data: {
      staffId: staffSofia.id,
      customerId: customerJohn.id,
      startTime: setMinutes(setHours(twoWeeksAgo, 16), 0),
      endTime: setMinutes(setHours(twoWeeksAgo, 17), 0),
      status: 'COMPLETED',
      totalPrice: 35.0,
      depositAmount: 50.0,
      depositPaid: true,
      services: {
        create: [{ serviceId: manicure.id }],
      },
    },
  })

  // 2 weeks ago - Completed (walk-in guest)
  await prisma.appointment.create({
    data: {
      staffId: staffAna.id,
      guestName: 'Sarah Williams',
      guestEmail: 'sarah.w@example.com',
      guestPhone: '+1 (555) 999-0000',
      startTime: setMinutes(setHours(twoWeeksAgo, 11), 0),
      endTime: setMinutes(setHours(twoWeeksAgo, 12), 0),
      status: 'COMPLETED',
      totalPrice: 90.0,
      depositAmount: 50.0,
      depositPaid: true,
      services: {
        create: [{ serviceId: massage.id }],
      },
    },
  })

  console.log('✅ Appointments: 10 (4 future, 6 past)')
  console.log('   → Future: 3 CONFIRMED, 1 PENDING')
  console.log('   → Past: 4 COMPLETED, 1 NO_SHOW, 1 CANCELLED')

  // ============================================
  // 13. PRODUCTS
  // ============================================
  console.log('\nCreating products...')

  await prisma.product.deleteMany({})

  await prisma.product.createMany({
    data: [
      {
        name: 'Premium Hair Shampoo',
        description: 'Professional grade sulfate-free shampoo for all hair types. Gently cleanses while maintaining natural oils.',
        price: 28.0,
        compareAtPrice: 35.0,
        sku: 'SHP-001',
        stockQuantity: 50,
        images: ['https://res.cloudinary.com/caballerorandy/image/upload/v1764652547/Beauty%20Salon/services/premium-hair-shampoo_lyekdy.avif'],
        categoryId: productsCategory.id,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Deep Conditioning Treatment',
        description: 'Intensive conditioning treatment that repairs damaged hair and adds shine. Use weekly for best results.',
        price: 32.0,
        compareAtPrice: 40.0,
        sku: 'CND-001',
        stockQuantity: 45,
        images: ['https://res.cloudinary.com/caballerorandy/image/upload/v1764652695/Beauty%20Salon/services/deep-conditioning-treatment_rkeqdp.avif'],
        categoryId: productsCategory.id,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Anti-Aging Facial Serum',
        description: 'Powerful anti-aging serum with vitamin C, hyaluronic acid, and peptides. Reduces fine lines and brightens skin.',
        price: 65.0,
        compareAtPrice: 80.0,
        sku: 'SRM-001',
        stockQuantity: 30,
        images: ['https://res.cloudinary.com/caballerorandy/image/upload/v1764653498/Beauty%20Salon/services/anti-aging-facial-serum_grkuhs.avif'],
        categoryId: productsCategory.id,
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Premium Nail Polish Set',
        description: 'Set of 5 long-lasting nail polishes in trendy colors. Chip-resistant formula.',
        price: 45.0,
        sku: 'NPL-001',
        stockQuantity: 25,
        images: ['https://res.cloudinary.com/caballerorandy/image/upload/v1764653996/Beauty%20Salon/services/premium-nail-polish-set_xag8xr.avif'],
        categoryId: productsCategory.id,
        isActive: true,
        isFeatured: false,
      },
      {
        name: 'Hydrating Face Cream',
        description: '24-hour hydration cream with SPF 30 protection. Perfect for daily use.',
        price: 42.0,
        compareAtPrice: 55.0,
        sku: 'FCR-001',
        stockQuantity: 35,
        images: ['https://res.cloudinary.com/caballerorandy/image/upload/v1764653082/Beauty%20Salon/services/hydrating-face-cream_hapgsz.avif'],
        categoryId: productsCategory.id,
        isActive: true,
        isFeatured: false,
      },
      {
        name: 'Hair Growth Serum',
        description: 'Stimulates hair growth and strengthens follicles. Visible results in 8-12 weeks.',
        price: 58.0,
        sku: 'HGS-001',
        stockQuantity: 20,
        images: ['https://res.cloudinary.com/caballerorandy/image/upload/v1764653341/Beauty%20Salon/services/hair-growth-serum_zruj5f.avif'],
        categoryId: productsCategory.id,
        isActive: true,
        isFeatured: false,
      },
    ],
  })
  console.log('✅ Products: 6 (3 featured)')

  // Get products for orders
  const products = await prisma.product.findMany()
  const shampoo = products.find(p => p.sku === 'SHP-001')!
  const conditioner = products.find(p => p.sku === 'CND-001')!
  const serum = products.find(p => p.sku === 'SRM-001')!
  const nailPolish = products.find(p => p.sku === 'NPL-001')!
  const faceCream = products.find(p => p.sku === 'FCR-001')!
  const hairSerum = products.find(p => p.sku === 'HGS-001')!

  // ============================================
  // 14. SAMPLE ORDERS (for testing)
  // ============================================
  console.log('\nCreating sample orders...')

  await prisma.order.deleteMany({})

  // Order 1 - COMPLETED (picked up) - 1 week ago
  const order1 = await prisma.order.create({
    data: {
      customerId: customerJohn.id,
      subtotal: 60.0,
      tax: 4.95,
      total: 64.95,
      status: 'COMPLETED',
      stripePaymentIntentId: 'pi_test_completed_1',
      createdAt: lastWeek,
      items: {
        create: [
          { productId: shampoo.id, quantity: 1, price: 28.0 },
          { productId: conditioner.id, quantity: 1, price: 32.0 },
        ],
      },
    },
  })

  // Order 2 - COMPLETED - 2 weeks ago
  const order2 = await prisma.order.create({
    data: {
      customerId: customerEmily.id,
      subtotal: 107.0,
      tax: 8.83,
      total: 115.83,
      status: 'COMPLETED',
      stripePaymentIntentId: 'pi_test_completed_2',
      createdAt: twoWeeksAgo,
      items: {
        create: [
          { productId: serum.id, quantity: 1, price: 65.0 },
          { productId: faceCream.id, quantity: 1, price: 42.0 },
        ],
      },
    },
  })

  // Order 3 - PAID (ready for pickup) - yesterday
  const yesterday = addDays(today, -1)
  const order3 = await prisma.order.create({
    data: {
      customerId: customerMichael.id,
      subtotal: 58.0,
      tax: 4.79,
      total: 62.79,
      status: 'PAID',
      stripePaymentIntentId: 'pi_test_paid_1',
      createdAt: yesterday,
      items: {
        create: [
          { productId: hairSerum.id, quantity: 1, price: 58.0 },
        ],
      },
    },
  })

  // Order 4 - PENDING (not paid yet) - today
  const order4 = await prisma.order.create({
    data: {
      customerId: customerEmily.id,
      subtotal: 73.0,
      tax: 6.02,
      total: 79.02,
      status: 'PENDING',
      createdAt: today,
      items: {
        create: [
          { productId: shampoo.id, quantity: 1, price: 28.0 },
          { productId: nailPolish.id, quantity: 1, price: 45.0 },
        ],
      },
    },
  })

  // Order 5 - CANCELLED - 3 days ago
  const order5 = await prisma.order.create({
    data: {
      customerId: customerJohn.id,
      subtotal: 65.0,
      tax: 5.36,
      total: 70.36,
      status: 'CANCELLED',
      notes: 'Customer changed mind',
      createdAt: threeDaysAgo,
      items: {
        create: [
          { productId: serum.id, quantity: 1, price: 65.0 },
        ],
      },
    },
  })

  // Order 6 - COMPLETED (guest order) - 5 days ago
  const fiveDaysAgo = addDays(today, -5)
  const order6 = await prisma.order.create({
    data: {
      guestName: 'Amanda Wilson',
      guestEmail: 'amanda.w@example.com',
      guestPhone: '+1 (555) 888-7777',
      subtotal: 135.0,
      tax: 11.14,
      total: 146.14,
      status: 'COMPLETED',
      stripePaymentIntentId: 'pi_test_guest_1',
      createdAt: fiveDaysAgo,
      items: {
        create: [
          { productId: shampoo.id, quantity: 1, price: 28.0 },
          { productId: conditioner.id, quantity: 1, price: 32.0 },
          { productId: serum.id, quantity: 1, price: 65.0 },
          { productId: faceCream.id, quantity: 1, price: 42.0 },
        ],
      },
    },
  })

  console.log('✅ Orders: 6')
  console.log('   → 3 COMPLETED, 1 PAID, 1 PENDING, 1 CANCELLED')

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n' + '='.repeat(60))
  console.log('✨ Seeding completed successfully!')
  console.log('='.repeat(60))
  console.log('\n📋 COMPLETE DATABASE SUMMARY:')
  console.log(`\n🏢 Salon: ${salonConfig.name}`)
  console.log(`   📍 ${salonConfig.address}, ${salonConfig.city}, ${salonConfig.state}`)
  console.log(`   📞 ${salonConfig.phone}`)
  console.log(`   💵 Deposit: $${salonConfig.bookingDeposit.toFixed(2)} (non-refundable)`)

  console.log('\n👥 USERS (Login Credentials):')
  console.log(`   🔑 Admin: admin@rcbeautysalon.org / admin123`)
  console.log(`      → Full dashboard access`)
  console.log(`   👨‍💼 Staff (password: staff123):`)
  console.log(`      • laura@rcbeautysalon.org - ${staffLaura.name}`)
  console.log(`      • maria@rcbeautysalon.org - ${staffMaria.name}`)
  console.log(`      • sofia@rcbeautysalon.org - ${staffSofia.name}`)
  console.log(`      • ana@rcbeautysalon.org - ${staffAna.name}`)
  console.log(`   👤 Clients (password: cliente123):`)
  console.log(`      • cliente@rcbeautysalon.org - ${customerJohn.name}`)
  console.log(`      • emily@example.com - ${customerEmily.name}`)
  console.log(`      • michael@example.com - ${customerMichael.name}`)

  console.log('\n📊 DATABASE STATISTICS:')
  console.log(`   ✨ Categories: 5`)
  console.log(`   💇 Services: 12 (5 featured)`)
  console.log(`   👥 Staff: 4 (all with login)`)
  console.log(`   🙋 Customers: 4 (3 with accounts, 1 walk-in)`)
  console.log(`   ⭐ Reviews: 5`)
  console.log(`   📸 Gallery Images: 5`)
  console.log(`   ❓ FAQs: 5`)
  console.log(`   📅 Appointments: 10 (4 future, 6 past)`)
  console.log(`      → Future: 3 CONFIRMED, 1 PENDING`)
  console.log(`      → Past: 4 COMPLETED, 1 NO_SHOW, 1 CANCELLED`)
  console.log(`   🛍️  Products: 6 (3 featured)`)
  console.log(`   🛒 Orders: 6`)
  console.log(`      → 3 COMPLETED, 1 PAID, 1 PENDING, 1 CANCELLED`)
  console.log(`   🕐 Working Hours: 20 entries (Mon-Fri, 9am-6pm)`)

  console.log('\n🌐 CLOUDINARY IMAGES NEEDED:')
  console.log(`   Services: services/haircut, services/coloring, services/highlights, etc.`)
  console.log(`   Staff: staff/laura-thompson, staff/maria-rodriguez, staff/sofia-martinez, staff/ana-garcia`)
  console.log(`   Products: products/shampoo-premium, products/conditioner, products/serum, etc.`)
  console.log(`   Gallery: gallery/hair-1, gallery/hair-2, gallery/nails-1, etc.`)
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
