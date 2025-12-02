import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface AccountActivatedTemplateProps {
  userName?: string
}

export function AccountActivatedTemplate({
  userName,
}: AccountActivatedTemplateProps) {
  const logoUrl =
    "https://res.cloudinary.com/caballerorandy/image/upload/v1764553458/Beauty%20Salon/services/logo_yfvhhd.png"

  return (
    <Html>
      <Head />
      <Preview>Your RC Beauty Salon account is now active!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={logoUrl}
              width="200"
              height="200"
              alt="RC Beauty Salon"
              style={logo}
            />
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={title}>Welcome to RC Beauty Salon!</Heading>
            <Text style={text}>
              Hello{userName ? ` ${userName}` : ""},
            </Text>
            <Text style={text}>
              Great news! Your email has been verified and your account is now
              fully activated. You can now enjoy all the features of RC Beauty
              Salon.
            </Text>

            <Section style={featuresBox}>
              <Text style={featuresTitle}>What you can do now:</Text>
              <Text style={featureItem}>• Book appointments online 24/7</Text>
              <Text style={featureItem}>• View and manage your bookings</Text>
              <Text style={featureItem}>• Shop our exclusive beauty products</Text>
              <Text style={featureItem}>• Leave reviews for services</Text>
              <Text style={featureItem}>• Get special member discounts</Text>
            </Section>

            <Section style={buttonContainer}>
              <Button
                style={button}
                href={`${process.env.NEXT_PUBLIC_APP_URL}/login`}
              >
                Log In to Your Account
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={ctaText}>
              Ready to look your best? Browse our services and book your first
              appointment today!
            </Text>

            <Section style={buttonContainer}>
              <Button
                style={secondaryButton}
                href={`${process.env.NEXT_PUBLIC_APP_URL}/services`}
              >
                Explore Our Services
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={contactText}>
              Questions? Contact us at{" "}
              <Link href="tel:+15551234567" style={link}>
                (555) 123-4567
              </Link>{" "}
              or reply to this email.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerBrand}>RC Beauty Salon</Text>
            <Text style={footerTagline}>Your Beauty, Our Passion</Text>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} RC Beauty Salon. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#faf7f5",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
}

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "40px 20px",
}

const header = {
  background: "linear-gradient(135deg, #E76D89 0%, #F4C430 100%)",
  borderRadius: "16px 16px 0 0",
  padding: "30px",
  textAlign: "center" as const,
}

const logo = {
  display: "block",
  margin: "0 auto",
}

const content = {
  backgroundColor: "#ffffff",
  padding: "40px 30px",
  borderLeft: "1px solid #e8ddd9",
  borderRight: "1px solid #e8ddd9",
}

const title = {
  color: "#342A2C",
  fontSize: "24px",
  margin: "0 0 20px 0",
  textAlign: "center" as const,
}

const text = {
  color: "#5c5c5c",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 20px 0",
}

const featuresBox = {
  backgroundColor: "#faf7f5",
  borderRadius: "12px",
  padding: "20px",
  margin: "20px 0",
}

const featuresTitle = {
  color: "#342A2C",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 15px 0",
}

const featureItem = {
  color: "#5c5c5c",
  fontSize: "14px",
  lineHeight: "1.8",
  margin: "0",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
}

const button = {
  background: "linear-gradient(135deg, #E76D89 0%, #F4C430 100%)",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  padding: "16px 40px",
  borderRadius: "50px",
  textDecoration: "none",
  display: "inline-block",
}

const secondaryButton = {
  backgroundColor: "#342A2C",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  padding: "12px 30px",
  borderRadius: "50px",
  textDecoration: "none",
  display: "inline-block",
}

const hr = {
  border: "none",
  borderTop: "1px solid #e8ddd9",
  margin: "30px 0",
}

const ctaText = {
  color: "#5c5c5c",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 20px 0",
  textAlign: "center" as const,
}

const contactText = {
  color: "#8B7176",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
  textAlign: "center" as const,
}

const link = {
  color: "#E76D89",
  textDecoration: "none",
}

const footer = {
  backgroundColor: "#342A2C",
  borderRadius: "0 0 16px 16px",
  padding: "25px 30px",
  textAlign: "center" as const,
}

const footerBrand = {
  color: "#F4C430",
  fontSize: "16px",
  margin: "0 0 8px 0",
  fontWeight: "600",
}

const footerTagline = {
  color: "#E76D89",
  fontSize: "12px",
  margin: "0 0 12px 0",
  fontStyle: "italic",
}

const footerCopyright = {
  color: "#5c5c5c",
  fontSize: "11px",
  margin: "0",
}
