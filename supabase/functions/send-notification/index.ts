import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@4.0.0";
import React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { NotificationEmail } from './_templates/notification-email.tsx'

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotifyRequest {
  type: 'devotional' | 'post' | 'video' | 'other';
  title: string;
  url: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, title, url }: NotifyRequest = await req.json();

    if (!type || !title || !url) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Get active subscribers
    const { data: subscribers, error: subsError } = await supabase
      .from('newsletter_subscribers')
      .select('email')
      .eq('active', true);

    if (subsError) throw new Error('Error fetching subscribers');

    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ message: 'No active subscribers found' }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const subjectMap: Record<string, string> = {
      devotional: `New Devotional Posted: ${title}`,
      post: `New Blog Post: ${title}`,
      video: `New Video: ${title}`,
      other: `New Update: ${title}`,
    };

    const messageMap: Record<string, string> = {
      devotional: 'A new devotional has been published. Click below to read it now.',
      post: 'A new blog post is live. Click below to read it now.',
      video: 'A new video has been uploaded. Watch it now.',
      other: 'There is a new update. Check it out below.',
    };

    const emailHtml = await renderAsync(
      React.createElement(NotificationEmail, {
        title: subjectMap[type] || subjectMap.other,
        message: messageMap[type] || messageMap.other,
        cta_url: url,
        cta_label: 'Open',
      })
    );

    const emailPromises = subscribers.map((s) =>
      resend.emails.send({
        from: 'Light and Truth <info@lightandtruth.com.ng>',
        to: [s.email],
        subject: subjectMap[type] || subjectMap.other,
        reply_to: 'no-reply@lightandtruth.com.ng',
        html: emailHtml,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return new Response(
      JSON.stringify({ message: 'Notification emails sent', successful, failed, total: subscribers.length }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
