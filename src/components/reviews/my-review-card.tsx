"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { EditReviewDialog } from "@/components/reviews/edit-review-dialog"
import { StarIcon, TrashIcon, PencilIcon } from "@/components/icons"
import { deleteReview, updateReview } from "@/app/actions/reviews"
import { EditReviewInput } from "@/lib/validations/review"
import { toast } from "sonner"

// Review with service relation from getUserReviews
interface ReviewWithService {
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

interface MyReviewCardProps {
  review: ReviewWithService
}

export function MyReviewCard({ review }: MyReviewCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const handleConfirmDelete = () => {
    startTransition(async () => {
      const result = await deleteReview(review.id)
      if (result.success) {
        toast.success("Review deleted successfully")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to delete review")
      }
      setShowDeleteDialog(false)
    })
  }

  const handleEditSubmit = (data: EditReviewInput) => {
    startTransition(async () => {
      const result = await updateReview(review.id, data)
      if (result.success) {
        toast.success("Review updated successfully")
        setShowEditDialog(false)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update review")
      }
    })
  }

  return (
    <Card className={isPending ? "opacity-50" : ""}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Service Image */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
            {review.service.imageUrl ? (
              <Image
                src={review.service.imageUrl}
                alt={review.service.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-muted flex h-full w-full items-center justify-center">
                <span className="text-muted-foreground text-xs">No image</span>
              </div>
            )}
          </div>

          {/* Review Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <Link
                  href={`/services/${review.service.slug}`}
                  className="font-semibold hover:underline"
                >
                  {review.service.name}
                </Link>
                <div className="mt-1 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      size={16}
                      weight={star <= review.rating ? "fill" : "regular"}
                      className={
                        star <= review.rating
                          ? "text-accent"
                          : "text-muted-foreground"
                      }
                    />
                  ))}
                  <span className="text-muted-foreground ml-2 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                {/* Edit Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowEditDialog(true)}
                  disabled={isPending}
                  className="text-muted-foreground hover:text-primary h-8 w-8"
                >
                  <PencilIcon size={16} />
                </Button>
                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isPending}
                  className="text-destructive hover:text-destructive h-8 w-8"
                >
                  <TrashIcon size={16} />
                </Button>
              </div>
            </div>

            <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
              {review.comment}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Review"
        description={`Are you sure you want to delete your review for "${review.service.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />

      {/* Edit Review Dialog */}
      <EditReviewDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        serviceName={review.service.name}
        initialRating={review.rating}
        initialComment={review.comment}
        isPending={isPending}
        onSubmit={handleEditSubmit}
      />
    </Card>
  )
}
