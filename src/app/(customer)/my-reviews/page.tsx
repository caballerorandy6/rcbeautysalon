import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth/auth"
import { MyReviewsList } from "@/components/reviews/my-reviews-list"
import { getUserReviews } from "@/app/actions/reviews"

export const metadata: Metadata = {
  title: "My Reviews | RC Beauty Salon",
  description: "View and manage your service reviews.",
}

export default async function MyReviewsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login?callbackUrl=/my-reviews")
  }

  const { reviews } = await getUserReviews()

  return (
    <div className="from-muted/30 via-background to-muted/20 min-h-screen bg-linear-to-b py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="from-primary to-accent mb-2 bg-linear-to-r bg-clip-text text-4xl font-bold text-transparent">
            My Reviews
          </h1>
          <p className="text-muted-foreground text-lg">
            View and manage your service reviews
          </p>
        </div>

        {/* Reviews List */}
        <MyReviewsList reviews={reviews} />
      </div>
    </div>
  )
}
