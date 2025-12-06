"use server"

import { auth } from "@/lib/auth/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { ReviewFormData } from "@/lib/interfaces"

// Create a new review for a service
export async function createReview(data: ReviewFormData) {
  // Ensure user is authenticated
  const session = await auth()

  if (!session?.user) {
    return {
      success: false,
      error: "You must be logged in to submit a review.",
    }
  }

  // Validate rating (1-5)
  if (data.rating < 1 || data.rating > 5) {
    return {
      success: false,
      error: "Rating must be between 1 and 5.",
    }
  }

  // Validate comment (minimum 10 characters, maximum 1000)
  const comment = data.comment.trim()
  if (comment.length < 10 || comment.length > 1000) {
    return {
      success: false,
      error: "Comment must be between 10 and 1000 characters.",
    }
  }

  // Verify service exists and is active
  const service = await prisma.service.findUnique({
    where: { id: data.serviceId },
    select: { id: true, slug: true, isActive: true },
  })

  if (!service || !service.isActive) {
    return {
      success: false,
      error: "Service not found or not available.",
    }
  }

  try {
    // Create review with auto-approval
    const review = await prisma.review.create({
      data: {
        rating: data.rating,
        comment,
        userId: session.user.id,
        serviceId: data.serviceId,
        isActive: true, // Auto-approve all reviews
      },
    })

    // Revalidate service page and services list
    revalidatePath(`/services/${service.slug}`)
    revalidatePath("/services")

    return {
      success: true,
      review,
    }
  } catch (error) {
    console.error("Error creating review:", error)
    return {
      success: false,
      error: "Failed to create review. Please try again.",
    }
  }
}

// Get all reviews by the current user
export async function getUserReviews() {
  const session = await auth()

  if (!session?.user) {
    return {
      success: false,
      error: "You must be logged in to view your reviews.",
      reviews: [],
    }
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { userId: session.user.id },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, reviews }
  } catch (error) {
    console.error("Error fetching user reviews:", error)
    return {
      success: false,
      error: "Failed to fetch reviews.",
      reviews: [],
    }
  }
}

// Delete a review (only owner can delete)
export async function deleteReview(reviewId: string) {
  const session = await auth()

  if (!session?.user) {
    return {
      success: false,
      error: "You must be logged in to delete a review.",
    }
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        service: { select: { slug: true } },
      },
    })

    if (!review) {
      return { success: false, error: "Review not found." }
    }

    if (review.userId !== session.user.id) {
      return { success: false, error: "You can only delete your own reviews." }
    }

    await prisma.review.delete({
      where: { id: reviewId },
    })

    revalidatePath("/my-reviews")
    if (review.service?.slug) {
      revalidatePath(`/services/${review.service.slug}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error deleting review:", error)
    return { success: false, error: "Failed to delete review." }
  }
}

// Update a review (only owner can update)
export async function updateReview(
  reviewId: string,
  data: { rating: number; comment: string }
) {
  const session = await auth()

  if (!session?.user) {
    return {
      success: false,
      error: "You must be logged in to update a review.",
    }
  }
  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        service: { select: { slug: true } },
      },
    })

    if (!review) {
      return { success: false, error: "Review not found." }
    }

    if (review.userId !== session.user.id) {
      return { success: false, error: "You can only update your own reviews." }
    }

    // Validate comment length
    if (data.comment.length < 10 || data.comment.length > 1000) {
      return {
        success: false,
        error: "Comment must be between 10 and 1000 characters.",
      }
    }

    // Update the review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: data.rating,
        comment: data.comment,
      },
    })

    revalidatePath("/my-reviews")
    if (review.service?.slug) {
      revalidatePath(`/services/${review.service.slug}`)
    }

    return { success: true, review: updatedReview }
  } catch (error) {
    console.error("Error updating review:", error)
    return { success: false, error: "Failed to update review." }
  }
}

// Get all reviews for a specific service
export async function getServiceReviews(serviceId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { serviceId, isActive: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return { success: true, reviews }
  } catch (error) {
    console.error("Error fetching service reviews:", error)
    return {
      success: false,
      error: "Failed to fetch reviews.",
      reviews: [],
    }
  }
}
