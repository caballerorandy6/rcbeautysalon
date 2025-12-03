import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CartButton } from "@/components/shop/cart-button"
import { SearchInput } from "@/components/shop/search-input"
import { prisma } from "@/lib/prisma"
import { Package } from "@phosphor-icons/react/dist/ssr"

export const dynamic = "force-dynamic"

async function getShopProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  })

  return products.map((product) => ({
    ...product,
    price: product.price.toNumber(),
    compareAtPrice: product.compareAtPrice?.toNumber() ?? null,
  }))
}

export default async function ShopPage() {
  const products = await getShopProducts()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-background">
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
      <div className="border-b bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <SearchInput className="flex-1 md:max-w-md" />
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                All Products
              </Button>
              <Button variant="outline" size="sm">
                Hair Care
              </Button>
              <Button variant="outline" size="sm">
                Nail Care
              </Button>
              <Button variant="outline" size="sm">
                Skin Care
              </Button>
            </div>
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
              <Card key={product.id} className="group overflow-hidden border-primary/10 transition-all duration-300 hover:shadow-xl">
                <CardHeader className="p-0">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted to-muted/50">
                        <Package size={48} weight="light" className="text-muted-foreground/50" />
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute right-2 top-2 flex flex-col gap-1">
                      {product.isFeatured && (
                        <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                      )}
                      {!inStock && (
                        <Badge variant="destructive">Out of Stock</Badge>
                      )}
                      {product.compareAtPrice && inStock && (
                        <Badge variant="secondary" className="bg-primary text-primary-foreground">
                          Sale
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="mb-2 text-lg group-hover:text-accent transition-colors">
                    {product.name}
                  </CardTitle>
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full"
                    disabled={!inStock}
                    variant={inStock ? "default" : "secondary"}
                  >
                    {inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Mobile Cart Button */}
      <div className="fixed bottom-4 right-4 md:hidden">
        <CartButton mobile />
      </div>
    </div>
  )
}
