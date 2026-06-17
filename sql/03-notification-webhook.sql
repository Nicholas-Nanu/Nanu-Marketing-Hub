-- ═══════════════════════════════════════════════════════════════
-- NANU MARKETING HUB — Notification Email Webhook
--
-- This creates a database webhook that fires the Edge Function
-- whenever a notification is inserted.
--
-- NOTE: You must set this up via Supabase Dashboard instead of SQL.
-- Go to: Database → Webhooks → Create Webhook
--   Name: send-notification-email
--   Table: notifications
--   Events: INSERT
--   Type: Supabase Edge Function
--   Edge Function: send-notification-email
--
-- Alternatively, use pg_net extension (if enabled) to call the
-- Edge Function directly from a trigger:
-- ═══════════════════════════════════════════════════════════════

-- Enable pg_net if not already (needed for HTTP calls from triggers)
-- CREATE EXTENSION IF NOT EXISTS pg_net;

-- Option A: Use Supabase Dashboard Webhooks (RECOMMENDED — no SQL needed)
-- This is the easiest approach. Go to Database → Webhooks in your Supabase dashboard.

-- Option B: Database trigger using pg_net (advanced)
-- Uncomment below if you prefer a trigger-based approach:

/*
CREATE OR REPLACE FUNCTION notify_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/send-notification-email',
    body := json_build_object('record', row_to_json(NEW))::jsonb,
    headers := json_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.supabase_service_key')
    )::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_notification_insert
  AFTER INSERT ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_insert();
*/
