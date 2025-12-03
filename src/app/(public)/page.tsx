import { getFeaturedServices } from "@/app/actions/services"
import { getFeaturedProducts } from "@/app/actions/products"
import { getFeaturedStaff } from "@/app/actions/staff"
import { HomeContent } from "@/components/landing/home-content"

export default async function HomePage() {
  const [featuredServices, featuredProducts, featuredStaff] = await Promise.all([
    getFeaturedServices(),
    getFeaturedProducts(),
    getFeaturedStaff(),
  ])

  return (
    <HomeContent
      featuredServices={featuredServices}
      featuredProducts={featuredProducts}
      featuredStaff={featuredStaff}
    />
  )
}
