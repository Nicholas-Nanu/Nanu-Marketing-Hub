import { supabase } from './supabase';

// ═══════════════════════════════════════════════════════════════
// LOAD ALL DATA (called on mount)
// ═══════════════════════════════════════════════════════════════

export async function loadAllData() {
  const [
    { data: users },
    { data: themes },
    { data: calItems },
    { data: taskItems },
    { data: resourceItems },
    { data: ideaItems },
    { data: captionItems },
    { data: hashtagItems },
    { data: messagingItems },
    { data: templateItems },
    { data: statsRow },
    { data: platformItems },
    { data: growthItems },
    { data: topPostItems },
    { data: noteItems },
    { data: keyDateItems },
    { data: campaignItems },
    { data: projectItems },
    { data: outreachItems },
    { data: activityItems },
  ] = await Promise.all([
    supabase.from('users').select('*'),
    supabase.from('weekly_themes').select('*').order('sort_order'),
    supabase.from('calendar_items').select('*').order('due_date'),
    supabase.from('tasks').select('*'),
    supabase.from('resources').select('*'),
    supabase.from('content_ideas').select('*'),
    supabase.from('captions').select('*'),
    supabase.from('hashtag_groups').select('*'),
    supabase.from('messaging_pillars').select('*'),
    supabase.from('content_templates').select('*'),
    supabase.from('stats').select('*').eq('id', 1),
    supabase.from('platform_stats').select('*'),
    supabase.from('weekly_growth').select('*').order('sort_order'),
    supabase.from('top_posts').select('*'),
    supabase.from('notes').select('*').order('created_at', { ascending: false }),
    supabase.from('key_dates').select('*').order('date'),
    supabase.from('campaigns').select('*'),
    supabase.from('projects').select('*'),
    supabase.from('outreach').select('*'),
    supabase.from('activity_log').select('*').order('time', { ascending: false }).limit(50),
  ]);

  const stat = statsRow?.[0] || { totals: {}, targets: {} };

  return {
    users: (users || []).map(u => ({
      id: u.id, name: u.name, username: u.username, pin: u.pin, role: u.role,
      email: u.email, tzLabel: u.tz_label, tz: u.tz, resp: u.resp,
      socials: u.socials || {}
    })),
    weeklyThemes: (themes || []).map(t => ({ day: t.day, theme: t.theme, color: t.color })),
    calendar: (calItems || []).map(c => ({
      id: c.id, title: c.title, platform: c.platform, status: c.status, owner: c.owner,
      dueDate: c.due_date, publishTime: c.publish_time, caption: c.caption,
      assetLink: c.asset_link, campaign: c.campaign
    })),
    tasks: (taskItems || []).map(t => ({
      id: t.id, title: t.title, owner: t.owner, dueDate: t.due_date, status: t.status,
      blocker: t.blocker, priority: t.priority, notes: t.notes,
      linkedContent: t.linked_content, project: t.project
    })),
    resources: (resourceItems || []).map(r => ({ id: r.id, group: r.grp, label: r.label, url: r.url })),
    ops: {
      ideas: (ideaItems || []).map(i => ({ id: i.id, text: i.text, category: i.category, votes: i.votes, status: i.status })),
      captions: (captionItems || []).map(c => ({ id: c.id, text: c.text, tags: c.tags || [] })),
      hashtags: (hashtagItems || []).map(h => ({ id: h.id, group: h.grp, tags: h.tags || [] })),
      messaging: (messagingItems || []).map(m => ({ id: m.id, pillar: m.pillar, line: m.line })),
      templates: (templateItems || []).map(t => ({ id: t.id, name: t.name, platform: t.platform, caption: t.caption, tags: t.tags || [] })),
    },
    stats: {
      lastUpdated: stat.last_updated || '',
      totals: stat.totals || {},
      targets: stat.targets || {},
      platforms: Object.fromEntries((platformItems || []).map(p => [p.platform, { followers: p.followers, lastWeek: p.last_week || 0, reach: p.reach, engagement: Number(p.engagement), growth: Number(p.growth) }])),
      weeklyGrowth: (growthItems || []).map(g => ({ week: g.week, users: g.users_count })),
      topPosts: (topPostItems || []).map(p => ({ platform: p.platform, title: p.title, metric: p.metric })),
    },
    notes: (noteItems || []).map(n => ({ id: n.id, text: n.text, author: n.author, pinned: n.pinned, date: n.date, color: n.color })),
    keyDates: (keyDateItems || []).map(d => ({ id: d.id, title: d.title, date: d.date, color: d.color })),
    campaigns: (campaignItems || []).map(c => ({ id: c.id, name: c.name, tag: c.tag, color: c.color })),
    projects: (projectItems || []).map(p => ({ id: p.id, name: p.name, description: p.description, color: p.color, owner: p.owner, status: p.status })),
    outreach: (outreachItems || []).map(o => ({ id: o.id, name: o.name, type: o.type, platform: o.platform, status: o.status, owner: o.owner, notes: o.notes, url: o.url, date: o.date })),
    activity: (activityItems || []).map(a => ({ id: a.id, user: a.user_id, action: a.action, target: a.target, section: a.section, time: a.time })),
  };
}

// ═══════════════════════════════════════════════════════════════
// INDIVIDUAL SAVE / DELETE OPERATIONS
// ═══════════════════════════════════════════════════════════════

