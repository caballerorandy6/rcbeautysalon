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

interface AppointmentCancelledTemplateProps {
  customerName: string
  serviceName: string
  staffName: string
  appointmentDate: Date
  appointmentTime: string
  bookingRef: string
  cancelledByAdmin: boolean
}

export function AppointmentCancelledTemplate({
  customerName,
  serviceName,
  staffName,
  appointmentDate,
  appointmentTime,
  bookingRef,
  cancelledByAdmin,
}: AppointmentCancelledTemplateProps) {
  const logoUrl =
    "https://res.cloudinary.com/caballerorandy/image/upload/v1764553458/Beauty%20Salon/services/logo_yfvhhd.png"

  const formattedDate = format(new Date(appointmentDate), "EEEE, MMMM d, yyyy")

  return (
    <Html>
      <Head />
      <Preview>Appointment Cancelled - RC Beauty Salon</Preview>
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
            <Heading style={title}>Appointment Cancelled</Heading>
            <Text style={text}>Hello {customerName},</Text>
            <Text style={text}>
              {cancelledByAdmin
                ? "We regret to inform you that your appointment at RC Beauty Salon has been cancelled. We apologize for any inconvenience this may cause."
                : "Your appointment at RC Beauty Salon has been cancelled as requested."}
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
                  <Text style={detailLabel}>Original Date</Text>
                  <Text style={detailValue}>{formattedDate}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={detailColumn}>
                  <Text style={detailLabel}>Original Time</Text>
                  <Text style={detailValue}>{appointmentTime}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={detailColumn}>
                  <Text style={detailLabel}>Booking Reference</Text>
                  <Text style={detailValue}>#{bookingRef}</Text>
                </Column>
              </Row>
              <Row>
                <Column style={detailColumn}>
                  <Text style={detailLabel}>Status</Text>
                  <Text style={cancelledStatus}>CANCELLED</Text>
                </Column>
              </Row>
            </Section>

            {/* Refund Info */}
            <Section style={infoBox}>
              <Text style={infoTitle}>Refund Information</Text>
              <Text style={infoText}>
                If you paid a deposit, our team will review your cancellation
                according to our refund policy. If you&apos;re eligible for a
                refund, it will be processed within 5-7 business days.
              </Text>
            </Section>

            <Hr style={hr} />

            {/* Reschedule Invitation */}
            <Section style={rescheduleBox}>
              <Heading style={rescheduleTitle}>Would You Like to Reschedule?</Heading>
              <Text style={rescheduleText}>
                We&apos;d love to see you! If you&apos;d like to book a new
                appointment, click the button below to find a time that works
                for you.
              </Text>
            </Section>

            <Section style={buttonContainer}>
              <Button
                style={button}
                href={`${process.env.NEXT_PUBLIC_APP_URL}/booking`}
              >
                Book New Appointment
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={contactText}>
              Questions about your cancellation? Contact us at{" "}
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
  background: "linear-gradient(135deg, #718096 0%, #4A5568 100%)",
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
  color: "#4A5568",
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
  backgroundColor: "#F7FAFC",
  borderRadius: "12px",
  padding: "20px",
  margin: "20px 0",
  borderLeft: "4px solid #718096",
}

const detailColumn = {
  padding: "8px 0",
}

const detailLabel = {
  color: "#718096",
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

const cancelledStatus = {
  color: "#E53E3E",
  fontSize: "16px",
  fontWeight: "700",
  margin: "4px 0 0 0",
}

const infoBox = {
  backgroundColor: "#EBF8FF",
  border: "1px solid #90CDF4",
  borderRadius: "8px",
  padding: "15px 20px",
  margin: "20px 0",
}

const infoTitle = {
  color: "#2B6CB0",
  fontSize: "14px",
  fontWeight: "700",
  margin: "0 0 8px 0",
}

const infoText = {
  color: "#2C5282",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
}

const rescheduleBox = {
  backgroundColor: "#F0FFF4",
  border: "1px solid #48BB78",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
  textAlign: "center" as const,
}

const rescheduleTitle = {
  color: "#276749",
  fontSize: "18px",
  fontWeight: "700",
  margin: "0 0 10px 0",
}

const rescheduleText = {
  color: "#2F855A",
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
