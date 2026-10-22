import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  subject: string;
  content: string;
  subscribers: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, content, subscribers }: NewsletterRequest = await req.json();

    if (!subject || !content || !subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send newsletter to all subscribers
    const emailPromises = subscribers.map(email => 
      resend.emails.send({
        from: "Light and Truth <info@lightandtruth.com.ng>",
        to: [email],
        subject: subject,
        reply_to: "no-reply@lightandtruth.com.ng",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <header style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0;">Light and Truth</h1>
              <p style="color: #6b7280; margin: 5px 0;">Seeing in light, established in truth</p>
            </header>
            
            <main style="background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <div style="white-space: pre-wrap; line-height: 1.6; color: #374151;">
                ${content.replace(/\n/g, '<br>')}
              </div>
            </main>
            
            <footer style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                You received this email because you subscribed to our newsletter.
              </p>
              <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 14px;">
                © 2024 Light and Truth. All rights reserved.
              </p>
            </footer>
          </div>
        `,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    const successCount = results.filter(result => result.status === 'fulfilled').length;
    const failureCount = results.filter(result => result.status === 'rejected').length;

    console.log(`Newsletter sent: ${successCount} successful, ${failureCount} failed`);

    return new Response(
      JSON.stringify({ 
        success: true,
        sent: successCount,
        failed: failureCount,
        total: subscribers.length
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-newsletter function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);