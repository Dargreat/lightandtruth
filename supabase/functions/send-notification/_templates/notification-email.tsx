import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface NotificationEmailProps {
  title: string;
  message: string;
  cta_url: string;
  cta_label?: string;
}

export const NotificationEmail = ({ title, message, cta_url, cta_label = 'Read now' }: NotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>{title}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Light and Truth</Heading>
          <Text style={subtitle}>New update from lightandtruth.com.ng</Text>
        </Section>

        <Section style={content}>
          <Heading style={h2}>{title}</Heading>
          <Hr style={hr} />
          <Text style={paragraph}>{message}</Text>
          <Link href={cta_url} target="_blank" style={button}>
            {cta_label}
          </Link>
        </Section>

        <Section style={footer}>
          <Hr style={hr} />
          <Text style={footerText}>
            © {new Date().getFullYear()} Light and Truth
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default NotificationEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '32px',
  borderRadius: '8px',
  margin: '40px auto',
  maxWidth: '600px',
}

const header = {
  textAlign: 'center' as const,
  marginBottom: '24px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold' as const,
  margin: '0 0 6px',
  textAlign: 'center' as const,
}

const subtitle = {
  color: '#666666',
  fontSize: '14px',
  margin: 0,
  textAlign: 'center' as const,
}

const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: 'bold' as const,
  margin: '8px 0 12px 0',
  lineHeight: '1.3',
}

const content = {
  margin: 0,
}

const paragraph = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0 24px 0',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '16px 0',
}

const button = {
  display: 'inline-block',
  backgroundColor: '#4f46e5',
  color: '#ffffff',
  padding: '12px 20px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: '600',
}

const footer = {
  marginTop: '24px',
}

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  margin: '8px 0',
}
