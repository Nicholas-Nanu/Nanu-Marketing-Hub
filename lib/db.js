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
    supabase.from('partnerships').select('*'),
    supabase.from('activity_log').select('*').order('time', { ascending: false }).limit(50),
    supabase.from('ambassadors').select('*'),
    supabase.from('comm_channels').select('*'),
    supabase.from('comm_events').select('*'),
    supabase.from('feedback').select('*').order('date', { ascending: false }),
    supabase.from('engagement').select('data').eq('id', 'metrics').maybeSingle(),
    supabase.from('responsibilities').select('*'),
    supabase.from('biz_metrics').select('data').eq('id', 'current').maybeSingle(),
    supabase.from('investors').select('*'),
    supabase.from('board_updates').select('*'),
    supabase.from('initiatives').select('*'),
    supabase.from('biz_documents').select('*'),
    supabase.from('fg_rounds').select('*'),
    supabase.from('fg_participants').select('*'),
    supabase.from('fg_assets').select('*'),
    supabase.from('fg_channels').select('*'),
    supabase.from('access_register').select('*'),
    supabase.from('open_seats').select('*'),
    supabase.from('org_units').select('*').order('sort_order'),
    supabase.from('raci_items').select('*'),
    supabase.from('moc_items').select('*'),
    supabase.from('media_products').select('*').order('sort_order'),
    supabase.from('media_items').select('*'),
    supabase.from('media_roles').select('*'),
    supabase.from('media_ideas').select('*'),
    supabase.from('media_feedback').select('*'),
    supabase.from('media_tools').select('*'),
    supabase.from('media_folders').select('*'),
  ]);

  const get = (i) => results[i]?.status === 'fulfilled' ? (results[i].value?.data || []) : [];

  const stat = (get(10))?.[0] || { totals: {}, targets: {} };

  return {
    users: get(0).map(u => ({ id: u.id, name: u.name, username: u.username, pin: u.pin, role: u.role, email: u.email, tzLabel: u.tz_label, tz: u.tz, resp: u.resp, socials: u.socials || {}, active: u.active !== false })),
    weeklyThemes: get(1).map(t => ({ day: t.day, theme: t.theme, color: t.color })),
    calendar: get(2).map(c => ({ id: c.id, title: c.title, platform: c.platform, status: c.status, owner: c.owner, dueDate: c.due_date, publishTime: c.publish_time, caption: c.caption, assetLink: c.asset_link, campaign: c.campaign })),
    tasks: get(3).map(t => ({ id: t.id, title: t.title, owners: t.owners || [], dueDate: t.due_date, status: t.status, blocker: t.blocker, priority: t.priority, notes: t.notes, linkedContent: t.linked_content, project: t.project, updates: t.updates || [] })),
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
    projects: get(17).map(p => ({ id: p.id, name: p.name, description: p.description, color: p.color, owner: p.owner, status: p.status, members: p.members || [], notes: p.notes || '', links: p.links || [], private: p.private || false })),
    outreach: get(18).map(o => ({ id: o.id, name: o.name, type: o.type, platform: o.platform, status: o.status, owner: o.owner, notes: o.notes, url: o.url, date: o.date, contactName: o.contact_name || '', contactEmail: o.contact_email || '', linkedTasks: o.linked_tasks || [] })),
    partnerships: get(19).map(p => ({ id: p.id, name: p.name, description: p.description, type: p.type, status: p.status, owner: p.owner, contactName: p.contact_name || '', contactEmail: p.contact_email || '', value: p.value || '', startDate: p.start_date || '', reviewDate: p.review_date || '', linkedOutreach: p.linked_outreach || '', linkedTasks: p.linked_tasks || [], links: p.links || [], updates: p.updates || [] })),
    activity: get(20).map(a => ({ id: a.id, user: a.user_id, action: a.action, target: a.target, section: a.section, time: a.time })),
    ambassadors: get(21).map(a => ({ id: a.id, name: a.name, email: a.email, platform: a.platform, followers: a.followers || 0, status: a.status, joinDate: a.join_date || '', region: a.region || '', focus: a.focus || '', inviteCode: a.invite_code || '', referrals: a.referrals || 0, notes: a.notes || '', links: a.links || [] })),
    commChannels: get(22).map(c => ({ id: c.id, name: c.name, platform: c.platform, url: c.url || '', members: c.members || 0, status: c.status, priority: c.priority || 'Medium', owner: c.owner, lastEngaged: c.last_engaged || '', notes: c.notes || '' })),
    commEvents: get(23).map(e => ({ id: e.id, title: e.title, type: e.type, date: e.date || '', time: e.time || '', duration: e.duration || 60, status: e.status, host: e.host, platform: e.platform || '', expectedAttendees: e.expected_attendees || 0, actualAttendees: e.actual_attendees || 0, description: e.description || '', recording: e.recording || '', notes: e.notes || '' })),
    feedback: get(24).map(f => ({ id: f.id, source: f.source, user: f.user_label || '', contact: f.contact || '', type: f.type, sentiment: f.sentiment, text: f.text, date: f.date || '', status: f.status, owner: f.owner || '', response: f.response || '', tags: f.tags || [] })),
    engagement: (() => { const r = results[25]; return r?.status === 'fulfilled' ? (r.value?.data?.data || {}) : {}; })(),
    responsibilities: get(26).map(r => ({ id: r.id, title: r.title, description: r.description || '', owner: r.owner || '', area: r.area || '', cadence: r.cadence, status: r.status || 'Active', anchorDate: r.anchor_date || '', nextDue: r.next_due || '', lastDone: r.last_done || '', color: r.color || '', linkedTasks: r.linked_tasks || [], notes: r.notes || '' })),
    bizMetrics: (() => { const r = results[27]; return r?.status === 'fulfilled' ? (r.value?.data?.data || {}) : {}; })(),
    investors: get(28).map(i => ({ id: i.id, name: i.name, firm: i.firm || '', type: i.type || '', stage: i.stage, checkSize: i.check_size || '', owner: i.owner || '', contactName: i.contact_name || '', contactEmail: i.contact_email || '', nextStep: i.next_step || '', nextDate: i.next_date || '', warmIntro: i.warm_intro || '', notes: i.notes || '' })),
    boardUpdates: get(29).map(b => ({ id: b.id, title: b.title, period: b.period || '', date: b.date || '', status: b.status || 'Draft', author: b.author || '', highlights: b.highlights || '', lowlights: b.lowlights || '', asks: b.asks || '', metricsSnapshot: b.metrics_snapshot || '', link: b.link || '' })),
    initiatives: get(30).map(i => ({ id: i.id, title: i.title, description: i.description || '', owner: i.owner || '', status: i.status || 'Not Started', horizon: i.horizon || '', progress: i.progress || 0, targetDate: i.target_date || '', successMetric: i.success_metric || '', notes: i.notes || '' })),
    bizDocs: get(31).map(d => ({ id: d.id, title: d.title, category: d.category || '', status: d.status || 'Draft', version: d.version || '', owner: d.owner || '', link: d.link || '', effectiveDate: d.effective_date || '', expiryDate: d.expiry_date || '', confidential: !!d.confidential, notes: d.notes || '' })),
    fgRounds: get(32).map(r => ({ id: r.id, title: r.title, objective: r.objective || '', startDate: r.start_date || '', endDate: r.end_date || '', status: r.status || 'Planning', owner: r.owner || '', targetN: r.target_n || 0, sessionLink: r.session_link || '', notes: r.notes || '' })),
    fgParticipants: get(33).map(p => ({ id: p.id, roundId: p.round_id || '', name: p.name, email: p.email || '', phone: p.phone || '', source: p.source || '', status: p.status || 'Not Sent', invitedDate: p.invited_date || '', respondedDate: p.responded_date || '', sessionSlot: p.session_slot || '', responseLink: p.response_link || '', notes: p.notes || '' })),
    fgAssets: get(34).map(a => ({ id: a.id, roundId: a.round_id || '', name: a.name, type: a.type || 'Survey', url: a.url || '', addedDate: a.added_date || '', notes: a.notes || '' })),
    fgChannels: get(35).map(c => ({ id: c.id, name: c.name, platform: c.platform || '', url: c.url || '', status: c.status || 'Pending', rules: c.rules || '', owner: c.owner || '', notes: c.notes || '' })),
    accessRegister: get(36).map(a => ({ id: a.id, system: a.system, primaryHolder: a.primary_holder || '', backupHolder: a.backup_holder || '', status: a.status || 'No backup', category: a.category || '', lastVerified: a.last_verified || '', notes: a.notes || '' })),
    openSeats: get(37).map(s => ({ id: s.id, title: s.title, department: s.department || '', func: s.func || '', impact: s.impact || '', interim: s.interim || '', status: s.status || 'Open', urgency: s.urgency || 'Medium', hoursPerWeek: s.hours_per_week || 0, funded: !!s.funded, notes: s.notes || '' })),
    orgUnits: get(38).map(u => ({ id: u.id, layer: u.layer || 'Function', name: u.name, department: u.department || '', holderUser: u.holder_user || '', holderText: u.holder_text || '', reportsTo: u.reports_to || '', status: u.status || 'Active', sortOrder: u.sort_order || 0, notes: u.notes || '' })),
    raciItems: get(39).map(r => ({ id: r.id, output: r.output, accountable: r.accountable || '', responsible: r.responsible || '', consulted: r.consulted || '', department: r.department || '', notes: r.notes || '' })),
    mocItems: get(40).map(m => ({ id: m.id, func: m.func, department: m.department || '', headUser: m.head_user || '', headText: m.head_text || '', minimum: m.minimum || '', currentState: m.current_state || '', gap: m.gap || '', status: m.status || 'Operating', hoursNeeded: m.hours_needed || 0, confirmed: !!m.confirmed, notes: m.notes || '' })),
    mediaProducts: get(41).map(p => ({ id: p.id, name: p.name, description: p.description || '', format: p.format || '', cadence: p.cadence || '', showrunner: p.showrunner || '', status: p.status || 'Active', driveUrl: p.drive_url || '', color: p.color || '#1FC2C2', sortOrder: p.sort_order || 0, notes: p.notes || '' })),
    mediaItems: get(42).map(i => ({ id: i.id, productId: i.product_id || '', title: i.title, stage: i.stage || 'Idea', owner: i.owner || '', episodeNo: i.episode_no || '', summary: i.summary || '', dueDate: i.due_date || '', airDate: i.air_date || '', scriptUrl: i.script_url || '', assetsUrl: i.assets_url || '', finalUrl: i.final_url || '', blocker: i.blocker || '', notes: i.notes || '' })),
    mediaRoles: get(43).map(r => ({ id: r.id, productId: r.product_id || '', function: r.function, holderUser: r.holder_user || '', holderText: r.holder_text || '', backupUser: r.backup_user || '', notes: r.notes || '' })),
    mediaIdeas: get(44).map(i => ({ id: i.id, title: i.title, description: i.description || '', productId: i.product_id || '', submittedBy: i.submitted_by || '', submittedDate: i.submitted_date || '', status: i.status || 'New', votes: i.votes || [], response: i.response || '' })),
    mediaFeedback: get(45).map(f => ({ id: f.id, subject: f.subject, body: f.body || '', type: f.type || 'Suggestion', productId: f.product_id || '', submittedBy: f.submitted_by || '', submittedDate: f.submitted_date || '', status: f.status || 'New', response: f.response || '' })),
    mediaTools: get(46).map(t => ({ id: t.id, name: t.name, category: t.category || '', purpose: t.purpose || '', url: t.url || '', accessHolder: t.access_holder || '', sharedAccess: t.shared_access || '', cost: t.cost || '', status: t.status || 'In use', notes: t.notes || '' })),
    mediaFolders: get(47).map(f => ({ id: f.id, name: f.name, productId: f.product_id || '', url: f.url || '', purpose: f.purpose || '', notes: f.notes || '' })),
  };
}

