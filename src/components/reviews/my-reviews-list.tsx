"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StarIcon, ScissorsIcon } from "@/components/icons"
import { MyReviewCard } from "./my-review-card"

// TODO: Import proper type from Prisma when implementing logic
interface Review {
  id: string
  rating: number
  comment: string
  createdAt: Date
  service: {
    id: string
    name: string
    slug: string
    imageUrl: string | null
  }
}

interface MyReviewsListProps {
  reviews: Review[]
}

export function MyReviewsList({ reviews }: MyReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <StarIcon size={32} className="text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No reviews yet</h3>
          <p className="text-muted-foreground mb-6 text-center max-w-sm">
            After completing a service, you can leave a review to help others
            and share your experience.
          </p>
          <Button asChild>
            <Link href="/services">
              <ScissorsIcon size={16} className="mr-2" />
              Browse Services
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <MyReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}
