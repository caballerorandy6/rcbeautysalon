"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link"
import Image from "next/image"
import { ToteIcon } from "@/components/icons"
import { useCartStore } from "@/store/cart-store"

interface ProductCardProps {
  id: string
  name: string
  price: number
  category: string
  image?: string | null
}

export function ProductCard({ id, name, price, category, image }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      productId: id,
      name,
      image: image ?? null,
      price,
    })
  }

  return (
    <Card className="group border-primary/10 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="bg-muted/30 relative aspect-square overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted to-muted/50">
            <ToteIcon size={48} weight="light" className="text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-semibold">
            {category}
          </span>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-lg group-hover:text-accent transition-colors">{name}</CardTitle>
        <CardDescription className="text-primary text-xl font-bold group-hover:text-accent transition-colors">
          ${price.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Link href={`/shop/${id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full border-primary/50 hover:bg-primary hover:text-primary-foreground"
            >
              See Details
            </Button>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleAddToCart}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <ToteIcon size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to Cart</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  )
}