// ═══════════════════════════════════════════════════════════════
// INDIVIDUAL SAVE / DELETE OPERATIONS
// All wrapped in run() — always return Promise, never throw
// ═══════════════════════════════════════════════════════════════

export const saveUser = (u) => run(() => supabase.from('users').upsert({ id: u.id, name: u.name, username: u.username, pin: u.pin, role: u.role, email: u.email, tz_label: u.tzLabel, tz: u.tz, resp: u.resp, socials: u.socials || {}, active: u.active !== false }));
export const deleteUser = (id) => run(() => supabase.from('users').delete().eq('id', id));
export const saveThemes = (themes) => run(async () => { const rows = themes.map((t, i) => ({ day: t.day, theme: t.theme, color: t.color, sort_order: i })); return supabase.from('weekly_themes').upsert(rows, { onConflict: 'day' }); });
export const saveCalendarItem = (c) => run(() => supabase.from('calendar_items').upsert({ id: c.id, title: c.title, platform: c.platform, status: c.status, owner: c.owner, due_date: c.dueDate, publish_time: c.publishTime, caption: c.caption, asset_link: c.assetLink, campaign: c.campaign }));
export const deleteCalendarItem = (id) => run(() => supabase.from('calendar_items').delete().eq('id', id));
export const saveTask = (t) => run(() => supabase.from('tasks').upsert({ id: t.id, title: t.title, owners: t.owners || [], due_date: t.dueDate, status: t.status, blocker: t.blocker, priority: t.priority, notes: t.notes, linked_content: t.linkedContent, project: t.project || null, updates: t.updates || [] }));
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
export const saveProject = (p) => run(() => supabase.from('projects').upsert({ id: p.id, name: p.name, description: p.description, color: p.color, owner: p.owner, status: p.status, members: p.members || [], notes: p.notes || '', links: p.links || [], private: p.private || false }));
export const deleteProject = (id) => run(() => supabase.from('projects').delete().eq('id', id));
export const saveOutreach = (o) => run(() => supabase.from('outreach').upsert({ id: o.id, name: o.name, type: o.type, platform: o.platform, status: o.status, owner: o.owner, notes: o.notes, url: o.url, date: o.date, contact_name: o.contactName || '', contact_email: o.contactEmail || '', linked_tasks: o.linkedTasks || [] }));
export const deleteOutreach = (id) => run(() => supabase.from('outreach').delete().eq('id', id));
export const logActivity = (entry) => run(() => supabase.from('activity_log').insert({ id: entry.id, user_id: entry.user, action: entry.action, target: entry.target, section: entry.section, time: entry.time }));

