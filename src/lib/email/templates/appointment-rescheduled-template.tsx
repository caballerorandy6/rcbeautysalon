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

interface AppointmentRescheduledTemplateProps {
  customerName: string
  serviceName: string
  staffName: string
  oldDate: Date
  oldTime: string
  newDate: Date
  newTime: string
  duration: number
}

export function AppointmentRescheduledTemplate({
  customerName,
  serviceName,
  staffName,
  oldDate,
  oldTime,
  newDate,
  newTime,
  duration,
}: AppointmentRescheduledTemplateProps) {
  const logoUrl =
    "https://res.cloudinary.com/caballerorandy/image/upload/v1764553458/Beauty%20Salon/services/logo_yfvhhd.png"

  const formattedOldDate = format(new Date(oldDate), "EEEE, MMMM d, yyyy")
  const formattedNewDate = format(new Date(newDate), "EEEE, MMMM d, yyyy")

  return (
    <Html>
      <Head />
      <Preview>Your appointment has been rescheduled</Preview>
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
            <Heading style={title}>Appointment Rescheduled</Heading>
            <Text style={text}>Hello {customerName},</Text>
            <Text style={text}>
              Your appointment has been successfully rescheduled. Here are your
              updated details:
            </Text>

            {/* Old vs New Comparison */}
            <Section style={comparisonContainer}>
              {/* Old Appointment */}
              <Section style={oldBox}>
                <Text style={boxLabel}>Previous Time</Text>
                <Text style={strikethrough}>{formattedOldDate}</Text>
                <Text style={strikethrough}>{oldTime}</Text>
              </Section>

              {/* Arrow */}
              <Section style={arrowContainer}>
                <Text style={arrow}>→</Text>
              </Section>

              {/* New Appointment */}
              <Section style={newBox}>
                <Text style={boxLabelNew}>New Time</Text>
                <Text style={newValue}>{formattedNewDate}</Text>
                <Text style={newValue}>{newTime}</Text>
              </Section>
            </Section>

            {/* Full Appointment Details */}
            <Section style={detailsBox}>
              <Text style={detailsTitle}>Appointment Details</Text>
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
                  <Text style={detailLabel}>New Date</Text>
                  <Text style={detailValue}>{formattedNewDate}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={detailColumn}>
                  <Text style={detailLabel}>New Time</Text>
                  <Text style={detailValue}>{newTime}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={detailColumn}>
                  <Text style={detailLabel}>Duration</Text>
                  <Text style={detailValue}>{duration} minutes</Text>
                </Column>
              </Row>
            </Section>

            <Section style={buttonContainer}>
              <Button
                style={button}
                href={`${process.env.NEXT_PUBLIC_APP_URL}/my-appointments`}
              >
                View My Appointments
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
  margin: "0 0 15px 0",
}

const comparisonContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
  margin: "25px 0",
}

const oldBox = {
  backgroundColor: "#fee2e2",
  borderRadius: "8px",
  padding: "15px 20px",
  textAlign: "center" as const,
  flex: "1",
}

const boxLabel = {
  color: "#991b1b",
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 8px 0",
  fontWeight: "600",
}

const strikethrough = {
  color: "#991b1b",
  fontSize: "14px",
  textDecoration: "line-through",
  margin: "4px 0",
}

const arrowContainer = {
  textAlign: "center" as const,
  padding: "0 10px",
}

const arrow = {
  fontSize: "24px",
  color: "#E76D89",
  margin: "0",
}

const newBox = {
  backgroundColor: "#dcfce7",
  borderRadius: "8px",
  padding: "15px 20px",
  textAlign: "center" as const,
  flex: "1",
}

const boxLabelNew = {
  color: "#166534",
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 8px 0",
  fontWeight: "600",
}

const newValue = {
  color: "#166534",
  fontSize: "14px",
  fontWeight: "600",
  margin: "4px 0",
}

const detailsBox = {
  backgroundColor: "#faf7f5",
  borderRadius: "12px",
  padding: "20px",
  margin: "20px 0",
}

const detailsTitle = {
  color: "#342A2C",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 15px 0",
  textAlign: "center" as const,
}

const detailColumn = {
  padding: "8px 0",
}

const detailLabel = {
  color: "#8B7176",
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
