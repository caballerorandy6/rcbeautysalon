import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProductById, getShopProducts } from "@/app/actions/products"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Package,
  Truck,
  ShieldCheck,
  Star,
  Check,
  X,
} from "@phosphor-icons/react/dist/ssr"
import { AddToCartButton } from "@/components/shop/add-to-cart-button"

interface ProductDetailsProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const products = await getShopProducts()
  return products.map((product) => ({
    slug: product.id,
  }))
}

export async function generateMetadata({ params }: ProductDetailsProps) {
  const { slug } = await params
  const product = await getProductById(slug)

  if (!product) {
    return {
      title: "Product Not Found | RC Beauty Salon",
      description: "The requested product could not be found.",
    }
  }

  return {
    title: `${product.name} | RC Beauty Salon`,
    description:
      product.description || "Professional beauty products for beauty care.",
  }
}

export const revalidate = 60

const ProductDetails = async ({ params }: ProductDetailsProps) => {
  const { slug } = await params
  const product = await getProductById(slug)

  if (!product) {
    notFound()
  }

  const inStock = product.stockQuantity > 0
  const mainImage = product.images?.[0] || null

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 -ml-2 hover:bg-primary/10 hover:text-primary"
          asChild
        >
          <Link href="/shop">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>

        {/* Product Layout */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-sm">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted to-muted/50">
                  <Package
                    size={80}
                    weight="light"
                    className="text-muted-foreground/40"
                  />
                </div>
              )}

              {/* Badges */}
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {product.isFeatured && (
                  <Badge className="bg-accent text-accent-foreground shadow-md">
                    Featured
                  </Badge>
                )}
                {!inStock && (
                  <Badge variant="destructive" className="shadow-md">
                    Out of Stock
                  </Badge>
                )}
                {product.compareAtPrice && inStock && (
                  <Badge className="bg-primary text-primary-foreground shadow-md">
                    Sale
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 border-border/50 transition-all hover:border-primary"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col">
            {/* Category */}
            {product.category && (
              <p className="mb-2 text-sm font-medium text-primary">
                {product.category.name}
              </p>
            )}

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold lg:text-4xl">
              {product.name}
            </h1>

            {/* Rating Placeholder */}
            <div className="mb-4 flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    weight="fill"
                    className="text-accent"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                (0 reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6 flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
              {product.compareAtPrice && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Save ${(product.compareAtPrice - product.price).toFixed(2)}
                </Badge>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6 flex items-center gap-2">
              {inStock ? (
                <>
                  <Check size={20} weight="bold" className="text-green-600" />
                  <span className="font-medium text-green-600">
                    In Stock ({product.stockQuantity} available)
                  </span>
                </>
              ) : (
                <>
                  <X size={20} weight="bold" className="text-destructive" />
                  <span className="font-medium text-destructive">
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h3 className="mb-2 font-semibold">Description</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </div>
            )}

            <Separator className="my-6" />

            {/* Add to Cart */}
            <div className="mb-6">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  image: mainImage,
                  price: product.price,
                }}
                inStock={inStock}
              />
            </div>

            {/* Trust Features */}
            <Card className="border-border/50 bg-muted/30">
              <CardContent className="grid gap-4 p-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Truck size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">
                      On orders over $50
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <ShieldCheck size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Secure Payment</p>
                    <p className="text-xs text-muted-foreground">
                      100% protected
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SKU */}
            {product.sku && (
              <p className="mt-6 text-sm text-muted-foreground">
                SKU: {product.sku}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
