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

interface AppointmentReminderTemplateProps {
  customerName: string
  serviceName: string
  staffName: string
  appointmentDate: Date
  appointmentTime: string
  duration: number
  reminderType: "24h" | "48h" | "1week"
}

export function AppointmentReminderTemplate({
  customerName,
  serviceName,
  staffName,
  appointmentDate,
  appointmentTime,
  duration,
  reminderType,
}: AppointmentReminderTemplateProps) {
  const logoUrl =
    "https://res.cloudinary.com/caballerorandy/image/upload/v1764553458/Beauty%20Salon/services/logo_yfvhhd.png"

  const formattedDate = format(new Date(appointmentDate), "EEEE, MMMM d, yyyy")

  const reminderText = {
    "24h": "tomorrow",
    "48h": "in 2 days",
    "1week": "in 1 week",
  }

  const previewText = `Reminder: Your appointment is ${reminderText[reminderType]}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
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
            <Heading style={title}>Appointment Reminder</Heading>
            <Text style={text}>Hello {customerName},</Text>
            <Text style={text}>
              This is a friendly reminder that your appointment is coming up{" "}
              <strong>{reminderText[reminderType]}</strong>. We look forward to
              seeing you!
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

            {/* Reschedule Notice */}
            <Section style={infoBox}>
              <Text style={infoTitle}>Need to reschedule?</Text>
              <Text style={infoText}>
                You can reschedule or cancel your appointment from your account.
                Please note that cancellations within 24 hours may forfeit your
                deposit.
              </Text>
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
            <Hr style={footerHr} />
            <Text style={unsubscribeText}>
              <Link
                href={`${process.env.NEXT_PUBLIC_APP_URL}/my-account`}
                style={unsubscribeLink}
              >
                Manage notification preferences
              </Link>
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

const detailsBox = {
  backgroundColor: "#faf7f5",
  borderRadius: "12px",
  padding: "20px",
  margin: "20px 0",
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

const infoBox = {
  backgroundColor: "#FFF9E6",
  border: "1px solid #F4C430",
  borderRadius: "8px",
  padding: "15px 20px",
  margin: "20px 0",
}

const infoTitle = {
  color: "#B8860B",
  fontSize: "14px",
  fontWeight: "700",
  margin: "0 0 8px 0",
}

const infoText = {
  color: "#8B7500",
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

const footerHr = {
  border: "none",
  borderTop: "1px solid #5c5c5c",
  margin: "15px 0",
}

const unsubscribeText = {
  color: "#8B7176",
  fontSize: "11px",
  margin: "0 0 10px 0",
}

const unsubscribeLink = {
  color: "#E76D89",
  textDecoration: "underline",
}

const footerCopyright = {
  color: "#5c5c5c",
  fontSize: "11px",
  margin: "0",
}
