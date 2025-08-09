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

interface DevotionalEmailProps {
  title: string;
  content: string;
  scripture_reference?: string;
  date: string;
  unsubscribe_url: string;
}

export const DevotionalEmail = ({
  title,
  content,
  scripture_reference,
  date,
  unsubscribe_url,
}: DevotionalEmailProps) => (
  <Html>
    <Head />
    <Preview>{title} - Daily Devotional from Light and Truth</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Light and Truth</Heading>
          <Text style={subtitle}>Daily Devotional</Text>
        </Section>
        
        <Section style={content}>
          <Text style={date}>{new Date(date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</Text>
          
          <Heading style={h2}>{title}</Heading>
          
          {scripture_reference && (
            <Text style={scripture}>
              <strong>Scripture: </strong>{scripture_reference}
            </Text>
          )}
          
          <Hr style={hr} />
          
          <div style={devotionalContent}>
            {content.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <Text key={index} style={paragraph}>
                  {paragraph}
                </Text>
              )
            ))}
          </div>
        </Section>
        
        <Section style={footer}>
          <Hr style={hr} />
          <Text style={footerText}>
            <Link
              href="https://lightandtruth.com.ng"
              target="_blank"
              style={link}
            >
              Visit Light and Truth
            </Link>
          </Text>
          <Text style={footerText}>
            <Link
              href={unsubscribe_url}
              target="_blank"
              style={unsubscribeLink}
            >
              Unsubscribe from daily devotionals
            </Link>
          </Text>
          <Text style={footerText}>
            Light and Truth - Bringing spiritual enlightenment to your daily walk
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default DevotionalEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
  borderRadius: '8px',
  margin: '40px auto',
  maxWidth: '600px',
}

const header = {
  textAlign: 'center' as const,
  marginBottom: '40px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '32px',
  fontWeight: 'bold' as const,
  margin: '0 0 10px',
  textAlign: 'center' as const,
}

const subtitle = {
  color: '#666666',
  fontSize: '16px',
  margin: '0',
  textAlign: 'center' as const,
  fontStyle: 'italic' as const,
}

const h2 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold' as const,
  margin: '30px 0 20px 0',
  lineHeight: '1.3',
}

const date = {
  color: '#8898aa',
  fontSize: '14px',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
  fontWeight: '500' as const,
}

const scripture = {
  color: '#4f46e5',
  fontSize: '16px',
  margin: '0 0 20px 0',
  fontStyle: 'italic' as const,
  textAlign: 'center' as const,
}

const devotionalContent = {
  margin: '20px 0',
}

const paragraph = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const footer = {
  marginTop: '40px',
}

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  margin: '8px 0',
}

const link = {
  color: '#4f46e5',
  textDecoration: 'underline',
}

const unsubscribeLink = {
  color: '#8898aa',
  textDecoration: 'underline',
}

const content = {
  margin: '0',
}