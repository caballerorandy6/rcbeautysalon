"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, StarHalf } from "@phosphor-icons/react"
import { cloudinaryPresets } from "@/lib/utils/cloudinary"

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: Date
  user: {
    name: string | null
    image: string | null
  }
}

interface ReviewsSectionProps {
  reviews: Review[]
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const emptyStars = 5 - Math.ceil(rating)

  return (
    <div className="flex items-center gap-1">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} size={16} weight="fill" className="text-accent" />
      ))}

      {/* Half star */}
      {hasHalfStar && <StarHalf size={16} weight="fill" className="text-accent" />}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} size={16} weight="regular" className="text-muted-foreground/30" />
      ))}
    </div>
  )
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (reviews.length === 0) {
    return null // Don't show section if no reviews
  }

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  return (
    <section className="border-t border-primary/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="font-heading mb-4 text-4xl md:text-5xl">
              Customer{" "}
              <span className="from-primary to-accent bg-linear-to-r bg-clip-text text-transparent">
                Reviews
              </span>
            </h2>

            {/* Average Rating */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
                <div className="flex flex-col items-start">
                  <StarRating rating={averageRating} />
                  <span className="text-sm text-muted-foreground">
                    {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="flex flex-wrap gap-6 justify-center items-stretch">
            {reviews.map((review) => (
              <Card key={review.id} className="border-primary/10 w-full md:w-[calc(50%-0.75rem)] flex flex-col">
                <CardContent className="pt-6 flex flex-col flex-1">
                  {/* User Info */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {review.user.image && (
                          <AvatarImage
                            src={cloudinaryPresets.userAvatar(review.user.image)}
                            alt={review.user.name || "User"}
                          />
                        )}
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {review.user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{review.user.name || "Anonymous"}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>

                  {/* Review Comment */}
                  <p className="text-muted-foreground leading-relaxed flex-1">
                    {review.comment}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
