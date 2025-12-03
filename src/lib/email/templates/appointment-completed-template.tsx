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
  Row,
  Column,
} from "@react-email/components"
import { format } from "date-fns"

interface AppointmentCompletedTemplateProps {
  customerName: string
  serviceName: string
  staffName: string
  appointmentDate: Date
  appointmentTime: string
  totalPrice: number
  bookingRef: string
}

export function AppointmentCompletedTemplate({
  customerName,
  serviceName,
  staffName,
  appointmentDate,
  appointmentTime,
  totalPrice,
  bookingRef,
}: AppointmentCompletedTemplateProps) {
  const logoUrl =
    "https://res.cloudinary.com/caballerorandy/image/upload/v1764553458/Beauty%20Salon/services/logo_yfvhhd.png"

  const formattedDate = format(new Date(appointmentDate), "EEEE, MMMM d, yyyy")

  return (
    <Html>
      <Head />
      <Preview>Thank you for visiting RC Beauty Salon!</Preview>
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
            <Heading style={title}>Thank You for Your Visit!</Heading>
            <Text style={text}>Hello {customerName},</Text>
            <Text style={text}>
              We hope you had a wonderful experience at RC Beauty Salon! Your
              appointment has been completed successfully.
            </Text>

            {/* Appointment Details Box */}
            <Section style={detailsBox}>
              <Row>
                <Column style={detailColumn}>
                  <Text style={detailLabel}>Service</Text>
                  <Text style={detailValue}>{serviceName}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={detailColumn}>
                  <Text style={detailLabel}>Stylist</Text>
                  <Text style={detailValue}>{staffName}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={detailColumn}>
                  <Text style={detailLabel}>Date</Text>
                  <Text style={detailValue}>{formattedDate}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={detailColumn}>
                  <Text style={detailLabel}>Time</Text>
                  <Text style={detailValue}>{appointmentTime}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={detailColumn}>
                  <Text style={detailLabel}>Total Paid</Text>
                  <Text style={detailValue}>${totalPrice.toFixed(2)}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={detailColumn}>
                  <Text style={detailLabel}>Booking Reference</Text>
                  <Text style={detailValue}>#{bookingRef}</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            {/* Feedback Section */}
            <Section style={feedbackBox}>
              <Heading style={feedbackTitle}>We Value Your Feedback!</Heading>
              <Text style={feedbackText}>
                Your opinion matters to us. Please take a moment to share your
                experience and help us serve you better.
              </Text>
            </Section>

            <Hr style={hr} />

            {/* Book Again */}
            <Section style={bookAgainBox}>
              <Heading style={bookAgainTitle}>Ready for Your Next Visit?</Heading>
              <Text style={bookAgainText}>
                We&apos;d love to see you again! Book your next appointment and
                continue your beauty journey with us.
              </Text>
            </Section>

            <Section style={buttonContainer}>
              <Button
                style={button}
                href={`${process.env.NEXT_PUBLIC_APP_URL}/booking`}
              >
                Book Another Appointment
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={contactText}>
              Questions or concerns? Contact us at{" "}
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
            <Text style={footerAddress}>
              123 Beauty Street, City, State 12345
            </Text>
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
  background: "linear-gradient(135deg, #48BB78 0%, #38A169 100%)",
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
  color: "#276749",
  fontSize: "24px",
  margin: "0 0 20px 0",
  textAlign: "center" as const,
}

const text = {
  color: "#5c5c5c",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 15px 0",
}

const detailsBox = {
  backgroundColor: "#F0FFF4",
  borderRadius: "12px",
  padding: "20px",
  margin: "20px 0",
  borderLeft: "4px solid #48BB78",
}

const detailColumn = {
  padding: "8px 0",
}

const detailLabel = {
  color: "#276749",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0",
}

const detailValue = {
  color: "#342A2C",
  fontSize: "16px",
  fontWeight: "600",
  margin: "4px 0 0 0",
}

const feedbackBox = {
  backgroundColor: "#FFF9E6",
  border: "1px solid #F4C430",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
  textAlign: "center" as const,
}

const feedbackTitle = {
  color: "#B8860B",
  fontSize: "18px",
  fontWeight: "700",
  margin: "0 0 10px 0",
}

const feedbackText = {
  color: "#8B7500",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
}

const bookAgainBox = {
  backgroundColor: "#faf7f5",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
  textAlign: "center" as const,
}

const bookAgainTitle = {
  color: "#342A2C",
  fontSize: "18px",
  fontWeight: "700",
  margin: "0 0 10px 0",
}

const bookAgainText = {
  color: "#5c5c5c",
  fontSize: "14px",
  lineHeight: "1.5",
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

const hr = {
  border: "none",
  borderTop: "1px solid #e8ddd9",
  margin: "25px 0",
}

const contactText = {
  color: "#5c5c5c",
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

const footerAddress = {
  color: "#8B7176",
  fontSize: "12px",
  margin: "0 0 12px 0",
}

const footerCopyright = {
  color: "#5c5c5c",
  fontSize: "11px",
  margin: "0",
}
