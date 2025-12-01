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

interface PasswordResetTemplateProps {
  resetLink: string
}

export function PasswordResetTemplate({
  resetLink,
}: PasswordResetTemplateProps) {
  const logoUrl =
    "https://res.cloudinary.com/caballerorandy/image/upload/v1764553458/Beauty%20Salon/services/logo_yfvhhd.png"

  return (
    <Html>
      <Head />
      <Preview>Reset your RC Beauty Salon password</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={logoUrl}
              width="240"
              height="240"
              alt="RC Beauty Salon"
              style={logo}
            />
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={title}>Password Reset Request</Heading>
            <Text style={text}>Hello,</Text>
            <Text style={text}>
              We received a request to reset the password for your BS Beauty
              Salon account. Click the button below to create a new password:
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={resetLink}>
                Reset My Password
              </Button>
            </Section>

            <Text style={expiryText}>
              This link will expire in <strong>1 hour</strong> for security
              reasons.
            </Text>

            <Hr style={hr} />

            <Text style={linkText}>
              If the button doesn&apos;t work, copy and paste this link into
              your browser:
            </Text>
            <Link href={resetLink} style={link}>
              {resetLink}
            </Link>

            <Text style={securityText}>
              If you didn&apos;t request a password reset, you can safely ignore
              this email. Your password will remain unchanged.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerBrand}>RC Beauty Salon</Text>
            <Text style={footerTagline}>Your Beauty, Our Passion</Text>
            <Text style={footerCopyright}>
              © {new Date().getFullYear()} RC Beauty Salon. All rights
              reserved.
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
  fontSize: "22px",
  margin: "0 0 20px 0",
  textAlign: "center" as const,
}

const text = {
  color: "#5c5c5c",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 20px 0",
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

const expiryText = {
  color: "#8B7176",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 20px 0",
  textAlign: "center" as const,
}

const hr = {
  border: "none",
  borderTop: "1px solid #e8ddd9",
  margin: "30px 0",
}

const linkText = {
  color: "#8B7176",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 10px 0",
}

const link = {
  color: "#E76D89",
  fontSize: "14px",
  wordBreak: "break-all" as const,
}

const securityText = {
  color: "#8B7176",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "20px 0 0 0",
}

const footer = {
  backgroundColor: "#342A2C",
  borderRadius: "0 0 16px 16px",
  padding: "25px 30px",
  textAlign: "center" as const,
}

const footerBrand = {
  color: "#F4C430",
  fontSize: "14px",
  margin: "0 0 8px 0",
  fontWeight: "600",
}

const footerTagline = {
  color: "#8B7176",
  fontSize: "12px",
  margin: "0",
}

const footerCopyright = {
  color: "#5c5c5c",
  fontSize: "11px",
  margin: "16px 0 0 0",
}
