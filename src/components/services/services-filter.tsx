"use client"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MagnifyingGlass, X, Sliders } from "@phosphor-icons/react"
import { ServiceFilters, ServicesFilterProps } from "@/lib/interfaces"

export function ServicesFilter({
  categories,
  staff,
  onFilterChange,
  isLoading
}: ServicesFilterProps) {
  const [isPending, startTransition] = useTransition()
  const [filters, setFilters] = useState<ServiceFilters>({})
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (newFilters: Partial<ServiceFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)

    startTransition(() => {
      onFilterChange(updatedFilters)
    })
  }

  const clearFilters = () => {
    setFilters({})

    startTransition(() => {
      onFilterChange({})
    })
  }

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof ServiceFilters]
    return value !== undefined && value !== "" && value !== null
  })

  return (
    <div className="mb-8 space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlass size={16} weight="regular" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search services..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            className="pl-10"
            disabled={isPending || isLoading}
          />
        </div>

        {/* Sort */}
        <Select
          value={filters.sortBy || "name_asc"}
          onValueChange={(value) =>
            handleFilterChange({ sortBy: value as ServiceFilters["sortBy"] })
          }
          disabled={isPending || isLoading}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            <SelectItem value="price_asc">Price (Low-High)</SelectItem>
            <SelectItem value="price_desc">Price (High-Low)</SelectItem>
            <SelectItem value="duration_asc">Duration (Short-Long)</SelectItem>
            <SelectItem value="duration_desc">Duration (Long-Short)</SelectItem>
            <SelectItem value="rating_desc">Highest Rated</SelectItem>
            <SelectItem value="popularity_desc">Most Popular</SelectItem>
          </SelectContent>
        </Select>

        {/* Toggle Advanced Filters */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="shrink-0"
        >
          <Sliders size={16} weight="regular" />
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filters.categoryId || "all"}
              onValueChange={(value) =>
                handleFilterChange({ categoryId: value === "all" ? undefined : value })
              }
              disabled={isPending || isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Staff Filter */}
          <div className="space-y-2">
            <Label>Staff Member</Label>
            <Select
              value={filters.staffId || "all"}
              onValueChange={(value) =>
                handleFilterChange({ staffId: value === "all" ? undefined : value })
              }
              disabled={isPending || isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Staff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Staff</SelectItem>
                {staff.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  handleFilterChange({
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                min={0}
                disabled={isPending || isLoading}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  handleFilterChange({
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                min={0}
                disabled={isPending || isLoading}
              />
            </div>
          </div>

          {/* Duration Range */}
          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.minDuration || ""}
                onChange={(e) =>
                  handleFilterChange({
                    minDuration: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                min={0}
                disabled={isPending || isLoading}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxDuration || ""}
                onChange={(e) =>
                  handleFilterChange({
                    maxDuration: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                min={0}
                disabled={isPending || isLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            disabled={isPending || isLoading}
          >
            <X size={16} weight="regular" className="mr-2" />
            Clear Filters
          </Button>
        </div>
      )}

      {/* Loading Indicator */}
      {(isPending || isLoading) && (
        <div className="text-center text-sm text-muted-foreground">
          Filtering services...
        </div>
      )}
    </div>
  )
}
