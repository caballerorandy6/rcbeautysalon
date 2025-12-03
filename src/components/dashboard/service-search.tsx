"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { SearchIcon } from "@/components/icons"

interface ServiceSearchProps {
  initialSearch?: string
}

export function ServiceSearch({ initialSearch = "" }: ServiceSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(initialSearch)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Skip if search hasn't changed from initial
    if (search === initialSearch && !debounceRef.current) return

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Debounce - wait 300ms after user stops typing
    debounceRef.current = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (search) {
          params.set("search", search)
        } else {
          params.delete("search")
        }
        router.push(`/dashboard/services?${params.toString()}`)
      })
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [search, initialSearch, router, searchParams, startTransition])

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="relative">
          <SearchIcon
            size={16}
            className={`text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 ${isPending ? "animate-pulse" : ""}`}
          />
          <Input
            placeholder="Search services by name or category..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