// --- Notifications ---
export const saveNotification = (n) => run(() => supabase.from('notifications').insert({ id: n.id, user_id: n.user_id, type: n.type, title: n.title, body: n.body, link: n.link || '', read: false, time: n.time }));
export const loadNotifications = async (userId) => {
  const res = await run(() => supabase.from('notifications').select('*').eq('user_id', userId).order('time', { ascending: false }).limit(50));
  return (res?.data || []).map(n => ({ id: n.id, user_id: n.user_id, type: n.type, title: n.title, body: n.body, link: n.link, read: n.read, time: n.time }));
};
export const markNotifRead = (id) => run(() => supabase.from('notifications').update({ read: true }).eq('id', id));
export const clearNotifications = (userId) => run(() => supabase.from('notifications').delete().eq('user_id', userId));

// --- Notification Settings ---
export const saveNotifSettings = (userId, settings) => run(() => supabase.from('notif_settings').upsert({ user_id: userId, settings }));
export const loadNotifSettings = async (userId) => {
  const res = await run(() => supabase.from('notif_settings').select('settings').eq('user_id', userId).single());
  return res?.data?.settings || null;
};

// --- Partnerships ---
export const savePartnership = (p) => run(() => supabase.from('partnerships').upsert({
  id: p.id, name: p.name, description: p.description, type: p.type, status: p.status,
  owner: p.owner, contact_name: p.contactName || '', contact_email: p.contactEmail || '',
  value: p.value || '', start_date: p.startDate || '', review_date: p.reviewDate || '',
  linked_outreach: p.linkedOutreach || '', linked_tasks: p.linkedTasks || [],
  links: p.links || [], updates: p.updates || []
}));
export const deletePartnership = (id) => run(() => supabase.from('partnerships').delete().eq('id', id));

