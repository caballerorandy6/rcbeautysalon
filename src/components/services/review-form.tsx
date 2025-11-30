"use client"

import { useState, useTransition } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "@phosphor-icons/react"
import { createReview } from "@/app/actions/services"
import { ReviewFormProps } from "@/lib/interfaces"
import { reviewSchema, ReviewInput } from "@/lib/validations/review"

export function ReviewForm({ serviceId, serviceName }: ReviewFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [hoveredRating, setHoveredRating] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    control,
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      serviceId,
    },
  })

  // Use useWatch instead of watch for React Compiler compatibility
  const rating = useWatch({ control, name: "rating", defaultValue: 0 })
  const comment = useWatch({ control, name: "comment", defaultValue: "" })

  const onSubmit = (data: ReviewInput) => {
    setError(null)
    setSuccess(false)

    startTransition(async () => {
      const result = await createReview(data)

      if (result.success) {
        setSuccess(true)
        reset()
        router.refresh() // Refresh server data to show new review
        setTimeout(() => setSuccess(false), 5000)
      } else {
        setError(result.error || "Failed to submit review")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label className="text-base font-semibold">
          Rate your experience with {serviceName}
        </Label>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setValue("rating", star, { shouldValidate: true })}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              disabled={isPending}
            >
              <Star
                size={32}
                weight={star <= (hoveredRating || rating) ? "fill" : "regular"}
                className={`${
                  star <= (hoveredRating || rating)
                    ? "text-accent"
                    : "text-muted-foreground"
                } transition-colors`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="mt-1 text-sm text-muted-foreground">
            You rated {rating} out of 5 stars
          </p>
        )}
        {errors.rating && (
          <p className="mt-1 text-sm text-destructive">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="comment" className="text-base font-semibold">
          Share your thoughts
        </Label>
        <Textarea
          id="comment"
          {...register("comment")}
          placeholder="Tell us about your experience with this service..."
          className="mt-2 min-h-[120px] resize-none"
          disabled={isPending}
          maxLength={1000}
        />
        <p className="mt-1 text-sm text-muted-foreground">
          {comment?.length || 0}/1000 characters (minimum 10)
        </p>
        {errors.comment && (
          <p className="mt-1 text-sm text-destructive">{errors.comment.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-success/10 p-3 text-sm text-success">
          Thank you for your review! It has been submitted successfully.
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
