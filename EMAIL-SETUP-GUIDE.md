# Nanu Marketing Hub — Email Notifications Setup Guide

## Overview

This guide walks you through setting up email notifications using **Resend** (email API) and **Supabase Edge Functions** (serverless functions). Once complete, your hub will:

- Send instant email notifications when tasks/projects are updated
- Send a weekly recap email every Monday morning
- Respect each user's notification settings

---

## Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. On the dashboard, go to **API Keys** → **Create API Key**
3. Name it `nanu-hub` and copy the key (starts with `re_...`)
4. Save this key — you'll need it in Step 3

### Domain Verification (Optional but Recommended)

By default, Resend lets you send from `onboarding@resend.dev` for testing. For production:

1. Go to **Domains** → **Add Domain**
2. Add `nanu-app.com` (or your domain)
3. Add the DNS records Resend gives you (TXT, CNAME)
4. Wait for verification (usually a few minutes)
5. Once verified, update the `FROM_EMAIL` in both Edge Functions to use your domain

For testing, you can use `onboarding@resend.dev` as the from address — just update the `FROM_EMAIL` constant in both function files.

---

## Step 2: Install Supabase CLI

You need the Supabase CLI to deploy Edge Functions.

**macOS:**
```bash
brew install supabase/tap/supabase
```

**Windows (via npm):**
```bash
npm install -g supabase
```

**Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/supabase/cli/main/install.sh | sh
```

Then log in:
```bash
supabase login
```

Link your project:
```bash
supabase link --project-ref fffetwwlkxwzgaynnknu
```

---

## Step 3: Set Resend API Key as a Secret

```bash
supabase secrets set RESEND_API_KEY=re_your_key_here
```

This makes the key available to your Edge Functions without exposing it in code.

---

## Step 4: Deploy the Edge Functions

From your project root (where the `supabase/` folder is):

```bash
# Deploy the instant notification emailer
supabase functions deploy send-notification-email --no-verify-jwt

# Deploy the weekly recap
supabase functions deploy weekly-recap --no-verify-jwt
```

The `--no-verify-jwt` flag allows the functions to be called by database webhooks without authentication headers.

---

## Step 5: Set Up the Database Webhook

This makes Supabase automatically call your Edge Function whenever a notification is created.

1. Go to your **Supabase Dashboard**
2. Navigate to **Database** → **Webhooks** (left sidebar)
3. Click **Create a new webhook**
4. Configure:
   - **Name:** `send-notification-email`
   - **Table:** `notifications`
   - **Events:** Check **INSERT**
   - **Type:** Select **Supabase Edge Function**
   - **Edge Function:** Select `send-notification-email`
   - **HTTP Method:** POST
5. Click **Create webhook**

Now every time a notification is inserted into the database, the Edge Function fires and sends an email (if the user has that notification type enabled).

---

## Step 6: Schedule the Weekly Recap

1. Go to your **Supabase Dashboard**
2. Navigate to **Edge Functions** (left sidebar)
3. Find `weekly-recap` in the list
4. Click on it → go to **Schedule**
5. Set the cron expression: `0 8 * * 1`
   - This means: every Monday at 08:00 UTC
   - For 8am London time (GMT), this is correct in winter; in BST (summer), it'll be 9am
6. Save the schedule

---

## Step 7: Test It

### Test instant notification:
1. Open your hub and log in
2. Open a task and assign it to another team member
3. Click Done
4. Check that team member's email — they should receive a notification

### Test weekly recap manually:
```bash
# Invoke the function manually to test
supabase functions invoke weekly-recap
```

### Check logs:
```bash
# View Edge Function logs
supabase functions logs send-notification-email
supabase functions logs weekly-recap
```

---

## Troubleshooting

**"No email for user"** — The user doesn't have an email set in the Team directory. Edit their profile in the hub to add one.

**"User has this notification type disabled"** — The user turned off that notification type in Settings. They can re-enable it.

**Emails going to spam** — Verify your domain in Resend (Step 1) and ensure you have proper SPF/DKIM records.

**Function not triggering** — Check the webhook is set up correctly in Database → Webhooks. Make sure the table is `notifications` and the event is `INSERT`.

**Weekly recap not sending** — Check the schedule in Edge Functions. You can invoke manually to test: `supabase functions invoke weekly-recap`

---

## Architecture

```
User action (task update, assignment, etc.)
    ↓
Hub creates notification in Supabase → notifications table
    ↓
Database webhook fires → send-notification-email Edge Function
    ↓
Edge Function checks user's notif_settings
    ↓
If enabled → sends email via Resend API
```

```
Monday 8am UTC (cron schedule)
    ↓
weekly-recap Edge Function runs
    ↓
Queries all users, their tasks, projects, activity
    ↓
For each user with weeklyRecap enabled → sends recap email via Resend
```

---

## Costs

- **Resend free tier:** 3,000 emails/month, 100 emails/day — more than enough for a team of 5-10
- **Supabase Edge Functions:** Included in free tier (500,000 invocations/month)
- **Total cost: £0**