// --- Personal Workspace ---
export const saveWorkspace = (userId, data) => run(() => supabase.from('workspaces').upsert({ user_id: userId, data }));
export const loadWorkspace = async (userId) => {
  const res = await run(() => supabase.from('workspaces').select('data').eq('user_id', userId).single());
  return res?.data?.data || null;
};


// --- Ambassadors ---
export const saveAmbassador = (a) => run(() => supabase.from('ambassadors').upsert({
  id: a.id, name: a.name, email: a.email, platform: a.platform, followers: a.followers||0,
  status: a.status, join_date: a.joinDate||'', region: a.region||'', focus: a.focus||'',
  invite_code: a.inviteCode||'', referrals: a.referrals||0, notes: a.notes||'', links: a.links||[]
}));
export const deleteAmbassador = (id) => run(() => supabase.from('ambassadors').delete().eq('id', id));

// --- Community Channels ---
export const saveCommChannel = (c) => run(() => supabase.from('comm_channels').upsert({
  id: c.id, name: c.name, platform: c.platform, url: c.url||'', members: c.members||0,
  status: c.status, priority: c.priority||'Medium', owner: c.owner,
  last_engaged: c.lastEngaged||'', notes: c.notes||''
}));
export const deleteCommChannel = (id) => run(() => supabase.from('comm_channels').delete().eq('id', id));

