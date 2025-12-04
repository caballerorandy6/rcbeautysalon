import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "@/components/icons"
import { ProductForm } from "@/components/dashboard/product-form"
import { getProductById } from "@/app/actions/products"
import { getAllCategories } from "@/app/actions/services"

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params

  // Fetch product and categories in parallel
  const [product, categories] = await Promise.all([
    getProductById(id),
    getAllCategories(),
  ])

  if (!product) {
    notFound()
  }

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
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">{product.name}</p>
        </div>
      </div>

      {/* Form */}
      <ProductForm
        categories={categories}
        product={product}
        mode="edit"
      />
    </div>
  )
}
