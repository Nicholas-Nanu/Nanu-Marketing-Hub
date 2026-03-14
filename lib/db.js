import { supabase } from './supabase';

// Helper: wrap every supabase call so it always returns a proper Promise
// and never throws — just logs errors
async function run(fn) {
  try {
    const result = await fn();
    if (result?.error) console.error("Supabase error:", result.error);
    return result;
  } catch (err) {
    console.error("DB error:", err);
    return { error: err };
  }
}

// ═══════════════════════════════════════════════════════════════
// LOAD ALL DATA (called on mount)
// ═══════════════════════════════════════════════════════════════

export async function loadAllData() {
  const results = await Promise.allSettled([
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

  const get = (i) => results[i]?.status === 'fulfilled' ? (results[i].value?.data || []) : [];

  const stat = (get(10))?.[0] || { totals: {}, targets: {} };

  return {
    users: get(0).map(u => ({ id: u.id, name: u.name, username: u.username, pin: u.pin, role: u.role, email: u.email, tzLabel: u.tz_label, tz: u.tz, resp: u.resp, socials: u.socials || {} })),
    weeklyThemes: get(1).map(t => ({ day: t.day, theme: t.theme, color: t.color })),
    calendar: get(2).map(c => ({ id: c.id, title: c.title, platform: c.platform, status: c.status, owner: c.owner, dueDate: c.due_date, publishTime: c.publish_time, caption: c.caption, assetLink: c.asset_link, campaign: c.campaign })),
    tasks: get(3).map(t => ({ id: t.id, title: t.title, owner: t.owner, dueDate: t.due_date, status: t.status, blocker: t.blocker, priority: t.priority, notes: t.notes, linkedContent: t.linked_content, project: t.project })),
    resources: get(4).map(r => ({ id: r.id, group: r.grp, label: r.label, url: r.url })),
    ops: {
      ideas: get(5).map(i => ({ id: i.id, text: i.text, category: i.category, votes: i.votes, status: i.status })),
      captions: get(6).map(c => ({ id: c.id, text: c.text, tags: c.tags || [] })),
      hashtags: get(7).map(h => ({ id: h.id, group: h.grp, tags: h.tags || [] })),
      messaging: get(8).map(m => ({ id: m.id, pillar: m.pillar, line: m.line })),
      templates: get(9).map(t => ({ id: t.id, name: t.name, platform: t.platform, caption: t.caption, tags: t.tags || [] })),
    },
    stats: {
      lastUpdated: stat.last_updated || '',
      totals: stat.totals || {},
      targets: stat.targets || {},
      platforms: Object.fromEntries(get(11).map(p => [p.platform, { followers: p.followers, lastWeek: p.last_week || 0, reach: p.reach, engagement: Number(p.engagement), growth: Number(p.growth) }])),
      weeklyGrowth: get(12).map(g => ({ week: g.week, users: g.users_count })),
      topPosts: get(13).map(p => ({ platform: p.platform, title: p.title, metric: p.metric })),
    },
    notes: get(14).map(n => ({ id: n.id, text: n.text, author: n.author, pinned: n.pinned, date: n.date, color: n.color })),
    keyDates: get(15).map(d => ({ id: d.id, title: d.title, date: d.date, color: d.color })),
    campaigns: get(16).map(c => ({ id: c.id, name: c.name, tag: c.tag, color: c.color })),
    projects: get(17).map(p => ({ id: p.id, name: p.name, description: p.description, color: p.color, owner: p.owner, status: p.status })),
    outreach: get(18).map(o => ({ id: o.id, name: o.name, type: o.type, platform: o.platform, status: o.status, owner: o.owner, notes: o.notes, url: o.url, date: o.date })),
    activity: get(19).map(a => ({ id: a.id, user: a.user_id, action: a.action, target: a.target, section: a.section, time: a.time })),
  };
}

// ═══════════════════════════════════════════════════════════════
// INDIVIDUAL SAVE / DELETE OPERATIONS
// All wrapped in run() — always return Promise, never throw
// ═══════════════════════════════════════════════════════════════

export const saveUser = (u) => run(() => supabase.from('users').upsert({ id: u.id, name: u.name, username: u.username, pin: u.pin, role: u.role, email: u.email, tz_label: u.tzLabel, tz: u.tz, resp: u.resp, socials: u.socials || {} }));
export const deleteUser = (id) => run(() => supabase.from('users').delete().eq('id', id));
export const saveThemes = (themes) => run(async () => { const rows = themes.map((t, i) => ({ day: t.day, theme: t.theme, color: t.color, sort_order: i })); return supabase.from('weekly_themes').upsert(rows, { onConflict: 'day' }); });
export const saveCalendarItem = (c) => run(() => supabase.from('calendar_items').upsert({ id: c.id, title: c.title, platform: c.platform, status: c.status, owner: c.owner, due_date: c.dueDate, publish_time: c.publishTime, caption: c.caption, asset_link: c.assetLink, campaign: c.campaign }));
export const deleteCalendarItem = (id) => run(() => supabase.from('calendar_items').delete().eq('id', id));
export const saveTask = (t) => run(() => supabase.from('tasks').upsert({ id: t.id, title: t.title, owner: t.owner, due_date: t.dueDate, status: t.status, blocker: t.blocker, priority: t.priority, notes: t.notes, linked_content: t.linkedContent, project: t.project || null }));
export const deleteTask = (id) => run(() => supabase.from('tasks').delete().eq('id', id));
export const saveResource = (r) => run(() => supabase.from('resources').upsert({ id: r.id, grp: r.group, label: r.label, url: r.url }));
export const deleteResource = (id) => run(() => supabase.from('resources').delete().eq('id', id));
export const saveIdea = (i) => run(() => supabase.from('content_ideas').upsert({ id: i.id, text: i.text, category: i.category, votes: i.votes, status: i.status }));
export const deleteIdea = (id) => run(() => supabase.from('content_ideas').delete().eq('id', id));
export const saveCaption = (c) => run(() => supabase.from('captions').upsert({ id: c.id, text: c.text, tags: c.tags }));
export const deleteCaption = (id) => run(() => supabase.from('captions').delete().eq('id', id));
export const saveHashtag = (h) => run(() => supabase.from('hashtag_groups').upsert({ id: h.id, grp: h.group, tags: h.tags }));
export const deleteHashtag = (id) => run(() => supabase.from('hashtag_groups').delete().eq('id', id));
export const saveMessaging = (m) => run(() => supabase.from('messaging_pillars').upsert({ id: m.id, pillar: m.pillar, line: m.line }));
export const deleteMessaging = (id) => run(() => supabase.from('messaging_pillars').delete().eq('id', id));
export const saveTemplate = (t) => run(() => supabase.from('content_templates').upsert({ id: t.id, name: t.name, platform: t.platform, caption: t.caption, tags: t.tags }));
export const deleteTemplate = (id) => run(() => supabase.from('content_templates').delete().eq('id', id));
export const saveStats = (totals, targets, lastUpdated) => run(() => supabase.from('stats').upsert({ id: 1, totals, targets, last_updated: lastUpdated }));
export const savePlatformStat = (platform, data) => run(() => supabase.from('platform_stats').upsert({ platform, followers: data.followers, last_week: data.lastWeek || 0, reach: data.reach, engagement: data.engagement, growth: data.growth }));
export const saveWeeklyGrowth = async (entries) => { await run(() => supabase.from('weekly_growth').delete().gte('id', 0)); return run(() => supabase.from('weekly_growth').insert(entries.map((e, i) => ({ week: e.week, users_count: e.users, sort_order: i })))); };
export const saveNote = (n) => run(() => supabase.from('notes').upsert({ id: n.id, text: n.text, author: n.author, pinned: n.pinned, date: n.date, color: n.color }));
export const deleteNote = (id) => run(() => supabase.from('notes').delete().eq('id', id));
export const saveKeyDates = async (dates) => { await run(() => supabase.from('key_dates').delete().neq('id', '')); return run(() => supabase.from('key_dates').insert(dates.map(d => ({ id: d.id, title: d.title, date: d.date, color: d.color })))); };
export const saveCampaign = (c) => run(() => supabase.from('campaigns').upsert({ id: c.id, name: c.name, tag: c.tag, color: c.color }));
export const deleteCampaign = (id) => run(() => supabase.from('campaigns').delete().eq('id', id));
export const saveProject = (p) => run(() => supabase.from('projects').upsert({ id: p.id, name: p.name, description: p.description, color: p.color, owner: p.owner, status: p.status }));
export const deleteProject = (id) => run(() => supabase.from('projects').delete().eq('id', id));
export const saveOutreach = (o) => run(() => supabase.from('outreach').upsert({ id: o.id, name: o.name, type: o.type, platform: o.platform, status: o.status, owner: o.owner, notes: o.notes, url: o.url, date: o.date }));
export const deleteOutreach = (id) => run(() => supabase.from('outreach').delete().eq('id', id));
export const logActivity = (entry) => run(() => supabase.from('activity_log').insert({ id: entry.id, user_id: entry.user, action: entry.action, target: entry.target, section: entry.section, time: entry.time }));