// --- Community Events ---
export const saveCommEvent = (e) => run(() => supabase.from('comm_events').upsert({
  id: e.id, title: e.title, type: e.type, date: e.date||'', time: e.time||'',
  duration: e.duration||60, status: e.status, host: e.host, platform: e.platform||'',
  expected_attendees: e.expectedAttendees||0, actual_attendees: e.actualAttendees||0,
  description: e.description||'', recording: e.recording||'', notes: e.notes||''
}));
export const deleteCommEvent = (id) => run(() => supabase.from('comm_events').delete().eq('id', id));

// --- Feedback ---
export const saveFeedback = (f) => run(() => supabase.from('feedback').upsert({
  id: f.id, source: f.source, user_label: f.user||'', contact: f.contact||'',
  type: f.type, sentiment: f.sentiment, text: f.text, date: f.date||'',
  status: f.status, owner: f.owner||null, response: f.response||'', tags: f.tags||[]
}));
export const deleteFeedback = (id) => run(() => supabase.from('feedback').delete().eq('id', id));

// --- Engagement ---
export const saveEngagement = (data) => run(() => supabase.from('engagement').upsert({ id: 'metrics', data }));

// --- Responsibilities ---
export const saveResponsibility = (r) => run(() => supabase.from('responsibilities').upsert({
  id: r.id, title: r.title, description: r.description||'', owner: r.owner||null,
  area: r.area||'', cadence: r.cadence, status: r.status||'Active',
  anchor_date: r.anchorDate||'', next_due: r.nextDue||'', last_done: r.lastDone||'',
  color: r.color||'', linked_tasks: r.linkedTasks||[], notes: r.notes||''
}));
export const deleteResponsibility = (id) => run(() => supabase.from('responsibilities').delete().eq('id', id));

// --- Business: Metrics (single blob) ---
export const saveBizMetrics = (data) => run(() => supabase.from('biz_metrics').upsert({ id: 'current', data }));

// --- Business: Investors ---
export const saveInvestor = (i) => run(() => supabase.from('investors').upsert({
  id: i.id, name: i.name, firm: i.firm||'', type: i.type||'', stage: i.stage,
  check_size: i.checkSize||'', owner: i.owner||null, contact_name: i.contactName||'',
  contact_email: i.contactEmail||'', next_step: i.nextStep||'', next_date: i.nextDate||'',
  warm_intro: i.warmIntro||'', notes: i.notes||''
}));
export const deleteInvestor = (id) => run(() => supabase.from('investors').delete().eq('id', id));

// --- Business: Board Updates ---
export const saveBoardUpdate = (b) => run(() => supabase.from('board_updates').upsert({
  id: b.id, title: b.title, period: b.period||'', date: b.date||'', status: b.status||'Draft',
  author: b.author||null, highlights: b.highlights||'', lowlights: b.lowlights||'',
  asks: b.asks||'', metrics_snapshot: b.metricsSnapshot||'', link: b.link||''
}));
export const deleteBoardUpdate = (id) => run(() => supabase.from('board_updates').delete().eq('id', id));

// --- Business: Strategic Initiatives ---
export const saveInitiative = (i) => run(() => supabase.from('initiatives').upsert({
  id: i.id, title: i.title, description: i.description||'', owner: i.owner||null,
  status: i.status||'Not Started', horizon: i.horizon||'', progress: i.progress||0,
  target_date: i.targetDate||'', success_metric: i.successMetric||'', notes: i.notes||''
}));
export const deleteInitiative = (id) => run(() => supabase.from('initiatives').delete().eq('id', id));

