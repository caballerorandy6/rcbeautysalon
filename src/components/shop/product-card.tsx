import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  name: string
  price: number
  image?: string
  isFeatured?: boolean
}

export function ProductCard({ name, price, image, isFeatured }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        {isFeatured && <Badge className="w-fit">Featured</Badge>}
        {image && (
          <div className="aspect-square overflow-hidden rounded-md bg-muted">
            {/* Product image would go here */}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg">{name}</CardTitle>
        <p className="mt-2 text-2xl font-bold">${price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  )
}
