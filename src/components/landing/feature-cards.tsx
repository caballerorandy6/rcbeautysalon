import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SparkleIcon, UsersIcon, ShoppingBagIcon } from "@/components/icons"

export function FeatureCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="border-primary/20 from-primary/5 hover:border-primary/30 group bg-linear-to-br to-transparent transition-all hover:shadow-lg">
        <CardHeader>
          <div className="from-primary to-primary/80 group-hover:shadow-accent/20 mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br shadow-md transition-shadow">
            <SparkleIcon size={24} weight="duotone" className="text-white" />
          </div>
          <CardTitle className="group-hover:text-primary transition-colors">
            Easy Booking
          </CardTitle>
          <CardDescription>
            Book your appointment online 24/7. Quick, simple, and secure.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="border-primary/30 from-primary/8 hover:border-primary/40 group bg-linear-to-br to-transparent transition-all hover:shadow-xl">
        <CardHeader>
          <div className="from-primary to-primary/80 ring-accent/30 group-hover:shadow-accent/30 mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br shadow-md ring-2 transition-all">
            <UsersIcon size={24} weight="duotone" className="text-white" />
          </div>
          <CardTitle className="group-hover:text-primary transition-colors">
            Expert Stylists
          </CardTitle>
          <CardDescription>
            Our experienced team is dedicated to making you look and feel
            amazing.
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="border-primary/20 from-primary/5 hover:border-primary/30 group bg-linear-to-br to-transparent transition-all hover:shadow-lg">
        <CardHeader>
          <div className="from-primary to-primary/80 group-hover:shadow-accent/20 mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br shadow-md transition-shadow">
            <ShoppingBagIcon size={24} weight="duotone" className="text-white" />
          </div>
          <CardTitle className="group-hover:text-primary transition-colors">
            Premium Products
          </CardTitle>
          <CardDescription>
            Shop professional-grade beauty products used by our experts.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