// --- Business Documents ---
export const saveBizDoc = (d) => run(() => supabase.from('biz_documents').upsert({
  id: d.id, title: d.title, category: d.category||'', status: d.status||'Draft',
  version: d.version||'', owner: d.owner||null, link: d.link||'',
  effective_date: d.effectiveDate||'', expiry_date: d.expiryDate||'',
  confidential: !!d.confidential, notes: d.notes||''
}));
export const deleteBizDoc = (id) => run(() => supabase.from('biz_documents').delete().eq('id', id));

// --- Focus Groups: Rounds ---
export const saveFgRound = (r) => run(() => supabase.from('fg_rounds').upsert({
  id: r.id, title: r.title, objective: r.objective||'', start_date: r.startDate||'',
  end_date: r.endDate||'', status: r.status||'Planning', owner: r.owner||null,
  target_n: r.targetN||0, session_link: r.sessionLink||'', notes: r.notes||''
}));
export const deleteFgRound = (id) => run(() => supabase.from('fg_rounds').delete().eq('id', id));

// --- Focus Groups: Participants ---
export const saveFgParticipant = (p) => run(() => supabase.from('fg_participants').upsert({
  id: p.id, round_id: p.roundId||null, name: p.name, email: p.email||'', phone: p.phone||'',
  source: p.source||'', status: p.status||'Not Sent', invited_date: p.invitedDate||'',
  responded_date: p.respondedDate||'', session_slot: p.sessionSlot||'',
  response_link: p.responseLink||'', notes: p.notes||''
}));
export const deleteFgParticipant = (id) => run(() => supabase.from('fg_participants').delete().eq('id', id));

// --- Focus Groups: Assets ---
export const saveFgAsset = (a) => run(() => supabase.from('fg_assets').upsert({
  id: a.id, round_id: a.roundId||null, name: a.name, type: a.type||'Survey',
  url: a.url||'', added_date: a.addedDate||'', notes: a.notes||''
}));
export const deleteFgAsset = (id) => run(() => supabase.from('fg_assets').delete().eq('id', id));

// --- Focus Groups: Posting Areas ---
export const saveFgChannel = (c) => run(() => supabase.from('fg_channels').upsert({
  id: c.id, name: c.name, platform: c.platform||'', url: c.url||'',
  status: c.status||'Pending', rules: c.rules||'', owner: c.owner||null, notes: c.notes||''
}));
export const deleteFgChannel = (id) => run(() => supabase.from('fg_channels').delete().eq('id', id));

// --- Admin: clear the whole team's activity log ---
export const clearAllActivity = () => run(() => supabase.from('activity_log').delete().neq('id', ''));

// --- Company Structure: Access & Backup Register (holders only, never credentials) ---
export const saveAccessItem = (a) => run(() => supabase.from('access_register').upsert({
  id: a.id, system: a.system, primary_holder: a.primaryHolder||null, backup_holder: a.backupHolder||null,
  status: a.status||'No backup', category: a.category||'', last_verified: a.lastVerified||'', notes: a.notes||''
}));
export const deleteAccessItem = (id) => run(() => supabase.from('access_register').delete().eq('id', id));

// --- Company Structure: Open Seat Register ---
export const saveOpenSeat = (s) => run(() => supabase.from('open_seats').upsert({
  id: s.id, title: s.title, department: s.department||'', func: s.func||'',
  impact: s.impact||'', interim: s.interim||null, status: s.status||'Open',
  urgency: s.urgency||'Medium', hours_per_week: s.hoursPerWeek||0, funded: !!s.funded, notes: s.notes||''
}));
export const deleteOpenSeat = (id) => run(() => supabase.from('open_seats').delete().eq('id', id));

// --- Company Structure: Org Units ---
export const saveOrgUnit = (u) => run(() => supabase.from('org_units').upsert({
  id: u.id, layer: u.layer||'Function', name: u.name, department: u.department||'',
  holder_user: u.holderUser||null, holder_text: u.holderText||'', reports_to: u.reportsTo||'',
  status: u.status||'Active', sort_order: u.sortOrder||0, notes: u.notes||''
}));
export const deleteOrgUnit = (id) => run(() => supabase.from('org_units').delete().eq('id', id));

