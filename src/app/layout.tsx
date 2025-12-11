import type { Metadata } from "next"
import { Rouge_Script, Poppins } from "next/font/google"
import { SessionProvider } from "@/components/providers/session-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { CartProvider } from "@/components/providers/cart-provider"
import { TooltipProvider } from "@/components/providers/tooltip-provider"

import { Toaster } from "sonner"
import "./globals.css"
import Footer from "@/components/layouts/footer"

const rougeScript = Rouge_Script({
  variable: "--font-rouge-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
})

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "RC Beauty Salon - Professional Beauty Services",
  description:
    "Book appointments, shop products, and manage your beauty salon experience",
  icons: {
    icon: "/favicon.svg",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className={`${rougeScript.variable} ${poppins.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <CartProvider>
              <TooltipProvider>
                {children}

                {/* Footer - Appears on ALL pages (public, customer, admin) */}
                <Footer />
              </TooltipProvider>
            </CartProvider>

            <Toaster position="top-right" richColors />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
