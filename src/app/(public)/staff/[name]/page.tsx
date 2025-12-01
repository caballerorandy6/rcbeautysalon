import { getStaffMembers, getStaffMemberBySlug } from "@/app/actions/staff"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { cloudinaryPresets } from "@/lib/utils/cloudinary"
import {
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
  StarIcon,
  CalendarIcon,
} from "@/components/icons"

interface StaffDetailPageProps {
  params: Promise<{ name: string }>
}

// Generate slug from name
const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")

export async function generateStaticParams() {
  const staffMembers = await getStaffMembers()
  return staffMembers.map((staff) => ({
    name: generateSlug(staff.name),
  }))
}

export async function generateMetadata({ params }: StaffDetailPageProps) {
  const { name } = await params
  const staffMember = await getStaffMemberBySlug(name)

  if (!staffMember) {
    return {
      title: "Staff Member Not Found | RC Beauty Salon",
    }
  }

  return {
    title: `${staffMember.name} | RC Beauty Salon`,
    description:
      staffMember.bio || `Book an appointment with ${staffMember.name} at RC Beauty Salon`,
  }
}

// Day names for working hours
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

const StaffDetailPage = async ({ params }: StaffDetailPageProps) => {
  const { name } = await params
  const staffMember = await getStaffMemberBySlug(name)

  if (!staffMember) {
    notFound()
  }

  // Convert Decimal to number for services
  const services = staffMember.services.map((s) => ({
    ...s.service,
    price: Number(s.service.price),
  }))

  // Sort working hours by day
  const workingHours = [...staffMember.workingHours].sort(
    (a, b) => a.dayOfWeek - b.dayOfWeek
  )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Image */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative aspect-3/4 overflow-hidden rounded-3xl shadow-2xl">
                {staffMember.image ? (
                  <Image
                    src={cloudinaryPresets.staffCard(staffMember.image)}
                    alt={staffMember.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/20 to-accent/20">
                    <span className="text-6xl text-muted-foreground">
                      {staffMember.name.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Decorative border */}
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20" />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-3xl bg-accent/20" />
            </div>

            {/* Info */}
            <div className="text-center lg:text-left">
              {/* Rating */}
              <div className="mb-4 flex items-center justify-center gap-1 lg:justify-start">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    size={20}
                    weight="fill"
                    className="text-accent"
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground font-body">
                  5.0 (24 reviews)
                </span>
              </div>

              {/* Name */}
              <h1 className="font-heading mb-4 text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                {staffMember.name}
              </h1>

              {/* Bio */}
              {staffMember.bio && (
                <p className="mb-8 text-lg text-muted-foreground font-body leading-relaxed">
                  {staffMember.bio}
                </p>
              )}

              {/* Contact Info */}
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                {staffMember.email && (
                  <a
                    href={`mailto:${staffMember.email}`}
                    className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 font-body"
                  >
                    <EnvelopeIcon size={18} />
                    {staffMember.email}
                  </a>
                )}
                {staffMember.phone && (
                  <a
                    href={`tel:${staffMember.phone}`}
                    className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/20 font-body"
                  >
                    <PhoneIcon size={18} />
                    {staffMember.phone}
                  </a>
                )}
              </div>

              {/* Book Button */}
              <Link
                href={`/booking?staff=${staffMember.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-primary to-accent px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl font-body"
              >
                <CalendarIcon size={22} />
                Book with {staffMember.name.split(" ")[0]}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-heading mb-12 text-center text-4xl md:text-5xl lg:text-6xl">
            Services by{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              {staffMember.name.split(" ")[0]}
            </span>
          </h2>

          {services.length === 0 ? (
            <p className="text-center text-muted-foreground font-body">
              No services available at the moment.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <h3 className="font-heading text-2xl transition-colors group-hover:text-accent">
                      {service.name}
                    </h3>
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent font-body">
                      ${service.price}
                    </span>
                  </div>
                  {service.description && (
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2 font-body">
                      {service.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
                    <ClockIcon size={16} />
                    <span>{service.duration} min</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Working Hours Section */}
      {workingHours.length > 0 && (
        <section className="border-t bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="font-heading mb-12 text-center text-4xl md:text-5xl lg:text-6xl">
              Working{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Hours
              </span>
            </h2>

            <div className="mx-auto max-w-md">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {dayNames.map((day, index) => {
                  const hours = workingHours.find((h) => h.dayOfWeek === index)
                  return (
                    <div
                      key={day}
                      className={`flex items-center justify-between py-3 ${
                        index !== 6 ? "border-b border-border" : ""
                      }`}
                    >
                      <span className="font-medium font-body">{day}</span>
                      {hours && hours.isActive ? (
                        <span className="text-sm text-muted-foreground font-body">
                          {hours.startTime} - {hours.endTime}
                        </span>
                      ) : (
                        <span className="text-sm text-destructive font-body">
                          Closed
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="border-t bg-linear-to-br from-primary/5 to-accent/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading mb-4 text-4xl md:text-5xl lg:text-6xl">
            Ready to Book?
          </h2>
          <p className="mb-8 text-muted-foreground font-body">
            Schedule your appointment with {staffMember.name.split(" ")[0]} today
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={`/booking?staff=${staffMember.id}`}
              className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-primary to-accent px-8 py-3 font-semibold text-white transition-opacity hover:opacity-90 font-body"
            >
              Book Now
            </Link>
            <Link
              href="/staff"
              className="inline-flex items-center justify-center rounded-full border border-border px-8 py-3 font-semibold transition-colors hover:bg-muted font-body"
            >
              View All Staff
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default StaffDetailPage
