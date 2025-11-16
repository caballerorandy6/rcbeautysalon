import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart } from "lucide-react"

export default function TiendaPage() {
  const products = [
    {
      id: 1,
      name: "Premium Shampoo",
      price: 29.99,
      compareAtPrice: 39.99,
      image: null,
      isFeatured: true,
      inStock: true,
    },
    {
      id: 2,
      name: "Hair Conditioner",
      price: 24.99,
      image: null,
      isFeatured: false,
      inStock: true,
    },
    {
      id: 3,
      name: "Hair Styling Gel",
      price: 19.99,
      image: null,
      isFeatured: true,
      inStock: true,
    },
    {
      id: 4,
      name: "Hair Serum",
      price: 34.99,
      image: null,
      isFeatured: false,
      inStock: false,
    },
    {
      id: 5,
      name: "Nail Polish Set",
      price: 44.99,
      image: null,
      isFeatured: true,
      inStock: true,
    },
    {
      id: 6,
      name: "Face Mask",
      price: 15.99,
      image: null,
      isFeatured: false,
      inStock: true,
    },
  ]

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
            <Button size="lg" className="hidden md:flex">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Cart (0)
            </Button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="border-b bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9"
              />
            </div>
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
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="p-0">
                {/* Product Image Placeholder */}
                <div className="relative aspect-square bg-muted">
                  {product.isFeatured && (
                    <Badge className="absolute right-2 top-2">Featured</Badge>
                  )}
                  {!product.inStock && (
                    <Badge variant="destructive" className="absolute right-2 top-2">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="mb-2 text-lg">{product.name}</CardTitle>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">${product.price}</span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.compareAtPrice}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full"
                  disabled={!product.inStock}
                  variant={product.inStock ? "default" : "secondary"}
                >
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Mobile Cart Button */}
      <div className="fixed bottom-4 right-4 md:hidden">
        <Button size="lg" className="rounded-full shadow-lg">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Cart (0)
        </Button>
      </div>
    </div>
  )
}
