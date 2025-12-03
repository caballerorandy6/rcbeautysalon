"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Tote } from "@phosphor-icons/react"

interface ProductCardProps {
  name: string
  price: string
  category: string
  image?: string | null
}

export function ProductCard({ name, price, category, image }: ProductCardProps) {
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
            <Tote size={48} weight="light" className="text-muted-foreground/50" />
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
          {price}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Link href="/shop" className="flex-1">
            <Button
              variant="outline"
              className="border-primary/50 hover:bg-primary/5 w-full"
            >
              View Details
            </Button>
          </Link>
          <Button className="from-primary to-accent bg-linear-to-r hover:opacity-90">
            <Tote size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
