"use client"

import { Input } from "@/components/ui/input"
import { MagnifyingGlass } from "@phosphor-icons/react"

interface SearchInputProps {
  placeholder?: string
  className?: string
}

export function SearchInput({
  placeholder = "Search products...",
  className = ""
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <MagnifyingGlass
        size={16}
        weight="regular"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  )
}
