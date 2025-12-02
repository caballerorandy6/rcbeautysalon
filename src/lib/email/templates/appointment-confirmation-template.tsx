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

interface AppointmentConfirmationTemplateProps {
  customerName: string
  serviceName: string
  staffName: string
  appointmentDate: Date
  appointmentTime: string
  duration: number
  totalPrice: number
  depositAmount: number
  appointmentId: string
}

export function AppointmentConfirmationTemplate({
  customerName,
  serviceName,
  staffName,
  appointmentDate,
  appointmentTime,
  duration,
  totalPrice,
  depositAmount,
  appointmentId,
}: AppointmentConfirmationTemplateProps) {
  const logoUrl =
    "https://res.cloudinary.com/caballerorandy/image/upload/v1764553458/Beauty%20Salon/services/logo_yfvhhd.png"

  const formattedDate = format(new Date(appointmentDate), "EEEE, MMMM d, yyyy")
  const bookingRef = appointmentId.slice(-8).toUpperCase()

  return (
    <Html>
      <Head />
      <Preview>Your appointment at RC Beauty Salon is confirmed!</Preview>
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
            <Heading style={title}>Appointment Confirmed!</Heading>
            <Text style={text}>Hello {customerName},</Text>
            <Text style={text}>
              Thank you for booking with RC Beauty Salon! Your appointment has
              been successfully scheduled. Here are the details:
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
              <Row>
                <Column style={detailColumn}>
                  <Text style={detailLabel}>Booking Reference</Text>
                  <Text style={detailValue}>#{bookingRef}</Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            {/* Payment Info */}
            <Heading style={subtitle}>Payment Information</Heading>
            <Section style={paymentBox}>
              <Row>
                <Column>
                  <Text style={paymentLabel}>Service Total:</Text>
                </Column>
                <Column style={paymentValueColumn}>
                  <Text style={paymentValue}>${totalPrice.toFixed(2)}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={paymentLabel}>Deposit Required:</Text>
                </Column>
                <Column style={paymentValueColumn}>
                  <Text style={depositValue}>${depositAmount.toFixed(2)}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={paymentLabel}>Balance Due at Salon:</Text>
                </Column>
                <Column style={paymentValueColumn}>
                  <Text style={paymentValue}>
                    ${(totalPrice - depositAmount).toFixed(2)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Important Notice */}
            <Section style={warningBox}>
              <Text style={warningTitle}>Important: Deposit Required</Text>
              <Text style={warningText}>
                To confirm your appointment, please pay the deposit of{" "}
                <strong>${depositAmount.toFixed(2)}</strong> within 24 hours.
                Appointments without deposit payment may be cancelled
                automatically.
              </Text>
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

            {/* Cancellation Policy */}
            <Text style={policyTitle}>Cancellation Policy</Text>
            <Text style={policyText}>
              - Free cancellation up to 24 hours before your appointment
            </Text>
            <Text style={policyText}>
              - Cancellations within 24 hours may forfeit the deposit
            </Text>
            <Text style={policyText}>
              - No-shows will result in loss of deposit
            </Text>

            <Hr style={hr} />

            <Text style={contactText}>
              Need to make changes? Contact us at{" "}
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
            <Text style={footerAddress}>123 Beauty Street, City, State 12345</Text>
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

const subtitle = {
  color: "#342A2C",
  fontSize: "18px",
  margin: "20px 0 15px 0",
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

const paymentBox = {
  backgroundColor: "#f8f8f8",
  borderRadius: "8px",
  padding: "15px 20px",
  margin: "15px 0",
}

const paymentLabel = {
  color: "#5c5c5c",
  fontSize: "14px",
  margin: "8px 0",
}

const paymentValueColumn = {
  textAlign: "right" as const,
}

const paymentValue = {
  color: "#342A2C",
  fontSize: "14px",
  fontWeight: "600",
  margin: "8px 0",
  textAlign: "right" as const,
}

const depositValue = {
  color: "#E76D89",
  fontSize: "16px",
  fontWeight: "700",
  margin: "8px 0",
  textAlign: "right" as const,
}

const warningBox = {
  backgroundColor: "#FFF9E6",
  border: "1px solid #F4C430",
  borderRadius: "8px",
  padding: "15px 20px",
  margin: "20px 0",
}

const warningTitle = {
  color: "#B8860B",
  fontSize: "14px",
  fontWeight: "700",
  margin: "0 0 8px 0",
}

const warningText = {
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

const policyTitle = {
  color: "#342A2C",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 10px 0",
}

const policyText = {
  color: "#8B7176",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "0 0 5px 0",
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
