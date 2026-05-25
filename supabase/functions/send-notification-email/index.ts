// supabase/functions/send-notification-email/index.ts
//
// Triggered by a database webhook when a row is inserted into the notifications table.
// Checks the user's notification settings and sends an email via Resend if enabled.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const FROM_EMAIL = "Nanu Hub <notifications@nanu-app.com>"; // Update with your verified Resend domain

serve(async (req) => {
  try {
    const payload = await req.json();

    // The webhook sends the new row as payload.record
    const notification = payload.record || payload;

    if (!notification?.user_id || !notification?.title) {
      return new Response(JSON.stringify({ error: "Missing notification data" }), { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 1. Get user's notification settings
    const { data: settingsRow } = await supabase
      .from("notif_settings")
      .select("settings")
      .eq("user_id", notification.user_id)
      .single();

    const settings = settingsRow?.settings || {
      taskAssigned: true,
      taskUpdated: true,
      taskDue: true,
      projectUpdated: true,
      weeklyRecap: true,
      inHubBell: true,
    };

    // 2. Check if this notification type is enabled for email
    const typeToSetting = {
      task_assigned: "taskAssigned",
      task_updated: "taskUpdated",
      task_due: "taskDue",
      project_updated: "projectUpdated",
    };

    const settingKey = typeToSetting[notification.type];
    if (settingKey && !settings[settingKey]) {
      return new Response(JSON.stringify({ skipped: true, reason: "User has this notification type disabled" }), { status: 200 });
    }

    // 3. Get user's email
    const { data: user } = await supabase
      .from("users")
      .select("email, name")
      .eq("id", notification.user_id)
      .single();

    if (!user?.email) {
      return new Response(JSON.stringify({ skipped: true, reason: "No email for user" }), { status: 200 });
    }

    // 4. Send email via Resend
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: user.email,
        subject: `[Nanu Hub] ${notification.title}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
            <div style="background: #0D1B21; padding: 20px 24px; border-radius: 12px 12px 0 0;">
              <span style="color: #1FC2C2; font-weight: 800; font-size: 18px; letter-spacing: 0.05em;">NANU</span>
              <span style="color: #82F9F6; font-size: 12px; margin-left: 8px; opacity: 0.6;">MARKETING HUB</span>
            </div>
            <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <h2 style="margin: 0 0 8px; font-size: 18px; color: #0D1B21;">${notification.title}</h2>
              <p style="margin: 0 0 20px; font-size: 14px; color: #6b7280; line-height: 1.6;">${notification.body || ""}</p>
              <a href="https://nanu-marketing-hub.vercel.app" style="display: inline-block; background: #1FC2C2; color: #0D1B21; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Open Hub</a>
              <p style="margin: 24px 0 0; font-size: 11px; color: #9ca3af;">
                You received this because you have notifications enabled in Nanu Hub.
                <br/>Manage your notification settings in Hub → Settings.
              </p>
            </div>
          </div>
        `,
      }),
    });

    const emailData = await emailRes.json();

    return new Response(JSON.stringify({ sent: true, resend: emailData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
