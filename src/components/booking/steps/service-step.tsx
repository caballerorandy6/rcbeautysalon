import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "@phosphor-icons/react"

interface ServiceStepProps {
  service: {
    name: string
    price: number
    duration: number
    category: { name: string } | null
  }
}

export function ServiceStep({ service }: ServiceStepProps) {
  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            1
          </div>
          <CardTitle>Selected Service</CardTitle>
        </div>
        <CardDescription>Your chosen service</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h3 className="text-3xl font-bold text-primary">{service.name}</h3>
              {service.category && (
                <p className="text-sm text-muted-foreground">{service.category.name}</p>
              )}
            </div>
            <Badge variant="secondary" className="text-base">
              ${service.price.toFixed(2)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            <Clock size={14} className="mr-1 inline" weight="regular" />
            {service.duration} minutes
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
