"use client";

import { useState, useEffect, useRef } from "react";
import * as db from "@/lib/db";
import {
  LayoutDashboard, Users, Calendar, CheckSquare, Link2, FileText,
  BarChart3, Settings, LogOut, Plus, Edit3, Trash2, X, Check,
  Clock, Globe, ChevronLeft, ChevronRight, Sun, Moon, Search,
  AlertTriangle, Lock, Eye, EyeOff, ExternalLink, Filter,
  List, Columns, Hash, MessageSquare, Bookmark,
  TrendingUp, ArrowUp, ArrowDown, Minus, Bell, StickyNote,
  Target, Zap, Copy, RefreshCw, FolderOpen, Star, Pin,
  Download, FolderKanban, Megaphone, Send, Linkedin, Twitter, Instagram, Youtube
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   FONTS — DM Sans (readable body) + Syne (display headings)
   Space Mono only for timestamps/codes
   ═══════════════════════════════════════════════════════════════ */
// Fonts loaded via globals.css
// Responsive CSS loaded via globals.css
const FONT_BODY = "'DM Sans', -apple-system, sans-serif";
const FONT_DISPLAY = "'Syne', sans-serif";
const FONT_MONO = "'Space Mono', monospace";

/* ═══════════════════════════════════════════════════════════════
   THEME
   ═══════════════════════════════════════════════════════════════ */
const getTheme = (dark) => ({
  bg: dark ? "#0D1B21" : "#F4F6F8",
  bgCard: dark ? "#172329" : "#FFFFFF",
  bgCardAlt: dark ? "#1C2C34" : "#F8FAFB",
  bgSidebar: dark ? "#0A1419" : "#FFFFFF",
  bgInput: dark ? "#0F1E25" : "#F0F3F5",
  bgHover: dark ? "#1E3340" : "#EEF2F5",
  border: dark ? "#253840" : "#DEE4E9",
  borderLight: dark ? "#1C2E38" : "#EEF2F5",
  text: dark ? "#E4EDF1" : "#111B21",
  textSec: dark ? "#8AA4B0" : "#5A6E7A",
  textMut: dark ? "#4E6A78" : "#94A3AF",
  teal: "#1FC2C2",
  tealLt: "#82F9F6",
  red: "#FF6B6B",
  orange: "#FFA94D",
  yellow: "#FFD43B",
  green: "#69DB7C",
  purple: "#DA77F2",
  blue: "#748FFC",
  shadow: dark ? "0 1px 8px rgba(0,0,0,.25)" : "0 1px 8px rgba(0,0,0,.04)",
  shadowLg: dark ? "0 8px 32px rgba(0,0,0,.4)" : "0 8px 32px rgba(0,0,0,.07)",
  isDark: dark,
});

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════ */
const ROLES = ["Admin", "Marketing Lead", "Content Creator", "Designer", "Social Media Manager"];
const ROLE_COLORS = { Admin: "#FF6B6B", "Marketing Lead": "#FFA94D", "Content Creator": "#82F9F6", Designer: "#DA77F2", "Social Media Manager": "#748FFC" };
const TZ_OPTIONS = [
  { label: "London", tz: "Europe/London", color: "#1FC2C2" },
  { label: "New York", tz: "America/New_York", color: "#69DB7C" },
  { label: "Los Angeles", tz: "America/Los_Angeles", color: "#748FFC" },
  { label: "Berlin", tz: "Europe/Berlin", color: "#FFA94D" },
  { label: "Sydney", tz: "Australia/Sydney", color: "#DA77F2" },
  { label: "Tokyo", tz: "Asia/Tokyo", color: "#FF6B6B" },
];
const STATUSES = ["Idea", "In Design", "Review", "Scheduled", "Published", "Blocked", "Needs Approval"];
const STATUS_COLORS = { Idea: "#748FFC", "In Design": "#FFA94D", Review: "#DA77F2", Scheduled: "#1FC2C2", Published: "#69DB7C", Blocked: "#FF6B6B", "Needs Approval": "#FFD43B" };
const TASK_STATUSES = ["Not Started", "In Progress", "Done", "Overdue", "Blocked", "Needs Approval"];
const TASK_STATUS_COLORS = { "Not Started": "#748FFC", "In Progress": "#FFA94D", Done: "#69DB7C", Overdue: "#FF6B6B", Blocked: "#FF6B6B", "Needs Approval": "#FFD43B" };
const TASK_PRIORITIES = ["Low", "Medium", "High", "Urgent"];
const TASK_PRIORITY_COLORS = { Low: "#748FFC", Medium: "#FFA94D", High: "#FF6B6B", Urgent: "#FF6B6B" };
const PLATFORMS = ["LinkedIn", "X / Twitter", "Instagram", "TikTok", "Facebook", "YouTube", "Reddit", "Nanu App"];
const PLATFORM_COLORS = { LinkedIn: "#0A66C2", "X / Twitter": "#1DA1F2", Instagram: "#E1306C", TikTok: "#69DB7C", Facebook: "#1877F2", YouTube: "#FF0000", Reddit: "#FF4500", "Nanu App": "#1FC2C2" };
const RESOURCE_GROUPS = ["Drives", "Social Platforms", "Design Tools", "Docs", "Forms"];

/* ═══════════════════════════════════════════════════════════════
   INITIAL DATA
   ═══════════════════════════════════════════════════════════════ */
const INIT_USERS = [
  { id:"u1", name:"Nicholas Martin", username:"nicholas", pin:"1234", role:"Admin", email:"nicholas@nanu-app.com", tzLabel:"London", tz:"Europe/London", resp:"Founder, Product Vision, Investor Relations", socials:{ linkedin:"https://linkedin.com/in/nicholasmartin", x:"", instagram:"", tiktok:"", youtube:"" } },
  { id:"u2", name:"Holly Wood", username:"holly", pin:"2345", role:"Marketing Lead", email:"holly@nanu-app.com", tzLabel:"London", tz:"Europe/London", resp:"CMO, Community, Events, Live Newsletter", socials:{ linkedin:"", x:"", instagram:"", tiktok:"", youtube:"" } },
  { id:"u3", name:"Sean Cahill", username:"sean", pin:"3456", role:"Content Creator", email:"sean@nanu-app.com", tzLabel:"New York", tz:"America/New_York", resp:"Video Content, Public-facing Personality", socials:{ linkedin:"", x:"", instagram:"", tiktok:"", youtube:"" } },
  { id:"u4", name:"Alexander Lockwood", username:"alexander", pin:"4567", role:"Content Creator", email:"alexander@nanu-app.com", tzLabel:"London", tz:"Europe/London", resp:"Written Content, Email, Reddit Strategy", socials:{ linkedin:"", x:"", instagram:"", tiktok:"", youtube:"" } },
  { id:"u5", name:"Ed", username:"ed", pin:"5678", role:"Social Media Manager", email:"ed@nanu-app.com", tzLabel:"London", tz:"Europe/London", resp:"Discord Outreach, Ambassador Programme", socials:{ linkedin:"", x:"", instagram:"", tiktok:"", youtube:"" } },
];

const INIT_WEEKLY_THEMES = [
  { day:"Monday", theme:"Nanu Moments", color:"#1FC2C2" },
  { day:"Tuesday", theme:"How-To Tuesday", color:"#69DB7C" },
  { day:"Wednesday", theme:"Curiosity Wednesday", color:"#748FFC" },
  { day:"Thursday", theme:"From the Archive", color:"#FFA94D" },
  { day:"Friday", theme:"Friday Discussions", color:"#DA77F2" },
  { day:"Saturday", theme:"Behind the Mystery", color:"#FF6B6B" },
  { day:"Sunday", theme:"Mystery of the Week", color:"#FFD43B" },
];

const INIT_CALENDAR = [
  { id:"c1", title:"Nanu Moments — Weekly Highlight", platform:"Instagram", status:"Scheduled", owner:"u3", dueDate:"2026-03-09", publishTime:"10:00", caption:"Every mystery tells a story. This week's Nanu Moment explores…", assetLink:"", campaign:"" },
  { id:"c2", title:"How-To: Submit Your First Experience", platform:"LinkedIn", status:"In Design", owner:"u4", dueDate:"2026-03-10", publishTime:"09:00", caption:"New to Nanu? Here's how to document your experience in under 2 minutes.", assetLink:"", campaign:"" },
  { id:"c3", title:"Curiosity Wednesday: Consciousness & UAP", platform:"X / Twitter", status:"Idea", owner:"u2", dueDate:"2026-03-11", publishTime:"12:00", caption:"", assetLink:"", campaign:"" },
  { id:"c4", title:"From the Archive: 1952 DC Sightings", platform:"Nanu App", status:"Review", owner:"u4", dueDate:"2026-03-12", publishTime:"14:00", caption:"A deep dive into one of the most well-documented UAP events in history.", assetLink:"", campaign:"" },
  { id:"c5", title:"Friday Discussion: What Defines Credibility?", platform:"Reddit", status:"Idea", owner:"u5", dueDate:"2026-03-13", publishTime:"16:00", caption:"", assetLink:"", campaign:"" },
  { id:"c6", title:"Newsletter: March Week 2 Roundup", platform:"LinkedIn", status:"Needs Approval", owner:"u2", dueDate:"2026-03-14", publishTime:"08:00", caption:"This week in Nanu: new features, top experiences, and community highlights.", assetLink:"", campaign:"" },
  { id:"c7", title:"Partnership Announcement: Future Folklore", platform:"X / Twitter", status:"Blocked", owner:"u2", dueDate:"2026-03-16", publishTime:"11:00", caption:"Waiting on Joel's announcement copy.", assetLink:"", campaign:"signal-launch" },
  { id:"c8", title:"Ambassador Spotlight", platform:"Instagram", status:"In Design", owner:"u5", dueDate:"2026-03-14", publishTime:"18:00", caption:"", assetLink:"", campaign:"" },
  { id:"c9", title:"Mystery of the Week: Skinwalker Ranch", platform:"TikTok", status:"Scheduled", owner:"u3", dueDate:"2026-03-15", publishTime:"19:00", caption:"What makes this location one of the most investigated sites in the world?", assetLink:"", campaign:"" },
  { id:"c10", title:"The Signal Launch Teaser", platform:"LinkedIn", status:"In Design", owner:"u4", dueDate:"2026-03-18", publishTime:"09:00", caption:"News through every lens. The Signal by Nanu — coming soon.", assetLink:"", campaign:"signal-launch" },
];

const INIT_TASKS = [
  { id:"t1", title:"Finalise Ambassador Programme tracker", owner:"u5", dueDate:"2026-03-10", status:"In Progress", blocker:"", priority:"High", notes:"Master Excel tracker needs final column for engagement metrics. Ed has the latest version — check with him before updating.", linkedContent:"", project:"proj1" },
  { id:"t2", title:"Create podcast one-pager for Traci (Total Conundrum)", owner:"u2", dueDate:"2026-03-09", status:"Overdue", blocker:"", priority:"Urgent", notes:"Traci specifically requested a one-pager. Keep it concise: what Nanu is, Nicholas's story, key talking points, and a media kit link.", linkedContent:"", project:"proj3" },
  { id:"t3", title:"Design Founding Community badge variants", owner:"u3", dueDate:"2026-03-12", status:"In Progress", blocker:"", priority:"Medium", notes:"Four badge variants needed for Alex to implement. Reference the brand guide for colour palette. Dark and light versions of each.", linkedContent:"", project:"" },
  { id:"t4", title:"Draft The Signal brand launch post", owner:"u4", dueDate:"2026-03-14", status:"Not Started", blocker:"", priority:"High", notes:"Use the Signal Broadcast logo mark. Tagline: 'News through every lens · by Nanu'. Tease the lens ratings system without giving too much away.", linkedContent:"c10", project:"proj2" },
  { id:"t5", title:"Follow up with Joel on Buildathon commitments", owner:"u2", dueDate:"2026-03-11", status:"In Progress", blocker:"Waiting on Joel's response", priority:"High", notes:"Joel still owes: announcement copy, mentor/judge bench, brand assets, and distribution channels. Chase via email and WhatsApp.", linkedContent:"c7", project:"proj3" },
  { id:"t6", title:"UApedia follow-up", owner:"u2", dueDate:"2026-03-13", status:"Not Started", blocker:"", priority:"Low", notes:"Pending task flagged for Holly. Check status of the collaboration discussion.", linkedContent:"", project:"proj3" },
  { id:"t7", title:"Prepare Vanessa Rogers podcast brief", owner:"u1", dueDate:"2026-03-20", status:"Not Started", blocker:"", priority:"Medium", notes:"Fabric of Folklore — April Calendly confirmed. Prepare talking points around Nanu's Myths & History category.", linkedContent:"", project:"proj3" },
  { id:"t8", title:"Weekly content calendar sign-off", owner:"u2", dueDate:"2026-03-09", status:"Needs Approval", blocker:"", priority:"Medium", notes:"Review all scheduled posts for W2 March. Check captions, platforms, and publish times are correct before approving.", linkedContent:"", project:"" },
];

const INIT_RESOURCES = [
  { id:"r1", group:"Drives", label:"Marketing Drive", url:"https://drive.google.com" },
  { id:"r2", group:"Drives", label:"Brand Assets", url:"https://drive.google.com" },
  { id:"r3", group:"Drives", label:"The Signal Assets", url:"https://drive.google.com" },
  { id:"r4", group:"Social Platforms", label:"LinkedIn", url:"https://linkedin.com/company/nanu" },
  { id:"r5", group:"Social Platforms", label:"X / Twitter", url:"https://x.com/nanu" },
  { id:"r6", group:"Social Platforms", label:"Instagram", url:"https://instagram.com/nanu" },
  { id:"r7", group:"Social Platforms", label:"TikTok", url:"https://tiktok.com/@nanu" },
  { id:"r8", group:"Social Platforms", label:"Reddit", url:"https://reddit.com/r/nanu" },
  { id:"r9", group:"Design Tools", label:"Canva", url:"https://canva.com" },
  { id:"r10", group:"Design Tools", label:"Lovart.ai", url:"https://lovart.ai" },
  { id:"r11", group:"Docs", label:"Marketing Bible", url:"#" },
  { id:"r12", group:"Docs", label:"Growth Plan", url:"#" },
  { id:"r13", group:"Docs", label:"Brand Guidelines", url:"#" },
  { id:"r14", group:"Forms", label:"Ambassador Application", url:"#" },
  { id:"r15", group:"Forms", label:"Partnership Enquiry", url:"#" },
];

const INIT_OPS = {
  ideas: [
    { id:"i1", text:"Interview series with experiencers", category:"Video", votes:3, status:"Open" },
    { id:"i2", text:"Infographic: 9 Categories of the Unknown", category:"Design", votes:5, status:"Approved" },
    { id:"i3", text:"Reddit AMA announcing Communities feature", category:"Campaign", votes:4, status:"Open" },
    { id:"i4", text:"Behind-the-scenes: Building the AI Interviewer", category:"Blog", votes:2, status:"Open" },
  ],
  captions: [
    { id:"cap1", text:"Every mystery tells a story. What have you experienced?", tags:["awareness","engagement"] },
    { id:"cap2", text:"The unknown isn't empty — it's full of data waiting to be structured.", tags:["mission","product"] },
    { id:"cap3", text:"Discover. Discuss. Disclose. Join the community mapping humanity's mysteries.", tags:["tagline","CTA"] },
    { id:"cap4", text:"What if the next great discovery starts with your experience?", tags:["experiencer","CTA"] },
  ],
  hashtags: [
    { id:"h1", group:"Core", tags:["#Nanu","#DiscoverDiscussDisclose","#NanuApp","#SocialScience"] },
    { id:"h2", group:"UAP", tags:["#UAP","#UFO","#UAPDisclosure","#UnidentifiedAerialPhenomena"] },
    { id:"h3", group:"Community", tags:["#ExploreTheUnknown","#MysteriesUnfold","#Community","#NanuMoments"] },
    { id:"h4", group:"Consciousness", tags:["#Consciousness","#NonHumanIntelligence","#NHI"] },
  ],
  messaging: [
    { id:"m1", pillar:"Transparency", line:"Your data is yours. Always." },
    { id:"m2", pillar:"Trust", line:"Built by the community, for the community." },
    { id:"m3", pillar:"Discovery", line:"Every mystery adds to the bigger picture." },
    { id:"m4", pillar:"Empowerment", line:"You decide what's real — we provide the tools." },
    { id:"m5", pillar:"Responsibility", line:"Exploring the unknown should never compromise wellbeing." },
  ],
  templates: [
    { id:"tp1", name:"Nanu Moments Post", platform:"Instagram", caption:"Every mystery tells a story. This week's #NanuMoment explores…\n\n[DESCRIPTION]\n\nWhat do you think? Share your thoughts below.\n\n#Nanu #DiscoverDiscussDisclose", tags:["weekly","monday"] },
    { id:"tp2", name:"How-To Tuesday", platform:"LinkedIn", caption:"New to Nanu? Here's a quick guide:\n\n[STEPS]\n\nStart exploring today → nanu-app.com\n\n#Nanu #HowTo #SocialScience", tags:["weekly","tuesday"] },
  ],
};

const INIT_STATS = {
  lastUpdated: "2026-03-07",
  targets: { followers:5000, reach:100000, impressions:250000, engagement:5.0, linkClicks:3000, newsletterSignups:500, nanuUsers:5000 },
  totals: { followers:2847, reach:45200, impressions:128500, engagement:3.2, shares:892, linkClicks:1240, videoViews:18700, websiteTraffic:4320, newsletterSignups:187 },
  platforms: {
    LinkedIn:{ followers:620, lastWeek:580, reach:12400, engagement:4.1, growth:8.2 },
    "X / Twitter":{ followers:890, lastWeek:845, reach:18200, engagement:2.8, growth:5.4 },
    Instagram:{ followers:445, lastWeek:398, reach:6800, engagement:3.9, growth:12.1 },
    TikTok:{ followers:312, lastWeek:263, reach:4200, engagement:5.2, growth:18.5 },
    Reddit:{ followers:280, lastWeek:270, reach:2100, engagement:2.1, growth:3.8 },
    YouTube:{ followers:180, lastWeek:170, reach:1200, engagement:1.8, growth:6.0 },
    Facebook:{ followers:120, lastWeek:123, reach:300, engagement:1.2, growth:-2.1 },
  },
  topPosts: [
    { platform:"X / Twitter", title:"First peer-reviewed community case", metric:"12.4K imp." },
    { platform:"Instagram", title:"9 Categories infographic", metric:"2.1K saves" },
    { platform:"LinkedIn", title:"Founder story: Why I built Nanu", metric:"890 eng." },
  ],
  weeklyGrowth: [
    { week:"W1 Feb", users:812 },{ week:"W2 Feb", users:831 },{ week:"W3 Feb", users:849 },
    { week:"W4 Feb", users:858 },{ week:"W1 Mar", users:869 },{ week:"W2 Mar", users:891 },
  ],
};

const INIT_NOTES = [
  { id:"n1", text:"Holly: Monthly live event needs a date confirmed for March", author:"u2", pinned:true, date:"2026-03-07", color:"#1FC2C2" },
  { id:"n2", text:"Nick Cook event — London, April. Invite-only. Nicholas + Steve attending.", author:"u1", pinned:false, date:"2026-03-06", color:"#FFA94D" },
  { id:"n3", text:"Joel still owes: announcement copy, mentor bench, brand assets, distribution channels", author:"u2", pinned:true, date:"2026-03-08", color:"#FF6B6B" },
];

const INIT_KEY_DATES = [
  { id:"kd1", title:"Vanessa Rogers Podcast", date:"2026-04-15", color:"#DA77F2" },
  { id:"kd2", title:"Nick Cook Event (London)", date:"2026-04-20", color:"#FFA94D" },
  { id:"kd3", title:"Q2 Growth Target: 5,000 users", date:"2026-06-30", color:"#1FC2C2" },
];

const INIT_CAMPAIGNS = [
  { id:"camp1", name:"The Signal Launch", tag:"signal-launch", color:"#1FC2C2" },
  { id:"camp2", name:"Buildathon", tag:"buildathon", color:"#DA77F2" },
];

const INIT_ACTIVITY = [
  { id:"a1", user:"u4", action:"updated", target:"The Signal Launch Teaser", section:"Calendar", time:"2026-03-09T08:30:00" },
  { id:"a2", user:"u5", action:"added", target:"Ambassador Spotlight", section:"Calendar", time:"2026-03-08T16:20:00" },
  { id:"a3", user:"u2", action:"created", target:"UApedia follow-up", section:"Tasks", time:"2026-03-08T11:00:00" },
];

const INIT_PROJECTS = [
  { id:"proj1", name:"Ambassador Programme", description:"Recruit, onboard, and manage community ambassadors with playbooks, invite codes, and content templates.", color:"#69DB7C", owner:"u5", status:"Active" },
  { id:"proj2", name:"The Signal Launch", description:"Full launch campaign for nanu-signal.com — brand teaser, editorial pipeline, RSS backend, and social rollout.", color:"#1FC2C2", owner:"u4", status:"Active" },
  { id:"proj3", name:"Partnerships & Outreach", description:"Podcast circuit, community collaborations, event appearances, and micro-creator programme.", color:"#DA77F2", owner:"u2", status:"Active" },
  { id:"proj4", name:"Nanu Orbis", description:"Monthly members-only live event — production, promotion, and post-event content.", color:"#FFA94D", owner:"u2", status:"Planning" },
];

const PROJECT_STATUSES = ["Planning", "Active", "Paused", "Complete"];
const PROJECT_STATUS_COLORS = { Planning:"#748FFC", Active:"#69DB7C", Paused:"#FFA94D", Complete:"#4E6A78" };

const OUTREACH_TYPES = ["Community", "Influencer", "Content Creator", "Organisation"];
const OUTREACH_STATUSES = ["Identified", "Contacted", "In Conversation", "Confirmed", "Declined", "Complete"];
const OUTREACH_STATUS_COLORS = { Identified:"#748FFC", Contacted:"#FFA94D", "In Conversation":"#DA77F2", Confirmed:"#69DB7C", Declined:"#FF6B6B", Complete:"#4E6A78" };

const INIT_OUTREACH = [
  { id:"out1", name:"Vanessa Y. Rogers", type:"Content Creator", platform:"Podcast — Fabric of Folklore", status:"Confirmed", owner:"u1", notes:"April Calendly confirmed. Prepare talking points around Myths & History.", url:"", date:"2026-04-15" },
  { id:"out2", name:"Traci — Total Conundrum", type:"Content Creator", platform:"Podcast", status:"In Conversation", owner:"u2", notes:"One-pager requested. Waiting on scheduling.", url:"", date:"" },
  { id:"out3", name:"The Activity Continues", type:"Content Creator", platform:"Podcast", status:"Contacted", owner:"u2", notes:"Registration done. Awaiting response.", url:"", date:"" },
  { id:"out4", name:"James Fox", type:"Influencer", platform:"X / Twitter", status:"In Conversation", owner:"u1", notes:"X Space co-hosting event planned for 20 March.", url:"", date:"2026-03-20" },
  { id:"out5", name:"Nathan Cole — UAPWatch", type:"Community", platform:"Discord / YouTube", status:"In Conversation", owner:"u5", notes:"Potential cross-community collaboration.", url:"", date:"" },
  { id:"out6", name:"Nick Cook Event", type:"Organisation", platform:"In-person (London)", status:"Confirmed", owner:"u1", notes:"Invite-only. April. Nicholas attending.", url:"", date:"2026-04-20" },
  { id:"out7", name:"Reddit AMA", type:"Community", platform:"Reddit", status:"Identified", owner:"u4", notes:"Plan to announce Communities feature via AMA.", url:"", date:"" },
];

/* UID HELPER */
let _uid = Date.now();
const uid = (p = "x") => `${p}${_uid++}`;

/* ═══════════════════════════════════════════════════════════════
   EXPORT UTILITIES
   ═══════════════════════════════════════════════════════════════ */
function exportCSV(rows, filename) {
  const csv = rows.map(r => r.map(c => `"${(c||"").replace(/"/g,'""')}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type:"text/csv" }));
  a.download = filename;
  a.click();
}

function exportDOCX(title, items, filename) {
  // Generate RTF which is universally supported by Word/LibreOffice/Google Docs
  let rtf = "{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Segoe UI;}{\\f1 Courier New;}}";
  rtf += "{\\colortbl;\\red31\\green194\\blue194;\\red26\\green27\\blue33;\\red100\\green100\\blue100;}";
  rtf += "\\f0\\fs22\\cf2 ";
  // Title
  rtf += "\\fs36\\b\\cf1 " + title.replace(/[\\{}]/g,"") + "\\b0\\line\\fs22\\cf2\\line ";
  // Items
  items.forEach(item => {
    rtf += "\\fs26\\b " + (item.heading||"").replace(/[\\{}]/g,"") + "\\b0\\line\\fs22 ";
    const lines = (item.body||"").split("\n");
    lines.forEach(line => { rtf += line.replace(/[\\{}]/g,"") + "\\line "; });
    rtf += "\\line ";
  });
  // Footer
  rtf += "\\line\\cf3\\fs18 Exported from Nanu Marketing Hub \\bullet  " + new Date().toLocaleDateString("en-GB");
  rtf += "}";
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([rtf], { type:"application/rtf" }));
  a.download = filename.replace(".doc",".rtf");
  a.click();
}

/* ═══════════════════════════════════════════════════════════════
   UI PRIMITIVES
   ═══════════════════════════════════════════════════════════════ */
const NanuLogo = ({ size = 34 }) => (
  <div style={{ width:size, height:size, borderRadius: size > 40 ? 14 : 10, background:"#0D1B21", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, overflow:"hidden", padding: size * 0.12 }}>
    <svg viewBox="0 0 2000 2000" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <path fill="#ffffff" d="m508.73 872.95c-14.98 0-27.12 12.13-27.12 27.13v128.83l-106-139.19c-7.49-9.64-15.35-16.07-28.56-16.07h-5.7c-15.35 0-27.48 12.14-27.48 27.5v198.78c0 15 12.13 27.13 27.12 27.13 14.99 0 27.13-12.13 27.13-27.13v-133.83l109.92 144.19c7.5 9.64 15.34 16.05 28.55 16.05h1.79c15.34 0 27.48-12.13 27.48-27.48v-198.78c0-15-12.14-27.13-27.13-27.13z"/>
      <path fill="#ffffff" d="m930.22 1089.58l-87.08-196.65c-6.07-13.56-16.77-21.77-31.76-21.77h-3.22c-14.99 0-26.05 8.21-32.12 21.77l-87.08 196.65c-1.78 3.93-3.21 7.86-3.21 11.78 0 14.28 11.06 25.7 25.34 25.7 11.42 0 20.7-6.43 25.34-17.13l17.48-41.05 54.97-130.98 34.62 82.44 20.34 48.54 16.77 39.26c5 11.42 13.57 18.92 26.42 18.92 14.63 0 26.05-11.78 26.05-26.41 0-3.57-1.07-7.14-2.86-11.07z"/>
      <path fill="#ffffff" d="m1278.2 872.95c-15 0-27.13 12.13-27.13 27.13v128.83l-106-139.19c-7.49-9.64-15.34-16.07-28.54-16.07h-5.72c-15.35 0-27.48 12.14-27.48 27.5v198.78c0 15 12.13 27.13 27.12 27.13 14.99 0 27.13-12.13 27.13-27.13v-133.83l109.92 144.19c7.5 9.64 15.34 16.05 28.56 16.05h1.78c15.34 0 27.48-12.13 27.48-27.48v-198.78c0-15-12.14-27.13-27.12-27.13z"/>
      <path fill="#ffffff" d="m1658.64 872.95c-15.34 0-27.48 12.13-27.48 27.47v117.79c0 39.61-20.34 59.95-53.89 59.95-33.55 0-53.9-21.05-53.9-61.74v-116c0-15.34-12.13-27.47-27.47-27.47-15.35 0-27.48 12.13-27.48 27.47v117.43c0 73.52 41.04 110.99 108.13 110.99 67.11 0 109.58-37.11 109.58-112.79v-115.63c0-15.34-12.13-27.47-27.49-27.47z"/>
      <path fill="#1fc2c2" d="m834.31 1047.44c0 13.74-11.15 24.89-24.9 24.89-13.74 0-24.89-11.15-24.89-24.89 0-13.75 11.15-24.89 24.89-24.89 13.75 0 24.9 11.14 24.9 24.89z"/>
    </svg>
  </div>
);

const Badge = ({ label, color, style }) => (
  <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:11, fontFamily:FONT_BODY, fontWeight:600, background:`${color}18`, color, border:`1px solid ${color}28`, whiteSpace:"nowrap", ...style }}>{label}</span>
);

const Btn = ({ children, onClick, primary, theme, small, danger, disabled, style }) => (
  <button type="button" onClick={onClick} disabled={disabled} style={{
    padding: small ? "5px 12px" : "8px 18px", borderRadius:8, border: primary ? "none" : `1px solid ${danger ? theme.red : theme.border}`,
    background: primary ? theme.teal : "transparent", color: primary ? "#0D1B21" : danger ? theme.red : theme.text,
    fontFamily:FONT_BODY, fontWeight:600, fontSize: small ? 12 : 13, cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? .5 : 1, display:"flex", alignItems:"center", gap:5, transition:"all .15s", ...style
  }}>{children}</button>
);

const Input = ({ theme, ...p }) => (
  <input {...p} style={{ width:"100%", padding:"9px 13px", borderRadius:8, border:`1px solid ${theme.border}`, background:theme.bgInput, color:theme.text, fontFamily:FONT_BODY, fontSize:14, outline:"none", boxSizing:"border-box", transition:"border .15s", ...(p.style||{}) }} />
);

const Textarea = ({ theme, ...p }) => (
  <textarea {...p} style={{ width:"100%", padding:"9px 13px", borderRadius:8, border:`1px solid ${theme.border}`, background:theme.bgInput, color:theme.text, fontFamily:FONT_BODY, fontSize:14, outline:"none", boxSizing:"border-box", resize:"vertical", minHeight:80, ...(p.style||{}) }} />
);

const Sel = ({ theme, options, ...p }) => (
  <select {...p} style={{ width:"100%", padding:"9px 13px", borderRadius:8, border:`1px solid ${theme.border}`, background:theme.bgInput, color:theme.text, fontFamily:FONT_BODY, fontSize:14, outline:"none", cursor:"pointer", boxSizing:"border-box", ...(p.style||{}) }}>
    {options.map(o => typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const Label = ({ children, theme }) => (
  <label style={{ display:"block", fontSize:12, color:theme.textSec, fontFamily:FONT_BODY, fontWeight:600, marginBottom:5 }}>{children}</label>
);

const Card = ({ theme, children, style, onClick }) => (
  <div onClick={onClick} style={{ background:theme.bgCard, borderRadius:12, border:`1px solid ${theme.border}`, padding:18, boxShadow:theme.shadow, transition:"all .2s", cursor: onClick ? "pointer" : "default", ...style }}>{children}</div>
);

const SectionHead = ({ theme, children, right }) => (
  <div className="nanu-section-head" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:10 }}>
    <h2 style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:20, color:theme.text, margin:0 }}>{children}</h2>
    {right && <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>{right}</div>}
  </div>
);

const Modal = ({ theme, title, onClose, children, width=540 }) => (
  <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,.55)", backdropFilter:"blur(4px)" }} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
    <div style={{ background:theme.bgCard, borderRadius:16, border:`1px solid ${theme.border}`, padding:28, width, maxWidth:"92vw", maxHeight:"88vh", overflow:"auto", boxShadow:theme.shadowLg }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h3 style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:18, color:theme.text, margin:0 }}>{title}</h3>
        <button type="button" onClick={onClose} style={{ background:"none", border:"none", color:theme.textMut, cursor:"pointer" }}><X size={18}/></button>
      </div>
      {children}
    </div>
  </div>
);

const TabBar = ({ tabs, active, onChange, theme }) => (
  <div style={{ display:"flex", gap:2, background:theme.bgInput, borderRadius:10, padding:3, border:`1px solid ${theme.border}`, marginBottom:16, flexWrap:"wrap" }}>
    {tabs.map(t => (
      <button key={t.key} onClick={()=>onChange(t.key)} style={{
        flex:1, padding:"8px 10px", borderRadius:8, border:"none", minWidth:80,
        background: active===t.key ? theme.teal : "transparent",
        color: active===t.key ? "#0D1B21" : theme.textSec,
        cursor:"pointer", fontFamily:FONT_BODY, fontWeight:600, fontSize:13, transition:"all .15s"
      }}>{t.label}</button>
    ))}
  </div>
);

const ProgressBar = ({ value, max, color, theme }) => {
  const pct = max > 0 ? Math.min((value/max)*100, 100) : 0;
  return (
    <div style={{ width:"100%", height:6, background:theme.bgInput, borderRadius:3, overflow:"hidden" }}>
      <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:3, transition:"width .4s ease" }}/>
    </div>
  );
};

// FormCol/FormRow removed — using inline divs for correct state capture

// FormActions inlined directly in modals for correct state capture

/* ═══════════════════════════════════════════════════════════════
   LOGIN
   ═══════════════════════════════════════════════════════════════ */
const LoginScreen = ({ onLogin, users }) => {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);
  const theme = getTheme(true);
  const handleLogin = () => {
    const u = users.find(x => x.username.toLowerCase() === username.toLowerCase().trim() && x.pin === pin);
    if (u) { onLogin(u); setError(""); } else setError("Invalid username or PIN");
  };
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0D1B21", fontFamily:FONT_BODY, backgroundImage:"radial-gradient(ellipse at 20% 80%, rgba(31,194,194,.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(130,249,246,.04) 0%, transparent 60%)" }}>
      
      <div style={{ width:400, padding:44, borderRadius:20, background:"#172329", border:"1px solid #253840", boxShadow:"0 16px 64px rgba(0,0,0,.4)" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}><NanuLogo size={52}/></div>
          <h1 style={{ fontFamily:FONT_DISPLAY, fontSize:24, fontWeight:800, color:"#E4EDF1", margin:"0 0 6px" }}>Marketing Hub</h1>
          <p style={{ fontSize:14, color:"#8AA4B0", margin:0 }}>Sign in to your team dashboard</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div><Label theme={theme}>Username</Label><Input theme={theme} value={username} onChange={e=>setUsername(e.target.value)} placeholder="e.g. nicholas" onKeyDown={e=>e.key==="Enter"&&handleLogin()} autoFocus /></div>
          <div>
            <Label theme={theme}>PIN</Label>
            <div style={{ position:"relative" }}>
              <Input theme={theme} type={showPin?"text":"password"} value={pin} onChange={e=>setPin(e.target.value)} placeholder="Enter your PIN" onKeyDown={e=>e.key==="Enter"&&handleLogin()} maxLength={6} />
              <button onClick={()=>setShowPin(!showPin)} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#8AA4B0", cursor:"pointer" }}>{showPin ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
            </div>
          </div>
          {error && <p style={{ fontSize:13, color:"#FF6B6B", margin:0 }}>{error}</p>}
          <button onClick={handleLogin} style={{ padding:13, borderRadius:10, border:"none", background:"linear-gradient(135deg,#1FC2C2,#82F9F6)", color:"#0D1B21", fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:15, cursor:"pointer", marginTop:4 }}>Sign In</button>
        </div>
        <p style={{ fontSize:12, color:"#4E6A78", textAlign:"center", marginTop:20 }}>Each team member has a unique PIN</p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   WORLD CLOCKS
   ═══════════════════════════════════════════════════════════════ */
const WorldClocks = ({ theme }) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const i = setInterval(()=>setNow(new Date()), 1000); return ()=>clearInterval(i); }, []);
  const getTime = tz => { try { return now.toLocaleTimeString("en-GB",{timeZone:tz,hour:"2-digit",minute:"2-digit"}); } catch { return "--:--"; }};
  const getHour = tz => { try { return parseInt(now.toLocaleTimeString("en-GB",{timeZone:tz,hour:"2-digit",hour12:false})); } catch { return 0; }};
  const londonH = getHour("Europe/London");
  const nyH = getHour("America/New_York");
  const overlapActive = londonH >= 9 && londonH < 17 && nyH >= 9 && nyH < 17;
  return (
    <div>
      <div className="nanu-clocks">
        {TZ_OPTIONS.map(c => {
          const h = getHour(c.tz);
          const work = h >= 9 && h < 17;
          return (
            <div key={c.label} className="nanu-clock-card" style={{ flex:"1 1 100px", minWidth:95, background:theme.bgCard, borderRadius:10, padding:"10px 12px", border:`1px solid ${theme.border}`, textAlign:"center", position:"relative" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:c.color, borderRadius:"10px 10px 0 0" }}/>
              <div className="nanu-clock-time" style={{ fontFamily:FONT_MONO, fontSize:20, fontWeight:700, color:theme.text, marginTop:4 }}>{getTime(c.tz)}</div>
              <div style={{ fontFamily:FONT_BODY, fontSize:12, color:theme.textSec, fontWeight:600, marginTop:2 }}>{c.label}</div>
              {work && <div style={{ fontSize:9, color:"#69DB7C", fontFamily:FONT_BODY, fontWeight:700, marginTop:2 }}>WORK HOURS</div>}
            </div>
          );
        })}
      </div>
      {overlapActive && <div style={{ marginTop:8, padding:"6px 14px", background:`${theme.green}12`, border:`1px solid ${theme.green}30`, borderRadius:8, fontSize:13, color:theme.green, fontWeight:600, textAlign:"center" }}>London + New York overlap — best collaboration window</div>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════ */
export default function MarketingHub() {
  const [dark, setDark] = useState(true);
  const [curUser, setCurUser] = useState(null);
  const [section, setSection] = useState("dashboard");
  const [sidebar, setSidebar] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [calView, setCalView] = useState("kanban");
  const [calMonth, setCalMonth] = useState(new Date(2026, 2, 1));
  const [taskView, setTaskView] = useState("all");
  const [opsTab, setOpsTab] = useState("ideas");
  const [fStatus, setFStatus] = useState("All");
  const [fPlat, setFPlat] = useState("All");

  const [users, setUsers] = useState([]);
  const [weeklyThemes, setWeeklyThemes] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [resources, setResources] = useState([]);
  const [ops, setOps] = useState({ ideas:[], captions:[], hashtags:[], messaging:[], templates:[] });
  const [stats, setStats] = useState({ lastUpdated:"", totals:{}, targets:{}, platforms:{}, weeklyGrowth:[], topPosts:[] });
  const [notes, setNotes] = useState([]);
  const [keyDates, setKeyDates] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [activity, setActivity] = useState([]);
  const [projects, setProjects] = useState([]);
  const [outreach, setOutreach] = useState([]);
  const [outreachFilter, setOutreachFilter] = useState("All");
  const [dbLoading, setDbLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  // Load all data from Supabase on mount
  useEffect(() => {
    db.loadAllData().then(data => {
      setUsers(data.users.length ? data.users : INIT_USERS);
      setWeeklyThemes(data.weeklyThemes.length ? data.weeklyThemes : INIT_WEEKLY_THEMES);
      setCalendar(data.calendar.length ? data.calendar : INIT_CALENDAR);
      setTasks(data.tasks.length ? data.tasks : INIT_TASKS);
      setResources(data.resources.length ? data.resources : INIT_RESOURCES);
      setOps(data.ops.ideas.length ? data.ops : INIT_OPS);
      setStats(data.stats.weeklyGrowth.length ? data.stats : INIT_STATS);
      setNotes(data.notes.length ? data.notes : INIT_NOTES);
      setKeyDates(data.keyDates.length ? data.keyDates : INIT_KEY_DATES);
      setCampaigns(data.campaigns.length ? data.campaigns : INIT_CAMPAIGNS);
      setProjects(data.projects.length ? data.projects : INIT_PROJECTS);
      setOutreach(data.outreach.length ? data.outreach : INIT_OUTREACH);
      setActivity(data.activity.length ? data.activity : INIT_ACTIVITY);
      setDbLoading(false);
    }).catch(err => {
      console.error("Failed to load from Supabase, using defaults:", err);
      setUsers(INIT_USERS); setWeeklyThemes(INIT_WEEKLY_THEMES); setCalendar(INIT_CALENDAR);
      setTasks(INIT_TASKS); setResources(INIT_RESOURCES); setOps(INIT_OPS);
      setStats(INIT_STATS); setNotes(INIT_NOTES); setKeyDates(INIT_KEY_DATES);
      setCampaigns(INIT_CAMPAIGNS); setProjects(INIT_PROJECTS);
      setOutreach(INIT_OUTREACH); setActivity(INIT_ACTIVITY);
      setDbError("Could not connect to database — running in offline mode");
      setDbLoading(false);
    });
  }, []);

  const theme = getTheme(dark);
  const isAdmin = curUser?.role === "Admin";
  const uName = (id) => users.find(u=>u.id===id)?.name || "Unknown";
  const log = (action, target, sec) => {
    if(!curUser) return;
    const entry = {id:uid("a"),user:curUser.id,action,target,section:sec,time:new Date().toISOString()};
    setActivity(p=>[entry,...p].slice(0,50));
    db.logActivity(entry).catch(console.error);
  };
  const openM = (type, data = {}) => { setForm(data); setModal(type); };
  const closeM = () => { setModal(null); setForm({}); };

  if (dbLoading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0D1B21",fontFamily:FONT_BODY}}>
      <div style={{textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><NanuLogo size={52}/></div>
        <p style={{color:"#8AA4B0",fontSize:14}}>Loading Marketing Hub…</p>
      </div>
    </div>
  );

  if (!curUser) return <><LoginScreen onLogin={setCurUser} users={users}/></>;

  const NAV = [
    { key:"dashboard", label:"Dashboard", icon:<LayoutDashboard size={18}/> },
    { key:"team", label:"Team", icon:<Users size={18}/> },
    { key:"calendar", label:"Calendar", icon:<Calendar size={18}/> },
    { key:"tasks", label:"Tasks", icon:<CheckSquare size={18}/> },
    { key:"projects", label:"Projects", icon:<FolderKanban size={18}/> },
    { key:"outreach", label:"Outreach", icon:<Megaphone size={18}/> },
    { key:"resources", label:"Resources", icon:<Link2 size={18}/> },
    { key:"content-ops", label:"Content Ops", icon:<FileText size={18}/> },
    { key:"stats", label:"Stats", icon:<BarChart3 size={18}/> },
    { key:"notes", label:"Notes", icon:<StickyNote size={18}/> },
    ...(isAdmin?[{key:"admin",label:"Admin",icon:<Settings size={18}/>}]:[]),
  ];

  const overdue = tasks.filter(t=>t.status==="Overdue").length;
  const approvals = [...tasks.filter(t=>t.status==="Needs Approval"),...calendar.filter(c=>c.status==="Needs Approval")];
  const todayItems = calendar.filter(i=>i.dueDate==="2026-03-09");
  const alertTasks = tasks.filter(t=>["Overdue","Blocked","Needs Approval"].includes(t.status)||t.blocker);
  const filteredCal = calendar.filter(c=>(fStatus==="All"||c.status===fStatus)&&(fPlat==="All"||c.platform===fPlat));
  const filteredTasks = taskView==="mine" ? tasks.filter(t=>t.owner===curUser.id) : tasks;
  const sortedTasks = [...filteredTasks].sort((a,b)=>{const p=t=>t.status==="Overdue"?0:t.status==="Blocked"?1:t.status==="Needs Approval"?2:t.status==="In Progress"?3:t.status==="Done"?5:4;return p(a)-p(b);});
  const today = new Date(2026,2,9);

  const weekDates = (() => {
    const d = today.getDay()===0?6:today.getDay()-1;
    const s = new Date(today); s.setDate(today.getDate()-d);
    return Array.from({length:7},(_,i)=>{ const dd=new Date(s); dd.setDate(s.getDate()+i); return dd; });
  })();

  const renderSection = () => {
    switch(section) {

    /* ─── DASHBOARD ─── */
    case "dashboard": return (
      <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
        <WorldClocks theme={theme}/>
        {/* Weekly Themes */}
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:12, fontWeight:600, color:theme.textSec }}>WEEKLY CONTENT THEMES</span>
            {isAdmin && <button onClick={()=>openM("editThemes")} style={{ background:"none", border:"none", color:theme.teal, cursor:"pointer", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}><Edit3 size={12}/>Edit</button>}
          </div>
          <div className="nanu-themes">
            {weeklyThemes.map(w=>{
              const isToday = new Date().toLocaleDateString("en-GB",{weekday:"long"})===w.day;
              return <div key={w.day} style={{ flex:"1 1 100px", padding:"7px 10px", borderRadius:8, background:isToday?`${w.color}15`:theme.bgCard, border:`1px solid ${isToday?w.color:theme.border}`, textAlign:"center" }}>
                <div style={{ fontSize:10, color:w.color, fontWeight:700, textTransform:"uppercase" }}>{w.day.slice(0,3)}</div>
                <div style={{ fontSize:12, fontWeight:500, marginTop:1 }}>{w.theme}</div>
              </div>;
            })}
          </div>
        </div>
        {/* Key Dates */}
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:12, fontWeight:600, color:theme.textSec }}>KEY DATES</span>
            {isAdmin && <button onClick={()=>openM("editKeyDates")} style={{ background:"none", border:"none", color:theme.teal, cursor:"pointer", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}><Edit3 size={12}/>Manage</button>}
          </div>
          <div className="nanu-keydates">
            {keyDates.map(d=>{
              const diff = Math.ceil((new Date(d.date)-today)/(864e5));
              return <div key={d.id} style={{ flex:"1 1 180px", padding:"10px 14px", borderRadius:10, background:theme.bgCard, border:`1px solid ${theme.border}`, position:"relative" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:d.color, borderRadius:"10px 10px 0 0" }}/>
                <div className="nanu-big-num" style={{ fontSize:26, color:d.color, marginTop:2 }}>{diff}</div>
                <div style={{ fontSize:10, fontWeight:600, color:theme.textMut, textTransform:"uppercase" }}>days away</div>
                <div style={{ fontSize:13, fontWeight:600, marginTop:4 }}>{d.title}</div>
                <div style={{ fontFamily:FONT_MONO, fontSize:10, color:theme.textMut, marginTop:2 }}>{d.date}</div>
              </div>;
            })}
          </div>
        </div>
        {/* Summary Cards */}
        <div className="nanu-grid-summary">
          {[
            {l:"Today's Content",v:todayItems.length,c:theme.teal,s:"calendar"},
            {l:"Active Tasks",v:tasks.filter(t=>t.status==="In Progress").length,c:theme.orange,s:"tasks"},
            {l:"Awaiting Approval",v:approvals.length,c:theme.yellow,s:"tasks"},
            {l:"Total Followers",v:stats.totals.followers.toLocaleString(),c:theme.green,s:"stats"},
            {l:"Nanu Users",v:stats.weeklyGrowth.at(-1).users,c:theme.tealLt,s:"stats"},
          ].map((c,i)=>(
            <Card key={i} theme={theme} onClick={()=>setSection(c.s)} style={{ padding:14, textAlign:"center", cursor:"pointer" }}>
              <div className="nanu-big-num" style={{ fontSize:28, color:c.c }}>{c.v}</div>
              <div style={{ fontSize:11, color:theme.textMut, fontWeight:600, marginTop:3 }}>{c.l}</div>
            </Card>
          ))}
        </div>
        {/* Priority + Today */}
        <div className="nanu-grid-2col">
          <Card theme={theme} style={{ borderLeft:`3px solid ${theme.red}` }}>
            <div style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:15, color:theme.red, marginBottom:10 }}>Priority Alerts</div>
            {alertTasks.length===0&&<p style={{fontSize:13,color:theme.textMut}}>All clear</p>}
            {alertTasks.map(t=>(
              <div key={t.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0" }}>
                <AlertTriangle size={13} color={TASK_STATUS_COLORS[t.status]}/>
                <span style={{ fontSize:13, flex:1 }}>{t.title}</span>
                <Badge label={t.status} color={TASK_STATUS_COLORS[t.status]}/>
              </div>
            ))}
          </Card>
          <Card theme={theme}>
            <div style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:15, marginBottom:10 }}>Today's Schedule</div>
            {todayItems.length===0&&<p style={{fontSize:13,color:theme.textMut}}>No content scheduled</p>}
            {todayItems.map(c=>(
              <div key={c.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0" }}>
                <Badge label={c.platform} color={PLATFORM_COLORS[c.platform]||theme.teal}/>
                <span style={{ fontSize:13, flex:1 }}>{c.title}</span>
                <Badge label={c.status} color={STATUS_COLORS[c.status]}/>
                <span style={{ fontFamily:FONT_MONO, fontSize:11, color:theme.textMut }}>{c.publishTime}</span>
              </div>
            ))}
          </Card>
        </div>
        {/* Activity */}
        <Card theme={theme}>
          <div style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:15, marginBottom:10 }}>Recent Activity</div>
          {activity.slice(0,8).map(a=>(
            <div key={a.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:`1px solid ${theme.borderLight}` }}>
              <Zap size={12} color={theme.teal}/>
              <span style={{ fontSize:13 }}><strong>{uName(a.user)}</strong> {a.action} <strong>{a.target}</strong></span>
              <Badge label={a.section} color={theme.textMut} style={{ marginLeft:"auto" }}/>
            </div>
          ))}
        </Card>
      </div>
    );

    /* ─── TEAM ─── */
    case "team": return (
      <div>
        <SectionHead theme={theme} right={isAdmin&&<Btn primary theme={theme} onClick={()=>openM("editUser",{role:"Content Creator",tzLabel:"London",tz:"Europe/London",socials:{}})}><Plus size={14}/> Add Member</Btn>}>Team Directory</SectionHead>
        <div className="nanu-grid-team">
          {users.map(u=>(
            <Card key={u.id} theme={theme} style={{ position:"relative" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:3, borderRadius:"12px 12px 0 0", background:`linear-gradient(90deg,${ROLE_COLORS[u.role]||theme.teal},${TZ_OPTIONS.find(t=>t.label===u.tzLabel)?.color||theme.teal})` }}/>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                <div><div style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:16 }}>{u.name}</div><div style={{ fontSize:13, color:theme.textSec, marginTop:3 }}>{u.email}</div></div>
                {isAdmin&&<button onClick={()=>openM("editUser",{...u})} style={{ background:"none", border:"none", color:theme.textMut, cursor:"pointer" }}><Edit3 size={14}/></button>}
              </div>
              <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
                <Badge label={u.role} color={ROLE_COLORS[u.role]||theme.teal}/><Badge label={u.tzLabel} color={TZ_OPTIONS.find(t=>t.label===u.tzLabel)?.color||theme.teal}/>
              </div>
              <p style={{ fontSize:13, color:theme.textMut, marginTop:10, lineHeight:1.5 }}>{u.resp}</p>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8, flexWrap:"wrap" }}>
                <span style={{ fontFamily:FONT_MONO, fontSize:11, color:theme.textMut }}>@{u.username}</span>
                {u.socials && Object.entries(u.socials).filter(([_,v])=>v).map(([k,v])=>(
                  <a key={k} href={v} target="_blank" rel="noopener noreferrer" style={{ color:theme.teal, display:"flex", alignItems:"center" }} title={k}>
                    {k==="linkedin"?<Linkedin size={13}/>:k==="x"?<Twitter size={13}/>:k==="instagram"?<Instagram size={13}/>:k==="youtube"?<Youtube size={13}/>:<ExternalLink size={13}/>}
                  </a>
                ))}
                {u.id===curUser.id&&!isAdmin&&<button onClick={()=>openM("editSocials",{...u})} style={{ background:"none", border:"none", color:theme.teal, cursor:"pointer", fontSize:11, fontWeight:600, display:"flex", alignItems:"center", gap:3 }}><Edit3 size={11}/>Edit Socials</button>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );

    /* ─── CALENDAR ─── */
    case "calendar": return (
      <div>
        <SectionHead theme={theme} right={<>
          <Sel theme={theme} options={[{value:"All",label:"All Statuses"},...STATUSES.map(s=>({value:s,label:s}))]} value={fStatus} onChange={e=>setFStatus(e.target.value)} style={{width:"auto",fontSize:13,padding:"6px 10px"}}/>
          <Sel theme={theme} options={[{value:"All",label:"All Platforms"},...PLATFORMS.map(p=>({value:p,label:p}))]} value={fPlat} onChange={e=>setFPlat(e.target.value)} style={{width:"auto",fontSize:13,padding:"6px 10px"}}/>
          <div style={{ display:"flex", background:theme.bgInput, borderRadius:8, border:`1px solid ${theme.border}`, overflow:"hidden" }}>
            {[["month","Month"],["kanban","Kanban"],["week","Week"],["list","List"]].map(([k,l])=>(
              <button key={k} onClick={()=>setCalView(k)} style={{ padding:"6px 12px", border:"none", fontSize:12, background:calView===k?theme.teal:"transparent", color:calView===k?"#0D1B21":theme.textSec, cursor:"pointer", fontWeight:600 }}>{l}</button>
            ))}
          </div>
          <Btn primary theme={theme} onClick={()=>openM("editCal",{platform:PLATFORMS[0],status:"Idea",owner:curUser.id,dueDate:"",publishTime:"",caption:"",assetLink:"",campaign:""})}><Plus size={14}/> Add</Btn>
        </>}>Content Calendar</SectionHead>
        {calView==="month"&&(()=>{
          const y=calMonth.getFullYear(), m=calMonth.getMonth();
          const first=new Date(y,m,1);
          const last=new Date(y,m+1,0);
          const startOff=first.getDay()===0?6:first.getDay()-1;
          const totalCells=startOff+last.getDate();
          const rows=Math.ceil(totalCells/7);
          const cells=Array.from({length:rows*7},(_,i)=>{
            const dayNum=i-startOff+1;
            const d=new Date(y,m,dayNum);
            return d;
          });
          const fmt=d=>d.toISOString().split("T")[0];
          const isT=d=>fmt(d)==="2026-03-09";
          const monthLabel=calMonth.toLocaleDateString("en-GB",{month:"long",year:"numeric"});
          return <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <button onClick={()=>setCalMonth(new Date(y,m-1,1))} style={{background:"none",border:"none",color:theme.textSec,cursor:"pointer"}}><ChevronLeft size={18}/></button>
              <span style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16}}>{monthLabel}</span>
              <button onClick={()=>setCalMonth(new Date(y,m+1,1))} style={{background:"none",border:"none",color:theme.textSec,cursor:"pointer"}}><ChevronRight size={18}/></button>
            </div>
            <div className="nanu-cal-grid">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
                <div key={d} style={{textAlign:"center",fontSize:11,color:theme.textMut,padding:"6px 0",fontWeight:600}}>{d}</div>
              ))}
              {cells.map((d,idx)=>{
                const ds=fmt(d);
                const dayItems=filteredCal.filter(c=>c.dueDate===ds);
                const isCurMonth=d.getMonth()===m;
                return <div key={idx} style={{
                  minHeight:82,padding:6,borderRadius:8,
                  background:isT(d)?`${theme.teal}10`:isCurMonth?theme.bgCard:"transparent",
                  border:`1px solid ${isT(d)?theme.teal:isCurMonth?theme.border:"transparent"}`,
                  opacity:isCurMonth?1:.3
                }}>
                  <div style={{fontFamily:FONT_MONO,fontSize:11,color:isT(d)?theme.teal:theme.textSec,fontWeight:isT(d)?700:400,marginBottom:4}}>{d.getDate()}</div>
                  {dayItems.slice(0,2).map(item=>(
                    <div key={item.id} onClick={()=>openM("editCal",{...item})} style={{
                      fontSize:10,padding:"2px 5px",marginBottom:2,borderRadius:4,
                      background:`${STATUS_COLORS[item.status]}20`,color:STATUS_COLORS[item.status],
                      cursor:"pointer",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"
                    }}>{item.title}</div>
                  ))}
                  {dayItems.length>2&&<div style={{fontSize:9,color:theme.textMut}}>+{dayItems.length-2} more</div>}
                </div>;
              })}
            </div>
          </div>;
        })()}
        {calView==="kanban"&&(
          <div className="nanu-kanban">
            {STATUSES.map(st=>{
              const items=filteredCal.filter(i=>i.status===st);
              return <div key={st} className="nanu-kanban-col">
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:STATUS_COLORS[st]}}/><span style={{fontWeight:600,fontSize:13}}>{st}</span><span style={{fontSize:11,color:theme.textMut}}>({items.length})</span>
                </div>
                {items.map(item=>(
                  <Card key={item.id} theme={theme} onClick={()=>openM("editCal",{...item})} style={{padding:12,marginBottom:6,cursor:"pointer"}}>
                    <Badge label={item.platform} color={PLATFORM_COLORS[item.platform]||theme.teal} style={{marginBottom:6}}/>
                    <div style={{fontWeight:600,fontSize:13}}>{item.title}</div>
                    <div style={{fontSize:12,color:theme.textMut,marginTop:4}}>{uName(item.owner)} · {item.dueDate}</div>
                    {item.campaign&&<Badge label={campaigns.find(c=>c.tag===item.campaign)?.name||item.campaign} color={campaigns.find(c=>c.tag===item.campaign)?.color||theme.purple} style={{marginTop:6}}/>}
                  </Card>
                ))}
              </div>;
            })}
          </div>
        )}
        {calView==="week"&&weekDates.map(dd=>{
          const ds=dd.toISOString().split("T")[0];
          const dayItems=filteredCal.filter(c=>c.dueDate===ds);
          const wt=weeklyThemes.find(w=>w.day===dd.toLocaleDateString("en-GB",{weekday:"long"}));
          const isToday=ds==="2026-03-09";
          return <div key={ds} style={{marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontWeight:700,fontSize:14,color:isToday?theme.teal:theme.text}}>{dd.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"short"})}</span>
              {wt&&<Badge label={wt.theme} color={wt.color}/>}
            </div>
            {dayItems.length===0&&<p style={{fontSize:13,color:theme.textMut,paddingLeft:10}}>No content</p>}
            {dayItems.map(item=>(
              <Card key={item.id} theme={theme} onClick={()=>openM("editCal",{...item})} style={{padding:10,marginBottom:4,cursor:"pointer"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <Badge label={item.platform} color={PLATFORM_COLORS[item.platform]||theme.teal}/>
                  <span style={{fontWeight:600,fontSize:13,flex:1}}>{item.title}</span>
                  <Badge label={item.status} color={STATUS_COLORS[item.status]}/>
                  <span style={{fontSize:12,color:theme.textMut}}>{uName(item.owner)}</span>
                </div>
              </Card>
            ))}
          </div>;
        })}
        {calView==="list"&&(
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {filteredCal.sort((a,b)=>a.dueDate.localeCompare(b.dueDate)).map(item=>(
              <Card key={item.id} theme={theme} onClick={()=>openM("editCal",{...item})} style={{padding:12,cursor:"pointer"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <span style={{fontFamily:FONT_MONO,fontSize:12,color:theme.textMut,minWidth:85}}>{item.dueDate}</span>
                  <Badge label={item.platform} color={PLATFORM_COLORS[item.platform]||theme.teal}/>
                  <span style={{fontWeight:600,fontSize:14,flex:1}}>{item.title}</span>
                  <Badge label={item.status} color={STATUS_COLORS[item.status]}/>
                  <span style={{fontSize:12,color:theme.textMut}}>{uName(item.owner)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );

    /* ─── TASKS ─── */
    case "tasks": return (
      <div>
        <SectionHead theme={theme} right={<>
          <div style={{display:"flex",background:theme.bgInput,borderRadius:8,border:`1px solid ${theme.border}`,overflow:"hidden"}}>
            {[["all","All Tasks"],["mine","My Tasks"]].map(([k,l])=>(
              <button key={k} onClick={()=>setTaskView(k)} style={{padding:"6px 14px",border:"none",fontSize:13,background:taskView===k?theme.teal:"transparent",color:taskView===k?"#0D1B21":theme.textSec,cursor:"pointer",fontWeight:600}}>{l}</button>
            ))}
          </div>
          <Btn theme={theme} small onClick={()=>{
            const myTasks = taskView==="mine" ? sortedTasks : sortedTasks.filter((t)=>t.owner===curUser.id);
            const rows = [["Title","Status","Priority","Due Date","Owner","Project","Blocker","Notes"]];
            myTasks.forEach((t)=>rows.push([t.title,t.status,t.priority||"",t.dueDate,uName(t.owner),projects.find((p)=>p.id===t.project)?.name||"",t.blocker||"",t.notes||""]));
            exportCSV(rows,`nanu-tasks-${new Date().toISOString().slice(0,10)}.csv`);
          }}><Download size={13}/> CSV</Btn>
          <Btn theme={theme} small onClick={()=>{
            const myTasks = taskView==="mine" ? sortedTasks : sortedTasks.filter((t)=>t.owner===curUser.id);
            const items = myTasks.map((t)=>({
              heading:`${t.title} — ${t.status}${t.priority?" · "+t.priority:""}`,
              body:`Owner: ${uName(t.owner)}\nDue: ${t.dueDate}\n${t.project?`Project: ${projects.find((p)=>p.id===t.project)?.name||""}\n`:""}${t.blocker?`Blocker: ${t.blocker}\n`:""}${t.notes?`\n${t.notes}`:""}`
            }));
            exportDOCX(`My Tasks — ${new Date().toLocaleDateString("en-GB")}`, items, `nanu-tasks-${new Date().toISOString().slice(0,10)}.doc`);
          }}><Download size={13}/> DOCX</Btn>
          <Btn primary theme={theme} onClick={()=>openM("editTask",{owner:curUser.id,status:"Not Started",dueDate:"",blocker:"",priority:"Medium",notes:"",linkedContent:"",project:""})}><Plus size={14}/> Add Task</Btn>
        </>}>Tasks</SectionHead>
        {sortedTasks.map((t)=>{
          const hl=["Overdue","Blocked","Needs Approval"].includes(t.status);
          const proj = projects.find((p)=>p.id===t.project);
          return <Card key={t.id} theme={theme} onClick={()=>openM("editTask",{...t})} style={{padding:12,marginBottom:6,cursor:"pointer",borderLeft:`3px solid ${TASK_STATUS_COLORS[t.status]||theme.border}`,background:hl?`${TASK_STATUS_COLORS[t.status]}06`:theme.bgCard}}>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              {hl&&<AlertTriangle size={14} color={TASK_STATUS_COLORS[t.status]}/>}
              <span style={{fontWeight:600,fontSize:14,flex:1}}>{t.title}</span>
              {proj&&<Badge label={proj.name} color={proj.color}/>}
              {t.priority&&<Badge label={t.priority} color={TASK_PRIORITY_COLORS[t.priority]||theme.textMut}/>}
              <Badge label={t.status} color={TASK_STATUS_COLORS[t.status]}/>
              <span style={{fontSize:12,color:theme.textMut}}>{uName(t.owner)}</span>
              <span style={{fontFamily:FONT_MONO,fontSize:11,color:theme.textMut}}>{t.dueDate}</span>
            </div>
            {t.notes&&<p style={{fontSize:12,color:theme.textSec,margin:"6px 0 0",lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{t.notes}</p>}
            {t.blocker&&<p style={{fontSize:12,color:theme.red,margin:"4px 0 0"}}>Blocker: {t.blocker}</p>}
            {t.linkedContent&&calendar.find((c)=>c.id===t.linkedContent)&&<div style={{marginTop:4,display:"flex",alignItems:"center",gap:4}}><Link2 size={11} color={theme.teal}/><span style={{fontSize:11,color:theme.teal}}>Linked: {calendar.find((c)=>c.id===t.linkedContent)?.title}</span></div>}
          </Card>;
        })}
      </div>
    );

    /* ─── PROJECTS ─── */
    case "projects": return (
      <div>
        <SectionHead theme={theme} right={isAdmin&&<Btn primary theme={theme} onClick={()=>openM("editProject",{status:"Planning",color:"#1FC2C2",owner:curUser.id})}><Plus size={14}/> Add Project</Btn>}>Projects</SectionHead>
        <div className="nanu-grid-2col">
          {projects.map((proj)=>{
            const projTasks = tasks.filter((t)=>t.project===proj.id);
            const done = projTasks.filter((t)=>t.status==="Done").length;
            const total = projTasks.length;
            const pct = total > 0 ? Math.round((done/total)*100) : 0;
            return <Card key={proj.id} theme={theme} style={{position:"relative"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,borderRadius:"12px 12px 0 0",background:proj.color}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginTop:4}}>
                <div>
                  <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:17}}>{proj.name}</div>
                  <div style={{fontSize:13,color:theme.textSec,marginTop:4,lineHeight:1.5}}>{proj.description}</div>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                  <Badge label={proj.status} color={PROJECT_STATUS_COLORS[proj.status]}/>
                  {isAdmin&&<button onClick={()=>openM("editProject",{...proj})} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer"}}><Edit3 size={14}/></button>}
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:12}}>
                <span style={{fontSize:12,color:theme.textMut}}>Owner: {uName(proj.owner)}</span>
                <span style={{fontSize:12,color:theme.textMut}}>·</span>
                <span style={{fontSize:12,color:proj.color,fontWeight:600}}>{total} tasks ({done} done)</span>
              </div>
              {total > 0 && <div style={{marginTop:8}}><ProgressBar value={done} max={total} color={proj.color} theme={theme}/></div>}
              <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:4}}>
                {projTasks.filter((t)=>t.status!=="Done").slice(0,4).map((t)=>(
                  <div key={t.id} onClick={()=>openM("editTask",{...t})} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",borderRadius:6,background:theme.bgInput,cursor:"pointer",fontSize:12}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:TASK_STATUS_COLORS[t.status],flexShrink:0}}/>
                    <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</span>
                    <Badge label={t.status} color={TASK_STATUS_COLORS[t.status]}/>
                  </div>
                ))}
                {projTasks.filter((t)=>t.status!=="Done").length > 4 && <div style={{fontSize:11,color:theme.textMut,paddingLeft:8}}>+{projTasks.filter((t)=>t.status!=="Done").length - 4} more</div>}
              </div>
              <div style={{marginTop:10}}>
                <Btn theme={theme} small onClick={()=>openM("editTask",{owner:curUser.id,status:"Not Started",dueDate:"",blocker:"",priority:"Medium",notes:"",linkedContent:"",project:proj.id})}><Plus size={12}/> Add Task to Project</Btn>
              </div>
            </Card>;
          })}
        </div>
      </div>
    );

    /* ─── OUTREACH ─── */
    case "outreach": return (
      <div>
        <SectionHead theme={theme} right={<>
          <Sel theme={theme} options={[{value:"All",label:"All Types"},...OUTREACH_TYPES.map(t=>({value:t,label:t}))]} value={outreachFilter} onChange={(e)=>setOutreachFilter(e.target.value)} style={{width:"auto",fontSize:13,padding:"6px 10px"}}/>
          <Btn primary theme={theme} onClick={()=>openM("editOutreach",{type:"Community",status:"Identified",owner:curUser.id,platform:"",notes:"",url:"",date:""})}><Plus size={14}/> Add Contact</Btn>
        </>}>Outreach Pipeline</SectionHead>
        {/* Summary strip */}
        <div className="nanu-grid-summary" style={{marginBottom:18}}>
          {OUTREACH_TYPES.map(type=>{
            const count = outreach.filter((o)=>o.type===type).length;
            const confirmed = outreach.filter((o)=>o.type===type && o.status==="Confirmed").length;
            return <Card key={type} theme={theme} style={{padding:12,textAlign:"center",cursor:"pointer"}} onClick={()=>setOutreachFilter(type)}>
              <div className="nanu-big-num" style={{fontSize:22,color:theme.teal}}>{count}</div>
              <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>{type}s</div>
              {confirmed>0&&<div style={{fontSize:10,color:theme.green,marginTop:2}}>{confirmed} confirmed</div>}
            </Card>;
          })}
        </div>
        {/* Kanban by status */}
        <div className="nanu-kanban">
          {OUTREACH_STATUSES.map(status=>{
            const items = outreach.filter((o)=>(outreachFilter==="All"||o.type===outreachFilter)&&o.status===status);
            return <div key={status} className="nanu-kanban-col">
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:OUTREACH_STATUS_COLORS[status]}}/>
                <span style={{fontWeight:600,fontSize:13}}>{status}</span>
                <span style={{fontSize:11,color:theme.textMut}}>({items.length})</span>
              </div>
              {items.map((item)=>(
                <Card key={item.id} theme={theme} onClick={()=>openM("editOutreach",{...item})} style={{padding:12,marginBottom:6,cursor:"pointer"}}>
                  <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>{item.name}</div>
                  <Badge label={item.type} color={item.type==="Community"?theme.teal:item.type==="Influencer"?theme.purple:item.type==="Content Creator"?theme.orange:"#748FFC"} style={{marginBottom:6}}/>
                  <div style={{fontSize:12,color:theme.textSec,marginTop:4}}>{item.platform}</div>
                  <div style={{fontSize:11,color:theme.textMut,marginTop:4}}>{uName(item.owner)}{item.date?` · ${item.date}`:""}</div>
                  {item.notes&&<p style={{fontSize:11,color:theme.textMut,marginTop:4,lineHeight:1.4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{item.notes}</p>}
                </Card>
              ))}
            </div>;
          })}
        </div>
      </div>
    );

    /* ─── RESOURCES ─── */
    case "resources": return (
      <div>
        <SectionHead theme={theme} right={isAdmin&&<Btn primary theme={theme} onClick={()=>openM("editResource",{group:"Drives"})}><Plus size={14}/> Add Link</Btn>}>Resources & Quick Links</SectionHead>
        {RESOURCE_GROUPS.filter(g=>resources.some(r=>r.group===g)).map(g=>(
          <div key={g} style={{marginBottom:20}}>
            <div style={{fontSize:12,fontWeight:600,color:theme.textSec,marginBottom:8,textTransform:"uppercase",letterSpacing:".04em"}}>{g}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {resources.filter(r=>r.group===g).map(r=>(
                <div key={r.id} style={{position:"relative"}}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:7,padding:"10px 16px",background:theme.bgCard,borderRadius:10,border:`1px solid ${theme.border}`,color:theme.text,textDecoration:"none",fontWeight:500,fontSize:14,cursor:"pointer"}}>
                    <ExternalLink size={13} color={theme.teal}/>{r.label}
                  </a>
                  {isAdmin&&<button onClick={()=>openM("editResource",{...r})} style={{position:"absolute",top:-4,right:-4,width:20,height:20,borderRadius:"50%",border:`1px solid ${theme.border}`,background:theme.bgCard,color:theme.textMut,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Edit3 size={10}/></button>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );

    /* ─── CONTENT OPS ─── */
    case "content-ops": return (
      <div>
        <SectionHead theme={theme}>Content Operations</SectionHead>
        <TabBar tabs={[{key:"ideas",label:"Ideas"},{key:"captions",label:"Captions"},{key:"hashtags",label:"Hashtags"},{key:"messaging",label:"Messaging"},{key:"templates",label:"Templates"}]} active={opsTab} onChange={setOpsTab} theme={theme}/>
        {opsTab==="ideas"&&<div>
          <div style={{marginBottom:12,textAlign:"right"}}><Btn primary theme={theme} small onClick={()=>openM("editIdea",{category:"Video",status:"Open",votes:0})}><Plus size={13}/> Add Idea</Btn></div>
          <div className="nanu-grid-ops">
            {ops.ideas.map(idea=>(
              <Card key={idea.id} theme={theme} onClick={()=>openM("editIdea",{...idea})} style={{padding:14,cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><span style={{fontWeight:600,fontSize:14,flex:1}}>{idea.text}</span><Badge label={`${idea.votes}`} color={theme.teal}/></div>
                <div style={{display:"flex",gap:6,marginTop:8}}><Badge label={idea.category} color={theme.textSec}/><Badge label={idea.status} color={idea.status==="Approved"?theme.green:theme.blue}/></div>
              </Card>
            ))}
          </div>
        </div>}
        {opsTab==="captions"&&<div>
          <div style={{marginBottom:12,textAlign:"right"}}><Btn primary theme={theme} small onClick={()=>openM("editCaption",{tags:[]})}><Plus size={13}/> Add Caption</Btn></div>
          {ops.captions.map(cap=>(
            <Card key={cap.id} theme={theme} onClick={()=>openM("editCaption",{...cap})} style={{padding:14,marginBottom:8,cursor:"pointer"}}>
              <p style={{fontSize:14,lineHeight:1.6,fontStyle:"italic",margin:0}}>"{cap.text}"</p>
              <div style={{display:"flex",gap:6,marginTop:8,alignItems:"center",flexWrap:"wrap"}}>
                {cap.tags.map(t=><Badge key={t} label={t} color={theme.teal}/>)}
                <button onClick={e=>{e.stopPropagation();navigator.clipboard?.writeText(cap.text)}} style={{marginLeft:"auto",background:"none",border:"none",color:theme.textMut,cursor:"pointer",display:"flex",alignItems:"center",gap:3,fontSize:11}}><Copy size={12}/>Copy</button>
              </div>
            </Card>
          ))}
        </div>}
        {opsTab==="hashtags"&&<div>
          <div style={{marginBottom:12,textAlign:"right"}}><Btn primary theme={theme} small onClick={()=>openM("editHashtag",{group:"",tags:[]})}><Plus size={13}/> Add Group</Btn></div>
          <div className="nanu-grid-notes">
            {ops.hashtags.map(h=>(
              <Card key={h.id} theme={theme} onClick={()=>openM("editHashtag",{...h})} style={{padding:14,cursor:"pointer"}}>
                <div style={{fontFamily:FONT_DISPLAY,fontWeight:600,fontSize:13,color:theme.teal,marginBottom:8}}>{h.group}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{h.tags.map(t=><Badge key={t} label={t} color={theme.textSec}/>)}</div>
                <button onClick={e=>{e.stopPropagation();navigator.clipboard?.writeText(h.tags.join(" "))}} style={{marginTop:8,background:"none",border:"none",color:theme.textMut,cursor:"pointer",display:"flex",alignItems:"center",gap:3,fontSize:11}}><Copy size={12}/>Copy all</button>
              </Card>
            ))}
          </div>
        </div>}
        {opsTab==="messaging"&&<div>
          <div style={{marginBottom:12,textAlign:"right"}}><Btn primary theme={theme} small onClick={()=>openM("editMessaging",{})}><Plus size={13}/> Add Pillar</Btn></div>
          {ops.messaging.map(m=>(
            <Card key={m.id} theme={theme} onClick={()=>openM("editMessaging",{...m})} style={{padding:14,marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:16}}>
              <Badge label={m.pillar} color={theme.teal} style={{minWidth:110,textAlign:"center"}}/><span style={{fontSize:14}}>{m.line}</span>
            </Card>
          ))}
        </div>}
        {opsTab==="templates"&&<div>
          <div style={{marginBottom:12,textAlign:"right"}}><Btn primary theme={theme} small onClick={()=>openM("editTemplate",{platform:PLATFORMS[0],tags:[]})}><Plus size={13}/> Add Template</Btn></div>
          {ops.templates.map(tp=>(
            <Card key={tp.id} theme={theme} onClick={()=>openM("editTemplate",{...tp})} style={{padding:14,marginBottom:8,cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{fontWeight:600,fontSize:15}}>{tp.name}</span><Badge label={tp.platform} color={PLATFORM_COLORS[tp.platform]||theme.teal}/></div>
              <pre style={{fontSize:13,color:theme.textSec,whiteSpace:"pre-wrap",margin:0,lineHeight:1.5,fontFamily:FONT_BODY}}>{tp.caption}</pre>
              <div style={{display:"flex",gap:5,marginTop:8,flexWrap:"wrap"}}>
                {tp.tags.map(t=><Badge key={t} label={t} color={theme.textMut}/>)}
                <button onClick={e=>{e.stopPropagation();navigator.clipboard?.writeText(tp.caption)}} style={{marginLeft:"auto",background:"none",border:"none",color:theme.textMut,cursor:"pointer",display:"flex",alignItems:"center",gap:3,fontSize:11}}><Copy size={12}/>Copy</button>
              </div>
            </Card>
          ))}
        </div>}
      </div>
    );

    /* ─── STATS ─── */
    case "stats": return (
      <div>
        <SectionHead theme={theme} right={isAdmin&&<><Btn theme={theme} onClick={()=>openM("editTargets",{...stats.targets})}><Target size={14}/> Set Targets</Btn><Btn theme={theme} onClick={()=>openM("editStats",{...stats.totals})}><Edit3 size={14}/> Update Stats</Btn></>}>Social Snapshot</SectionHead>
        <p style={{fontSize:12,color:theme.textMut,marginBottom:16}}>Last updated: {stats.lastUpdated}</p>
        <div className="nanu-grid-stats-top" style={{marginBottom:20}}>
          {[
            {l:"Followers",v:stats.totals.followers,t:stats.targets.followers,i:<Users size={15}/>},
            {l:"Newsletter",v:stats.totals.newsletterSignups,t:stats.targets.newsletterSignups,i:<MessageSquare size={15}/>},
            {l:"Nanu Users",v:(stats.weeklyGrowth.length?stats.weeklyGrowth.at(-1).users:0),t:stats.targets.nanuUsers,i:<Star size={15}/>},
            {l:"Website Traffic",v:stats.totals.websiteTraffic,t:0,i:<Globe size={15}/>},
            {l:"Shares",v:stats.totals.shares,t:0,i:<Send size={15}/>},
          ].map(m=>(
            <Card key={m.l} theme={theme} style={{padding:14}}>
              <div style={{color:theme.teal,marginBottom:6}}>{m.i}</div>
              <div className="nanu-big-num" style={{fontSize:26}}>{typeof m.v==="number"&&!m.s?m.v.toLocaleString():m.v}{m.s||""}</div>
              <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:3,textTransform:"uppercase"}}>{m.l}</div>
              {m.t>0&&<div style={{marginTop:8}}>
                <ProgressBar value={m.v} max={m.t} color={theme.teal} theme={theme}/>
                <div style={{fontSize:10,color:theme.textMut,marginTop:3}}>{Math.round((m.v/m.t)*100)}% of {m.t.toLocaleString()} target</div>
              </div>}
            </Card>
          ))}
        </div>
        <div className="nanu-grid-stats-plat" style={{marginBottom:20}}>
          {Object.entries(stats.platforms).map(([p,d])=>{
            const diff = d.followers - (d.lastWeek||0);
            const diffStr = diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : "—";
            return <Card key={p} theme={theme} style={{padding:14,cursor:isAdmin?"pointer":"default"}} onClick={isAdmin?()=>openM("editPlatform",{_platformName:p,...d}):undefined}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontWeight:600,fontSize:14}}>{p}</span>
                {isAdmin&&<Edit3 size={11} color={theme.textMut}/>}
              </div>
              <div className="nanu-big-num" style={{fontSize:22}}>{d.followers.toLocaleString()}</div>
              <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>followers</div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:6}}>
                <span style={{fontSize:12,color:diff>0?theme.green:diff<0?theme.red:theme.textMut,fontWeight:600}}>{diffStr} this week</span>
                {d.lastWeek>0&&<span style={{fontSize:11,color:theme.textMut}}>from {d.lastWeek.toLocaleString()}</span>}
              </div>
            </Card>;
          })}
        </div>

        <Card theme={theme} style={{padding:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontFamily:FONT_DISPLAY,fontWeight:600,fontSize:15}}>Nanu User Growth</div>
            {isAdmin&&<Btn theme={theme} small onClick={()=>openM("editGrowth",{entries:[...stats.weeklyGrowth]})}><Edit3 size={12}/> Update</Btn>}
          </div>
          <div style={{display:"flex",alignItems:"flex-end",gap:8,height:100}}>
            {stats.weeklyGrowth.map((w,i)=>{
              const mx=Math.max(...stats.weeklyGrowth.map(x=>x.users));
              const mn=Math.min(...stats.weeklyGrowth.map(x=>x.users))-20;
              const h=((w.users-mn)/(mx-mn))*80+10;
              return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <span style={{fontFamily:FONT_MONO,fontSize:10,color:theme.teal,fontWeight:700}}>{w.users}</span>
                <div style={{width:"100%",height:h,background:`linear-gradient(180deg,${theme.teal},${theme.teal}40)`,borderRadius:4}}/>
                <span style={{fontSize:9,color:theme.textMut}}>{w.week}</span>
              </div>;
            })}
          </div>
        </Card>
      </div>
    );

    /* ─── NOTES ─── */
    case "notes": return (
      <div>
        <SectionHead theme={theme} right={<Btn primary theme={theme} onClick={()=>openM("editNote",{color:theme.teal,pinned:false})}><Plus size={14}/> Add Note</Btn>}>Team Notes</SectionHead>
        <div className="nanu-grid-notes">
          {[...notes].sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)).map(n=>(
            <Card key={n.id} theme={theme} onClick={()=>openM("editNote",{...n})} style={{padding:14,cursor:"pointer",borderLeft:`3px solid ${n.color}`,position:"relative"}}>
              {n.pinned&&<Pin size={13} color={n.color} style={{position:"absolute",top:8,right:8}}/>}
              <p style={{fontSize:14,lineHeight:1.6,margin:0}}>{n.text}</p>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10}}>
                <span style={{fontSize:12,color:theme.textMut}}>{uName(n.author)}</span>
                <span style={{fontSize:11,color:theme.textMut,fontFamily:FONT_MONO}}>{n.date}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );

    /* ─── ADMIN ─── */
    case "admin": return isAdmin ? (
      <div>
        <SectionHead theme={theme}>Admin Panel</SectionHead>
        <div className="nanu-grid-2col">
          <Card theme={theme}>
            <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16,marginBottom:14}}>User Management</div>
            <Btn primary theme={theme} small onClick={()=>openM("editUser",{role:"Content Creator",tzLabel:"London",tz:"Europe/London",pin:"1234",socials:{}})} style={{marginBottom:12}}><Plus size={13}/> Add User</Btn>
            {users.map(u=>(
              <div key={u.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderTop:`1px solid ${theme.borderLight}`}}>
                <div><div style={{fontWeight:600,fontSize:14}}>{u.name}</div><div style={{fontSize:12,color:theme.textMut}}>@{u.username} · {u.role} · PIN: {u.pin}</div></div>
                <div style={{display:"flex",gap:6}}>
                  <Btn theme={theme} small onClick={()=>{
                    const np=String(Math.floor(1000+Math.random()*9000));
                    setUsers(p=>p.map(x=>x.id===u.id?{...x,pin:np}:x));
                    log("reset PIN",u.name,"Admin");
                    alert(`PIN for ${u.name} reset to: ${np}`);
                  }}><Lock size={12}/> Reset</Btn>
                  <Btn theme={theme} small onClick={()=>openM("editUser",{...u})}><Edit3 size={12}/></Btn>
                  {u.id!==curUser.id&&<Btn theme={theme} small danger onClick={()=>{if(confirm(`Remove ${u.name}?`)){setUsers(p=>p.filter(x=>x.id!==u.id));db.deleteUser(u.id).catch(console.error);log("removed",u.name,"Admin")}}}><Trash2 size={12}/></Btn>}
                </div>
              </div>
            ))}
          </Card>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Card theme={theme}><div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16,marginBottom:10}}>Weekly Themes</div><Btn theme={theme} small onClick={()=>openM("editThemes")}><Edit3 size={12}/> Edit Themes</Btn></Card>
            <Card theme={theme}><div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16,marginBottom:10}}>Key Dates</div><Btn theme={theme} small onClick={()=>openM("editKeyDates")}><Edit3 size={12}/> Manage</Btn></Card>
            <Card theme={theme}>
              <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16,marginBottom:10}}>Campaigns</div>
              <Btn primary theme={theme} small onClick={()=>openM("editCampaign",{})} style={{marginBottom:10}}><Plus size={13}/> Add</Btn>
              {campaigns.map(c=>(
                <div key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0"}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:c.color}}/><span style={{fontSize:14,flex:1}}>{c.name}</span><span style={{fontFamily:FONT_MONO,fontSize:11,color:theme.textMut}}>{c.tag}</span>
                  <button onClick={()=>openM("editCampaign",{...c})} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer"}}><Edit3 size={12}/></button>
                </div>
              ))}
            </Card>
            <Card theme={theme}>
              <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16,marginBottom:10}}>Projects</div>
              <Btn primary theme={theme} small onClick={()=>openM("editProject",{status:"Planning",color:"#1FC2C2",owner:curUser.id})} style={{marginBottom:10}}><Plus size={13}/> Add</Btn>
              {projects.map((proj)=>(
                <div key={proj.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0"}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:proj.color}}/><span style={{fontSize:14,flex:1}}>{proj.name}</span><Badge label={proj.status} color={PROJECT_STATUS_COLORS[proj.status]}/>
                  <button onClick={()=>openM("editProject",{...proj})} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer"}}><Edit3 size={12}/></button>
                </div>
              ))}
            </Card>
            <Card theme={theme}>
              <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16,marginBottom:10}}>Quick Stats</div>
              <div style={{fontSize:14,color:theme.textSec,lineHeight:2}}>Team: {users.length} · Calendar: {calendar.length} · Tasks: {tasks.filter((t)=>t.status!=="Done").length} · Projects: {projects.length} · Outreach: {outreach.length} · Notes: {notes.length}</div>
            </Card>
          </div>
        </div>
      </div>
    ) : null;

    default: return null;
    }
  };

  /* ═══ MODAL FORMS ═══ */
  const renderModal = () => {
    if (!modal) return null;

    switch(modal) {
      case "editCal": return <Modal theme={theme} title={form.id?"Edit Content":"New Content"} onClose={closeM} width={580}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Title</Label><Input theme={theme} value={form.title||""} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Platform</Label><Sel theme={theme} options={PLATFORMS} value={form.platform} onChange={e=>setForm(p=>({...p,platform:e.target.value}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={STATUSES} value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Due Date</Label><Input theme={theme} type="date" value={form.dueDate||""} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))}/></div><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={users.map(u=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Publish Time</Label><Input theme={theme} type="time" value={form.publishTime||""} onChange={e=>setForm(p=>({...p,publishTime:e.target.value}))}/></div><div><Label theme={theme}>Campaign</Label><Sel theme={theme} options={[{value:"",label:"None"},...campaigns.map(c=>({value:c.tag,label:c.name}))]} value={form.campaign||""} onChange={e=>setForm(p=>({...p,campaign:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Caption</Label><Textarea theme={theme} value={form.caption||""} onChange={e=>setForm(p=>({...p,caption:e.target.value}))}/></div>
        <div><Label theme={theme}>Asset Link</Label><Input theme={theme} value={form.assetLink||""} onChange={e=>setForm(p=>({...p,assetLink:e.target.value}))} placeholder="https://..."/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {(form.id?()=>{setCalendar(p=>p.filter(c=>c.id!==form.id));db.deleteCalendarItem(form.id).catch(console.error);log("deleted",form.title,"Calendar");closeM()}:null)&&<Btn theme={theme} danger onClick={form.id?()=>{setCalendar(p=>p.filter(c=>c.id!==form.id));db.deleteCalendarItem(form.id).catch(console.error);log("deleted",form.title,"Calendar");closeM()}:null}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{const cid=form.id||uid("c");const cdata={...form,id:cid};if(form.id){setCalendar(p=>p.map(c=>c.id===form.id?cdata:c));log("updated",form.title,"Calendar")}else{setCalendar(p=>[...p,cdata]);log("created",form.title,"Calendar")}db.saveCalendarItem(cdata).catch(console.error);closeM()}}>Save</Btn>
        </div>
      </div></Modal>;

      case "editTask": return <Modal theme={theme} title={form.id?"Edit Task":"New Task"} onClose={closeM} width={580}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Title</Label><Input theme={theme} value={form.title||""} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Add context, details, links, or instructions for this task..." style={{minHeight:100}}/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={users.map(u=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={TASK_STATUSES} value={form.status||"Not Started"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Due Date</Label><Input theme={theme} type="date" value={form.dueDate||""} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))}/></div><div><Label theme={theme}>Priority</Label><Sel theme={theme} options={TASK_PRIORITIES} value={form.priority||"Medium"} onChange={e=>setForm(p=>({...p,priority:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Blocker</Label><Input theme={theme} value={form.blocker||""} onChange={e=>setForm(p=>({...p,blocker:e.target.value}))} placeholder="Describe any blockers..."/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Project</Label><Sel theme={theme} options={[{value:"",label:"None"},...projects.map((p)=>({value:p.id,label:p.name}))]} value={form.project||""} onChange={(e)=>setForm(p=>({...p,project:e.target.value}))}/></div><div><Label theme={theme}>Linked Content</Label><Sel theme={theme} options={[{value:"",label:"None"},...calendar.map((c)=>({value:c.id,label:`${c.title} (${c.platform})`}))]} value={form.linkedContent||""} onChange={(e)=>setForm(p=>({...p,linkedContent:e.target.value}))}/></div></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {(form.id?()=>{setTasks(p=>p.filter(t=>t.id!==form.id));db.deleteTask(form.id).catch(console.error);log("deleted",form.title,"Tasks");closeM()}:null)&&<Btn theme={theme} danger onClick={form.id?()=>{setTasks(p=>p.filter(t=>t.id!==form.id));db.deleteTask(form.id).catch(console.error);log("deleted",form.title,"Tasks");closeM()}:null}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{const tid=form.id||uid("t");const tdata={...form,id:tid};if(form.id){setTasks(p=>p.map(t=>t.id===form.id?tdata:t));log("updated",form.title,"Tasks")}else{setTasks(p=>[...p,tdata]);log("created",form.title,"Tasks")}db.saveTask(tdata).catch(console.error);closeM()}}>Save</Btn>
        </div>
      </div></Modal>;

      case "editResource": return <Modal theme={theme} title={form.id?"Edit Resource":"New Resource"} onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Label</Label><Input theme={theme} value={form.label||""} onChange={e=>setForm(p=>({...p,label:e.target.value}))}/></div>
        <div><Label theme={theme}>URL</Label><Input theme={theme} value={form.url||""} onChange={e=>setForm(p=>({...p,url:e.target.value}))}/></div>
        <div><Label theme={theme}>Group</Label><Sel theme={theme} options={RESOURCE_GROUPS} value={form.group||"Drives"} onChange={e=>setForm(p=>({...p,group:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {(form.id?()=>{setResources(p=>p.filter(r=>r.id!==form.id));db.deleteResource(form.id).catch(console.error);closeM()}:null)&&<Btn theme={theme} danger onClick={form.id?()=>{setResources(p=>p.filter(r=>r.id!==form.id));db.deleteResource(form.id).catch(console.error);closeM()}:null}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{const rid=form.id||uid("r");const rdata={...form,id:rid};if(form.id)setResources(p=>p.map(r=>r.id===form.id?rdata:r));else setResources(p=>[...p,rdata]);db.saveResource(rdata).catch(console.error);closeM()}}>Save</Btn>
        </div>
      </div></Modal>;

      case "editUser": return <Modal theme={theme} title={form.id?"Edit Team Member":"Add Team Member"} onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Full Name</Label><Input theme={theme} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Username</Label><Input theme={theme} value={form.username||""} onChange={e=>setForm(p=>({...p,username:e.target.value}))}/></div><div><Label theme={theme}>PIN</Label><Input theme={theme} value={form.pin||"1234"} onChange={e=>setForm(p=>({...p,pin:e.target.value}))} maxLength={6}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Role</Label><Sel theme={theme} options={ROLES} value={form.role||"Content Creator"} onChange={e=>setForm(p=>({...p,role:e.target.value}))}/></div><div><Label theme={theme}>Timezone</Label><Sel theme={theme} options={TZ_OPTIONS.map(t=>({value:t.label,label:t.label}))} value={form.tzLabel||"London"} onChange={e=>{const tz=TZ_OPTIONS.find(t=>t.label===e.target.value);setForm(p=>({...p,tzLabel:e.target.value,tz:tz?.tz||"Europe/London"}))}}/></div></div>
        <div><Label theme={theme}>Email</Label><Input theme={theme} value={form.email||""} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/></div>
        <div><Label theme={theme}>Responsibilities</Label><Input theme={theme} value={form.resp||""} onChange={e=>setForm(p=>({...p,resp:e.target.value}))}/></div>
        <div style={{borderTop:`1px solid ${theme.border}`,paddingTop:14,marginTop:4}}>
          <Label theme={theme}>Social Profiles</Label>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[["linkedin","LinkedIn"],["x","X / Twitter"],["instagram","Instagram"],["tiktok","TikTok"],["youtube","YouTube"]].map(([key,label])=>(
              <div key={key} style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:12,color:theme.textSec,width:80,flexShrink:0}}>{label}</span>
                <Input theme={theme} value={form.socials?.[key]||""} onChange={(e)=>setForm((p)=>({...p,socials:{...(p.socials||{}), [key]:e.target.value}}))} placeholder={`https://...`} style={{fontSize:13}}/>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{const uuid=form.id||uid("u");const udata={...form,id:uuid,socials:form.socials||{}};if(form.id){setUsers(p=>p.map(u=>u.id===form.id?udata:u));log("updated",form.name,"Team")}else{setUsers(p=>[...p,udata]);log("added",form.name,"Team")}db.saveUser(udata).catch(console.error);closeM()}}>Save</Btn>
        </div>
      </div></Modal>;

      case "editThemes": return <Modal theme={theme} title="Edit Weekly Themes" onClose={closeM} width={600}>
        <p style={{fontSize:13,color:theme.textSec,marginBottom:16}}>Customise the content theme for each day of the week.</p>
        {weeklyThemes.map((w,i)=>(
          <div key={w.day} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <span style={{fontWeight:600,fontSize:14,width:100,flexShrink:0}}>{w.day}</span>
            <Input theme={theme} value={w.theme} onChange={e=>{const u=[...weeklyThemes];u[i]={...w,theme:e.target.value};setWeeklyThemes(u)}}/>
            <input type="color" value={w.color} onChange={e=>{const u=[...weeklyThemes];u[i]={...w,color:e.target.value};setWeeklyThemes(u)}} style={{width:36,height:36,border:"none",borderRadius:8,cursor:"pointer",background:"none"}}/>
          </div>
        ))}
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:16,gap:10}}><Btn theme={theme} onClick={closeM}>Cancel</Btn><Btn primary theme={theme} onClick={()=>{db.saveThemes(weeklyThemes).catch(console.error);log("updated","Weekly Themes","Admin");closeM()}}>Save</Btn></div>
      </Modal>;

      case "editKeyDates": return <Modal theme={theme} title="Manage Key Dates" onClose={closeM} width={600}>
        <Btn primary theme={theme} small onClick={()=>setKeyDates(p=>[...p,{id:uid("kd"),title:"New Date",date:"2026-04-01",color:theme.teal}])} style={{marginBottom:14}}><Plus size={13}/> Add Date</Btn>
        {keyDates.map((d,i)=>(
          <div key={d.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <Input theme={theme} value={d.title} onChange={e=>{const u=[...keyDates];u[i]={...d,title:e.target.value};setKeyDates(u)}} style={{flex:1}}/>
            <Input theme={theme} type="date" value={d.date} onChange={e=>{const u=[...keyDates];u[i]={...d,date:e.target.value};setKeyDates(u)}} style={{width:160}}/>
            <input type="color" value={d.color} onChange={e=>{const u=[...keyDates];u[i]={...d,color:e.target.value};setKeyDates(u)}} style={{width:32,height:32,border:"none",borderRadius:6,cursor:"pointer"}}/>
            <button onClick={()=>setKeyDates(p=>p.filter(x=>x.id!==d.id))} style={{background:"none",border:"none",color:theme.red,cursor:"pointer"}}><Trash2 size={14}/></button>
          </div>
        ))}
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:14}}><Btn primary theme={theme} onClick={()=>{db.saveKeyDates(keyDates).catch(console.error);log("updated","Key Dates","Admin");closeM()}}>Done</Btn></div>
      </Modal>;

      case "editTargets": return <Modal theme={theme} title="Set Growth Targets" onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        {[["followers","Followers"],["newsletterSignups","Newsletter Sign-ups"],["nanuUsers","Nanu Users"],["websiteTraffic","Website Traffic"]].map(([k,l])=>(
          <div key={k}><Label theme={theme}>{l}</Label><Input theme={theme} type="number" value={form[k]||0} onChange={e=>setForm(p=>({...p,[k]:Number(e.target.value)}))}/></div>
        ))}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{const newTargets={...form};setStats(p=>{const ns={...p,targets:newTargets};db.saveStats(ns.totals,newTargets,ns.lastUpdated).catch(console.error);return ns});log("updated","Growth Targets","Stats");closeM()}}>Save</Btn>
        </div>
      </div></Modal>;

      case "editStats": return <Modal theme={theme} title="Update Stats" onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        {[["followers","Followers"],["shares","Shares"],["websiteTraffic","Website Traffic"],["newsletterSignups","Newsletter Sign-ups"]].map(([k,l])=>(
          <div key={k}><Label theme={theme}>{l}</Label><Input theme={theme} type="number" step={k==="engagement"?"0.1":"1"} value={form[k]||0} onChange={e=>setForm(p=>({...p,[k]:Number(e.target.value)}))}/></div>
        ))}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{const newTotals={...form};const newDate=new Date().toISOString().split('T')[0];setStats(p=>{const ns={...p,totals:newTotals,lastUpdated:newDate};db.saveStats(newTotals,ns.targets,newDate).catch(console.error);return ns});log('updated','Social Stats','Stats');closeM()}}>Save</Btn>
        </div>
      </div></Modal>;

      case "editIdea": return <Modal theme={theme} title={form.id?"Edit Idea":"New Idea"} onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Idea</Label><Textarea theme={theme} value={form.text||""} onChange={e=>setForm(p=>({...p,text:e.target.value}))}/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Category</Label><Sel theme={theme} options={["Video","Design","Campaign","Blog","Social","Other"]} value={form.category||"Video"} onChange={e=>setForm(p=>({...p,category:e.target.value}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={["Open","Approved","In Progress","Done","Rejected"]} value={form.status||"Open"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Votes</Label><Input theme={theme} type="number" value={form.votes||0} onChange={e=>setForm(p=>({...p,votes:Number(e.target.value)}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {(form.id?()=>{setOps(p=>({...p,ideas:p.ideas.filter(x=>x.id!==form.id)}));db.deleteIdea(form.id).catch(console.error);closeM()}:null)&&<Btn theme={theme} danger onClick={form.id?()=>{setOps(p=>({...p,ideas:p.ideas.filter(x=>x.id!==form.id)}));db.deleteIdea(form.id).catch(console.error);closeM()}:null}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{const iid=form.id||uid("i");const idata={...form,id:iid};if(form.id)setOps(p=>({...p,ideas:p.ideas.map(x=>x.id===form.id?idata:x)}));else setOps(p=>({...p,ideas:[...p.ideas,idata]}));db.saveIdea(idata).catch(console.error);closeM()}}>Save</Btn>
        </div>
      </div></Modal>;

      case "editCaption": return <Modal theme={theme} title={form.id?"Edit Caption":"New Caption"} onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Caption Text</Label><Textarea theme={theme} value={form.text||""} onChange={e=>setForm(p=>({...p,text:e.target.value}))}/></div>
        <div><Label theme={theme}>Tags (comma-separated)</Label><Input theme={theme} value={(form.tags||[]).join(", ")} onChange={e=>setForm(p=>({...p,tags:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {(form.id?()=>{setOps(p=>({...p,captions:p.captions.filter(x=>x.id!==form.id)}));db.deleteCaption(form.id).catch(console.error);closeM()}:null)&&<Btn theme={theme} danger onClick={form.id?()=>{setOps(p=>({...p,captions:p.captions.filter(x=>x.id!==form.id)}));db.deleteCaption(form.id).catch(console.error);closeM()}:null}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{const capid=form.id||uid("cap");const capdata={...form,id:capid};if(form.id)setOps(p=>({...p,captions:p.captions.map(x=>x.id===form.id?capdata:x)}));else setOps(p=>({...p,captions:[...p.captions,capdata]}));db.saveCaption(capdata).catch(console.error);closeM()}}>Save</Btn>
        </div>
      </div></Modal>;

      case "editHashtag": return <Modal theme={theme} title={form.id?"Edit Hashtags":"New Hashtag Group"} onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Group Name</Label><Input theme={theme} value={form.group||""} onChange={e=>setForm(p=>({...p,group:e.target.value}))}/></div>
        <div><Label theme={theme}>Hashtags (comma-separated)</Label><Textarea theme={theme} value={(form.tags||[]).join(", ")} onChange={e=>setForm(p=>({...p,tags:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {(form.id?()=>{setOps(p=>({...p,hashtags:p.hashtags.filter(x=>x.id!==form.id)}));db.deleteHashtag(form.id).catch(console.error);closeM()}:null)&&<Btn theme={theme} danger onClick={form.id?()=>{setOps(p=>({...p,hashtags:p.hashtags.filter(x=>x.id!==form.id)}));db.deleteHashtag(form.id).catch(console.error);closeM()}:null}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{const hid=form.id||uid("h");const hdata={...form,id:hid};if(form.id)setOps(p=>({...p,hashtags:p.hashtags.map(x=>x.id===form.id?hdata:x)}));else setOps(p=>({...p,hashtags:[...p.hashtags,hdata]}));db.saveHashtag(hdata).catch(console.error);closeM()}}>Save</Btn>
        </div>
      </div></Modal>;

      case "editMessaging": return <Modal theme={theme} title={form.id?"Edit Messaging":"New Messaging Pillar"} onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Pillar Name</Label><Input theme={theme} value={form.pillar||""} onChange={e=>setForm(p=>({...p,pillar:e.target.value}))}/></div>
        <div><Label theme={theme}>Key Message</Label><Textarea theme={theme} value={form.line||""} onChange={e=>setForm(p=>({...p,line:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {(form.id?()=>{setOps(p=>({...p,messaging:p.messaging.filter(x=>x.id!==form.id)}));db.deleteMessaging(form.id).catch(console.error);closeM()}:null)&&<Btn theme={theme} danger onClick={form.id?()=>{setOps(p=>({...p,messaging:p.messaging.filter(x=>x.id!==form.id)}));db.deleteMessaging(form.id).catch(console.error);closeM()}:null}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{const mid=form.id||uid("m");const mdata={...form,id:mid};if(form.id)setOps(p=>({...p,messaging:p.messaging.map(x=>x.id===form.id?mdata:x)}));else setOps(p=>({...p,messaging:[...p.messaging,mdata]}));db.saveMessaging(mdata).catch(console.error);closeM()}}>Save</Btn>
        </div>
      </div></Modal>;

      case "editTemplate": return <Modal theme={theme} title={form.id?"Edit Template":"New Template"} onClose={closeM} width={580}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Template Name</Label><Input theme={theme} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
        <div><Label theme={theme}>Platform</Label><Sel theme={theme} options={PLATFORMS} value={form.platform||PLATFORMS[0]} onChange={e=>setForm(p=>({...p,platform:e.target.value}))}/></div>
        <div><Label theme={theme}>Caption Template</Label><Textarea theme={theme} value={form.caption||""} onChange={e=>setForm(p=>({...p,caption:e.target.value}))} style={{minHeight:120}}/></div>
        <div><Label theme={theme}>Tags (comma-separated)</Label><Input theme={theme} value={(form.tags||[]).join(", ")} onChange={e=>setForm(p=>({...p,tags:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {(form.id?()=>{setOps(p=>({...p,templates:p.templates.filter(x=>x.id!==form.id)}));db.deleteTemplate(form.id).catch(console.error);closeM()}:null)&&<Btn theme={theme} danger onClick={form.id?()=>{setOps(p=>({...p,templates:p.templates.filter(x=>x.id!==form.id)}));db.deleteTemplate(form.id).catch(console.error);closeM()}:null}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{const tpid=form.id||uid("tp");const tpdata={...form,id:tpid};if(form.id)setOps(p=>({...p,templates:p.templates.map(x=>x.id===form.id?tpdata:x)}));else setOps(p=>({...p,templates:[...p.templates,tpdata]}));db.saveTemplate(tpdata).catch(console.error);closeM()}}>Save</Btn>
        </div>
      </div></Modal>;

      case "editCampaign": return <Modal theme={theme} title={form.id?"Edit Campaign":"New Campaign"} onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Campaign Name</Label><Input theme={theme} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
        <div><Label theme={theme}>Tag (for linking content)</Label><Input theme={theme} value={form.tag||""} onChange={e=>setForm(p=>({...p,tag:e.target.value.toLowerCase().replace(/\s+/g,"-")}))}/></div>
        <div><Label theme={theme}>Colour</Label><input type="color" value={form.color||theme.teal} onChange={e=>setForm(p=>({...p,color:e.target.value}))} style={{width:48,height:36,border:"none",borderRadius:8,cursor:"pointer"}}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {(form.id?()=>{setCampaigns(p=>p.filter(c=>c.id!==form.id));db.deleteCampaign(form.id).catch(console.error);closeM()}:null)&&<Btn theme={theme} danger onClick={form.id?()=>{setCampaigns(p=>p.filter(c=>c.id!==form.id));db.deleteCampaign(form.id).catch(console.error);closeM()}:null}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{const campid=form.id||uid("camp");const campdata={...form,id:campid};if(form.id)setCampaigns(p=>p.map(c=>c.id===form.id?campdata:c));else setCampaigns(p=>[...p,campdata]);db.saveCampaign(campdata).catch(console.error);log(form.id?"updated":"created",form.name,"Campaigns");closeM()}}>Save</Btn>
        </div>
      </div></Modal>;

      case "editNote": return <Modal theme={theme} title={form.id?"Edit Note":"New Note"} onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Note</Label><Textarea theme={theme} value={form.text||""} onChange={e=>setForm(p=>({...p,text:e.target.value}))}/></div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div><Label theme={theme}>Colour</Label><input type="color" value={form.color||theme.teal} onChange={e=>setForm(p=>({...p,color:e.target.value}))} style={{width:40,height:32,border:"none",borderRadius:6,cursor:"pointer"}}/></div>
          <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:14}}><input type="checkbox" checked={form.pinned||false} onChange={e=>setForm(p=>({...p,pinned:e.target.checked}))}/>Pin to top</label>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {(form.id?()=>{setNotes(p=>p.filter(n=>n.id!==form.id));db.deleteNote(form.id).catch(console.error);closeM()}:null)&&<Btn theme={theme} danger onClick={form.id?()=>{setNotes(p=>p.filter(n=>n.id!==form.id));db.deleteNote(form.id).catch(console.error);closeM()}:null}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{const nid=form.id||uid("n");const ndata=form.id?{...form}:{...form,id:nid,author:curUser.id,date:new Date().toISOString().split("T")[0]};if(form.id)setNotes(p=>p.map(n=>n.id===form.id?ndata:n));else setNotes(p=>[...p,ndata]);db.saveNote(ndata).catch(console.error);closeM()}}>Save</Btn>
        </div>
      </div></Modal>;

      case "editPlatform": return <Modal theme={theme} title={`Update ${form._platformName||"Platform"} Stats`} onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Followers (this week)</Label><Input theme={theme} type="number" value={form.followers||0} onChange={e=>setForm(p=>({...p,followers:Number(e.target.value)}))}/></div>
        <div><Label theme={theme}>Followers (last week)</Label><Input theme={theme} type="number" value={form.lastWeek||0} onChange={e=>setForm(p=>({...p,lastWeek:Number(e.target.value)}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{
            const name=form._platformName;
            const {_platformName,...data}=form;
            setStats(p=>({...p,platforms:{...p.platforms,[name]:data},lastUpdated:new Date().toISOString().split('T')[0]}));db.savePlatformStat(name,data).catch(console.error);
            log("updated",name+" stats","Stats");
            closeM();
          }}>Save</Btn>
        </div>
      </div></Modal>;

      case "editGrowth": return <Modal theme={theme} title="Update Nanu User Growth" onClose={closeM} width={600}>
        <p style={{fontSize:13,color:theme.textSec,marginBottom:14}}>Edit weekly user counts or add a new data point.</p>
        {(form.entries||[]).map((entry,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <Input theme={theme} value={entry.week} onChange={e=>{const u=[...(form.entries||[])];u[i]={...entry,week:e.target.value};setForm(p=>({...p,entries:u}))}} style={{flex:1}} placeholder="e.g. W3 Mar"/>
            <Input theme={theme} type="number" value={entry.users} onChange={e=>{const u=[...(form.entries||[])];u[i]={...entry,users:Number(e.target.value)};setForm(p=>({...p,entries:u}))}} style={{width:120}} placeholder="Users"/>
            <button onClick={()=>{const u=[...(form.entries||[])];u.splice(i,1);setForm(p=>({...p,entries:u}))}} style={{background:"none",border:"none",color:theme.red,cursor:"pointer"}}><Trash2 size={14}/></button>
          </div>
        ))}
        <Btn theme={theme} small onClick={()=>setForm(p=>({...p,entries:[...(p.entries||[]),{week:"W"+(p.entries||[]).length+" Mar",users:0}]}))} style={{marginTop:4,marginBottom:14}}><Plus size={13}/> Add Week</Btn>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{
            const growthEntries=form.entries||[];setStats(p=>({...p,weeklyGrowth:growthEntries,lastUpdated:new Date().toISOString().split('T')[0]}));db.saveWeeklyGrowth(growthEntries).catch(console.error);
            log("updated","Nanu User Growth","Stats");
            closeM();
          }}>Save</Btn>
        </div>
      </Modal>;

      case "editProject": return <Modal theme={theme} title={form.id?"Edit Project":"New Project"} onClose={closeM} width={580}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Project Name</Label><Input theme={theme} value={form.name||""} onChange={(e)=>setForm((p)=>({...p,name:e.target.value}))}/></div>
        <div><Label theme={theme}>Description</Label><Textarea theme={theme} value={form.description||""} onChange={(e)=>setForm((p)=>({...p,description:e.target.value}))}/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={users.map((u)=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={(e)=>setForm((p)=>({...p,owner:e.target.value}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={PROJECT_STATUSES} value={form.status||"Planning"} onChange={(e)=>setForm((p)=>({...p,status:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Colour</Label><input type="color" value={form.color||theme.teal} onChange={(e)=>setForm((p)=>({...p,color:e.target.value}))} style={{width:48,height:36,border:"none",borderRadius:8,cursor:"pointer"}}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>{setProjects(p=>p.filter(x=>x.id!==form.id));db.deleteProject(form.id).catch(console.error);log("deleted",form.name,"Projects");closeM()}}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{
            const projid=form.id||uid("proj");const projdata={...form,id:projid};if(form.id){setProjects(p=>p.map(x=>x.id===form.id?projdata:x));log("updated",form.name,"Projects")}
            else{setProjects(p=>[...p,projdata]);log("created",form.name,"Projects")}db.saveProject(projdata).catch(console.error);
            closeM();
          }}>Save</Btn>
        </div>
      </div></Modal>;

      case "editOutreach": return <Modal theme={theme} title={form.id?"Edit Outreach Contact":"New Outreach Contact"} onClose={closeM} width={580}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Name</Label><Input theme={theme} value={form.name||""} onChange={(e)=>setForm((p)=>({...p,name:e.target.value}))}/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Type</Label><Sel theme={theme} options={OUTREACH_TYPES} value={form.type||"Community"} onChange={(e)=>setForm((p)=>({...p,type:e.target.value}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={OUTREACH_STATUSES} value={form.status||"Identified"} onChange={(e)=>setForm((p)=>({...p,status:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Platform / Channel</Label><Input theme={theme} value={form.platform||""} onChange={(e)=>setForm((p)=>({...p,platform:e.target.value}))} placeholder="e.g. Podcast, Discord, YouTube"/></div><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={users.map((u)=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={(e)=>setForm((p)=>({...p,owner:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Date</Label><Input theme={theme} type="date" value={form.date||""} onChange={(e)=>setForm((p)=>({...p,date:e.target.value}))}/></div><div><Label theme={theme}>URL</Label><Input theme={theme} value={form.url||""} onChange={(e)=>setForm((p)=>({...p,url:e.target.value}))} placeholder="https://..."/></div></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={(e)=>setForm((p)=>({...p,notes:e.target.value}))} placeholder="Context, talking points, follow-up actions..."/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>{setOutreach(p=>p.filter(x=>x.id!==form.id));db.deleteOutreach(form.id).catch(console.error);log("deleted",form.name,"Outreach");closeM()}}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{
            const outid=form.id||uid("out");const outdata={...form,id:outid};if(form.id){setOutreach(p=>p.map(x=>x.id===form.id?outdata:x));log("updated",form.name,"Outreach")}
            else{setOutreach(p=>[...p,outdata]);log("created",form.name,"Outreach")}db.saveOutreach(outdata).catch(console.error);
            closeM();
          }}>Save</Btn>
        </div>
      </div></Modal>;

      case "editSocials": return <Modal theme={theme} title="Edit My Socials" onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <p style={{fontSize:13,color:theme.textSec,marginBottom:8}}>Add your social profile links so the team can find you.</p>
        {[["linkedin","LinkedIn"],["x","X / Twitter"],["instagram","Instagram"],["tiktok","TikTok"],["youtube","YouTube"]].map(([key,label])=>(
          <div key={key} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <span style={{fontSize:12,color:theme.textSec,width:80,flexShrink:0}}>{label}</span>
            <Input theme={theme} value={form.socials?.[key]||""} onChange={(e)=>setForm((p)=>({...p,socials:{...(p.socials||{}), [key]:e.target.value}}))} placeholder={`https://...`}/>
          </div>
        ))}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{
            setUsers(p=>p.map(u=>u.id===curUser.id?{...u,socials:form.socials||{}}:u));db.saveUser({...curUser,socials:form.socials||{}}).catch(console.error);
            log("updated","My Socials","Team");
            closeM();
          }}>Save</Btn>
        </div>
      </div></Modal>;

      default: return null;
    }
  };

  return (
    <div style={{display:"flex",minHeight:"100vh",background:theme.bg,fontFamily:FONT_BODY,color:theme.text}}>
      
      {/* Sidebar */}
      <div className="nanu-sidebar" style={{width:sidebar?220:58,minHeight:"100vh",background:theme.bgSidebar,borderRight:`1px solid ${theme.border}`,display:"flex",flexDirection:"column",transition:"width .2s",overflow:"hidden",flexShrink:0}}>
        <div style={{padding:sidebar?"18px 16px":"18px 10px",borderBottom:`1px solid ${theme.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <NanuLogo size={34}/>
            {sidebar&&<div className="nanu-sidebar-header-text"><div style={{fontFamily:FONT_DISPLAY,fontSize:13,fontWeight:700,color:theme.teal}}>NANU</div><div style={{fontSize:11,color:theme.textMut}}>Marketing Hub</div></div>}
          </div>
        </div>
        <nav style={{flex:1,padding:"10px 6px"}}>
          {NAV.map(n=>(
            <button key={n.key} onClick={()=>setSection(n.key)} style={{display:"flex",alignItems:"center",gap:11,width:"100%",padding:sidebar?"9px 12px":"9px 0",borderRadius:8,border:"none",cursor:"pointer",marginBottom:1,background:section===n.key?`${theme.teal}12`:"transparent",color:section===n.key?theme.teal:theme.textSec,fontFamily:FONT_BODY,fontWeight:500,fontSize:14,transition:"all .15s",justifyContent:sidebar?"flex-start":"center"}}>{n.icon}{sidebar&&<span className="nanu-sidebar-label">{n.label}</span>}
              {n.key==="tasks"&&overdue>0&&<span style={{marginLeft:"auto",background:theme.red,color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:700}}>{overdue}</span>}
            </button>
          ))}
        </nav>
        <div style={{padding:"10px 6px",borderTop:`1px solid ${theme.border}`,display:"flex",flexDirection:"column",gap:1}}>
          <button onClick={()=>setSidebar(!sidebar)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"8px 12px",borderRadius:8,border:"none",background:"transparent",color:theme.textMut,cursor:"pointer",fontSize:12,justifyContent:sidebar?"flex-start":"center"}}>{sidebar?<ChevronLeft size={16}/>:<ChevronRight size={16}/>}{sidebar&&<span className="nanu-sidebar-label">Collapse</span>}</button>
          <button onClick={()=>setDark(!dark)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"8px 12px",borderRadius:8,border:"none",background:"transparent",color:theme.textMut,cursor:"pointer",fontSize:12,justifyContent:sidebar?"flex-start":"center"}}>{dark?<Sun size={16}/>:<Moon size={16}/>}{sidebar&&<span className="nanu-sidebar-label">{dark?"Light":"Dark"}</span>}</button>
          <button onClick={()=>setCurUser(null)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"8px 12px",borderRadius:8,border:"none",background:"transparent",color:theme.textMut,cursor:"pointer",fontSize:12,justifyContent:sidebar?"flex-start":"center"}}><LogOut size={16}/>{sidebar&&<span className="nanu-sidebar-label">Sign Out</span>}</button>
        </div>
      </div>
      {/* Main */}
      <div style={{flex:1,overflow:"auto"}}>
        <div className="nanu-topbar" style={{borderBottom:`1px solid ${theme.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:theme.bgSidebar,position:"sticky",top:0,zIndex:100}}>
          <div><span style={{fontWeight:600,fontSize:15}}>Welcome back, {curUser.name.split(" ")[0]}</span><span style={{fontSize:13,color:theme.textMut,marginLeft:12}}>{new Date(2026,2,9).toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {overdue>0&&<Badge label={`${overdue} overdue`} color={theme.red}/>}
            {approvals.length>0&&<Badge label={`${approvals.length} approvals`} color={theme.yellow}/>}
            <Badge label={curUser.role} color={ROLE_COLORS[curUser.role]||theme.teal}/>
          </div>
        </div>
        <div className="nanu-main-pad">{renderSection()}</div>
      </div>
      {renderModal()}
    </div>
  );
}
