import { getStaffMembers } from "@/app/actions/staff"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { cloudinaryPresets } from "@/lib/utils/cloudinary"

export const metadata: Metadata = {
  title: "Our Team | BS Beauty Salon",
  description: "Meet our talented team of beauty professionals",
}

const StaffPage = async () => {
  const staffMembers = await getStaffMembers()

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary font-body">
              Meet the Experts
            </span>
            <h1 className="mb-4 text-5xl md:text-6xl lg:text-7xl">
              Our{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Team
              </span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl font-body">
              Our talented professionals are dedicated to helping you look and
              feel your absolute best.
            </p>
          </div>
        </div>
      </section>

      {/* Staff Grid Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {staffMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-muted p-6">
                <svg
                  className="h-12 w-12 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-3xl">No team members yet</h3>
              <p className="text-muted-foreground font-body">
                Our team is being assembled. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {staffMembers.map((staff) => (
                <Link
                  key={staff.id}
                  href={`/staff/${generateSlug(staff.name)}`}
                  className="group relative block aspect-3/4 overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                >
                  {/* Background Image */}
                  {staff.image ? (
                    <Image
                      src={cloudinaryPresets.staffCard(staff.image)}
                      alt={staff.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-accent/20" />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    {/* Services Count Badge */}
                    <div className="absolute top-4 right-4 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 transition-all duration-300 group-hover:bg-accent group-hover:text-black">
                      <span className="text-xs font-medium font-body">
                        {staff.services.length} services
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="text-3xl md:text-4xl mb-2 drop-shadow-lg transition-colors duration-300 group-hover:text-accent">
                      {staff.name}
                    </h3>

                    {/* Bio */}
                    {staff.bio && (
                      <p className="text-sm text-white/80 line-clamp-2 mb-4 font-body transition-colors duration-300 group-hover:text-white">
                        {staff.bio}
                      </p>
                    )}

                    {/* View Profile Button */}
                    <div className="flex items-center gap-2 text-sm font-medium text-accent opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 font-body">
                      <span>View Profile</span>
                      <svg
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent transition-colors duration-300 group-hover:border-accent/50" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-linear-to-br from-primary/5 to-accent/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-4xl md:text-5xl">
            Ready to Transform Your Look?
          </h2>
          <p className="mb-8 text-muted-foreground font-body">
            Book an appointment with one of our talented stylists today
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-primary to-accent px-8 py-3 font-semibold text-white transition-opacity hover:opacity-90 font-body"
          >
            Book Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default StaffPage
