"use client"

import { useState, useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StarIcon, SpinnerIcon } from "@/components/icons"
import { editReviewSchema, EditReviewInput } from "@/lib/validations/review"

interface EditReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  serviceName: string
  initialRating: number
  initialComment: string
  isPending: boolean
  onSubmit: (data: EditReviewInput) => void
}

export function EditReviewDialog({
  open,
  onOpenChange,
  serviceName,
  initialRating,
  initialComment,
  isPending,
  onSubmit,
}: EditReviewDialogProps) {
  const [hoveredRating, setHoveredRating] = useState(0)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<EditReviewInput>({
    resolver: zodResolver(editReviewSchema),
    defaultValues: {
      rating: initialRating,
      comment: initialComment,
    },
  })

  // Watch values for UI feedback
  const rating = useWatch({ control, name: "rating", defaultValue: initialRating })
  const comment = useWatch({ control, name: "comment", defaultValue: initialComment })

  // Reset form when dialog opens with new values
  useEffect(() => {
    if (open) {
      reset({
        rating: initialRating,
        comment: initialComment,
      })
    }
  }, [open, initialRating, initialComment, reset])

  const handleFormSubmit = (data: EditReviewInput) => {
    onSubmit(data)
  }

  // Rating labels
  const getRatingLabel = (value: number) => {
    const labels: Record<number, string> = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    }
    return labels[value] || ""
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogDescription>
            Update your review for{" "}
            <span className="font-medium">{serviceName}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Rating Stars */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={isPending}
                  className="rounded transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setValue("rating", star, { shouldValidate: true })}
                >
                  <StarIcon
                    size={32}
                    weight={star <= (hoveredRating || rating) ? "fill" : "regular"}
                    className={`transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "text-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {getRatingLabel(rating)}
              </p>
            )}
            {errors.rating && (
              <p className="text-sm text-destructive">{errors.rating.message}</p>
            )}
          </div>

          {/* Comment Textarea */}
          <div className="space-y-2">
            <Label htmlFor="edit-comment" className="text-base font-semibold">
              Comment
            </Label>
            <Textarea
              id="edit-comment"
              {...register("comment")}
              placeholder="Share your experience..."
              rows={4}
              disabled={isPending}
              className="resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground">
              {comment?.length || 0}/1000 characters (minimum 10)
            </p>
            {errors.comment && (
              <p className="text-sm text-destructive">{errors.comment.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <SpinnerIcon size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
