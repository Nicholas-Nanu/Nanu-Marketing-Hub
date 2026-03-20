// supabase/functions/weekly-recap/index.ts
//
// Scheduled to run every Monday at 8:00 AM UTC.
// Queries each user's tasks, projects, and activity, then sends a recap email via Resend.
// 
// Schedule this via Supabase Dashboard → Edge Functions → weekly-recap → Schedule → 
// Cron: 0 8 * * 1

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const FROM_EMAIL = "Nanu Hub <notifications@nanu-app.com>"; // Update with your verified Resend domain
const HUB_URL = "https://nanu-marketing-hub.vercel.app";

serve(async (_req) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Get all users
    const { data: users } = await supabase.from("users").select("*");
    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ message: "No users found" }), { status: 200 });
    }

    // Get all tasks and projects
    const { data: allTasks } = await supabase.from("tasks").select("*");
    const { data: allProjects } = await supabase.from("projects").select("*");
    const { data: recentActivity } = await supabase
      .from("activity_log")
      .select("*")
      .gte("time", new Date(Date.now() - 7 * 86400000).toISOString())
      .order("time", { ascending: false })
      .limit(20);

    const today = new Date().toISOString().split("T")[0];
    const results = [];

    for (const user of users) {
      if (!user.email) continue;

      // Check if user has weekly recap enabled
      const { data: settingsRow } = await supabase
        .from("notif_settings")
        .select("settings")
        .eq("user_id", user.id)
        .single();

      const settings = settingsRow?.settings || { weeklyRecap: true };
      if (!settings.weeklyRecap) continue;

      // User's tasks
      const myTasks = (allTasks || []).filter(t => {
        const owners = t.owners || [];
        return owners.includes(user.id);
      });

      const overdueTasks = myTasks.filter(t => t.due_date && t.due_date < today && t.status !== "Done");
      const inProgressTasks = myTasks.filter(t => t.status === "In Progress");
      const doneTasks = myTasks.filter(t => t.status === "Done");
      const blockedTasks = myTasks.filter(t => t.status === "Blocked" || t.blocker);

      // User's projects
      const myProjects = (allProjects || []).filter(p => 
        p.owner === user.id || (p.members || []).includes(user.id)
      );

      // Build email HTML
      const taskSection = (label, tasks, color) => {
        if (!tasks.length) return "";
        return `
          <div style="margin-bottom: 16px;">
            <div style="font-size: 13px; font-weight: 700; color: ${color}; margin-bottom: 8px; text-transform: uppercase;">${label} (${tasks.length})</div>
            ${tasks.map(t => `
              <div style="padding: 8px 12px; background: #f9fafb; border-radius: 6px; margin-bottom: 4px; border-left: 3px solid ${color};">
                <div style="font-size: 14px; font-weight: 600;">${t.title}</div>
                ${t.due_date ? `<div style="font-size: 11px; color: #9ca3af;">Due: ${t.due_date}</div>` : ""}
              </div>
            `).join("")}
          </div>
        `;
      };

      const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <div style="background: #0D1B21; padding: 20px 24px; border-radius: 12px 12px 0 0;">
            <span style="color: #1FC2C2; font-weight: 800; font-size: 18px; letter-spacing: 0.05em;">NANU</span>
            <span style="color: #82F9F6; font-size: 12px; margin-left: 8px; opacity: 0.6;">WEEKLY RECAP</span>
          </div>
          <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="margin: 0 0 4px; font-size: 20px; color: #0D1B21;">Good morning, ${user.name.split(" ")[0]}</h2>
            <p style="margin: 0 0 20px; font-size: 14px; color: #6b7280;">Here's your week at a glance — ${new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
            
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
              <div style="flex: 1; text-align: center; padding: 14px; background: #f0fdf4; border-radius: 8px;">
                <div style="font-size: 24px; font-weight: 800; color: #16a34a;">${doneTasks.length}</div>
                <div style="font-size: 11px; color: #6b7280; font-weight: 600;">DONE</div>
              </div>
              <div style="flex: 1; text-align: center; padding: 14px; background: #eff6ff; border-radius: 8px;">
                <div style="font-size: 24px; font-weight: 800; color: #2563eb;">${inProgressTasks.length}</div>
                <div style="font-size: 11px; color: #6b7280; font-weight: 600;">IN PROGRESS</div>
              </div>
              <div style="flex: 1; text-align: center; padding: 14px; background: ${overdueTasks.length > 0 ? '#fef2f2' : '#f9fafb'}; border-radius: 8px;">
                <div style="font-size: 24px; font-weight: 800; color: ${overdueTasks.length > 0 ? '#dc2626' : '#6b7280'};">${overdueTasks.length}</div>
                <div style="font-size: 11px; color: #6b7280; font-weight: 600;">OVERDUE</div>
              </div>
            </div>

            ${taskSection("Overdue", overdueTasks, "#dc2626")}
            ${taskSection("Blocked", blockedTasks, "#f59e0b")}
            ${taskSection("In Progress", inProgressTasks, "#2563eb")}
            
            ${myProjects.length > 0 ? `
              <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                <div style="font-size: 13px; font-weight: 700; color: #1FC2C2; margin-bottom: 8px; text-transform: uppercase;">YOUR PROJECTS (${myProjects.length})</div>
                ${myProjects.map(p => `
                  <div style="padding: 8px 12px; background: #f9fafb; border-radius: 6px; margin-bottom: 4px; border-left: 3px solid ${p.color || '#1FC2C2'};">
                    <div style="font-size: 14px; font-weight: 600;">${p.name}</div>
                    <div style="font-size: 11px; color: #9ca3af;">${p.status}</div>
                  </div>
                `).join("")}
              </div>
            ` : ""}

            ${(recentActivity || []).length > 0 ? `
              <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                <div style="font-size: 13px; font-weight: 700; color: #6b7280; margin-bottom: 8px; text-transform: uppercase;">TEAM ACTIVITY THIS WEEK</div>
                ${(recentActivity || []).slice(0, 8).map(a => `
                  <div style="font-size: 12px; color: #6b7280; padding: 3px 0;">${a.action} — ${a.target} (${a.section})</div>
                `).join("")}
              </div>
            ` : ""}

            <div style="margin-top: 24px; text-align: center;">
              <a href="${HUB_URL}" style="display: inline-block; background: #1FC2C2; color: #0D1B21; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">Open Hub</a>
            </div>
            
            <p style="margin: 24px 0 0; font-size: 11px; color: #9ca3af; text-align: center;">
              You received this because weekly recaps are enabled in your Nanu Hub settings.
            </p>
          </div>
        </div>
      `;

      // Send via Resend
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: user.email,
          subject: `[Nanu Hub] Your Weekly Recap — ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long" })}`,
          html,
        }),
      });

      const emailData = await emailRes.json();
      results.push({ user: user.name, email: user.email, sent: emailRes.ok, resend: emailData });
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Weekly recap error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
