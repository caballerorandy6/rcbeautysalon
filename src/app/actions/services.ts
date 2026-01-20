"use server"

import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { ServiceFilters } from "@/lib/interfaces"
import { revalidatePath } from "next/cache"
import { CreateServiceInput } from "@/lib/interfaces"

export type UpdateServiceInput = Partial<CreateServiceInput>

// Get featured services for homepage display
export const getFeaturedServices = cache(async () => {
  const featuredServices = await prisma.service.findMany({
    where: {
      isFeatured: true,
      isActive: true,
    },
    orderBy: {
      order: "asc",
    },
    take: 5,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      duration: true,
      imageUrl: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  })

  // Convert Decimal to number for client components
  return featuredServices.map((service) => ({
    ...service,
    price: service.price.toNumber(),
  }))
})

// Get all active services grouped by category for /services page
export async function getAllServicesGroupedByCategory() {
  const servicesGrouped = await prisma.service.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
  })

  const grouped = servicesGrouped.reduce(
    (acc, service) => {
      const categoryName = service.category?.name || "Uncategorized"
      if (!acc[categoryName]) acc[categoryName] = []
      acc[categoryName].push(service)
      return acc
    },
    {} as Record<string, typeof servicesGrouped>
  )

  return grouped
}

// Get detailed service info by slug for /services/[slug] page
// Cached to avoid duplicate fetches in generateMetadata + page component
export const getServiceBySlug = cache(async (slug: string) => {
  return await prisma.service.findFirst({
    where: {
      slug,
      isActive: true,
    },
    include: {
      category: true,
      staffServices: {
        where: {
          staff: { isActive: true },
        },
        include: {
          staff: true,
        },
      },
      reviews: {
        where: { isActive: true },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
      gallery: {
        orderBy: {
          order: "asc",
        },
      },
      faqs: {
        orderBy: {
          order: "asc",
        },
      },
    },
  })
})

// Get all active service slugs for generateStaticParams
export async function getAllServiceSlugs() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: { slug: true },
  })

  return services.map((s) => s.slug)
}

// Get categories with count of active services for sidebar display
export const getCategoriesWithCount = cache(async () => {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          services: {
            where: { isActive: true },
          },
        },
      },
    },
  })
})

// Get related services by category (for "You might also like" section)
export async function getRelatedServices(
  categoryId: string | null,
  excludeServiceId: string
) {
  if (!categoryId) return []

  const services = await prisma.service.findMany({
    where: {
      categoryId,
      isActive: true,
      id: { not: excludeServiceId }, // Exclude current service
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      duration: true,
      imageUrl: true,
    },
    take: 3, // Limit to 3 related services
    orderBy: {
      order: "asc", // Show featured services first
    },
  })

  // Convert Decimal to number for client components
  return services.map((service) => ({
    ...service,
    price: service.price.toNumber(),
  }))
}

// Filter services with search, price, duration, staff, and sorting
export async function filterServices(filters: ServiceFilters) {
  const {
    search,
    categoryId,
    minPrice,
    maxPrice,
    minDuration,
    maxDuration,
    staffId,
    sortBy = "name_asc",
  } = filters

  // Build where clause
  const where: Prisma.ServiceWhereInput = {
    isActive: true,
  }

  // Text search in name and description
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  // Category filter
  if (categoryId) {
    where.categoryId = categoryId
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) where.price.gte = minPrice
    if (maxPrice !== undefined) where.price.lte = maxPrice
  }

  // Duration range filter
  if (minDuration !== undefined || maxDuration !== undefined) {
    where.duration = {}
    if (minDuration !== undefined) where.duration.gte = minDuration
    if (maxDuration !== undefined) where.duration.lte = maxDuration
  }

  // Staff filter
  if (staffId) {
    where.staffServices = {
      some: {
        staffId,
        staff: { isActive: true },
      },
    }
  }

  // Build orderBy clause
  let orderBy: Prisma.ServiceOrderByWithRelationInput = { name: "asc" }

  switch (sortBy) {
    case "price_asc":
      orderBy = { price: "asc" }
      break
    case "price_desc":
      orderBy = { price: "desc" }
      break
    case "duration_asc":
      orderBy = { duration: "asc" }
      break
    case "duration_desc":
      orderBy = { duration: "desc" }
      break
    case "name_asc":
      orderBy = { name: "asc" }
      break
    case "rating_desc":
    case "popularity_desc":
      // Will handle sorting after fetching
      orderBy = { name: "asc" }
      break
  }

  const services = await prisma.service.findMany({
    where,
    include: {
      category: true,
      _count: {
        select: {
          reviews: { where: { isActive: true } },
          appointmentServices: true,
        },
      },
      reviews: {
        where: { isActive: true },
        select: { rating: true },
      },
    },
    orderBy,
  })

  // Calculate average rating and sort by rating or popularity if needed
  const servicesWithStats = services.map((service) => {
    const avgRating =
      service.reviews.length > 0
        ? service.reviews.reduce((sum, r) => sum + r.rating, 0) /
          service.reviews.length
        : 0

    return {
      ...service,
      avgRating,
      reviewCount: service._count.reviews,
      appointmentCount: service._count.appointmentServices,
    }
  })

  // Sort by rating or popularity if requested
  if (sortBy === "rating_desc") {
    servicesWithStats.sort((a, b) => b.avgRating - a.avgRating)
  } else if (sortBy === "popularity_desc") {
    servicesWithStats.sort((a, b) => b.appointmentCount - a.appointmentCount)
  }

  // Group by category and convert Decimal to number for client
  const grouped = servicesWithStats.reduce<
    Record<
      string,
      Array<{
        id: string
        name: string
        slug: string
        description: string | null
        duration: number
        price: number
        imageUrl: string | null
        category: {
          id: string
          name: string
          slug: string
        } | null
      }>
    >
  >((acc, service) => {
    const categoryName = service.category?.name || "Uncategorized"
    if (!acc[categoryName]) acc[categoryName] = []

    // Convert Decimal to number for client components
    acc[categoryName].push({
      id: service.id,
      name: service.name,
      slug: service.slug,
      description: service.description,
      duration: service.duration,
      price: service.price.toNumber(),
      imageUrl: service.imageUrl,
      category: service.category,
    })
    return acc
  }, {})

  return grouped
}