// --- Users ---
export const saveUser = (u) => supabase.from('users').upsert({
  id: u.id, name: u.name, username: u.username, pin: u.pin, role: u.role,
  email: u.email, tz_label: u.tzLabel, tz: u.tz, resp: u.resp, socials: u.socials || {}
});
export const deleteUser = (id) => supabase.from('users').delete().eq('id', id);

// --- Weekly Themes ---
export const saveThemes = (themes) => {
  const rows = themes.map((t, i) => ({ day: t.day, theme: t.theme, color: t.color, sort_order: i }));
  return supabase.from('weekly_themes').upsert(rows, { onConflict: 'day' });
};

// --- Calendar ---
export const saveCalendarItem = (c) => supabase.from('calendar_items').upsert({
  id: c.id, title: c.title, platform: c.platform, status: c.status, owner: c.owner,
  due_date: c.dueDate, publish_time: c.publishTime, caption: c.caption,
  asset_link: c.assetLink, campaign: c.campaign
});
export const deleteCalendarItem = (id) => supabase.from('calendar_items').delete().eq('id', id);

// --- Tasks ---
export const saveTask = (t) => supabase.from('tasks').upsert({
  id: t.id, title: t.title, owner: t.owner, due_date: t.dueDate, status: t.status,
  blocker: t.blocker, priority: t.priority, notes: t.notes,
  linked_content: t.linkedContent, project: t.project || null
});
export const deleteTask = (id) => supabase.from('tasks').delete().eq('id', id);

// --- Resources ---
export const saveResource = (r) => supabase.from('resources').upsert({ id: r.id, grp: r.group, label: r.label, url: r.url });
export const deleteResource = (id) => supabase.from('resources').delete().eq('id', id);

// --- Content Ideas ---
export const saveIdea = (i) => supabase.from('content_ideas').upsert({ id: i.id, text: i.text, category: i.category, votes: i.votes, status: i.status });
export const deleteIdea = (id) => supabase.from('content_ideas').delete().eq('id', id);

// --- Captions ---
export const saveCaption = (c) => supabase.from('captions').upsert({ id: c.id, text: c.text, tags: c.tags });
export const deleteCaption = (id) => supabase.from('captions').delete().eq('id', id);

// --- Hashtag Groups ---
export const saveHashtag = (h) => supabase.from('hashtag_groups').upsert({ id: h.id, grp: h.group, tags: h.tags });
export const deleteHashtag = (id) => supabase.from('hashtag_groups').delete().eq('id', id);

// --- Messaging ---
export const saveMessaging = (m) => supabase.from('messaging_pillars').upsert({ id: m.id, pillar: m.pillar, line: m.line });
export const deleteMessaging = (id) => supabase.from('messaging_pillars').delete().eq('id', id);

// --- Templates ---
export const saveTemplate = (t) => supabase.from('content_templates').upsert({ id: t.id, name: t.name, platform: t.platform, caption: t.caption, tags: t.tags });
export const deleteTemplate = (id) => supabase.from('content_templates').delete().eq('id', id);

// --- Stats ---
export const saveStats = (totals, targets, lastUpdated) =>
  supabase.from('stats').upsert({ id: 1, totals, targets, last_updated: lastUpdated });

// --- Platform Stats ---
export const savePlatformStat = (platform, data) =>
  supabase.from('platform_stats').upsert({ platform, followers: data.followers, last_week: data.lastWeek || 0, reach: data.reach, engagement: data.engagement, growth: data.growth });

// --- Weekly Growth ---
export const saveWeeklyGrowth = async (entries) => {
  await supabase.from('weekly_growth').delete().gte('id', 0);
  const rows = entries.map((e, i) => ({ week: e.week, users_count: e.users, sort_order: i }));
  return supabase.from('weekly_growth').insert(rows);
};

// --- Notes ---
export const saveNote = (n) => supabase.from('notes').upsert({ id: n.id, text: n.text, author: n.author, pinned: n.pinned, date: n.date, color: n.color });
export const deleteNote = (id) => supabase.from('notes').delete().eq('id', id);

// --- Key Dates ---
export const saveKeyDates = async (dates) => {
  await supabase.from('key_dates').delete().neq('id', '');
  const rows = dates.map(d => ({ id: d.id, title: d.title, date: d.date, color: d.color }));
  return supabase.from('key_dates').insert(rows);
};

// --- Campaigns ---
export const saveCampaign = (c) => supabase.from('campaigns').upsert({ id: c.id, name: c.name, tag: c.tag, color: c.color });
export const deleteCampaign = (id) => supabase.from('campaigns').delete().eq('id', id);

// --- Projects ---
export const saveProject = (p) => supabase.from('projects').upsert({ id: p.id, name: p.name, description: p.description, color: p.color, owner: p.owner, status: p.status });
export const deleteProject = (id) => supabase.from('projects').delete().eq('id', id);

// --- Outreach ---
export const saveOutreach = (o) => supabase.from('outreach').upsert({ id: o.id, name: o.name, type: o.type, platform: o.platform, status: o.status, owner: o.owner, notes: o.notes, url: o.url, date: o.date });
export const deleteOutreach = (id) => supabase.from('outreach').delete().eq('id', id);

// --- Activity ---
export const logActivity = (entry) => supabase.from('activity_log').insert({ id: entry.id, user_id: entry.user, action: entry.action, target: entry.target, section: entry.section, time: entry.time });
