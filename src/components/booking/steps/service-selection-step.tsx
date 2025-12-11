import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClockIcon, CheckCircleIcon } from "@/components/icons"
import { cn } from "@/lib/utils"
import { ServiceListItem } from "@/lib/interfaces"

interface ServiceSelectionStepProps {
  services: ServiceListItem[]
  selectedServiceId: string
  onSelectService: (serviceId: string) => void
  error?: string
}

export function ServiceSelectionStep({
  services,
  selectedServiceId,
  onSelectService,
  error,
}: ServiceSelectionStepProps) {
  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            1
          </div>
          <CardTitle>Select Service</CardTitle>
        </div>
        <CardDescription>Choose a service for your appointment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((service) => {
            const isSelected = selectedServiceId === service.id
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => onSelectService(service.id)}
                className={cn(
                  "relative flex flex-col rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50 hover:shadow-md",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-card"
                )}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute -right-2 -top-2">
                    <CheckCircleIcon
                      size={24}
                      weight="fill"
                      className="text-primary"
                    />
                  </div>
                )}

                {/* Service name and category */}
                <div className="mb-2">
                  <h4 className={cn(
                    "font-semibold",
                    isSelected ? "text-primary" : "text-foreground"
                  )}>
                    {service.name}
                  </h4>
                  {service.category && (
                    <p className="text-xs text-muted-foreground">
                      {service.category.name}
                    </p>
                  )}
                </div>

                {/* Description */}
                {service.description && (
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                )}

                {/* Price and duration */}
                <div className="mt-auto flex items-center justify-between">
                  <Badge
                    variant={isSelected ? "default" : "secondary"}
                    className="text-sm"
                  >
                    ${service.price.toFixed(2)}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ClockIcon size={12} />
                    {service.duration} min
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-3 text-sm text-destructive">{error}</p>
        )}
      </CardContent>
    </Card>
  )
}
