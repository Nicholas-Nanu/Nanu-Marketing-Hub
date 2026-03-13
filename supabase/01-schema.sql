-- ═══════════════════════════════════════════════════════════════
-- NANU MARKETING HUB — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- USERS (team members)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  pin TEXT NOT NULL DEFAULT '1234',
  role TEXT NOT NULL DEFAULT 'Content Creator',
  email TEXT,
  tz_label TEXT DEFAULT 'London',
  tz TEXT DEFAULT 'Europe/London',
  resp TEXT,
  socials JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WEEKLY THEMES
CREATE TABLE IF NOT EXISTS weekly_themes (
  id SERIAL PRIMARY KEY,
  day TEXT NOT NULL UNIQUE,
  theme TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#1FC2C2',
  sort_order INT DEFAULT 0
);

-- CALENDAR ITEMS
CREATE TABLE IF NOT EXISTS calendar_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  platform TEXT,
  status TEXT DEFAULT 'Idea',
  owner TEXT REFERENCES users(id),
  due_date TEXT,
  publish_time TEXT,
  caption TEXT,
  asset_link TEXT,
  campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#1FC2C2',
  owner TEXT REFERENCES users(id),
  status TEXT DEFAULT 'Planning',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TASKS
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  owner TEXT REFERENCES users(id),
  due_date TEXT,
  status TEXT DEFAULT 'Not Started',
  blocker TEXT,
  priority TEXT DEFAULT 'Medium',
  notes TEXT,
  linked_content TEXT,
  project TEXT REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RESOURCES
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  grp TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTENT IDEAS
CREATE TABLE IF NOT EXISTS content_ideas (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  category TEXT,
  votes INT DEFAULT 0,
  status TEXT DEFAULT 'Open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CAPTIONS
CREATE TABLE IF NOT EXISTS captions (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HASHTAG GROUPS
CREATE TABLE IF NOT EXISTS hashtag_groups (
  id TEXT PRIMARY KEY,
  grp TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MESSAGING PILLARS
CREATE TABLE IF NOT EXISTS messaging_pillars (
  id TEXT PRIMARY KEY,
  pillar TEXT NOT NULL,
  line TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTENT TEMPLATES
CREATE TABLE IF NOT EXISTS content_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT,
  caption TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STATS (single row — totals + targets)
CREATE TABLE IF NOT EXISTS stats (
  id INT PRIMARY KEY DEFAULT 1,
  last_updated TEXT,
  totals JSONB DEFAULT '{}'::jsonb,
  targets JSONB DEFAULT '{}'::jsonb
);

-- PLATFORM STATS
CREATE TABLE IF NOT EXISTS platform_stats (
  platform TEXT PRIMARY KEY,
  followers INT DEFAULT 0,
  reach INT DEFAULT 0,
  engagement NUMERIC(5,2) DEFAULT 0,
  growth NUMERIC(5,2) DEFAULT 0
);

-- WEEKLY GROWTH
CREATE TABLE IF NOT EXISTS weekly_growth (
  id SERIAL PRIMARY KEY,
  week TEXT NOT NULL,
  users_count INT DEFAULT 0,
  sort_order INT DEFAULT 0
);

-- TOP POSTS
CREATE TABLE IF NOT EXISTS top_posts (
  id SERIAL PRIMARY KEY,
  platform TEXT,
  title TEXT,
  metric TEXT
);

-- NOTES
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  author TEXT REFERENCES users(id),
  pinned BOOLEAN DEFAULT false,
  date TEXT,
  color TEXT DEFAULT '#1FC2C2',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- KEY DATES
CREATE TABLE IF NOT EXISTS key_dates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT,
  color TEXT DEFAULT '#1FC2C2',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CAMPAIGNS
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tag TEXT,
  color TEXT DEFAULT '#1FC2C2',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OUTREACH
CREATE TABLE IF NOT EXISTS outreach (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'Community',
  platform TEXT,
  status TEXT DEFAULT 'Identified',
  owner TEXT REFERENCES users(id),
  notes TEXT,
  url TEXT,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACTIVITY LOG
CREATE TABLE IF NOT EXISTS activity_log (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  action TEXT,
  target TEXT,
  section TEXT,
  time TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- DISABLE RLS FOR INTERNAL TOOL (team-only, no public access)
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE captions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtag_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE messaging_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_growth ENABLE ROW LEVEL SECURITY;
ALTER TABLE top_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Allow all operations with anon key (internal team tool)
CREATE POLICY "Allow all" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON weekly_themes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON calendar_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON resources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON content_ideas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON captions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON hashtag_groups FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON messaging_pillars FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON content_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON platform_stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON weekly_growth FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON top_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON key_dates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON campaigns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON outreach FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON activity_log FOR ALL USING (true) WITH CHECK (true);
