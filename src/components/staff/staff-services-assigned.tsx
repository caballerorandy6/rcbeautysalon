"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ClockIcon, CurrencyDollarIcon, ScissorsIcon } from "@/components/icons"

interface AssignedService {
  id: string
  name: string
  duration: number
  price: number
  category?: {
    id: string
    name: string
  } | null
}

interface StaffServicesAssignedProps {
  services: AssignedService[]
}

export function StaffServicesAssigned({ services }: StaffServicesAssignedProps) {
  // Group services by category
  const groupedServices = services.reduce(
    (acc, service) => {
      const categoryName = service.category?.name || "Other"
      if (!acc[categoryName]) {
        acc[categoryName] = []
      }
      acc[categoryName].push(service)
      return acc
    },
    {} as Record<string, AssignedService[]>
  )

  const categories = Object.keys(groupedServices)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScissorsIcon size={20} className="text-primary" />
            <CardTitle className="text-lg">Assigned Services</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {services.length} service{services.length !== 1 ? "s" : ""}
          </Badge>
        </div>
        <CardDescription>
          Services you&apos;re qualified to provide
        </CardDescription>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-8 text-center">
            <ScissorsIcon size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No services assigned yet</p>
            <p className="mt-1 text-xs">Contact admin to assign services</p>
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((category, catIndex) => (
              <div key={category}>
                {/* Category Header */}
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-medium">
                    {category}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    ({groupedServices[category].length})
                  </span>
                </div>

                {/* Services List */}
                <div className="space-y-2">
                  {groupedServices[category].map((service) => (
                    <div
                      key={service.id}
                      className="bg-muted/30 hover:bg-muted/50 flex items-center justify-between rounded-lg p-3 transition-colors sm:p-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{service.name}</p>
                        <div className="text-muted-foreground mt-1 flex items-center gap-3 text-sm">
                          <span className="flex items-center gap-1">
                            <ClockIcon size={14} />
                            {service.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <CurrencyDollarIcon size={14} />$
                            {service.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {catIndex < categories.length - 1 && (
                  <Separator className="mt-6" />
                )}
              </div>
            ))}

            {/* Summary */}
            <div className="bg-primary/5 border-primary/20 mt-4 rounded-xl border p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Services</span>
                <span className="font-semibold">{services.length}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Categories</span>
                <span className="font-semibold">{categories.length}</span>
              </div>
              <Separator className="bg-primary/20 my-3" />
              <p className="text-muted-foreground text-xs">
                Contact admin to update your service assignments
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
