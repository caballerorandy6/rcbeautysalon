"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "@/components/icons"
import { useSearchParams, useRouter } from "next/navigation"

interface SearchInputProps {
  placeholder?: string
  className?: string
}

export function SearchInput({
  placeholder = "Search products...",
  className = "",
}: SearchInputProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("search") || ""

  const [inputValue, setInputValue] = useState(query)

  // Sync state with URL when query changes (e.g., "All Products" button clicked)
  useEffect(() => {
    setInputValue(query)
  }, [query])

  // Debounced URL update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== query) {
        if (inputValue.trim()) {
          router.push(`/shop?search=${encodeURIComponent(inputValue.trim())}`)
        } else {
          router.push("/shop")
        }
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue, query, router])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  return (
    <div className={`relative ${className}`}>
      <SearchIcon
        size={16}
        weight="regular"
        className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
      />
      <Input
        onChange={handleInputChange}
        value={inputValue}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  )
}
