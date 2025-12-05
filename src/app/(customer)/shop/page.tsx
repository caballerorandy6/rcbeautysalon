import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CartButton } from "@/components/shop/cart-button"
import { SearchInput } from "@/components/shop/search-input"
import { Package } from "@phosphor-icons/react/dist/ssr"
import { AddToCartButton } from "@/components/shop/add-to-cart-button"
import { getShopProducts } from "@/app/actions/products"

export const metadata: Metadata = {
  title: "Shop | RC Beauty Salon",
  description:
    "Professional beauty products for home care. Hair care, skin care, and nail care products.",
}

export const revalidate = 60

interface ShopPageProps {
  searchParams: Promise<{ search?: string }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { search } = await searchParams
  const allProducts = await getShopProducts()

  // Filter products based on search query
  const products = search
    ? allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description?.toLowerCase().includes(search.toLowerCase())
      )
    : allProducts

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Our Shop</h1>
              <p className="text-muted-foreground">
                Professional beauty products for home care
              </p>
            </div>
            <div className="hidden md:block">
              <CartButton />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-muted/30 border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <SearchInput className="flex-1 md:max-w-md" />
            <Button variant="outline" size="sm" asChild>
              <Link href="/shop">All Products</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const inStock = product.stockQuantity > 0
            const imageUrl = product.images?.[0] || null

            return (
              <Card
                key={product.id}
                className="group border-primary/10 overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <CardHeader className="p-0">
                  {/* Product Image */}
                  <div className="bg-muted relative aspect-square overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="from-muted to-muted/50 flex h-full w-full items-center justify-center bg-linear-to-br">
                        <Package
                          size={48}
                          weight="light"
                          className="text-muted-foreground/50"
                        />
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {product.isFeatured && (
                        <Badge className="bg-accent text-accent-foreground">
                          Featured
                        </Badge>
                      )}
                      {!inStock && (
                        <Badge variant="destructive">Out of Stock</Badge>
                      )}
                      {product.compareAtPrice && inStock && (
                        <Badge
                          variant="secondary"
                          className="bg-primary text-primary-foreground"
                        >
                          Sale
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="group-hover:text-accent mb-2 text-lg transition-colors">
                    {product.name}
                  </CardTitle>
                  {product.description && (
                    <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-muted-foreground text-sm line-through">
                        ${product.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 p-4 pt-0">
                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: product.name,
                      image: imageUrl,
                      price: product.price,
                    }}
                    inStock={inStock}
                  />
                  <Button
                    variant="outline"
                    className="border-primary/50 hover:bg-primary hover:text-primary-foreground w-full"
                    asChild
                  >
                    <Link href={`/shop/${product.id}`}>See Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Mobile Cart Button */}
      <div className="fixed right-4 bottom-4 md:hidden">
        <CartButton mobile />
      </div>
    </div>
  )
}