// Get all active staff for filter dropdown
export const getAllActiveStaff = cache(async () => {
  return await prisma.staff.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  })
})

// Get all categories for filter dropdown
export const getAllCategories = cache(async () => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  })
  return categories
})

// Get Active Services for Booking
export async function getActiveServicesForBooking() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      duration: true,
      price: true,
    },
    orderBy: { name: "asc" },
  })

  return services.map((service) => ({
    ...service,
    price: service.price.toNumber(),
  }))
}

// Admin: Get all services with counts for management
export async function getAdminServices(search?: string) {
  const services = await prisma.service.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { category: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
    include: {
      category: {
        select: { name: true },
      },
      _count: {
        select: {
          appointmentServices: true,
          staffServices: true,
          reviews: true,
        },
      },
    },
    orderBy: { name: "asc" },
  })

  return services.map((service) => ({
    ...service,
    price: service.price.toNumber(),
  }))
}

// Admin: Get service statistics
export async function getServiceStats() {
  const [totalServices, activeServices, featuredServices, categoriesCount] =
    await Promise.all([
      prisma.service.count(),
      prisma.service.count({ where: { isActive: true } }),
      prisma.service.count({ where: { isFeatured: true } }),
      prisma.category.count(),
    ])

  return {
    totalServices,
    activeServices,
    featuredServices,
    categoriesCount,
  }
}

// Admin: Get service by ID with detailed info
export async function getServiceById(id: string) {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      category: true,
      staffServices: {
        include: {
          staff: true,
        },
      },
    },
  })

  if (!service) {
    return null
  }

  return {
    ...service,
    price: service.price.toNumber(),
  }
}

//Create Service
export async function createService(data: CreateServiceInput) {
  try {
    // Extract staffIds and categoryId from data
    const { staffIds, categoryId, ...serviceData } = data

    const service = await prisma.service.create({
      data: {
        ...serviceData,
        ...(categoryId && { category: { connect: { id: categoryId } } }),
      },
    })

    if (staffIds?.length) {
      await prisma.staffService.createMany({
        data: staffIds.map((staffId) => ({
          staffId,
          serviceId: service.id,
        })),
      })
    }

    revalidatePath("/dashboard/services")
    revalidatePath("/services")

    return {
      success: true,
      service: {
        ...service,
        price: service.price.toNumber(),
      },
    }
  } catch (error) {
    console.error("Error creating service:", error)
    return { success: false, error: "Failed to create service." }
  }
}

// Update Service
export async function updateService(id: string, data: UpdateServiceInput) {
  try {
    // Extract staffIds and categoryId from data
    const { staffIds, categoryId, ...serviceData } = data

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        ...serviceData,
        ...(categoryId !== undefined && {
          category: categoryId ? { connect: { id: categoryId } } : { disconnect: true },
        }),
      },
    })

    if (staffIds !== undefined) {
      await prisma.staffService.deleteMany({
        where: { serviceId: id },
      })
      if (staffIds.length) {
        await prisma.staffService.createMany({
          data: staffIds.map((staffId) => ({
            staffId,
            serviceId: id,
          })),
        })
      }
    }

    revalidatePath("/dashboard/services")
    revalidatePath("/services")

    return {
      success: true,
      service: {
        ...updatedService,
        price: updatedService.price.toNumber(),
      },
    }
  } catch (error) {
    console.error("Error updating service:", error)
    return { success: false, error: "Failed to update service." }
  }
}

// Delete Service
export async function deleteService(id: string) {
  try {
    const appointmentCount = await prisma.appointmentService.count({
      where: { serviceId: id },
    })

    if (appointmentCount > 0) {
      return {
        success: false,
        error:
          "Cannot delete service with existing appointments. Deactivate it instead.",
      }
    }
    await prisma.service.delete({
      where: { id },
    })

    revalidatePath("/dashboard/services")
    revalidatePath("/services")

    return { success: true }
  } catch (error) {
    console.error("Error deleting service:", error)
    return { success: false, error: "Failed to delete service." }
  }
}

// Toggle service active status
export async function toggleServiceStatus(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
      select: { isActive: true },
    })

    if (!service) {
      return { success: false, error: "Service not found" }
    }

    const updated = await prisma.service.update({
      where: { id },
      data: { isActive: !service.isActive },
    })

    revalidatePath("/dashboard/services")
    revalidatePath("/services")

    return { success: true, isActive: updated.isActive }
  } catch (error) {
    console.error("Error toggling service status:", error)
    return { success: false, error: "Failed to toggle service status." }
  }
}
