import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@4.0.0";
import React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { DevotionalEmail } from './_templates/devotional-email.tsx'

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendDevotionalRequest {
  devotional_id?: string;
  send_to_all?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { devotional_id, send_to_all = false }: SendDevotionalRequest = await req.json();
    
    // Get today's devotional if no specific devotional_id provided
    let devotional;
    if (devotional_id) {
      const { data, error } = await supabase
        .from('devotionals')
        .select('*')
        .eq('id', devotional_id)
        .eq('published', true)
        .single();
      
      if (error || !data) {
        throw new Error('Devotional not found');
      }
      devotional = data;
    } else {
      // Get today's devotional
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('devotionals')
        .select('*')
        .eq('date', today)
        .eq('published', true)
        .maybeSingle();
      
      if (error) {
        throw new Error('Error fetching today\'s devotional');
      }
      
      if (!data) {
        return new Response(
          JSON.stringify({ message: 'No devotional available for today' }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
      devotional = data;
    }

    // Get active subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('active', true);

    if (subscribersError) {
      throw new Error('Error fetching subscribers');
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No active subscribers found' }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Render email template
    const emailHtml = await renderAsync(
      React.createElement(DevotionalEmail, {
        title: devotional.title,
        content: devotional.content,
        scripture_reference: devotional.scripture_reference,
        date: devotional.date,
        unsubscribe_url: `https://lightandtruth.com.ng/unsubscribe`, // You may want to implement this
      })
    );

    // Send emails to all subscribers
    const emailPromises = subscribers.map(subscriber => 
      resend.emails.send({
        from: 'Light and Truth <info@lightandtruth.com.ng>',
        to: [subscriber.email],
        subject: `Daily Devotional: ${devotional.title}`,
        reply_to: 'no-reply@lightandtruth.com.ng',
        html: emailHtml,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    
    // Count successes and failures
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    console.log(`Devotional emails sent: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({
        message: 'Daily devotional emails sent',
        successful,
        failed,
        total: subscribers.length,
        devotional_title: devotional.title,
        date: devotional.date
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error sending daily devotional:", error);
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