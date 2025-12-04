import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "@/components/icons"
import { ProductForm } from "@/components/dashboard/product-form"
import { getAllCategories } from "@/app/actions/services"

export default async function NewProductPage() {
  const categories = await getAllCategories()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/products">
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">New Product</h1>
          <p className="text-muted-foreground">
            Add a new product to your shop
          </p>
        </div>
      </div>

      {/* Form */}
      <ProductForm categories={categories} mode="create" />
    </div>
  )
}