// --- Company Structure: Accountability (RACI) ---
export const saveRaciItem = (r) => run(() => supabase.from('raci_items').upsert({
  id: r.id, output: r.output, accountable: r.accountable||null, responsible: r.responsible||'',
  consulted: r.consulted||'', department: r.department||'', notes: r.notes||''
}));
export const deleteRaciItem = (id) => run(() => supabase.from('raci_items').delete().eq('id', id));

// --- Company Structure: Minimum Operating Capability ---
export const saveMocItem = (m) => run(() => supabase.from('moc_items').upsert({
  id: m.id, func: m.func, department: m.department||'', head_user: m.headUser||null, head_text: m.headText||'',
  minimum: m.minimum||'', current_state: m.currentState||'', gap: m.gap||'',
  status: m.status||'Operating', hours_needed: m.hoursNeeded||0, confirmed: !!m.confirmed, notes: m.notes||''
}));
export const deleteMocItem = (id) => run(() => supabase.from('moc_items').delete().eq('id', id));

// --- Media & Content ---
export const saveMediaProduct = (p) => run(() => supabase.from('media_products').upsert({
  id: p.id, name: p.name, description: p.description||'', format: p.format||'', cadence: p.cadence||'',
  showrunner: p.showrunner||null, status: p.status||'Active', drive_url: p.driveUrl||'',
  color: p.color||'#1FC2C2', sort_order: p.sortOrder||0, notes: p.notes||''
}));
export const deleteMediaProduct = (id) => run(() => supabase.from('media_products').delete().eq('id', id));

export const saveMediaItem = (i) => run(() => supabase.from('media_items').upsert({
  id: i.id, product_id: i.productId||null, title: i.title, stage: i.stage||'Idea', owner: i.owner||null,
  episode_no: i.episodeNo||'', summary: i.summary||'', due_date: i.dueDate||'', air_date: i.airDate||'',
  script_url: i.scriptUrl||'', assets_url: i.assetsUrl||'', final_url: i.finalUrl||'',
  blocker: i.blocker||'', notes: i.notes||''
}));
export const deleteMediaItem = (id) => run(() => supabase.from('media_items').delete().eq('id', id));

export const saveMediaRole = (r) => run(() => supabase.from('media_roles').upsert({
  id: r.id, product_id: r.productId||null, function: r.function,
  holder_user: r.holderUser||null, holder_text: r.holderText||'', backup_user: r.backupUser||null, notes: r.notes||''
}));
export const deleteMediaRole = (id) => run(() => supabase.from('media_roles').delete().eq('id', id));

export const saveMediaIdea = (i) => run(() => supabase.from('media_ideas').upsert({
  id: i.id, title: i.title, description: i.description||'', product_id: i.productId||'',
  submitted_by: i.submittedBy||null, submitted_date: i.submittedDate||'', status: i.status||'New',
  votes: i.votes||[], response: i.response||''
}));
export const deleteMediaIdea = (id) => run(() => supabase.from('media_ideas').delete().eq('id', id));

export const saveMediaFeedback = (f) => run(() => supabase.from('media_feedback').upsert({
  id: f.id, subject: f.subject, body: f.body||'', type: f.type||'Suggestion', product_id: f.productId||'',
  submitted_by: f.submittedBy||null, submitted_date: f.submittedDate||'', status: f.status||'New', response: f.response||''
}));
export const deleteMediaFeedback = (id) => run(() => supabase.from('media_feedback').delete().eq('id', id));

export const saveMediaTool = (t) => run(() => supabase.from('media_tools').upsert({
  id: t.id, name: t.name, category: t.category||'', purpose: t.purpose||'', url: t.url||'',
  access_holder: t.accessHolder||null, shared_access: t.sharedAccess||'', cost: t.cost||'',
  status: t.status||'In use', notes: t.notes||''
}));
export const deleteMediaTool = (id) => run(() => supabase.from('media_tools').delete().eq('id', id));

export const saveMediaFolder = (f) => run(() => supabase.from('media_folders').upsert({
  id: f.id, name: f.name, product_id: f.productId||'', url: f.url||'', purpose: f.purpose||'', notes: f.notes||''
}));
export const deleteMediaFolder = (id) => run(() => supabase.from('media_folders').delete().eq('id', id));
