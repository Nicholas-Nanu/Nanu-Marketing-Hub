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
  Download, FolderKanban, Megaphone, Send, Linkedin, Twitter, Instagram, Youtube, Handshake,
  Share2, FileEdit, CircleDot, BookOpen, MessageCircle,
  Heart, Award, MapPin, Smile, Activity, Users2, Repeat, Briefcase, Flag
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
const ROLES = ["Admin", "Executive", "Marketing Lead", "Content Creator", "Designer", "Social Media Manager"];
const ROLE_COLORS = { Admin: "#FF6B6B", Executive: "#FFD43B", "Marketing Lead": "#FFA94D", "Content Creator": "#82F9F6", Designer: "#DA77F2", "Social Media Manager": "#748FFC" };
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
const PLATFORM_LIMITS = {
  "LinkedIn": { max: 3000, warn: 2800, truncate: 150, color: "#0A66C2", bg: "#F3F6F8", textColor: "#000000", handle: "Nanu", avatar: "N" },
  "X / Twitter": { max: 280, warn: 250, truncate: 280, color: "#000000", bg: "#FFFFFF", textColor: "#0F1419", handle: "@NanuApp", avatar: "N" },
  "Instagram": { max: 2200, warn: 2000, truncate: 125, color: "#E4405F", bg: "#FAFAFA", textColor: "#262626", handle: "nanuapp", avatar: "N" },
  "TikTok": { max: 2200, warn: 2000, truncate: 150, color: "#000000", bg: "#121212", textColor: "#FFFFFF", handle: "@nanuapp", avatar: "N" },
  "Facebook": { max: 63206, warn: 500, truncate: 477, color: "#1877F2", bg: "#F0F2F5", textColor: "#050505", handle: "Nanu", avatar: "N" },
  "YouTube": { max: 5000, warn: 4800, truncate: 100, color: "#FF0000", bg: "#FFFFFF", textColor: "#030303", handle: "Nanu", avatar: "N" },
  "Reddit": { max: 40000, warn: 10000, truncate: 300, color: "#FF4500", bg: "#1A1A1B", textColor: "#D7DADC", handle: "u/NanuApp", avatar: "N" },
  "Nanu App": { max: 10000, warn: 5000, truncate: 200, color: "#1FC2C2", bg: "#0D1B21", textColor: "#E2F0F0", handle: "Nanu", avatar: "N" },
};
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
  { id:"t1", title:"Finalise Ambassador Programme tracker", owners:["u5"], dueDate:"2026-03-10", status:"In Progress", blocker:"", priority:"High", notes:"Master Excel tracker needs final column for engagement metrics. Ed has the latest version — check with him before updating.", linkedContent:"", project:"proj1", updates:[] },
  { id:"t2", title:"Create podcast one-pager for Traci (Total Conundrum)", owners:["u2"], dueDate:"2026-03-09", status:"Overdue", blocker:"", priority:"Urgent", notes:"Traci specifically requested a one-pager. Keep it concise: what Nanu is, Nicholas's story, key talking points, and a media kit link.", linkedContent:"", project:"proj3", updates:[] },
  { id:"t3", title:"Design Founding Community badge variants", owners:["u3"], dueDate:"2026-03-12", status:"In Progress", blocker:"", priority:"Medium", notes:"Four badge variants needed for Alex to implement. Reference the brand guide for colour palette. Dark and light versions of each.", linkedContent:"", project:"", updates:[] },
  { id:"t4", title:"Draft The Signal brand launch post", owners:["u4"], dueDate:"2026-03-14", status:"Not Started", blocker:"", priority:"High", notes:"Use the Signal Broadcast logo mark. Tagline: 'News through every lens · by Nanu'. Tease the lens ratings system without giving too much away.", linkedContent:"c10", project:"proj2", updates:[] },
  { id:"t5", title:"Follow up with Joel on Buildathon commitments", owners:["u2"], dueDate:"2026-03-11", status:"In Progress", blocker:"Waiting on Joel's response", priority:"High", notes:"Joel still owes: announcement copy, mentor/judge bench, brand assets, and distribution channels. Chase via email and WhatsApp.", linkedContent:"c7", project:"proj3", updates:[] },
  { id:"t6", title:"UApedia follow-up", owners:["u2"], dueDate:"2026-03-13", status:"Not Started", blocker:"", priority:"Low", notes:"Pending task flagged for Holly. Check status of the collaboration discussion.", linkedContent:"", project:"proj3", updates:[] },
  { id:"t7", title:"Prepare Vanessa Rogers podcast brief", owners:["u1"], dueDate:"2026-03-20", status:"Not Started", blocker:"", priority:"Medium", notes:"Fabric of Folklore — April Calendly confirmed. Prepare talking points around Nanu's Myths & History category.", linkedContent:"", project:"proj3", updates:[] },
  { id:"t8", title:"Weekly content calendar sign-off", owners:["u2"], dueDate:"2026-03-09", status:"Needs Approval", blocker:"", priority:"Medium", notes:"Review all scheduled posts for W2 March. Check captions, platforms, and publish times are correct before approving.", linkedContent:"", project:"", updates:[] },
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
  { id:"proj1", name:"Ambassador Programme", description:"Recruit, onboard, and manage community ambassadors with playbooks, invite codes, and content templates.", color:"#69DB7C", owner:"u5", status:"Active", members:["u2"], notes:"Ed leading recruitment. Playbook v1 drafted. Need to finalise tracking spreadsheet and invite code system.", links:[{label:"Ambassador Hub",url:"https://nanu-ambassador-hub.vercel.app"},{label:"Playbook Draft",url:"https://drive.google.com"}], private:false },
  { id:"proj2", name:"The Signal Launch", description:"Full launch campaign for nanu-signal.com — brand teaser, editorial pipeline, RSS backend, and social rollout.", color:"#1FC2C2", owner:"u4", status:"Active", members:["u1","u2"], notes:"14-day phased implementation plan established. Jacob on frontend, Alex on Azure backend. RSS feed list compiled (161+ feeds).", links:[{label:"Signal Site",url:"https://nanu-signal.com"},{label:"RSS Feed List",url:"https://drive.google.com"},{label:"Brand Assets",url:"https://drive.google.com"}], private:false },
  { id:"proj3", name:"Partnerships & Outreach", description:"Podcast circuit, community collaborations, event appearances, and micro-creator programme.", color:"#DA77F2", owner:"u2", status:"Active", members:["u1","u5"], notes:"Susan handling 3-5 orgs/week. Vanessa Rogers confirmed for April. Traci one-pager needed. James Fox X Space 20 March.", links:[{label:"Outreach Tracker",url:"https://drive.google.com"},{label:"Partner Kit",url:"https://drive.google.com"}], private:false },
  { id:"proj4", name:"Nanu Orbis", description:"Monthly members-only live event — production, promotion, and post-event content.", color:"#FFA94D", owner:"u2", status:"Planning", members:["u1","u3"], notes:"First show: April 9th. Comms schedule from March 23rd. Streaming platform decision pending (Zoom discussed). Nicholas and Holly co-host, Sean handles intro.", links:[], private:false },
];

const PROJECT_STATUSES = ["Planning", "Active", "Paused", "Complete"];
const PROJECT_STATUS_COLORS = { Planning:"#748FFC", Active:"#69DB7C", Paused:"#FFA94D", Complete:"#4E6A78" };

const OUTREACH_TYPES = ["Community", "Influencer", "Content Creator", "Organisation"];
const OUTREACH_STATUSES = ["Identified", "Contacted", "In Conversation", "Confirmed", "Declined", "Complete"];
const OUTREACH_STATUS_COLORS = { Identified:"#748FFC", Contacted:"#FFA94D", "In Conversation":"#DA77F2", Confirmed:"#69DB7C", Declined:"#FF6B6B", Complete:"#4E6A78" };

const INIT_OUTREACH = [
  { id:"out1", name:"Vanessa Y. Rogers", type:"Content Creator", platform:"Podcast — Fabric of Folklore", status:"Confirmed", owner:"u1", notes:"April Calendly confirmed. Prepare talking points around Myths & History.", url:"", date:"2026-04-15", contactName:"Vanessa Y. Rogers", contactEmail:"", linkedTasks:[] },
  { id:"out2", name:"Traci — Total Conundrum", type:"Content Creator", platform:"Podcast", status:"In Conversation", owner:"u2", notes:"One-pager requested. Waiting on scheduling.", url:"", date:"", contactName:"Traci", contactEmail:"", linkedTasks:[] },
  { id:"out3", name:"The Activity Continues", type:"Content Creator", platform:"Podcast", status:"Contacted", owner:"u2", notes:"Registration done. Awaiting response.", url:"", date:"" , contactName:"", contactEmail:"", linkedTasks:[] },
  { id:"out4", name:"James Fox", type:"Influencer", platform:"X / Twitter", status:"In Conversation", owner:"u1", notes:"X Space co-hosting event planned for 20 March.", url:"", date:"2026-03-20" , contactName:"", contactEmail:"", linkedTasks:[] },
  { id:"out5", name:"Nathan Cole — UAPWatch", type:"Community", platform:"Discord / YouTube", status:"In Conversation", owner:"u5", notes:"Potential cross-community collaboration.", url:"", date:"" , contactName:"", contactEmail:"", linkedTasks:[] },
  { id:"out6", name:"Nick Cook Event", type:"Organisation", platform:"In-person (London)", status:"Confirmed", owner:"u1", notes:"Invite-only. April. Nicholas attending.", url:"", date:"2026-04-20" , contactName:"", contactEmail:"", linkedTasks:[] },
  { id:"out7", name:"Reddit AMA", type:"Community", platform:"Reddit", status:"Identified", owner:"u4", notes:"Plan to announce Communities feature via AMA.", url:"", date:"" , contactName:"", contactEmail:"", linkedTasks:[] },
];

/* UID HELPER */
let _uid = Date.now();
const uid = (p = "x") => `${p}${_uid++}`;

/* ═══ PARTNERSHIPS ═══ */
const PARTNERSHIP_TYPES = ["Organisation / Institution", "Event / Conference", "Technology / Platform", "Research / Academic"];
const PARTNERSHIP_STATUSES = ["Lead / Prospect", "Contacted", "In Discussion", "Agreement Pending", "Active Partner", "Paused", "Ended"];
const PARTNERSHIP_STATUS_COLORS = { "Lead / Prospect":"#748FFC", Contacted:"#FFA94D", "In Discussion":"#DA77F2", "Agreement Pending":"#FFD43B", "Active Partner":"#69DB7C", Paused:"#4E6A78", Ended:"#FF6B6B" };
const PARTNERSHIP_TYPE_COLORS = { "Organisation / Institution":"#1FC2C2", "Event / Conference":"#FFA94D", "Technology / Platform":"#748FFC", "Research / Academic":"#DA77F2" };

const INIT_PARTNERSHIPS = [
  { id:"part1", name:"SETI Institute", description:"Potential integration of SETI data into Nanu or white-label contract. Bill Diamond & Simon Steel contacts.", type:"Research / Academic", status:"In Discussion", owner:"u1", contactName:"Bill Diamond", contactEmail:"", value:"Data integration or white-label platform contract. Outcome expected May; implementation mid-late June if approved.", startDate:"2026-02-01", reviewDate:"2026-05-15", linkedOutreach:"", linkedTasks:[], links:[{label:"Proposal Doc",url:"https://drive.google.com"}], updates:[{author:"u1",text:"Initial meeting went well. Follow-up scheduled for May.",time:"2026-03-10 14:00"}] },
  { id:"part2", name:"Interesting Engineering", description:"White-label partnership being explored by Steve. Concept design phase.", type:"Technology / Platform", status:"Lead / Prospect", owner:"u1", contactName:"Steve", contactEmail:"", value:"White-label deal — Nanu platform powering their anomalous content section.", startDate:"2026-03-01", reviewDate:"2026-06-01", linkedOutreach:"", linkedTasks:[], links:[], updates:[] },
  { id:"part3", name:"BlueLine Security", description:"Cybersecurity partner for platform security audit and ongoing monitoring.", type:"Technology / Platform", status:"In Discussion", owner:"u1", contactName:"Pash", contactEmail:"", value:"Cybersecurity scoping for SETI partnership implementation and general platform security.", startDate:"2026-03-15", reviewDate:"2026-04-30", linkedOutreach:"", linkedTasks:[], links:[], updates:[] },
  { id:"part4", name:"Future Folklore", description:"Virtual 4-day build sprint (Buildathon). Requires confirmed deliverables from Joel.", type:"Event / Conference", status:"Agreement Pending", owner:"u2", contactName:"Joel", contactEmail:"", value:"Cross-community activation, content generation, and brand awareness via collaborative build event.", startDate:"2026-03-01", reviewDate:"2026-04-15", linkedOutreach:"", linkedTasks:[], links:[], updates:[{author:"u2",text:"Joel still owes announcement copy, mentor bench, brand assets, distribution channels.",time:"2026-03-08 11:00"}] },
  { id:"part5", name:"UAP Check", description:"Collaboration with Michaël Vaillant on UAP data verification tooling.", type:"Research / Academic", status:"Contacted", owner:"u1", contactName:"Michaël Vaillant", contactEmail:"", value:"Shared verification methodology and potential data exchange.", startDate:"2026-03-10", reviewDate:"2026-05-01", linkedOutreach:"", linkedTasks:[], links:[], updates:[] },
];

/* ═══ COMMUNITY ENGAGEMENT ═══ */
const AMBASSADOR_STATUS = ["Applied","Onboarding","Active","Inactive","Alumni"];
const AMBASSADOR_STATUS_COLORS = { Applied:"#748FFC", Onboarding:"#FFA94D", Active:"#69DB7C", Inactive:"#4E6A78", Alumni:"#DA77F2" };
const CHANNEL_PLATFORMS = ["Discord","Reddit","Telegram","Facebook Group","Instagram","X / Twitter","TikTok","YouTube","Forum","Other"];
const COMM_EVENT_TYPES = ["Meetup","AMA","Live Stream","Nanu Orbis","Workshop","Watch Party","Online Event"];
const COMM_EVENT_STATUS = ["Planned","Confirmed","Live","Completed","Cancelled"];
const COMM_EVENT_STATUS_COLORS = { Planned:"#748FFC", Confirmed:"#FFA94D", Live:"#69DB7C", Completed:"#4E6A78", Cancelled:"#FF6B6B" };
const FEEDBACK_TYPES = ["Bug Report","Feature Request","General Feedback","Complaint","Praise","Question"];
const FEEDBACK_SENTIMENT = ["Positive","Neutral","Negative"];
const FEEDBACK_SENTIMENT_COLORS = { Positive:"#69DB7C", Neutral:"#FFA94D", Negative:"#FF6B6B" };
const FEEDBACK_STATUS = ["New","Reviewed","In Progress","Resolved","Won't Fix"];

const INIT_AMBASSADORS = [
  { id:"amb1", name:"", email:"", platform:"", followers:0, status:"Active", joinDate:"", region:"", focus:"UAP", inviteCode:"", referrals:0, notes:"", links:[] },
];
const INIT_CHANNELS = [
  { id:"ch1", name:"r/UFOs", platform:"Reddit", url:"https://reddit.com/r/UFOs", members:3200000, status:"Monitoring", priority:"High", owner:"u4", lastEngaged:"", notes:"Largest UAP community. Engage thoughtfully, avoid self-promotion." },
  { id:"ch2", name:"r/HighStrangeness", platform:"Reddit", url:"https://reddit.com/r/HighStrangeness", members:380000, status:"Monitoring", priority:"High", owner:"u4", lastEngaged:"", notes:"Open-minded community, very aligned with Nanu's broader scope." },
  { id:"ch3", name:"Nanu Discord", platform:"Discord", url:"", members:0, status:"Planned", priority:"High", owner:"u4", lastEngaged:"", notes:"Official Discord to launch alongside platform expansion." },
];
const INIT_COMM_EVENTS = [
  { id:"ev1", title:"Nanu Orbis Monthly Briefing", type:"Nanu Orbis", date:"", time:"19:00", duration:60, status:"Planned", host:"u1", platform:"In-app live", expectedAttendees:0, actualAttendees:0, description:"Monthly Open Reality Briefing & Inquiry Session for Nanu users", recording:"", notes:"" },
];
const INIT_FEEDBACK = [
  { id:"fb1", source:"In-app", user:"", contact:"", type:"Feature Request", sentiment:"Positive", text:"", date:"", status:"New", owner:"", response:"", tags:[] },
];

/* ═══ RESPONSIBILITIES ═══ */
const RESP_CADENCES = ["Daily","Weekly","Fortnightly","Monthly","Quarterly","Continuous"];
const RESP_CADENCE_DAYS = { Daily:1, Weekly:7, Fortnightly:14, Monthly:30, Quarterly:91, Continuous:0 };
const RESP_CADENCE_COLORS = { Daily:"#FF6B6B", Weekly:"#1FC2C2", Fortnightly:"#22B8CF", Monthly:"#748FFC", Quarterly:"#DA77F2", Continuous:"#69DB7C" };
const RESP_AREAS = ["Content","Community","Marketing","Product","Operations","Partnerships","Finance","Leadership","Other"];
const RESP_STATUS = ["Active","Paused"];

// Advance a date string by a cadence interval
function advanceDate(dateStr, cadence) {
  if (!dateStr || cadence === "Continuous") return "";
  const d = new Date(dateStr + "T00:00:00");
  const days = RESP_CADENCE_DAYS[cadence] || 0;
  if (cadence === "Monthly") d.setMonth(d.getMonth() + 1);
  else if (cadence === "Quarterly") d.setMonth(d.getMonth() + 3);
  else d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

const INIT_RESPONSIBILITIES = [
  { id:"resp1", title:"Run Nanu Live (Thursday livestream)", description:"Host and prep the weekly Thursday livestream.", owner:"u3", area:"Content", cadence:"Weekly", status:"Active", anchorDate:"", nextDue:"", lastDone:"", color:"#1FC2C2", linkedTasks:[], notes:"" },
  { id:"resp2", title:"Monitor & engage r/UFOs and r/HighStrangeness", description:"Daily community engagement, thoughtful replies, no self-promo.", owner:"u4", area:"Community", cadence:"Daily", status:"Active", anchorDate:"", nextDue:"", lastDone:"", color:"#FF6B6B", linkedTasks:[], notes:"" },
  { id:"resp3", title:"Ambassador programme check-ins", description:"Review ambassador activity, send playbook updates.", owner:"u5", area:"Community", cadence:"Weekly", status:"Active", anchorDate:"", nextDue:"", lastDone:"", color:"#1FC2C2", linkedTasks:[], notes:"" },
];

/* ═══ BUSINESS (Admin + Executive only) ═══ */
const INVESTOR_STAGES = ["Researching","Intro Needed","Contacted","Meeting Booked","In Diligence","Term Sheet","Committed","Passed"];
const INVESTOR_STAGE_COLORS = { Researching:"#4E6A78", "Intro Needed":"#748FFC", Contacted:"#22B8CF", "Meeting Booked":"#FFA94D", "In Diligence":"#DA77F2", "Term Sheet":"#FFD43B", Committed:"#69DB7C", Passed:"#FF6B6B" };
const INVESTOR_TYPES = ["Angel","Pre-Seed Fund","Seed Fund","VC","Strategic / Corporate","Accelerator","Grant","Other"];
const BOARD_UPDATE_STATUS = ["Draft","In Review","Sent"];
const BOARD_UPDATE_STATUS_COLORS = { Draft:"#4E6A78", "In Review":"#FFA94D", Sent:"#69DB7C" };
const INITIATIVE_STATUS = ["Not Started","On Track","At Risk","Off Track","Achieved","Dropped"];
const INITIATIVE_STATUS_COLORS = { "Not Started":"#4E6A78", "On Track":"#69DB7C", "At Risk":"#FFA94D", "Off Track":"#FF6B6B", Achieved:"#1FC2C2", Dropped:"#6B7280" };
const INITIATIVE_HORIZONS = ["This Quarter","Next Quarter","This Year","Long Term"];

/* ═══ BUSINESS DOCUMENTS ═══ */
const DOC_CATEGORIES = ["Legal","Financial","Investor","Board","IP & Trademarks","HR & Contracts","Insurance","Compliance","Other"];
const DOC_STATUS = ["Draft","In Review","Final","Signed","Expired","Archived"];
const DOC_STATUS_COLORS = { Draft:"#4E6A78", "In Review":"#FFA94D", Final:"#1FC2C2", Signed:"#69DB7C", Expired:"#FF6B6B", Archived:"#6B7280" };

/* ═══ COMPANY STRUCTURE (from Company Structure & Departmental Workflow) ═══ */
const NANU_DEPARTMENTS = ["Business Development","Marketing and Advertising","Media and Content","Business Operations","Development","Partnerships and Outreach","Community Engagement","Advisory","Governance"];
const DEPT_COLORS = { "Business Development":"#FFD43B", "Marketing and Advertising":"#FFA94D", "Media and Content":"#DA77F2", "Business Operations":"#22B8CF", "Development":"#1FC2C2", "Partnerships and Outreach":"#69DB7C", "Community Engagement":"#82F9F6", "Advisory":"#BDA177", "Governance":"#748FFC" };
const MEETING_TYPES = ["Exec","All-hands","Marketing","Dev","Community","Media","Partnerships","Other"];
const MEETING_TYPE_COLORS = { Exec:"#FFD43B", "All-hands":"#1FC2C2", Marketing:"#FFA94D", Dev:"#22B8CF", Community:"#82F9F6", Media:"#DA77F2", Partnerships:"#69DB7C", Other:"#6B7280" };
const MACTION_STATUS = ["Open","In progress","Done","Dropped"];
const MACTION_STATUS_COLORS = { Open:"#FF6B6B", "In progress":"#FFA94D", Done:"#69DB7C", Dropped:"#6B7280" };

/* Pull action items out of a pasted Read.ai (or similar) meeting summary.
   Looks for an "Action Items" heading, then takes the bullet/numbered lines under it. */
function parseActionItems(text){
  if(!text) return [];
  const lines = text.split("\n");
  const headingRe = /^\s*(#+\s*)?\**\s*(action items?|actions|next steps|to ?dos?|follow[- ]ups?)\s*\**\s*:?\s*$/i;
  const otherHeadingRe = /^\s*(#+\s*)?\**\s*(summary|topics?|key questions?|overview|attendees|transcript|chapters?|highlights?|decisions?)\s*\**\s*:?\s*$/i;
  const bulletRe = /^\s*(?:[-*•·–]|\d+[.)])\s+(.*)$/;
  let inSection = false;
  const out = [];
  for(const raw of lines){
    const line = raw.replace(/\r/g,"");
    if(headingRe.test(line)){ inSection = true; continue; }
    if(inSection && otherHeadingRe.test(line)) { inSection = false; continue; }
    if(!inSection) continue;
    const m = line.match(bulletRe);
    if(m && m[1].trim()) out.push(m[1].trim().replace(/\*\*/g,""));
  }
  // Fallback: no heading found, take every bullet that reads like an assignment
  if(out.length===0){
    for(const raw of lines){
      const m = raw.match(bulletRe);
      if(m && /\b(to|will|should|needs? to|is going to)\b/i.test(m[1])) out.push(m[1].trim().replace(/\*\*/g,""));
    }
  }
  return out;
}

const RM_BUCKETS = ["Requested","Now","Next","Later","Shipped","Parked"];
const RM_BOARD_BUCKETS = ["Now","Next","Later"];
const RM_BUCKET_COLORS = { Requested:"#748FFC", Now:"#69DB7C", Next:"#FFA94D", Later:"#4E6A78", Shipped:"#1FC2C2", Parked:"#6B7280" };
const RM_BUCKET_BLURB = { Now:"Being built or up next in the queue", Next:"Committed, not started", Later:"Agreed direction, no date yet" };
const RM_AREAS = ["App","Platform","Archive","Website","Infrastructure","Design","Other"];
const RM_EFFORT = ["S","M","L","XL"];
const RM_PRIORITY = ["Critical","High","Medium","Low"];
const RM_PRIORITY_COLORS = { Critical:"#FF6B6B", High:"#FFA94D", Medium:"#FFD43B", Low:"#6B7280" };
const PHASE_ACTION_STATUS = ["Not started","In progress","Blocked","Done"];
const PHASE_ACTION_STATUS_COLORS = { "Not started":"#4E6A78", "In progress":"#FFA94D", Blocked:"#FF6B6B", Done:"#69DB7C" };
const UNIT_STATUS = ["Active","Partial","Open","Inactive"];
const UNIT_STATUS_COLORS = { Active:"#69DB7C", Partial:"#FFA94D", Open:"#FF6B6B", Inactive:"#6B7280" };
const UNIT_LAYERS = ["Governance","Executive","Department","Function","Sub"];

// Access & backup register — records WHO HOLDS access, never the credentials themselves.
const ACCESS_STATUS = ["No backup","Confirm","Unclear","Covered"];
const ACCESS_STATUS_COLORS = { "No backup":"#FF6B6B", Confirm:"#FFA94D", Unclear:"#FFD43B", Covered:"#69DB7C" };

const SEAT_STATUS = ["Open","Interim covered","Recruiting","Filled"];
const SEAT_STATUS_COLORS = { Open:"#FF6B6B", "Interim covered":"#FFA94D", Recruiting:"#748FFC", Filled:"#69DB7C" };
const SEAT_URGENCY = ["Critical","High","Medium","Low"];
const SEAT_URGENCY_COLORS = { Critical:"#FF6B6B", High:"#FFA94D", Medium:"#FFD43B", Low:"#6B7280" };

const MOC_STATUS = ["Operating","Partially operating","Reduced capability","Not operating"];
const MOC_STATUS_COLORS = { Operating:"#69DB7C", "Partially operating":"#FFA94D", "Reduced capability":"#FF6B6B", "Not operating":"#6B7280" };

/* ═══ MEDIA & CONTENT ═══ */
const MEDIA_STAGES = ["Idea","Researching","Scripting","Recording","Editing","Review","Scheduled","Published"];
const MEDIA_STAGE_COLORS = { Idea:"#4E6A78", Researching:"#748FFC", Scripting:"#22B8CF", Recording:"#FFA94D", Editing:"#DA77F2", Review:"#FFD43B", Scheduled:"#82F9F6", Published:"#69DB7C" };
const MEDIA_FUNCTIONS = ["Creation and Research","Scripting","Design and Graphics","Recording and Hosting","Editing and Post","Admin and Coordination","Distribution and Scheduling"];
const MEDIA_FORMATS = ["Short-form video","Long-form video","Podcast","Livestream","Written","Mixed"];
const MEDIA_CADENCES = ["Daily","Weekly","Fortnightly","Monthly","Ad-hoc"];
const IDEA_STATUS = ["New","Under review","Accepted","Parked","Declined"];
const IDEA_STATUS_COLORS = { New:"#748FFC", "Under review":"#FFA94D", Accepted:"#69DB7C", Parked:"#6B7280", Declined:"#FF6B6B" };
const MFEEDBACK_TYPES = ["Suggestion","Praise","Concern","Question"];
const MFEEDBACK_TYPE_COLORS = { Suggestion:"#748FFC", Praise:"#69DB7C", Concern:"#FFA94D", Question:"#22B8CF" };
const MFEEDBACK_STATUS = ["New","Read","Actioned","Closed"];
const TOOL_CATEGORIES = ["Design","Video","Audio","Scheduling","Storage","Research","Writing","Analytics","Other"];
const TOOL_STATUS = ["In use","Trialling","Requested","Retired"];
const TOOL_STATUS_COLORS = { "In use":"#69DB7C", Trialling:"#FFA94D", Requested:"#748FFC", Retired:"#6B7280" };
const DESIGN_STATUS = ["Not started","In progress","Ready","Not needed"];
const DESIGN_STATUS_COLORS = { "Not started":"#FF6B6B", "In progress":"#FFA94D", Ready:"#69DB7C", "Not needed":"#6B7280" };
const GUEST_STATUS = ["Approached","Confirmed","Recorded","Published","Declined"];
const GUEST_STATUS_COLORS = { Approached:"#748FFC", Confirmed:"#FFA94D", Recorded:"#DA77F2", Published:"#69DB7C", Declined:"#6B7280" };
// How long an item may sit in a stage before it's flagged
const STAGE_STALE_DAYS = { Idea:21, Researching:10, Scripting:7, Recording:7, Editing:7, Review:3, Scheduled:14, Published:9999 };

/* ═══ FOCUS GROUPS ═══ */
const FG_ROUND_STATUS = ["Planning","Recruiting","In Progress","Analysing","Complete"];
const FG_ROUND_STATUS_COLORS = { Planning:"#4E6A78", Recruiting:"#748FFC", "In Progress":"#FFA94D", Analysing:"#DA77F2", Complete:"#69DB7C" };
// Traffic light system for participants
const FG_PARTICIPANT_STATUS = ["Not Sent","Sent","Received Back","Accepted Invite"];
const FG_STATUS_COLORS = { "Not Sent":"#FF6B6B", Sent:"#FFD43B", "Received Back":"#69DB7C", "Accepted Invite":"#4DABF7" };
const FG_STATUS_HINT = { "Not Sent":"Red — nothing sent yet", Sent:"Yellow — invite/survey sent", "Received Back":"Green — response received", "Accepted Invite":"Blue — accepted, ready to book" };
const FG_ASSET_TYPES = ["Survey","Invitation","Consent Form","Brief","Response","Other"];
const FG_CHANNEL_STATUS = ["Pending","Identified","Approved","Declined"];
const FG_CHANNEL_STATUS_COLORS = { Pending:"#FFA94D", Identified:"#748FFC", Approved:"#69DB7C", Declined:"#FF6B6B" };

/* ═══ DEADLINE FADE (reusable for any time-sensitive thing) ═══ */
function hexToRgb(h){ const s=h.replace("#",""); return [parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16)]; }
function rgbToHex(r,g,b){ return "#"+[r,g,b].map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,"0")).join(""); }
function lerpColor(a,b,t){ const A=hexToRgb(a),B=hexToRgb(b); return rgbToHex(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+(B[2]-A[2])*t); }
// ratio: 1 = plenty of time, 0 = deadline. Fades teal -> yellow -> red.
function deadlineColor(ratio){
  const r=Math.max(0,Math.min(1,ratio));
  if(r>0.5) return lerpColor("#FFD43B","#1FC2C2",(r-0.5)/0.5);
  return lerpColor("#FF6B6B","#FFD43B",r/0.5);
}
function daysBetween(a,b){ return Math.round((new Date(b+"T00:00:00")-new Date(a+"T00:00:00"))/86400000); }

// Format a stored 24-hour "HH:MM" string as 12-hour with am/pm
function fmt12(hhmm){
  if(!hhmm || !/^\d{1,2}:\d{2}/.test(hhmm)) return hhmm || "";
  const [h,m] = hhmm.split(":");
  const hr = parseInt(h,10);
  const suffix = hr < 12 ? "am" : "pm";
  const h12 = hr % 12 === 0 ? 12 : hr % 12;
  return `${h12}:${m}${suffix}`;
}

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
  rtf += "\\line\\cf3\\fs18 Exported from Nanu Team Hub \\bullet  " + new Date().toLocaleDateString("en-GB");
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

/* Reusable timeline: one cell per day, colour fades toward the deadline.
   Past days are dimmed, today is ringed. Buckets into weeks if the span is long. */
const DeadlineTimeline = ({ theme, startDate, endDate, label }) => {
  if (!startDate || !endDate) return null;
  const total = daysBetween(startDate, endDate);
  if (total <= 0) return null;
  const today = new Date().toISOString().split("T")[0];
  const elapsed = daysBetween(startDate, today);
  const remaining = daysBetween(today, endDate);
  const bucket = total > 45 ? 7 : 1;
  const cells = [];
  for (let d = 0; d <= total; d += bucket) {
    const cellDate = new Date(new Date(startDate + "T00:00:00").getTime() + d * 86400000).toISOString().split("T")[0];
    const ratio = 1 - (d / total);
    const past = cellDate < today;
    const isToday = bucket === 1 ? cellDate === today : (cellDate <= today && daysBetween(cellDate, today) < bucket);
    cells.push({ cellDate, ratio, past, isToday });
  }
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
        <span style={{ fontSize:10, color:theme.textMut, fontWeight:600, textTransform:"uppercase", letterSpacing:".04em" }}>{label || "Timeline"}</span>
        <span style={{ fontSize:11, fontFamily:FONT_MONO, color: remaining < 0 ? theme.red : deadlineColor(remaining / total), fontWeight:700 }}>
          {remaining < 0 ? `${Math.abs(remaining)}d overdue` : remaining === 0 ? "Due today" : `${remaining}d left`}
        </span>
      </div>
      <div style={{ display:"flex", gap:2, alignItems:"flex-end" }}>
        {cells.map((c, i) => (
          <div key={i} title={c.cellDate}
            style={{
              flex:1, height: c.isToday ? 16 : 10, borderRadius:2,
              background: c.past ? theme.border : deadlineColor(c.ratio),
              opacity: c.past ? 0.45 : 1,
              outline: c.isToday ? `2px solid ${theme.text}` : "none",
              outlineOffset: c.isToday ? 1 : 0,
              transition:"all .3s"
            }}/>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
        <span style={{ fontSize:10, fontFamily:FONT_MONO, color:theme.textMut }}>{startDate}</span>
        <span style={{ fontSize:10, fontFamily:FONT_MONO, color:theme.textMut }}>{endDate}</span>
      </div>
    </div>
  );
};

const SectionHead = ({ theme, children, right }) => (
  <div className="nanu-section-head" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:10 }}>
    <h2 style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:20, color:theme.text, margin:0 }}>{children}</h2>
    {right && <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>{right}</div>}
  </div>
);

const Modal = ({ theme, title, onClose, children, width=540 }) => (
  <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,.55)", backdropFilter:"blur(4px)" }}>
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
    const u = users.find(x => x.username.toLowerCase() === username.toLowerCase().trim() && x.pin === pin && x.active !== false);
    if (u) { onLogin(u); setError(""); } else setError("Invalid username or PIN");
  };
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0D1B21", fontFamily:FONT_BODY, backgroundImage:"radial-gradient(ellipse at 20% 80%, rgba(31,194,194,.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(130,249,246,.04) 0%, transparent 60%)" }}>
      
      <div style={{ width:400, padding:44, borderRadius:20, background:"#172329", border:"1px solid #253840", boxShadow:"0 16px 64px rgba(0,0,0,.4)" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}><NanuLogo size={52}/></div>
          <h1 style={{ fontFamily:FONT_DISPLAY, fontSize:24, fontWeight:800, color:"#E4EDF1", margin:"0 0 6px" }}>Team Hub</h1>
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
  // 12-hour clock with am/pm — easier to read at a glance than 24-hour
  const getTime = tz => { try { return now.toLocaleTimeString("en-US",{timeZone:tz,hour:"numeric",minute:"2-digit",hour12:true}).toLowerCase(); } catch { return "--:--"; }};
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
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [navEdit, setNavEdit] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [calView, setCalView] = useState("month");
  const [calMonth, setCalMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [calEventFilter, setCalEventFilter] = useState("All");
  const [calPersonFilter, setCalPersonFilter] = useState("mine");
  const [taskView, setTaskView] = useState("mine");
  const [masterGroupBy, setMasterGroupBy] = useState("member");
  const [bulkSelected, setBulkSelected] = useState([]);
  const [bulkReassignTo, setBulkReassignTo] = useState("");  const [tfProject, setTfProject] = useState("All");
  const [tfPriority, setTfPriority] = useState("All");
  const [tfStatus, setTfStatus] = useState("All");
  const [tfPerson, setTfPerson] = useState("All");
  const [tfDue, setTfDue] = useState("All");
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
  const [outreachUserFilter, setOutreachUserFilter] = useState("All");
  const [partnerships, setPartnerships] = useState([]);
  const [partFilter, setPartFilter] = useState("All");
  const [partStatusFilter, setPartStatusFilter] = useState("All");
  const [wsTab, setWsTab] = useState("todos");
  const [workspace, setWorkspace] = useState({ todos:[], notes:[], bookmarks:[], goals:[], drafts:[] });
  const [previewItem, setPreviewItem] = useState(null);
  const [pallyyKey, setPallyyKey] = useState(0);
  const [ambassadors, setAmbassadors] = useState([]);
  const [commChannels, setCommChannels] = useState([]);
  const [commEvents, setCommEvents] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [engagement, setEngagement] = useState({});
  const [responsibilities, setResponsibilities] = useState([]);
  const [bizMetrics, setBizMetrics] = useState({});
  const [investors, setInvestors] = useState([]);
  const [boardUpdates, setBoardUpdates] = useState([]);
  const [initiatives, setInitiatives] = useState([]);
  const [bizTab, setBizTab] = useState("metrics");
  const [phaseActions, setPhaseActions] = useState([]);
  const [roadmapItems, setRoadmapItems] = useState([]);
  const [opStructures, setOpStructures] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [meetingActions, setMeetingActions] = useState([]);
  const [meetingView, setMeetingView] = useState("actions");
  const [rmView, setRmView] = useState("board");
  const [rmArea, setRmArea] = useState("All");
  const [bizDocs, setBizDocs] = useState([]);
  const [accessRegister, setAccessRegister] = useState([]);
  const [openSeats, setOpenSeats] = useState([]);
  const [orgUnits, setOrgUnits] = useState([]);
  const [raciItems, setRaciItems] = useState([]);
  const [mocItems, setMocItems] = useState([]);
  const [mediaProducts, setMediaProducts] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaRoles, setMediaRoles] = useState([]);
  const [mediaIdeas, setMediaIdeas] = useState([]);
  const [mediaFeedbackList, setMediaFeedbackList] = useState([]);
  const [mediaTools, setMediaTools] = useState([]);
  const [mediaFolders, setMediaFolders] = useState([]);
  const [mediaTab, setMediaTab] = useState("pipeline");
  const [mediaProduct, setMediaProduct] = useState("");
  const [mediaGuests, setMediaGuests] = useState([]);
  const [pipeView, setPipeView] = useState("board");
  const [fgRounds, setFgRounds] = useState([]);
  const [fgParticipants, setFgParticipants] = useState([]);
  const [fgAssets, setFgAssets] = useState([]);
  const [fgChannels, setFgChannels] = useState([]);
  const [fgActiveRound, setFgActiveRound] = useState("");
  const [fgTab, setFgTab] = useState("participants");
  const [fgShowContacts, setFgShowContacts] = useState(false);
  const [fgSelected, setFgSelected] = useState([]);
  const [fgSendStaged, setFgSendStaged] = useState(false);
  const [fgChannelTab, setFgChannelTab] = useState("Pending");
  const [fgDragOver, setFgDragOver] = useState(false);
  const [dbLoading, setDbLoading] = useState(true);
  const [dbError, setDbError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    taskAssigned: true,
    taskUpdated: true,
    taskDue: true,
    projectUpdated: true,
    inHubBell: true,
  });

  // Load all data from Supabase on mount
  useEffect(() => {
    db.loadAllData().then(data => {
      // Use whatever the database returns — even if empty.
      // INIT_ data is only used if the database connection completely fails.
      setUsers(data.users);
      setWeeklyThemes(data.weeklyThemes);
      setCalendar(data.calendar);
      setTasks(data.tasks);
      setResources(data.resources);
      setOps(data.ops);
      setStats(data.stats);
      setNotes(data.notes);
      setKeyDates(data.keyDates);
      setCampaigns(data.campaigns);
      setProjects(data.projects);
      setOutreach(data.outreach);
      setPartnerships(data.partnerships);
      setAmbassadors(data.ambassadors || []);
      setCommChannels(data.commChannels || []);
      setCommEvents(data.commEvents || []);
      setFeedback(data.feedback || []);
      setEngagement(data.engagement || {});
      setResponsibilities(data.responsibilities || []);
      setBizMetrics(data.bizMetrics || {});
      setInvestors(data.investors || []);
      setBoardUpdates(data.boardUpdates || []);
      setInitiatives(data.initiatives || []);
      setBizDocs(data.bizDocs || []);
      setAccessRegister(data.accessRegister || []);
      setOpenSeats(data.openSeats || []);
      setOrgUnits(data.orgUnits || []);
      setRaciItems(data.raciItems || []);
      setMocItems(data.mocItems || []);
      setPhaseActions(data.phaseActions || []);
      setRoadmapItems(data.roadmapItems || []);
      setOpStructures(data.opStructures || []);
      setMeetings(data.meetings || []);
      setMeetingActions(data.meetingActions || []);
      setMediaProducts(data.mediaProducts || []);
      setMediaItems(data.mediaItems || []);
      setMediaRoles(data.mediaRoles || []);
      setMediaIdeas(data.mediaIdeas || []);
      setMediaFeedbackList(data.mediaFeedback || []);
      setMediaTools(data.mediaTools || []);
      setMediaFolders(data.mediaFolders || []);
      setMediaGuests(data.mediaGuests || []);
      setFgRounds(data.fgRounds || []);
      setFgParticipants(data.fgParticipants || []);
      setFgAssets(data.fgAssets || []);
      setFgChannels(data.fgChannels || []);
      setActivity(data.activity);
      // Only seed a genuinely fresh database. If any other table has rows, the
      // users table being empty means someone deleted them — don't resurrect them.
      const dbHasOtherData = (data.tasks?.length || data.activity?.length || data.projects?.length || data.outreach?.length);
      if (!data.users.length && !dbHasOtherData) {
        console.log("Fresh database detected — seeding default users");
        INIT_USERS.forEach(u => db.saveUser(u));
        setUsers(INIT_USERS);
      }
      setDbLoading(false);
    }).catch(err => {
      console.error("Failed to load from Supabase, using defaults:", err);
      setUsers(INIT_USERS); setWeeklyThemes(INIT_WEEKLY_THEMES); setCalendar(INIT_CALENDAR);
      setTasks(INIT_TASKS); setResources(INIT_RESOURCES); setOps(INIT_OPS);
      setStats(INIT_STATS); setNotes(INIT_NOTES); setKeyDates(INIT_KEY_DATES);
      setCampaigns(INIT_CAMPAIGNS); setProjects(INIT_PROJECTS);
      setOutreach(INIT_OUTREACH); setPartnerships(INIT_PARTNERSHIPS); setActivity(INIT_ACTIVITY);
      setDbError("Could not connect to database — running in offline mode");
      setDbLoading(false);
    });
  }, []);

  // Load notification settings for current user
  useEffect(() => {
    if (!curUser) return;
    db.loadNotifSettings(curUser.id).then(s => { if (s) setNotifSettings(s); });
    db.loadNotifications(curUser.id).then(n => { if (n) setNotifications(n); });
    db.loadWorkspace(curUser.id).then(w => { if (w) setWorkspace(w); });
  }, [curUser]);

  // Refresh notifications from DB
  const refreshNotifications = () => {
    if (!curUser) return;
    db.loadNotifications(curUser.id).then(n => { if (n) setNotifications(n); });
  };

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    if (!curUser) return;
    const interval = setInterval(refreshNotifications, 30000);
    return () => clearInterval(interval);
  }, [curUser]);

  // Helper: create and store a notification
  const notify = (targetUserId, type, title, body, link) => {
    if (!targetUserId) return;
    const n = { id: uid("notif"), user_id: targetUserId, type, title, body, link: link||"", read: false, time: new Date().toISOString() };
    // If the target is the current logged-in user, show it immediately in the UI
    if (targetUserId === curUser?.id) setNotifications(prev => [n, ...prev]);
    // Always save to database (even for self — so it persists across sessions)
    db.saveNotification(n);
  };

  // Helper: notify multiple users
  const notifyMany = (userIds, type, title, body, link) => {
    (userIds || []).forEach(uid2 => notify(uid2, type, title, body, link));
  };

  // Workspace helper: update and persist
  const updateWs = (key, updater) => {
    setWorkspace(prev => {
      const next = { ...prev, [key]: typeof updater === "function" ? updater(prev[key]) : updater };
      db.saveWorkspace(curUser.id, next);
      return next;
    });
  };

  // Pin/unpin an entity to My Space
  const isPinned = (type, id) => (workspace.pinned || []).some(p => p.type === type && p.id === id);
  const togglePin = (type, id) => {
    updateWs("pinned", prev => {
      const exists = (prev || []).some(p => p.type === type && p.id === id);
      return exists ? prev.filter(p => !(p.type === type && p.id === id)) : [...(prev || []), { type, id }];
    });
  };

  // Department mapping for the master task view (based on role)
  const DEPT_BY_ROLE = {
    "Admin": "Business Development",
    "Executive": "Business Operations",
    "Marketing Lead": "Marketing and Advertising",
    "Content Creator": "Media and Content",
    "Designer": "Media and Content",
    "Social Media Manager": "Community Engagement",
    "Community Lead": "Community Engagement",
  };
  const userDept = (uid2) => { const u = users.find(x => x.id === uid2); return u ? (DEPT_BY_ROLE[u.role] || "Other") : "Unassigned"; };

  // Responsibility helpers
  const respNextDue = (r) => {
    if (r.cadence === "Continuous") return "";
    if (r.nextDue) return r.nextDue;
    if (r.lastDone) return advanceDate(r.lastDone, r.cadence);
    return r.anchorDate || "";
  };
  const respIsDue = (r) => { const nd = respNextDue(r); return r.status === "Active" && nd && nd <= todayStr; };
  const markRespDone = (r) => {
    const today = new Date().toISOString().split("T")[0];
    const next = r.cadence === "Continuous" ? "" : advanceDate(today, r.cadence);
    const updated = { ...r, lastDone: today, nextDue: next };
    setResponsibilities(prev => prev.map(x => x.id === r.id ? updated : x));
    db.saveResponsibility(updated);
    log("completed cycle for", r.title, "Responsibilities");
  };

  const theme = getTheme(dark);
  const isAdmin = curUser?.role === "Admin";
  const isExec = curUser?.role === "Executive";
  const canSeeBusiness = isAdmin || isExec;
  const uName = (id) => users.find(u=>u.id===id)?.name || "Unknown";
  // Only active users appear in pickers and the team list; uName still resolves
  // deactivated people so historical attribution doesn't break.
  const activeUsers = users.filter(u => u.active !== false);
  const uNames = (ids) => {
    if (!ids) return "Unassigned";
    const arr = Array.isArray(ids) ? ids : [ids];
    return arr.map(id => uName(id)).join(", ") || "Unassigned";
  };
  const log = (action, target, sec) => {
    if(!curUser) return;
    const entry = {id:uid("a"),user:curUser.id,action,target,section:sec,time:new Date().toISOString()};
    setActivity(p=>[entry,...p].slice(0,50));
    db.logActivity(entry);
  };
  const openM = (type, data = {}) => { setForm(data); setModal(type); };
  const closeM = () => { setModal(null); setForm({}); };

  // Universal save handler - wraps logic in try/catch so closeM always fires
  const doSave = (fn) => {
    try {
      const r = fn();
      // If the save fn returns a promise that rejects or yields a supabase error, surface it
      if (r && typeof r.then === "function") {
        r.then(res => { if (res && res.error) console.error("Save persisted with error:", res.error); }).catch(err => console.error("Save error:", err));
      }
    } catch(err) { console.error("Save error:", err); }
    closeM();
  };

  if (dbLoading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0D1B21",fontFamily:FONT_BODY}}>
      <div style={{textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><NanuLogo size={52}/></div>
        <p style={{color:"#8AA4B0",fontSize:14}}>Loading Team Hub…</p>
      </div>
    </div>
  );

  if (!curUser) return <><LoginScreen onLogin={setCurUser} users={users}/></>;

  const NAV_GROUPS = [
    {
      id: "shared",
      label: "Shared",
      items: [
        { key:"dashboard", label:"Dashboard", icon:<LayoutDashboard size={18}/> },
        { key:"team", label:"Team", icon:<Users size={18}/> },
        { key:"calendar", label:"Calendar", icon:<Calendar size={18}/> },
        { key:"meetings", label:"Meetings", icon:<MessageSquare size={18}/> },
        { key:"tasks", label:"Tasks", icon:<CheckSquare size={18}/> },
        { key:"responsibilities", label:"Responsibilities", icon:<Repeat size={18}/> },
        { key:"projects", label:"Projects", icon:<FolderKanban size={18}/> },
        { key:"stats", label:"Stats", icon:<BarChart3 size={18}/> },
        { key:"resources", label:"Resources", icon:<Link2 size={18}/> },
        { key:"notes", label:"Notes", icon:<StickyNote size={18}/> },
      ]
    },
    {
      id: "marketing",
      label: "Marketing",
      items: [
        { key:"pallyy", label:"Content Scheduler", icon:<Columns size={18}/> },
        { key:"outreach", label:"Outreach", icon:<Megaphone size={18}/> },
        { key:"partnerships", label:"Partnerships", icon:<Handshake size={18}/> },
        { key:"content-ops", label:"Content Ops", icon:<FileText size={18}/> },
      ]
    },
    {
      id: "community",
      label: "Community",
      items: [
        { key:"ambassadors", label:"Ambassadors", icon:<Award size={18}/> },
        { key:"channels", label:"Channels", icon:<Hash size={18}/> },
        { key:"events", label:"Events", icon:<MapPin size={18}/> },
        { key:"feedback", label:"Feedback", icon:<Smile size={18}/> },
        { key:"focusgroups", label:"Focus Groups", icon:<Users2 size={18}/> },
        { key:"engagement", label:"Engagement", icon:<Activity size={18}/> },
      ]
    },
    {
      id: "roadmap",
      label: "Roadmap",
      items: [
        { key:"roadmap", label:"App Roadmap", icon:<Flag size={18}/> },
      ]
    },
    {
      id: "media",
      label: "Media",
      items: [
        { key:"media", label:"Media & Content", icon:<FileEdit size={18}/> },
      ]
    },
    ...(canSeeBusiness?[{
      id: "business",
      label: "Business",
      items: [
        { key:"business", label:"Business", icon:<Briefcase size={18}/> },
      ]
    }]:[]),
    {
      id: "system",
      label: "System",
      items: [
        { key:"settings", label:"Settings", icon:<Bell size={18}/> },
        ...(isAdmin?[{key:"admin",label:"Admin",icon:<Settings size={18}/>}]:[]),
      ]
    },
  ];

  /* ═══ NAV CUSTOMISATION (per user, stored in their workspace) ═══
     navPrefs = { hidden:[keys], itemOrder:{groupId:[keys]}, groupOrder:[groupIds] }
     My Space is pinned above the groups and can't be hidden. */
  const navPrefs = workspace.navPrefs || {};
  const navHidden = navPrefs.hidden || [];
  const isNavHidden = (key) => navHidden.includes(key);

  const orderedGroups = (() => {
    const go = navPrefs.groupOrder || [];
    const base = [...NAV_GROUPS];
    base.sort((a,b) => {
      const ia = go.indexOf(a.id), ib = go.indexOf(b.id);
      if (ia === -1 && ib === -1) return 0;
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    return base.map(g => {
      const io = (navPrefs.itemOrder || {})[g.id] || [];
      const items = [...g.items].sort((a,b) => {
        const ia = io.indexOf(a.key), ib = io.indexOf(b.key);
        if (ia === -1 && ib === -1) return 0;
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      });
      return { ...g, items };
    });
  })();

  const setNavPrefs = (updater) => updateWs("navPrefs", prev => updater(prev || {}));
  const toggleNavItem = (key) => setNavPrefs(p => {
    const h = p.hidden || [];
    return { ...p, hidden: h.includes(key) ? h.filter(k=>k!==key) : [...h, key] };
  });
  const moveNavItem = (groupId, key, dir) => {
    const group = orderedGroups.find(g=>g.id===groupId);
    if (!group) return;
    const keys = group.items.map(i=>i.key);
    const idx = keys.indexOf(key);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= keys.length) return;
    [keys[idx], keys[swap]] = [keys[swap], keys[idx]];
    setNavPrefs(p => ({ ...p, itemOrder: { ...(p.itemOrder||{}), [groupId]: keys } }));
  };
  const moveNavGroup = (groupId, dir) => {
    const ids = orderedGroups.map(g=>g.id);
    const idx = ids.indexOf(groupId);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= ids.length) return;
    [ids[idx], ids[swap]] = [ids[swap], ids[idx]];
    setNavPrefs(p => ({ ...p, groupOrder: ids }));
  };
  const resetNav = () => updateWs("navPrefs", {});

  const todayStr = new Date().toISOString().split("T")[0];
  // A task is overdue if its due date has passed and it isn't done
  const isOverdue = (t) => t.dueDate && t.dueDate < todayStr && t.status !== "Done";
  const overdue = tasks.filter(isOverdue).length;
  const approvals = [...tasks.filter(t=>t.status==="Needs Approval"),...calendar.filter(c=>c.status==="Needs Approval")];
  const todayItems = calendar.filter(i=>i.dueDate===todayStr);
  // Priority alerts: overdue (by date), explicitly blocked, needs approval, or has a blocker note — and not done
  const alertTasks = tasks.filter(t=>t.status!=="Done"&&(isOverdue(t)||["Blocked","Needs Approval"].includes(t.status)||t.blocker));
  const filteredCal = calendar.filter(c=>(fStatus==="All"||c.status===fStatus)&&(fPlat==="All"||c.platform===fPlat));

  // Project visibility: private projects only visible to owner, members, and admin
  const canSeeProject = (proj) => {
    if (!proj.private) return true;
    if (isAdmin) return true;
    if (proj.owner === curUser.id) return true;
    if (proj.members && proj.members.includes(curUser.id)) return true;
    return false;
  };
  const visibleProjects = projects.filter(canSeeProject);
  const privateProjectIds = projects.filter(p => p.private && !canSeeProject(p)).map(p => p.id);

  // Task filtering: hide tasks belonging to private projects user can't see
  const today2 = new Date().toISOString().split("T")[0];
  const thisWeekEnd = (() => { const d = new Date(); d.setDate(d.getDate() + (7 - d.getDay())); return d.toISOString().split("T")[0]; })();
  const accessibleTasks = tasks.filter(t => !t.project || !privateProjectIds.includes(t.project));
  const filteredTasks = accessibleTasks.filter(t => {
    if (taskView === "mine" && !(Array.isArray(t.owners) ? t.owners.includes(curUser.id) : t.owners === curUser.id)) return false;
    if (tfProject !== "All" && t.project !== tfProject) return false;
    if (tfPriority !== "All" && t.priority !== tfPriority) return false;
    if (tfStatus !== "All" && t.status !== tfStatus) return false;
    if (tfPerson !== "All" && !(Array.isArray(t.owners) ? t.owners.includes(tfPerson) : t.owners === tfPerson)) return false;
    if (tfDue === "Overdue" && (t.status === "Done" || !t.dueDate || t.dueDate >= today2)) return false;
    if (tfDue === "This Week" && (!t.dueDate || t.dueDate < today2 || t.dueDate > thisWeekEnd)) return false;
    if (tfDue === "Upcoming" && (!t.dueDate || t.dueDate <= today2)) return false;
    return true;
  });
  const sortedTasks = [...filteredTasks].sort((a,b)=>{const p=t=>t.status==="Overdue"?0:t.status==="Blocked"?1:t.status==="Needs Approval"?2:t.status==="In Progress"?3:t.status==="Done"?5:4;return p(a)-p(b);});
  const today = new Date();
  today.setHours(0,0,0,0);

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
            {l:"My Open Tasks",v:tasks.filter(t=>(Array.isArray(t.owners)?t.owners.includes(curUser.id):t.owners===curUser.id)&&t.status!=="Done").length,c:theme.teal,s:"tasks",tv:"mine"},
            {l:"Active Tasks",v:tasks.filter(t=>t.status==="In Progress").length,c:theme.orange,s:"tasks",tv:"all"},
            {l:"Awaiting Approval",v:approvals.length,c:theme.yellow,s:"tasks",tv:"all"},
            {l:"Total Followers",v:stats.totals.followers.toLocaleString(),c:theme.green,s:"stats"},
            {l:"Nanu Users",v:stats.weeklyGrowth.at(-1).users,c:theme.tealLt,s:"stats"},
          ].map((c,i)=>(
            <Card key={i} theme={theme} onClick={()=>{setSection(c.s);if(c.tv)setTaskView(c.tv)}} style={{ padding:14, textAlign:"center", cursor:"pointer" }}>
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
            {alertTasks.map(t=>{
              const reason = isOverdue(t) ? "Overdue" : t.status==="Blocked" ? "Blocked" : t.status==="Needs Approval" ? "Needs Approval" : t.blocker ? "Has blocker" : t.status;
              const rColor = isOverdue(t) ? theme.red : TASK_STATUS_COLORS[t.status] || theme.orange;
              return <div key={t.id} onClick={()=>openM("editTask",{...t})} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", cursor:"pointer", borderBottom:`1px solid ${theme.border}` }}>
                <AlertTriangle size={13} color={rColor}/>
                <div style={{flex:1,minWidth:0}}>
                  <span style={{ fontSize:13 }}>{t.title}</span>
                  {t.dueDate&&<span style={{fontSize:11,color:isOverdue(t)?theme.red:theme.textMut,marginLeft:6,fontFamily:FONT_MONO}}>{t.dueDate}</span>}
                </div>
                <Badge label={reason} color={rColor}/>
              </div>;
            })}
          </Card>
          <Card theme={theme}>
            <div style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:15, marginBottom:10 }}>Today's Schedule</div>
            {todayItems.length===0&&<p style={{fontSize:13,color:theme.textMut}}>No content scheduled</p>}
            {todayItems.map(c=>(
              <div key={c.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0" }}>
                <Badge label={c.platform} color={PLATFORM_COLORS[c.platform]||theme.teal}/>
                <span style={{ fontSize:13, flex:1 }}>{c.title}</span>
                <Badge label={c.status} color={STATUS_COLORS[c.status]}/>
                <span style={{ fontFamily:FONT_MONO, fontSize:11, color:theme.textMut }}>{fmt12(c.publishTime)}</span>
              </div>
            ))}
          </Card>
        </div>
        {/* My responsibilities due this week */}
        {(()=>{
          const wkEnd=(()=>{const d=new Date();d.setDate(d.getDate()+7);return d.toISOString().split("T")[0]})();
          const mine=responsibilities.filter(r=>r.owner===curUser.id&&r.status==="Active"&&r.cadence!=="Continuous"&&respNextDue(r)&&respNextDue(r)<=wkEnd).sort((a,b)=>(respNextDue(a)||"").localeCompare(respNextDue(b)||""));
          return mine.length>0&&<Card theme={theme} style={{marginTop:16,borderLeft:`3px solid ${theme.yellow}`}}>
            <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:15,marginBottom:10,display:"flex",alignItems:"center",gap:6}}><Repeat size={15} color={theme.yellow}/> My Responsibilities This Week</div>
            {mine.map(r=>{const nd=respNextDue(r);const due=respIsDue(r);return <div key={r.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:`1px solid ${theme.borderLight}`}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:RESP_CADENCE_COLORS[r.cadence],flexShrink:0}}/>
              <span onClick={()=>setSection("responsibilities")} style={{fontSize:13,flex:1,cursor:"pointer"}}>{r.title}</span>
              <Badge label={r.cadence} color={RESP_CADENCE_COLORS[r.cadence]}/>
              <span style={{fontFamily:FONT_MONO,fontSize:11,color:due?theme.orange:theme.textMut}}>{nd}</span>
              <Btn theme={theme} small onClick={()=>markRespDone(r)}><Check size={12}/> Done</Btn>
            </div>})}
          </Card>;
        })()}
        {/* Activity */}
        <Card theme={theme}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <div style={{ fontFamily:FONT_DISPLAY, fontWeight:700, fontSize:15 }}>Recent Activity</div>
            {isAdmin&&activity.length>0&&<button type="button" onClick={()=>openM("confirmClearActivity",{})} style={{background:"none",border:"none",color:theme.red,cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:4}}><Trash2 size={12}/> Clear team activity</button>}
          </div>
          {activity.length===0&&<p style={{fontSize:13,color:theme.textMut,padding:6}}>No recent activity</p>}
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
          {activeUsers.map(u=>(
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
              {isAdmin&&<div style={{marginTop:10}}>
                <Btn theme={theme} small onClick={()=>{const ex=opStructures.find(s=>s.userId===u.id);openM("editOpStructure",ex?{...ex}:{userId:u.id,subtitle:"",intro:"",owns:[],shared:[],cadence:[{day:"Monday",theme:"",items:[]},{day:"Tuesday",theme:"",items:[]},{day:"Wednesday",theme:"",items:[]},{day:"Thursday",theme:"",items:[]},{day:"Friday",theme:"",items:[]}],standing:[],focus:[],sourceNote:""})}}>
                  <Award size={11}/> {opStructures.some(s=>s.userId===u.id)?"Edit operating structure":"Set operating structure"}
                </Btn>
              </div>}
              {(()=>{const ur=responsibilities.filter(r=>r.owner===u.id&&r.status==="Active");return ur.length>0&&<div style={{marginTop:10,borderTop:`1px solid ${theme.border}`,paddingTop:10}}>
                <div style={{fontSize:10,fontWeight:600,color:theme.textMut,textTransform:"uppercase",letterSpacing:".04em",marginBottom:6,display:"flex",alignItems:"center",gap:4}}><Repeat size={11}/> Ongoing ({ur.length})</div>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  {ur.slice(0,4).map(r=>(<div key={r.id} onClick={()=>{setSection("responsibilities")}} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:12}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:RESP_CADENCE_COLORS[r.cadence],flexShrink:0}}/>
                    <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:theme.textSec}}>{r.title}</span>
                    <span style={{fontSize:10,color:theme.textMut}}>{r.cadence}</span>
                  </div>))}
                  {ur.length>4&&<span style={{fontSize:10,color:theme.textMut}}>+{ur.length-4} more</span>}
                </div>
              </div>})()}
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
    /* ─── COMPANY CALENDAR ─── */
    case "calendar": {
      const CAL_EVENT_TYPES = ["All","Task","Project","Partnership","Outreach","Event","Media","Responsibility","Meeting","Key Date"];
      const CAL_TYPE_COLORS = { Task:theme.teal, Project:"#DA77F2", Partnership:"#748FFC", Outreach:"#FFA94D", Event:"#69DB7C", Media:"#DA77F2", Responsibility:"#FFD43B", Meeting:"#22B8CF", "Key Date":"#FF6B6B" };

      // Project recurring responsibility occurrences across a forward window (next ~120 days)
      const projectResp = () => {
        const out = [];
        const horizon = new Date(); horizon.setDate(horizon.getDate() + 120);
        const horizonStr = horizon.toISOString().split("T")[0];
        responsibilities.filter(r=>r.status==="Active"&&r.cadence!=="Continuous").forEach(r=>{
          let d = respNextDue(r);
          if(!d) return;
          let guard = 0;
          while(d && d <= horizonStr && guard < 60){
            out.push({id:`resp_${r.id}_${d}`,type:"Responsibility",title:r.title,date:d,color:RESP_CADENCE_COLORS[r.cadence]||"#FFD43B",status:r.cadence,ownerId:r.owner,owner:uName(r.owner),onClick:()=>openM("editResponsibility",{...r})});
            d = advanceDate(d, r.cadence);
            guard++;
          }
        });
        return out;
      };

      // Aggregate all events into a unified list
      const calEvents = [
        ...tasks.filter(t=>t.dueDate).map(t=>({id:t.id,type:"Task",title:t.title,date:t.dueDate,color:CAL_TYPE_COLORS.Task,status:t.status,ownerId:Array.isArray(t.owners)?t.owners[0]:t.owners,owner:uName(Array.isArray(t.owners)?t.owners[0]:t.owners),onClick:()=>openM("editTask",{...t})})),
        ...visibleProjects.filter(p=>p.status==="Active").map(p=>({id:"prj_"+p.id,type:"Project",title:p.name,date:"",color:CAL_TYPE_COLORS.Project,status:p.status,ownerId:p.owner,owner:uName(p.owner),onClick:()=>setSection("projects")})),
        ...partnerships.filter(p=>p.reviewDate).map(p=>({id:"part_"+p.id,type:"Partnership",title:p.name+" (Review)",date:p.reviewDate,color:CAL_TYPE_COLORS.Partnership,status:p.status,ownerId:p.owner,owner:uName(p.owner),onClick:()=>openM("editPartnership",{...p})})),
        ...partnerships.filter(p=>p.startDate).map(p=>({id:"parts_"+p.id,type:"Partnership",title:p.name+" (Start)",date:p.startDate,color:CAL_TYPE_COLORS.Partnership,status:p.status,ownerId:p.owner,owner:uName(p.owner),onClick:()=>openM("editPartnership",{...p})})),
        ...outreach.filter(o=>o.date).map(o=>({id:"out_"+o.id,type:"Outreach",title:o.name,date:o.date,color:CAL_TYPE_COLORS.Outreach,status:o.status,ownerId:o.owner,owner:uName(o.owner),onClick:()=>openM("editOutreach",{...o})})),
        ...commEvents.filter(e=>e.date).map(e=>({id:"cev_"+e.id,type:"Event",title:e.title,date:e.date,color:"#69DB7C",status:e.status,ownerId:e.host,owner:uName(e.host),onClick:()=>openM("editCommEvent",{...e})})),
        ...projectResp(),
        ...mediaItems.filter(i=>i.airDate).map(i=>({id:"med_"+i.id,type:"Media",title:(i.episodeNo?i.episodeNo+" ":"")+(i.title||"Untitled"),date:i.airDate,color:mediaProducts.find(p=>p.id===i.productId)?.color||"#DA77F2",status:i.stage,ownerId:i.owner,owner:uName(i.owner),onClick:()=>openM("editMediaItem",{...i})})),
        ...keyDates.map(d=>({id:"kd_"+d.id,type:"Key Date",title:d.title,date:d.date,color:d.color||CAL_TYPE_COLORS["Key Date"],status:"",ownerId:"",owner:"",onClick:null})),
        ...calendar.filter(c=>c.dueDate).map(c=>({id:"cal_"+c.id,type:"Meeting",title:c.title,date:c.dueDate,color:CAL_TYPE_COLORS.Meeting,status:c.status,ownerId:c.owner,owner:uName(c.owner),onClick:()=>openM("editCal",{...c})})),
      ].filter(e=>e.date);

      const personFiltered = calPersonFilter==="all" ? calEvents : calPersonFilter==="mine" ? calEvents.filter(e=>e.ownerId===curUser.id||e.type==="Key Date") : calEvents.filter(e=>e.ownerId===calPersonFilter);
      const filteredEvents = calEventFilter==="All" ? personFiltered : personFiltered.filter(e=>e.type===calEventFilter);
      const fmt=d=>d.toISOString().split("T")[0];
      const todayStr3=fmt(new Date());

      return (
        <div>
          <SectionHead theme={theme} right={<>
            <Sel theme={theme} options={[{value:"mine",label:"My Calendar"},{value:"all",label:"All Team"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={calPersonFilter} onChange={e=>setCalPersonFilter(e.target.value)} style={{width:"auto",fontSize:13,padding:"6px 10px"}}/>
            <Sel theme={theme} options={CAL_EVENT_TYPES.map(t=>({value:t,label:t==="All"?"All Events":t+"s"}))} value={calEventFilter} onChange={e=>setCalEventFilter(e.target.value)} style={{width:"auto",fontSize:13,padding:"6px 10px"}}/>
            <div style={{display:"flex",background:theme.bgInput,borderRadius:8,border:`1px solid ${theme.border}`,overflow:"hidden"}}>
              {[["month","Month"],["week","Week"],["list","List"]].map(([k,l])=>(
                <button key={k} onClick={()=>setCalView(k)} style={{padding:"6px 12px",border:"none",fontSize:12,background:calView===k?theme.teal:"transparent",color:calView===k?"#0D1B21":theme.textSec,cursor:"pointer",fontWeight:600}}>{l}</button>
              ))}
            </div>
            <Btn primary theme={theme} onClick={()=>openM("editCal",{platform:"",status:"Idea",owner:curUser.id,dueDate:"",publishTime:"",caption:"",assetLink:"",campaign:"",title:""})}><Plus size={14}/> Add Event</Btn>
          </>}>Company Calendar</SectionHead>

          {/* Legend */}
          <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
            {Object.entries(CAL_TYPE_COLORS).map(([type,color])=>{
              const count=calEvents.filter(e=>e.type===type).length;
              return count>0?<div key={type} onClick={()=>setCalEventFilter(calEventFilter===type?"All":type)} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",opacity:calEventFilter!=="All"&&calEventFilter!==type?0.3:1,transition:"opacity .15s"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:color}}/>
                <span style={{fontSize:12,color:theme.textSec}}>{type} ({count})</span>
              </div>:null;
            })}
          </div>

          {/* Month view */}
          {calView==="month"&&(()=>{
            const y=calMonth.getFullYear(), m=calMonth.getMonth();
            const first=new Date(y,m,1);
            const last=new Date(y,m+1,0);
            const startOff=first.getDay()===0?6:first.getDay()-1;
            const totalCells=startOff+last.getDate();
            const rows=Math.ceil(totalCells/7);
            const cells=Array.from({length:rows*7},(_,i)=>{const dayNum=i-startOff+1;return new Date(y,m,dayNum)});
            const monthLabel=calMonth.toLocaleDateString("en-GB",{month:"long",year:"numeric"});
            return <>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <button type="button" onClick={()=>setCalMonth(new Date(y,m-1,1))} style={{background:"none",border:"none",cursor:"pointer",color:theme.textMut}}><ChevronLeft size={20}/></button>
                <span style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:18}}>{monthLabel}</span>
                <button type="button" onClick={()=>setCalMonth(new Date(y,m+1,1))} style={{background:"none",border:"none",cursor:"pointer",color:theme.textMut}}><ChevronRight size={20}/></button>
              </div>
              <div className="nanu-cal-grid" style={{marginBottom:4}}>
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><div key={d} style={{textAlign:"center",fontSize:11,fontWeight:600,color:theme.textMut,padding:6}}>{d}</div>)}
              </div>
              <div className="nanu-cal-grid">
                {cells.map((d,i)=>{
                  const ds=fmt(d);
                  const isThisMonth=d.getMonth()===m;
                  const isToday=ds===todayStr3;
                  const dayEvents=filteredEvents.filter(e=>e.date===ds);
                  return <div key={i} style={{minHeight:80,padding:6,background:isToday?`${theme.teal}10`:isThisMonth?theme.bgInput:"transparent",borderRadius:8,border:isToday?`1px solid ${theme.teal}`:`1px solid ${theme.border}`,opacity:isThisMonth?1:0.3}}>
                    <div style={{fontSize:12,fontWeight:isToday?700:400,color:isToday?theme.teal:theme.textSec,marginBottom:4}}>{d.getDate()}</div>
                    {dayEvents.slice(0,3).map(ev=>(
                      <div key={ev.id} onClick={ev.onClick} style={{fontSize:10,padding:"2px 5px",marginBottom:2,borderRadius:4,background:`${ev.color}20`,color:ev.color,fontWeight:600,cursor:ev.onClick?"pointer":"default",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",borderLeft:`2px solid ${ev.color}`}}>{ev.title}</div>
                    ))}
                    {dayEvents.length>3&&<div style={{fontSize:9,color:theme.textMut,paddingLeft:5}}>+{dayEvents.length-3} more</div>}
                  </div>;
                })}
              </div>
            </>;
          })()}

          {/* Week view */}
          {calView==="week"&&(()=>{
            const today=new Date();
            const dayOfWeek=today.getDay()===0?6:today.getDay()-1;
            const weekStart=new Date(today);weekStart.setDate(today.getDate()-dayOfWeek);
            const weekDays=Array.from({length:7},(_,i)=>{const d=new Date(weekStart);d.setDate(weekStart.getDate()+i);return d});
            return <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8}}>
              {weekDays.map(d=>{
                const ds=fmt(d);
                const isToday=ds===todayStr3;
                const dayEvents=filteredEvents.filter(e=>e.date===ds);
                return <div key={ds} style={{padding:10,background:isToday?`${theme.teal}10`:theme.bgInput,borderRadius:8,border:isToday?`1px solid ${theme.teal}`:`1px solid ${theme.border}`,minHeight:120}}>
                  <div style={{fontSize:12,fontWeight:700,color:isToday?theme.teal:theme.textSec,marginBottom:8}}>{d.toLocaleDateString("en-GB",{weekday:"short",day:"numeric"})}</div>
                  {dayEvents.map(ev=>(
                    <div key={ev.id} onClick={ev.onClick} style={{fontSize:11,padding:"4px 6px",marginBottom:4,borderRadius:4,background:`${ev.color}15`,borderLeft:`2px solid ${ev.color}`,cursor:ev.onClick?"pointer":"default"}}>
                      <div style={{fontWeight:600,color:ev.color,marginBottom:1}}>{ev.title}</div>
                      <div style={{fontSize:10,color:theme.textMut}}>{ev.type}{ev.owner?` · ${ev.owner}`:""}</div>
                    </div>
                  ))}
                  {dayEvents.length===0&&<div style={{fontSize:10,color:theme.textMut,opacity:0.4}}>No events</div>}
                </div>;
              })}
            </div>;
          })()}

          {/* List view — upcoming events sorted by date */}
          {calView==="list"&&(
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {filteredEvents.sort((a,b)=>a.date.localeCompare(b.date)).filter(e=>e.date>=todayStr3).length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:20}}>No upcoming events</p>}
              {filteredEvents.sort((a,b)=>a.date.localeCompare(b.date)).filter(e=>e.date>=todayStr3).map(ev=>(
                <Card key={ev.id} theme={theme} onClick={ev.onClick} style={{padding:12,cursor:ev.onClick?"pointer":"default"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <span style={{fontFamily:FONT_MONO,fontSize:12,color:theme.textMut,minWidth:85}}>{ev.date}</span>
                    <div style={{width:8,height:8,borderRadius:"50%",background:ev.color}}/>
                    <Badge label={ev.type} color={ev.color}/>
                    <span style={{fontWeight:600,fontSize:14,flex:1}}>{ev.title}</span>
                    {ev.status&&<Badge label={ev.status} color={theme.textMut}/>}
                    {ev.owner&&<span style={{fontSize:12,color:theme.textMut}}>{ev.owner}</span>}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      );
    }

    /* ─── PALLYY / CONTENT SCHEDULER ─── */
    case "pallyy": {

      return (
        <div>
          <SectionHead theme={theme}>Content Scheduler</SectionHead>

          {/* Hero launch card */}
          <Card theme={theme} style={{padding:0,overflow:"hidden",marginBottom:20}}>
            <div style={{background:"linear-gradient(135deg, #0D2A2A 0%, #0A1F1F 100%)",padding:"40px 32px",display:"flex",alignItems:"center",gap:32,flexWrap:"wrap"}}>
              <div style={{flex:"1 1 300px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <div style={{width:40,height:40,borderRadius:10,background:theme.teal,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Columns size={22} color="#0D1B21"/>
                  </div>
                  <span style={{fontFamily:FONT_DISPLAY,fontWeight:800,fontSize:22,color:"#fff"}}>Pallyy</span>
                </div>
                <p style={{fontSize:15,color:theme.textSec,lineHeight:1.6,marginBottom:20}}>Schedule posts, manage your content calendar, and track engagement across all platforms. Opens in a new tab for full functionality.</p>
                <Btn primary theme={theme} onClick={()=>window.open("https://app.pallyy.com","_blank")} style={{padding:"12px 28px",fontSize:15}}>
                  <ExternalLink size={16}/> Open Pallyy
                </Btn>
              </div>
            </div>
          </Card>

          {/* Access card — credentials live in the password manager, not here */}
          <Card theme={theme} style={{padding:20,marginBottom:20,borderLeft:`3px solid ${theme.yellow}`}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <Lock size={16} color={theme.yellow}/>
              <span style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:15}}>Access</span>
            </div>
            <p style={{fontSize:13,color:theme.textSec,margin:0,lineHeight:1.6}}>
              Pallyy uses a shared team account. Credentials are held in the company password manager — they are deliberately not stored in Team Hub.
            </p>
            <p style={{fontSize:12,color:theme.textMut,margin:"8px 0 0",lineHeight:1.6}}>
              If you need access, ask Nicholas. Access levels are per person, with the executive team as a third layer so nobody is ever the only holder.
            </p>
          </Card>

          {/* Quick links */}
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            {[
              {label:"Scheduling",desc:"Plan and schedule posts",url:"https://app.pallyy.com/dashboard/scheduling/calendar",icon:<Calendar size={18}/>},
              {label:"Analytics",desc:"Track performance",url:"https://app.pallyy.com/dashboard/analytics/reports",icon:<BarChart3 size={18}/>},
              {label:"Media Library",desc:"Manage images and videos",url:"https://app.pallyy.com/dashboard/media-library",icon:<FolderOpen size={18}/>},
            ].map(link=>(
              <Card key={link.label} theme={theme} onClick={()=>window.open(link.url,"_blank")} style={{flex:"1 1 200px",padding:18,cursor:"pointer",display:"flex",alignItems:"flex-start",gap:14}}>
                <div style={{color:theme.teal,marginTop:2}}>{link.icon}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:14,marginBottom:3}}>{link.label}</div>
                  <div style={{fontSize:12,color:theme.textMut}}>{link.desc}</div>
                </div>
                <ExternalLink size={12} color={theme.textMut} style={{marginLeft:"auto",flexShrink:0,marginTop:4}}/>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    /* ─── TASKS ─── */
    case "tasks": return (
      <div>
        <SectionHead theme={theme} right={<>
          <Btn theme={theme} small onClick={()=>{
            const myTasks = taskView==="mine" ? sortedTasks : sortedTasks.filter((t)=>Array.isArray(t.owners)?t.owners.includes(curUser.id):t.owners===curUser.id);
            const rows = [["Title","Status","Priority","Due Date","Owner","Project","Blocker","Notes"]];
            myTasks.forEach((t)=>rows.push([t.title,t.status,t.priority||"",t.dueDate,uNames(t.owners),visibleProjects.find((p)=>p.id===t.project)?.name||"",t.blocker||"",t.notes||""]));
            exportCSV(rows,`nanu-tasks-${new Date().toISOString().slice(0,10)}.csv`);
          }}><Download size={13}/> CSV</Btn>
          <Btn theme={theme} small onClick={()=>{
            const myTasks = taskView==="mine" ? sortedTasks : sortedTasks.filter((t)=>Array.isArray(t.owners)?t.owners.includes(curUser.id):t.owners===curUser.id);
            const items = myTasks.map((t)=>({
              heading:`${t.title} — ${t.status}${t.priority?" · "+t.priority:""}`,
              body:`Owner: ${uNames(t.owners)}\nDue: ${t.dueDate}\n${t.project?`Project: ${visibleProjects.find((p)=>p.id===t.project)?.name||""}\n`:""}${t.blocker?`Blocker: ${t.blocker}\n`:""}${t.notes?`\n${t.notes}`:""}`
            }));
            exportDOCX(`My Tasks — ${new Date().toLocaleDateString("en-GB")}`, items, `nanu-tasks-${new Date().toISOString().slice(0,10)}.doc`);
          }}><Download size={13}/> DOCX</Btn>
          <Btn primary theme={theme} onClick={()=>openM("editTask",{owners:[curUser.id],status:"Not Started",dueDate:"",blocker:"",priority:"Medium",notes:"",linkedContent:"",project:"",updates:[]})}><Plus size={14}/> Add Task</Btn>
        </>}>Tasks</SectionHead>

        {/* Filters */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14,alignItems:"center"}}>
          <div style={{display:"flex",background:theme.bgInput,borderRadius:8,border:`1px solid ${theme.border}`,overflow:"hidden"}}>
            {[["mine","My Tasks"],["all","All Tasks"],...(isAdmin?[["master","Master"]]:[])].map(([k,l])=>(
              <button key={k} onClick={()=>setTaskView(k)} style={{padding:"6px 12px",border:"none",fontSize:12,background:taskView===k?theme.teal:"transparent",color:taskView===k?"#0D1B21":theme.textSec,cursor:"pointer",fontWeight:600}}>{l==="Master"?<span style={{display:"flex",alignItems:"center",gap:4}}><Lock size={11}/>{l}</span>:l}</button>
            ))}
          </div>
          <Sel theme={theme} options={[{value:"All",label:"All Projects"},...visibleProjects.map(p=>({value:p.id,label:p.name}))]} value={tfProject} onChange={e=>setTfProject(e.target.value)} style={{width:"auto",fontSize:12,padding:"5px 8px"}}/>
          <Sel theme={theme} options={[{value:"All",label:"All Priorities"},...TASK_PRIORITIES.map(p=>({value:p,label:p}))]} value={tfPriority} onChange={e=>setTfPriority(e.target.value)} style={{width:"auto",fontSize:12,padding:"5px 8px"}}/>
          <Sel theme={theme} options={[{value:"All",label:"All Statuses"},...TASK_STATUSES.map(s=>({value:s,label:s}))]} value={tfStatus} onChange={e=>setTfStatus(e.target.value)} style={{width:"auto",fontSize:12,padding:"5px 8px"}}/>
          <Sel theme={theme} options={[{value:"All",label:"All People"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={tfPerson} onChange={e=>setTfPerson(e.target.value)} style={{width:"auto",fontSize:12,padding:"5px 8px"}}/>
          <Sel theme={theme} options={[{value:"All",label:"All Dates"},{value:"Overdue",label:"Overdue"},{value:"This Week",label:"This Week"},{value:"Upcoming",label:"Upcoming"}]} value={tfDue} onChange={e=>setTfDue(e.target.value)} style={{width:"auto",fontSize:12,padding:"5px 8px"}}/>
          {(tfProject!=="All"||tfPriority!=="All"||tfStatus!=="All"||tfPerson!=="All"||tfDue!=="All")&&<button onClick={()=>{setTfProject("All");setTfPriority("All");setTfStatus("All");setTfPerson("All");setTfDue("All")}} style={{background:"none",border:"none",color:theme.red,cursor:"pointer",fontSize:12,fontWeight:600}}>Clear filters</button>}
        </div>

        {taskView==="master"&&isAdmin ? (()=>{
          // Master admin view — uses filteredTasks (respects the filter bar) minus Done unless filtered
          const mTasks = filteredTasks;
          const activeTasks = mTasks.filter(t=>t.status!=="Done");
          const toggleBulk = (id) => setBulkSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);
          const selectAllVisible = () => setBulkSelected(activeTasks.map(t=>t.id));
          const doBulkReassign = () => {
            if(!bulkReassignTo||bulkSelected.length===0) return;
            bulkSelected.forEach(tid=>{
              const t = tasks.find(x=>x.id===tid); if(!t) return;
              const updated = {...t, owners:[bulkReassignTo]};
              setTasks(prev=>prev.map(x=>x.id===tid?updated:x));
              db.saveTask(updated);
            });
            log("reassigned",`${bulkSelected.length} task(s) to ${uName(bulkReassignTo)}`,"Tasks");
            setBulkSelected([]); setBulkReassignTo("");
          };
          const quickUpdate = (t, field, value) => {
            const updated = {...t,[field]:value};
            setTasks(prev=>prev.map(x=>x.id===t.id?updated:x));
            db.saveTask(updated);
          };
          // Build groups
          let groups = [];
          if(masterGroupBy==="member"){
            groups = users.map(u=>({key:u.id,label:u.name,sub:userDept(u.id),tasks:activeTasks.filter(t=>Array.isArray(t.owners)?t.owners.includes(u.id):t.owners===u.id)}));
            const unassigned = activeTasks.filter(t=>!t.owners||(Array.isArray(t.owners)&&t.owners.length===0));
            if(unassigned.length) groups.push({key:"_unassigned",label:"Unassigned",sub:"",tasks:unassigned});
          } else if(masterGroupBy==="department"){
            const depts = ["Leadership","Marketing","Community","Other"];
            groups = depts.map(d=>({key:d,label:d,sub:"",tasks:activeTasks.filter(t=>{const o=Array.isArray(t.owners)?t.owners[0]:t.owners;return userDept(o)===d})}));
          } else if(masterGroupBy==="project"){
            groups = visibleProjects.map(p=>({key:p.id,label:p.name,sub:"",color:p.color,tasks:activeTasks.filter(t=>t.project===p.id)}));
            const noProj = activeTasks.filter(t=>!t.project);
            if(noProj.length) groups.push({key:"_noproj",label:"No Project",sub:"",tasks:noProj});
          } else { // status
            groups = TASK_STATUSES.filter(s=>s!=="Done").map(s=>({key:s,label:s,sub:"",color:TASK_STATUS_COLORS[s],tasks:activeTasks.filter(t=>t.status===s)}));
          }
          groups = groups.filter(g=>g.tasks.length>0);

          return <div>
            {/* Workload summary */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:600,color:theme.textMut,marginBottom:8,textTransform:"uppercase",letterSpacing:".04em"}}>Team Workload</div>
              <div className="nanu-grid-summary">
                {users.map(u=>{
                  const ut = activeTasks.filter(t=>Array.isArray(t.owners)?t.owners.includes(u.id):t.owners===u.id);
                  const od = ut.filter(t=>isOverdue(t)).length;
                  const resp = responsibilities.filter(r=>r.owner===u.id&&r.status==="Active").length;
                  const overloaded = ut.length>=6;
                  return <Card key={u.id} theme={theme} style={{padding:12,borderLeft:`3px solid ${overloaded?theme.red:od>0?theme.orange:theme.teal}`}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontWeight:700,fontSize:13}}>{u.name.split(" ")[0]}</span>
                      {overloaded&&<span title="Overloaded" style={{fontSize:9,fontWeight:700,color:theme.red,background:`${theme.red}1a`,padding:"1px 6px",borderRadius:8}}>OVERLOADED</span>}
                    </div>
                    <div style={{display:"flex",gap:12,alignItems:"baseline"}}>
                      <div><span style={{fontFamily:FONT_DISPLAY,fontWeight:800,fontSize:22,color:theme.text}}>{ut.length}</span><span style={{fontSize:10,color:theme.textMut,marginLeft:3}}>active</span></div>
                      {od>0&&<div><span style={{fontFamily:FONT_DISPLAY,fontWeight:800,fontSize:18,color:theme.red}}>{od}</span><span style={{fontSize:10,color:theme.textMut,marginLeft:3}}>overdue</span></div>}
                      {resp>0&&<div><span style={{fontFamily:FONT_DISPLAY,fontWeight:800,fontSize:18,color:theme.yellow}}>{resp}</span><span style={{fontSize:10,color:theme.textMut,marginLeft:3}}>ongoing</span></div>}
                    </div>
                    <div style={{fontSize:10,color:theme.textMut,marginTop:3}}>{userDept(u.id)}</div>
                  </Card>;
                })}
              </div>
            </div>

            {/* Group-by switcher + export */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
              <div style={{display:"flex",background:theme.bgInput,borderRadius:8,border:`1px solid ${theme.border}`,overflow:"hidden"}}>
                {[["member","By Member"],["department","By Department"],["project","By Project"],["status","By Status"]].map(([k,l])=>(
                  <button key={k} onClick={()=>setMasterGroupBy(k)} style={{padding:"6px 12px",border:"none",fontSize:12,background:masterGroupBy===k?theme.teal:"transparent",color:masterGroupBy===k?"#0D1B21":theme.textSec,cursor:"pointer",fontWeight:600}}>{l}</button>
                ))}
              </div>
              <Btn theme={theme} small onClick={()=>{
                const rows=[["Title","Status","Priority","Due Date","Owner","Department","Project","Overdue","Added by","Added on","Contact","Contact detail","Done when","Blocker","Notes","Background"]];
                mTasks.forEach(t=>{const o=Array.isArray(t.owners)?t.owners[0]:t.owners;rows.push([t.title,t.status,t.priority||"",t.dueDate||"",uNames(t.owners),userDept(o),visibleProjects.find(p=>p.id===t.project)?.name||"",isOverdue(t)?"YES":"",t.createdBy?uName(t.createdBy):"",t.createdDate||"",t.contactName||"",t.contactDetail||"",t.outcome||"",t.blocker||"",t.notes||"",t.context||""])});
                exportCSV(rows,`nanu-team-tasks-${new Date().toISOString().slice(0,10)}.csv`);
              }}><Download size={13}/> Team Report</Btn>
            </div>

            {/* Bulk action bar */}
            {bulkSelected.length>0&&<Card theme={theme} style={{padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",borderLeft:`3px solid ${theme.teal}`}}>
              <span style={{fontSize:13,fontWeight:600}}>{bulkSelected.length} selected</span>
              <span style={{fontSize:12,color:theme.textMut}}>Reassign to:</span>
              <Sel theme={theme} options={[{value:"",label:"Choose person..."},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={bulkReassignTo} onChange={e=>setBulkReassignTo(e.target.value)} style={{width:"auto",fontSize:12,padding:"5px 8px"}}/>
              <Btn primary theme={theme} small onClick={doBulkReassign} disabled={!bulkReassignTo}>Reassign</Btn>
              <Btn theme={theme} danger small onClick={()=>openM("confirmBulkDeleteTasks",{count:bulkSelected.length})}><Trash2 size={12}/> Delete {bulkSelected.length}</Btn>
              <button onClick={()=>{setBulkSelected([]);setBulkReassignTo("")}} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer",fontSize:12,fontWeight:600}}>Clear</button>
            </Card>}

            {/* Select all */}
            {activeTasks.length>0&&<div style={{marginBottom:10}}>
              <button type="button" onClick={()=>bulkSelected.length===activeTasks.length?setBulkSelected([]):selectAllVisible()} style={{background:"none",border:`1px solid ${theme.border}`,borderRadius:8,padding:"5px 10px",cursor:"pointer",color:theme.textSec,fontSize:12,fontWeight:600}}>
                {bulkSelected.length===activeTasks.length?"Deselect all":`Select all ${activeTasks.length} visible`}
              </button>
            </div>}

            {/* Grouped task board */}
            {groups.map(g=>{
              const gOverdue = g.tasks.filter(t=>isOverdue(t)).length;
              return <div key={g.key} style={{marginBottom:20}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  {g.color&&<div style={{width:10,height:10,borderRadius:"50%",background:g.color}}/>}
                  <span style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:15}}>{g.label}</span>
                  {g.sub&&<span style={{fontSize:11,color:theme.textMut}}>· {g.sub}</span>}
                  <span style={{fontSize:11,color:theme.textMut,background:theme.bgInput,padding:"1px 8px",borderRadius:8}}>{g.tasks.length}</span>
                  {gOverdue>0&&<span style={{fontSize:11,color:theme.red,fontWeight:600}}>{gOverdue} overdue</span>}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  {g.tasks.map(t=>{
                    const ov=isOverdue(t);
                    const selected=bulkSelected.includes(t.id);
                    return <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,background:selected?`${theme.teal}12`:theme.bgCard,border:`1px solid ${selected?theme.teal:theme.border}`,flexWrap:"wrap"}}>
                      <input type="checkbox" checked={selected} onChange={()=>toggleBulk(t.id)} style={{cursor:"pointer",accentColor:theme.teal,width:15,height:15,flexShrink:0}}/>
                      {ov&&<AlertTriangle size={13} color={theme.red}/>}
                      <span onClick={()=>openM("editTask",{...t})} style={{fontWeight:500,fontSize:13,flex:"1 1 160px",cursor:"pointer",minWidth:0}}>{t.title}</span>
                      {masterGroupBy!=="project"&&t.project&&<Badge label={visibleProjects.find(p=>p.id===t.project)?.name||""} color={visibleProjects.find(p=>p.id===t.project)?.color||theme.textMut}/>}
                      {masterGroupBy!=="member"&&<span style={{fontSize:11,color:theme.textMut,minWidth:60}}>{uNames(t.owners)}</span>}
                      {/* Inline priority */}
                      <select value={t.priority||"Medium"} onChange={e=>quickUpdate(t,"priority",e.target.value)} style={{fontSize:11,padding:"3px 6px",borderRadius:6,border:`1px solid ${theme.border}`,background:theme.bgInput,color:TASK_PRIORITY_COLORS[t.priority]||theme.text,cursor:"pointer",fontWeight:600}}>
                        {TASK_PRIORITIES.map(p=><option key={p} value={p}>{p}</option>)}
                      </select>
                      {/* Inline status */}
                      <select value={t.status} onChange={e=>quickUpdate(t,"status",e.target.value)} style={{fontSize:11,padding:"3px 6px",borderRadius:6,border:`1px solid ${theme.border}`,background:theme.bgInput,color:TASK_STATUS_COLORS[t.status]||theme.text,cursor:"pointer",fontWeight:600}}>
                        {TASK_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                      <span style={{fontFamily:FONT_MONO,fontSize:11,color:ov?theme.red:theme.textMut,minWidth:78}}>{t.dueDate||"—"}</span>
                    </div>;
                  })}
                </div>
              </div>;
            })}
            {groups.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No tasks match the current filters.</p>}
          </div>;
        })() : <>
        {sortedTasks.filter(t=>t.status!=="Done").map((t)=>{
          const hl=["Overdue","Blocked","Needs Approval"].includes(t.status);
          const proj = projects.find((p)=>p.id===t.project);
          return <Card key={t.id} theme={theme} onClick={()=>openM("editTask",{...t})} style={{padding:12,marginBottom:6,cursor:"pointer",borderLeft:`3px solid ${TASK_STATUS_COLORS[t.status]||theme.border}`,background:hl?`${TASK_STATUS_COLORS[t.status]}06`:theme.bgCard}}>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              {hl&&<AlertTriangle size={14} color={TASK_STATUS_COLORS[t.status]}/>}
              <span style={{fontWeight:600,fontSize:14,flex:1}}>{t.title}</span>
              {proj&&<Badge label={proj.name} color={proj.color}/>}
              {t.priority&&<Badge label={t.priority} color={TASK_PRIORITY_COLORS[t.priority]||theme.textMut}/>}
              <Badge label={t.status} color={TASK_STATUS_COLORS[t.status]}/>
              <span style={{fontSize:12,color:theme.textMut}}>{uNames(t.owners)}</span>
              <span style={{fontFamily:FONT_MONO,fontSize:11,color:theme.textMut}}>{t.dueDate}</span>
              <button type="button" title={isPinned("task",t.id)?"Unpin from My Space":"Pin to My Space"} onClick={e=>{e.stopPropagation();togglePin("task",t.id)}} style={{background:"none",border:"none",cursor:"pointer",color:isPinned("task",t.id)?theme.teal:theme.textMut,opacity:isPinned("task",t.id)?1:0.4,padding:0}}><Pin size={14}/></button>
            </div>
            {t.notes&&<p style={{fontSize:12,color:theme.textSec,margin:"6px 0 0",lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{t.notes}</p>}
            {t.context&&<p style={{fontSize:12,color:theme.textMut,margin:"4px 0 0",lineHeight:1.5,fontStyle:"italic",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{t.context}</p>}
            {(t.contactName||t.contactDetail)&&<div style={{marginTop:5,display:"flex",alignItems:"center",gap:5,flexWrap:"wrap",fontSize:11}}>
              <Users size={11} color={theme.tealLt}/>
              {t.contactName&&<span style={{color:theme.textSec}}>{t.contactName}</span>}
              {t.contactDetail&&<span style={{color:theme.textMut,fontFamily:FONT_MONO}}>{t.contactDetail}</span>}
            </div>}
            {t.outcome&&<div style={{marginTop:4,display:"flex",alignItems:"flex-start",gap:5,fontSize:11,color:theme.green}}><Check size={11} style={{flexShrink:0,marginTop:2}}/><span>Done when: {t.outcome}</span></div>}
            {t.blocker&&<p style={{fontSize:12,color:theme.red,margin:"4px 0 0"}}>Blocker: {t.blocker}</p>}
            {(t.createdBy||t.createdDate)&&<div style={{marginTop:6,fontSize:10,color:theme.textMut,opacity:0.75}}>Added by {t.createdBy?uName(t.createdBy):"unknown"}{t.createdDate?` · ${t.createdDate}`:""}</div>}
            {t.linkedContent&&calendar.find((c)=>c.id===t.linkedContent)&&<div style={{marginTop:4,display:"flex",alignItems:"center",gap:4}}><Link2 size={11} color={theme.teal}/><span style={{fontSize:11,color:theme.teal}}>Linked: {calendar.find((c)=>c.id===t.linkedContent)?.title}</span></div>}
          </Card>;
        })}
        {sortedTasks.filter(t=>t.status==="Done").length > 0 && (
          <div style={{marginTop:20}}>
            <button onClick={()=>setForm(p=>({...p,_showDone:!p._showDone}))} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",fontFamily:FONT_BODY,fontSize:14,fontWeight:600,color:theme.textSec,padding:"8px 0"}}>
              <Check size={16} color={theme.green}/>
              Done ({sortedTasks.filter(t=>t.status==="Done").length})
              <ChevronRight size={14} style={{transform:form._showDone?"rotate(90deg)":"none",transition:"transform .2s"}}/>
            </button>
            {form._showDone && sortedTasks.filter(t=>t.status==="Done").map((t)=>{
              const proj = projects.find((p)=>p.id===t.project);
              return <Card key={t.id} theme={theme} onClick={()=>openM("editTask",{...t})} style={{padding:12,marginBottom:6,cursor:"pointer",borderLeft:`3px solid ${theme.green}`,opacity:0.7}}>
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <Check size={14} color={theme.green}/>
                  <span style={{fontWeight:600,fontSize:14,flex:1,textDecoration:"line-through",color:theme.textMut}}>{t.title}</span>
                  {proj&&<Badge label={proj.name} color={proj.color}/>}
                  <span style={{fontSize:12,color:theme.textMut}}>{uNames(t.owners)}</span>
                  <span style={{fontFamily:FONT_MONO,fontSize:11,color:theme.textMut}}>{t.dueDate}</span>
                </div>
              </Card>;
            })}
          </div>
        )}
        </>}
      </div>
    );

    /* ─── RESPONSIBILITIES ─── */
    case "responsibilities": {
      const newResp = () => openM("editResponsibility",{title:"",description:"",owner:curUser.id,area:"Content",cadence:"Weekly",status:"Active",anchorDate:new Date().toISOString().split("T")[0],nextDue:new Date().toISOString().split("T")[0],lastDone:"",color:theme.teal,linkedTasks:[],notes:""});
      const active = responsibilities.filter(r=>r.status==="Active");
      const dueNow = active.filter(respIsDue);
      const grouped = [...users.map(u=>({key:u.id,label:u.name,items:responsibilities.filter(r=>r.owner===u.id)})), {key:"_un",label:"Unassigned",items:responsibilities.filter(r=>!r.owner||!users.some(u=>u.id===r.owner))}].filter(g=>g.items.length>0);

      return (
        <div>
          <SectionHead theme={theme} right={<>
            <Btn theme={theme} small onClick={()=>{
              const rows=[["Responsibility","Owner","Area","Cadence","Status","Next Due","Last Done","Notes"]];
              responsibilities.forEach(r=>rows.push([r.title,uName(r.owner),r.area||"",r.cadence,r.status,respNextDue(r),r.lastDone||"",r.notes||""]));
              exportCSV(rows,`nanu-responsibilities-${new Date().toISOString().slice(0,10)}.csv`);
            }}><Download size={13}/> CSV</Btn>
            <Btn primary theme={theme} onClick={newResp}><Plus size={14}/> Add Responsibility</Btn>
          </>}>Responsibilities</SectionHead>
          <p style={{fontSize:13,color:theme.textSec,marginBottom:16}}>Ongoing duties the team looks after — recurring or continuous. Mark each cycle done to roll the next due date forward.</p>

          {/* Summary */}
          <div className="nanu-grid-summary" style={{marginBottom:18}}>
            <Card theme={theme} style={{padding:12,textAlign:"center"}}>
              <div className="nanu-big-num" style={{fontSize:22,color:theme.teal}}>{active.length}</div>
              <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>Active</div>
            </Card>
            <Card theme={theme} style={{padding:12,textAlign:"center",borderLeft:dueNow.length>0?`3px solid ${theme.orange}`:undefined}}>
              <div className="nanu-big-num" style={{fontSize:22,color:dueNow.length>0?theme.orange:theme.textMut}}>{dueNow.length}</div>
              <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>Due Now</div>
            </Card>
            <Card theme={theme} style={{padding:12,textAlign:"center"}}>
              <div className="nanu-big-num" style={{fontSize:22,color:theme.textMut}}>{responsibilities.filter(r=>r.status==="Paused").length}</div>
              <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>Paused</div>
            </Card>
          </div>

          {/* Grouped by owner */}
          {grouped.map(g=>(
            <div key={g.key} style={{marginBottom:20}}>
              <div style={{fontSize:12,fontWeight:600,color:theme.textSec,marginBottom:8,textTransform:"uppercase",letterSpacing:".04em"}}>{g.label} <span style={{color:theme.textMut}}>· {g.items.length}</span></div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {g.items.map(r=>{
                  const nd=respNextDue(r); const due=respIsDue(r);
                  return <Card key={r.id} theme={theme} style={{padding:14,borderLeft:`3px solid ${RESP_CADENCE_COLORS[r.cadence]||theme.teal}`,opacity:r.status==="Paused"?0.6:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                      <span onClick={()=>openM("editResponsibility",{...r})} style={{fontWeight:700,fontSize:14,flex:"1 1 200px",cursor:"pointer",minWidth:0,color:r.title?theme.text:theme.textMut,fontStyle:r.title?"normal":"italic"}}>{r.title||"Untitled responsibility"}</span>
                      <Badge label={r.cadence} color={RESP_CADENCE_COLORS[r.cadence]}/>
                      {r.area&&<Badge label={r.area} color={theme.textMut}/>}
                      {r.status==="Paused"&&<Badge label="Paused" color={theme.textMut}/>}
                      {r.cadence!=="Continuous"&&<span style={{fontFamily:FONT_MONO,fontSize:11,color:due?theme.orange:theme.textMut}}>{due?"Due ":"Next "}{nd||"—"}</span>}
                      {r.status==="Active"&&r.cadence!=="Continuous"&&<Btn theme={theme} small onClick={()=>markRespDone(r)}><Check size={12}/> Done</Btn>}
                      <Btn theme={theme} small onClick={()=>openM("editResponsibility",{...r})}><Edit3 size={12}/> Edit</Btn>
                      <button type="button" title={isPinned("responsibility",r.id)?"Unpin":"Pin to My Space"} onClick={()=>togglePin("responsibility",r.id)} style={{background:"none",border:"none",cursor:"pointer",color:isPinned("responsibility",r.id)?theme.teal:theme.textMut,opacity:isPinned("responsibility",r.id)?1:0.4}}><Pin size={13}/></button>
                    </div>
                    {r.description&&<p style={{fontSize:12,color:theme.textSec,margin:"6px 0 0",lineHeight:1.5}}>{r.description}</p>}
                    {(r.linkedTasks||[]).length>0&&<div style={{fontSize:11,color:theme.textMut,marginTop:6}}>{r.linkedTasks.length} linked task(s)</div>}
                  </Card>;
                })}
              </div>
            </div>
          ))}
          {responsibilities.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No responsibilities yet. Click "Add Responsibility" to start.</p>}
        </div>
      );
    }

    /* ─── PROJECTS ─── */
    case "projects": return (
      <div>
        <SectionHead theme={theme} right={isAdmin&&<Btn primary theme={theme} onClick={()=>openM("editProject",{status:"Planning",color:"#1FC2C2",owner:curUser.id,members:[],notes:"",links:[],private:false})}><Plus size={14}/> Add Project</Btn>}>Projects</SectionHead>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {visibleProjects.map((proj)=>{
            const projTasks = accessibleTasks.filter((t)=>t.project===proj.id);
            const activeTasks = projTasks.filter(t=>t.status!=="Done");
            const doneTasks = projTasks.filter(t=>t.status==="Done");
            const total = projTasks.length;
            const expanded = form[`_proj_${proj.id}`];
            const showDone = form[`_projdone_${proj.id}`];
            return <Card key={proj.id} theme={theme} style={{position:"relative",padding:0,overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:proj.color}}/>
              {/* Header */}
              <div style={{padding:"18px 18px 0"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:18}}>{proj.name}</div>
                    <div style={{fontSize:13,color:theme.textSec,marginTop:4,lineHeight:1.5}}>{proj.description}</div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                    <Badge label={proj.status} color={PROJECT_STATUS_COLORS[proj.status]}/>
                    {isAdmin&&<button onClick={()=>openM("editProject",{...proj})} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer"}}><Edit3 size={14}/></button>}
                  </div>
                </div>
                {/* Team */}
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10,flexWrap:"wrap"}}>
                  <span style={{fontSize:12,color:theme.textMut}}>Owner: <strong style={{color:theme.text}}>{uName(proj.owner)}</strong></span>
                  {proj.members&&proj.members.length>0&&<><span style={{fontSize:12,color:theme.textMut}}>·</span><span style={{fontSize:12,color:theme.textSec}}>Team: {proj.members.map(id=>uName(id)).join(", ")}</span></>}
                  <span style={{fontSize:12,color:theme.textMut}}>·</span>
                  <span style={{fontSize:12,color:proj.color,fontWeight:600}}>{total} tasks ({doneTasks.length} done)</span>
                </div>
                {total > 0 && <div style={{marginTop:8}}><ProgressBar value={doneTasks.length} max={total} color={proj.color} theme={theme}/></div>}
              </div>

              {/* Project Notes */}
              {proj.notes && <div style={{padding:"10px 18px 0"}}>
                <div style={{padding:"10px 12px",background:theme.bgInput,borderRadius:8,fontSize:13,color:theme.textSec,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{proj.notes}</div>
              </div>}

              {/* Linked Work / Resources */}
              {proj.links && proj.links.length > 0 && <div style={{padding:"10px 18px 0"}}>
                <div style={{fontSize:11,fontWeight:600,color:theme.textMut,marginBottom:6,textTransform:"uppercase"}}>Linked Work</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {proj.links.map((link,i) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",background:theme.bgInput,borderRadius:8,border:`1px solid ${theme.border}`,color:theme.text,textDecoration:"none",fontSize:12,fontWeight:500}}>
                      <ExternalLink size={11} color={proj.color}/>{link.label}
                    </a>
                  ))}
                </div>
              </div>}

              {/* Tasks — expand/collapse */}
              <div style={{padding:"12px 18px 14px"}}>
                <button onClick={()=>setForm(p=>({...p,[`_proj_${proj.id}`]:!expanded}))} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",fontFamily:FONT_BODY,fontSize:13,fontWeight:600,color:theme.textSec,padding:0,marginBottom:expanded?10:0}}>
                  <ChevronRight size={14} style={{transform:expanded?"rotate(90deg)":"none",transition:"transform .2s"}}/>
                  {expanded?"Hide":"Show"} Tasks ({activeTasks.length} active{doneTasks.length>0?`, ${doneTasks.length} done`:""})
                </button>

                {expanded && <>
                  {/* Active tasks */}
                  {activeTasks.length===0 && <p style={{fontSize:12,color:theme.textMut,paddingLeft:4}}>No active tasks</p>}
                  {activeTasks.map(t=>(
                    <div key={t.id} onClick={()=>openM("editTask",{...t})} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:6,background:theme.bgInput,cursor:"pointer",fontSize:12,marginBottom:4}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:TASK_STATUS_COLORS[t.status],flexShrink:0}}/>
                      <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</span>
                      <Badge label={t.status} color={TASK_STATUS_COLORS[t.status]}/>
                      <span style={{fontSize:11,color:theme.textMut}}>{uNames(t.owners)}</span>
                    </div>
                  ))}

                  {/* Done tasks — collapsible */}
                  {doneTasks.length > 0 && <>
                    <button onClick={()=>setForm(p=>({...p,[`_projdone_${proj.id}`]:!showDone}))} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",fontFamily:FONT_BODY,fontSize:12,fontWeight:600,color:theme.green,padding:"6px 0",marginTop:4}}>
                      <Check size={12}/> Done ({doneTasks.length})
                      <ChevronRight size={12} style={{transform:showDone?"rotate(90deg)":"none",transition:"transform .2s"}}/>
                    </button>
                    {showDone && doneTasks.map(t=>(
                      <div key={t.id} onClick={()=>openM("editTask",{...t})} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:6,cursor:"pointer",fontSize:12,marginBottom:4,opacity:0.6}}>
                        <Check size={12} color={theme.green}/>
                        <span style={{flex:1,textDecoration:"line-through",color:theme.textMut}}>{t.title}</span>
                        <span style={{fontSize:11,color:theme.textMut}}>{uNames(t.owners)}</span>
                      </div>
                    ))}
                  </>}

                  <div style={{marginTop:8}}>
                    <Btn theme={theme} small onClick={()=>openM("editTask",{owners:[curUser.id],status:"Not Started",dueDate:"",blocker:"",priority:"Medium",notes:"",linkedContent:"",project:proj.id})}><Plus size={12}/> Add Task</Btn>
                  </div>
                </>}
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
          <Sel theme={theme} options={[{value:"All",label:"All Owners"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={outreachUserFilter} onChange={(e)=>setOutreachUserFilter(e.target.value)} style={{width:"auto",fontSize:13,padding:"6px 10px"}}/>
          {(outreachFilter!=="All"||outreachUserFilter!=="All")&&<button type="button" onClick={()=>{setOutreachFilter("All");setOutreachUserFilter("All")}} style={{background:"none",border:"none",color:theme.red,cursor:"pointer",fontSize:12,fontWeight:600}}>Clear</button>}
          <Btn primary theme={theme} onClick={()=>openM("editOutreach",{type:"Community",status:"Identified",owner:curUser.id,platform:"",notes:"",url:"",date:"",contactName:"",contactEmail:"", linkedTasks:[] })}><Plus size={14}/> Add Contact</Btn>
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
            const items = outreach.filter((o)=>(outreachFilter==="All"||o.type===outreachFilter)&&(outreachUserFilter==="All"||o.owner===outreachUserFilter)&&o.status===status);
            return <div key={status} className="nanu-kanban-col">
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:OUTREACH_STATUS_COLORS[status]}}/>
                <span style={{fontWeight:600,fontSize:13}}>{status}</span>
                <span style={{fontSize:11,color:theme.textMut}}>({items.length})</span>
              </div>
              {items.map((item)=>(
                <Card key={item.id} theme={theme} onClick={()=>openM("editOutreach",{...item})} style={{padding:12,marginBottom:6,cursor:"pointer"}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:6}}>
                    <div style={{fontWeight:600,fontSize:13,marginBottom:4,flex:1}}>{item.name}</div>
                    <button type="button" title={isPinned("outreach",item.id)?"Unpin from My Space":"Pin to My Space"} onClick={e=>{e.stopPropagation();togglePin("outreach",item.id)}} style={{background:"none",border:"none",cursor:"pointer",color:isPinned("outreach",item.id)?theme.teal:theme.textMut,opacity:isPinned("outreach",item.id)?1:0.4,padding:0,flexShrink:0}}><Pin size={13}/></button>
                  </div>
                  <Badge label={item.type} color={item.type==="Community"?theme.teal:item.type==="Influencer"?theme.purple:item.type==="Content Creator"?theme.orange:"#748FFC"} style={{marginBottom:6}}/>
                  <div style={{fontSize:12,color:theme.textSec,marginTop:4}}>{item.platform}</div>
                  <div style={{fontSize:11,color:theme.textMut,marginTop:4}}>{uName(item.owner)}{item.date?` · ${item.date}`:""}</div>
                  {item.contactName&&<div style={{fontSize:11,color:theme.teal,marginTop:4}}>Contact: {item.contactName}</div>}
                  {(item.linkedTasks||[]).length>0&&<div style={{marginTop:6,borderTop:`1px solid ${theme.border}`,paddingTop:6}}>
                    <div style={{fontSize:10,fontWeight:600,color:theme.textMut,marginBottom:3}}>TASKS ({item.linkedTasks.length})</div>
                    {item.linkedTasks.slice(0,3).map(tid=>{const t=tasks.find(x=>x.id===tid);return t?<div key={tid} onClick={e=>{e.stopPropagation();openM("editTask",{...t})}} style={{fontSize:11,color:theme.textSec,display:"flex",alignItems:"center",gap:4,marginBottom:2,cursor:"pointer"}}><div style={{width:5,height:5,borderRadius:"50%",background:TASK_STATUS_COLORS[t.status]||theme.textMut,flexShrink:0}}/><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</span></div>:null})}
                    {item.linkedTasks.length>3&&<div style={{fontSize:10,color:theme.textMut}}>+{item.linkedTasks.length-3} more</div>}
                  </div>}
                  {item.notes&&<p style={{fontSize:11,color:theme.textMut,marginTop:4,lineHeight:1.4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{item.notes}</p>}
                </Card>
              ))}
            </div>;
          })}
        </div>
      </div>
    );

    /* ─── PARTNERSHIPS ─── */
    case "partnerships": return (
      <div>
        <SectionHead theme={theme} right={<>
          <Sel theme={theme} options={[{value:"All",label:"All Types"},...PARTNERSHIP_TYPES.map(t=>({value:t,label:t}))]} value={partFilter} onChange={e=>setPartFilter(e.target.value)} style={{width:"auto",fontSize:13,padding:"6px 10px"}}/>
          <Sel theme={theme} options={[{value:"All",label:"All Statuses"},...PARTNERSHIP_STATUSES.map(s=>({value:s,label:s}))]} value={partStatusFilter} onChange={e=>setPartStatusFilter(e.target.value)} style={{width:"auto",fontSize:13,padding:"6px 10px"}}/>
          {(partFilter!=="All"||partStatusFilter!=="All")&&<button type="button" onClick={()=>{setPartFilter("All");setPartStatusFilter("All")}} style={{background:"none",border:"none",color:theme.red,cursor:"pointer",fontSize:12,fontWeight:600}}>Clear</button>}
          <Btn primary theme={theme} onClick={()=>openM("editPartnership",{type:PARTNERSHIP_TYPES[0],status:"Lead / Prospect",owner:curUser.id,contactName:"",contactEmail:"",description:"",value:"",startDate:"",reviewDate:"",linkedOutreach:"",linkedTasks:[],links:[],updates:[]})}><Plus size={14}/> Add Partnership</Btn>
        </>}>Partnerships</SectionHead>

        {/* Summary strip */}
        <div className="nanu-grid-summary" style={{marginBottom:18}}>
          {PARTNERSHIP_STATUSES.filter(s=>partnerships.some(p=>p.status===s)).map(status=>{
            const count=partnerships.filter(p=>p.status===status).length;
            return <Card key={status} theme={theme} style={{padding:12,textAlign:"center",cursor:"pointer"}} onClick={()=>setPartStatusFilter(status)}>
              <div className="nanu-big-num" style={{fontSize:22,color:PARTNERSHIP_STATUS_COLORS[status]||theme.teal}}>{count}</div>
              <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>{status}</div>
            </Card>;
          })}
          <Card theme={theme} style={{padding:12,textAlign:"center"}}>
            <div className="nanu-big-num" style={{fontSize:22,color:theme.teal}}>{partnerships.length}</div>
            <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>Total</div>
          </Card>
        </div>

        {/* Partnership cards */}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {partnerships.filter(p=>(partFilter==="All"||p.type===partFilter)&&(partStatusFilter==="All"||p.status===partStatusFilter)).map(part=>{
            const partTasks=(part.linkedTasks||[]).map(tid=>tasks.find(t=>t.id===tid)).filter(Boolean);
            const linkedOut=part.linkedOutreach?outreach.find(o=>o.id===part.linkedOutreach):null;
            const expanded=form[`_part_${part.id}`];
            return <Card key={part.id} theme={theme} style={{position:"relative",padding:0,overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:PARTNERSHIP_TYPE_COLORS[part.type]||theme.teal}}/>
              {/* Header */}
              <div style={{padding:"18px 18px 0"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:18}}>{part.name}</div>
                    <div style={{fontSize:13,color:theme.textSec,marginTop:4,lineHeight:1.5}}>{part.description}</div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                    <Badge label={part.type} color={PARTNERSHIP_TYPE_COLORS[part.type]||theme.teal}/>
                    <Badge label={part.status} color={PARTNERSHIP_STATUS_COLORS[part.status]}/>
                    <button type="button" title={isPinned("partnership",part.id)?"Unpin from My Space":"Pin to My Space"} onClick={()=>togglePin("partnership",part.id)} style={{background:"none",border:"none",cursor:"pointer",color:isPinned("partnership",part.id)?theme.teal:theme.textMut,opacity:isPinned("partnership",part.id)?1:0.4}}><Pin size={14}/></button>
                    <button type="button" onClick={()=>openM("editPartnership",{...part})} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer"}}><Edit3 size={14}/></button>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10,flexWrap:"wrap"}}>
                  <span style={{fontSize:12,color:theme.textMut}}>Owner: <strong style={{color:theme.text}}>{uName(part.owner)}</strong></span>
                  {part.contactName&&<><span style={{fontSize:12,color:theme.textMut}}>·</span><span style={{fontSize:12,color:theme.teal}}>Contact: {part.contactName}</span></>}
                  {part.startDate&&<><span style={{fontSize:12,color:theme.textMut}}>·</span><span style={{fontSize:12,color:theme.textMut}}>Started: {part.startDate}</span></>}
                  {part.reviewDate&&<><span style={{fontSize:12,color:theme.textMut}}>·</span><span style={{fontSize:12,color:theme.textMut}}>Review: {part.reviewDate}</span></>}
                </div>
                {part.value&&<div style={{padding:"8px 12px",background:theme.bgInput,borderRadius:8,fontSize:13,color:theme.textSec,lineHeight:1.5,marginTop:10}}><strong style={{color:theme.teal,fontSize:11}}>VALUE: </strong>{part.value}</div>}
              </div>

              {/* Links */}
              {part.links&&part.links.length>0&&<div style={{padding:"10px 18px 0"}}>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {part.links.map((link,i)=>(<a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",background:theme.bgInput,borderRadius:8,border:`1px solid ${theme.border}`,color:theme.text,textDecoration:"none",fontSize:12,fontWeight:500}}><ExternalLink size={11} color={PARTNERSHIP_TYPE_COLORS[part.type]||theme.teal}/>{link.label}</a>))}
                </div>
              </div>}

              {/* Expand area */}
              <div style={{padding:"12px 18px 14px"}}>
                <button type="button" onClick={()=>setForm(p=>({...p,[`_part_${part.id}`]:!expanded}))} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",fontFamily:FONT_BODY,fontSize:13,fontWeight:600,color:theme.textSec,padding:0,marginBottom:expanded?10:0}}>
                  <ChevronRight size={14} style={{transform:expanded?"rotate(90deg)":"none",transition:"transform .2s"}}/>
                  Details{partTasks.length>0?` · ${partTasks.length} tasks`:""}
                  {(part.updates||[]).length>0?` · ${part.updates.length} updates`:""}
                </button>

                {expanded&&<>
                  {/* Linked outreach */}
                  {linkedOut&&<div style={{padding:"8px 12px",background:theme.bgInput,borderRadius:8,marginBottom:10,fontSize:12}}>
                    <span style={{color:theme.textMut}}>Linked outreach: </span>
                    <span style={{fontWeight:600,cursor:"pointer",color:theme.teal}} onClick={()=>{openM("editOutreach",{...linkedOut})}}>{linkedOut.name}</span>
                    <Badge label={linkedOut.status} color={OUTREACH_STATUS_COLORS[linkedOut.status]} style={{marginLeft:8}}/>
                  </div>}

                  {/* Tasks */}
                  {partTasks.length>0&&<div style={{marginBottom:10}}>
                    <div style={{fontSize:11,fontWeight:600,color:theme.textMut,marginBottom:6,textTransform:"uppercase"}}>Tasks</div>
                    {partTasks.map(t=>(<div key={t.id} onClick={()=>openM("editTask",{...t})} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:6,background:theme.bgInput,cursor:"pointer",fontSize:12,marginBottom:4}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:TASK_STATUS_COLORS[t.status],flexShrink:0}}/>
                      <span style={{flex:1}}>{t.title}</span>
                      <Badge label={t.status} color={TASK_STATUS_COLORS[t.status]}/>
                    </div>))}
                  </div>}

                  {/* Updates log */}
                  {(part.updates||[]).length>0&&<div style={{marginBottom:10}}>
                    <div style={{fontSize:11,fontWeight:600,color:theme.textMut,marginBottom:6,textTransform:"uppercase"}}>Updates</div>
                    {part.updates.map((u,i)=>(<div key={i} style={{padding:"8px 12px",background:theme.bgInput,borderRadius:6,marginBottom:4}}>
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                        <span style={{fontSize:12,fontWeight:600}}>{uName(u.author)}</span>
                        <span style={{fontSize:10,color:theme.textMut,fontFamily:FONT_MONO}}>{u.time}</span>
                      </div>
                      <p style={{fontSize:13,color:theme.textSec,margin:0,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{u.text}</p>
                    </div>))}
                  </div>}
                </>}
              </div>
            </Card>;
          })}
          {partnerships.filter(p=>(partFilter==="All"||p.type===partFilter)&&(partStatusFilter==="All"||p.status===partStatusFilter)).length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:20}}>No partnerships match the current filters</p>}
        </div>
      </div>
    );

    /* ─── AMBASSADORS ─── */
    case "ambassadors": return (
      <div>
        <SectionHead theme={theme} right={<Btn primary theme={theme} onClick={()=>openM("editAmbassador",{name:"",email:"",platform:"",followers:0,status:"Applied",joinDate:new Date().toISOString().split("T")[0],region:"",focus:"UAP",inviteCode:"",referrals:0,notes:"",links:[]})}><Plus size={14}/> Add Ambassador</Btn>}>Ambassador Program</SectionHead>

        {/* Summary cards */}
        <div className="nanu-grid-summary" style={{marginBottom:18}}>
          {AMBASSADOR_STATUS.map(s=>{
            const count=ambassadors.filter(a=>a.status===s).length;
            return count>0?<Card key={s} theme={theme} style={{padding:12,textAlign:"center"}}>
              <div className="nanu-big-num" style={{fontSize:22,color:AMBASSADOR_STATUS_COLORS[s]}}>{count}</div>
              <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>{s}</div>
            </Card>:null;
          })}
          <Card theme={theme} style={{padding:12,textAlign:"center"}}>
            <div className="nanu-big-num" style={{fontSize:22,color:theme.teal}}>{ambassadors.reduce((n,a)=>n+(a.referrals||0),0)}</div>
            <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>Total Referrals</div>
          </Card>
        </div>

        {/* List */}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {ambassadors.filter(a=>a.name).map(a=>(
            <Card key={a.id} theme={theme} onClick={()=>openM("editAmbassador",{...a})} style={{padding:14,cursor:"pointer",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:AMBASSADOR_STATUS_COLORS[a.status]||theme.teal,display:"flex",alignItems:"center",justifyContent:"center",color:"#0D1B21",fontWeight:700,fontSize:14,flexShrink:0}}>{a.name.charAt(0)}</div>
              <div style={{flex:"1 1 200px"}}>
                <div style={{fontWeight:700,fontSize:14}}>{a.name}</div>
                <div style={{fontSize:12,color:theme.textMut}}>{a.platform} · {a.region||"—"} · {a.focus}</div>
              </div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:700,fontSize:14,color:theme.teal}}>{a.followers?.toLocaleString()||0}</div>
                  <div style={{fontSize:10,color:theme.textMut}}>followers</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:700,fontSize:14}}>{a.referrals||0}</div>
                  <div style={{fontSize:10,color:theme.textMut}}>referrals</div>
                </div>
                {a.inviteCode&&<code style={{fontSize:11,padding:"3px 8px",background:theme.bgInput,borderRadius:6,color:theme.teal,fontFamily:FONT_MONO}}>{a.inviteCode}</code>}
                <Badge label={a.status} color={AMBASSADOR_STATUS_COLORS[a.status]}/>
              </div>
            </Card>
          ))}
          {ambassadors.filter(a=>a.name).length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No ambassadors yet. Click "Add Ambassador" to start tracking your program.</p>}
        </div>
      </div>
    );

    /* ─── CHANNELS ─── */
    case "channels": return (
      <div>
        <SectionHead theme={theme} right={<Btn primary theme={theme} onClick={()=>openM("editChannel",{name:"",platform:CHANNEL_PLATFORMS[0],url:"",members:0,status:"Monitoring",priority:"Medium",owner:curUser.id,lastEngaged:"",notes:""})}><Plus size={14}/> Add Channel</Btn>}>Community Channels</SectionHead>
        <p style={{fontSize:13,color:theme.textSec,marginBottom:16}}>Communities and platforms relevant to Nanu — track engagement, contacts, and outreach status.</p>

        {/* Grouped by platform */}
        {CHANNEL_PLATFORMS.filter(p=>commChannels.some(c=>c.platform===p)).map(plat=>(
          <div key={plat} style={{marginBottom:20}}>
            <div style={{fontSize:12,fontWeight:600,color:theme.textSec,marginBottom:8,textTransform:"uppercase",letterSpacing:".04em"}}>{plat}</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {commChannels.filter(c=>c.platform===plat).map(c=>(
                <Card key={c.id} theme={theme} onClick={()=>openM("editChannel",{...c})} style={{padding:14,cursor:"pointer",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                  <div style={{flex:"1 1 200px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                      <span style={{fontWeight:700,fontSize:14}}>{c.name}</span>
                      {c.url&&<a href={c.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{color:theme.teal}}><ExternalLink size={12}/></a>}
                    </div>
                    {c.notes&&<p style={{fontSize:12,color:theme.textMut,margin:0,lineHeight:1.4}}>{c.notes}</p>}
                  </div>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontWeight:700,fontSize:14,color:theme.teal}}>{c.members?.toLocaleString()||0}</div>
                      <div style={{fontSize:10,color:theme.textMut}}>members</div>
                    </div>
                    <Badge label={c.priority||"Medium"} color={c.priority==="High"?theme.red:c.priority==="Low"?theme.textMut:theme.yellow}/>
                    <Badge label={c.status} color={c.status==="Active"?theme.green:c.status==="Planned"?theme.yellow:theme.textMut}/>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
        {commChannels.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No channels tracked yet. Click "Add Channel" to start.</p>}
      </div>
    );

    /* ─── COMMUNITY EVENTS ─── */
    case "events": return (
      <div>
        <SectionHead theme={theme} right={<Btn primary theme={theme} onClick={()=>openM("editCommEvent",{title:"",type:COMM_EVENT_TYPES[0],date:"",time:"",duration:60,status:"Planned",host:curUser.id,platform:"",expectedAttendees:0,actualAttendees:0,description:"",recording:"",notes:""})}><Plus size={14}/> Add Event</Btn>}>Community Events</SectionHead>

        {/* Upcoming */}
        <div style={{fontSize:12,fontWeight:600,color:theme.textSec,marginBottom:8,textTransform:"uppercase",letterSpacing:".04em"}}>Upcoming</div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
          {commEvents.filter(e=>e.title&&(!e.date||e.date>=new Date().toISOString().split("T")[0])&&e.status!=="Completed"&&e.status!=="Cancelled").sort((a,b)=>(a.date||"").localeCompare(b.date||"")).map(ev=>(
            <Card key={ev.id} theme={theme} onClick={()=>openM("editCommEvent",{...ev})} style={{padding:16,cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16}}>{ev.title}</div>
                  <div style={{display:"flex",gap:10,alignItems:"center",marginTop:4,flexWrap:"wrap"}}>
                    <Badge label={ev.type} color={theme.teal}/>
                    <Badge label={ev.status} color={COMM_EVENT_STATUS_COLORS[ev.status]}/>
                    {ev.date&&<span style={{fontSize:12,color:theme.textMut}}>{ev.date} {ev.time&&`at ${fmt12(ev.time)}`} · {ev.duration}min</span>}
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:18,fontWeight:800,color:theme.teal,fontFamily:FONT_DISPLAY}}>{ev.expectedAttendees||0}</div>
                  <div style={{fontSize:10,color:theme.textMut}}>expected</div>
                </div>
              </div>
              {ev.description&&<p style={{fontSize:13,color:theme.textSec,margin:"8px 0 0",lineHeight:1.5}}>{ev.description}</p>}
              {ev.platform&&<div style={{fontSize:11,color:theme.textMut,marginTop:6}}>📍 {ev.platform} · Host: {uName(ev.host)}</div>}
            </Card>
          ))}
          {commEvents.filter(e=>e.title&&(!e.date||e.date>=new Date().toISOString().split("T")[0])&&e.status!=="Completed"&&e.status!=="Cancelled").length===0&&<p style={{fontSize:13,color:theme.textMut,padding:16}}>No upcoming events</p>}
        </div>

        {/* Past */}
        <div style={{fontSize:12,fontWeight:600,color:theme.textSec,marginBottom:8,textTransform:"uppercase",letterSpacing:".04em"}}>Past Events</div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {commEvents.filter(e=>e.title&&(e.status==="Completed"||(e.date&&e.date<new Date().toISOString().split("T")[0]))).sort((a,b)=>(b.date||"").localeCompare(a.date||"")).slice(0,10).map(ev=>(
            <Card key={ev.id} theme={theme} onClick={()=>openM("editCommEvent",{...ev})} style={{padding:12,cursor:"pointer",opacity:0.7,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <Badge label={ev.type} color={theme.textMut}/>
              <span style={{fontSize:13,fontWeight:600,flex:1}}>{ev.title}</span>
              <span style={{fontSize:12,color:theme.textMut}}>{ev.date}</span>
              {ev.actualAttendees>0&&<span style={{fontSize:12,fontWeight:700,color:theme.teal}}>{ev.actualAttendees} attended</span>}
              {ev.recording&&<a href={ev.recording} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{color:theme.teal,fontSize:11}}>Recording</a>}
            </Card>
          ))}
          {commEvents.filter(e=>e.title&&(e.status==="Completed"||(e.date&&e.date<new Date().toISOString().split("T")[0]))).length===0&&<p style={{fontSize:13,color:theme.textMut,padding:16}}>No past events yet</p>}
        </div>
      </div>
    );

    /* ─── FEEDBACK ─── */
    case "feedback": return (
      <div>
        <SectionHead theme={theme} right={<Btn primary theme={theme} onClick={()=>openM("editFeedback",{source:"In-app",user:"",contact:"",type:FEEDBACK_TYPES[0],sentiment:"Neutral",text:"",date:new Date().toISOString().split("T")[0],status:"New",owner:curUser.id,response:"",tags:[]})}><Plus size={14}/> Log Feedback</Btn>}>Community Feedback</SectionHead>

        {/* Sentiment summary */}
        <div className="nanu-grid-summary" style={{marginBottom:18}}>
          {FEEDBACK_SENTIMENT.map(s=>{
            const count=feedback.filter(f=>f.sentiment===s).length;
            return <Card key={s} theme={theme} style={{padding:12,textAlign:"center"}}>
              <div className="nanu-big-num" style={{fontSize:22,color:FEEDBACK_SENTIMENT_COLORS[s]}}>{count}</div>
              <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>{s}</div>
            </Card>;
          })}
          <Card theme={theme} style={{padding:12,textAlign:"center"}}>
            <div className="nanu-big-num" style={{fontSize:22,color:theme.yellow}}>{feedback.filter(f=>f.status==="New"||f.status==="Reviewed").length}</div>
            <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>Open</div>
          </Card>
        </div>

        {/* Feedback list */}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {feedback.filter(f=>f.text).sort((a,b)=>(b.date||"").localeCompare(a.date||"")).map(f=>(
            <Card key={f.id} theme={theme} onClick={()=>openM("editFeedback",{...f})} style={{padding:14,cursor:"pointer",borderLeft:`3px solid ${FEEDBACK_SENTIMENT_COLORS[f.sentiment]}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,flexWrap:"wrap",gap:6}}>
                <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                  <Badge label={f.type} color={theme.teal}/>
                  <Badge label={f.sentiment} color={FEEDBACK_SENTIMENT_COLORS[f.sentiment]}/>
                  <Badge label={f.status} color={f.status==="Resolved"?theme.green:f.status==="New"?theme.yellow:theme.textMut}/>
                  <span style={{fontSize:11,color:theme.textMut}}>{f.source}</span>
                </div>
                <span style={{fontSize:11,color:theme.textMut,fontFamily:FONT_MONO}}>{f.date}</span>
              </div>
              <p style={{fontSize:13,color:theme.textSec,margin:0,lineHeight:1.5}}>{f.text}</p>
              {(f.user||f.contact)&&<div style={{fontSize:11,color:theme.textMut,marginTop:6}}>{f.user&&`From: ${f.user}`}{f.user&&f.contact&&" · "}{f.contact}</div>}
            </Card>
          ))}
          {feedback.filter(f=>f.text).length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No feedback logged yet. Click "Log Feedback" to start.</p>}
        </div>
      </div>
    );

    /* ─── ENGAGEMENT METRICS ─── */
    case "engagement": {
      const wk = engagement.weekly || { dau:0,wau:0,mau:0,newSignups:0,reports:0,comments:0,reactions:0 };
      const prev = engagement.previous || {};
      const delta = (cur, p) => p ? Math.round(((cur-p)/p)*100) : 0;

      return (
        <div>
          <SectionHead theme={theme} right={isAdmin&&<Btn primary theme={theme} onClick={()=>openM("editEngagement",{...wk})}><Edit3 size={14}/> Update Weekly Metrics</Btn>}>Engagement Metrics</SectionHead>
          <p style={{fontSize:13,color:theme.textSec,marginBottom:16}}>In-app engagement and community health metrics. Update weekly.</p>

          {/* Main metrics */}
          <div className="nanu-grid-summary" style={{marginBottom:20}}>
            {[
              {label:"Daily Active",key:"dau",color:theme.teal},
              {label:"Weekly Active",key:"wau",color:"#748FFC"},
              {label:"Monthly Active",key:"mau",color:"#DA77F2"},
              {label:"New Signups",key:"newSignups",color:"#69DB7C"},
            ].map(m=>{
              const d=delta(wk[m.key]||0,prev[m.key]||0);
              return <Card key={m.key} theme={theme} style={{padding:16}}>
                <div style={{fontSize:11,color:theme.textMut,fontWeight:600,textTransform:"uppercase",marginBottom:4}}>{m.label}</div>
                <div style={{fontFamily:FONT_DISPLAY,fontWeight:800,fontSize:28,color:m.color,lineHeight:1}}>{(wk[m.key]||0).toLocaleString()}</div>
                {prev[m.key]&&<div style={{fontSize:11,marginTop:4,color:d>=0?theme.green:theme.red}}>{d>=0?"↑":"↓"} {Math.abs(d)}% vs last</div>}
              </Card>;
            })}
          </div>

          <div className="nanu-grid-summary" style={{marginBottom:20}}>
            {[
              {label:"Reports Submitted",key:"reports",color:"#FFA94D",icon:<FileText size={14}/>},
              {label:"Comments Posted",key:"comments",color:"#82F9F6",icon:<MessageSquare size={14}/>},
              {label:"Reactions Given",key:"reactions",color:"#FF6B6B",icon:<Heart size={14}/>},
              {label:"Credibility Votes",key:"votes",color:"#69DB7C",icon:<Check size={14}/>},
            ].map(m=>(
              <Card key={m.key} theme={theme} style={{padding:14}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,color:m.color}}>{m.icon}<span style={{fontSize:11,color:theme.textMut,fontWeight:600,textTransform:"uppercase"}}>{m.label}</span></div>
                <div style={{fontFamily:FONT_DISPLAY,fontWeight:800,fontSize:22,color:theme.text}}>{(wk[m.key]||0).toLocaleString()}</div>
              </Card>
            ))}
          </div>

          {/* Top categories engagement */}
          <Card theme={theme} style={{padding:18,marginBottom:16}}>
            <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:15,marginBottom:12}}>Engagement by Category</div>
            {[
              {cat:"UAP / UFO",color:"#1FC2C2"},
              {cat:"NHI",color:"#0EA5E9"},
              {cat:"Cryptids",color:"#16A34A"},
              {cat:"Paranormal",color:"#9333EA"},
              {cat:"Consciousness",color:"#EC4899"},
              {cat:"Myths & History",color:"#F59E0B"},
              {cat:"Ritual / Occult",color:"#DC2626"},
              {cat:"Natural Phenomena",color:"#10B981"},
              {cat:"Other / Fortean",color:"#6B7280"},
            ].map(c=>{
              const val = (engagement.categories||{})[c.cat] || 0;
              const max = Math.max(1, ...Object.values(engagement.categories||{}));
              const pct = (val/max)*100;
              return <div key={c.cat} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                  <span style={{color:theme.text}}>{c.cat}</span>
                  <span style={{fontFamily:FONT_MONO,color:c.color,fontWeight:700}}>{val.toLocaleString()}</span>
                </div>
                <div style={{height:6,background:theme.bgInput,borderRadius:3,overflow:"hidden"}}>
                  <div style={{width:`${pct}%`,height:"100%",background:c.color,borderRadius:3,transition:"width .4s"}}/>
                </div>
              </div>;
            })}
          </Card>

          {/* Period note */}
          <div style={{fontSize:11,color:theme.textMut,textAlign:"center",padding:8}}>Metrics for week ending {engagement.weekEnding||"—"}. Update via the button above to track week-over-week changes.</div>
        </div>
      );
    }

    /* ─── BUSINESS (Admin + Executive only) ─── */
    case "business": {
      if (!canSeeBusiness) return (
        <div>
          <SectionHead theme={theme}>Business</SectionHead>
          <Card theme={theme} style={{padding:32,textAlign:"center"}}>
            <Lock size={28} color={theme.textMut} style={{marginBottom:10}}/>
            <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16,marginBottom:6}}>Restricted</div>
            <p style={{fontSize:13,color:theme.textMut}}>This section is only available to Admin and Executive roles.</p>
          </Card>
        </div>
      );

      const m = bizMetrics.current || {};
      const mPrev = bizMetrics.previous || {};
      const fmtMoney = (v) => v || v === 0 ? "£" + Number(v).toLocaleString() : "—";
      const delta = (cur, pr) => pr ? Math.round(((cur - pr) / pr) * 100) : null;
      const runwayMonths = m.burn > 0 ? Math.floor((m.cash || 0) / m.burn) : null;

      return (
        <div>
          <SectionHead theme={theme} right={<Badge label="Admin & Executive" color={theme.yellow}/>}>Business</SectionHead>

          {/* Tabs */}
          <div className="nanu-ws-tabs" style={{display:"flex",gap:4,marginBottom:18,borderBottom:`1px solid ${theme.border}`,flexWrap:"wrap"}}>
            {[["metrics","Metrics & KPIs",TrendingUp],["phase","Phase 1 Actions",Flag],["access","Access & Backup",Lock],["seats","Open Seats",Users2],["org","Org Structure",FolderKanban],["raci","Accountability",CheckSquare],["moc","Operating Capability",Activity],["investors","Investors",Handshake],["board","Board Updates",FileText],["initiatives","Initiatives",Flag],["documents","Documents",FolderOpen]].map(([k,l,Icon])=>(
              <button key={k} onClick={()=>setBizTab(k)} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",border:"none",background:"transparent",borderBottom:bizTab===k?`2px solid ${theme.teal}`:"2px solid transparent",color:bizTab===k?theme.teal:theme.textSec,cursor:"pointer",fontSize:13,fontWeight:600,marginBottom:-1}}>
                <Icon size={14}/>{l}
              </button>
            ))}
          </div>

          {/* ── METRICS & KPIs ── */}
          {bizTab==="metrics"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <p style={{fontSize:13,color:theme.textSec,margin:0}}>Company health at a glance. Update monthly to track movement.</p>
              <Btn primary theme={theme} small onClick={()=>openM("editBizMetrics",{...m,periodLabel:bizMetrics.periodLabel||""})}><Edit3 size={13}/> Update Metrics</Btn>
            </div>

            {/* Runway highlight */}
            <Card theme={theme} style={{padding:20,marginBottom:16,borderLeft:`3px solid ${runwayMonths!==null&&runwayMonths<6?theme.red:runwayMonths!==null&&runwayMonths<12?theme.orange:theme.green}`}}>
              <div style={{display:"flex",alignItems:"baseline",gap:16,flexWrap:"wrap"}}>
                <div>
                  <div style={{fontSize:11,color:theme.textMut,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em"}}>Runway</div>
                  <div style={{fontFamily:FONT_DISPLAY,fontWeight:800,fontSize:36,color:runwayMonths!==null&&runwayMonths<6?theme.red:theme.teal,lineHeight:1.1}}>{runwayMonths!==null?`${runwayMonths} mo`:"—"}</div>
                </div>
                <div style={{fontSize:12,color:theme.textMut,lineHeight:1.6}}>
                  {fmtMoney(m.cash)} cash ÷ {fmtMoney(m.burn)}/mo net burn
                  {runwayMonths!==null&&runwayMonths<6&&<div style={{color:theme.red,fontWeight:600,marginTop:2}}>Under 6 months — raise or cut burn</div>}
                </div>
              </div>
            </Card>

            <div className="nanu-grid-summary" style={{marginBottom:16}}>
              {[
                {label:"Cash in Bank",key:"cash",money:true,color:theme.teal},
                {label:"Monthly Net Burn",key:"burn",money:true,color:theme.orange},
                {label:"MRR",key:"mrr",money:true,color:theme.green},
                {label:"Headcount",key:"headcount",money:false,color:"#748FFC"},
              ].map(k=>{
                const d=delta(m[k.key]||0,mPrev[k.key]||0);
                return <Card key={k.key} theme={theme} style={{padding:16}}>
                  <div style={{fontSize:11,color:theme.textMut,fontWeight:600,textTransform:"uppercase",marginBottom:4}}>{k.label}</div>
                  <div style={{fontFamily:FONT_DISPLAY,fontWeight:800,fontSize:24,color:k.color,lineHeight:1}}>{k.money?fmtMoney(m[k.key]):(m[k.key]??"—")}</div>
                  {d!==null&&<div style={{fontSize:11,marginTop:4,color:(k.key==="burn"?d<=0:d>=0)?theme.green:theme.red}}>{d>=0?"↑":"↓"} {Math.abs(d)}% vs last</div>}
                </Card>;
              })}
            </div>

            <div className="nanu-grid-summary" style={{marginBottom:16}}>
              {[
                {label:"Total Users",key:"users",color:theme.tealLt},
                {label:"Monthly Active",key:"mau",color:"#DA77F2"},
                {label:"Total Raised",key:"raised",money:true,color:theme.yellow},
                {label:"Valuation",key:"valuation",money:true,color:"#69DB7C"},
              ].map(k=>(
                <Card key={k.key} theme={theme} style={{padding:14}}>
                  <div style={{fontSize:11,color:theme.textMut,fontWeight:600,textTransform:"uppercase",marginBottom:4}}>{k.label}</div>
                  <div style={{fontFamily:FONT_DISPLAY,fontWeight:800,fontSize:20,color:k.color}}>{k.money?fmtMoney(m[k.key]):(m[k.key]!=null?Number(m[k.key]).toLocaleString():"—")}</div>
                </Card>
              ))}
            </div>

            {m.notes&&<Card theme={theme} style={{padding:16}}>
              <div style={{fontSize:11,color:theme.textMut,fontWeight:600,textTransform:"uppercase",marginBottom:6}}>Context</div>
              <p style={{fontSize:13,color:theme.textSec,margin:0,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{m.notes}</p>
            </Card>}
            <div style={{fontSize:11,color:theme.textMut,textAlign:"center",padding:10}}>{bizMetrics.periodLabel?`Period: ${bizMetrics.periodLabel}`:"No period set"}</div>
          </div>}

          {/* ── PHASE 1 ACTIONS ── */}
          {bizTab==="phase"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <p style={{fontSize:13,color:theme.textSec,margin:0,maxWidth:640,lineHeight:1.6}}>What we agreed on 18 August. Each has an owner and a date.</p>
              <Btn primary theme={theme} small onClick={()=>openM("editPhaseAction",{seq:(phaseActions.length+1),action:"",detail:"",ownerUser:"",ownerText:"",dueLabel:"",dueDate:"",status:"Not started",notes:""})}><Plus size={13}/> Add Action</Btn>
            </div>

            <div className="nanu-grid-summary" style={{marginBottom:16}}>
              {PHASE_ACTION_STATUS.map(s=>(
                <Card key={s} theme={theme} style={{padding:12,textAlign:"center",borderTop:`3px solid ${PHASE_ACTION_STATUS_COLORS[s]}`}}>
                  <div className="nanu-big-num" style={{fontSize:22,color:PHASE_ACTION_STATUS_COLORS[s]}}>{phaseActions.filter(a=>a.status===s).length}</div>
                  <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>{s}</div>
                </Card>
              ))}
              <Card theme={theme} style={{padding:12,textAlign:"center"}}>
                <div className="nanu-big-num" style={{fontSize:22,color:theme.red}}>{phaseActions.filter(a=>a.dueDate&&a.dueDate<todayStr&&a.status!=="Done").length}</div>
                <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>Overdue</div>
              </Card>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {[...phaseActions].sort((a,b)=>(a.seq||0)-(b.seq||0)).map(a=>{
                const late=a.dueDate&&a.dueDate<todayStr&&a.status!=="Done";
                return <Card key={a.id} theme={theme} style={{padding:14,borderLeft:`3px solid ${late?theme.red:PHASE_ACTION_STATUS_COLORS[a.status]}`,opacity:a.status==="Done"?0.65:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <span style={{fontFamily:FONT_MONO,fontSize:11,color:theme.textMut,minWidth:20}}>{a.seq}</span>
                    <span style={{fontWeight:700,fontSize:14,flex:"1 1 220px",minWidth:0,textDecoration:a.status==="Done"?"line-through":"none"}}>{a.action}</span>
                    <span style={{fontSize:12,color:theme.textSec,minWidth:110}}>{a.ownerUser?uName(a.ownerUser):(a.ownerText||"Unassigned")}</span>
                    <span style={{fontSize:11,color:late?theme.red:theme.textMut,minWidth:90,fontWeight:late?600:400}}>{a.dueLabel||a.dueDate||"—"}</span>
                    <select value={a.status} onChange={e=>{const upd={...a,status:e.target.value};setPhaseActions(prev=>prev.map(x=>x.id===a.id?upd:x));db.savePhaseAction(upd)}}
                      style={{fontSize:11,padding:"3px 6px",borderRadius:6,border:`1px solid ${theme.border}`,background:theme.bgInput,color:PHASE_ACTION_STATUS_COLORS[a.status],cursor:"pointer",fontWeight:700}}>
                      {PHASE_ACTION_STATUS.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                    <Btn theme={theme} small onClick={()=>openM("editPhaseAction",{...a})}><Edit3 size={12}/></Btn>
                  </div>
                  {a.detail&&<p style={{fontSize:12,color:theme.textMut,margin:"6px 0 0",lineHeight:1.5,paddingLeft:30}}>{a.detail}</p>}
                </Card>;
              })}
              {phaseActions.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No actions logged.</p>}
            </div>

            {/* How we work */}
            <Card theme={theme} style={{padding:18,marginTop:20}}>
              <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:15,marginBottom:10}}>How we work in Phase 1</div>
              {[
                ["Every department runs itself","Each head sets their department up however they want. What the rest of us need is visibility in Team Hub, not permission requests."],
                ["Blockers are the most important thing","Put it against the task in the hub, not in a Signal message. A blocker is a blocker and nobody is asked to justify it. Clear it if you can, escalate if you cannot. The executive team will spend more time on blockers than anything else."],
                ["Team Hub is where the work lives","Roles, projects, calendars, opportunities and blockers go in the hub. If it is not in there, it is invisible to everyone else. Priorities are set by due date and managed inside each department."],
                ["Passwords and access","Everything goes in the password manager, with per-person access levels and the executive team as a third layer so nobody is ever the only holder."],
                ["Opportunities","Anything Susan brings in goes into Team Hub first. Small things at the weekly meeting. High priority gets a priority ticket and a short bespoke meeting."],
                ["Community engagement is shared","Not a department, no head. Ed internal, Susan external, everyone else boosts. The weight goes on external — it brings new users and doubles as advertising."],
              ].map(([h,b],i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderTop:i>0?`1px solid ${theme.borderLight}`:"none"}}>
                  <span style={{fontFamily:FONT_MONO,fontSize:11,color:theme.teal,flexShrink:0}}>{i+1}</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{h}</div>
                    <p style={{fontSize:12,color:theme.textMut,margin:0,lineHeight:1.6}}>{b}</p>
                  </div>
                </div>
              ))}
              <div style={{marginTop:12,padding:"10px 14px",background:`${theme.teal}0d`,border:`1px solid ${theme.teal}40`,borderRadius:8,fontSize:13,fontWeight:600,color:theme.teal,textAlign:"center"}}>
                The goal behind all of it: 5,000 users. External first, retention second.
              </div>
            </Card>
          </div>}

          {/* ── ACCESS & BACKUP REGISTER ── */}
          {bizTab==="access"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <p style={{fontSize:13,color:theme.textSec,margin:0,maxWidth:600,lineHeight:1.6}}>Who holds access to each critical system, and who covers it if they're unavailable. Any system without a named backup is a dependency, not a function.</p>
              <div style={{display:"flex",gap:6}}>
                {accessRegister.length>0&&<Btn theme={theme} small onClick={()=>{
                  const rows=[["System","Category","Primary Holder","Backup Holder","Status","Last Verified","Notes"]];
                  accessRegister.forEach(a=>rows.push([a.system,a.category,uName(a.primaryHolder),a.backupHolder?uName(a.backupHolder):"NONE",a.status,a.lastVerified,a.notes]));
                  exportCSV(rows,`nanu-access-register-${new Date().toISOString().slice(0,10)}.csv`);
                }}><Download size={12}/> CSV</Btn>}
                <Btn primary theme={theme} small onClick={()=>openM("editAccessItem",{system:"",category:"",primaryHolder:"",backupHolder:"",status:"No backup",lastVerified:"",notes:""})}><Plus size={13}/> Add System</Btn>
              </div>
            </div>

            <div style={{display:"flex",gap:12,alignItems:"flex-start",padding:14,background:`${theme.yellow}0d`,border:`1px solid ${theme.yellow}40`,borderRadius:10,marginBottom:16}}>
              <Lock size={16} color={theme.yellow} style={{flexShrink:0,marginTop:2}}/>
              <div style={{fontSize:12,color:theme.textSec,lineHeight:1.6}}>
                This register records <strong>who holds</strong> access — never passwords, keys or credentials themselves. Keep those in a password manager.
              </div>
            </div>

            {(()=>{
              const noBackup = accessRegister.filter(a=>!a.backupHolder);
              return noBackup.length>0&&<Card theme={theme} style={{padding:14,marginBottom:16,borderLeft:`3px solid ${theme.red}`}}>
                <div style={{fontSize:11,fontWeight:700,color:theme.red,textTransform:"uppercase",letterSpacing:".04em",marginBottom:8}}>{noBackup.length} system{noBackup.length===1?"":"s"} with no named backup</div>
                {noBackup.map(a=>(<div key={a.id} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,padding:"3px 0"}}>
                  <AlertTriangle size={12} color={theme.red}/><span style={{flex:1}}>{a.system}</span><span style={{color:theme.textMut}}>{a.primaryHolder?uName(a.primaryHolder):"no primary either"}</span>
                </div>))}
              </Card>;
            })()}

            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {accessRegister.map(a=>{
                const missing=!a.backupHolder;
                return <Card key={a.id} theme={theme} style={{padding:14,borderLeft:`3px solid ${missing?theme.red:ACCESS_STATUS_COLORS[a.status]||theme.border}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <div style={{flex:"1 1 200px",minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:14}}>{a.system}</div>
                      {a.category&&<div style={{fontSize:11,color:theme.textMut,marginTop:2}}>{a.category}</div>}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:2,minWidth:130}}>
                      <span style={{fontSize:10,color:theme.textMut,textTransform:"uppercase",letterSpacing:".04em"}}>Primary</span>
                      <span style={{fontSize:12,fontWeight:600}}>{a.primaryHolder?uName(a.primaryHolder):"—"}</span>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:2,minWidth:130}}>
                      <span style={{fontSize:10,color:theme.textMut,textTransform:"uppercase",letterSpacing:".04em"}}>Backup</span>
                      <span style={{fontSize:12,fontWeight:600,color:missing?theme.red:theme.text}}>{a.backupHolder?uName(a.backupHolder):"NOT NAMED"}</span>
                    </div>
                    <Badge label={a.status} color={ACCESS_STATUS_COLORS[a.status]}/>
                    {a.lastVerified&&<span style={{fontFamily:FONT_MONO,fontSize:11,color:theme.textMut}}>{a.lastVerified}</span>}
                    <Btn theme={theme} small onClick={()=>openM("editAccessItem",{...a})}><Edit3 size={12}/> Edit</Btn>
                  </div>
                  {a.notes&&<p style={{fontSize:12,color:theme.textMut,margin:"6px 0 0",lineHeight:1.5}}>{a.notes}</p>}
                </Card>;
              })}
              {accessRegister.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No systems registered yet. Click "Add System" to start.</p>}
            </div>
          </div>}

          {/* ── OPEN SEATS ── */}
          {bizTab==="seats"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <p style={{fontSize:13,color:theme.textSec,margin:0,maxWidth:600,lineHeight:1.6}}>Every seat a department head has identified as required. Hours are honest expected commitments, not aspirations.</p>
              <div style={{display:"flex",gap:6}}>
                {openSeats.length>0&&<Btn theme={theme} small onClick={()=>{
                  const rows=[["Seat","Department","Function","Status","Urgency","Hours/week","Funded","Interim","Impact if open","Notes"]];
                  openSeats.forEach(s=>rows.push([s.title,s.department,s.func,s.status,s.urgency,String(s.hoursPerWeek||""),s.funded?"YES":"",s.interim?uName(s.interim):"",s.impact,s.notes]));
                  exportCSV(rows,`nanu-open-seats-${new Date().toISOString().slice(0,10)}.csv`);
                }}><Download size={12}/> CSV</Btn>}
                <Btn primary theme={theme} small onClick={()=>openM("editOpenSeat",{title:"",department:NANU_DEPARTMENTS[0],func:"",impact:"",interim:"",status:"Open",urgency:"Medium",hoursPerWeek:0,funded:false,notes:""})}><Plus size={13}/> Add Seat</Btn>
              </div>
            </div>

            <div className="nanu-grid-summary" style={{marginBottom:16}}>
              {SEAT_STATUS.map(s=>(
                <Card key={s} theme={theme} style={{padding:12,textAlign:"center",borderTop:`3px solid ${SEAT_STATUS_COLORS[s]}`}}>
                  <div className="nanu-big-num" style={{fontSize:22,color:SEAT_STATUS_COLORS[s]}}>{openSeats.filter(x=>x.status===s).length}</div>
                  <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>{s}</div>
                </Card>
              ))}
              <Card theme={theme} style={{padding:12,textAlign:"center"}}>
                <div className="nanu-big-num" style={{fontSize:22,color:theme.teal}}>{openSeats.filter(s=>s.status!=="Filled").reduce((n,s)=>n+(s.hoursPerWeek||0),0)}</div>
                <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>Hrs/wk unfilled</div>
              </Card>
            </div>

            {NANU_DEPARTMENTS.filter(d=>openSeats.some(s=>s.department===d)).map(dept=>(
              <div key={dept} style={{marginBottom:18}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:DEPT_COLORS[dept]||theme.teal}}/>
                  <span style={{fontSize:12,fontWeight:600,color:theme.textSec,textTransform:"uppercase",letterSpacing:".04em"}}>{dept}</span>
                  <span style={{fontSize:11,color:theme.textMut,background:theme.bgInput,padding:"1px 8px",borderRadius:8}}>{openSeats.filter(s=>s.department===dept).length}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {openSeats.filter(s=>s.department===dept).sort((a,b)=>SEAT_URGENCY.indexOf(a.urgency)-SEAT_URGENCY.indexOf(b.urgency)).map(s=>(
                    <Card key={s.id} theme={theme} style={{padding:14,borderLeft:`3px solid ${SEAT_URGENCY_COLORS[s.urgency]}`,opacity:s.status==="Filled"?0.6:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                        <div style={{flex:"1 1 200px",minWidth:0}}>
                          <div style={{fontWeight:700,fontSize:14}}>{s.title}</div>
                          {s.func&&<div style={{fontSize:11,color:theme.textMut,marginTop:2}}>{s.func}</div>}
                        </div>
                        <Badge label={s.urgency} color={SEAT_URGENCY_COLORS[s.urgency]}/>
                        <Badge label={s.status} color={SEAT_STATUS_COLORS[s.status]}/>
                        {s.hoursPerWeek>0&&<span style={{fontFamily:FONT_MONO,fontSize:11,color:theme.textMut}}>{s.hoursPerWeek}h/wk</span>}
                        {s.funded&&<Badge label="Funded" color={theme.green}/>}
                        <Btn theme={theme} small onClick={()=>openM("editOpenSeat",{...s})}><Edit3 size={12}/> Edit</Btn>
                      </div>
                      {s.impact&&<p style={{fontSize:12,color:theme.orange,margin:"6px 0 0",lineHeight:1.5}}>If left open: {s.impact}</p>}
                      {s.interim&&<div style={{fontSize:11,color:theme.textMut,marginTop:4}}>Interim cover: {uName(s.interim)}</div>}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            {openSeats.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No seats registered yet.</p>}
          </div>}

          {/* ── ORG STRUCTURE ── */}
          {bizTab==="org"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <p style={{fontSize:13,color:theme.textSec,margin:0,maxWidth:600,lineHeight:1.6}}>The live org chart. Anything marked Open is a seat we don't currently have filled.</p>
              <div style={{display:"flex",gap:6}}>
                {orgUnits.length>0&&<Btn theme={theme} small onClick={()=>{
                  const rows=[["Layer","Unit","Department","Holder","Reports to","Status","Notes"]];
                  [...orgUnits].sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0)).forEach(u=>rows.push([u.layer,u.name,u.department,u.holderUser?uName(u.holderUser):u.holderText,u.reportsTo,u.status,u.notes]));
                  exportCSV(rows,`nanu-org-structure-${new Date().toISOString().slice(0,10)}.csv`);
                }}><Download size={12}/> CSV</Btn>}
                <Btn primary theme={theme} small onClick={()=>openM("editOrgUnit",{layer:"Function",name:"",department:NANU_DEPARTMENTS[0],holderUser:"",holderText:"",reportsTo:"",status:"Active",sortOrder:(orgUnits.length+1)*10,notes:""})}><Plus size={13}/> Add Unit</Btn>
              </div>
            </div>

            <div className="nanu-grid-summary" style={{marginBottom:16}}>
              {UNIT_STATUS.map(s=>(
                <Card key={s} theme={theme} style={{padding:12,textAlign:"center",borderTop:`3px solid ${UNIT_STATUS_COLORS[s]}`}}>
                  <div className="nanu-big-num" style={{fontSize:22,color:UNIT_STATUS_COLORS[s]}}>{orgUnits.filter(u=>u.status===s).length}</div>
                  <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>{s}</div>
                </Card>
              ))}
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:3}}>
              {[...orgUnits].sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0)).map(u=>{
                const indent={Governance:0,Executive:0,Department:0,Function:22,Sub:44}[u.layer]??22;
                const isDept=u.layer==="Department"||u.layer==="Governance"||u.layer==="Executive";
                return <div key={u.id} style={{marginLeft:indent}}>
                  <Card theme={theme} style={{padding:isDept?"12px 14px":"9px 14px",borderLeft:`3px solid ${u.status==="Open"?theme.red:DEPT_COLORS[u.department]||theme.border}`,background:isDept?theme.bgCard:theme.bgInput}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                      <span style={{fontSize:9,color:theme.textMut,textTransform:"uppercase",letterSpacing:".06em",minWidth:64}}>{u.layer}</span>
                      <span style={{fontWeight:isDept?700:600,fontSize:isDept?14:13,flex:"1 1 180px",minWidth:0}}>{u.name}</span>
                      <span style={{fontSize:12,color:u.status==="Open"?theme.red:theme.textSec,minWidth:140}}>{u.holderUser?uName(u.holderUser):(u.holderText||"Unfilled")}</span>
                      {u.reportsTo&&<span style={{fontSize:11,color:theme.textMut}}>→ {u.reportsTo}</span>}
                      <Badge label={u.status} color={UNIT_STATUS_COLORS[u.status]}/>
                      <Btn theme={theme} small onClick={()=>openM("editOrgUnit",{...u})}><Edit3 size={11}/></Btn>
                    </div>
                    {u.notes&&<p style={{fontSize:11,color:theme.textMut,margin:"5px 0 0",lineHeight:1.5}}>{u.notes}</p>}
                  </Card>
                </div>;
              })}
              {orgUnits.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No org units yet. Click "Add Unit" to build the chart.</p>}
            </div>
            <p style={{fontSize:11,color:theme.textMut,marginTop:12,lineHeight:1.5}}>Sort order controls position. Use increments of 10 so you can insert rows later without renumbering everything.</p>
          </div>}

          {/* ── ACCOUNTABILITY (RACI) ── */}
          {bizTab==="raci"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <p style={{fontSize:13,color:theme.textSec,margin:0,maxWidth:640,lineHeight:1.6}}>For every recurring output: who answers for it at board level (Accountable), who does the work (Responsible), and who must be asked before it ships (Consulted).</p>
              <div style={{display:"flex",gap:6}}>
                {raciItems.length>0&&<Btn theme={theme} small onClick={()=>{
                  const rows=[["Recurring output","Department","Accountable","Responsible","Consulted","Notes"]];
                  raciItems.forEach(r=>rows.push([r.output,r.department,r.accountable?uName(r.accountable):"",r.responsible,r.consulted,r.notes]));
                  exportCSV(rows,`nanu-accountability-${new Date().toISOString().slice(0,10)}.csv`);
                }}><Download size={12}/> CSV</Btn>}
                <Btn primary theme={theme} small onClick={()=>openM("editRaciItem",{output:"",department:NANU_DEPARTMENTS[0],accountable:"",responsible:"",consulted:"",notes:""})}><Plus size={13}/> Add Output</Btn>
              </div>
            </div>

            {(()=>{
              const unowned=raciItems.filter(r=>!r.accountable);
              return unowned.length>0&&<Card theme={theme} style={{padding:12,marginBottom:14,borderLeft:`3px solid ${theme.orange}`}}>
                <div style={{fontSize:12,color:theme.orange,fontWeight:600}}>{unowned.length} output{unowned.length===1?"":"s"} with nobody accountable</div>
              </Card>;
            })()}

            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {raciItems.map(r=>(
                <Card key={r.id} theme={theme} style={{padding:14,borderLeft:`3px solid ${DEPT_COLORS[r.department]||theme.border}`}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:10,flexWrap:"wrap"}}>
                    <div style={{flex:"1 1 220px",minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:14}}>{r.output}</div>
                      {r.department&&<div style={{fontSize:11,color:theme.textMut,marginTop:2}}>{r.department}</div>}
                    </div>
                    <div style={{display:"flex",gap:14,flexWrap:"wrap",flex:"2 1 320px"}}>
                      <div style={{minWidth:110}}>
                        <div style={{fontSize:9,color:theme.red,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em"}}>Accountable</div>
                        <div style={{fontSize:12,fontWeight:600,color:r.accountable?theme.text:theme.orange}}>{r.accountable?uName(r.accountable):"Nobody"}</div>
                      </div>
                      <div style={{minWidth:110}}>
                        <div style={{fontSize:9,color:theme.teal,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em"}}>Responsible</div>
                        <div style={{fontSize:12,color:theme.textSec}}>{r.responsible||"—"}</div>
                      </div>
                      <div style={{minWidth:110}}>
                        <div style={{fontSize:9,color:theme.textMut,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em"}}>Consulted</div>
                        <div style={{fontSize:12,color:theme.textMut}}>{r.consulted||"—"}</div>
                      </div>
                    </div>
                    <Btn theme={theme} small onClick={()=>openM("editRaciItem",{...r})}><Edit3 size={12}/> Edit</Btn>
                  </div>
                </Card>
              ))}
              {raciItems.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No outputs mapped yet.</p>}
            </div>
            <p style={{fontSize:11,color:theme.textMut,marginTop:12,lineHeight:1.6}}>If you're accountable for an outcome and didn't have the authority or resource to reach it, say so at the time, in writing, to the board. Raising a resourcing gap is the job, not a complaint.</p>
          </div>}

          {/* ── MINIMUM OPERATING CAPABILITY ── */}
          {bizTab==="moc"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <p style={{fontSize:13,color:theme.textSec,margin:0,maxWidth:640,lineHeight:1.6}}>The smallest team and toolset each function needs to sustain baseline daily operations — and what's actually staffed against it.</p>
              <div style={{display:"flex",gap:6}}>
                {mocItems.length>0&&<Btn theme={theme} small onClick={()=>{
                  const rows=[["Function","Department","Head","Minimum capability","Current state","Gap","Status","Hours needed","Confirmed"]];
                  mocItems.forEach(m=>rows.push([m.func,m.department,m.headUser?uName(m.headUser):m.headText,m.minimum,m.currentState,m.gap,m.status,String(m.hoursNeeded||""),m.confirmed?"YES":"NOT YET"]));
                  exportCSV(rows,`nanu-operating-capability-${new Date().toISOString().slice(0,10)}.csv`);
                }}><Download size={12}/> CSV</Btn>}
                <Btn primary theme={theme} small onClick={()=>openM("editMocItem",{func:"",department:NANU_DEPARTMENTS[0],headUser:"",headText:"",minimum:"",currentState:"",gap:"",status:"Operating",hoursNeeded:0,confirmed:false,notes:""})}><Plus size={13}/> Add Function</Btn>
              </div>
            </div>

            <div className="nanu-grid-summary" style={{marginBottom:16}}>
              {MOC_STATUS.map(s=>(
                <Card key={s} theme={theme} style={{padding:12,textAlign:"center",borderTop:`3px solid ${MOC_STATUS_COLORS[s]}`}}>
                  <div className="nanu-big-num" style={{fontSize:22,color:MOC_STATUS_COLORS[s]}}>{mocItems.filter(m=>m.status===s).length}</div>
                  <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>{s}</div>
                </Card>
              ))}
              <Card theme={theme} style={{padding:12,textAlign:"center"}}>
                <div className="nanu-big-num" style={{fontSize:22,color:theme.teal}}>{mocItems.reduce((n,m)=>n+(m.hoursNeeded||0),0)}</div>
                <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>Total hrs/wk needed</div>
              </Card>
            </div>

            {(()=>{
              const unconfirmed=mocItems.filter(m=>!m.confirmed);
              return unconfirmed.length>0&&<Card theme={theme} style={{padding:12,marginBottom:14,borderLeft:`3px solid ${theme.orange}`}}>
                <div style={{fontSize:12,color:theme.orange,fontWeight:600}}>{unconfirmed.length} function{unconfirmed.length===1?"":"s"} still awaiting a firm figure from the department head</div>
              </Card>;
            })()}

            {NANU_DEPARTMENTS.filter(d=>mocItems.some(m=>m.department===d)).map(dept=>(
              <div key={dept} style={{marginBottom:18}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:DEPT_COLORS[dept]||theme.teal}}/>
                  <span style={{fontSize:12,fontWeight:600,color:theme.textSec,textTransform:"uppercase",letterSpacing:".04em"}}>{dept}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {mocItems.filter(m=>m.department===dept).map(m=>(
                    <Card key={m.id} theme={theme} style={{padding:14,borderLeft:`3px solid ${MOC_STATUS_COLORS[m.status]}`}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:8}}>
                        <span style={{fontWeight:700,fontSize:14,flex:"1 1 180px",minWidth:0}}>{m.func}</span>
                        <span style={{fontSize:11,color:theme.textMut}}>{m.headUser?uName(m.headUser):(m.headText||"No head")}</span>
                        {m.hoursNeeded>0&&<span style={{fontFamily:FONT_MONO,fontSize:11,color:theme.textMut}}>{m.hoursNeeded}h/wk</span>}
                        <Badge label={m.status} color={MOC_STATUS_COLORS[m.status]}/>
                        {m.confirmed?<Badge label="Confirmed" color={theme.green}/>:<Badge label="Unconfirmed" color={theme.orange}/>}
                        <Btn theme={theme} small onClick={()=>openM("editMocItem",{...m})}><Edit3 size={12}/> Edit</Btn>
                      </div>
                      {m.minimum&&<div style={{marginBottom:6}}>
                        <div style={{fontSize:9,color:theme.teal,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>Minimum required</div>
                        <p style={{fontSize:12,color:theme.textSec,margin:0,lineHeight:1.5}}>{m.minimum}</p>
                      </div>}
                      {m.currentState&&<div style={{marginBottom:6}}>
                        <div style={{fontSize:9,color:theme.textMut,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>Currently</div>
                        <p style={{fontSize:12,color:theme.textMut,margin:0,lineHeight:1.5}}>{m.currentState}</p>
                      </div>}
                      {m.gap&&<div style={{padding:"8px 10px",background:`${theme.orange}0d`,borderRadius:6,marginTop:6}}>
                        <div style={{fontSize:9,color:theme.orange,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>Gap</div>
                        <p style={{fontSize:12,color:theme.textSec,margin:0,lineHeight:1.5}}>{m.gap}</p>
                      </div>}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            {mocItems.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No functions mapped yet.</p>}
          </div>}

          {/* ── INVESTORS ── */}
          {bizTab==="investors"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <p style={{fontSize:13,color:theme.textSec,margin:0}}>Fundraising pipeline. Track every conversation from first intro to committed.</p>
              <div style={{display:"flex",gap:6}}>
                {investors.length>0&&<Btn theme={theme} small onClick={()=>{
                  const rows=[["Name","Firm","Type","Stage","Check Size","Owner","Contact","Next Step","Next Date","Notes"]];
                  investors.forEach(i=>rows.push([i.name||"",i.firm||"",i.type||"",i.stage||"",i.checkSize||"",uName(i.owner),i.contactEmail||"",i.nextStep||"",i.nextDate||"",i.notes||""]));
                  exportCSV(rows,`nanu-investor-pipeline-${new Date().toISOString().slice(0,10)}.csv`);
                }}><Download size={12}/> CSV</Btn>}
                <Btn primary theme={theme} small onClick={()=>openM("editInvestor",{name:"",firm:"",type:"Angel",stage:"Researching",checkSize:"",owner:curUser.id,contactName:"",contactEmail:"",nextStep:"",nextDate:"",warmIntro:"",notes:""})}><Plus size={13}/> Add Investor</Btn>
              </div>
            </div>

            {/* Pipeline summary */}
            <div className="nanu-grid-summary" style={{marginBottom:16}}>
              <Card theme={theme} style={{padding:12,textAlign:"center"}}>
                <div className="nanu-big-num" style={{fontSize:22,color:theme.teal}}>{investors.filter(i=>!["Passed"].includes(i.stage)).length}</div>
                <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>Live Conversations</div>
              </Card>
              <Card theme={theme} style={{padding:12,textAlign:"center"}}>
                <div className="nanu-big-num" style={{fontSize:22,color:theme.yellow}}>{investors.filter(i=>["In Diligence","Term Sheet"].includes(i.stage)).length}</div>
                <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>Advanced</div>
              </Card>
              <Card theme={theme} style={{padding:12,textAlign:"center"}}>
                <div className="nanu-big-num" style={{fontSize:22,color:theme.green}}>{investors.filter(i=>i.stage==="Committed").length}</div>
                <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>Committed</div>
              </Card>
              <Card theme={theme} style={{padding:12,textAlign:"center"}}>
                <div className="nanu-big-num" style={{fontSize:22,color:theme.textMut}}>{investors.filter(i=>i.stage==="Passed").length}</div>
                <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>Passed</div>
              </Card>
            </div>

            {/* Grouped by stage */}
            {INVESTOR_STAGES.filter(s=>investors.some(i=>i.stage===s)).map(stage=>(
              <div key={stage} style={{marginBottom:18}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:INVESTOR_STAGE_COLORS[stage]}}/>
                  <span style={{fontSize:12,fontWeight:600,color:theme.textSec,textTransform:"uppercase",letterSpacing:".04em"}}>{stage}</span>
                  <span style={{fontSize:11,color:theme.textMut,background:theme.bgInput,padding:"1px 8px",borderRadius:8}}>{investors.filter(i=>i.stage===stage).length}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {investors.filter(i=>i.stage===stage).map(i=>(
                    <Card key={i.id} theme={theme} style={{padding:14,borderLeft:`3px solid ${INVESTOR_STAGE_COLORS[i.stage]}`}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                        <div style={{flex:"1 1 200px",minWidth:0}}>
                          <div style={{fontWeight:700,fontSize:14}}>{i.name||"Unnamed"}{i.firm&&<span style={{fontWeight:400,color:theme.textMut}}> · {i.firm}</span>}</div>
                          {i.contactName&&<div style={{fontSize:12,color:theme.textMut}}>{i.contactName}{i.contactEmail?` · ${i.contactEmail}`:""}</div>}
                        </div>
                        {i.type&&<Badge label={i.type} color={theme.textMut}/>}
                        {i.checkSize&&<span style={{fontFamily:FONT_MONO,fontSize:12,color:theme.green,fontWeight:700}}>{i.checkSize}</span>}
                        <span style={{fontSize:11,color:theme.textMut}}>{uName(i.owner)}</span>
                        <Btn theme={theme} small onClick={()=>openM("editInvestor",{...i})}><Edit3 size={12}/> Edit</Btn>
                      </div>
                      {(i.nextStep||i.nextDate)&&<div style={{fontSize:12,color:theme.textSec,marginTop:8,display:"flex",alignItems:"center",gap:6}}>
                        <Clock size={11} color={theme.orange}/>
                        <span>{i.nextStep||"Next step"}</span>
                        {i.nextDate&&<span style={{fontFamily:FONT_MONO,fontSize:11,color:i.nextDate<todayStr?theme.red:theme.textMut}}>{i.nextDate}</span>}
                      </div>}
                      {i.warmIntro&&<div style={{fontSize:11,color:theme.textMut,marginTop:4}}>Intro via: {i.warmIntro}</div>}
                      {i.notes&&<p style={{fontSize:12,color:theme.textMut,marginTop:6,lineHeight:1.5}}>{i.notes}</p>}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            {investors.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No investors tracked yet. Click "Add Investor" to build your pipeline.</p>}
          </div>}

          {/* ── BOARD UPDATES ── */}
          {bizTab==="board"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <p style={{fontSize:13,color:theme.textSec,margin:0}}>Investor and board reporting. Draft, review, then mark sent.</p>
              <Btn primary theme={theme} small onClick={()=>openM("editBoardUpdate",{title:"",period:"",date:new Date().toISOString().split("T")[0],status:"Draft",author:curUser.id,highlights:"",lowlights:"",asks:"",metricsSnapshot:"",link:""})}><Plus size={13}/> New Update</Btn>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[...boardUpdates].sort((a,b)=>(b.date||"").localeCompare(a.date||"")).map(b=>(
                <Card key={b.id} theme={theme} style={{padding:16,borderLeft:`3px solid ${BOARD_UPDATE_STATUS_COLORS[b.status]}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:6}}>
                    <span style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:15,flex:"1 1 200px"}}>{b.title||"Untitled update"}</span>
                    <Badge label={b.status} color={BOARD_UPDATE_STATUS_COLORS[b.status]}/>
                    {b.period&&<Badge label={b.period} color={theme.textMut}/>}
                    <span style={{fontFamily:FONT_MONO,fontSize:11,color:theme.textMut}}>{b.date}</span>
                    <Btn theme={theme} small onClick={()=>openM("editBoardUpdate",{...b})}><Edit3 size={12}/> Edit</Btn>
                  </div>
                  {b.highlights&&<div style={{marginTop:8}}>
                    <div style={{fontSize:10,fontWeight:700,color:theme.green,textTransform:"uppercase",letterSpacing:".04em",marginBottom:3}}>Highlights</div>
                    <p style={{fontSize:12,color:theme.textSec,margin:0,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{b.highlights}</p>
                  </div>}
                  {b.lowlights&&<div style={{marginTop:8}}>
                    <div style={{fontSize:10,fontWeight:700,color:theme.orange,textTransform:"uppercase",letterSpacing:".04em",marginBottom:3}}>Challenges</div>
                    <p style={{fontSize:12,color:theme.textSec,margin:0,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{b.lowlights}</p>
                  </div>}
                  {b.asks&&<div style={{marginTop:8}}>
                    <div style={{fontSize:10,fontWeight:700,color:theme.teal,textTransform:"uppercase",letterSpacing:".04em",marginBottom:3}}>Asks</div>
                    <p style={{fontSize:12,color:theme.textSec,margin:0,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{b.asks}</p>
                  </div>}
                  <div style={{display:"flex",gap:10,alignItems:"center",marginTop:10,fontSize:11,color:theme.textMut}}>
                    <span>By {uName(b.author)}</span>
                    {b.link&&<a href={b.link} target="_blank" rel="noopener noreferrer" style={{color:theme.teal,display:"flex",alignItems:"center",gap:3}}><ExternalLink size={10}/> Full document</a>}
                  </div>
                </Card>
              ))}
              {boardUpdates.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No board updates yet. Click "New Update" to draft your first.</p>}
            </div>
          </div>}

          {/* ── STRATEGIC INITIATIVES ── */}
          {bizTab==="initiatives"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <p style={{fontSize:13,color:theme.textSec,margin:0}}>Company-level goals and strategic bets, separate from day-to-day projects.</p>
              <Btn primary theme={theme} small onClick={()=>openM("editInitiative",{title:"",description:"",owner:curUser.id,status:"Not Started",horizon:"This Quarter",progress:0,targetDate:"",successMetric:"",notes:""})}><Plus size={13}/> Add Initiative</Btn>
            </div>

            <div className="nanu-grid-summary" style={{marginBottom:16}}>
              {["On Track","At Risk","Off Track","Achieved"].map(s=>(
                <Card key={s} theme={theme} style={{padding:12,textAlign:"center"}}>
                  <div className="nanu-big-num" style={{fontSize:22,color:INITIATIVE_STATUS_COLORS[s]}}>{initiatives.filter(i=>i.status===s).length}</div>
                  <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>{s}</div>
                </Card>
              ))}
            </div>

            {INITIATIVE_HORIZONS.filter(h=>initiatives.some(i=>i.horizon===h)).map(hz=>(
              <div key={hz} style={{marginBottom:18}}>
                <div style={{fontSize:12,fontWeight:600,color:theme.textSec,marginBottom:8,textTransform:"uppercase",letterSpacing:".04em"}}>{hz}</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {initiatives.filter(i=>i.horizon===hz).map(i=>(
                    <Card key={i.id} theme={theme} style={{padding:14,borderLeft:`3px solid ${INITIATIVE_STATUS_COLORS[i.status]}`}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                        <span style={{fontWeight:700,fontSize:14,flex:"1 1 200px",minWidth:0}}>{i.title||"Untitled initiative"}</span>
                        <Badge label={i.status} color={INITIATIVE_STATUS_COLORS[i.status]}/>
                        <span style={{fontSize:11,color:theme.textMut}}>{uName(i.owner)}</span>
                        {i.targetDate&&<span style={{fontFamily:FONT_MONO,fontSize:11,color:i.targetDate<todayStr&&!["Achieved","Dropped"].includes(i.status)?theme.red:theme.textMut}}>{i.targetDate}</span>}
                        <Btn theme={theme} small onClick={()=>openM("editInitiative",{...i})}><Edit3 size={12}/> Edit</Btn>
                      </div>
                      {i.description&&<p style={{fontSize:12,color:theme.textSec,margin:"6px 0 0",lineHeight:1.5}}>{i.description}</p>}
                      <div style={{marginTop:10}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
                          <span style={{color:theme.textMut}}>{i.successMetric||"Progress"}</span>
                          <span style={{color:INITIATIVE_STATUS_COLORS[i.status],fontWeight:700,fontFamily:FONT_MONO}}>{i.progress||0}%</span>
                        </div>
                        <div style={{height:6,background:theme.bgInput,borderRadius:3,overflow:"hidden"}}>
                          <div style={{width:`${Math.min(100,i.progress||0)}%`,height:"100%",background:INITIATIVE_STATUS_COLORS[i.status],borderRadius:3,transition:"width .4s"}}/>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            {initiatives.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No initiatives yet. Click "Add Initiative" to set company goals.</p>}
          </div>}

          {/* ── DOCUMENTS ── */}
          {bizTab==="documents"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <p style={{fontSize:13,color:theme.textSec,margin:0}}>Key company documents. Stored in Drive — this is the index of where everything lives.</p>
              <div style={{display:"flex",gap:6}}>
                {bizDocs.length>0&&<Btn theme={theme} small onClick={()=>{
                  const rows=[["Title","Category","Status","Version","Owner","Effective","Expires","Confidential","Link","Notes"]];
                  bizDocs.forEach(d=>rows.push([d.title||"",d.category||"",d.status||"",d.version||"",uName(d.owner),d.effectiveDate||"",d.expiryDate||"",d.confidential?"YES":"",d.link||"",d.notes||""]));
                  exportCSV(rows,`nanu-documents-${new Date().toISOString().slice(0,10)}.csv`);
                }}><Download size={12}/> CSV</Btn>}
                <Btn primary theme={theme} small onClick={()=>openM("editBizDoc",{title:"",category:"Legal",status:"Draft",version:"",owner:curUser.id,link:"",effectiveDate:"",expiryDate:"",confidential:false,notes:""})}><Plus size={13}/> Add Document</Btn>
              </div>
            </div>

            {/* Expiring soon */}
            {(()=>{
              const soon=bizDocs.filter(d=>d.expiryDate&&d.expiryDate>=todayStr&&daysBetween(todayStr,d.expiryDate)<=60);
              const expired=bizDocs.filter(d=>d.expiryDate&&d.expiryDate<todayStr&&d.status!=="Archived");
              if(soon.length===0&&expired.length===0) return null;
              return <Card theme={theme} style={{padding:14,marginBottom:16,borderLeft:`3px solid ${expired.length?theme.red:theme.orange}`}}>
                <div style={{fontSize:11,fontWeight:700,color:expired.length?theme.red:theme.orange,textTransform:"uppercase",letterSpacing:".04em",marginBottom:8}}>Needs Attention</div>
                {expired.map(d=>(<div key={d.id} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,padding:"3px 0"}}>
                  <AlertTriangle size={12} color={theme.red}/><span style={{flex:1}}>{d.title}</span><span style={{color:theme.red,fontFamily:FONT_MONO,fontSize:11}}>expired {d.expiryDate}</span>
                </div>))}
                {soon.map(d=>(<div key={d.id} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,padding:"3px 0"}}>
                  <Clock size={12} color={theme.orange}/><span style={{flex:1}}>{d.title}</span><span style={{color:theme.orange,fontFamily:FONT_MONO,fontSize:11}}>{daysBetween(todayStr,d.expiryDate)}d left</span>
                </div>))}
              </Card>;
            })()}

            {/* Grouped by category */}
            {DOC_CATEGORIES.filter(c=>bizDocs.some(d=>d.category===c)).map(cat=>(
              <div key={cat} style={{marginBottom:18}}>
                <div style={{fontSize:12,fontWeight:600,color:theme.textSec,marginBottom:8,textTransform:"uppercase",letterSpacing:".04em"}}>{cat} <span style={{color:theme.textMut}}>· {bizDocs.filter(d=>d.category===cat).length}</span></div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {bizDocs.filter(d=>d.category===cat).map(d=>(
                    <Card key={d.id} theme={theme} style={{padding:14,borderLeft:`3px solid ${DOC_STATUS_COLORS[d.status]||theme.border}`}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                        <div style={{flex:"1 1 200px",minWidth:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <span style={{fontWeight:700,fontSize:14}}>{d.title||"Untitled document"}</span>
                            {d.confidential&&<Lock size={11} color={theme.yellow}/>}
                          </div>
                          {d.notes&&<div style={{fontSize:12,color:theme.textMut,marginTop:2}}>{d.notes}</div>}
                        </div>
                        {d.version&&<span style={{fontFamily:FONT_MONO,fontSize:11,color:theme.textMut}}>v{d.version}</span>}
                        <Badge label={d.status} color={DOC_STATUS_COLORS[d.status]}/>
                        <span style={{fontSize:11,color:theme.textMut}}>{uName(d.owner)}</span>
                        {d.link&&<a href={d.link} target="_blank" rel="noopener noreferrer" style={{color:theme.teal,display:"flex",alignItems:"center",gap:3,fontSize:12}}><ExternalLink size={12}/> Open</a>}
                        <Btn theme={theme} small onClick={()=>openM("editBizDoc",{...d})}><Edit3 size={12}/> Edit</Btn>
                      </div>
                      {(d.effectiveDate||d.expiryDate)&&<div style={{fontSize:11,color:theme.textMut,marginTop:6,fontFamily:FONT_MONO}}>
                        {d.effectiveDate&&`Effective ${d.effectiveDate}`}{d.effectiveDate&&d.expiryDate&&" · "}{d.expiryDate&&<span style={{color:d.expiryDate<todayStr?theme.red:theme.textMut}}>Expires {d.expiryDate}</span>}
                      </div>}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            {bizDocs.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No documents indexed yet. Click "Add Document" to start.</p>}
          </div>}
        </div>
      );
    }

    /* ─── MEETINGS & ACTION POINTS ─── */
    case "meetings": {
      const myActions = meetingActions.filter(a=>a.owner===curUser.id&&a.status!=="Done"&&a.status!=="Dropped");
      const openActions = meetingActions.filter(a=>a.status==="Open"||a.status==="In progress");
      const mTitle = (id) => meetings.find(m=>m.id===id)?.title || "";
      const mDate = (id) => meetings.find(m=>m.id===id)?.date || "";
      const setActionStatus = (a, status) => {
        const upd = {...a, status};
        setMeetingActions(prev=>prev.map(x=>x.id===a.id?upd:x));
        db.saveMeetingAction(upd);
      };
      const pushToTask = (a) => {
        const nt = { id:uid("t"), title:a.text, owners:a.owner?[a.owner]:[], status:"Not Started", priority:"Medium",
          dueDate:a.dueDate||"", blocker:"", notes:`Action point from ${mTitle(a.meetingId)}${mDate(a.meetingId)?" on "+mDate(a.meetingId):""}`,
          context:`Agreed in ${mTitle(a.meetingId)}.`, contactName:"", contactDetail:"", outcome:"", linkedContent:"", project:"", updates:[],
          createdBy:curUser.id, createdDate:todayStr };
        setTasks(prev=>[...prev,nt]); db.saveTask(nt);
        const upd={...a, taskId:nt.id};
        setMeetingActions(prev=>prev.map(x=>x.id===a.id?upd:x)); db.saveMeetingAction(upd);
        log("created task from action point", a.text, "Meetings");
      };

      return (
        <div>
          <SectionHead theme={theme} right={<>
            <Btn theme={theme} onClick={()=>openM("importMeeting",{raw:"",title:"",date:todayStr,type:"Exec",source:"Read.ai",_parsed:null})}><Download size={14}/> Import notes</Btn>
            <Btn primary theme={theme} onClick={()=>openM("editMeeting",{title:"",date:todayStr,type:"Exec",attendees:[],summary:"",decisions:"",recordingUrl:"",source:"",notes:""})}><Plus size={14}/> Add Meeting</Btn>
          </>}>Meetings & Action Points</SectionHead>

          {/* My actions */}
          {myActions.length>0&&<Card theme={theme} style={{padding:16,marginBottom:16,borderLeft:`3px solid ${theme.teal}`}}>
            <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:15,marginBottom:10}}>Your action points ({myActions.length})</div>
            {myActions.map(a=>(
              <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:`1px solid ${theme.borderLight}`,flexWrap:"wrap"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:MACTION_STATUS_COLORS[a.status],flexShrink:0}}/>
                <span style={{fontSize:13,flex:"1 1 220px",minWidth:0}}>{a.text}</span>
                <span style={{fontSize:11,color:theme.textMut}}>{mTitle(a.meetingId)}</span>
                {a.dueDate&&<span style={{fontFamily:FONT_MONO,fontSize:11,color:a.dueDate<todayStr?theme.red:theme.textMut}}>{a.dueDate}</span>}
                <Btn theme={theme} small onClick={()=>setActionStatus(a,"Done")}><Check size={12}/> Done</Btn>
              </div>
            ))}
          </Card>}

          {/* View switcher */}
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            <div style={{display:"flex",background:theme.bgInput,borderRadius:8,border:`1px solid ${theme.border}`,overflow:"hidden"}}>
              {[["actions",`All actions${openActions.length?" ("+openActions.length+")":""}`],["meetings","Meetings"]].map(([k,l])=>(
                <button key={k} onClick={()=>setMeetingView(k)} style={{padding:"6px 12px",border:"none",fontSize:12,background:meetingView===k?theme.teal:"transparent",color:meetingView===k?"#0D1B21":theme.textSec,cursor:"pointer",fontWeight:600}}>{l}</button>
              ))}
            </div>
          </div>

          {/* ── ALL ACTIONS ── */}
          {meetingView==="actions"&&<div>
            {users.filter(u=>meetingActions.some(a=>a.owner===u.id&&a.status!=="Done"&&a.status!=="Dropped")).map(u=>(
              <div key={u.id} style={{marginBottom:18}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <span style={{fontSize:12,fontWeight:600,color:theme.textSec,textTransform:"uppercase",letterSpacing:".04em"}}>{u.name}</span>
                  <span style={{fontSize:11,color:theme.textMut,background:theme.bgInput,padding:"1px 8px",borderRadius:8}}>{meetingActions.filter(a=>a.owner===u.id&&a.status!=="Done"&&a.status!=="Dropped").length}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {meetingActions.filter(a=>a.owner===u.id&&a.status!=="Done"&&a.status!=="Dropped").map(a=>(
                    <Card key={a.id} theme={theme} style={{padding:12,borderLeft:`3px solid ${MACTION_STATUS_COLORS[a.status]}`}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                        <span style={{fontSize:13,flex:"1 1 220px",minWidth:0}}>{a.text}</span>
                        <span style={{fontSize:11,color:theme.textMut}}>{mTitle(a.meetingId)}{mDate(a.meetingId)?` · ${mDate(a.meetingId)}`:""}</span>
                        {a.dueDate&&<span style={{fontFamily:FONT_MONO,fontSize:11,color:a.dueDate<todayStr?theme.red:theme.textMut}}>{a.dueDate}</span>}
                        <select value={a.status} onChange={e=>setActionStatus(a,e.target.value)} style={{fontSize:11,padding:"3px 6px",borderRadius:6,border:`1px solid ${theme.border}`,background:theme.bgInput,color:MACTION_STATUS_COLORS[a.status],cursor:"pointer",fontWeight:700}}>
                          {MACTION_STATUS.map(s=><option key={s} value={s}>{s}</option>)}
                        </select>
                        {a.taskId?<span title="Task created" style={{fontSize:10,color:theme.green,display:"flex",alignItems:"center",gap:3}}><CheckSquare size={11}/> task</span>
                          :<Btn theme={theme} small onClick={()=>pushToTask(a)}><Plus size={11}/> Task</Btn>}
                        <Btn theme={theme} small onClick={()=>openM("editMeetingAction",{...a})}><Edit3 size={11}/></Btn>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            {(()=>{const un=meetingActions.filter(a=>!a.owner&&a.status!=="Done"&&a.status!=="Dropped");
              return un.length>0&&<div style={{marginBottom:18}}>
                <div style={{fontSize:12,fontWeight:600,color:theme.orange,marginBottom:8,textTransform:"uppercase",letterSpacing:".04em"}}>Unassigned · {un.length}</div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {un.map(a=>(
                    <Card key={a.id} theme={theme} style={{padding:12,borderLeft:`3px solid ${theme.orange}`}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                        <span style={{fontSize:13,flex:"1 1 220px",minWidth:0}}>{a.text}</span>
                        {a.ownerText&&<span style={{fontSize:11,color:theme.textMut,fontStyle:"italic"}}>{a.ownerText}</span>}
                        <span style={{fontSize:11,color:theme.textMut}}>{mTitle(a.meetingId)}</span>
                        <Btn theme={theme} small onClick={()=>openM("editMeetingAction",{...a})}><Edit3 size={11}/> Assign</Btn>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>;})()}
            {openActions.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No open action points. Import a set of meeting notes to get started.</p>}
          </div>}

          {/* ── MEETINGS ── */}
          {meetingView==="meetings"&&<div style={{display:"flex",flexDirection:"column",gap:8}}>
            {meetings.map(m=>{
              const acts=meetingActions.filter(a=>a.meetingId===m.id);
              const openN=acts.filter(a=>a.status==="Open"||a.status==="In progress").length;
              return <Card key={m.id} theme={theme} style={{padding:16,borderLeft:`3px solid ${MEETING_TYPE_COLORS[m.type]||theme.teal}`}}>
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:6}}>
                  <span style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:15,flex:"1 1 200px",minWidth:0}}>{m.title}</span>
                  <Badge label={m.type} color={MEETING_TYPE_COLORS[m.type]}/>
                  {m.source&&<Badge label={m.source} color={theme.textMut}/>}
                  <span style={{fontFamily:FONT_MONO,fontSize:11,color:theme.textMut}}>{m.date}</span>
                  {acts.length>0&&<span style={{fontSize:11,color:openN>0?theme.orange:theme.green,fontWeight:600}}>{openN>0?`${openN} open`:"all done"} · {acts.length} actions</span>}
                  {m.recordingUrl&&<a href={m.recordingUrl} target="_blank" rel="noopener noreferrer" style={{color:theme.teal,display:"flex"}}><ExternalLink size={12}/></a>}
                  <Btn theme={theme} small onClick={()=>openM("editMeeting",{...m})}><Edit3 size={11}/></Btn>
                </div>
                {m.summary&&<p style={{fontSize:12,color:theme.textSec,margin:"6px 0 0",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{m.summary}</p>}
                {m.decisions&&<div style={{marginTop:8,padding:"8px 12px",background:theme.bgInput,borderRadius:8}}>
                  <div style={{fontSize:9,color:theme.teal,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>Decisions</div>
                  <p style={{fontSize:12,color:theme.textSec,margin:0,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{m.decisions}</p>
                </div>}
                {acts.length>0&&<div style={{marginTop:10,display:"flex",flexDirection:"column",gap:4}}>
                  {acts.map(a=>(
                    <div key={a.id} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,paddingLeft:4}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:MACTION_STATUS_COLORS[a.status],flexShrink:0}}/>
                      <span style={{flex:1,color:theme.textSec,textDecoration:a.status==="Done"?"line-through":"none",opacity:a.status==="Done"?0.6:1}}>{a.text}</span>
                      <span style={{fontSize:11,color:theme.textMut}}>{a.owner?uName(a.owner):(a.ownerText||"Unassigned")}</span>
                      {a.dueDate&&<span style={{fontFamily:FONT_MONO,fontSize:10,color:theme.textMut}}>{a.dueDate}</span>}
                    </div>
                  ))}
                </div>}
                <Btn theme={theme} small onClick={()=>openM("editMeetingAction",{meetingId:m.id,text:"",owner:"",ownerText:"",dueDate:"",status:"Open",taskId:"",notes:""})} style={{marginTop:10}}><Plus size={11}/> Add action point</Btn>
              </Card>;
            })}
            {meetings.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No meetings logged yet.</p>}
          </div>}
        </div>
      );
    }

    /* ─── APP ROADMAP ─── */
    case "roadmap": {
      const canEditRoadmap = isAdmin || isExec;
      const rmFiltered = rmArea==="All" ? roadmapItems : roadmapItems.filter(r=>r.area===rmArea);
      const inBucket = (b) => rmFiltered.filter(r=>r.bucket===b).sort((a,b2)=>(a.sortOrder||0)-(b2.sortOrder||0));
      const requests = rmFiltered.filter(r=>r.bucket==="Requested");
      const shipped = rmFiltered.filter(r=>r.bucket==="Shipped").sort((a,b)=>(b.shippedDate||"").localeCompare(a.shippedDate||""));
      const moveBucket = (item, bucket) => {
        const upd = {...item, bucket, ...(bucket==="Shipped"&&!item.shippedDate?{shippedDate:todayStr,progress:100}:{})};
        setRoadmapItems(prev=>prev.map(x=>x.id===item.id?upd:x));
        db.saveRoadmapItem(upd);
        log("moved",`${item.title} to ${bucket}`,"Roadmap");
      };

      const RmCard = ({item, showBucketPicker}) => (
        <Card theme={theme} style={{padding:13,borderLeft:`3px solid ${RM_BUCKET_COLORS[item.bucket]}`}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:8,flexWrap:"wrap"}}>
            <span onClick={()=>canEditRoadmap?openM("editRoadmapItem",{...item}):null} style={{fontWeight:700,fontSize:13,flex:"1 1 150px",minWidth:0,cursor:canEditRoadmap?"pointer":"default"}}>{item.title}</span>
            {item.priority&&item.bucket!=="Shipped"&&<Badge label={item.priority} color={RM_PRIORITY_COLORS[item.priority]}/>}
          </div>
          {item.description&&<p style={{fontSize:12,color:theme.textSec,margin:"5px 0 0",lineHeight:1.5}}>{item.description}</p>}
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginTop:8,fontSize:11,color:theme.textMut}}>
            {item.area&&<Badge label={item.area} color={theme.textMut}/>}
            {item.effort&&<span style={{fontFamily:FONT_MONO}}>{item.effort}</span>}
            {item.owner&&<span>{uName(item.owner)}</span>}
            {item.targetQuarter&&<span style={{fontFamily:FONT_MONO,color:theme.tealLt}}>{item.targetQuarter}</span>}
            {item.shippedDate&&<span style={{fontFamily:FONT_MONO,color:theme.green}}>{item.shippedDate}</span>}
            {item.releaseTag&&<Badge label={item.releaseTag} color={theme.green}/>}
          </div>
          {item.bucket==="Now"&&<div style={{marginTop:8}}>
            <div style={{height:4,background:theme.bgInput,borderRadius:2,overflow:"hidden"}}>
              <div style={{width:`${item.progress||0}%`,height:"100%",background:theme.green,transition:"width .4s"}}/>
            </div>
            <div style={{fontSize:9,color:theme.textMut,marginTop:2}}>{item.progress||0}%</div>
          </div>}
          {canEditRoadmap&&showBucketPicker&&<div style={{display:"flex",gap:4,marginTop:9,flexWrap:"wrap"}}>
            {RM_BUCKETS.filter(b=>b!==item.bucket).map(b=>(
              <button key={b} onClick={()=>moveBucket(item,b)} style={{background:"transparent",border:`1px solid ${RM_BUCKET_COLORS[b]}55`,borderRadius:6,padding:"2px 7px",cursor:"pointer",color:RM_BUCKET_COLORS[b],fontSize:10,fontWeight:600}}>{b}</button>
            ))}
            <button onClick={()=>openM("editRoadmapItem",{...item})} style={{background:"none",border:"none",cursor:"pointer",color:theme.textMut,padding:"2px"}}><Edit3 size={11}/></button>
          </div>}
        </Card>
      );

      return (
        <div>
          <SectionHead theme={theme} right={<>
            <Sel theme={theme} options={["All",...RM_AREAS].map(a=>({value:a,label:a==="All"?"All areas":a}))} value={rmArea} onChange={e=>setRmArea(e.target.value)} style={{width:"auto",fontSize:13,padding:"6px 10px"}}/>
            <Btn theme={theme} onClick={()=>openM("editRoadmapItem",{title:"",description:"",area:RM_AREAS[0],bucket:"Requested",owner:"",priority:"Medium",effort:"",progress:0,targetQuarter:"",targetDate:"",shippedDate:"",releaseTag:"",requestedBy:curUser.id,requestedDate:todayStr,why:"",decisionNote:"",linkedTasks:[],sortOrder:(roadmapItems.length+1)*10,notes:""})}><Plus size={14}/> Request something</Btn>
            {canEditRoadmap&&<Btn primary theme={theme} onClick={()=>openM("editRoadmapItem",{title:"",description:"",area:RM_AREAS[0],bucket:"Next",owner:"",priority:"Medium",effort:"M",progress:0,targetQuarter:"",targetDate:"",shippedDate:"",releaseTag:"",requestedBy:"",requestedDate:"",why:"",decisionNote:"",linkedTasks:[],sortOrder:(roadmapItems.length+1)*10,notes:""})}><Plus size={14}/> Add to Roadmap</Btn>}
          </>}>App Roadmap</SectionHead>

          <p style={{fontSize:13,color:theme.textSec,marginBottom:14,maxWidth:680,lineHeight:1.6}}>What is being built, what is committed next, and what direction we have agreed. Requests go in writing here — that is the one channel.</p>

          {/* View switcher */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",background:theme.bgInput,borderRadius:8,border:`1px solid ${theme.border}`,overflow:"hidden"}}>
              {[["board","Now / Next / Later"],["timeline","By Quarter"],["requests",`Requests${requests.length?" ("+requests.length+")":""}`],["shipped","Shipped"]].map(([k,l])=>(
                <button key={k} onClick={()=>setRmView(k)} style={{padding:"6px 12px",border:"none",fontSize:12,background:rmView===k?theme.teal:"transparent",color:rmView===k?"#0D1B21":theme.textSec,cursor:"pointer",fontWeight:600}}>{l}</button>
              ))}
            </div>
            {!canEditRoadmap&&<span style={{fontSize:11,color:theme.textMut,display:"flex",alignItems:"center",gap:5}}><Lock size={11}/> View only — anyone can submit a request</span>}
          </div>

          {/* ── BOARD ── */}
          {rmView==="board"&&<div className="nanu-grid-2col" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {RM_BOARD_BUCKETS.map(b=>(
              <div key={b}>
                <div style={{marginBottom:10,paddingBottom:8,borderBottom:`2px solid ${RM_BUCKET_COLORS[b]}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontFamily:FONT_DISPLAY,fontWeight:800,fontSize:16,color:RM_BUCKET_COLORS[b]}}>{b}</span>
                    <span style={{fontSize:11,color:theme.textMut,marginLeft:"auto"}}>{inBucket(b).length}</span>
                  </div>
                  <div style={{fontSize:11,color:theme.textMut,marginTop:2}}>{RM_BUCKET_BLURB[b]}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {inBucket(b).map(item=><RmCard key={item.id} item={item} showBucketPicker={true}/>)}
                  {inBucket(b).length===0&&<div style={{fontSize:11,color:theme.textMut,textAlign:"center",padding:"18px 0",border:`1px dashed ${theme.border}`,borderRadius:8}}>Nothing here</div>}
                </div>
              </div>
            ))}
          </div>}

          {/* ── TIMELINE ── */}
          {rmView==="timeline"&&<div>
            {(()=>{
              const qs=[...new Set(rmFiltered.filter(r=>r.targetQuarter&&r.bucket!=="Requested"&&r.bucket!=="Parked").map(r=>r.targetQuarter))].sort();
              const noQ=rmFiltered.filter(r=>!r.targetQuarter&&["Now","Next","Later"].includes(r.bucket));
              return <>
                {qs.map(q=>(
                  <div key={q} style={{marginBottom:20}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                      <span style={{fontFamily:FONT_DISPLAY,fontWeight:800,fontSize:17,color:theme.teal}}>{q}</span>
                      <div style={{flex:1,height:1,background:theme.border}}/>
                      <span style={{fontSize:11,color:theme.textMut}}>{rmFiltered.filter(r=>r.targetQuarter===q).length} items</span>
                    </div>
                    <div className="nanu-grid-2col">
                      {rmFiltered.filter(r=>r.targetQuarter===q).map(item=><RmCard key={item.id} item={item} showBucketPicker={false}/>)}
                    </div>
                  </div>
                ))}
                {noQ.length>0&&<div style={{marginBottom:20}}>
                  <div style={{fontSize:12,fontWeight:600,color:theme.textMut,marginBottom:10,textTransform:"uppercase",letterSpacing:".04em"}}>No quarter set</div>
                  <div className="nanu-grid-2col">{noQ.map(item=><RmCard key={item.id} item={item} showBucketPicker={false}/>)}</div>
                </div>}
                {qs.length===0&&noQ.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>Nothing scheduled yet. Set a target quarter on roadmap items to see them here.</p>}
              </>;
            })()}
          </div>}

          {/* ── REQUESTS ── */}
          {rmView==="requests"&&<div>
            <p style={{fontSize:12,color:theme.textSec,marginBottom:12,lineHeight:1.6}}>Anything asked for that has not been triaged yet. Requests arrive in writing here, or they do not exist.</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {requests.map(item=>(
                <Card key={item.id} theme={theme} style={{padding:14,borderLeft:`3px solid ${RM_BUCKET_COLORS.Requested}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <span style={{fontWeight:700,fontSize:14,flex:"1 1 200px",minWidth:0}}>{item.title}</span>
                    {item.area&&<Badge label={item.area} color={theme.textMut}/>}
                    <span style={{fontSize:11,color:theme.textMut}}>{item.requestedBy?uName(item.requestedBy):"—"}{item.requestedDate?` · ${item.requestedDate}`:""}</span>
                  </div>
                  {item.description&&<p style={{fontSize:12,color:theme.textSec,margin:"6px 0 0",lineHeight:1.5}}>{item.description}</p>}
                  {item.why&&<div style={{marginTop:8,padding:"8px 12px",background:theme.bgInput,borderRadius:8}}>
                    <div style={{fontSize:9,color:theme.teal,fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>Why it matters</div>
                    <p style={{fontSize:12,color:theme.textSec,margin:0,lineHeight:1.5}}>{item.why}</p>
                  </div>}
                  {canEditRoadmap&&<div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap",alignItems:"center"}}>
                    <span style={{fontSize:11,color:theme.textMut}}>Triage to:</span>
                    {["Now","Next","Later","Parked"].map(b=>(
                      <button key={b} onClick={()=>moveBucket(item,b)} style={{background:"transparent",border:`1px solid ${RM_BUCKET_COLORS[b]}`,borderRadius:6,padding:"3px 10px",cursor:"pointer",color:RM_BUCKET_COLORS[b],fontSize:11,fontWeight:600}}>{b}</button>
                    ))}
                    <Btn theme={theme} small onClick={()=>openM("editRoadmapItem",{...item})}><Edit3 size={11}/> Edit</Btn>
                  </div>}
                </Card>
              ))}
              {requests.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No untriaged requests.</p>}
            </div>
          </div>}

          {/* ── SHIPPED ── */}
          {rmView==="shipped"&&<div>
            <p style={{fontSize:12,color:theme.textSec,marginBottom:12,lineHeight:1.6}}>What has actually gone out, newest first.</p>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {shipped.map(item=>(
                <Card key={item.id} theme={theme} style={{padding:13,borderLeft:`3px solid ${theme.green}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <Check size={14} color={theme.green}/>
                    <span style={{fontWeight:600,fontSize:13,flex:"1 1 200px",minWidth:0}}>{item.title}</span>
                    {item.area&&<Badge label={item.area} color={theme.textMut}/>}
                    {item.releaseTag&&<Badge label={item.releaseTag} color={theme.green}/>}
                    <span style={{fontFamily:FONT_MONO,fontSize:11,color:theme.textMut}}>{item.shippedDate}</span>
                    {canEditRoadmap&&<Btn theme={theme} small onClick={()=>openM("editRoadmapItem",{...item})}><Edit3 size={11}/></Btn>}
                  </div>
                  {item.description&&<p style={{fontSize:12,color:theme.textMut,margin:"5px 0 0",lineHeight:1.5}}>{item.description}</p>}
                </Card>
              ))}
              {shipped.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>Nothing shipped yet.</p>}
            </div>
          </div>}
        </div>
      );
    }

    /* ─── MEDIA & CONTENT ─── */
    case "media": {
      const prods = [...mediaProducts].sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
      const activeProd = prods.find(p=>p.id===mediaProduct) || prods[0];
      const pid = activeProd?.id;
      const prodItems = mediaItems.filter(i=>i.productId===pid);
      const prodRoles = mediaRoles.filter(r=>r.productId===pid);
      const prodName = (id) => mediaProducts.find(p=>p.id===id)?.name || "";
      const prodColor = (id) => mediaProducts.find(p=>p.id===id)?.color || theme.textMut;

      // Moving a stage resets the clock used for staleness
      const moveStage = (item, dir) => {
        const idx = MEDIA_STAGES.indexOf(item.stage);
        const next = MEDIA_STAGES[Math.max(0, Math.min(MEDIA_STAGES.length-1, idx+dir))];
        if (next === item.stage) return;
        const upd = {...item, stage: next, stageSince: todayStr};
        setMediaItems(prev=>prev.map(x=>x.id===item.id?upd:x));
        db.saveMediaItem(upd);
      };
      const daysInStage = (item) => item.stageSince ? daysBetween(item.stageSince, todayStr) : null;
      const staleLevel = (item) => {
        const d = daysInStage(item);
        if (d === null || item.stage === "Published") return 0;
        const limit = STAGE_STALE_DAYS[item.stage] || 14;
        if (d >= limit * 1.5) return 2;
        if (d >= limit) return 1;
        return 0;
      };
      const checklistDone = (item) => (item.checklist||[]).filter(c=>c.done).length;
      const toggleCheck = (item, i) => {
        const cl = [...(item.checklist||[])];
        cl[i] = {...cl[i], done: !cl[i].done};
        const upd = {...item, checklist: cl};
        setMediaItems(prev=>prev.map(x=>x.id===item.id?upd:x));
        db.saveMediaItem(upd);
      };
      const toggleVote = (idea) => {
        const has = (idea.votes||[]).includes(curUser.id);
        const upd = {...idea, votes: has ? idea.votes.filter(v=>v!==curUser.id) : [...(idea.votes||[]), curUser.id]};
        setMediaIdeas(prev=>prev.map(x=>x.id===idea.id?upd:x));
        db.saveMediaIdea(upd);
      };

      return (
        <div>
          <SectionHead theme={theme} right={<>
            {prods.length>0&&mediaTab!=="ideas"&&mediaTab!=="feedback"&&mediaTab!=="tools"&&
              <Sel theme={theme} options={prods.map(p=>({value:p.id,label:p.name}))} value={pid||""} onChange={e=>setMediaProduct(e.target.value)} style={{width:"auto",fontSize:13,padding:"6px 10px"}}/>}
            <Btn primary theme={theme} onClick={()=>openM("editMediaProduct",{name:"",description:"",format:MEDIA_FORMATS[0],cadence:"Weekly",showrunner:curUser.id,status:"Active",driveUrl:"",color:"#1FC2C2",sortOrder:(prods.length+1)*10,notes:""})}><Plus size={14}/> New Product</Btn>
          </>}>Media & Content</SectionHead>

          {/* Tabs */}
          <div className="nanu-ws-tabs" style={{display:"flex",gap:4,marginBottom:18,borderBottom:`1px solid ${theme.border}`,flexWrap:"wrap"}}>
            {[["pipeline","Pipeline",Columns],["roles","Roles",Users],["guests","Guests",Users2],["ideas","Ideas Board",Zap],["feedback","Feedback",MessageSquare],["tools","Tools",Settings],["drive","Drive & Assets",FolderOpen]].map(([k,l,Icon])=>{
              const badge = k==="ideas" ? mediaIdeas.filter(i=>i.status==="New").length : k==="feedback" ? mediaFeedbackList.filter(f=>f.status==="New").length : 0;
              return <button key={k} onClick={()=>setMediaTab(k)} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",border:"none",background:"transparent",borderBottom:mediaTab===k?`2px solid ${theme.teal}`:"2px solid transparent",color:mediaTab===k?theme.teal:theme.textSec,cursor:"pointer",fontSize:13,fontWeight:600,marginBottom:-1}}>
                <Icon size={14}/>{l}
                {badge>0&&<span style={{background:theme.teal,color:"#0D1B21",borderRadius:10,padding:"0 6px",fontSize:10,fontWeight:700}}>{badge}</span>}
              </button>;
            })}
          </div>

          {prods.length===0&&<Card theme={theme} style={{padding:32,textAlign:"center"}}>
            <FileEdit size={28} color={theme.textMut} style={{marginBottom:10}}/>
            <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16,marginBottom:6}}>No content products yet</div>
            <p style={{fontSize:13,color:theme.textMut}}>Create one to start tracking its pipeline and team.</p>
          </Card>}

          {/* ── PIPELINE ── */}
          {mediaTab==="pipeline"&&activeProd&&<div>
            <Card theme={theme} style={{padding:18,marginBottom:16,borderLeft:`3px solid ${activeProd.color}`}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
                <div style={{flex:"1 1 260px",minWidth:0}}>
                  <div style={{fontFamily:FONT_DISPLAY,fontWeight:800,fontSize:20,lineHeight:1.2}}>{activeProd.name}</div>
                  {activeProd.description&&<p style={{fontSize:13,color:theme.textSec,margin:"6px 0 0",lineHeight:1.5}}>{activeProd.description}</p>}
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                  {activeProd.format&&<Badge label={activeProd.format} color={activeProd.color}/>}
                  {activeProd.cadence&&<Badge label={activeProd.cadence} color={theme.textMut}/>}
                  {activeProd.driveUrl&&<a href={activeProd.driveUrl} target="_blank" rel="noopener noreferrer" style={{color:theme.teal,fontSize:12,display:"flex",alignItems:"center",gap:4}}><FolderOpen size={12}/> Drive</a>}
                  <Btn theme={theme} small onClick={()=>openM("editMediaProduct",{...activeProd})}><Edit3 size={12}/> Edit</Btn>
                  <Btn theme={theme} small onClick={()=>openM("bulkEpisodes",{productId:pid,count:5,startDate:todayStr,startNumber:1})}><Repeat size={12}/> Generate</Btn>
                  <Btn primary theme={theme} small onClick={()=>openM("editMediaItem",{productId:pid,title:"",stage:"Idea",owner:activeProd.defaultOwner||curUser.id,episodeNo:"",summary:"",dueDate:"",airDate:"",scriptUrl:"",assetsUrl:"",finalUrl:"",blocker:"",notes:"",needsDesign:false,designStatus:"",stageSince:todayStr,checklist:(activeProd.checklistTemplate||[]).map(c=>({label:c,done:false})),linkedTasks:[]})}><Plus size={12}/> Add Item</Btn>
                </div>
              </div>
            </Card>

            {/* View switcher */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <div style={{display:"flex",background:theme.bgInput,borderRadius:8,border:`1px solid ${theme.border}`,overflow:"hidden"}}>
                {[["board","Board"],["slate","Slate"],["design","Design Queue"]].map(([k,l])=>(
                  <button key={k} onClick={()=>setPipeView(k)} style={{padding:"6px 12px",border:"none",fontSize:12,background:pipeView===k?theme.teal:"transparent",color:pipeView===k?"#0D1B21":theme.textSec,cursor:"pointer",fontWeight:600}}>{l}</button>
                ))}
              </div>
              {(()=>{const stale=prodItems.filter(i=>staleLevel(i)>0).length;
                return stale>0?<span style={{fontSize:12,color:theme.orange,display:"flex",alignItems:"center",gap:5}}><AlertTriangle size={12}/>{stale} item{stale===1?"":"s"} sitting too long</span>:null;})()}
            </div>

            {/* ── BOARD ── */}
            {pipeView==="board"&&<div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8}}>
              {MEDIA_STAGES.map(stage=>{
                const col = prodItems.filter(i=>i.stage===stage);
                return <div key={stage} className="nanu-kanban-col" style={{flex:"1 0 210px",minWidth:210}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8,paddingBottom:6,borderBottom:`2px solid ${MEDIA_STAGE_COLORS[stage]}`}}>
                    <span style={{fontSize:11,fontWeight:700,color:MEDIA_STAGE_COLORS[stage],textTransform:"uppercase",letterSpacing:".04em"}}>{stage}</span>
                    <span style={{fontSize:11,color:theme.textMut,marginLeft:"auto"}}>{col.length}</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {col.map(item=>{
                      const sl=staleLevel(item), dis=daysInStage(item);
                      const cl=item.checklist||[], done=checklistDone(item);
                      return <Card key={item.id} theme={theme} style={{padding:11,borderLeft:sl?`3px solid ${sl===2?theme.red:theme.orange}`:undefined}}>
                        <div onClick={()=>openM("editMediaItem",{...item})} style={{fontWeight:600,fontSize:13,cursor:"pointer",marginBottom:5}}>{item.episodeNo&&<span style={{color:theme.textMut,fontFamily:FONT_MONO,fontSize:11,marginRight:5}}>{item.episodeNo}</span>}{item.title}</div>
                        {item.blocker&&<div style={{fontSize:11,color:theme.red,marginBottom:4,display:"flex",alignItems:"center",gap:4}}><AlertTriangle size={10}/>{item.blocker}</div>}
                        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",fontSize:11,color:theme.textMut}}>
                          {item.owner&&<span>{uName(item.owner)}</span>}
                          {item.airDate&&<span style={{fontFamily:FONT_MONO,color:item.airDate<todayStr&&item.stage!=="Published"?theme.red:theme.textMut}}>{item.airDate}</span>}
                          {sl>0&&<span style={{color:sl===2?theme.red:theme.orange,fontWeight:600}}>{dis}d here</span>}
                        </div>
                        {item.needsDesign&&<div style={{marginTop:5,display:"flex",alignItems:"center",gap:4,fontSize:10}}>
                          <div style={{width:7,height:7,borderRadius:"50%",background:DESIGN_STATUS_COLORS[item.designStatus||"Not started"]}}/>
                          <span style={{color:theme.textMut}}>Design: {item.designStatus||"Not started"}</span>
                        </div>}
                        {cl.length>0&&<div style={{marginTop:6}}>
                          <div style={{height:3,background:theme.bgInput,borderRadius:2,overflow:"hidden"}}>
                            <div style={{width:`${(done/cl.length)*100}%`,height:"100%",background:done===cl.length?theme.green:theme.teal}}/>
                          </div>
                          <div style={{fontSize:9,color:theme.textMut,marginTop:2}}>{done}/{cl.length} checks</div>
                        </div>}
                        <div style={{display:"flex",gap:4,marginTop:7,alignItems:"center"}}>
                          <button type="button" title="Move back" onClick={()=>moveStage(item,-1)} disabled={stage===MEDIA_STAGES[0]} style={{background:"none",border:`1px solid ${theme.border}`,borderRadius:6,padding:"2px 6px",cursor:stage===MEDIA_STAGES[0]?"not-allowed":"pointer",color:theme.textMut,opacity:stage===MEDIA_STAGES[0]?0.3:1}}><ChevronLeft size={11}/></button>
                          <button type="button" title="Move forward" onClick={()=>moveStage(item,1)} disabled={stage==="Published"} style={{background:"none",border:`1px solid ${theme.border}`,borderRadius:6,padding:"2px 6px",cursor:stage==="Published"?"not-allowed":"pointer",color:theme.teal,opacity:stage==="Published"?0.3:1}}><ChevronRight size={11}/></button>
                          {item.scriptUrl&&<a href={item.scriptUrl} target="_blank" rel="noopener noreferrer" title="Script" style={{color:theme.textMut,display:"flex"}}><FileText size={11}/></a>}
                          {item.assetsUrl&&<a href={item.assetsUrl} target="_blank" rel="noopener noreferrer" title="Assets" style={{color:theme.textMut,display:"flex"}}><FolderOpen size={11}/></a>}
                          {item.finalUrl&&<a href={item.finalUrl} target="_blank" rel="noopener noreferrer" title="Final" style={{color:theme.green,display:"flex"}}><ExternalLink size={11}/></a>}
                          {(item.linkedTasks||[]).length>0&&<span title="Linked tasks" style={{fontSize:10,color:theme.textMut,display:"flex",alignItems:"center",gap:2}}><CheckSquare size={10}/>{item.linkedTasks.length}</span>}
                        </div>
                      </Card>;
                    })}
                    {col.length===0&&<div style={{fontSize:11,color:theme.textMut,textAlign:"center",padding:"14px 0",border:`1px dashed ${theme.border}`,borderRadius:8}}>—</div>}
                  </div>
                </div>;
              })}
            </div>}

            {/* ── SLATE (next 21 days, all products) ── */}
            {pipeView==="slate"&&<div>
              <p style={{fontSize:12,color:theme.textSec,marginBottom:12,lineHeight:1.6}}>Everything scheduled across all products for the next three weeks. Empty days on a daily product are the gaps worth filling.</p>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {Array.from({length:21},(_,d)=>{
                  const date=new Date(); date.setDate(date.getDate()+d);
                  const ds=date.toISOString().split("T")[0];
                  const dayName=date.toLocaleDateString("en-GB",{weekday:"short"});
                  const dayItems=mediaItems.filter(i=>i.airDate===ds);
                  const isToday=d===0;
                  const isWeekend=[0,6].includes(date.getDay());
                  return <div key={ds} style={{display:"flex",gap:10,alignItems:"stretch",padding:"7px 12px",borderRadius:8,background:isToday?`${theme.teal}12`:(isWeekend?"transparent":theme.bgCard),border:`1px solid ${isToday?theme.teal:theme.border}`,opacity:isWeekend&&dayItems.length===0?0.5:1}}>
                    <div style={{minWidth:88,flexShrink:0}}>
                      <div style={{fontSize:12,fontWeight:700,color:isToday?theme.teal:theme.text}}>{dayName} {date.getDate()}</div>
                      <div style={{fontSize:10,color:theme.textMut,fontFamily:FONT_MONO}}>{ds.slice(5)}</div>
                    </div>
                    <div style={{flex:1,display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                      {dayItems.map(item=>(
                        <button key={item.id} onClick={()=>openM("editMediaItem",{...item})} style={{display:"flex",alignItems:"center",gap:6,background:theme.bgInput,border:`1px solid ${prodColor(item.productId)}55`,borderLeft:`3px solid ${prodColor(item.productId)}`,borderRadius:6,padding:"4px 9px",cursor:"pointer",color:theme.text,fontSize:12}}>
                          <span style={{fontWeight:600}}>{item.title||"Untitled"}</span>
                          <span style={{fontSize:10,color:MEDIA_STAGE_COLORS[item.stage]}}>{item.stage}</span>
                          {item.needsDesign&&item.designStatus!=="Ready"&&item.designStatus!=="Not needed"&&<span title="Design outstanding" style={{width:6,height:6,borderRadius:"50%",background:theme.orange}}/>}
                        </button>
                      ))}
                      {dayItems.length===0&&<span style={{fontSize:11,color:isWeekend?theme.textMut:theme.red,opacity:isWeekend?0.6:1}}>{isWeekend?"—":"Nothing scheduled"}</span>}
                    </div>
                  </div>;
                })}
              </div>
            </div>}

            {/* ── DESIGN QUEUE (cross-product) ── */}
            {pipeView==="design"&&<div>
              <p style={{fontSize:12,color:theme.textSec,marginBottom:12,lineHeight:1.6}}>Every item needing design across all four products, oldest air date first. Flag an item as needing design in its detail view.</p>
              <div className="nanu-grid-summary" style={{marginBottom:14}}>
                {DESIGN_STATUS.filter(s=>s!=="Not needed").map(s=>(
                  <Card key={s} theme={theme} style={{padding:12,textAlign:"center",borderTop:`3px solid ${DESIGN_STATUS_COLORS[s]}`}}>
                    <div className="nanu-big-num" style={{fontSize:22,color:DESIGN_STATUS_COLORS[s]}}>{mediaItems.filter(i=>i.needsDesign&&(i.designStatus||"Not started")===s).length}</div>
                    <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>{s}</div>
                  </Card>
                ))}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {mediaItems.filter(i=>i.needsDesign&&i.designStatus!=="Not needed"&&i.stage!=="Published")
                  .sort((a,b)=>(a.airDate||"9999").localeCompare(b.airDate||"9999")).map(item=>(
                  <Card key={item.id} theme={theme} style={{padding:13,borderLeft:`3px solid ${DESIGN_STATUS_COLORS[item.designStatus||"Not started"]}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                      <Badge label={prodName(item.productId)} color={prodColor(item.productId)}/>
                      <span onClick={()=>openM("editMediaItem",{...item})} style={{fontWeight:600,fontSize:13,flex:"1 1 180px",cursor:"pointer",minWidth:0}}>{item.title}</span>
                      <Badge label={item.stage} color={MEDIA_STAGE_COLORS[item.stage]}/>
                      {item.airDate&&<span style={{fontFamily:FONT_MONO,fontSize:11,color:item.airDate<todayStr?theme.red:theme.textMut}}>{item.airDate}</span>}
                      <select value={item.designStatus||"Not started"} onChange={e=>{const upd={...item,designStatus:e.target.value};setMediaItems(prev=>prev.map(x=>x.id===item.id?upd:x));db.saveMediaItem(upd)}}
                        style={{fontSize:11,padding:"3px 6px",borderRadius:6,border:`1px solid ${theme.border}`,background:theme.bgInput,color:DESIGN_STATUS_COLORS[item.designStatus||"Not started"],cursor:"pointer",fontWeight:700}}>
                        {DESIGN_STATUS.map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                      {item.assetsUrl&&<a href={item.assetsUrl} target="_blank" rel="noopener noreferrer" style={{color:theme.teal,display:"flex"}}><FolderOpen size={12}/></a>}
                    </div>
                  </Card>
                ))}
                {mediaItems.filter(i=>i.needsDesign&&i.designStatus!=="Not needed"&&i.stage!=="Published").length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>Nothing waiting on design.</p>}
              </div>
            </div>}
          </div>}

          {/* ── ROLES ── */}
          {mediaTab==="roles"&&activeProd&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <p style={{fontSize:13,color:theme.textSec,margin:0,maxWidth:620,lineHeight:1.6}}>Who owns each part of <strong>{activeProd.name}</strong>. Anything unassigned is work landing on whoever notices first.</p>
              <Btn primary theme={theme} small onClick={()=>openM("editMediaRole",{productId:pid,function:MEDIA_FUNCTIONS[0],holderUser:"",holderText:"",backupUser:"",notes:""})}><Plus size={13}/> Add Role</Btn>
            </div>
            {(()=>{
              const unassigned=prodRoles.filter(r=>!r.holderUser&&!r.holderText.trim()||r.holderText==="Unassigned");
              return unassigned.length>0&&<Card theme={theme} style={{padding:12,marginBottom:14,borderLeft:`3px solid ${theme.orange}`}}>
                <div style={{fontSize:12,color:theme.orange,fontWeight:600}}>{unassigned.length} role{unassigned.length===1?"":"s"} with nobody named</div>
              </Card>;
            })()}
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {prodRoles.map(r=>{
                const named=r.holderUser||(r.holderText&&r.holderText!=="Unassigned");
                return <Card key={r.id} theme={theme} style={{padding:14,borderLeft:`3px solid ${named?activeProd.color:theme.orange}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <span style={{fontWeight:700,fontSize:14,flex:"1 1 180px",minWidth:0}}>{r.function}</span>
                    <div style={{minWidth:130}}>
                      <div style={{fontSize:9,color:theme.textMut,textTransform:"uppercase",letterSpacing:".04em"}}>Owner</div>
                      <div style={{fontSize:12,fontWeight:600,color:named?theme.text:theme.orange}}>{r.holderUser?uName(r.holderUser):(r.holderText||"Unassigned")}</div>
                    </div>
                    <div style={{minWidth:120}}>
                      <div style={{fontSize:9,color:theme.textMut,textTransform:"uppercase",letterSpacing:".04em"}}>Backup</div>
                      <div style={{fontSize:12,color:theme.textSec}}>{r.backupUser?uName(r.backupUser):"—"}</div>
                    </div>
                    <Btn theme={theme} small onClick={()=>openM("editMediaRole",{...r})}><Edit3 size={12}/> Edit</Btn>
                  </div>
                  {r.notes&&<p style={{fontSize:12,color:theme.textMut,margin:"6px 0 0",lineHeight:1.5}}>{r.notes}</p>}
                </Card>;
              })}
              {prodRoles.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No roles defined for this product yet.</p>}
            </div>
          </div>}

          {/* ── GUESTS ── */}
          {mediaTab==="guests"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <p style={{fontSize:13,color:theme.textSec,margin:0,maxWidth:620,lineHeight:1.6}}>Guests across all products, and whether we have a signed release. No release means we can't publish.</p>
              <Btn primary theme={theme} small onClick={()=>openM("editMediaGuest",{name:"",email:"",phone:"",productId:pid||"",itemId:"",bio:"",recordedDate:"",releaseSigned:false,releaseUrl:"",status:"Approached",notes:""})}><Plus size={13}/> Add Guest</Btn>
            </div>

            {(()=>{const risk=mediaGuests.filter(g=>!g.releaseSigned&&["Recorded","Published"].includes(g.status));
              return risk.length>0&&<Card theme={theme} style={{padding:14,marginBottom:16,borderLeft:`3px solid ${theme.red}`}}>
                <div style={{fontSize:11,fontWeight:700,color:theme.red,textTransform:"uppercase",letterSpacing:".04em",marginBottom:8}}>{risk.length} recorded without a signed release</div>
                {risk.map(g=>(<div key={g.id} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,padding:"3px 0"}}>
                  <AlertTriangle size={12} color={theme.red}/><span style={{flex:1}}>{g.name}</span><span style={{color:theme.textMut}}>{g.status}</span>
                </div>))}
              </Card>;})()}

            <div className="nanu-grid-summary" style={{marginBottom:16}}>
              {GUEST_STATUS.filter(s=>s!=="Declined").map(s=>(
                <Card key={s} theme={theme} style={{padding:12,textAlign:"center",borderTop:`3px solid ${GUEST_STATUS_COLORS[s]}`}}>
                  <div className="nanu-big-num" style={{fontSize:22,color:GUEST_STATUS_COLORS[s]}}>{mediaGuests.filter(g=>g.status===s).length}</div>
                  <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>{s}</div>
                </Card>
              ))}
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {mediaGuests.map(g=>(
                <Card key={g.id} theme={theme} style={{padding:14,borderLeft:`3px solid ${GUEST_STATUS_COLORS[g.status]}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <div style={{flex:"1 1 200px",minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:14}}>{g.name}</div>
                      {g.bio&&<div style={{fontSize:12,color:theme.textMut,marginTop:2}}>{g.bio}</div>}
                    </div>
                    {g.productId&&<Badge label={prodName(g.productId)} color={prodColor(g.productId)}/>}
                    <Badge label={g.status} color={GUEST_STATUS_COLORS[g.status]}/>
                    {g.releaseSigned
                      ? <span style={{fontSize:11,color:theme.green,display:"flex",alignItems:"center",gap:4,fontWeight:600}}><Check size={12}/> Release signed</span>
                      : <span style={{fontSize:11,color:theme.red,display:"flex",alignItems:"center",gap:4,fontWeight:600}}><AlertTriangle size={12}/> No release</span>}
                    {g.recordedDate&&<span style={{fontFamily:FONT_MONO,fontSize:11,color:theme.textMut}}>{g.recordedDate}</span>}
                    <Btn theme={theme} small onClick={()=>openM("editMediaGuest",{...g})}><Edit3 size={12}/> Edit</Btn>
                  </div>
                  {(g.email||g.phone)&&<div style={{fontSize:11,color:theme.textMut,marginTop:6,display:"flex",gap:10}}>
                    {g.email&&<a href={`mailto:${g.email}`} style={{color:theme.teal,textDecoration:"none"}}>{g.email}</a>}
                    {g.phone&&<span>{g.phone}</span>}
                  </div>}
                </Card>
              ))}
              {mediaGuests.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No guests logged yet.</p>}
            </div>
          </div>}

          {/* ── IDEAS BOARD ── */}
          {mediaTab==="ideas"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <p style={{fontSize:13,color:theme.textSec,margin:0,maxWidth:620,lineHeight:1.6}}>Anyone can post a content idea here. The media team reviews the board — no need to interrupt them directly.</p>
              <Btn primary theme={theme} small onClick={()=>openM("editMediaIdea",{title:"",description:"",productId:"",submittedBy:curUser.id,submittedDate:todayStr,status:"New",votes:[],response:""})}><Plus size={13}/> Submit Idea</Btn>
            </div>
            <div className="nanu-grid-summary" style={{marginBottom:16}}>
              {IDEA_STATUS.map(s=>(
                <Card key={s} theme={theme} style={{padding:12,textAlign:"center",borderTop:`3px solid ${IDEA_STATUS_COLORS[s]}`}}>
                  <div className="nanu-big-num" style={{fontSize:22,color:IDEA_STATUS_COLORS[s]}}>{mediaIdeas.filter(i=>i.status===s).length}</div>
                  <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>{s}</div>
                </Card>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {[...mediaIdeas].sort((a,b)=>((b.votes||[]).length-(a.votes||[]).length)||(b.submittedDate||"").localeCompare(a.submittedDate||"")).map(idea=>{
                const voted=(idea.votes||[]).includes(curUser.id);
                return <Card key={idea.id} theme={theme} style={{padding:14,borderLeft:`3px solid ${IDEA_STATUS_COLORS[idea.status]}`}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
                    <button type="button" onClick={()=>toggleVote(idea)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1,background:voted?`${theme.teal}18`:"transparent",border:`1px solid ${voted?theme.teal:theme.border}`,borderRadius:8,padding:"5px 9px",cursor:"pointer",color:voted?theme.teal:theme.textMut,flexShrink:0}}>
                      <ArrowUp size={13}/>
                      <span style={{fontSize:12,fontWeight:700}}>{(idea.votes||[]).length}</span>
                    </button>
                    <div style={{flex:"1 1 240px",minWidth:0}}>
                      <div style={{fontWeight:700,fontSize:14}}>{idea.title}</div>
                      {idea.description&&<p style={{fontSize:12,color:theme.textSec,margin:"4px 0 0",lineHeight:1.5}}>{idea.description}</p>}
                      <div style={{fontSize:11,color:theme.textMut,marginTop:6}}>{idea.submittedBy?uName(idea.submittedBy):"Unknown"} · {idea.submittedDate}</div>
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                      {idea.productId&&<Badge label={prodName(idea.productId)} color={prodColor(idea.productId)}/>}
                      <Badge label={idea.status} color={IDEA_STATUS_COLORS[idea.status]}/>
                      <Btn theme={theme} small onClick={()=>openM("editMediaIdea",{...idea})}><Edit3 size={12}/></Btn>
                    </div>
                  </div>
                  {idea.response&&<div style={{marginTop:8,padding:"8px 12px",background:theme.bgInput,borderRadius:8,fontSize:12,color:theme.textSec,lineHeight:1.5}}><strong style={{color:theme.teal}}>Media team:</strong> {idea.response}</div>}
                </Card>;
              })}
              {mediaIdeas.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No ideas yet. Be the first.</p>}
            </div>
          </div>}

          {/* ── FEEDBACK ── */}
          {mediaTab==="feedback"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <p style={{fontSize:13,color:theme.textSec,margin:0,maxWidth:620,lineHeight:1.6}}>Creative feedback on what we've published. Direct, in one place, so it reaches the people making it.</p>
              <Btn primary theme={theme} small onClick={()=>openM("editMediaFeedback",{subject:"",body:"",type:"Suggestion",productId:"",submittedBy:curUser.id,submittedDate:todayStr,status:"New",response:""})}><Plus size={13}/> Give Feedback</Btn>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {[...mediaFeedbackList].sort((a,b)=>(b.submittedDate||"").localeCompare(a.submittedDate||"")).map(f=>(
                <Card key={f.id} theme={theme} style={{padding:14,borderLeft:`3px solid ${MFEEDBACK_TYPE_COLORS[f.type]}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:6}}>
                    <span style={{fontWeight:700,fontSize:14,flex:"1 1 200px",minWidth:0}}>{f.subject}</span>
                    <Badge label={f.type} color={MFEEDBACK_TYPE_COLORS[f.type]}/>
                    {f.productId&&<Badge label={prodName(f.productId)} color={prodColor(f.productId)}/>}
                    <Badge label={f.status} color={f.status==="Actioned"?theme.green:f.status==="New"?theme.yellow:theme.textMut}/>
                    <Btn theme={theme} small onClick={()=>openM("editMediaFeedback",{...f})}><Edit3 size={12}/></Btn>
                  </div>
                  {f.body&&<p style={{fontSize:13,color:theme.textSec,margin:0,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{f.body}</p>}
                  <div style={{fontSize:11,color:theme.textMut,marginTop:6}}>{f.submittedBy?uName(f.submittedBy):"Unknown"} · {f.submittedDate}</div>
                  {f.response&&<div style={{marginTop:8,padding:"8px 12px",background:theme.bgInput,borderRadius:8,fontSize:12,color:theme.textSec,lineHeight:1.5}}><strong style={{color:theme.teal}}>Response:</strong> {f.response}</div>}
                </Card>
              ))}
              {mediaFeedbackList.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No feedback yet.</p>}
            </div>
          </div>}

          {/* ── TOOLS ── */}
          {mediaTab==="tools"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <p style={{fontSize:13,color:theme.textSec,margin:0,maxWidth:620,lineHeight:1.6}}>The agreed production toolset and who holds access to each.</p>
              <Btn primary theme={theme} small onClick={()=>openM("editMediaTool",{name:"",category:TOOL_CATEGORIES[0],purpose:"",url:"",accessHolder:curUser.id,sharedAccess:"",cost:"",status:"In use",notes:""})}><Plus size={13}/> Add Tool</Btn>
            </div>
            {TOOL_CATEGORIES.filter(c=>mediaTools.some(t=>t.category===c)).map(cat=>(
              <div key={cat} style={{marginBottom:18}}>
                <div style={{fontSize:12,fontWeight:600,color:theme.textSec,marginBottom:8,textTransform:"uppercase",letterSpacing:".04em"}}>{cat}</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {mediaTools.filter(t=>t.category===cat).map(t=>(
                    <Card key={t.id} theme={theme} style={{padding:14,borderLeft:`3px solid ${TOOL_STATUS_COLORS[t.status]}`}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                        <div style={{flex:"1 1 200px",minWidth:0}}>
                          <div style={{fontWeight:700,fontSize:14}}>{t.name}</div>
                          {t.purpose&&<div style={{fontSize:12,color:theme.textMut,marginTop:2}}>{t.purpose}</div>}
                        </div>
                        {t.sharedAccess&&<span style={{fontSize:11,color:theme.textSec,minWidth:120}}>{t.sharedAccess}</span>}
                        {t.cost&&<span style={{fontFamily:FONT_MONO,fontSize:11,color:theme.textMut}}>{t.cost}</span>}
                        <Badge label={t.status} color={TOOL_STATUS_COLORS[t.status]}/>
                        {t.url&&<a href={t.url} target="_blank" rel="noopener noreferrer" style={{color:theme.teal,display:"flex"}}><ExternalLink size={12}/></a>}
                        <Btn theme={theme} small onClick={()=>openM("editMediaTool",{...t})}><Edit3 size={12}/></Btn>
                      </div>
                      {t.accessHolder&&<div style={{fontSize:11,color:theme.textMut,marginTop:5}}>Access held by {uName(t.accessHolder)}</div>}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            {mediaTools.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No tools listed yet.</p>}
          </div>}

          {/* ── DRIVE & ASSETS ── */}
          {mediaTab==="drive"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
              <p style={{fontSize:13,color:theme.textSec,margin:0,maxWidth:620,lineHeight:1.6}}>Shared Drive folders for source material, working files and finished assets.</p>
              <Btn primary theme={theme} small onClick={()=>openM("editMediaFolder",{name:"",productId:"",url:"",purpose:"",notes:""})}><Plus size={13}/> Add Folder</Btn>
            </div>

            <div style={{fontSize:11,fontWeight:600,color:theme.textMut,marginBottom:8,textTransform:"uppercase",letterSpacing:".04em"}}>Shared folders</div>
            <div className="nanu-grid-2col" style={{marginBottom:20}}>
              {mediaFolders.filter(f=>!f.productId).map(f=>(
                <Card key={f.id} theme={theme} style={{padding:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <FolderOpen size={16} color={theme.teal}/>
                    <span style={{fontWeight:700,fontSize:14,flex:1,minWidth:0}}>{f.name}</span>
                    {f.url?<a href={f.url} target="_blank" rel="noopener noreferrer" style={{color:theme.teal,fontSize:12,display:"flex",alignItems:"center",gap:3}}><ExternalLink size={11}/> Open</a>:<span style={{fontSize:11,color:theme.orange}}>no link</span>}
                    <Btn theme={theme} small onClick={()=>openM("editMediaFolder",{...f})}><Edit3 size={11}/></Btn>
                  </div>
                  {f.purpose&&<p style={{fontSize:12,color:theme.textMut,margin:"6px 0 0",lineHeight:1.5}}>{f.purpose}</p>}
                </Card>
              ))}
            </div>

            <div style={{fontSize:11,fontWeight:600,color:theme.textMut,marginBottom:8,textTransform:"uppercase",letterSpacing:".04em"}}>Per product</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {prods.map(p=>(
                <Card key={p.id} theme={theme} style={{padding:14,borderLeft:`3px solid ${p.color}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <span style={{fontWeight:700,fontSize:14,flex:"1 1 200px",minWidth:0}}>{p.name}</span>
                    {p.driveUrl
                      ? <a href={p.driveUrl} target="_blank" rel="noopener noreferrer" style={{color:theme.teal,fontSize:12,display:"flex",alignItems:"center",gap:4}}><FolderOpen size={12}/> Open folder</a>
                      : <span style={{fontSize:11,color:theme.orange}}>No Drive folder linked</span>}
                    <Btn theme={theme} small onClick={()=>openM("editMediaProduct",{...p})}><Edit3 size={11}/> Set link</Btn>
                  </div>
                  {mediaFolders.filter(f=>f.productId===p.id).map(f=>(
                    <div key={f.id} style={{display:"flex",alignItems:"center",gap:8,marginTop:6,paddingLeft:12,fontSize:12}}>
                      <FolderOpen size={11} color={theme.textMut}/>
                      <span style={{flex:1,color:theme.textSec}}>{f.name}</span>
                      {f.url&&<a href={f.url} target="_blank" rel="noopener noreferrer" style={{color:theme.teal,display:"flex"}}><ExternalLink size={10}/></a>}
                      <Btn theme={theme} small onClick={()=>openM("editMediaFolder",{...f})}><Edit3 size={10}/></Btn>
                    </div>
                  ))}
                </Card>
              ))}
            </div>
            <p style={{fontSize:11,color:theme.textMut,marginTop:14,lineHeight:1.6}}>Files live in Drive — the hub stores the links. Paste the folder's share URL so the whole team can reach it.</p>
          </div>}
        </div>
      );
    }

    /* ─── FOCUS GROUPS ─── */
    case "focusgroups": {
      const rounds = fgRounds;
      const activeRound = rounds.find(r=>r.id===fgActiveRound) || rounds[0];
      const rid = activeRound?.id;
      const parts = fgParticipants.filter(p=>p.roundId===rid);
      const assets = fgAssets.filter(a=>a.roundId===rid);
      const outbound = assets.filter(a=>a.type!=="Response");
      const responses = assets.filter(a=>a.type==="Response");
      const canSeeContacts = isAdmin && fgShowContacts;

      const countBy = (s) => parts.filter(p=>p.status===s).length;
      const accepted = parts.filter(p=>p.status==="Accepted Invite");

      const toggleSel = (id) => setFgSelected(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
      const bulkSetStatus = (status) => {
        fgSelected.forEach(pid=>{
          const p = fgParticipants.find(x=>x.id===pid); if(!p) return;
          const upd = {...p, status, ...(status==="Sent"?{invitedDate:todayStr}:{}), ...(status==="Received Back"?{respondedDate:todayStr}:{})};
          setFgParticipants(prev=>prev.map(x=>x.id===pid?upd:x));
          db.saveFgParticipant(upd);
        });
        log("updated",`${fgSelected.length} participant(s) to ${status}`,"Focus Groups");
        setFgSelected([]); setFgSendStaged(false);
      };
      const addDroppedAsset = (name, url, type) => {
        if(!rid) return;
        const a = {id:uid("fga"),roundId:rid,name:name||"Untitled",type:type||"Survey",url:url||"",addedDate:todayStr,notes:""};
        setFgAssets(prev=>[...prev,a]); db.saveFgAsset(a); log("added",a.name,"Focus Groups");
      };

      return (
        <div>
          <SectionHead theme={theme} right={<>
            {rounds.length>0&&<Sel theme={theme} options={rounds.map(r=>({value:r.id,label:r.title||"Untitled round"}))} value={rid||""} onChange={e=>{setFgActiveRound(e.target.value);setFgSelected([]);setFgSendStaged(false)}} style={{width:"auto",fontSize:13,padding:"6px 10px"}}/>}
            <Btn primary theme={theme} onClick={()=>openM("editFgRound",{title:"Market research for: ",objective:"",startDate:todayStr,endDate:"",status:"Planning",owner:curUser.id,targetN:0,notes:""})}><Plus size={14}/> New Round</Btn>
          </>}>Focus Groups</SectionHead>

          {!activeRound&&<Card theme={theme} style={{padding:32,textAlign:"center"}}>
            <Users2 size={28} color={theme.textMut} style={{marginBottom:10}}/>
            <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16,marginBottom:6}}>No rounds yet</div>
            <p style={{fontSize:13,color:theme.textMut}}>Create a round to start recruiting participants and tracking responses.</p>
          </Card>}

          {activeRound&&<>
            {/* Round header — interchangeable heading + timeline */}
            <Card theme={theme} style={{padding:20,marginBottom:16,borderLeft:`3px solid ${FG_ROUND_STATUS_COLORS[activeRound.status]}`}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
                <div style={{flex:"1 1 260px",minWidth:0}}>
                  <div style={{fontFamily:FONT_DISPLAY,fontWeight:800,fontSize:22,lineHeight:1.2}}>{activeRound.title||"Untitled round"}</div>
                  {activeRound.objective&&<p style={{fontSize:13,color:theme.textSec,margin:"6px 0 0",lineHeight:1.5}}>{activeRound.objective}</p>}
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <Badge label={activeRound.status} color={FG_ROUND_STATUS_COLORS[activeRound.status]}/>
                  <span style={{fontSize:11,color:theme.textMut}}>{uName(activeRound.owner)}</span>
                  <Btn theme={theme} small onClick={()=>openM("editFgRound",{...activeRound})}><Edit3 size={12}/> Edit</Btn>
                </div>
              </div>
              <DeadlineTimeline theme={theme} startDate={activeRound.startDate} endDate={activeRound.endDate} label="Round timeline"/>
            </Card>

            {/* Traffic light summary */}
            <div className="nanu-grid-summary" style={{marginBottom:16}}>
              {FG_PARTICIPANT_STATUS.map(s=>(
                <Card key={s} theme={theme} title={FG_STATUS_HINT[s]} style={{padding:12,textAlign:"center",borderTop:`3px solid ${FG_STATUS_COLORS[s]}`}}>
                  <div className="nanu-big-num" style={{fontSize:22,color:FG_STATUS_COLORS[s]}}>{countBy(s)}</div>
                  <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>{s}</div>
                </Card>
              ))}
              <Card theme={theme} style={{padding:12,textAlign:"center"}}>
                <div className="nanu-big-num" style={{fontSize:22,color:theme.text}}>{parts.length}{activeRound.targetN>0&&<span style={{fontSize:13,color:theme.textMut}}>/{activeRound.targetN}</span>}</div>
                <div style={{fontSize:11,color:theme.textMut,fontWeight:600,marginTop:2}}>Total Applied</div>
              </Card>
            </div>

            {/* Tabs */}
            <div className="nanu-ws-tabs" style={{display:"flex",gap:4,marginBottom:16,borderBottom:`1px solid ${theme.border}`,flexWrap:"wrap"}}>
              {[["participants","Participants",Users],["assets","Surveys & Sending",Send],["repository","Repository",FolderOpen],["channels","Posting Areas",Megaphone]].map(([k,l,Icon])=>(
                <button key={k} onClick={()=>setFgTab(k)} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",border:"none",background:"transparent",borderBottom:fgTab===k?`2px solid ${theme.teal}`:"2px solid transparent",color:fgTab===k?theme.teal:theme.textSec,cursor:"pointer",fontSize:13,fontWeight:600,marginBottom:-1}}>
                  <Icon size={14}/>{l}
                </button>
              ))}
            </div>

            {/* ── PARTICIPANTS ── */}
            {fgTab==="participants"&&<div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  {isAdmin&&<button type="button" onClick={()=>setFgShowContacts(v=>!v)} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:`1px solid ${fgShowContacts?theme.teal:theme.border}`,borderRadius:8,padding:"5px 10px",cursor:"pointer",color:fgShowContacts?theme.teal:theme.textMut,fontSize:12,fontWeight:600}}>
                    {fgShowContacts?<Eye size={13}/>:<EyeOff size={13}/>} Contact details {fgShowContacts?"on":"off"}
                  </button>}
                  {!isAdmin&&<span style={{fontSize:11,color:theme.textMut,display:"flex",alignItems:"center",gap:5}}><Lock size={11}/> Contact details are admin-only</span>}
                </div>
                <div style={{display:"flex",gap:6}}>
                  {accepted.length>0&&<Btn theme={theme} small onClick={()=>{
                    const emails=accepted.map(p=>p.email).filter(Boolean).join(",");
                    const subject=encodeURIComponent(`Live feedback session — ${activeRound.title||"Focus group"}`);
                    const body=encodeURIComponent(`Hi,\n\nThank you for accepting our invitation.\n\nPlease use the link below to book your live feedback session:\n${activeRound.sessionLink||"[add a session link on the round]"}\n\nThanks,\nThe Nanu Team`);
                    window.open(`mailto:?bcc=${emails}&subject=${subject}&body=${body}`);
                  }}><Send size={12}/> Invite {accepted.length} accepted to sessions</Btn>}
                  <Btn primary theme={theme} small onClick={()=>openM("editFgParticipant",{roundId:rid,name:"",email:"",phone:"",source:"",status:"Not Sent",invitedDate:"",respondedDate:"",sessionSlot:"",responseLink:"",notes:""})}><Plus size={13}/> Add Participant</Btn>
                </div>
              </div>

              {/* Bulk bar */}
              {fgSelected.length>0&&<Card theme={theme} style={{padding:"10px 14px",marginBottom:12,borderLeft:`3px solid ${theme.teal}`}}>
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <span style={{fontSize:13,fontWeight:600}}>{fgSelected.length} selected</span>
                  <span style={{fontSize:12,color:theme.textMut}}>Set status:</span>
                  {FG_PARTICIPANT_STATUS.map(s=>(
                    <button key={s} onClick={()=>bulkSetStatus(s)} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:`1px solid ${FG_STATUS_COLORS[s]}`,borderRadius:8,padding:"4px 10px",cursor:"pointer",color:FG_STATUS_COLORS[s],fontSize:12,fontWeight:600}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:FG_STATUS_COLORS[s]}}/>{s}
                    </button>
                  ))}
                  <button onClick={()=>setFgSelected([])} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer",fontSize:12,fontWeight:600}}>Clear</button>
                </div>
              </Card>}

              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {parts.map(p=>{
                  const sel=fgSelected.includes(p.id);
                  return <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,background:sel?`${theme.teal}12`:theme.bgCard,border:`1px solid ${sel?theme.teal:theme.border}`,flexWrap:"wrap"}}>
                    <input type="checkbox" checked={sel} onChange={()=>toggleSel(p.id)} style={{cursor:"pointer",accentColor:theme.teal,width:15,height:15,flexShrink:0}}/>
                    <div title={FG_STATUS_HINT[p.status]} style={{width:12,height:12,borderRadius:"50%",background:FG_STATUS_COLORS[p.status],flexShrink:0,boxShadow:`0 0 6px ${FG_STATUS_COLORS[p.status]}66`}}/>
                    <span style={{fontWeight:600,fontSize:13,flex:"1 1 140px",minWidth:0}}>{p.name||"Unnamed"}</span>
                    {canSeeContacts&&<span style={{fontSize:12,color:theme.textMut,flex:"1 1 160px",minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.email}{p.phone?` · ${p.phone}`:""}</span>}
                    {!canSeeContacts&&<span style={{fontSize:11,color:theme.textMut,fontStyle:"italic",flex:"1 1 160px"}}>contact hidden</span>}
                    {p.source&&<Badge label={p.source} color={theme.textMut}/>}
                    {p.sessionSlot&&<span style={{fontFamily:FONT_MONO,fontSize:11,color:theme.tealLt}}>{p.sessionSlot}</span>}
                    <select value={p.status} onChange={e=>{const upd={...p,status:e.target.value};setFgParticipants(prev=>prev.map(x=>x.id===p.id?upd:x));db.saveFgParticipant(upd)}}
                      style={{fontSize:11,padding:"3px 6px",borderRadius:6,border:`1px solid ${theme.border}`,background:theme.bgInput,color:FG_STATUS_COLORS[p.status],cursor:"pointer",fontWeight:700}}>
                      {FG_PARTICIPANT_STATUS.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                    {p.responseLink&&<a href={p.responseLink} target="_blank" rel="noopener noreferrer" style={{color:theme.teal,display:"flex"}}><ExternalLink size={12}/></a>}
                    <Btn theme={theme} small onClick={()=>openM("editFgParticipant",{...p})}><Edit3 size={11}/></Btn>
                  </div>;
                })}
                {parts.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No participants yet. Add them individually or import a list.</p>}
              </div>

              {/* Legend */}
              <div style={{display:"flex",gap:14,flexWrap:"wrap",marginTop:14,padding:"10px 14px",background:theme.bgInput,borderRadius:8}}>
                {FG_PARTICIPANT_STATUS.map(s=>(
                  <div key={s} style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:theme.textMut}}>
                    <div style={{width:9,height:9,borderRadius:"50%",background:FG_STATUS_COLORS[s]}}/>{FG_STATUS_HINT[s]}
                  </div>
                ))}
              </div>
            </div>}

            {/* ── SURVEYS & SENDING ── */}
            {fgTab==="assets"&&<div>
              <p style={{fontSize:13,color:theme.textSec,marginBottom:12}}>Drop in the surveys and invitations for this round, then stage a send to your selected participants.</p>

              {/* Drop zone */}
              <div
                onDragOver={e=>{e.preventDefault();setFgDragOver(true)}}
                onDragLeave={()=>setFgDragOver(false)}
                onDrop={e=>{
                  e.preventDefault(); setFgDragOver(false);
                  const url=e.dataTransfer.getData("text/uri-list")||e.dataTransfer.getData("text/plain");
                  const files=e.dataTransfer.files;
                  if(url&&url.startsWith("http")) addDroppedAsset(url.split("/").pop()||"Dropped link",url,"Survey");
                  else if(files&&files.length) Array.from(files).forEach(f=>addDroppedAsset(f.name,"","Survey"));
                }}
                style={{border:`2px dashed ${fgDragOver?theme.teal:theme.border}`,borderRadius:12,padding:24,textAlign:"center",marginBottom:16,background:fgDragOver?`${theme.teal}0d`:"transparent",transition:"all .15s"}}>
                <FolderOpen size={24} color={fgDragOver?theme.teal:theme.textMut} style={{marginBottom:8}}/>
                <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>Drop a Google Drive link here</div>
                <p style={{fontSize:11,color:theme.textMut,margin:"0 0 10px"}}>Drag a Drive, Typeform or Google Forms link straight in. Files live in Drive — the hub stores the link.</p>
                <Btn theme={theme} small onClick={()=>openM("editFgAsset",{roundId:rid,name:"",type:"Survey",url:"",addedDate:todayStr,notes:""})}><Plus size={12}/> Add Manually</Btn>
              </div>

              {/* Assets list */}
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
                {outbound.map(a=>(
                  <Card key={a.id} theme={theme} style={{padding:12,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <FileText size={14} color={theme.teal}/>
                    <span style={{fontWeight:600,fontSize:13,flex:"1 1 160px",minWidth:0}}>{a.name}</span>
                    <Badge label={a.type} color={theme.textMut}/>
                    {a.url?<a href={a.url} target="_blank" rel="noopener noreferrer" style={{color:theme.teal,fontSize:12,display:"flex",alignItems:"center",gap:3}}><ExternalLink size={11}/> Open</a>:<span style={{fontSize:11,color:theme.orange}}>no link yet</span>}
                    <Btn theme={theme} small onClick={()=>openM("editFgAsset",{...a})}><Edit3 size={11}/></Btn>
                  </Card>
                ))}
                {outbound.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:16}}>No surveys or invitations added yet.</p>}
              </div>

              {/* Mass send staging */}
              <Card theme={theme} style={{padding:16,borderLeft:`3px solid ${theme.orange}`}}>
                <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:15,marginBottom:6}}>Mass Send</div>
                <p style={{fontSize:12,color:theme.textSec,marginTop:0,lineHeight:1.6}}>
                  Select participants on the Participants tab, then stage the send here. Nothing goes out automatically — you review the list, send via your mail client, and confirm to update everyone to <strong>Sent</strong> in one action.
                </p>
                {!fgSendStaged&&<Btn primary theme={theme} onClick={()=>setFgSendStaged(true)} disabled={fgSelected.length===0}>
                  <Send size={13}/> Stage send for {fgSelected.length} selected
                </Btn>}
                {fgSelected.length===0&&!fgSendStaged&&<div style={{fontSize:11,color:theme.textMut,marginTop:8}}>Select participants first.</div>}

                {fgSendStaged&&<div style={{marginTop:12}}>
                  <div style={{fontSize:11,fontWeight:700,color:theme.orange,textTransform:"uppercase",letterSpacing:".04em",marginBottom:8}}>Review before sending</div>
                  <div style={{background:theme.bgInput,borderRadius:8,padding:12,marginBottom:12,maxHeight:180,overflow:"auto"}}>
                    {fgSelected.map(pid=>{const p=fgParticipants.find(x=>x.id===pid);return p?<div key={pid} style={{fontSize:12,padding:"2px 0",display:"flex",gap:8}}>
                      <span style={{flex:1}}>{p.name}</span>
                      <span style={{color:theme.textMut,fontFamily:FONT_MONO,fontSize:11}}>{isAdmin?p.email:"hidden"}</span>
                    </div>:null})}
                  </div>
                  <div style={{fontSize:12,color:theme.textSec,marginBottom:10}}>Attaching: {outbound.map(a=>a.name).join(", ")||"no assets selected"}</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {isAdmin&&<Btn theme={theme} onClick={()=>{
                      const emails=fgSelected.map(pid=>fgParticipants.find(x=>x.id===pid)?.email).filter(Boolean).join(",");
                      const subject=encodeURIComponent(activeRound.title||"Invitation to take part in our research");
                      const links=outbound.filter(a=>a.url).map(a=>`${a.name}: ${a.url}`).join("\n");
                      const body=encodeURIComponent(`Hi,\n\nWe'd love your input on ${activeRound.title||"our research"}.\n\n${links}\n\nThank you,\nThe Nanu Team`);
                      window.open(`mailto:?bcc=${emails}&subject=${subject}&body=${body}`);
                    }}><Send size={13}/> Open in mail client</Btn>}
                    <Btn theme={theme} onClick={()=>{
                      const rows=[["Name","Email","Status"]];
                      fgSelected.forEach(pid=>{const p=fgParticipants.find(x=>x.id===pid);if(p)rows.push([p.name||"",p.email||"",p.status])});
                      exportCSV(rows,`focus-send-list-${new Date().toISOString().slice(0,10)}.csv`);
                    }}><Download size={13}/> Export list</Btn>
                    <Btn primary theme={theme} onClick={()=>bulkSetStatus("Sent")}><Check size={13}/> Confirm sent — mark all yellow</Btn>
                    <Btn theme={theme} onClick={()=>setFgSendStaged(false)}>Cancel</Btn>
                  </div>
                </div>}
              </Card>
            </div>}

            {/* ── REPOSITORY ── */}
            {fgTab==="repository"&&<div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
                <p style={{fontSize:13,color:theme.textSec,margin:0}}>Every response received back for this round, in one place.</p>
                <Btn primary theme={theme} small onClick={()=>openM("editFgAsset",{roundId:rid,name:"",type:"Response",url:"",addedDate:todayStr,notes:""})}><Plus size={13}/> Add Response</Btn>
              </div>

              {/* Responses from participants */}
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
                {parts.filter(p=>p.responseLink).map(p=>(
                  <Card key={p.id} theme={theme} style={{padding:12,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <div style={{width:10,height:10,borderRadius:"50%",background:FG_STATUS_COLORS[p.status],flexShrink:0}}/>
                    <span style={{fontWeight:600,fontSize:13,flex:"1 1 140px"}}>{p.name}</span>
                    {p.respondedDate&&<span style={{fontFamily:FONT_MONO,fontSize:11,color:theme.textMut}}>{p.respondedDate}</span>}
                    <a href={p.responseLink} target="_blank" rel="noopener noreferrer" style={{color:theme.teal,fontSize:12,display:"flex",alignItems:"center",gap:3}}><ExternalLink size={11}/> View response</a>
                  </Card>
                ))}
                {responses.map(a=>(
                  <Card key={a.id} theme={theme} style={{padding:12,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <FileText size={14} color={theme.green}/>
                    <span style={{fontWeight:600,fontSize:13,flex:"1 1 160px"}}>{a.name}</span>
                    {a.addedDate&&<span style={{fontFamily:FONT_MONO,fontSize:11,color:theme.textMut}}>{a.addedDate}</span>}
                    {a.url&&<a href={a.url} target="_blank" rel="noopener noreferrer" style={{color:theme.teal,fontSize:12,display:"flex",alignItems:"center",gap:3}}><ExternalLink size={11}/> Open</a>}
                    <Btn theme={theme} small onClick={()=>openM("editFgAsset",{...a})}><Edit3 size={11}/></Btn>
                  </Card>
                ))}
                {parts.filter(p=>p.responseLink).length===0&&responses.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>No responses received yet. Add a response link to a participant, or log one here.</p>}
              </div>
            </div>}

            {/* ── POSTING AREAS ── */}
            {fgTab==="channels"&&<div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
                <p style={{fontSize:13,color:theme.textSec,margin:0}}>Places we're allowed to post invites and surveys. Move them from Pending to Identified to Approved.</p>
                <Btn primary theme={theme} small onClick={()=>openM("editFgChannel",{name:"",platform:"",url:"",status:"Pending",rules:"",owner:curUser.id,notes:""})}><Plus size={13}/> Add Area</Btn>
              </div>

              <div style={{display:"flex",gap:4,marginBottom:14,borderBottom:`1px solid ${theme.border}`,flexWrap:"wrap"}}>
                {FG_CHANNEL_STATUS.map(s=>(
                  <button key={s} onClick={()=>setFgChannelTab(s)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",border:"none",background:"transparent",borderBottom:fgChannelTab===s?`2px solid ${FG_CHANNEL_STATUS_COLORS[s]}`:"2px solid transparent",color:fgChannelTab===s?FG_CHANNEL_STATUS_COLORS[s]:theme.textSec,cursor:"pointer",fontSize:13,fontWeight:600,marginBottom:-1}}>
                    {s}<span style={{fontSize:11,opacity:0.7}}>{fgChannels.filter(c=>c.status===s).length}</span>
                  </button>
                ))}
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {fgChannels.filter(c=>c.status===fgChannelTab).map(c=>(
                  <Card key={c.id} theme={theme} style={{padding:14,borderLeft:`3px solid ${FG_CHANNEL_STATUS_COLORS[c.status]}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                      <div style={{flex:"1 1 200px",minWidth:0}}>
                        <div style={{fontWeight:700,fontSize:14}}>{c.name}{c.platform&&<span style={{fontWeight:400,color:theme.textMut}}> · {c.platform}</span>}</div>
                        {c.rules&&<div style={{fontSize:12,color:theme.orange,marginTop:3}}>Rules: {c.rules}</div>}
                      </div>
                      {c.url&&<a href={c.url} target="_blank" rel="noopener noreferrer" style={{color:theme.teal,display:"flex",alignItems:"center",gap:3,fontSize:12}}><ExternalLink size={11}/> Open</a>}
                      <span style={{fontSize:11,color:theme.textMut}}>{uName(c.owner)}</span>
                      <select value={c.status} onChange={e=>{const upd={...c,status:e.target.value};setFgChannels(prev=>prev.map(x=>x.id===c.id?upd:x));db.saveFgChannel(upd)}}
                        style={{fontSize:11,padding:"3px 6px",borderRadius:6,border:`1px solid ${theme.border}`,background:theme.bgInput,color:FG_CHANNEL_STATUS_COLORS[c.status],cursor:"pointer",fontWeight:700}}>
                        {FG_CHANNEL_STATUS.map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                      <Btn theme={theme} small onClick={()=>openM("editFgChannel",{...c})}><Edit3 size={11}/></Btn>
                    </div>
                    {c.notes&&<p style={{fontSize:12,color:theme.textMut,margin:"6px 0 0",lineHeight:1.5}}>{c.notes}</p>}
                  </Card>
                ))}
                {fgChannels.filter(c=>c.status===fgChannelTab).length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>Nothing in {fgChannelTab} yet.</p>}
              </div>
            </div>}
          </>}
        </div>
      );
    }

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

    /* ─── SETTINGS ─── */
    /* ─── MY SPACE ─── */
    case "workspace": {
      const ws = workspace;
      const todos = ws.todos || [];
      const wnotes = ws.notes || [];
      const bookmarks = ws.bookmarks || [];
      const goals = ws.goals || [];
      const drafts = ws.drafts || [];
      const contacts = ws.contacts || [];
      const weeklyFocus = ws.weeklyFocus || [];
      const pinnedItems = ws.pinned || [];
      const todayStr2 = new Date().toISOString().split("T")[0];

      const ShareToggle = ({item, listKey, idx}) => (
        <button type="button" onClick={()=>updateWs(listKey, prev=>{const u=[...prev];u[idx]={...u[idx],shared:!u[idx].shared};return u})}
          style={{background:"none",border:"none",cursor:"pointer",color:item.shared?theme.teal:theme.textMut,opacity:item.shared?1:0.4,display:"flex",alignItems:"center",gap:3,fontSize:10}}>
          <Share2 size={11}/>{item.shared?"Shared":"Private"}
        </button>
      );

      // Simple markdown renderer
      const renderMd = (text) => {
        if (!text) return null;
        return text.split("\n").map((line, i) => {
          let html = line
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/`(.+?)`/g, '<code style="background:rgba(31,194,194,0.15);padding:1px 4px;border-radius:3px;font-size:12px">$1</code>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" rel="noopener noreferrer" style="color:${theme.teal}">$1</a>`);
          if (line.startsWith("### ")) html = `<strong style="font-size:15px">${line.slice(4)}</strong>`;
          else if (line.startsWith("## ")) html = `<strong style="font-size:16px">${line.slice(3)}</strong>`;
          else if (line.startsWith("# ")) html = `<strong style="font-size:18px;font-family:${FONT_DISPLAY}">${line.slice(2)}</strong>`;
          else if (line.startsWith("- ")) html = `<span style="padding-left:12px">• ${line.slice(2)}</span>`;
          return <div key={i} dangerouslySetInnerHTML={{__html:html}} style={{minHeight:line.trim()?undefined:8}}/>;
        });
      };

      // My stuff counts
      const myTaskCount = tasks.filter(t=>Array.isArray(t.owners)?t.owners.includes(curUser.id):t.owners===curUser.id).filter(t=>t.status!=="Done").length;
      const myProjectCount = visibleProjects.filter(p=>p.owner===curUser.id||(p.members||[]).includes(curUser.id)).length;
      const myOutreachCount = outreach.filter(o=>o.owner===curUser.id).length;

      // Personal activity from global activity
      const myActivity = activity.filter(a=>a.user===curUser.id).slice(0, 15);

      return (
        <div>
          <SectionHead theme={theme}>My Space</SectionHead>
          <p style={{fontSize:13,color:theme.textSec,marginBottom:16}}>Your private workspace. Items are only visible to you unless shared.</p>

          {/* ── WEEKLY FOCUS ── */}
          <Card theme={theme} style={{padding:16,marginBottom:16,borderLeft:`3px solid ${theme.teal}`}} className="nanu-ws-focus">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:15}}>Weekly Focus</div>
              <span style={{fontSize:10,color:theme.textMut,fontFamily:FONT_MONO}}>Week of {new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</span>
            </div>
            {[0,1,2].map(i=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <CircleDot size={14} color={weeklyFocus[i]?theme.teal:theme.border}/>
                <input value={(weeklyFocus[i])||""} onChange={e=>{const wf=[...weeklyFocus];wf[i]=e.target.value;updateWs("weeklyFocus",wf)}}
                  style={{flex:1,background:"transparent",border:"none",borderBottom:`1px solid ${theme.border}`,padding:"6px 0",fontSize:14,color:theme.text,outline:"none",fontFamily:FONT_BODY}} placeholder={`Priority ${i+1}...`}/>
              </div>
            ))}
          </Card>

          {/* ── QUICK LINKS TO MY STUFF ── */}
          <div className="nanu-ws-quicklinks" style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
            {[
              {label:"My Tasks",count:myTaskCount,color:theme.teal,section:"tasks",icon:<CheckSquare size={14}/>},
              {label:"My Projects",count:myProjectCount,color:"#DA77F2",section:"projects",icon:<FolderKanban size={14}/>},
              {label:"My Outreach",count:myOutreachCount,color:"#FFA94D",section:"outreach",icon:<Megaphone size={14}/>},
            ].map(q=>(
              <Card key={q.label} theme={theme} onClick={()=>{setSection(q.section);if(q.section==="tasks")setTaskView("mine")}} style={{padding:"12px 16px",cursor:"pointer",flex:"1 1 150px",display:"flex",alignItems:"center",gap:10}}>
                <div style={{color:q.color}}>{q.icon}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{q.label}</div>
                  <div style={{fontSize:18,fontWeight:800,color:q.color,fontFamily:FONT_DISPLAY}}>{q.count}</div>
                </div>
              </Card>
            ))}
          </div>

          {/* ── MY RESPONSIBILITIES ── */}
          {(()=>{const mine=responsibilities.filter(r=>r.owner===curUser.id&&r.status==="Active");return mine.length>0&&<div style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:600,color:theme.textMut,marginBottom:8,textTransform:"uppercase",display:"flex",alignItems:"center",gap:5}}><Repeat size={12}/> My Responsibilities</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {mine.sort((a,b)=>(respNextDue(a)||"9999").localeCompare(respNextDue(b)||"9999")).map(r=>{
                const nd=respNextDue(r);const due=respIsDue(r);
                return <Card key={r.id} theme={theme} style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",borderLeft:`3px solid ${RESP_CADENCE_COLORS[r.cadence]}`}}>
                  <span onClick={()=>setSection("responsibilities")} style={{fontWeight:600,fontSize:13,flex:"1 1 160px",cursor:"pointer",minWidth:0}}>{r.title}</span>
                  <Badge label={r.cadence} color={RESP_CADENCE_COLORS[r.cadence]}/>
                  {r.cadence!=="Continuous"&&<span style={{fontFamily:FONT_MONO,fontSize:11,color:due?theme.orange:theme.textMut}}>{due?"Due ":"Next "}{nd||"—"}</span>}
                  {r.cadence!=="Continuous"&&<Btn theme={theme} small onClick={()=>markRespDone(r)}><Check size={12}/> Done</Btn>}
                </Card>;
              })}
            </div>
          </div>})()}

          {/* ── PINNED ITEMS ── */}
          {pinnedItems.length>0&&<div style={{marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:600,color:theme.textMut,marginBottom:8,textTransform:"uppercase"}}>Pinned Items</div>
            <div className="nanu-ws-pinned" style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {pinnedItems.map((pin,idx)=>{
                const target = pin.type==="task"?tasks.find(t=>t.id===pin.id):pin.type==="project"?visibleProjects.find(p=>p.id===pin.id):pin.type==="outreach"?outreach.find(o=>o.id===pin.id):pin.type==="partnership"?partnerships.find(p=>p.id===pin.id):pin.type==="responsibility"?responsibilities.find(r=>r.id===pin.id):calendar.find(c=>c.id===pin.id);
                if(!target) return null;
                return <div key={pin.id+pin.type} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",background:theme.bgInput,borderRadius:8,border:`1px solid ${theme.border}`,cursor:"pointer"}}
                  onClick={()=>{if(pin.type==="task")openM("editTask",{...target});else if(pin.type==="project")setSection("projects");else if(pin.type==="outreach")openM("editOutreach",{...target});else if(pin.type==="partnership")openM("editPartnership",{...target});else if(pin.type==="responsibility")openM("editResponsibility",{...target});else openM("editCal",{...target})}}>
                  <Pin size={11} color={theme.teal}/>
                  <span style={{fontSize:13,fontWeight:500}}>{target.title||target.name}</span>
                  <Badge label={pin.type} color={theme.textMut} style={{fontSize:9}}/>
                  <button type="button" onClick={e=>{e.stopPropagation();updateWs("pinned",p=>p.filter((_,j)=>j!==idx))}} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer",opacity:0.4}}><X size={12}/></button>
                </div>;
              })}
            </div>
          </div>}

          {/* Tabs */}
          <div className="nanu-ws-tabs" style={{display:"flex",gap:2,background:theme.bgInput,borderRadius:10,padding:3,border:`1px solid ${theme.border}`,marginBottom:20,flexWrap:"wrap"}}>
            {[["role","My Role",Award],["todos","To-Dos",CheckSquare],["wnotes","Scratchpad",FileEdit],["bookmarks","Bookmarks",Bookmark],["contacts","Address Book",Users2],["goals","Goals",Target],["drafts","Drafts",FileText],["myactivity","Activity",Clock]].map(([k,l,Icon])=>(
              <button key={k} type="button" onClick={()=>setWsTab(k)} style={{padding:"8px 14px",borderRadius:8,border:"none",fontSize:12,fontWeight:600,background:wsTab===k?theme.teal:"transparent",color:wsTab===k?"#0D1B21":theme.textSec,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
                <Icon size={13}/>{l}
                {k==="todos"&&todos.filter(t=>!t.done).length>0&&<span style={{background:wsTab===k?"#0D1B2130":theme.teal,color:wsTab===k?"#0D1B21":"#0D1B21",padding:"1px 6px",borderRadius:10,fontSize:10,fontWeight:700}}>{todos.filter(t=>!t.done).length}</span>}
              </button>
            ))}
          </div>

          {/* ── MY ROLE ── */}
          {wsTab==="role"&&(()=>{
            const os = opStructures.find(s=>s.userId===curUser.id);
            const dayIdx = new Date().getDay();
            const todayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dayIdx];
            const Block = ({title, items, color, note}) => (
              (items&&items.length>0)?<Card theme={theme} style={{padding:18,marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:color||theme.teal,textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>{title}</div>
                {note&&<p style={{fontSize:12,color:theme.textMut,margin:"0 0 10px",lineHeight:1.5}}>{note}</p>}
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {items.map((it,i)=>(
                    <div key={i} style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:color||theme.teal,flexShrink:0,marginTop:7}}/>
                      <span style={{fontSize:13,color:theme.textSec,lineHeight:1.6}}>{it}</span>
                    </div>
                  ))}
                </div>
              </Card>:null
            );

            if(!os) return <Card theme={theme} style={{padding:32,textAlign:"center"}}>
              <Award size={28} color={theme.textMut} style={{marginBottom:10}}/>
              <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16,marginBottom:6}}>No operating structure yet</div>
              <p style={{fontSize:13,color:theme.textMut,maxWidth:420,margin:"0 auto 14px",lineHeight:1.6}}>This is where what you own, your weekly rhythm and your standing responsibilities live. Build yours, or ask Nicholas to set it up.</p>
              <Btn primary theme={theme} onClick={()=>openM("editOpStructure",{userId:curUser.id,subtitle:"",intro:"",owns:[],shared:[],cadence:[{day:"Monday",theme:"",items:[]},{day:"Tuesday",theme:"",items:[]},{day:"Wednesday",theme:"",items:[]},{day:"Thursday",theme:"",items:[]},{day:"Friday",theme:"",items:[]}],standing:[],focus:[],sourceNote:""})}><Plus size={14}/> Create my structure</Btn>
            </Card>;

            return <div>
              <Card theme={theme} style={{padding:20,marginBottom:14,borderLeft:`3px solid ${theme.teal}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
                  <div style={{flex:"1 1 260px",minWidth:0}}>
                    <div style={{fontFamily:FONT_DISPLAY,fontWeight:800,fontSize:22,lineHeight:1.2}}>{curUser.name}</div>
                    {os.subtitle&&<div style={{fontSize:12,color:theme.tealLt,marginTop:3,letterSpacing:".02em"}}>{os.subtitle}</div>}
                  </div>
                  <Btn theme={theme} small onClick={()=>openM("editOpStructure",{...os})}><Edit3 size={12}/> Edit</Btn>
                </div>
                {os.intro&&<p style={{fontSize:13,color:theme.textSec,margin:"12px 0 0",lineHeight:1.6}}>{os.intro}</p>}
              </Card>

              <Block title="What you own" items={os.owns} color={theme.teal}/>
              <Block title="Shared and supporting" items={os.shared} color={theme.tealLt}/>

              {/* Weekly cadence */}
              {(os.cadence||[]).length>0&&<div style={{marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:theme.textMut,textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>Weekly cadence</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {(os.cadence||[]).map((d,i)=>{
                    const isToday = d.day===todayName;
                    return <Card key={i} theme={theme} style={{padding:16,borderLeft:`3px solid ${isToday?theme.teal:theme.border}`,background:isToday?`${theme.teal}0a`:theme.bgCard}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:d.items&&d.items.length?9:0,flexWrap:"wrap"}}>
                        <span style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:15,color:isToday?theme.teal:theme.text}}>{d.day}</span>
                        {d.theme&&<span style={{fontSize:12,color:theme.textMut}}>· {d.theme}</span>}
                        {isToday&&<Badge label="Today" color={theme.teal}/>}
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                        {(d.items||[]).map((it,j)=>(
                          <div key={j} style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                            <div style={{width:5,height:5,borderRadius:"50%",background:isToday?theme.teal:theme.textMut,flexShrink:0,marginTop:7,opacity:isToday?1:0.5}}/>
                            <span style={{fontSize:13,color:theme.textSec,lineHeight:1.6}}>{it}</span>
                          </div>
                        ))}
                      </div>
                    </Card>;
                  })}
                </div>
              </div>}

              <Block title="Standing responsibilities" items={os.standing} color="#FFD43B"/>
              <Block title="Immediate focus · next 1–2 weeks" items={os.focus} color={theme.orange}/>

              {os.sourceNote&&<p style={{fontSize:11,color:theme.textMut,fontStyle:"italic",lineHeight:1.6,padding:"10px 2px"}}>{os.sourceNote}</p>}
            </div>;
          })()}

          {/* ── TO-DO LIST (with priority & due date) ── */}
          {wsTab==="todos"&&<Card theme={theme} style={{padding:18}}>
            <div className="nanu-ws-todo-add" style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
              <Input theme={theme} value={form._newTodo||""} onChange={e=>setForm(p=>({...p,_newTodo:e.target.value}))} placeholder="Add a to-do..." style={{flex:1,minWidth:150}} onKeyDown={e=>{if(e.key==="Enter"&&(form._newTodo||"").trim()){updateWs("todos",p=>[...p,{id:uid("wtd"),text:form._newTodo.trim(),done:false,shared:false,priority:form._todoPri||"Medium",dueDate:form._todoDue||"",date:todayStr2}]);setForm(p=>({...p,_newTodo:"",_todoPri:"Medium",_todoDue:""}))}}}/>
              <select value={form._todoPri||"Medium"} onChange={e=>setForm(p=>({...p,_todoPri:e.target.value}))} style={{padding:"6px 8px",borderRadius:8,border:`1px solid ${theme.border}`,background:theme.bgInput,color:theme.text,fontSize:12}}>
                <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
              </select>
              <Input theme={theme} type="date" value={form._todoDue||""} onChange={e=>setForm(p=>({...p,_todoDue:e.target.value}))} style={{width:140,fontSize:12}}/>
              <Btn theme={theme} small onClick={()=>{if(!(form._newTodo||"").trim())return;updateWs("todos",p=>[...p,{id:uid("wtd"),text:form._newTodo.trim(),done:false,shared:false,priority:form._todoPri||"Medium",dueDate:form._todoDue||"",date:todayStr2}]);setForm(p=>({...p,_newTodo:"",_todoPri:"Medium",_todoDue:""}))}}><Plus size={13}/></Btn>
            </div>
            {[...todos].filter(t=>!t.done).sort((a,b)=>{const p={Urgent:0,High:1,Medium:2,Low:3};return (p[a.priority]||2)-(p[b.priority]||2)}).map((t)=>{const idx=todos.indexOf(t);const overdue=t.dueDate&&t.dueDate<todayStr2;return(
              <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:`1px solid ${theme.border}`}}>
                <input type="checkbox" checked={false} onChange={()=>updateWs("todos",p=>{const u=[...p];u[idx]={...u[idx],done:true};return u})} style={{cursor:"pointer",width:16,height:16}}/>
                <div style={{width:6,height:6,borderRadius:"50%",background:TASK_PRIORITY_COLORS[t.priority]||theme.textMut,flexShrink:0}}/>
                <span style={{flex:1,fontSize:14,color:overdue?theme.red:theme.text}}>{t.text}</span>
                {t.dueDate&&<span style={{fontSize:10,fontFamily:FONT_MONO,color:overdue?theme.red:theme.textMut}}>{t.dueDate}</span>}
                <ShareToggle item={t} listKey="todos" idx={idx}/>
                <button type="button" onClick={()=>updateWs("todos",p=>p.filter(x=>x.id!==t.id))} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer",opacity:0.4}}><X size={13}/></button>
              </div>
            )})}
            {todos.filter(t=>t.done).length>0&&<>
              <button type="button" onClick={()=>setForm(p=>({...p,_showWsDone:!p._showWsDone}))} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",fontFamily:FONT_BODY,fontSize:13,fontWeight:600,color:theme.green,padding:"10px 0"}}>
                <Check size={14}/> Done ({todos.filter(t=>t.done).length})
                <ChevronRight size={12} style={{transform:form._showWsDone?"rotate(90deg)":"none",transition:"transform .2s"}}/>
              </button>
              {form._showWsDone&&todos.filter(t=>t.done).map((t)=>{const idx=todos.indexOf(t);return(
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",opacity:0.5}}>
                  <input type="checkbox" checked={true} onChange={()=>updateWs("todos",p=>{const u=[...p];u[idx]={...u[idx],done:false};return u})} style={{cursor:"pointer",width:16,height:16}}/>
                  <span style={{flex:1,fontSize:14,textDecoration:"line-through",color:theme.textMut}}>{t.text}</span>
                  <button type="button" onClick={()=>updateWs("todos",p=>p.filter(x=>x.id!==t.id))} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer",opacity:0.4}}><X size={13}/></button>
                </div>
              )})}
            </>}
            {todos.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:16}}>No to-dos yet</p>}
          </Card>}

          {/* ── SCRATCHPAD (with markdown preview) ── */}
          {wsTab==="wnotes"&&<div>
            <Btn theme={theme} small onClick={()=>updateWs("notes",p=>[{id:uid("wn"),text:"",title:"Untitled note",shared:false,date:todayStr2,previewMode:false},...p])} style={{marginBottom:12}}><Plus size={13}/> New Note</Btn>
            <div className="nanu-grid-notes">
              {wnotes.map((n,idx)=>(
                <Card key={n.id} theme={theme} style={{padding:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <input value={n.title||""} onChange={e=>updateWs("notes",p=>{const u=[...p];u[idx]={...u[idx],title:e.target.value};return u})} style={{background:"transparent",border:"none",fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:15,color:theme.text,outline:"none",flex:1}} placeholder="Note title..."/>
                    <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                      <button type="button" onClick={()=>updateWs("notes",p=>{const u=[...p];u[idx]={...u[idx],previewMode:!u[idx].previewMode};return u})} style={{background:"none",border:"none",cursor:"pointer",color:n.previewMode?theme.teal:theme.textMut,fontSize:10,fontWeight:600}}>{n.previewMode?"Edit":"Preview"}</button>
                      <ShareToggle item={n} listKey="notes" idx={idx}/>
                      <button type="button" onClick={()=>updateWs("notes",p=>p.filter(x=>x.id!==n.id))} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer",opacity:0.4}}><Trash2 size={13}/></button>
                    </div>
                  </div>
                  {n.previewMode
                    ?<div style={{minHeight:100,padding:"8px 0",fontSize:14,color:theme.textSec,lineHeight:1.7}}>{renderMd(n.text)}</div>
                    :<textarea value={n.text||""} onChange={e=>updateWs("notes",p=>{const u=[...p];u[idx]={...u[idx],text:e.target.value};return u})}
                      style={{width:"100%",minHeight:100,padding:"8px 0",border:"none",background:"transparent",color:theme.textSec,fontFamily:FONT_MONO,fontSize:13,outline:"none",resize:"vertical",lineHeight:1.6}} placeholder="Supports **bold**, *italic*, `code`, [links](url), # headers, - lists"/>
                  }
                  <div style={{fontSize:10,color:theme.textMut,fontFamily:FONT_MONO,marginTop:4}}>{n.date} · {(n.text||"").split(/\s+/).filter(Boolean).length} words</div>
                </Card>
              ))}
            </div>
            {wnotes.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:20}}>No notes yet</p>}
          </div>}

          {/* ── BOOKMARKS ── */}
          {wsTab==="bookmarks"&&<Card theme={theme} style={{padding:18}}>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <Input theme={theme} value={form._bmLabel||""} onChange={e=>setForm(p=>({...p,_bmLabel:e.target.value}))} placeholder="Label" style={{flex:1}}/>
              <Input theme={theme} value={form._bmUrl||""} onChange={e=>setForm(p=>({...p,_bmUrl:e.target.value}))} placeholder="https://..." style={{flex:2}}/>
              <Btn theme={theme} small onClick={()=>{if(!(form._bmLabel||"").trim()||!(form._bmUrl||"").trim())return;updateWs("bookmarks",p=>[...p,{id:uid("wbm"),label:form._bmLabel.trim(),url:form._bmUrl.trim(),shared:false}]);setForm(p=>({...p,_bmLabel:"",_bmUrl:""}))}}><Plus size={13}/></Btn>
            </div>
            {bookmarks.map((bm,idx)=>(
              <div key={bm.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${theme.border}`}}>
                <Bookmark size={13} color={theme.teal}/>
                <a href={bm.url} target="_blank" rel="noopener noreferrer" style={{flex:1,fontSize:14,color:theme.teal,textDecoration:"none",fontWeight:500}}>{bm.label}</a>
                <span style={{fontSize:11,color:theme.textMut,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{bm.url}</span>
                <ShareToggle item={bm} listKey="bookmarks" idx={idx}/>
                <button type="button" onClick={()=>updateWs("bookmarks",p=>p.filter(x=>x.id!==bm.id))} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer",opacity:0.4}}><X size={13}/></button>
              </div>
            ))}
            {bookmarks.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:16}}>No bookmarks yet</p>}
          </Card>}

          {/* ── ADDRESS BOOK ── */}
          {wsTab==="contacts"&&<div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
              <Input theme={theme} value={form._contactSearch||""} onChange={e=>setForm(p=>({...p,_contactSearch:e.target.value}))} placeholder="Search contacts..." style={{flex:"1 1 200px",maxWidth:300}}/>
              <div style={{display:"flex",gap:6}}>
                {contacts.length>0&&<>
                  <Btn theme={theme} small onClick={()=>{
                    const rows=[["Name","Role","Company","Email","Phone","Category","Notes"],...contacts.map(c=>[c.name||"",c.role||"",c.company||"",c.email||"",c.phone||"",c.category||"",c.notes||""])];
                    exportCSV(rows,`nanu-contacts-${new Date().toISOString().split("T")[0]}.csv`);
                  }}><Download size={12}/> CSV</Btn>
                  <Btn theme={theme} small onClick={()=>{
                    const vcards=contacts.map(c=>{
                      const n=(c.name||"").split(" ");
                      const last=n.length>1?n.slice(1).join(" "):"";
                      const first=n[0]||"";
                      let v="BEGIN:VCARD\nVERSION:3.0\n";
                      v+=`N:${last};${first};;;\nFN:${c.name||""}\n`;
                      if(c.company)v+=`ORG:${c.company}\n`;
                      if(c.role)v+=`TITLE:${c.role}\n`;
                      if(c.email)v+=`EMAIL;TYPE=WORK:${c.email}\n`;
                      if(c.phone)v+=`TEL;TYPE=WORK:${c.phone}\n`;
                      if(c.notes)v+=`NOTE:${c.notes.replace(/\n/g," ")}\n`;
                      (c.links||[]).forEach(l=>{if(l.url)v+=`URL:${l.url}\n`});
                      v+="END:VCARD";
                      return v;
                    }).join("\n");
                    const a=document.createElement("a");
                    a.href=URL.createObjectURL(new Blob([vcards],{type:"text/vcard"}));
                    a.download=`nanu-contacts-${new Date().toISOString().split("T")[0]}.vcf`;
                    a.click();
                  }}><Download size={12}/> vCard</Btn>
                </>}
                <Btn primary theme={theme} small onClick={()=>openM("editContact",{name:"",company:"",role:"",email:"",phone:"",category:"Press",notes:"",links:[]})}><Plus size={13}/> Add Contact</Btn>
              </div>
            </div>
            {(()=>{
              const q=(form._contactSearch||"").toLowerCase();
              const filtered=contacts.filter(c=>!q||c.name?.toLowerCase().includes(q)||c.company?.toLowerCase().includes(q)||c.email?.toLowerCase().includes(q)||c.role?.toLowerCase().includes(q));
              const cats=[...new Set(filtered.map(c=>c.category||"Other"))].sort();
              return <>
                {cats.map(cat=>(
                  <div key={cat} style={{marginBottom:18}}>
                    <div style={{fontSize:11,fontWeight:600,color:theme.textMut,marginBottom:8,textTransform:"uppercase",letterSpacing:".04em"}}>{cat}</div>
                    <div className="nanu-grid-2col">
                      {filtered.filter(c=>(c.category||"Other")===cat).map((c,idx)=>{
                        const realIdx=contacts.indexOf(c);
                        return <Card key={c.id} theme={theme} style={{padding:14}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                            <div style={{display:"flex",gap:10,alignItems:"center",flex:1,minWidth:0}}>
                              <div style={{width:36,height:36,borderRadius:"50%",background:theme.teal,display:"flex",alignItems:"center",justifyContent:"center",color:"#0D1B21",fontWeight:700,fontSize:14,flexShrink:0}}>{(c.name||"?").charAt(0).toUpperCase()}</div>
                              <div style={{minWidth:0}}>
                                <div style={{fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                                {(c.role||c.company)&&<div style={{fontSize:12,color:theme.textMut,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.role}{c.role&&c.company?" · ":""}{c.company}</div>}
                              </div>
                            </div>
                            <div style={{display:"flex",gap:4,flexShrink:0}}>
                              <ShareToggle item={c} listKey="contacts" idx={realIdx}/>
                              <button type="button" onClick={()=>openM("editContact",{...c})} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer"}}><Edit3 size={13}/></button>
                            </div>
                          </div>
                          {(c.email||c.phone)&&<div style={{marginTop:10,display:"flex",flexDirection:"column",gap:4}}>
                            {c.email&&<a href={`mailto:${c.email}`} style={{fontSize:12,color:theme.teal,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}><Send size={11}/>{c.email}</a>}
                            {c.phone&&<a href={`tel:${c.phone}`} style={{fontSize:12,color:theme.textSec,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}><MessageCircle size={11}/>{c.phone}</a>}
                          </div>}
                          {c.links&&c.links.length>0&&<div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                            {c.links.map((l,i)=>(<a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:theme.teal,textDecoration:"none",padding:"2px 8px",background:theme.bgInput,borderRadius:6,display:"flex",alignItems:"center",gap:3}}><ExternalLink size={9}/>{l.label}</a>))}
                          </div>}
                          {c.notes&&<p style={{fontSize:12,color:theme.textMut,marginTop:8,lineHeight:1.4}}>{c.notes}</p>}
                        </Card>;
                      })}
                    </div>
                  </div>
                ))}
                {filtered.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:24}}>{contacts.length===0?'No contacts yet. Click "Add Contact" to build your address book.':"No contacts match your search."}</p>}
              </>;
            })()}
          </div>}

          {/* ── GOALS ── */}
          {wsTab==="goals"&&<div>
            <Btn theme={theme} small onClick={()=>updateWs("goals",p=>[...p,{id:uid("wg"),title:"",target:"",progress:0,shared:false}])} style={{marginBottom:12}}><Plus size={13}/> New Goal</Btn>
            <div className="nanu-grid-2col">
              {goals.map((g,idx)=>(
                <Card key={g.id} theme={theme} style={{padding:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div style={{flex:1}}>
                      <input value={g.title||""} onChange={e=>updateWs("goals",p=>{const u=[...p];u[idx]={...u[idx],title:e.target.value};return u})} style={{background:"transparent",border:"none",fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16,color:theme.text,outline:"none",width:"100%"}} placeholder="Goal title..."/>
                      <input value={g.target||""} onChange={e=>updateWs("goals",p=>{const u=[...p];u[idx]={...u[idx],target:e.target.value};return u})} style={{background:"transparent",border:"none",fontSize:13,color:theme.textSec,outline:"none",width:"100%",marginTop:4}} placeholder="Target / description..."/>
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                      <ShareToggle item={g} listKey="goals" idx={idx}/>
                      <button type="button" onClick={()=>updateWs("goals",p=>p.filter(x=>x.id!==g.id))} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer",opacity:0.4}}><Trash2 size={13}/></button>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <input type="range" min="0" max="100" value={g.progress||0} onChange={e=>updateWs("goals",p=>{const u=[...p];u[idx]={...u[idx],progress:Number(e.target.value)};return u})} style={{flex:1,accentColor:theme.teal}}/>
                    <span style={{fontFamily:FONT_MONO,fontSize:13,fontWeight:700,color:g.progress>=100?theme.green:theme.teal,minWidth:40,textAlign:"right"}}>{g.progress||0}%</span>
                  </div>
                  <ProgressBar value={g.progress||0} max={100} color={g.progress>=100?theme.green:theme.teal} theme={theme}/>
                </Card>
              ))}
            </div>
            {goals.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:20}}>No goals yet</p>}
          </div>}

          {/* ── DRAFTS (with Send to Calendar) ── */}
          {wsTab==="drafts"&&<div>
            <Btn theme={theme} small onClick={()=>updateWs("drafts",p=>[{id:uid("wd"),title:"Untitled draft",platform:"",content:"",status:"Draft",shared:false,date:todayStr2},...p])} style={{marginBottom:12}}><Plus size={13}/> New Draft</Btn>
            {drafts.map((d,idx)=>(
              <Card key={d.id} theme={theme} style={{padding:16,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",flex:1}}>
                    <input value={d.title||""} onChange={e=>updateWs("drafts",p=>{const u=[...p];u[idx]={...u[idx],title:e.target.value};return u})} style={{background:"transparent",border:"none",fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16,color:theme.text,outline:"none",flex:1}} placeholder="Draft title..."/>
                    <select value={d.platform||""} onChange={e=>updateWs("drafts",p=>{const u=[...p];u[idx]={...u[idx],platform:e.target.value};return u})} style={{padding:"4px 8px",borderRadius:6,border:`1px solid ${theme.border}`,background:theme.bgInput,color:theme.text,fontSize:12}}>
                      <option value="">Platform</option>
                      {PLATFORMS.map(p=><option key={p}>{p}</option>)}
                      <option>Blog</option><option>Newsletter</option>
                    </select>
                    <select value={d.status||"Draft"} onChange={e=>updateWs("drafts",p=>{const u=[...p];u[idx]={...u[idx],status:e.target.value};return u})} style={{padding:"4px 8px",borderRadius:6,border:`1px solid ${theme.border}`,background:theme.bgInput,color:theme.text,fontSize:12}}>
                      <option>Draft</option><option>Ready for Review</option><option>Approved</option><option>Published</option>
                    </select>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0,marginLeft:8}}>
                    {d.platform&&d.content&&<Btn theme={theme} small onClick={()=>{
                      const newCal={id:uid("c"),title:d.title||"Draft content",platform:d.platform||PLATFORMS[0],status:"Idea",owner:curUser.id,dueDate:"",publishTime:"",caption:d.content,assetLink:"",campaign:""};
                      setCalendar(p=>[...p,newCal]);db.saveCalendarItem(newCal);
                      log("created",newCal.title,"Calendar");
                      updateWs("drafts",p=>{const u=[...p];u[idx]={...u[idx],status:"Published"};return u});
                    }}><Send size={11}/> To Calendar</Btn>}
                    <ShareToggle item={d} listKey="drafts" idx={idx}/>
                    <button type="button" onClick={()=>updateWs("drafts",p=>p.filter(x=>x.id!==d.id))} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer",opacity:0.4}}><Trash2 size={13}/></button>
                  </div>
                </div>
                <textarea value={d.content||""} onChange={e=>updateWs("drafts",p=>{const u=[...p];u[idx]={...u[idx],content:e.target.value};return u})}
                  style={{width:"100%",minHeight:120,padding:12,border:`1px solid ${theme.border}`,background:theme.bgInput,color:theme.text,fontFamily:FONT_BODY,fontSize:14,outline:"none",resize:"vertical",lineHeight:1.6,borderRadius:8,boxSizing:"border-box"}} placeholder="Write your draft content here..."/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
                  <span style={{fontSize:10,color:theme.textMut,fontFamily:FONT_MONO}}>{d.date}</span>
                  <span style={{fontSize:11,color:theme.textMut}}>{(d.content||"").split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </Card>
            ))}
            {drafts.length===0&&<p style={{fontSize:13,color:theme.textMut,textAlign:"center",padding:20}}>No drafts yet</p>}
          </div>}

          {/* ── PERSONAL ACTIVITY LOG ── */}
          {wsTab==="myactivity"&&<Card theme={theme} style={{padding:18}}>
            <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:15,marginBottom:14}}>My Recent Activity</div>
            {myActivity.length===0&&<p style={{fontSize:13,color:theme.textMut}}>No activity recorded yet</p>}
            {myActivity.map((a,i)=>(
              <div key={a.id||i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 0",borderBottom:i<myActivity.length-1?`1px solid ${theme.border}`:"none"}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:theme.teal,flexShrink:0,marginTop:6}}/>
                <div style={{flex:1}}>
                  <span style={{fontSize:13}}><strong>{a.action}</strong> — {a.target}</span>
                  <div style={{fontSize:11,color:theme.textMut,marginTop:2}}>{a.section} · {new Date(a.time).toLocaleDateString("en-GB")} {new Date(a.time).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</div>
                </div>
              </div>
            ))}
          </Card>}
        </div>
      );
    }

    case "settings": {
      refreshNotifications();
      return (
      <div>
        <SectionHead theme={theme}>Settings</SectionHead>

        {/* Account security */}
        <Card theme={theme} style={{maxWidth:600,marginBottom:20}}>
          <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16,marginBottom:6}}>Your Account</div>
          <p style={{fontSize:13,color:theme.textSec,marginBottom:16,lineHeight:1.5}}>Signed in as <strong>{curUser.name}</strong> (@{curUser.username}) · {curUser.role}</p>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:theme.bgInput,borderRadius:10,border:`1px solid ${theme.border}`,gap:12,flexWrap:"wrap"}}>
            <div>
              <div style={{fontSize:14,fontWeight:600}}>Login PIN</div>
              <div style={{fontSize:12,color:theme.textMut,marginTop:2}}>Change the PIN you use to sign in</div>
            </div>
            <Btn primary theme={theme} small onClick={()=>openM("changePin",{current:"",newPin:"",confirm:"",err:""})}><Lock size={12}/> Change PIN</Btn>
          </div>
        </Card>

        <SectionHead theme={theme}>Notification Settings</SectionHead>
        <Card theme={theme} style={{maxWidth:600}}>
          <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16,marginBottom:16}}>In-Hub Notifications</div>
          <p style={{fontSize:13,color:theme.textSec,marginBottom:20,lineHeight:1.5}}>Choose which notifications appear in the bell icon at the top of the hub.</p>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[
              {key:"taskAssigned",label:"Task assigned to me",desc:"When someone assigns you to a task"},
              {key:"taskUpdated",label:"Task I'm on was updated",desc:"When a task you're assigned to gets updated or someone posts an update"},
              {key:"taskDue",label:"Task due today / overdue",desc:"Daily reminder for tasks due today or overdue"},
              {key:"projectUpdated",label:"Project I'm on was updated",desc:"When a project you're part of gets updated"},
              {key:"inHubBell",label:"In-hub notification bell",desc:"Show notifications in the bell icon at the top of the hub"},
            ].map(s=>(
              <div key={s.key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:theme.bgInput,borderRadius:10,border:`1px solid ${theme.border}`}}>
                <div>
                  <div style={{fontSize:14,fontWeight:600}}>{s.label}</div>
                  <div style={{fontSize:12,color:theme.textMut,marginTop:2}}>{s.desc}</div>
                </div>
                <label style={{position:"relative",width:44,height:24,cursor:"pointer"}}>
                  <input type="checkbox" checked={notifSettings[s.key]||false} onChange={e=>{
                    const ns={...notifSettings,[s.key]:e.target.checked};
                    setNotifSettings(ns);
                    db.saveNotifSettings(curUser.id,ns);
                  }} style={{opacity:0,width:0,height:0,position:"absolute"}}/>
                  <div style={{position:"absolute",inset:0,borderRadius:12,background:notifSettings[s.key]?theme.teal:theme.border,transition:"background .2s"}}>
                    <div style={{position:"absolute",top:2,left:notifSettings[s.key]?22:2,width:20,height:20,borderRadius:10,background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.2)"}}/>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </Card>
        {/* Notification History */}
        <div style={{marginTop:24}}>
          <SectionHead theme={theme} right={notifications.length>0&&<button type="button" onClick={()=>{setNotifications([]);db.clearNotifications(curUser.id)}} style={{background:"none",border:"none",color:theme.red,cursor:"pointer",fontSize:12,fontWeight:600}}>Clear all</button>}>Recent Notifications</SectionHead>
          <Card theme={theme} style={{maxWidth:600}}>
            {notifications.length===0&&<p style={{fontSize:13,color:theme.textMut,padding:8}}>No notifications</p>}
            {notifications.slice(0,50).map(n=>(
              <div key={n.id} style={{padding:"10px 0",borderBottom:`1px solid ${theme.border}`,display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:n.read?theme.textMut:theme.teal,flexShrink:0,marginTop:6}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:n.read?400:600}}>{n.title}</div>
                  <div style={{fontSize:12,color:theme.textMut}}>{n.body}</div>
                  <div style={{fontSize:10,color:theme.textMut,fontFamily:FONT_MONO,marginTop:3}}>{new Date(n.time).toLocaleDateString("en-GB")} {new Date(n.time).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    );
    }

    /* ─── ADMIN ─── */
    case "admin": return isAdmin ? (
      <div>
        <SectionHead theme={theme}>Admin Panel</SectionHead>
        <div className="nanu-grid-2col">
          <Card theme={theme}>
            <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16,marginBottom:14}}>User Management</div>
            <Btn primary theme={theme} small onClick={()=>openM("editUser",{role:"Content Creator",tzLabel:"London",tz:"Europe/London",pin:"1234",socials:{},active:true})} style={{marginBottom:12}}><Plus size={13}/> Add User</Btn>
            {[...users].sort((a,b)=>(a.active===false)-(b.active===false)).map(u=>{
              const inactive = u.active === false;
              return <div key={u.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderTop:`1px solid ${theme.borderLight}`,gap:8,flexWrap:"wrap",opacity:inactive?0.55:1}}>
                <div style={{minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:14,display:"flex",alignItems:"center",gap:6}}>
                    {u.name}
                    {inactive&&<Badge label="Deactivated" color={theme.textMut}/>}
                  </div>
                  <div style={{fontSize:12,color:theme.textMut}}>@{u.username} · {u.role} · PIN: {u.pin}</div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <Btn theme={theme} small onClick={()=>openM("resetPin",{...u})}><Lock size={12}/> Reset PIN</Btn>
                  <Btn theme={theme} small onClick={()=>openM("editUser",{...u})}><Edit3 size={12}/></Btn>
                  {u.id!==curUser.id&&<>
                    {inactive
                      ? <Btn theme={theme} small onClick={()=>{
                          const upd={...u,active:true};
                          setUsers(p=>p.map(x=>x.id===u.id?upd:x));
                          db.saveUser(upd); log("reactivated",u.name,"Admin");
                        }}><Check size={12}/> Reactivate</Btn>
                      : <Btn theme={theme} small onClick={()=>openM("deactivateUser",{...u})}><EyeOff size={12}/> Deactivate</Btn>}
                    <Btn theme={theme} small danger onClick={()=>openM("deleteUser",{...u})}><Trash2 size={12}/></Btn>
                  </>}
                </div>
              </div>;
            })}
            <p style={{fontSize:11,color:theme.textMut,marginTop:12,lineHeight:1.5}}>Deactivating removes someone from the hub but keeps their name on past work. Deleting is permanent and leaves their old items unassigned.</p>
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
              <Btn primary theme={theme} small onClick={()=>openM("editProject",{status:"Planning",color:"#1FC2C2",owner:curUser.id,members:[]})} style={{marginBottom:10}}><Plus size={13}/> Add</Btn>
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
        <div className="nanu-form-row"><div><Label theme={theme}>Due Date</Label><Input theme={theme} type="date" value={form.dueDate||""} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))}/></div><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={activeUsers.map(u=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Publish Time</Label><Input theme={theme} type="time" value={form.publishTime||""} onChange={e=>setForm(p=>({...p,publishTime:e.target.value}))}/></div><div><Label theme={theme}>Campaign</Label><Sel theme={theme} options={[{value:"",label:"None"},...campaigns.map(c=>({value:c.tag,label:c.name}))]} value={form.campaign||""} onChange={e=>setForm(p=>({...p,campaign:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Caption</Label><Textarea theme={theme} value={form.caption||""} onChange={e=>setForm(p=>({...p,caption:e.target.value}))}/></div>
        <div><Label theme={theme}>Asset Link</Label><Input theme={theme} value={form.assetLink||""} onChange={e=>setForm(p=>({...p,assetLink:e.target.value}))} placeholder="https://..."/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setCalendar(p=>p.filter(c=>c.id!==form.id));db.deleteCalendarItem(form.id);log("deleted",form.title,"Calendar")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{const cid=form.id||uid("c");const cdata={...form,id:cid};if(form.id){setCalendar(p=>p.map(c=>c.id===form.id?cdata:c));log("updated",form.title,"Calendar")}else{setCalendar(p=>[...p,cdata]);log("created",form.title,"Calendar")}db.saveCalendarItem(cdata)})}>Done</Btn>
        </div>
      </div></Modal>;

      case "editTask": return <Modal theme={theme} title={form.id?"Edit Task":"New Task"} onClose={closeM} width={620}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Title</Label><Input theme={theme} value={form.title||""} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></div>
        {form.id&&(form.createdBy||form.createdDate)&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:theme.bgInput,borderRadius:8,fontSize:12,color:theme.textMut}}>
          <Users size={12}/>
          <span>Added by <strong style={{color:theme.textSec}}>{form.createdBy?uName(form.createdBy):"unknown"}</strong>{form.createdDate?` on ${form.createdDate}`:""}</span>
        </div>}

        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Add context, details, links, or instructions for this task..." style={{minHeight:80}}/></div>

        <div><Label theme={theme}>Why this matters / background</Label><Textarea theme={theme} value={form.context||""} onChange={e=>setForm(p=>({...p,context:e.target.value}))} placeholder="Write this for someone picking the task up cold in three weeks. Where did it come from, and why?" style={{minHeight:60}}/></div>

        <div className="nanu-form-row">
          <div><Label theme={theme}>Who to contact</Label><Input theme={theme} value={form.contactName||""} onChange={e=>setForm(p=>({...p,contactName:e.target.value}))} placeholder="Full name and who they are, not just a first name"/></div>
          <div><Label theme={theme}>How to reach them</Label><Input theme={theme} value={form.contactDetail||""} onChange={e=>setForm(p=>({...p,contactDetail:e.target.value}))} placeholder="Email, handle, or where they were introduced"/></div>
        </div>

        <div><Label theme={theme}>What does done look like?</Label><Input theme={theme} value={form.outcome||""} onChange={e=>setForm(p=>({...p,outcome:e.target.value}))} placeholder="What should happen once contact is made, or what's the finished result?"/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Assigned To</Label><div style={{display:"flex",flexDirection:"column",gap:4}}>{users.map(u=>(<label key={u.id} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={(form.owners||[]).includes(u.id)} onChange={e=>{const cur=form.owners||[];setForm(p=>({...p,owners:e.target.checked?[...cur,u.id]:cur.filter(x=>x!==u.id)}))}}/>{u.name}</label>))}</div></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={TASK_STATUSES} value={form.status||"Not Started"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Due Date</Label><Input theme={theme} type="date" value={form.dueDate||""} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))}/></div><div><Label theme={theme}>Priority</Label><Sel theme={theme} options={TASK_PRIORITIES} value={form.priority||"Medium"} onChange={e=>setForm(p=>({...p,priority:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Blocker</Label><Input theme={theme} value={form.blocker||""} onChange={e=>setForm(p=>({...p,blocker:e.target.value}))} placeholder="Describe any blockers..."/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Project</Label><Sel theme={theme} options={[{value:"",label:"None"},...visibleProjects.map((p)=>({value:p.id,label:p.name}))]} value={form.project||""} onChange={(e)=>setForm(p=>({...p,project:e.target.value}))}/></div><div><Label theme={theme}>Linked Content</Label><Sel theme={theme} options={[{value:"",label:"None"},...calendar.map((c)=>({value:c.id,label:`${c.title} (${c.platform})`}))]} value={form.linkedContent||""} onChange={(e)=>setForm(p=>({...p,linkedContent:e.target.value}))}/></div></div>

        {/* Updates / Activity Feed */}
        {form.id && <div>
          <Label theme={theme}>Updates</Label>
          <div style={{background:theme.bgInput,borderRadius:8,border:`1px solid ${theme.border}`,maxHeight:200,overflow:"auto",marginBottom:8}}>
            {(form.updates||[]).length===0 && <p style={{padding:"12px 14px",fontSize:12,color:theme.textMut,margin:0}}>No updates yet</p>}
            {(form.updates||[]).map((u,i) => (
              <div key={i} style={{padding:"10px 14px",borderBottom:i<(form.updates||[]).length-1?`1px solid ${theme.border}`:"none",display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                    <span style={{fontSize:12,fontWeight:600,color:theme.text}}>{uName(u.author)}</span>
                    <span style={{fontSize:10,color:theme.textMut,fontFamily:FONT_MONO}}>{u.time}</span>
                  </div>
                  <p style={{fontSize:13,color:theme.textSec,margin:0,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{u.text}</p>
                </div>
                <button onClick={()=>{const upd=[...(form.updates||[])];upd.splice(i,1);setForm(p=>({...p,updates:upd}))}} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer",flexShrink:0,opacity:0.5}}><X size={12}/></button>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <Input theme={theme} value={form._newUpdate||""} onChange={e=>setForm(p=>({...p,_newUpdate:e.target.value}))} placeholder="Add an update..." style={{flex:1}}/>
            <Btn theme={theme} small onClick={()=>{
              if(!(form._newUpdate||"").trim()) return;
              const upd=[...(form.updates||[]),{author:curUser.id,text:form._newUpdate.trim(),time:new Date().toLocaleDateString("en-GB")+" "+new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}];
              setForm(p=>({...p,updates:upd,_newUpdate:""}));
            }}><Plus size={12}/> Post</Btn>
          </div>
        </div>}

        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setTasks(p=>p.filter(t=>t.id!==form.id));db.deleteTask(form.id);log("deleted",form.title,"Tasks")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{const {_newUpdate,...cleanForm}=form;const tid=cleanForm.id||uid("t");
            // Stamp who entered the task and when, once, on creation
            const tdata={...cleanForm,id:tid,createdBy:cleanForm.createdBy||curUser.id,createdDate:cleanForm.createdDate||todayStr};
            const oldTask=tasks.find(t=>t.id===cleanForm.id);
            if(cleanForm.id){
              setTasks(p=>p.map(t=>t.id===cleanForm.id?tdata:t));log("updated",cleanForm.title,"Tasks");
              // Notify: task updated
              const taskMembers=(tdata.owners||[]).filter(id=>id!==curUser.id);
              notifyMany(taskMembers,"task_updated",`Task updated: ${tdata.title}`,`${curUser.name} updated this task`,"tasks");
              // Notify: newly assigned people
              const oldOwners=oldTask?.owners||[];
              const newlyAssigned=(tdata.owners||[]).filter(id=>!oldOwners.includes(id)&&id!==curUser.id);
              notifyMany(newlyAssigned,"task_assigned",`You were assigned: ${tdata.title}`,`${curUser.name} assigned you to this task`,"tasks");
            }else{
              setTasks(p=>[...p,tdata]);log("created",cleanForm.title,"Tasks");
              // Notify: assigned people on new task
              const assigned=(tdata.owners||[]).filter(id=>id!==curUser.id);
              notifyMany(assigned,"task_assigned",`New task: ${tdata.title}`,`${curUser.name} assigned you to this task`,"tasks");
            }
            db.saveTask(tdata)})}>Done</Btn>
        </div>
      </div></Modal>;

      case "editResource": return <Modal theme={theme} title={form.id?"Edit Resource":"New Resource"} onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Label</Label><Input theme={theme} value={form.label||""} onChange={e=>setForm(p=>({...p,label:e.target.value}))}/></div>
        <div><Label theme={theme}>URL</Label><Input theme={theme} value={form.url||""} onChange={e=>setForm(p=>({...p,url:e.target.value}))}/></div>
        <div><Label theme={theme}>Group</Label><Sel theme={theme} options={RESOURCE_GROUPS} value={form.group||"Drives"} onChange={e=>setForm(p=>({...p,group:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setResources(p=>p.filter(r=>r.id!==form.id));db.deleteResource(form.id)})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{const rid=form.id||uid("r");const rdata={...form,id:rid};if(form.id)setResources(p=>p.map(r=>r.id===form.id?rdata:r));else setResources(p=>[...p,rdata]);db.saveResource(rdata)})}>Done</Btn>
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
          <Btn primary theme={theme} onClick={()=>doSave(()=>{const uuid=form.id||uid("u");const udata={...form,id:uuid,socials:form.socials||{},active:form.active!==false};if(form.id){setUsers(p=>p.map(u=>u.id===form.id?udata:u));log("updated",form.name,"Team")}else{setUsers(p=>[...p,udata]);log("added",form.name,"Team")}db.saveUser(udata)})}>Done</Btn>
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
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:16,gap:10}}><Btn theme={theme} onClick={closeM}>Cancel</Btn><Btn primary theme={theme} onClick={()=>doSave(()=>{db.saveThemes(weeklyThemes);log("updated","Weekly Themes","Admin")})}>Done</Btn></div>
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
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:14}}><Btn primary theme={theme} onClick={()=>doSave(()=>{db.saveKeyDates(keyDates);log("updated","Key Dates","Admin")})}>Done</Btn></div>
      </Modal>;

      case "editTargets": return <Modal theme={theme} title="Set Growth Targets" onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        {[["followers","Followers"],["newsletterSignups","Newsletter Sign-ups"],["nanuUsers","Nanu Users"],["websiteTraffic","Website Traffic"]].map(([k,l])=>(
          <div key={k}><Label theme={theme}>{l}</Label><Input theme={theme} type="number" value={form[k]||0} onChange={e=>setForm(p=>({...p,[k]:Number(e.target.value)}))}/></div>
        ))}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{const newTargets={...form};setStats(p=>{const ns={...p,targets:newTargets};db.saveStats(ns.totals,newTargets,ns.lastUpdated);return ns});log("updated","Growth Targets","Stats")})}>Done</Btn>
        </div>
      </div></Modal>;

      case "editStats": return <Modal theme={theme} title="Update Stats" onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        {[["followers","Followers"],["shares","Shares"],["websiteTraffic","Website Traffic"],["newsletterSignups","Newsletter Sign-ups"]].map(([k,l])=>(
          <div key={k}><Label theme={theme}>{l}</Label><Input theme={theme} type="number" step={k==="engagement"?"0.1":"1"} value={form[k]||0} onChange={e=>setForm(p=>({...p,[k]:Number(e.target.value)}))}/></div>
        ))}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{const newTotals={...form};const newDate=new Date().toISOString().split('T')[0];setStats(p=>{const ns={...p,totals:newTotals,lastUpdated:newDate};db.saveStats(newTotals,ns.targets,newDate);return ns});log('updated','Social Stats','Stats')})}>Done</Btn>
        </div>
      </div></Modal>;

      case "editIdea": return <Modal theme={theme} title={form.id?"Edit Idea":"New Idea"} onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Idea</Label><Textarea theme={theme} value={form.text||""} onChange={e=>setForm(p=>({...p,text:e.target.value}))}/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Category</Label><Sel theme={theme} options={["Video","Design","Campaign","Blog","Social","Other"]} value={form.category||"Video"} onChange={e=>setForm(p=>({...p,category:e.target.value}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={["Open","Approved","In Progress","Done","Rejected"]} value={form.status||"Open"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Votes</Label><Input theme={theme} type="number" value={form.votes||0} onChange={e=>setForm(p=>({...p,votes:Number(e.target.value)}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setOps(p=>({...p,ideas:p.ideas.filter(x=>x.id!==form.id)}));db.deleteIdea(form.id)})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{const iid=form.id||uid("i");const idata={...form,id:iid};if(form.id)setOps(p=>({...p,ideas:p.ideas.map(x=>x.id===form.id?idata:x)}));else setOps(p=>({...p,ideas:[...p.ideas,idata]}));db.saveIdea(idata)})}>Done</Btn>
        </div>
      </div></Modal>;

      case "editCaption": return <Modal theme={theme} title={form.id?"Edit Caption":"New Caption"} onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Caption Text</Label><Textarea theme={theme} value={form.text||""} onChange={e=>setForm(p=>({...p,text:e.target.value}))}/></div>
        <div><Label theme={theme}>Tags (comma-separated)</Label><Input theme={theme} value={(form.tags||[]).join(", ")} onChange={e=>setForm(p=>({...p,tags:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setOps(p=>({...p,captions:p.captions.filter(x=>x.id!==form.id)}));db.deleteCaption(form.id)})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{const capid=form.id||uid("cap");const capdata={...form,id:capid};if(form.id)setOps(p=>({...p,captions:p.captions.map(x=>x.id===form.id?capdata:x)}));else setOps(p=>({...p,captions:[...p.captions,capdata]}));db.saveCaption(capdata)})}>Done</Btn>
        </div>
      </div></Modal>;

      case "editHashtag": return <Modal theme={theme} title={form.id?"Edit Hashtags":"New Hashtag Group"} onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Group Name</Label><Input theme={theme} value={form.group||""} onChange={e=>setForm(p=>({...p,group:e.target.value}))}/></div>
        <div><Label theme={theme}>Hashtags (comma-separated)</Label><Textarea theme={theme} value={(form.tags||[]).join(", ")} onChange={e=>setForm(p=>({...p,tags:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setOps(p=>({...p,hashtags:p.hashtags.filter(x=>x.id!==form.id)}));db.deleteHashtag(form.id)})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{const hid=form.id||uid("h");const hdata={...form,id:hid};if(form.id)setOps(p=>({...p,hashtags:p.hashtags.map(x=>x.id===form.id?hdata:x)}));else setOps(p=>({...p,hashtags:[...p.hashtags,hdata]}));db.saveHashtag(hdata)})}>Done</Btn>
        </div>
      </div></Modal>;

      case "editMessaging": return <Modal theme={theme} title={form.id?"Edit Messaging":"New Messaging Pillar"} onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Pillar Name</Label><Input theme={theme} value={form.pillar||""} onChange={e=>setForm(p=>({...p,pillar:e.target.value}))}/></div>
        <div><Label theme={theme}>Key Message</Label><Textarea theme={theme} value={form.line||""} onChange={e=>setForm(p=>({...p,line:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setOps(p=>({...p,messaging:p.messaging.filter(x=>x.id!==form.id)}));db.deleteMessaging(form.id)})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{const mid=form.id||uid("m");const mdata={...form,id:mid};if(form.id)setOps(p=>({...p,messaging:p.messaging.map(x=>x.id===form.id?mdata:x)}));else setOps(p=>({...p,messaging:[...p.messaging,mdata]}));db.saveMessaging(mdata)})}>Done</Btn>
        </div>
      </div></Modal>;

      case "editTemplate": return <Modal theme={theme} title={form.id?"Edit Template":"New Template"} onClose={closeM} width={580}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Template Name</Label><Input theme={theme} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
        <div><Label theme={theme}>Platform</Label><Sel theme={theme} options={PLATFORMS} value={form.platform||PLATFORMS[0]} onChange={e=>setForm(p=>({...p,platform:e.target.value}))}/></div>
        <div><Label theme={theme}>Caption Template</Label><Textarea theme={theme} value={form.caption||""} onChange={e=>setForm(p=>({...p,caption:e.target.value}))} style={{minHeight:120}}/></div>
        <div><Label theme={theme}>Tags (comma-separated)</Label><Input theme={theme} value={(form.tags||[]).join(", ")} onChange={e=>setForm(p=>({...p,tags:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setOps(p=>({...p,templates:p.templates.filter(x=>x.id!==form.id)}));db.deleteTemplate(form.id)})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{const tpid=form.id||uid("tp");const tpdata={...form,id:tpid};if(form.id)setOps(p=>({...p,templates:p.templates.map(x=>x.id===form.id?tpdata:x)}));else setOps(p=>({...p,templates:[...p.templates,tpdata]}));db.saveTemplate(tpdata)})}>Done</Btn>
        </div>
      </div></Modal>;

      case "editCampaign": return <Modal theme={theme} title={form.id?"Edit Campaign":"New Campaign"} onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Campaign Name</Label><Input theme={theme} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
        <div><Label theme={theme}>Tag (for linking content)</Label><Input theme={theme} value={form.tag||""} onChange={e=>setForm(p=>({...p,tag:e.target.value.toLowerCase().replace(/\s+/g,"-")}))}/></div>
        <div><Label theme={theme}>Colour</Label><input type="color" value={form.color||theme.teal} onChange={e=>setForm(p=>({...p,color:e.target.value}))} style={{width:48,height:36,border:"none",borderRadius:8,cursor:"pointer"}}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setCampaigns(p=>p.filter(c=>c.id!==form.id));db.deleteCampaign(form.id)})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{const campid=form.id||uid("camp");const campdata={...form,id:campid};if(form.id)setCampaigns(p=>p.map(c=>c.id===form.id?campdata:c));else setCampaigns(p=>[...p,campdata]);db.saveCampaign(campdata);log(form.id?"updated":"created",form.name,"Campaigns")})}>Done</Btn>
        </div>
      </div></Modal>;

      case "editNote": return <Modal theme={theme} title={form.id?"Edit Note":"New Note"} onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Note</Label><Textarea theme={theme} value={form.text||""} onChange={e=>setForm(p=>({...p,text:e.target.value}))}/></div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div><Label theme={theme}>Colour</Label><input type="color" value={form.color||theme.teal} onChange={e=>setForm(p=>({...p,color:e.target.value}))} style={{width:40,height:32,border:"none",borderRadius:6,cursor:"pointer"}}/></div>
          <label style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:14}}><input type="checkbox" checked={form.pinned||false} onChange={e=>setForm(p=>({...p,pinned:e.target.checked}))}/>Pin to top</label>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setNotes(p=>p.filter(n=>n.id!==form.id));db.deleteNote(form.id)})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{const nid=form.id||uid("n");const ndata=form.id?{...form}:{...form,id:nid,author:curUser.id,date:new Date().toISOString().split("T")[0]};if(form.id)setNotes(p=>p.map(n=>n.id===form.id?ndata:n));else setNotes(p=>[...p,ndata]);db.saveNote(ndata)})}>Done</Btn>
        </div>
      </div></Modal>;

      case "editPlatform": return <Modal theme={theme} title={`Update ${form._platformName||"Platform"} Stats`} onClose={closeM}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Followers (this week)</Label><Input theme={theme} type="number" value={form.followers||0} onChange={e=>setForm(p=>({...p,followers:Number(e.target.value)}))}/></div>
        <div><Label theme={theme}>Followers (last week)</Label><Input theme={theme} type="number" value={form.lastWeek||0} onChange={e=>setForm(p=>({...p,lastWeek:Number(e.target.value)}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const name=form._platformName;
            const {_platformName,...data}=form;
            setStats(p=>({...p,platforms:{...p.platforms,[name]:data},lastUpdated:new Date().toISOString().split('T')[0]}));db.savePlatformStat(name,data);
            log("updated",name+" stats","Stats");
            })}>Done</Btn>
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
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const growthEntries=form.entries||[];setStats(p=>({...p,weeklyGrowth:growthEntries,lastUpdated:new Date().toISOString().split('T')[0]}));db.saveWeeklyGrowth(growthEntries);
            log("updated","Nanu User Growth","Stats");
            })}>Done</Btn>
        </div>
      </Modal>;

      case "editProject": return <Modal theme={theme} title={form.id?"Edit Project":"New Project"} onClose={closeM} width={620}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Project Name</Label><Input theme={theme} value={form.name||""} onChange={(e)=>setForm((p)=>({...p,name:e.target.value}))}/></div>
        <div><Label theme={theme}>Description</Label><Textarea theme={theme} value={form.description||""} onChange={(e)=>setForm((p)=>({...p,description:e.target.value}))}/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={users.map((u)=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={(e)=>setForm((p)=>({...p,owner:e.target.value}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={PROJECT_STATUSES} value={form.status||"Planning"} onChange={(e)=>setForm((p)=>({...p,status:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Team Members</Label><div style={{display:"flex",flexDirection:"column",gap:4}}>{users.filter(u=>u.id!==(form.owner||"")).map(u=>(<label key={u.id} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={(form.members||[]).includes(u.id)} onChange={e=>{const cur=form.members||[];setForm(p=>({...p,members:e.target.checked?[...cur,u.id]:cur.filter(x=>x!==u.id)}))}}/>{u.name}</label>))}</div></div>
        <div><Label theme={theme}>Project Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={(e)=>setForm((p)=>({...p,notes:e.target.value}))} placeholder="Key context, decisions, status updates..." style={{minHeight:100}}/></div>
        <div>
          <Label theme={theme}>Linked Work</Label>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {(form.links||[]).map((link,i) => (
              <div key={i} style={{display:"flex",gap:6,alignItems:"center"}}>
                <Input theme={theme} value={link.label} onChange={e=>{const u=[...(form.links||[])];u[i]={...link,label:e.target.value};setForm(p=>({...p,links:u}))}} placeholder="Label (e.g. Brand Assets)" style={{flex:1}}/>
                <Input theme={theme} value={link.url} onChange={e=>{const u=[...(form.links||[])];u[i]={...link,url:e.target.value};setForm(p=>({...p,links:u}))}} placeholder="https://..." style={{flex:2}}/>
                <button onClick={()=>{const u=[...(form.links||[])];u.splice(i,1);setForm(p=>({...p,links:u}))}} style={{background:"none",border:"none",color:theme.red,cursor:"pointer",flexShrink:0}}><Trash2 size={14}/></button>
              </div>
            ))}
            <Btn theme={theme} small onClick={()=>setForm(p=>({...p,links:[...(p.links||[]),{label:"",url:""}]}))}><Plus size={12}/> Add Link</Btn>
          </div>
        </div>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <div><Label theme={theme}>Colour</Label><input type="color" value={form.color||theme.teal} onChange={(e)=>setForm((p)=>({...p,color:e.target.value}))} style={{width:48,height:36,border:"none",borderRadius:8,cursor:"pointer"}}/></div>
          <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,marginTop:18}}>
            <input type="checkbox" checked={form.private||false} onChange={e=>setForm(p=>({...p,private:e.target.checked}))}/>
            <Lock size={13} color={form.private?theme.teal:theme.textMut}/>
            <span style={{color:form.private?theme.teal:theme.textSec}}>Private — only visible to owner, team members & admin</span>
          </label>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setProjects(p=>p.filter(x=>x.id!==form.id));db.deleteProject(form.id);log("deleted",form.name,"Projects")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const projid=form.id||uid("proj");const projdata={...form,id:projid};
            const allProjPeople=[...(projdata.members||[]),projdata.owner].filter(id=>id&&id!==curUser.id);
            if(form.id){
              setProjects(p=>p.map(x=>x.id===form.id?projdata:x));log("updated",form.name,"Projects");
              notifyMany(allProjPeople,"project_updated",`Project updated: ${projdata.name}`,`${curUser.name} updated this project`,"projects");
              // Notify newly added members
              const oldProj=projects.find(p=>p.id===form.id);
              const oldMembers=[...(oldProj?.members||[]),oldProj?.owner].filter(Boolean);
              const newPeople=allProjPeople.filter(id=>!oldMembers.includes(id));
              notifyMany(newPeople,"task_assigned",`Added to project: ${projdata.name}`,`${curUser.name} added you to this project`,"projects");
            }else{
              setProjects(p=>[...p,projdata]);log("created",form.name,"Projects");
              notifyMany(allProjPeople,"task_assigned",`New project: ${projdata.name}`,`${curUser.name} added you to this project`,"projects");
            }
            db.saveProject(projdata);
            })}>Done</Btn>
        </div>
      </div></Modal>;

      case "editOutreach": return <Modal theme={theme} title={form.id?"Edit Outreach Contact":"New Outreach Contact"} onClose={closeM} width={580}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Name</Label><Input theme={theme} value={form.name||""} onChange={(e)=>setForm((p)=>({...p,name:e.target.value}))}/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Type</Label><Sel theme={theme} options={OUTREACH_TYPES} value={form.type||"Community"} onChange={(e)=>setForm((p)=>({...p,type:e.target.value}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={OUTREACH_STATUSES} value={form.status||"Identified"} onChange={(e)=>setForm((p)=>({...p,status:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Platform / Channel</Label><Input theme={theme} value={form.platform||""} onChange={(e)=>setForm((p)=>({...p,platform:e.target.value}))} placeholder="e.g. Podcast, Discord, YouTube"/></div><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={users.map((u)=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={(e)=>setForm((p)=>({...p,owner:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Date</Label><Input theme={theme} type="date" value={form.date||""} onChange={(e)=>setForm((p)=>({...p,date:e.target.value}))}/></div><div><Label theme={theme}>URL</Label><Input theme={theme} value={form.url||""} onChange={(e)=>setForm((p)=>({...p,url:e.target.value}))} placeholder="https://..."/></div></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={(e)=>setForm((p)=>({...p,notes:e.target.value}))} placeholder="Context, talking points, follow-up actions..."/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Contact Name</Label><Input theme={theme} value={form.contactName||""} onChange={e=>setForm(p=>({...p,contactName:e.target.value}))} placeholder="Lead person's name"/></div><div><Label theme={theme}>Contact Email</Label><Input theme={theme} value={form.contactEmail||""} onChange={e=>setForm(p=>({...p,contactEmail:e.target.value}))} placeholder="email@example.com"/></div></div>

        {/* Linked Tasks */}
        <div>
          <Label theme={theme}>Linked Tasks</Label>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {(form.linkedTasks||[]).map((tid,i)=>{
              const t=tasks.find(x=>x.id===tid);
              return t ? <div key={tid} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:theme.bgInput,borderRadius:8,border:`1px solid ${theme.border}`}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:TASK_STATUS_COLORS[t.status]||theme.textMut,flexShrink:0}}/>
                <span onClick={()=>openM("editTask",{...t})} style={{flex:1,fontSize:13,fontWeight:500,cursor:"pointer",color:theme.teal}}>{t.title}</span>
                <Badge label={t.status} color={TASK_STATUS_COLORS[t.status]}/>
                <button type="button" onClick={()=>{const lt=[...(form.linkedTasks||[])];lt.splice(i,1);setForm(p=>({...p,linkedTasks:lt}))}} style={{background:"none",border:"none",color:theme.red,cursor:"pointer",flexShrink:0}}><X size={14}/></button>
              </div> : null;
            })}
            {(form.linkedTasks||[]).length===0&&<p style={{fontSize:12,color:theme.textMut,padding:"4px 0"}}>No tasks linked yet</p>}
          </div>
          <div style={{display:"flex",gap:6,marginTop:8}}>
            <Sel theme={theme} options={[{value:"",label:"Link existing task..."},...tasks.filter(t=>!(form.linkedTasks||[]).includes(t.id)).map(t=>({value:t.id,label:t.title}))]} value="" onChange={e=>{if(e.target.value)setForm(p=>({...p,linkedTasks:[...(p.linkedTasks||[]),e.target.value]}))}} style={{flex:1,fontSize:12,padding:"6px 8px"}}/>
            <Btn theme={theme} small onClick={()=>{
              const newId=uid("t");
              const newTask={id:newId,title:`Task for ${form.name||"outreach"}`,owners:[curUser.id],status:"Not Started",dueDate:"",blocker:"",priority:"Medium",notes:`Created from outreach: ${form.name||""}`,linkedContent:"",project:"",updates:[]};
              setTasks(p=>[...p,newTask]);
              db.saveTask(newTask);
              setForm(p=>({...p,linkedTasks:[...(p.linkedTasks||[]),newId]}));
              log("created",newTask.title,"Tasks");
            }}><Plus size={12}/> New Task</Btn>
          </div>
        </div>

        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setOutreach(p=>p.filter(x=>x.id!==form.id));db.deleteOutreach(form.id);log("deleted",form.name,"Outreach")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const outid=form.id||uid("out");const outdata={...form,id:outid};if(form.id){setOutreach(p=>p.map(x=>x.id===form.id?outdata:x));log("updated",form.name,"Outreach")}
            else{setOutreach(p=>[...p,outdata]);log("created",form.name,"Outreach")}db.saveOutreach(outdata);
            })}>Done</Btn>
        </div>
      </div></Modal>;

      case "editPartnership": return <Modal theme={theme} title={form.id?"Edit Partnership":"New Partnership"} onClose={closeM} width={640}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Partner Name</Label><Input theme={theme} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
        <div><Label theme={theme}>Description</Label><Textarea theme={theme} value={form.description||""} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="What is this partnership about?"/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Type</Label><Sel theme={theme} options={PARTNERSHIP_TYPES} value={form.type||PARTNERSHIP_TYPES[0]} onChange={e=>setForm(p=>({...p,type:e.target.value}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={PARTNERSHIP_STATUSES} value={form.status||"Lead / Prospect"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={activeUsers.map(u=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div><div><Label theme={theme}>Linked Outreach</Label><Sel theme={theme} options={[{value:"",label:"None"},...outreach.map(o=>({value:o.id,label:o.name}))]} value={form.linkedOutreach||""} onChange={e=>setForm(p=>({...p,linkedOutreach:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Contact Name</Label><Input theme={theme} value={form.contactName||""} onChange={e=>setForm(p=>({...p,contactName:e.target.value}))}/></div><div><Label theme={theme}>Contact Email</Label><Input theme={theme} value={form.contactEmail||""} onChange={e=>setForm(p=>({...p,contactEmail:e.target.value}))} placeholder="email@example.com"/></div></div>
        <div><Label theme={theme}>Value / Benefit</Label><Textarea theme={theme} value={form.value||""} onChange={e=>setForm(p=>({...p,value:e.target.value}))} placeholder="What's the strategic value of this partnership?"/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Start Date</Label><Input theme={theme} type="date" value={form.startDate||""} onChange={e=>setForm(p=>({...p,startDate:e.target.value}))}/></div><div><Label theme={theme}>Review Date</Label><Input theme={theme} type="date" value={form.reviewDate||""} onChange={e=>setForm(p=>({...p,reviewDate:e.target.value}))}/></div></div>

        {/* Shared Documents / Links */}
        <div>
          <Label theme={theme}>Shared Documents / Links</Label>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {(form.links||[]).map((link,i)=>(<div key={i} style={{display:"flex",gap:6,alignItems:"center"}}>
              <Input theme={theme} value={link.label} onChange={e=>{const u=[...(form.links||[])];u[i]={...link,label:e.target.value};setForm(p=>({...p,links:u}))}} placeholder="Label" style={{flex:1}}/>
              <Input theme={theme} value={link.url} onChange={e=>{const u=[...(form.links||[])];u[i]={...link,url:e.target.value};setForm(p=>({...p,links:u}))}} placeholder="https://..." style={{flex:2}}/>
              <button type="button" onClick={()=>{const u=[...(form.links||[])];u.splice(i,1);setForm(p=>({...p,links:u}))}} style={{background:"none",border:"none",color:theme.red,cursor:"pointer"}}><Trash2 size={14}/></button>
            </div>))}
            <Btn theme={theme} small onClick={()=>setForm(p=>({...p,links:[...(p.links||[]),{label:"",url:""}]}))}><Plus size={12}/> Add Link</Btn>
          </div>
        </div>

        {/* Linked Tasks */}
        <div>
          <Label theme={theme}>Linked Tasks</Label>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {(form.linkedTasks||[]).map((tid,i)=>{const t=tasks.find(x=>x.id===tid);return t?<div key={tid} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:theme.bgInput,borderRadius:8,border:`1px solid ${theme.border}`}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:TASK_STATUS_COLORS[t.status],flexShrink:0}}/>
              <span onClick={()=>openM("editTask",{...t})} style={{flex:1,fontSize:13,cursor:"pointer",color:theme.teal}}>{t.title}</span>
              <Badge label={t.status} color={TASK_STATUS_COLORS[t.status]}/>
              <button type="button" onClick={()=>{const lt=[...(form.linkedTasks||[])];lt.splice(i,1);setForm(p=>({...p,linkedTasks:lt}))}} style={{background:"none",border:"none",color:theme.red,cursor:"pointer"}}><X size={14}/></button>
            </div>:null})}
          </div>
          <div style={{display:"flex",gap:6,marginTop:8}}>
            <Sel theme={theme} options={[{value:"",label:"Link existing task..."},...tasks.filter(t=>!(form.linkedTasks||[]).includes(t.id)).map(t=>({value:t.id,label:t.title}))]} value="" onChange={e=>{if(e.target.value)setForm(p=>({...p,linkedTasks:[...(p.linkedTasks||[]),e.target.value]}))}} style={{flex:1,fontSize:12,padding:"6px 8px"}}/>
            <Btn theme={theme} small onClick={()=>{
              const newId=uid("t");
              const newTask={id:newId,title:`Task for ${form.name||"partnership"}`,owners:[curUser.id],status:"Not Started",dueDate:"",blocker:"",priority:"Medium",notes:`Created from partnership: ${form.name||""}`,linkedContent:"",project:"",updates:[]};
              setTasks(p=>[...p,newTask]);db.saveTask(newTask);
              setForm(p=>({...p,linkedTasks:[...(p.linkedTasks||[]),newId]}));
              log("created",newTask.title,"Tasks");
            }}><Plus size={12}/> New Task</Btn>
          </div>
        </div>

        {/* Updates / Activity Log */}
        {form.id&&<div>
          <Label theme={theme}>Updates</Label>
          <div style={{background:theme.bgInput,borderRadius:8,border:`1px solid ${theme.border}`,maxHeight:200,overflow:"auto",marginBottom:8}}>
            {(form.updates||[]).length===0&&<p style={{padding:"12px 14px",fontSize:12,color:theme.textMut,margin:0}}>No updates yet</p>}
            {(form.updates||[]).map((u,i)=>(<div key={i} style={{padding:"10px 14px",borderBottom:i<(form.updates||[]).length-1?`1px solid ${theme.border}`:"none"}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                <span style={{fontSize:12,fontWeight:600}}>{uName(u.author)}</span>
                <span style={{fontSize:10,color:theme.textMut,fontFamily:FONT_MONO}}>{u.time}</span>
              </div>
              <p style={{fontSize:13,color:theme.textSec,margin:0,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{u.text}</p>
            </div>))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <Input theme={theme} value={form._newUpdate||""} onChange={e=>setForm(p=>({...p,_newUpdate:e.target.value}))} placeholder="Add an update..." style={{flex:1}}/>
            <Btn theme={theme} small onClick={()=>{
              if(!(form._newUpdate||"").trim()) return;
              const upd=[...(form.updates||[]),{author:curUser.id,text:form._newUpdate.trim(),time:new Date().toLocaleDateString("en-GB")+" "+new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}];
              setForm(p=>({...p,updates:upd,_newUpdate:""}));
            }}><Plus size={12}/> Post</Btn>
          </div>
        </div>}

        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setPartnerships(p=>p.filter(x=>x.id!==form.id));db.deletePartnership(form.id);log("deleted",form.name,"Partnerships")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const {_newUpdate,...cleanForm}=form;
            const pid=cleanForm.id||uid("part");const pdata={...cleanForm,id:pid};
            if(cleanForm.id){setPartnerships(p=>p.map(x=>x.id===cleanForm.id?pdata:x));log("updated",cleanForm.name,"Partnerships")}
            else{setPartnerships(p=>[...p,pdata]);log("created",cleanForm.name,"Partnerships")}
            db.savePartnership(pdata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── AMBASSADOR MODAL ─── */
      case "editAmbassador": return <Modal theme={theme} title={form.id?"Edit Ambassador":"New Ambassador"} onClose={closeM} width={600}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="nanu-form-row"><div><Label theme={theme}>Name</Label><Input theme={theme} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div><div><Label theme={theme}>Email</Label><Input theme={theme} value={form.email||""} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="ambassador@example.com"/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Primary Platform</Label><Input theme={theme} value={form.platform||""} onChange={e=>setForm(p=>({...p,platform:e.target.value}))} placeholder="YouTube, Reddit, Instagram..."/></div><div><Label theme={theme}>Followers</Label><Input theme={theme} type="number" value={form.followers||0} onChange={e=>setForm(p=>({...p,followers:Number(e.target.value)}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Status</Label><Sel theme={theme} options={AMBASSADOR_STATUS} value={form.status||"Applied"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div><div><Label theme={theme}>Join Date</Label><Input theme={theme} type="date" value={form.joinDate||""} onChange={e=>setForm(p=>({...p,joinDate:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Region / Country</Label><Input theme={theme} value={form.region||""} onChange={e=>setForm(p=>({...p,region:e.target.value}))} placeholder="UK, US, Brazil..."/></div><div><Label theme={theme}>Content Focus</Label><Sel theme={theme} options={["UAP","NHI","Cryptids","Paranormal","Consciousness","Myths & History","Ritual / Occult","Natural Phenomena","Fortean","General"]} value={form.focus||"UAP"} onChange={e=>setForm(p=>({...p,focus:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Invite Code</Label><Input theme={theme} value={form.inviteCode||""} onChange={e=>setForm(p=>({...p,inviteCode:e.target.value}))} placeholder="UNIQUE-CODE"/></div><div><Label theme={theme}>Referrals</Label><Input theme={theme} type="number" value={form.referrals||0} onChange={e=>setForm(p=>({...p,referrals:Number(e.target.value)}))}/></div></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Background, goals, agreements..."/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setAmbassadors(p=>p.filter(x=>x.id!==form.id));db.deleteAmbassador(form.id);log("deleted",form.name,"Ambassadors")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const aid=form.id||uid("amb");const adata={...form,id:aid};
            if(form.id){setAmbassadors(p=>p.map(x=>x.id===form.id?adata:x));log("updated",form.name,"Ambassadors")}
            else{setAmbassadors(p=>[...p,adata]);log("created",form.name,"Ambassadors")}
            db.saveAmbassador(adata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── CHANNEL MODAL ─── */
      case "editChannel": return <Modal theme={theme} title={form.id?"Edit Channel":"New Channel"} onClose={closeM} width={580}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="nanu-form-row"><div><Label theme={theme}>Channel Name</Label><Input theme={theme} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="r/UFOs, Nanu Discord..."/></div><div><Label theme={theme}>Platform</Label><Sel theme={theme} options={CHANNEL_PLATFORMS} value={form.platform||CHANNEL_PLATFORMS[0]} onChange={e=>setForm(p=>({...p,platform:e.target.value}))}/></div></div>
        <div><Label theme={theme}>URL</Label><Input theme={theme} value={form.url||""} onChange={e=>setForm(p=>({...p,url:e.target.value}))} placeholder="https://..."/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Members / Audience</Label><Input theme={theme} type="number" value={form.members||0} onChange={e=>setForm(p=>({...p,members:Number(e.target.value)}))}/></div><div><Label theme={theme}>Last Engaged</Label><Input theme={theme} type="date" value={form.lastEngaged||""} onChange={e=>setForm(p=>({...p,lastEngaged:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Status</Label><Sel theme={theme} options={["Monitoring","Active","Engaging","Paused","Planned"]} value={form.status||"Monitoring"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div><div><Label theme={theme}>Priority</Label><Sel theme={theme} options={["High","Medium","Low"]} value={form.priority||"Medium"} onChange={e=>setForm(p=>({...p,priority:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Owner</Label><Sel theme={theme} options={activeUsers.map(u=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Engagement strategy, contacts, rules..."/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setCommChannels(p=>p.filter(x=>x.id!==form.id));db.deleteCommChannel(form.id);log("deleted",form.name,"Channels")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const cid=form.id||uid("ch");const cdata={...form,id:cid};
            if(form.id){setCommChannels(p=>p.map(x=>x.id===form.id?cdata:x));log("updated",form.name,"Channels")}
            else{setCommChannels(p=>[...p,cdata]);log("created",form.name,"Channels")}
            db.saveCommChannel(cdata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── COMMUNITY EVENT MODAL ─── */
      case "editCommEvent": return <Modal theme={theme} title={form.id?"Edit Event":"New Community Event"} onClose={closeM} width={600}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Title</Label><Input theme={theme} value={form.title||""} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Event title..."/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Type</Label><Sel theme={theme} options={COMM_EVENT_TYPES} value={form.type||COMM_EVENT_TYPES[0]} onChange={e=>setForm(p=>({...p,type:e.target.value}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={COMM_EVENT_STATUS} value={form.status||"Planned"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Date</Label><Input theme={theme} type="date" value={form.date||""} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/></div><div><Label theme={theme}>Time</Label><Input theme={theme} type="time" value={form.time||""} onChange={e=>setForm(p=>({...p,time:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Duration (min)</Label><Input theme={theme} type="number" value={form.duration||60} onChange={e=>setForm(p=>({...p,duration:Number(e.target.value)}))}/></div><div><Label theme={theme}>Host</Label><Sel theme={theme} options={activeUsers.map(u=>({value:u.id,label:u.name}))} value={form.host||""} onChange={e=>setForm(p=>({...p,host:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Platform / Location</Label><Input theme={theme} value={form.platform||""} onChange={e=>setForm(p=>({...p,platform:e.target.value}))} placeholder="In-app, Zoom, Discord, London..."/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Expected Attendees</Label><Input theme={theme} type="number" value={form.expectedAttendees||0} onChange={e=>setForm(p=>({...p,expectedAttendees:Number(e.target.value)}))}/></div><div><Label theme={theme}>Actual Attendees</Label><Input theme={theme} type="number" value={form.actualAttendees||0} onChange={e=>setForm(p=>({...p,actualAttendees:Number(e.target.value)}))}/></div></div>
        <div><Label theme={theme}>Description</Label><Textarea theme={theme} value={form.description||""} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="What's the event about?"/></div>
        <div><Label theme={theme}>Recording / Replay Link</Label><Input theme={theme} value={form.recording||""} onChange={e=>setForm(p=>({...p,recording:e.target.value}))} placeholder="https://..."/></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setCommEvents(p=>p.filter(x=>x.id!==form.id));db.deleteCommEvent(form.id);log("deleted",form.title,"Events")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const eid=form.id||uid("ev");const edata={...form,id:eid};
            if(form.id){setCommEvents(p=>p.map(x=>x.id===form.id?edata:x));log("updated",form.title,"Events")}
            else{setCommEvents(p=>[...p,edata]);log("created",form.title,"Events")}
            db.saveCommEvent(edata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── FEEDBACK MODAL ─── */
      case "editFeedback": return <Modal theme={theme} title={form.id?"Edit Feedback":"Log Feedback"} onClose={closeM} width={600}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="nanu-form-row"><div><Label theme={theme}>Source</Label><Sel theme={theme} options={["In-app","Email","Social","Discord","Reddit","Survey","Other"]} value={form.source||"In-app"} onChange={e=>setForm(p=>({...p,source:e.target.value}))}/></div><div><Label theme={theme}>Date</Label><Input theme={theme} type="date" value={form.date||""} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>User / Reporter</Label><Input theme={theme} value={form.user||""} onChange={e=>setForm(p=>({...p,user:e.target.value}))} placeholder="Username or name"/></div><div><Label theme={theme}>Contact</Label><Input theme={theme} value={form.contact||""} onChange={e=>setForm(p=>({...p,contact:e.target.value}))} placeholder="email / handle (optional)"/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Type</Label><Sel theme={theme} options={FEEDBACK_TYPES} value={form.type||FEEDBACK_TYPES[0]} onChange={e=>setForm(p=>({...p,type:e.target.value}))}/></div><div><Label theme={theme}>Sentiment</Label><Sel theme={theme} options={FEEDBACK_SENTIMENT} value={form.sentiment||"Neutral"} onChange={e=>setForm(p=>({...p,sentiment:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Feedback Text</Label><Textarea theme={theme} value={form.text||""} onChange={e=>setForm(p=>({...p,text:e.target.value}))} placeholder="What did they say?"/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Status</Label><Sel theme={theme} options={FEEDBACK_STATUS} value={form.status||"New"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={[{value:"",label:"Unassigned"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Response / Action Taken</Label><Textarea theme={theme} value={form.response||""} onChange={e=>setForm(p=>({...p,response:e.target.value}))} placeholder="Internal notes on follow-up"/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setFeedback(p=>p.filter(x=>x.id!==form.id));db.deleteFeedback(form.id);log("deleted","feedback","Feedback")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const fid=form.id||uid("fb");const fdata={...form,id:fid};
            if(form.id){setFeedback(p=>p.map(x=>x.id===form.id?fdata:x));log("updated","feedback","Feedback")}
            else{setFeedback(p=>[...p,fdata]);log("created","feedback","Feedback")}
            db.saveFeedback(fdata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── ENGAGEMENT METRICS MODAL ─── */
      case "editEngagement": return <Modal theme={theme} title="Update Weekly Metrics" onClose={closeM} width={580}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <p style={{fontSize:12,color:theme.textSec,marginBottom:4}}>Enter the latest weekly metrics. The previous week's numbers will be auto-saved for week-over-week comparison.</p>
        <div><Label theme={theme}>Week Ending</Label><Input theme={theme} type="date" value={form.weekEnding||""} onChange={e=>setForm(p=>({...p,weekEnding:e.target.value}))}/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Daily Active Users</Label><Input theme={theme} type="number" value={form.dau||0} onChange={e=>setForm(p=>({...p,dau:Number(e.target.value)}))}/></div><div><Label theme={theme}>Weekly Active Users</Label><Input theme={theme} type="number" value={form.wau||0} onChange={e=>setForm(p=>({...p,wau:Number(e.target.value)}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Monthly Active Users</Label><Input theme={theme} type="number" value={form.mau||0} onChange={e=>setForm(p=>({...p,mau:Number(e.target.value)}))}/></div><div><Label theme={theme}>New Signups</Label><Input theme={theme} type="number" value={form.newSignups||0} onChange={e=>setForm(p=>({...p,newSignups:Number(e.target.value)}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Reports Submitted</Label><Input theme={theme} type="number" value={form.reports||0} onChange={e=>setForm(p=>({...p,reports:Number(e.target.value)}))}/></div><div><Label theme={theme}>Comments Posted</Label><Input theme={theme} type="number" value={form.comments||0} onChange={e=>setForm(p=>({...p,comments:Number(e.target.value)}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Reactions Given</Label><Input theme={theme} type="number" value={form.reactions||0} onChange={e=>setForm(p=>({...p,reactions:Number(e.target.value)}))}/></div><div><Label theme={theme}>Credibility Votes</Label><Input theme={theme} type="number" value={form.votes||0} onChange={e=>setForm(p=>({...p,votes:Number(e.target.value)}))}/></div></div>
        <Label theme={theme}>Engagement by Category (reports + comments)</Label>
        {["UAP / UFO","NHI","Cryptids","Paranormal","Consciousness","Myths & History","Ritual / Occult","Natural Phenomena","Other / Fortean"].map(cat=>(
          <div key={cat} style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{flex:1,fontSize:13}}>{cat}</span>
            <Input theme={theme} type="number" value={(form._cats||{})[cat]||0} onChange={e=>setForm(p=>({...p,_cats:{...(p._cats||{}),[cat]:Number(e.target.value)}}))} style={{width:120}}/>
          </div>
        ))}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const {_cats,...metrics}=form;
            const newEng={previous:engagement.weekly||{},weekly:metrics,weekEnding:metrics.weekEnding,categories:_cats||engagement.categories||{}};
            setEngagement(newEng);
            db.saveEngagement(newEng);
            log("updated","weekly metrics","Engagement");
          })}>Save</Btn>
        </div>
      </div></Modal>;

      /* ─── ADDRESS BOOK CONTACT MODAL ─── */
      case "editContact": return <Modal theme={theme} title={form.id?"Edit Contact":"New Contact"} onClose={closeM} width={560}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="nanu-form-row"><div><Label theme={theme}>Name</Label><Input theme={theme} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Full name"/></div><div><Label theme={theme}>Category</Label><Sel theme={theme} options={["Press","Podcast","Creator","Researcher","Partner","Investor","Vendor","Community","Other"]} value={form.category||"Press"} onChange={e=>setForm(p=>({...p,category:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Role / Title</Label><Input theme={theme} value={form.role||""} onChange={e=>setForm(p=>({...p,role:e.target.value}))} placeholder="Editor, Host, Founder..."/></div><div><Label theme={theme}>Company / Org</Label><Input theme={theme} value={form.company||""} onChange={e=>setForm(p=>({...p,company:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Email</Label><Input theme={theme} value={form.email||""} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="email@example.com"/></div><div><Label theme={theme}>Phone</Label><Input theme={theme} value={form.phone||""} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="+44..."/></div></div>
        <div>
          <Label theme={theme}>Links</Label>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {(form.links||[]).map((link,i)=>(<div key={i} style={{display:"flex",gap:6,alignItems:"center"}}>
              <Input theme={theme} value={link.label} onChange={e=>{const u=[...(form.links||[])];u[i]={...link,label:e.target.value};setForm(p=>({...p,links:u}))}} placeholder="Label" style={{flex:1}}/>
              <Input theme={theme} value={link.url} onChange={e=>{const u=[...(form.links||[])];u[i]={...link,url:e.target.value};setForm(p=>({...p,links:u}))}} placeholder="https://..." style={{flex:2}}/>
              <button type="button" onClick={()=>{const u=[...(form.links||[])];u.splice(i,1);setForm(p=>({...p,links:u}))}} style={{background:"none",border:"none",color:theme.red,cursor:"pointer"}}><Trash2 size={14}/></button>
            </div>))}
            <Btn theme={theme} small onClick={()=>setForm(p=>({...p,links:[...(p.links||[]),{label:"",url:""}]}))}><Plus size={12}/> Add Link</Btn>
          </div>
        </div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="How you met, context, follow-ups..."/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{updateWs("contacts",p=>p.filter(x=>x.id!==form.id))})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const cid=form.id||uid("ct");const cdata={...form,id:cid,shared:form.shared||false};
            updateWs("contacts",p=>form.id?p.map(x=>x.id===form.id?cdata:x):[...p,cdata]);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── RESPONSIBILITY MODAL ─── */
      case "editResponsibility": return <Modal theme={theme} title={form.id?"Edit Responsibility":"New Responsibility"} onClose={closeM} width={600}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Title</Label><Input theme={theme} value={form.title||""} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Run the weekly livestream"/></div>
        <div><Label theme={theme}>Description</Label><Textarea theme={theme} value={form.description||""} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="What this involves..."/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={activeUsers.map(u=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div><div><Label theme={theme}>Area</Label><Sel theme={theme} options={RESP_AREAS} value={form.area||"Content"} onChange={e=>setForm(p=>({...p,area:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Cadence</Label><Sel theme={theme} options={RESP_CADENCES} value={form.cadence||"Weekly"} onChange={e=>setForm(p=>({...p,cadence:e.target.value}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={RESP_STATUS} value={form.status||"Active"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div></div>
        {form.cadence!=="Continuous"&&<div className="nanu-form-row"><div><Label theme={theme}>Next Due</Label><Input theme={theme} type="date" value={form.nextDue||""} onChange={e=>setForm(p=>({...p,nextDue:e.target.value}))}/></div><div><Label theme={theme}>Last Done</Label><Input theme={theme} type="date" value={form.lastDone||""} onChange={e=>setForm(p=>({...p,lastDone:e.target.value}))}/></div></div>}
        <div>
          <Label theme={theme}>Linked Tasks</Label>
          <Sel theme={theme} options={[{value:"",label:"Link an existing task..."},...tasks.filter(t=>t.status!=="Done"&&!(form.linkedTasks||[]).includes(t.id)).map(t=>({value:t.id,label:t.title}))]} value="" onChange={e=>{if(e.target.value)setForm(p=>({...p,linkedTasks:[...(p.linkedTasks||[]),e.target.value]}))}}/>
          {(form.linkedTasks||[]).length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
            {(form.linkedTasks||[]).map(tid=>{const t=tasks.find(x=>x.id===tid);return t?<span key={tid} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,padding:"3px 8px",background:theme.bgInput,borderRadius:6,color:theme.textSec}}>{t.title}<button type="button" onClick={()=>setForm(p=>({...p,linkedTasks:p.linkedTasks.filter(x=>x!==tid)}))} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer",padding:0}}><X size={11}/></button></span>:null})}
          </div>}
          <Btn theme={theme} small onClick={()=>{const today=new Date().toISOString().split("T")[0];const nt={id:uid("t"),title:form.title||"Responsibility task",owners:[form.owner||curUser.id],status:"Not Started",priority:"Medium",dueDate:respNextDue(form)||today,blocker:"",notes:`Generated from responsibility: ${form.title}`,linkedContent:"",project:"",updates:[]};setTasks(prev=>[...prev,nt]);db.saveTask(nt);setForm(p=>({...p,linkedTasks:[...(p.linkedTasks||[]),nt.id]}));log("created",nt.title,"Tasks")}} style={{marginTop:8}}><Plus size={12}/> Generate Task for This Cycle</Btn>
        </div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setResponsibilities(p=>p.filter(x=>x.id!==form.id));db.deleteResponsibility(form.id);log("deleted",form.title,"Responsibilities")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const rid=form.id||uid("resp");
            const rdata={
              id:rid, title:form.title||"", description:form.description||"", owner:form.owner||"",
              area:form.area||"", cadence:form.cadence||"Weekly", status:form.status||"Active",
              anchorDate:form.anchorDate||"", nextDue:form.cadence==="Continuous"?"":(form.nextDue||""),
              lastDone:form.lastDone||"", color:RESP_CADENCE_COLORS[form.cadence]||theme.teal,
              linkedTasks:form.linkedTasks||[], notes:form.notes||""
            };
            if(form.id){setResponsibilities(p=>p.map(x=>x.id===form.id?rdata:x));log("updated",rdata.title,"Responsibilities")}
            else{setResponsibilities(p=>[...p,rdata]);log("created",rdata.title,"Responsibilities")}
            db.saveResponsibility(rdata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── BUSINESS METRICS MODAL ─── */
      case "editBizMetrics": return <Modal theme={theme} title="Update Company Metrics" onClose={closeM} width={600}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <p style={{fontSize:12,color:theme.textSec,margin:0}}>The current figures are archived as "previous" so month-on-month movement is tracked automatically.</p>
        <div><Label theme={theme}>Period Label</Label><Input theme={theme} value={form.periodLabel||""} onChange={e=>setForm(p=>({...p,periodLabel:e.target.value}))} placeholder="e.g. August 2026"/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Cash in Bank (£)</Label><Input theme={theme} type="number" value={form.cash??""} onChange={e=>setForm(p=>({...p,cash:Number(e.target.value)}))}/></div><div><Label theme={theme}>Monthly Net Burn (£)</Label><Input theme={theme} type="number" value={form.burn??""} onChange={e=>setForm(p=>({...p,burn:Number(e.target.value)}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>MRR (£)</Label><Input theme={theme} type="number" value={form.mrr??""} onChange={e=>setForm(p=>({...p,mrr:Number(e.target.value)}))}/></div><div><Label theme={theme}>Headcount</Label><Input theme={theme} type="number" value={form.headcount??""} onChange={e=>setForm(p=>({...p,headcount:Number(e.target.value)}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Total Users</Label><Input theme={theme} type="number" value={form.users??""} onChange={e=>setForm(p=>({...p,users:Number(e.target.value)}))}/></div><div><Label theme={theme}>Monthly Active Users</Label><Input theme={theme} type="number" value={form.mau??""} onChange={e=>setForm(p=>({...p,mau:Number(e.target.value)}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Total Raised (£)</Label><Input theme={theme} type="number" value={form.raised??""} onChange={e=>setForm(p=>({...p,raised:Number(e.target.value)}))}/></div><div><Label theme={theme}>Valuation (£)</Label><Input theme={theme} type="number" value={form.valuation??""} onChange={e=>setForm(p=>({...p,valuation:Number(e.target.value)}))}/></div></div>
        <div><Label theme={theme}>Context / Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Anything the numbers don't explain..."/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const {periodLabel,...cur}=form;
            const next={previous:bizMetrics.current||{},current:cur,periodLabel:periodLabel||""};
            setBizMetrics(next); db.saveBizMetrics(next); log("updated","company metrics","Business");
          })}>Save</Btn>
        </div>
      </div></Modal>;

      /* ─── INVESTOR MODAL ─── */
      case "editInvestor": return <Modal theme={theme} title={form.id?"Edit Investor":"New Investor"} onClose={closeM} width={600}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="nanu-form-row"><div><Label theme={theme}>Investor / Contact Name</Label><Input theme={theme} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Person or fund name"/></div><div><Label theme={theme}>Firm</Label><Input theme={theme} value={form.firm||""} onChange={e=>setForm(p=>({...p,firm:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Type</Label><Sel theme={theme} options={INVESTOR_TYPES} value={form.type||"Angel"} onChange={e=>setForm(p=>({...p,type:e.target.value}))}/></div><div><Label theme={theme}>Stage</Label><Sel theme={theme} options={INVESTOR_STAGES} value={form.stage||"Researching"} onChange={e=>setForm(p=>({...p,stage:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Check Size</Label><Input theme={theme} value={form.checkSize||""} onChange={e=>setForm(p=>({...p,checkSize:e.target.value}))} placeholder="e.g. £50k–£100k"/></div><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={activeUsers.map(u=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Contact Name</Label><Input theme={theme} value={form.contactName||""} onChange={e=>setForm(p=>({...p,contactName:e.target.value}))}/></div><div><Label theme={theme}>Contact Email</Label><Input theme={theme} value={form.contactEmail||""} onChange={e=>setForm(p=>({...p,contactEmail:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Warm Intro Via</Label><Input theme={theme} value={form.warmIntro||""} onChange={e=>setForm(p=>({...p,warmIntro:e.target.value}))} placeholder="Who can introduce us?"/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Next Step</Label><Input theme={theme} value={form.nextStep||""} onChange={e=>setForm(p=>({...p,nextStep:e.target.value}))} placeholder="e.g. Send deck"/></div><div><Label theme={theme}>Next Step Date</Label><Input theme={theme} type="date" value={form.nextDate||""} onChange={e=>setForm(p=>({...p,nextDate:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Thesis fit, feedback, objections..."/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setInvestors(p=>p.filter(x=>x.id!==form.id));db.deleteInvestor(form.id);log("deleted",form.name,"Business")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const iid=form.id||uid("inv");
            const idata={id:iid,name:form.name||"",firm:form.firm||"",type:form.type||"Angel",stage:form.stage||"Researching",checkSize:form.checkSize||"",owner:form.owner||"",contactName:form.contactName||"",contactEmail:form.contactEmail||"",nextStep:form.nextStep||"",nextDate:form.nextDate||"",warmIntro:form.warmIntro||"",notes:form.notes||""};
            if(form.id){setInvestors(p=>p.map(x=>x.id===form.id?idata:x));log("updated",idata.name,"Business")}
            else{setInvestors(p=>[...p,idata]);log("created",idata.name,"Business")}
            db.saveInvestor(idata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── BOARD UPDATE MODAL ─── */
      case "editBoardUpdate": return <Modal theme={theme} title={form.id?"Edit Board Update":"New Board Update"} onClose={closeM} width={640}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Title</Label><Input theme={theme} value={form.title||""} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Q3 2026 Investor Update"/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Period</Label><Input theme={theme} value={form.period||""} onChange={e=>setForm(p=>({...p,period:e.target.value}))} placeholder="e.g. Aug 2026 / Q3"/></div><div><Label theme={theme}>Date</Label><Input theme={theme} type="date" value={form.date||""} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Status</Label><Sel theme={theme} options={BOARD_UPDATE_STATUS} value={form.status||"Draft"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div><div><Label theme={theme}>Author</Label><Sel theme={theme} options={activeUsers.map(u=>({value:u.id,label:u.name}))} value={form.author||""} onChange={e=>setForm(p=>({...p,author:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Highlights</Label><Textarea theme={theme} value={form.highlights||""} onChange={e=>setForm(p=>({...p,highlights:e.target.value}))} placeholder="What went well this period"/></div>
        <div><Label theme={theme}>Challenges</Label><Textarea theme={theme} value={form.lowlights||""} onChange={e=>setForm(p=>({...p,lowlights:e.target.value}))} placeholder="What didn't, and what we're doing about it"/></div>
        <div><Label theme={theme}>Asks</Label><Textarea theme={theme} value={form.asks||""} onChange={e=>setForm(p=>({...p,asks:e.target.value}))} placeholder="Intros, advice, or support needed"/></div>
        <div><Label theme={theme}>Metrics Snapshot</Label><Textarea theme={theme} value={form.metricsSnapshot||""} onChange={e=>setForm(p=>({...p,metricsSnapshot:e.target.value}))} placeholder="Key numbers for this period"/></div>
        <div><Label theme={theme}>Full Document Link</Label><Input theme={theme} value={form.link||""} onChange={e=>setForm(p=>({...p,link:e.target.value}))} placeholder="https://..."/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setBoardUpdates(p=>p.filter(x=>x.id!==form.id));db.deleteBoardUpdate(form.id);log("deleted",form.title,"Business")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const bid=form.id||uid("bu");
            const bdata={id:bid,title:form.title||"",period:form.period||"",date:form.date||"",status:form.status||"Draft",author:form.author||"",highlights:form.highlights||"",lowlights:form.lowlights||"",asks:form.asks||"",metricsSnapshot:form.metricsSnapshot||"",link:form.link||""};
            if(form.id){setBoardUpdates(p=>p.map(x=>x.id===form.id?bdata:x));log("updated",bdata.title,"Business")}
            else{setBoardUpdates(p=>[...p,bdata]);log("created",bdata.title,"Business")}
            db.saveBoardUpdate(bdata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── INITIATIVE MODAL ─── */
      case "editInitiative": return <Modal theme={theme} title={form.id?"Edit Initiative":"New Initiative"} onClose={closeM} width={600}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Title</Label><Input theme={theme} value={form.title||""} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Close pre-seed round"/></div>
        <div><Label theme={theme}>Description</Label><Textarea theme={theme} value={form.description||""} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={activeUsers.map(u=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div><div><Label theme={theme}>Horizon</Label><Sel theme={theme} options={INITIATIVE_HORIZONS} value={form.horizon||"This Quarter"} onChange={e=>setForm(p=>({...p,horizon:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Status</Label><Sel theme={theme} options={INITIATIVE_STATUS} value={form.status||"Not Started"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div><div><Label theme={theme}>Target Date</Label><Input theme={theme} type="date" value={form.targetDate||""} onChange={e=>setForm(p=>({...p,targetDate:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Success Metric</Label><Input theme={theme} value={form.successMetric||""} onChange={e=>setForm(p=>({...p,successMetric:e.target.value}))} placeholder="How we know it's done"/></div>
        <div>
          <Label theme={theme}>Progress: {form.progress||0}%</Label>
          <input type="range" min="0" max="100" step="5" value={form.progress||0} onChange={e=>setForm(p=>({...p,progress:Number(e.target.value)}))} style={{width:"100%",accentColor:theme.teal,cursor:"pointer"}}/>
        </div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setInitiatives(p=>p.filter(x=>x.id!==form.id));db.deleteInitiative(form.id);log("deleted",form.title,"Business")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const nid=form.id||uid("ini");
            const ndata={id:nid,title:form.title||"",description:form.description||"",owner:form.owner||"",status:form.status||"Not Started",horizon:form.horizon||"This Quarter",progress:form.progress||0,targetDate:form.targetDate||"",successMetric:form.successMetric||"",notes:form.notes||""};
            if(form.id){setInitiatives(p=>p.map(x=>x.id===form.id?ndata:x));log("updated",ndata.title,"Business")}
            else{setInitiatives(p=>[...p,ndata]);log("created",ndata.title,"Business")}
            db.saveInitiative(ndata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── BUSINESS DOCUMENT MODAL ─── */
      case "editBizDoc": return <Modal theme={theme} title={form.id?"Edit Document":"New Document"} onClose={closeM} width={600}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Title</Label><Input theme={theme} value={form.title||""} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Articles of Association"/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Category</Label><Sel theme={theme} options={DOC_CATEGORIES} value={form.category||"Legal"} onChange={e=>setForm(p=>({...p,category:e.target.value}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={DOC_STATUS} value={form.status||"Draft"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Version</Label><Input theme={theme} value={form.version||""} onChange={e=>setForm(p=>({...p,version:e.target.value}))} placeholder="e.g. 2.1"/></div><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={activeUsers.map(u=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Link (Drive, Dropbox, etc.)</Label><Input theme={theme} value={form.link||""} onChange={e=>setForm(p=>({...p,link:e.target.value}))} placeholder="https://..."/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Effective Date</Label><Input theme={theme} type="date" value={form.effectiveDate||""} onChange={e=>setForm(p=>({...p,effectiveDate:e.target.value}))}/></div><div><Label theme={theme}>Expiry / Review Date</Label><Input theme={theme} type="date" value={form.expiryDate||""} onChange={e=>setForm(p=>({...p,expiryDate:e.target.value}))}/></div></div>
        <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13}}>
          <input type="checkbox" checked={!!form.confidential} onChange={e=>setForm(p=>({...p,confidential:e.target.checked}))} style={{accentColor:theme.teal,width:15,height:15,cursor:"pointer"}}/>
          Mark as confidential
        </label>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setBizDocs(p=>p.filter(x=>x.id!==form.id));db.deleteBizDoc(form.id);log("deleted",form.title,"Business")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const did=form.id||uid("doc");
            const ddata={id:did,title:form.title||"",category:form.category||"Other",status:form.status||"Draft",version:form.version||"",owner:form.owner||"",link:form.link||"",effectiveDate:form.effectiveDate||"",expiryDate:form.expiryDate||"",confidential:!!form.confidential,notes:form.notes||""};
            if(form.id){setBizDocs(p=>p.map(x=>x.id===form.id?ddata:x));log("updated",ddata.title,"Business")}
            else{setBizDocs(p=>[...p,ddata]);log("created",ddata.title,"Business")}
            db.saveBizDoc(ddata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── FOCUS ROUND MODAL ─── */
      case "editFgRound": return <Modal theme={theme} title={form.id?"Edit Round":"New Research Round"} onClose={closeM} width={600}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Round Heading</Label><Input theme={theme} value={form.title||""} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Market research for: Archive redesign"/></div>
        <div><Label theme={theme}>Objective</Label><Textarea theme={theme} value={form.objective||""} onChange={e=>setForm(p=>({...p,objective:e.target.value}))} placeholder="What are we trying to learn?"/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Start Date</Label><Input theme={theme} type="date" value={form.startDate||""} onChange={e=>setForm(p=>({...p,startDate:e.target.value}))}/></div><div><Label theme={theme}>End Date</Label><Input theme={theme} type="date" value={form.endDate||""} onChange={e=>setForm(p=>({...p,endDate:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Status</Label><Sel theme={theme} options={FG_ROUND_STATUS} value={form.status||"Planning"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={activeUsers.map(u=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Target Participants</Label><Input theme={theme} type="number" value={form.targetN??0} onChange={e=>setForm(p=>({...p,targetN:Number(e.target.value)}))}/></div><div><Label theme={theme}>Session Booking Link</Label><Input theme={theme} value={form.sessionLink||""} onChange={e=>setForm(p=>({...p,sessionLink:e.target.value}))} placeholder="Calendly / booking URL"/></div></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setFgRounds(p=>p.filter(x=>x.id!==form.id));db.deleteFgRound(form.id);if(fgActiveRound===form.id)setFgActiveRound("");log("deleted",form.title,"Focus Groups")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const rid2=form.id||uid("fgr");
            const rdata={id:rid2,title:form.title||"",objective:form.objective||"",startDate:form.startDate||"",endDate:form.endDate||"",status:form.status||"Planning",owner:form.owner||"",targetN:form.targetN||0,sessionLink:form.sessionLink||"",notes:form.notes||""};
            if(form.id){setFgRounds(p=>p.map(x=>x.id===form.id?rdata:x));log("updated",rdata.title,"Focus Groups")}
            else{setFgRounds(p=>[...p,rdata]);setFgActiveRound(rid2);log("created",rdata.title,"Focus Groups")}
            db.saveFgRound(rdata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── FOCUS PARTICIPANT MODAL ─── */
      case "editFgParticipant": return <Modal theme={theme} title={form.id?"Edit Participant":"New Participant"} onClose={closeM} width={580}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="nanu-form-row"><div><Label theme={theme}>Name</Label><Input theme={theme} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={FG_PARTICIPANT_STATUS} value={form.status||"Not Sent"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Email</Label><Input theme={theme} value={form.email||""} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/></div><div><Label theme={theme}>Phone</Label><Input theme={theme} value={form.phone||""} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Source</Label><Input theme={theme} value={form.source||""} onChange={e=>setForm(p=>({...p,source:e.target.value}))} placeholder="Where they applied from"/></div><div><Label theme={theme}>Session Slot</Label><Input theme={theme} value={form.sessionSlot||""} onChange={e=>setForm(p=>({...p,sessionSlot:e.target.value}))} placeholder="e.g. Tue 3pm"/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Invited Date</Label><Input theme={theme} type="date" value={form.invitedDate||""} onChange={e=>setForm(p=>({...p,invitedDate:e.target.value}))}/></div><div><Label theme={theme}>Responded Date</Label><Input theme={theme} type="date" value={form.respondedDate||""} onChange={e=>setForm(p=>({...p,respondedDate:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Response Link</Label><Input theme={theme} value={form.responseLink||""} onChange={e=>setForm(p=>({...p,responseLink:e.target.value}))} placeholder="Link to their completed survey"/></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setFgParticipants(p=>p.filter(x=>x.id!==form.id));db.deleteFgParticipant(form.id);log("deleted",form.name,"Focus Groups")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const pid=form.id||uid("fgp");
            const pdata={id:pid,roundId:form.roundId||"",name:form.name||"",email:form.email||"",phone:form.phone||"",source:form.source||"",status:form.status||"Not Sent",invitedDate:form.invitedDate||"",respondedDate:form.respondedDate||"",sessionSlot:form.sessionSlot||"",responseLink:form.responseLink||"",notes:form.notes||""};
            if(form.id){setFgParticipants(p=>p.map(x=>x.id===form.id?pdata:x));log("updated",pdata.name,"Focus Groups")}
            else{setFgParticipants(p=>[...p,pdata]);log("created",pdata.name,"Focus Groups")}
            db.saveFgParticipant(pdata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── FOCUS ASSET MODAL ─── */
      case "editFgAsset": return <Modal theme={theme} title={form.id?"Edit Asset":"New Asset"} onClose={closeM} width={560}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Name</Label><Input theme={theme} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Archive UX survey v2"/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Type</Label><Sel theme={theme} options={FG_ASSET_TYPES} value={form.type||"Survey"} onChange={e=>setForm(p=>({...p,type:e.target.value}))}/></div><div><Label theme={theme}>Date Added</Label><Input theme={theme} type="date" value={form.addedDate||""} onChange={e=>setForm(p=>({...p,addedDate:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Link</Label><Input theme={theme} value={form.url||""} onChange={e=>setForm(p=>({...p,url:e.target.value}))} placeholder="Typeform / Google Form / Drive URL"/></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setFgAssets(p=>p.filter(x=>x.id!==form.id));db.deleteFgAsset(form.id);log("deleted",form.name,"Focus Groups")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const aid=form.id||uid("fga");
            const adata={id:aid,roundId:form.roundId||"",name:form.name||"",type:form.type||"Survey",url:form.url||"",addedDate:form.addedDate||"",notes:form.notes||""};
            if(form.id){setFgAssets(p=>p.map(x=>x.id===form.id?adata:x));log("updated",adata.name,"Focus Groups")}
            else{setFgAssets(p=>[...p,adata]);log("created",adata.name,"Focus Groups")}
            db.saveFgAsset(adata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── FOCUS CHANNEL MODAL ─── */
      case "editFgChannel": return <Modal theme={theme} title={form.id?"Edit Posting Area":"New Posting Area"} onClose={closeM} width={560}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="nanu-form-row"><div><Label theme={theme}>Name</Label><Input theme={theme} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. r/UFOs"/></div><div><Label theme={theme}>Platform</Label><Input theme={theme} value={form.platform||""} onChange={e=>setForm(p=>({...p,platform:e.target.value}))} placeholder="Reddit, Discord..."/></div></div>
        <div><Label theme={theme}>URL</Label><Input theme={theme} value={form.url||""} onChange={e=>setForm(p=>({...p,url:e.target.value}))} placeholder="https://..."/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Status</Label><Sel theme={theme} options={FG_CHANNEL_STATUS} value={form.status||"Pending"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={activeUsers.map(u=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Posting Rules</Label><Input theme={theme} value={form.rules||""} onChange={e=>setForm(p=>({...p,rules:e.target.value}))} placeholder="e.g. Mod approval required, no self-promo Fridays"/></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setFgChannels(p=>p.filter(x=>x.id!==form.id));db.deleteFgChannel(form.id);log("deleted",form.name,"Focus Groups")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const cid=form.id||uid("fgc");
            const cdata={id:cid,name:form.name||"",platform:form.platform||"",url:form.url||"",status:form.status||"Pending",rules:form.rules||"",owner:form.owner||"",notes:form.notes||""};
            if(form.id){setFgChannels(p=>p.map(x=>x.id===form.id?cdata:x));log("updated",cdata.name,"Focus Groups")}
            else{setFgChannels(p=>[...p,cdata]);log("created",cdata.name,"Focus Groups")}
            db.saveFgChannel(cdata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── CONFIRM: CLEAR TEAM ACTIVITY (admin) ─── */
      /* ─── ADMIN: RESET A USER'S PIN ─── */
      case "resetPin": return <Modal theme={theme} title={`Reset PIN — ${form.name}`} onClose={closeM} width={460}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <p style={{fontSize:13,color:theme.textSec,margin:0,lineHeight:1.6}}>Set a new PIN for {form.name}. Share it with them and ask them to change it in Settings.</p>
        <div><Label theme={theme}>New PIN (4–6 digits)</Label>
          <Input theme={theme} value={form.newPin||""} onChange={e=>setForm(p=>({...p,newPin:e.target.value.replace(/\D/g,"").slice(0,6)}))} placeholder="e.g. 4821" maxLength={6}/>
        </div>
        <Btn theme={theme} small onClick={()=>setForm(p=>({...p,newPin:String(Math.floor(1000+Math.random()*9000))}))}><RefreshCw size={12}/> Generate random</Btn>
        {form.newPin&&form.newPin.length<4&&<div style={{fontSize:12,color:theme.orange}}>PIN must be at least 4 digits.</div>}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} disabled={!form.newPin||form.newPin.length<4} onClick={()=>doSave(()=>{
            const upd={...users.find(x=>x.id===form.id),pin:form.newPin};
            setUsers(p=>p.map(x=>x.id===form.id?upd:x));
            db.saveUser(upd);
            log("reset PIN for",form.name,"Admin");
          })}><Lock size={13}/> Set PIN</Btn>
        </div>
      </div></Modal>;

      /* ─── ADMIN: DEACTIVATE USER ─── */
      case "deactivateUser": return <Modal theme={theme} title={`Deactivate ${form.name}?`} onClose={closeM} width={480}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"flex",gap:12,alignItems:"flex-start",padding:14,background:`${theme.orange}0d`,border:`1px solid ${theme.orange}40`,borderRadius:10}}>
          <EyeOff size={18} color={theme.orange} style={{flexShrink:0,marginTop:2}}/>
          <div style={{fontSize:13,color:theme.textSec,lineHeight:1.6}}>
            {form.name} won't be able to log in and will disappear from the team list and every owner picker. Their name stays on past tasks and activity, and you can reactivate them any time.
          </div>
        </div>
        <p style={{fontSize:12,color:theme.textMut,margin:0}}>This is the safe option for someone leaving the team.</p>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const upd={...users.find(x=>x.id===form.id),active:false};
            setUsers(p=>p.map(x=>x.id===form.id?upd:x));
            db.saveUser(upd);
            log("deactivated",form.name,"Admin");
          })}><EyeOff size={13}/> Deactivate</Btn>
        </div>
      </div></Modal>;

      /* ─── ADMIN: PERMANENTLY DELETE USER ─── */
      case "deleteUser": return <Modal theme={theme} title={`Permanently delete ${form.name}?`} onClose={closeM} width={520}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"flex",gap:12,alignItems:"flex-start",padding:14,background:`${theme.red}0d`,border:`1px solid ${theme.red}40`,borderRadius:10}}>
          <AlertTriangle size={18} color={theme.red} style={{flexShrink:0,marginTop:2}}/>
          <div style={{fontSize:13,color:theme.textSec,lineHeight:1.6}}>
            This removes {form.name} from the database for good. Anything they owned — tasks, projects, outreach, responsibilities — stays but becomes <strong>unassigned</strong>, and their name disappears from past activity.
          </div>
        </div>
        {(()=>{
          const owned = tasks.filter(t=>Array.isArray(t.owners)?t.owners.includes(form.id):t.owners===form.id).length;
          const resp = responsibilities.filter(r=>r.owner===form.id).length;
          return (owned>0||resp>0)&&<div style={{fontSize:12,color:theme.orange,padding:"10px 12px",background:theme.bgInput,borderRadius:8}}>
            They currently own {owned} task{owned===1?"":"s"} and {resp} responsibilit{resp===1?"y":"ies"}. Consider reassigning first, or deactivate instead.
          </div>;
        })()}
        <p style={{fontSize:12,color:theme.textMut,margin:0}}>Prefer <strong>Deactivate</strong> unless you really need them gone.</p>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn theme={theme} danger onClick={()=>doSave(()=>{
            setUsers(p=>p.filter(x=>x.id!==form.id));
            db.deleteUser(form.id);
            log("deleted",form.name,"Admin");
          })}><Trash2 size={13}/> Delete permanently</Btn>
        </div>
      </div></Modal>;

      /* ─── USER: CHANGE OWN PIN ─── */
      case "changePin": return <Modal theme={theme} title="Change your PIN" onClose={closeM} width={460}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Current PIN</Label>
          <Input theme={theme} type="password" value={form.current||""} onChange={e=>setForm(p=>({...p,current:e.target.value.replace(/\D/g,"").slice(0,6),err:""}))} maxLength={6}/>
        </div>
        <div><Label theme={theme}>New PIN (4–6 digits)</Label>
          <Input theme={theme} value={form.newPin||""} onChange={e=>setForm(p=>({...p,newPin:e.target.value.replace(/\D/g,"").slice(0,6),err:""}))} maxLength={6}/>
        </div>
        <div><Label theme={theme}>Confirm New PIN</Label>
          <Input theme={theme} value={form.confirm||""} onChange={e=>setForm(p=>({...p,confirm:e.target.value.replace(/\D/g,"").slice(0,6),err:""}))} maxLength={6}/>
        </div>
        {form.err&&<div style={{fontSize:12,color:theme.red,padding:"8px 12px",background:`${theme.red}0d`,borderRadius:8}}>{form.err}</div>}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>{
            if(form.current!==curUser.pin){setForm(p=>({...p,err:"Current PIN is incorrect."}));return}
            if(!form.newPin||form.newPin.length<4){setForm(p=>({...p,err:"New PIN must be at least 4 digits."}));return}
            if(form.newPin!==form.confirm){setForm(p=>({...p,err:"New PIN and confirmation don't match."}));return}
            const upd={...curUser,pin:form.newPin};
            setUsers(p=>p.map(x=>x.id===curUser.id?upd:x));
            setCurUser(upd);
            db.saveUser(upd);
            log("changed their PIN","","Settings");
            closeM();
          }}><Lock size={13}/> Update PIN</Btn>
        </div>
      </div></Modal>;

      case "confirmClearActivity": return <Modal theme={theme} title="Clear team activity?" onClose={closeM} width={480}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"flex",gap:12,alignItems:"flex-start",padding:14,background:`${theme.red}0d`,border:`1px solid ${theme.red}40`,borderRadius:10}}>
          <AlertTriangle size={18} color={theme.red} style={{flexShrink:0,marginTop:2}}/>
          <div style={{fontSize:13,color:theme.textSec,lineHeight:1.6}}>
            This permanently deletes the activity log for the <strong>whole team</strong> — {activity.length} entries. It can't be undone, and everyone will see an empty feed.
          </div>
        </div>
        <p style={{fontSize:12,color:theme.textMut,margin:0}}>Tasks, projects and all other data are unaffected — this only clears the activity history.</p>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn theme={theme} danger onClick={()=>doSave(()=>{
            setActivity([]);
            db.clearAllActivity();
          })}><Trash2 size={13}/> Clear all activity</Btn>
        </div>
      </div></Modal>;

      /* ─── CONFIRM: BULK DELETE TASKS (admin master view) ─── */
      case "confirmBulkDeleteTasks": return <Modal theme={theme} title={`Delete ${bulkSelected.length} task${bulkSelected.length===1?"":"s"}?`} onClose={closeM} width={520}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"flex",gap:12,alignItems:"flex-start",padding:14,background:`${theme.red}0d`,border:`1px solid ${theme.red}40`,borderRadius:10}}>
          <AlertTriangle size={18} color={theme.red} style={{flexShrink:0,marginTop:2}}/>
          <div style={{fontSize:13,color:theme.textSec,lineHeight:1.6}}>
            This permanently deletes these tasks for everyone. It can't be undone.
          </div>
        </div>
        <div style={{maxHeight:200,overflow:"auto",background:theme.bgInput,borderRadius:8,padding:12}}>
          {bulkSelected.map(tid=>{const t=tasks.find(x=>x.id===tid);return t?<div key={tid} style={{fontSize:12,padding:"3px 0",display:"flex",gap:8,alignItems:"center"}}>
            <span style={{flex:1}}>{t.title}</span>
            <span style={{color:theme.textMut,fontSize:11}}>{uNames(t.owners)}</span>
          </div>:null})}
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn theme={theme} danger onClick={()=>doSave(()=>{
            bulkSelected.forEach(tid=>db.deleteTask(tid));
            setTasks(prev=>prev.filter(x=>!bulkSelected.includes(x.id)));
            log("deleted",`${bulkSelected.length} task(s)`,"Tasks");
            setBulkSelected([]);
          })}><Trash2 size={13}/> Delete permanently</Btn>
        </div>
      </div></Modal>;

      /* ─── IMPORT MEETING NOTES ─── */
      case "importMeeting": {
        const parsed = form._parsed;
        const guessOwner = (line) => {
          const hit = activeUsers.find(u=>{
            const first=u.name.split(" ")[0];
            return new RegExp(`\\b${first}\\b`,"i").test(line);
          });
          return hit?hit.id:"";
        };
        const doParse = () => {
          const items = parseActionItems(form.raw);
          setForm(p=>({...p,_parsed: items.map(text=>({text, owner: guessOwner(text), dueDate:""}))}));
        };
        return <Modal theme={theme} title="Import meeting notes" onClose={closeM} width={680}><div style={{display:"flex",flexDirection:"column",gap:14}}>
          <p style={{fontSize:12,color:theme.textSec,margin:0,lineHeight:1.6}}>Paste the summary from Read.ai (or any notes tool). Action points are pulled out automatically — check the owners and dates before saving.</p>
          <div className="nanu-form-row"><div><Label theme={theme}>Meeting title</Label><Input theme={theme} value={form.title||""} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Exec sync"/></div><div><Label theme={theme}>Date</Label><Input theme={theme} type="date" value={form.date||""} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/></div></div>
          <div className="nanu-form-row"><div><Label theme={theme}>Type</Label><Sel theme={theme} options={MEETING_TYPES} value={form.type||"Exec"} onChange={e=>setForm(p=>({...p,type:e.target.value}))}/></div><div><Label theme={theme}>Source</Label><Input theme={theme} value={form.source||""} onChange={e=>setForm(p=>({...p,source:e.target.value}))}/></div></div>
          <div>
            <Label theme={theme}>Paste the notes</Label>
            <Textarea theme={theme} value={form.raw||""} onChange={e=>setForm(p=>({...p,raw:e.target.value,_parsed:null}))} style={{minHeight:160,fontFamily:FONT_MONO,fontSize:12}} placeholder={"Paste the full summary here.\n\nAction Items\n- Nicholas to set up the password manager by Wednesday\n- Ed to meet Maya and Keara"}/>
            <Btn theme={theme} small onClick={doParse} style={{marginTop:8}}><Zap size={12}/> Find action points</Btn>
          </div>

          {parsed&&<div>
            <Label theme={theme}>Found {parsed.length} action point{parsed.length===1?"":"s"}</Label>
            {parsed.length===0&&<p style={{fontSize:12,color:theme.orange,lineHeight:1.6}}>Nothing detected. Add an "Action Items" heading with bullet points, or add them by hand after saving.</p>}
            <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:280,overflow:"auto"}}>
              {parsed.map((a,i)=>(
                <div key={i} style={{padding:10,background:theme.bgInput,borderRadius:8,border:`1px solid ${theme.border}`}}>
                  <Textarea theme={theme} value={a.text} onChange={e=>{const p2=[...parsed];p2[i]={...a,text:e.target.value};setForm(p=>({...p,_parsed:p2}))}} style={{minHeight:42,marginBottom:6}}/>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                    <Sel theme={theme} options={[{value:"",label:"Unassigned"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={a.owner} onChange={e=>{const p2=[...parsed];p2[i]={...a,owner:e.target.value};setForm(p=>({...p,_parsed:p2}))}} style={{width:"auto",fontSize:12,padding:"4px 8px"}}/>
                    <Input theme={theme} type="date" value={a.dueDate} onChange={e=>{const p2=[...parsed];p2[i]={...a,dueDate:e.target.value};setForm(p=>({...p,_parsed:p2}))}} style={{width:"auto",fontSize:12,padding:"4px 8px"}}/>
                    <button type="button" onClick={()=>{const p2=[...parsed];p2.splice(i,1);setForm(p=>({...p,_parsed:p2}))}} style={{background:"none",border:"none",color:theme.red,cursor:"pointer",marginLeft:"auto"}}><Trash2 size={13}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>}

          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
            <Btn theme={theme} onClick={closeM}>Cancel</Btn>
            <Btn primary theme={theme} disabled={!form.title} onClick={()=>doSave(()=>{
              const mid=uid("mtg");
              const md={id:mid,title:form.title||"",date:form.date||"",type:form.type||"Exec",attendees:[],summary:form.raw||"",decisions:"",recordingUrl:"",source:form.source||"",notes:"",createdBy:curUser.id};
              setMeetings(prev=>[md,...prev]); db.saveMeeting(md);
              const acts=(parsed||[]).filter(a=>a.text.trim()).map(a=>({id:uid("ma"),meetingId:mid,text:a.text.trim(),owner:a.owner||"",ownerText:"",dueDate:a.dueDate||"",status:"Open",taskId:"",notes:""}));
              setMeetingActions(prev=>[...prev,...acts]); acts.forEach(a=>db.saveMeetingAction(a));
              log("imported",`${md.title} with ${acts.length} action point(s)`,"Meetings");
            })}><Check size={13}/> Save meeting{parsed?` + ${parsed.length} actions`:""}</Btn>
          </div>
        </div></Modal>;
      }

      /* ─── MEETING MODAL ─── */
      case "editMeeting": return <Modal theme={theme} title={form.id?"Edit Meeting":"New Meeting"} onClose={closeM} width={620}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="nanu-form-row"><div><Label theme={theme}>Title</Label><Input theme={theme} value={form.title||""} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></div><div><Label theme={theme}>Date</Label><Input theme={theme} type="date" value={form.date||""} onChange={e=>setForm(p=>({...p,date:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Type</Label><Sel theme={theme} options={MEETING_TYPES} value={form.type||"Exec"} onChange={e=>setForm(p=>({...p,type:e.target.value}))}/></div><div><Label theme={theme}>Source</Label><Input theme={theme} value={form.source||""} onChange={e=>setForm(p=>({...p,source:e.target.value}))} placeholder="Read.ai, in person..."/></div></div>
        <div><Label theme={theme}>Summary</Label><Textarea theme={theme} value={form.summary||""} onChange={e=>setForm(p=>({...p,summary:e.target.value}))} style={{minHeight:100}}/></div>
        <div><Label theme={theme}>Decisions</Label><Textarea theme={theme} value={form.decisions||""} onChange={e=>setForm(p=>({...p,decisions:e.target.value}))} placeholder="What was actually decided"/></div>
        <div><Label theme={theme}>Recording / notes link</Label><Input theme={theme} value={form.recordingUrl||""} onChange={e=>setForm(p=>({...p,recordingUrl:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setMeetings(p=>p.filter(x=>x.id!==form.id));meetingActions.filter(a=>a.meetingId===form.id).forEach(a=>db.deleteMeetingAction(a.id));setMeetingActions(p=>p.filter(a=>a.meetingId!==form.id));db.deleteMeeting(form.id);log("deleted",form.title,"Meetings")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const mid=form.id||uid("mtg");
            const md={id:mid,title:form.title||"",date:form.date||"",type:form.type||"Exec",attendees:form.attendees||[],summary:form.summary||"",decisions:form.decisions||"",recordingUrl:form.recordingUrl||"",source:form.source||"",notes:form.notes||"",createdBy:form.createdBy||curUser.id};
            if(form.id){setMeetings(p=>p.map(x=>x.id===form.id?md:x));log("updated",md.title,"Meetings")}
            else{setMeetings(p=>[md,...p]);log("added",md.title,"Meetings")}
            db.saveMeeting(md);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── MEETING ACTION MODAL ─── */
      case "editMeetingAction": return <Modal theme={theme} title={form.id?"Edit Action Point":"New Action Point"} onClose={closeM} width={560}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Action</Label><Textarea theme={theme} value={form.text||""} onChange={e=>setForm(p=>({...p,text:e.target.value}))}/></div>
        <div><Label theme={theme}>Meeting</Label><Sel theme={theme} options={[{value:"",label:"Not linked"},...meetings.map(m=>({value:m.id,label:`${m.title}${m.date?" · "+m.date:""}`}))]} value={form.meetingId||""} onChange={e=>setForm(p=>({...p,meetingId:e.target.value}))}/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={[{value:"",label:"Unassigned"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div><div><Label theme={theme}>Due date</Label><Input theme={theme} type="date" value={form.dueDate||""} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Status</Label><Sel theme={theme} options={MACTION_STATUS} value={form.status||"Open"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div><div><Label theme={theme}>Owner (free text)</Label><Input theme={theme} value={form.ownerText||""} onChange={e=>setForm(p=>({...p,ownerText:e.target.value}))} placeholder="If not a hub user"/></div></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setMeetingActions(p=>p.filter(x=>x.id!==form.id));db.deleteMeetingAction(form.id);log("deleted action point","","Meetings")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const aid=form.id||uid("ma");
            const ad={id:aid,meetingId:form.meetingId||"",text:form.text||"",owner:form.owner||"",ownerText:form.ownerText||"",dueDate:form.dueDate||"",status:form.status||"Open",taskId:form.taskId||"",notes:form.notes||""};
            if(form.id){setMeetingActions(p=>p.map(x=>x.id===form.id?ad:x))}
            else{setMeetingActions(p=>[...p,ad])}
            db.saveMeetingAction(ad);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── OPERATING STRUCTURE MODAL ─── */
      case "editOpStructure": {
        const ListEditor = ({label, field, placeholder}) => (
          <div>
            <Label theme={theme}>{label}</Label>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {(form[field]||[]).map((v,i)=>(
                <div key={i} style={{display:"flex",gap:6,alignItems:"flex-start"}}>
                  <Textarea theme={theme} value={v} onChange={e=>{const a=[...(form[field]||[])];a[i]=e.target.value;setForm(p=>({...p,[field]:a}))}} style={{flex:1,minHeight:44}}/>
                  <button type="button" onClick={()=>{const a=[...(form[field]||[])];a.splice(i,1);setForm(p=>({...p,[field]:a}))}} style={{background:"none",border:"none",color:theme.red,cursor:"pointer",marginTop:8}}><Trash2 size={13}/></button>
                </div>
              ))}
              <Btn theme={theme} small onClick={()=>setForm(p=>({...p,[field]:[...(p[field]||[]),""]}))}><Plus size={12}/> {placeholder}</Btn>
            </div>
          </div>
        );
        return <Modal theme={theme} title={`Operating structure — ${uName(form.userId)}`} onClose={closeM} width={680}><div style={{display:"flex",flexDirection:"column",gap:16}}>
          {isAdmin&&<div><Label theme={theme}>Person</Label><Sel theme={theme} options={activeUsers.map(u=>({value:u.id,label:u.name}))} value={form.userId||""} onChange={e=>setForm(p=>({...p,userId:e.target.value}))}/></div>}
          <div><Label theme={theme}>Subtitle</Label><Input theme={theme} value={form.subtitle||""} onChange={e=>setForm(p=>({...p,subtitle:e.target.value}))} placeholder="e.g. Business Operations · Internal Community · Phase 1"/></div>
          <div><Label theme={theme}>Intro</Label><Textarea theme={theme} value={form.intro||""} onChange={e=>setForm(p=>({...p,intro:e.target.value}))}/></div>

          <ListEditor label="What you own" field="owns" placeholder="Add ownership"/>
          <ListEditor label="Shared and supporting" field="shared" placeholder="Add shared item"/>

          <div>
            <Label theme={theme}>Weekly cadence</Label>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {(form.cadence||[]).map((d,di)=>(
                <div key={di} style={{padding:12,background:theme.bgInput,borderRadius:10,border:`1px solid ${theme.border}`}}>
                  <div style={{display:"flex",gap:6,marginBottom:8}}>
                    <Input theme={theme} value={d.day||""} onChange={e=>{const c=[...(form.cadence||[])];c[di]={...c[di],day:e.target.value};setForm(p=>({...p,cadence:c}))}} placeholder="Day" style={{flex:"0 0 120px"}}/>
                    <Input theme={theme} value={d.theme||""} onChange={e=>{const c=[...(form.cadence||[])];c[di]={...c[di],theme:e.target.value};setForm(p=>({...p,cadence:c}))}} placeholder="Theme" style={{flex:1}}/>
                    <button type="button" onClick={()=>{const c=[...(form.cadence||[])];c.splice(di,1);setForm(p=>({...p,cadence:c}))}} style={{background:"none",border:"none",color:theme.red,cursor:"pointer"}}><Trash2 size={13}/></button>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:5,paddingLeft:10}}>
                    {(d.items||[]).map((it,ii)=>(
                      <div key={ii} style={{display:"flex",gap:6,alignItems:"flex-start"}}>
                        <Textarea theme={theme} value={it} onChange={e=>{const c=[...(form.cadence||[])];const items=[...(c[di].items||[])];items[ii]=e.target.value;c[di]={...c[di],items};setForm(p=>({...p,cadence:c}))}} style={{flex:1,minHeight:40}}/>
                        <button type="button" onClick={()=>{const c=[...(form.cadence||[])];const items=[...(c[di].items||[])];items.splice(ii,1);c[di]={...c[di],items};setForm(p=>({...p,cadence:c}))}} style={{background:"none",border:"none",color:theme.red,cursor:"pointer",marginTop:8}}><X size={12}/></button>
                      </div>
                    ))}
                    <Btn theme={theme} small onClick={()=>{const c=[...(form.cadence||[])];c[di]={...c[di],items:[...(c[di].items||[]),""]};setForm(p=>({...p,cadence:c}))}}><Plus size={11}/> Add item</Btn>
                  </div>
                </div>
              ))}
              <Btn theme={theme} small onClick={()=>setForm(p=>({...p,cadence:[...(p.cadence||[]),{day:"",theme:"",items:[]}]}))}><Plus size={12}/> Add day</Btn>
            </div>
          </div>

          <ListEditor label="Standing responsibilities" field="standing" placeholder="Add responsibility"/>
          <ListEditor label="Immediate focus · next 1–2 weeks" field="focus" placeholder="Add focus item"/>

          <div><Label theme={theme}>Source note</Label><Input theme={theme} value={form.sourceNote||""} onChange={e=>setForm(p=>({...p,sourceNote:e.target.value}))}/></div>

          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
            {isAdmin&&opStructures.some(s=>s.userId===form.userId)&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setOpStructures(p=>p.filter(x=>x.userId!==form.userId));db.deleteOpStructure(form.userId);log("deleted structure for",uName(form.userId),"Team")})}><Trash2 size={13}/> Delete</Btn>}
            <Btn theme={theme} onClick={closeM}>Cancel</Btn>
            <Btn primary theme={theme} onClick={()=>doSave(()=>{
              const clean=(a)=>(a||[]).map(x=>typeof x==="string"?x.trim():x).filter(x=>typeof x==="string"?x:true);
              const sd={userId:form.userId,subtitle:form.subtitle||"",intro:form.intro||"",owns:clean(form.owns),shared:clean(form.shared),
                cadence:(form.cadence||[]).filter(d=>d.day).map(d=>({...d,items:clean(d.items)})),
                standing:clean(form.standing),focus:clean(form.focus),sourceNote:form.sourceNote||""};
              setOpStructures(p=>p.some(x=>x.userId===sd.userId)?p.map(x=>x.userId===sd.userId?sd:x):[...p,sd]);
              db.saveOpStructure(sd);
              log("updated operating structure",uName(sd.userId),"Team");
            })}>Done</Btn>
          </div>
        </div></Modal>;
      }

      /* ─── ROADMAP ITEM MODAL ─── */
      case "editRoadmapItem": {
        const canEditRm = isAdmin || isExec;
        const isRequest = (form.bucket||"Requested")==="Requested";
        return <Modal theme={theme} title={form.id?(isRequest?"Request":"Roadmap item"):(canEditRm&&!isRequest?"New roadmap item":"New request")} onClose={closeM} width={620}><div style={{display:"flex",flexDirection:"column",gap:14}}>
          {isRequest&&!canEditRm&&<div style={{padding:"10px 14px",background:`${theme.teal}0d`,border:`1px solid ${theme.teal}40`,borderRadius:8,fontSize:12,color:theme.textSec,lineHeight:1.6}}>
            This goes to the dev team as a written request. They will triage it and you will see where it lands on the roadmap.
          </div>}
          <div><Label theme={theme}>What is it?</Label><Input theme={theme} value={form.title||""} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="One line"/></div>
          <div><Label theme={theme}>Description</Label><Textarea theme={theme} value={form.description||""} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="What should it do, and for whom?"/></div>
          <div><Label theme={theme}>Why it matters</Label><Textarea theme={theme} value={form.why||""} onChange={e=>setForm(p=>({...p,why:e.target.value}))} placeholder="What breaks or stays slow without it"/></div>
          <div className="nanu-form-row"><div><Label theme={theme}>Area</Label><Sel theme={theme} options={RM_AREAS} value={form.area||RM_AREAS[0]} onChange={e=>setForm(p=>({...p,area:e.target.value}))}/></div><div><Label theme={theme}>Priority</Label><Sel theme={theme} options={RM_PRIORITY} value={form.priority||"Medium"} onChange={e=>setForm(p=>({...p,priority:e.target.value}))}/></div></div>

          {canEditRm&&<>
            <div className="nanu-form-row"><div><Label theme={theme}>Bucket</Label><Sel theme={theme} options={RM_BUCKETS} value={form.bucket||"Requested"} onChange={e=>setForm(p=>({...p,bucket:e.target.value}))}/></div><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={[{value:"",label:"Unassigned"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div></div>
            <div className="nanu-form-row"><div><Label theme={theme}>Effort</Label><Sel theme={theme} options={[{value:"",label:"Not sized"},...RM_EFFORT.map(x=>({value:x,label:x}))]} value={form.effort||""} onChange={e=>setForm(p=>({...p,effort:e.target.value}))}/></div><div><Label theme={theme}>Target quarter</Label><Input theme={theme} value={form.targetQuarter||""} onChange={e=>setForm(p=>({...p,targetQuarter:e.target.value}))} placeholder="e.g. 2026 Q4"/></div></div>
            {form.bucket==="Now"&&<div>
              <Label theme={theme}>Progress: {form.progress||0}%</Label>
              <input type="range" min="0" max="100" step="5" value={form.progress||0} onChange={e=>setForm(p=>({...p,progress:Number(e.target.value)}))} style={{width:"100%",accentColor:theme.teal,cursor:"pointer"}}/>
            </div>}
            {form.bucket==="Shipped"&&<div className="nanu-form-row"><div><Label theme={theme}>Shipped date</Label><Input theme={theme} type="date" value={form.shippedDate||""} onChange={e=>setForm(p=>({...p,shippedDate:e.target.value}))}/></div><div><Label theme={theme}>Release tag</Label><Input theme={theme} value={form.releaseTag||""} onChange={e=>setForm(p=>({...p,releaseTag:e.target.value}))} placeholder="e.g. v2.1"/></div></div>}
            <div><Label theme={theme}>Decision note</Label><Textarea theme={theme} value={form.decisionNote||""} onChange={e=>setForm(p=>({...p,decisionNote:e.target.value}))} placeholder="Why it landed where it did — visible to whoever requested it"/></div>
            <div>
              <Label theme={theme}>Linked tasks</Label>
              <Sel theme={theme} options={[{value:"",label:"Link an existing task..."},...tasks.filter(x=>x.status!=="Done"&&!(form.linkedTasks||[]).includes(x.id)).map(x=>({value:x.id,label:x.title}))]} value="" onChange={e=>{if(e.target.value)setForm(p=>({...p,linkedTasks:[...(p.linkedTasks||[]),e.target.value]}))}}/>
              {(form.linkedTasks||[]).length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
                {(form.linkedTasks||[]).map(tid=>{const tk=tasks.find(x=>x.id===tid);return tk?<span key={tid} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,padding:"3px 8px",background:theme.bgInput,borderRadius:6,color:theme.textSec}}>{tk.title}<button type="button" onClick={()=>setForm(p=>({...p,linkedTasks:p.linkedTasks.filter(x=>x!==tid)}))} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer",padding:0}}><X size={11}/></button></span>:null})}
              </div>}
            </div>
            <div><Label theme={theme}>Sort order</Label><Input theme={theme} type="number" value={form.sortOrder??0} onChange={e=>setForm(p=>({...p,sortOrder:Number(e.target.value)}))}/></div>
          </>}

          {form.id&&form.requestedBy&&<div style={{fontSize:11,color:theme.textMut,padding:"8px 12px",background:theme.bgInput,borderRadius:8}}>Requested by {uName(form.requestedBy)}{form.requestedDate?` on ${form.requestedDate}`:""}</div>}
          {form.decisionNote&&!canEditRm&&<div style={{padding:"8px 12px",background:theme.bgInput,borderRadius:8,fontSize:12,color:theme.textSec,lineHeight:1.5}}><strong style={{color:theme.teal}}>Decision:</strong> {form.decisionNote}</div>}

          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
            {form.id&&canEditRm&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setRoadmapItems(p=>p.filter(x=>x.id!==form.id));db.deleteRoadmapItem(form.id);log("deleted",form.title,"Roadmap")})}><Trash2 size={13}/> Delete</Btn>}
            <Btn theme={theme} onClick={closeM}>Cancel</Btn>
            <Btn primary theme={theme} onClick={()=>doSave(()=>{
              const rid4=form.id||uid("rm");
              const rd={id:rid4,title:form.title||"",description:form.description||"",area:form.area||"",bucket:form.bucket||"Requested",owner:form.owner||"",priority:form.priority||"Medium",effort:form.effort||"",progress:form.progress||0,targetQuarter:form.targetQuarter||"",targetDate:form.targetDate||"",shippedDate:form.shippedDate||"",releaseTag:form.releaseTag||"",requestedBy:form.requestedBy||curUser.id,requestedDate:form.requestedDate||todayStr,why:form.why||"",decisionNote:form.decisionNote||"",linkedTasks:form.linkedTasks||[],sortOrder:form.sortOrder||0,notes:form.notes||""};
              if(form.id){setRoadmapItems(p=>p.map(x=>x.id===form.id?rd:x));log("updated",rd.title,"Roadmap")}
              else{setRoadmapItems(p=>[...p,rd]);log(rd.bucket==="Requested"?"requested":"added",rd.title,"Roadmap")}
              db.saveRoadmapItem(rd);
            })}>Done</Btn>
          </div>
        </div></Modal>;
      }

      /* ─── PHASE ACTION MODAL ─── */
      case "editPhaseAction": return <Modal theme={theme} title={form.id?"Edit Action":"New Action"} onClose={closeM} width={580}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="nanu-form-row"><div><Label theme={theme}>Number</Label><Input theme={theme} type="number" value={form.seq??0} onChange={e=>setForm(p=>({...p,seq:Number(e.target.value)}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={PHASE_ACTION_STATUS} value={form.status||"Not started"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Action</Label><Input theme={theme} value={form.action||""} onChange={e=>setForm(p=>({...p,action:e.target.value}))}/></div>
        <div><Label theme={theme}>Detail</Label><Textarea theme={theme} value={form.detail||""} onChange={e=>setForm(p=>({...p,detail:e.target.value}))}/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={[{value:"",label:"Use free text"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={form.ownerUser||""} onChange={e=>setForm(p=>({...p,ownerUser:e.target.value}))}/></div><div><Label theme={theme}>Owner (free text)</Label><Input theme={theme} value={form.ownerText||""} onChange={e=>setForm(p=>({...p,ownerText:e.target.value}))} placeholder="e.g. Everyone, Each head"/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Due label</Label><Input theme={theme} value={form.dueLabel||""} onChange={e=>setForm(p=>({...p,dueLabel:e.target.value}))} placeholder="e.g. Next Tuesday, Ongoing"/></div><div><Label theme={theme}>Due date</Label><Input theme={theme} type="date" value={form.dueDate||""} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setPhaseActions(p=>p.filter(x=>x.id!==form.id));db.deletePhaseAction(form.id);log("deleted",form.action,"Business")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const aid=form.id||uid("pa");
            const ad={id:aid,seq:form.seq||0,action:form.action||"",detail:form.detail||"",ownerUser:form.ownerUser||"",ownerText:form.ownerText||"",dueLabel:form.dueLabel||"",dueDate:form.dueDate||"",status:form.status||"Not started",notes:form.notes||""};
            if(form.id){setPhaseActions(p=>p.map(x=>x.id===form.id?ad:x));log("updated",ad.action,"Business")}
            else{setPhaseActions(p=>[...p,ad]);log("added",ad.action,"Business")}
            db.savePhaseAction(ad);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── ACCESS REGISTER MODAL ─── */
      case "editAccessItem": return <Modal theme={theme} title={form.id?"Edit System Access":"Add System"} onClose={closeM} width={580}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start",padding:12,background:`${theme.yellow}0d`,border:`1px solid ${theme.yellow}40`,borderRadius:8}}>
          <Lock size={14} color={theme.yellow} style={{flexShrink:0,marginTop:2}}/>
          <div style={{fontSize:12,color:theme.textSec,lineHeight:1.5}}>Record who holds access — never passwords or keys. Those belong in a password manager.</div>
        </div>
        <div className="nanu-form-row"><div><Label theme={theme}>System</Label><Input theme={theme} value={form.system||""} onChange={e=>setForm(p=>({...p,system:e.target.value}))} placeholder="e.g. Banking and payment processing"/></div><div><Label theme={theme}>Category</Label><Input theme={theme} value={form.category||""} onChange={e=>setForm(p=>({...p,category:e.target.value}))} placeholder="Platform, Finance, Social..."/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Primary Holder</Label><Sel theme={theme} options={[{value:"",label:"Not assigned"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={form.primaryHolder||""} onChange={e=>setForm(p=>({...p,primaryHolder:e.target.value}))}/></div><div><Label theme={theme}>Backup Holder</Label><Sel theme={theme} options={[{value:"",label:"NOT NAMED"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={form.backupHolder||""} onChange={e=>setForm(p=>({...p,backupHolder:e.target.value,status:e.target.value?"Covered":"No backup"}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Status</Label><Sel theme={theme} options={ACCESS_STATUS} value={form.status||"No backup"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div><div><Label theme={theme}>Last Verified</Label><Input theme={theme} type="date" value={form.lastVerified||""} onChange={e=>setForm(p=>({...p,lastVerified:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Recovery route, who to contact, constraints..."/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setAccessRegister(p=>p.filter(x=>x.id!==form.id));db.deleteAccessItem(form.id);log("deleted",form.system,"Business")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const aid=form.id||uid("acc");
            const adata={id:aid,system:form.system||"",category:form.category||"",primaryHolder:form.primaryHolder||"",backupHolder:form.backupHolder||"",status:form.status||"No backup",lastVerified:form.lastVerified||"",notes:form.notes||""};
            if(form.id){setAccessRegister(p=>p.map(x=>x.id===form.id?adata:x));log("updated",adata.system,"Business")}
            else{setAccessRegister(p=>[...p,adata]);log("added",adata.system,"Business")}
            db.saveAccessItem(adata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── OPEN SEAT MODAL ─── */
      case "editOpenSeat": return <Modal theme={theme} title={form.id?"Edit Seat":"Add Seat"} onClose={closeM} width={580}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Seat Title</Label><Input theme={theme} value={form.title||""} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Copy, Comms and Social Media Executive"/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Department</Label><Sel theme={theme} options={NANU_DEPARTMENTS} value={form.department||NANU_DEPARTMENTS[0]} onChange={e=>setForm(p=>({...p,department:e.target.value}))}/></div><div><Label theme={theme}>Function</Label><Input theme={theme} value={form.func||""} onChange={e=>setForm(p=>({...p,func:e.target.value}))} placeholder="e.g. Public Outreach and Community"/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Status</Label><Sel theme={theme} options={SEAT_STATUS} value={form.status||"Open"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div><div><Label theme={theme}>Urgency</Label><Sel theme={theme} options={SEAT_URGENCY} value={form.urgency||"Medium"} onChange={e=>setForm(p=>({...p,urgency:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Honest hours per week</Label><Input theme={theme} type="number" value={form.hoursPerWeek??0} onChange={e=>setForm(p=>({...p,hoursPerWeek:Number(e.target.value)}))}/></div><div><Label theme={theme}>Interim Cover</Label><Sel theme={theme} options={[{value:"",label:"None"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={form.interim||""} onChange={e=>setForm(p=>({...p,interim:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Impact if left open</Label><Textarea theme={theme} value={form.impact||""} onChange={e=>setForm(p=>({...p,impact:e.target.value}))} placeholder="What breaks or stalls without this seat"/></div>
        <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13}}>
          <input type="checkbox" checked={!!form.funded} onChange={e=>setForm(p=>({...p,funded:e.target.checked}))} style={{accentColor:theme.teal,width:15,height:15,cursor:"pointer"}}/>
          Budget agreed for this seat
        </label>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setOpenSeats(p=>p.filter(x=>x.id!==form.id));db.deleteOpenSeat(form.id);log("deleted",form.title,"Business")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const sid=form.id||uid("seat");
            const sdata={id:sid,title:form.title||"",department:form.department||"",func:form.func||"",impact:form.impact||"",interim:form.interim||"",status:form.status||"Open",urgency:form.urgency||"Medium",hoursPerWeek:form.hoursPerWeek||0,funded:!!form.funded,notes:form.notes||""};
            if(form.id){setOpenSeats(p=>p.map(x=>x.id===form.id?sdata:x));log("updated",sdata.title,"Business")}
            else{setOpenSeats(p=>[...p,sdata]);log("added",sdata.title,"Business")}
            db.saveOpenSeat(sdata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── ORG UNIT MODAL ─── */
      case "editOrgUnit": return <Modal theme={theme} title={form.id?"Edit Unit":"Add Unit"} onClose={closeM} width={580}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="nanu-form-row"><div><Label theme={theme}>Layer</Label><Sel theme={theme} options={UNIT_LAYERS} value={form.layer||"Function"} onChange={e=>setForm(p=>({...p,layer:e.target.value}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={UNIT_STATUS} value={form.status||"Active"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Unit Name</Label><Input theme={theme} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. 2.1 Analytics"/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Department</Label><Sel theme={theme} options={NANU_DEPARTMENTS} value={form.department||NANU_DEPARTMENTS[0]} onChange={e=>setForm(p=>({...p,department:e.target.value}))}/></div><div><Label theme={theme}>Reports To</Label><Input theme={theme} value={form.reportsTo||""} onChange={e=>setForm(p=>({...p,reportsTo:e.target.value}))} placeholder="e.g. CMO"/></div></div>
        <div><Label theme={theme}>Holder (team member)</Label><Sel theme={theme} options={[{value:"",label:"Not a hub user / unfilled"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={form.holderUser||""} onChange={e=>setForm(p=>({...p,holderUser:e.target.value}))}/></div>
        <div><Label theme={theme}>Holder (free text)</Label><Input theme={theme} value={form.holderText||""} onChange={e=>setForm(p=>({...p,holderText:e.target.value}))} placeholder="Use when the holder isn't a hub user, e.g. 'Unfilled. Proposed: Ed Crowther.'"/></div>
        <div><Label theme={theme}>Sort Order</Label><Input theme={theme} type="number" value={form.sortOrder??0} onChange={e=>setForm(p=>({...p,sortOrder:Number(e.target.value)}))}/></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setOrgUnits(p=>p.filter(x=>x.id!==form.id));db.deleteOrgUnit(form.id);log("deleted",form.name,"Business")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const oid=form.id||uid("org");
            const odata={id:oid,layer:form.layer||"Function",name:form.name||"",department:form.department||"",holderUser:form.holderUser||"",holderText:form.holderText||"",reportsTo:form.reportsTo||"",status:form.status||"Active",sortOrder:form.sortOrder||0,notes:form.notes||""};
            if(form.id){setOrgUnits(p=>p.map(x=>x.id===form.id?odata:x));log("updated",odata.name,"Business")}
            else{setOrgUnits(p=>[...p,odata]);log("added",odata.name,"Business")}
            db.saveOrgUnit(odata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── RACI MODAL ─── */
      case "editRaciItem": return <Modal theme={theme} title={form.id?"Edit Output":"Add Recurring Output"} onClose={closeM} width={580}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Recurring Output</Label><Input theme={theme} value={form.output||""} onChange={e=>setForm(p=>({...p,output:e.target.value}))} placeholder="e.g. Episode delivery on schedule"/></div>
        <div><Label theme={theme}>Department</Label><Sel theme={theme} options={NANU_DEPARTMENTS} value={form.department||NANU_DEPARTMENTS[0]} onChange={e=>setForm(p=>({...p,department:e.target.value}))}/></div>
        <div>
          <Label theme={theme}>Accountable — answers for it at board level</Label>
          <Sel theme={theme} options={[{value:"",label:"Nobody assigned"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={form.accountable||""} onChange={e=>setForm(p=>({...p,accountable:e.target.value}))}/>
        </div>
        <div><Label theme={theme}>Responsible — does the work</Label><Input theme={theme} value={form.responsible||""} onChange={e=>setForm(p=>({...p,responsible:e.target.value}))} placeholder="Person or function, e.g. Media Production"/></div>
        <div><Label theme={theme}>Consulted — must be asked before it ships</Label><Input theme={theme} value={form.consulted||""} onChange={e=>setForm(p=>({...p,consulted:e.target.value}))} placeholder="e.g. Design, Talent"/></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setRaciItems(p=>p.filter(x=>x.id!==form.id));db.deleteRaciItem(form.id);log("deleted",form.output,"Business")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const rid2=form.id||uid("raci");
            const rdata={id:rid2,output:form.output||"",department:form.department||"",accountable:form.accountable||"",responsible:form.responsible||"",consulted:form.consulted||"",notes:form.notes||""};
            if(form.id){setRaciItems(p=>p.map(x=>x.id===form.id?rdata:x));log("updated",rdata.output,"Business")}
            else{setRaciItems(p=>[...p,rdata]);log("added",rdata.output,"Business")}
            db.saveRaciItem(rdata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── MOC MODAL ─── */
      case "editMocItem": return <Modal theme={theme} title={form.id?"Edit Function":"Add Function"} onClose={closeM} width={600}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Function</Label><Input theme={theme} value={form.func||""} onChange={e=>setForm(p=>({...p,func:e.target.value}))} placeholder="e.g. Graphic Design"/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Department</Label><Sel theme={theme} options={NANU_DEPARTMENTS} value={form.department||NANU_DEPARTMENTS[0]} onChange={e=>setForm(p=>({...p,department:e.target.value}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={MOC_STATUS} value={form.status||"Operating"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Function Head</Label><Sel theme={theme} options={[{value:"",label:"Not a hub user"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={form.headUser||""} onChange={e=>setForm(p=>({...p,headUser:e.target.value}))}/></div><div><Label theme={theme}>Hours/week needed</Label><Input theme={theme} type="number" value={form.hoursNeeded??0} onChange={e=>setForm(p=>({...p,hoursNeeded:Number(e.target.value)}))}/></div></div>
        <div><Label theme={theme}>Head (free text, if not a hub user)</Label><Input theme={theme} value={form.headText||""} onChange={e=>setForm(p=>({...p,headText:e.target.value}))} placeholder="e.g. OPEN. Interim: Matt Staroscik."/></div>
        <div><Label theme={theme}>Minimum Operating Capability</Label><Textarea theme={theme} value={form.minimum||""} onChange={e=>setForm(p=>({...p,minimum:e.target.value}))} placeholder="Smallest team and toolset that sustains baseline daily operations"/></div>
        <div><Label theme={theme}>Current State</Label><Textarea theme={theme} value={form.currentState||""} onChange={e=>setForm(p=>({...p,currentState:e.target.value}))} placeholder="What's actually staffed right now"/></div>
        <div><Label theme={theme}>Gap</Label><Textarea theme={theme} value={form.gap||""} onChange={e=>setForm(p=>({...p,gap:e.target.value}))} placeholder="The difference, stated plainly"/></div>
        <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13}}>
          <input type="checkbox" checked={!!form.confirmed} onChange={e=>setForm(p=>({...p,confirmed:e.target.checked}))} style={{accentColor:theme.teal,width:15,height:15,cursor:"pointer"}}/>
          Department head has returned a firm figure
        </label>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setMocItems(p=>p.filter(x=>x.id!==form.id));db.deleteMocItem(form.id);log("deleted",form.func,"Business")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const mid=form.id||uid("moc");
            const mdata={id:mid,func:form.func||"",department:form.department||"",headUser:form.headUser||"",headText:form.headText||"",minimum:form.minimum||"",currentState:form.currentState||"",gap:form.gap||"",status:form.status||"Operating",hoursNeeded:form.hoursNeeded||0,confirmed:!!form.confirmed,notes:form.notes||""};
            if(form.id){setMocItems(p=>p.map(x=>x.id===form.id?mdata:x));log("updated",mdata.func,"Business")}
            else{setMocItems(p=>[...p,mdata]);log("added",mdata.func,"Business")}
            db.saveMocItem(mdata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── MEDIA PRODUCT MODAL ─── */
      case "editMediaProduct": return <Modal theme={theme} title={form.id?"Edit Product":"New Content Product"} onClose={closeM} width={600}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Name</Label><Input theme={theme} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Today in Mystery"/></div>
        <div><Label theme={theme}>Description</Label><Textarea theme={theme} value={form.description||""} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Format</Label><Sel theme={theme} options={MEDIA_FORMATS} value={form.format||MEDIA_FORMATS[0]} onChange={e=>setForm(p=>({...p,format:e.target.value}))}/></div><div><Label theme={theme}>Cadence</Label><Sel theme={theme} options={MEDIA_CADENCES} value={form.cadence||"Weekly"} onChange={e=>setForm(p=>({...p,cadence:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Showrunner</Label><Sel theme={theme} options={activeUsers.map(u=>({value:u.id,label:u.name}))} value={form.showrunner||""} onChange={e=>setForm(p=>({...p,showrunner:e.target.value}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={["Active","Paused","Archived"]} value={form.status||"Active"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Google Drive folder link</Label><Input theme={theme} value={form.driveUrl||""} onChange={e=>setForm(p=>({...p,driveUrl:e.target.value}))} placeholder="https://drive.google.com/..."/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Episode prefix</Label><Input theme={theme} value={form.episodePrefix||""} onChange={e=>setForm(p=>({...p,episodePrefix:e.target.value}))} placeholder="e.g. TIM"/></div><div><Label theme={theme}>Default owner</Label><Sel theme={theme} options={[{value:"",label:"None"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={form.defaultOwner||""} onChange={e=>setForm(p=>({...p,defaultOwner:e.target.value}))}/></div></div>
        <div>
          <Label theme={theme}>Publishing checklist template</Label>
          <p style={{fontSize:11,color:theme.textMut,margin:"0 0 6px"}}>Applied to every new item for this product.</p>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {(form.checklistTemplate||[]).map((c,i)=>(<div key={i} style={{display:"flex",gap:6}}>
              <Input theme={theme} value={c} onChange={e=>{const cl=[...(form.checklistTemplate||[])];cl[i]=e.target.value;setForm(p=>({...p,checklistTemplate:cl}))}} style={{flex:1}}/>
              <button type="button" onClick={()=>{const cl=[...(form.checklistTemplate||[])];cl.splice(i,1);setForm(p=>({...p,checklistTemplate:cl}))}} style={{background:"none",border:"none",color:theme.red,cursor:"pointer"}}><Trash2 size={13}/></button>
            </div>))}
            <Btn theme={theme} small onClick={()=>setForm(p=>({...p,checklistTemplate:[...(p.checklistTemplate||[]),""]}))}><Plus size={12}/> Add step</Btn>
          </div>
        </div>
        <div className="nanu-form-row"><div><Label theme={theme}>Accent colour</Label><Input theme={theme} value={form.color||"#1FC2C2"} onChange={e=>setForm(p=>({...p,color:e.target.value}))} placeholder="#1FC2C2"/></div><div><Label theme={theme}>Sort order</Label><Input theme={theme} type="number" value={form.sortOrder??0} onChange={e=>setForm(p=>({...p,sortOrder:Number(e.target.value)}))}/></div></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setMediaProducts(p=>p.filter(x=>x.id!==form.id));db.deleteMediaProduct(form.id);log("deleted",form.name,"Media")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const mid=form.id||uid("mp");
            const md={id:mid,name:form.name||"",description:form.description||"",format:form.format||"",cadence:form.cadence||"",showrunner:form.showrunner||"",status:form.status||"Active",driveUrl:form.driveUrl||"",color:form.color||"#1FC2C2",sortOrder:form.sortOrder||0,notes:form.notes||"",episodePrefix:form.episodePrefix||"",defaultOwner:form.defaultOwner||"",checklistTemplate:(form.checklistTemplate||[]).filter(Boolean),publishDay:form.publishDay||""};
            if(form.id){setMediaProducts(p=>p.map(x=>x.id===form.id?md:x));log("updated",md.name,"Media")}
            else{setMediaProducts(p=>[...p,md]);setMediaProduct(mid);log("created",md.name,"Media")}
            db.saveMediaProduct(md);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── MEDIA ITEM MODAL ─── */
      case "editMediaItem": return <Modal theme={theme} title={form.id?"Edit Item":"New Content Item"} onClose={closeM} width={600}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="nanu-form-row"><div><Label theme={theme}>Title</Label><Input theme={theme} value={form.title||""} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></div><div><Label theme={theme}>Episode / Ref</Label><Input theme={theme} value={form.episodeNo||""} onChange={e=>setForm(p=>({...p,episodeNo:e.target.value}))} placeholder="e.g. S1E04"/></div></div>
        <div><Label theme={theme}>Summary</Label><Textarea theme={theme} value={form.summary||""} onChange={e=>setForm(p=>({...p,summary:e.target.value}))}/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Product</Label><Sel theme={theme} options={mediaProducts.map(p=>({value:p.id,label:p.name}))} value={form.productId||""} onChange={e=>setForm(p=>({...p,productId:e.target.value}))}/></div><div><Label theme={theme}>Stage</Label><Sel theme={theme} options={MEDIA_STAGES} value={form.stage||"Idea"} onChange={e=>setForm(p=>({...p,stage:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={[{value:"",label:"Unassigned"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div><div><Label theme={theme}>Blocker</Label><Input theme={theme} value={form.blocker||""} onChange={e=>setForm(p=>({...p,blocker:e.target.value}))} placeholder="What's holding it up"/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Due Date</Label><Input theme={theme} type="date" value={form.dueDate||""} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))}/></div><div><Label theme={theme}>Air / Publish Date</Label><Input theme={theme} type="date" value={form.airDate||""} onChange={e=>setForm(p=>({...p,airDate:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Script link</Label><Input theme={theme} value={form.scriptUrl||""} onChange={e=>setForm(p=>({...p,scriptUrl:e.target.value}))} placeholder="Google Doc URL"/></div>
        <div><Label theme={theme}>Assets folder link</Label><Input theme={theme} value={form.assetsUrl||""} onChange={e=>setForm(p=>({...p,assetsUrl:e.target.value}))} placeholder="Drive folder URL"/></div>
        <div><Label theme={theme}>Final / published link</Label><Input theme={theme} value={form.finalUrl||""} onChange={e=>setForm(p=>({...p,finalUrl:e.target.value}))}/></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>

        {/* Design */}
        <div style={{padding:"12px 14px",background:theme.bgInput,borderRadius:10,border:`1px solid ${theme.border}`}}>
          <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,fontWeight:600}}>
            <input type="checkbox" checked={!!form.needsDesign} onChange={e=>setForm(p=>({...p,needsDesign:e.target.checked,designStatus:e.target.checked?(p.designStatus||"Not started"):""}))} style={{accentColor:theme.teal,width:15,height:15,cursor:"pointer"}}/>
            This item needs design work
          </label>
          {form.needsDesign&&<div style={{marginTop:10}}>
            <Label theme={theme}>Design status</Label>
            <Sel theme={theme} options={DESIGN_STATUS} value={form.designStatus||"Not started"} onChange={e=>setForm(p=>({...p,designStatus:e.target.value}))}/>
            <p style={{fontSize:11,color:theme.textMut,margin:"6px 0 0"}}>Appears in the cross-product Design Queue until marked Ready.</p>
          </div>}
        </div>

        {/* Publishing checklist */}
        <div>
          <Label theme={theme}>Publishing checklist</Label>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {(form.checklist||[]).map((c,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                <input type="checkbox" checked={!!c.done} onChange={()=>{const cl=[...(form.checklist||[])];cl[i]={...cl[i],done:!cl[i].done};setForm(p=>({...p,checklist:cl}))}} style={{accentColor:theme.teal,width:15,height:15,cursor:"pointer",flexShrink:0}}/>
                <Input theme={theme} value={c.label} onChange={e=>{const cl=[...(form.checklist||[])];cl[i]={...cl[i],label:e.target.value};setForm(p=>({...p,checklist:cl}))}} style={{flex:1,textDecoration:c.done?"line-through":"none",opacity:c.done?0.6:1}}/>
                <button type="button" onClick={()=>{const cl=[...(form.checklist||[])];cl.splice(i,1);setForm(p=>({...p,checklist:cl}))}} style={{background:"none",border:"none",color:theme.red,cursor:"pointer"}}><Trash2 size={13}/></button>
              </div>
            ))}
            <div style={{display:"flex",gap:6}}>
              <Btn theme={theme} small onClick={()=>setForm(p=>({...p,checklist:[...(p.checklist||[]),{label:"",done:false}]}))}><Plus size={12}/> Add check</Btn>
              {(form.checklist||[]).length===0&&form.productId&&<Btn theme={theme} small onClick={()=>{const tpl=(mediaProducts.find(p=>p.id===form.productId)?.checklistTemplate)||[];setForm(p=>({...p,checklist:tpl.map(c=>({label:c,done:false}))}))}}>Use product template</Btn>}
            </div>
          </div>
        </div>

        {/* Linked tasks */}
        <div>
          <Label theme={theme}>Linked tasks</Label>
          <Sel theme={theme} options={[{value:"",label:"Link an existing task..."},...tasks.filter(t=>t.status!=="Done"&&!(form.linkedTasks||[]).includes(t.id)).map(t=>({value:t.id,label:t.title}))]} value="" onChange={e=>{if(e.target.value)setForm(p=>({...p,linkedTasks:[...(p.linkedTasks||[]),e.target.value]}))}}/>
          {(form.linkedTasks||[]).length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
            {(form.linkedTasks||[]).map(tid=>{const tk=tasks.find(x=>x.id===tid);return tk?<span key={tid} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,padding:"3px 8px",background:theme.bgInput,borderRadius:6,color:theme.textSec}}>{tk.title}<button type="button" onClick={()=>setForm(p=>({...p,linkedTasks:p.linkedTasks.filter(x=>x!==tid)}))} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer",padding:0}}><X size={11}/></button></span>:null})}
          </div>}
          <Btn theme={theme} small onClick={()=>{const nt={id:uid("t"),title:form.title||"Media task",owners:[form.owner||curUser.id],status:"Not Started",priority:"Medium",dueDate:form.dueDate||form.airDate||"",blocker:"",notes:`From media item: ${form.title||""}`,context:"",contactName:"",contactDetail:"",outcome:"",linkedContent:"",project:"",updates:[],createdBy:curUser.id,createdDate:todayStr};setTasks(prev=>[...prev,nt]);db.saveTask(nt);setForm(p=>({...p,linkedTasks:[...(p.linkedTasks||[]),nt.id]}));log("created",nt.title,"Tasks")}} style={{marginTop:8}}><Plus size={12}/> Create linked task</Btn>
        </div>

        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setMediaItems(p=>p.filter(x=>x.id!==form.id));db.deleteMediaItem(form.id);log("deleted",form.title,"Media")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const iid=form.id||uid("mi");
            const idata={id:iid,productId:form.productId||"",title:form.title||"",stage:form.stage||"Idea",owner:form.owner||"",episodeNo:form.episodeNo||"",summary:form.summary||"",dueDate:form.dueDate||"",airDate:form.airDate||"",scriptUrl:form.scriptUrl||"",assetsUrl:form.assetsUrl||"",finalUrl:form.finalUrl||"",blocker:form.blocker||"",notes:form.notes||"",needsDesign:!!form.needsDesign,designStatus:form.designStatus||"",stageSince:form.stageSince||todayStr,checklist:form.checklist||[],linkedTasks:form.linkedTasks||[]};
            if(form.id){setMediaItems(p=>p.map(x=>x.id===form.id?idata:x));log("updated",idata.title,"Media")}
            else{setMediaItems(p=>[...p,idata]);log("created",idata.title,"Media")}
            db.saveMediaItem(idata);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── MEDIA ROLE MODAL ─── */
      case "editMediaRole": return <Modal theme={theme} title={form.id?"Edit Role":"New Role"} onClose={closeM} width={560}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="nanu-form-row"><div><Label theme={theme}>Product</Label><Sel theme={theme} options={mediaProducts.map(p=>({value:p.id,label:p.name}))} value={form.productId||""} onChange={e=>setForm(p=>({...p,productId:e.target.value}))}/></div><div><Label theme={theme}>Function</Label><Sel theme={theme} options={MEDIA_FUNCTIONS} value={form.function||MEDIA_FUNCTIONS[0]} onChange={e=>setForm(p=>({...p,function:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Owner</Label><Sel theme={theme} options={[{value:"",label:"Not a hub user / unassigned"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={form.holderUser||""} onChange={e=>setForm(p=>({...p,holderUser:e.target.value}))}/></div>
        <div><Label theme={theme}>Owner (free text)</Label><Input theme={theme} value={form.holderText||""} onChange={e=>setForm(p=>({...p,holderText:e.target.value}))} placeholder="Use for contractors or 'Unassigned'"/></div>
        <div><Label theme={theme}>Backup</Label><Sel theme={theme} options={[{value:"",label:"None"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={form.backupUser||""} onChange={e=>setForm(p=>({...p,backupUser:e.target.value}))}/></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setMediaRoles(p=>p.filter(x=>x.id!==form.id));db.deleteMediaRole(form.id);log("deleted",form.function,"Media")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const rid3=form.id||uid("mr");
            const rd={id:rid3,productId:form.productId||"",function:form.function||"",holderUser:form.holderUser||"",holderText:form.holderText||"",backupUser:form.backupUser||"",notes:form.notes||""};
            if(form.id){setMediaRoles(p=>p.map(x=>x.id===form.id?rd:x));log("updated",rd.function,"Media")}
            else{setMediaRoles(p=>[...p,rd]);log("created",rd.function,"Media")}
            db.saveMediaRole(rd);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── MEDIA IDEA MODAL ─── */
      case "editMediaIdea": return <Modal theme={theme} title={form.id?"Edit Idea":"Submit an Idea"} onClose={closeM} width={560}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Idea</Label><Input theme={theme} value={form.title||""} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="One line — what's the idea?"/></div>
        <div><Label theme={theme}>Detail</Label><Textarea theme={theme} value={form.description||""} onChange={e=>setForm(p=>({...p,description:e.target.value}))} placeholder="Why it works, any source material, who'd front it..."/></div>
        <div><Label theme={theme}>Product (optional)</Label><Sel theme={theme} options={[{value:"",label:"Any / not sure"},...mediaProducts.map(p=>({value:p.id,label:p.name}))]} value={form.productId||""} onChange={e=>setForm(p=>({...p,productId:e.target.value}))}/></div>
        {form.id&&<div className="nanu-form-row"><div><Label theme={theme}>Status</Label><Sel theme={theme} options={IDEA_STATUS} value={form.status||"New"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div><div><Label theme={theme}>Submitted</Label><Input theme={theme} type="date" value={form.submittedDate||""} onChange={e=>setForm(p=>({...p,submittedDate:e.target.value}))}/></div></div>}
        {form.id&&<div><Label theme={theme}>Media team response</Label><Textarea theme={theme} value={form.response||""} onChange={e=>setForm(p=>({...p,response:e.target.value}))} placeholder="Visible to whoever submitted it"/></div>}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setMediaIdeas(p=>p.filter(x=>x.id!==form.id));db.deleteMediaIdea(form.id);log("deleted",form.title,"Media")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const iid2=form.id||uid("mid");
            const idd={id:iid2,title:form.title||"",description:form.description||"",productId:form.productId||"",submittedBy:form.submittedBy||curUser.id,submittedDate:form.submittedDate||todayStr,status:form.status||"New",votes:form.votes||[],response:form.response||""};
            if(form.id){setMediaIdeas(p=>p.map(x=>x.id===form.id?idd:x));log("updated",idd.title,"Media")}
            else{setMediaIdeas(p=>[...p,idd]);log("submitted idea",idd.title,"Media")}
            db.saveMediaIdea(idd);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── MEDIA FEEDBACK MODAL ─── */
      case "editMediaFeedback": return <Modal theme={theme} title={form.id?"Edit Feedback":"Give Feedback"} onClose={closeM} width={560}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Subject</Label><Input theme={theme} value={form.subject||""} onChange={e=>setForm(p=>({...p,subject:e.target.value}))}/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Type</Label><Sel theme={theme} options={MFEEDBACK_TYPES} value={form.type||"Suggestion"} onChange={e=>setForm(p=>({...p,type:e.target.value}))}/></div><div><Label theme={theme}>Product</Label><Sel theme={theme} options={[{value:"",label:"General"},...mediaProducts.map(p=>({value:p.id,label:p.name}))]} value={form.productId||""} onChange={e=>setForm(p=>({...p,productId:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Feedback</Label><Textarea theme={theme} value={form.body||""} onChange={e=>setForm(p=>({...p,body:e.target.value}))} placeholder="Be specific — what worked, what didn't, what you'd try"/></div>
        {form.id&&<div className="nanu-form-row"><div><Label theme={theme}>Status</Label><Sel theme={theme} options={MFEEDBACK_STATUS} value={form.status||"New"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div><div><Label theme={theme}>Date</Label><Input theme={theme} type="date" value={form.submittedDate||""} onChange={e=>setForm(p=>({...p,submittedDate:e.target.value}))}/></div></div>}
        {form.id&&<div><Label theme={theme}>Response</Label><Textarea theme={theme} value={form.response||""} onChange={e=>setForm(p=>({...p,response:e.target.value}))}/></div>}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setMediaFeedbackList(p=>p.filter(x=>x.id!==form.id));db.deleteMediaFeedback(form.id);log("deleted",form.subject,"Media")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const fid2=form.id||uid("mfb");
            const fd={id:fid2,subject:form.subject||"",body:form.body||"",type:form.type||"Suggestion",productId:form.productId||"",submittedBy:form.submittedBy||curUser.id,submittedDate:form.submittedDate||todayStr,status:form.status||"New",response:form.response||""};
            if(form.id){setMediaFeedbackList(p=>p.map(x=>x.id===form.id?fd:x));log("updated",fd.subject,"Media")}
            else{setMediaFeedbackList(p=>[...p,fd]);log("gave feedback",fd.subject,"Media")}
            db.saveMediaFeedback(fd);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── MEDIA TOOL MODAL ─── */
      case "editMediaTool": return <Modal theme={theme} title={form.id?"Edit Tool":"Add Tool"} onClose={closeM} width={560}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="nanu-form-row"><div><Label theme={theme}>Name</Label><Input theme={theme} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div><div><Label theme={theme}>Category</Label><Sel theme={theme} options={TOOL_CATEGORIES} value={form.category||TOOL_CATEGORIES[0]} onChange={e=>setForm(p=>({...p,category:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Purpose</Label><Input theme={theme} value={form.purpose||""} onChange={e=>setForm(p=>({...p,purpose:e.target.value}))} placeholder="What we use it for"/></div>
        <div><Label theme={theme}>URL</Label><Input theme={theme} value={form.url||""} onChange={e=>setForm(p=>({...p,url:e.target.value}))}/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Access held by</Label><Sel theme={theme} options={[{value:"",label:"Nobody named"},...activeUsers.map(u=>({value:u.id,label:u.name}))]} value={form.accessHolder||""} onChange={e=>setForm(p=>({...p,accessHolder:e.target.value}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={TOOL_STATUS} value={form.status||"In use"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Who has shared access</Label><Input theme={theme} value={form.sharedAccess||""} onChange={e=>setForm(p=>({...p,sharedAccess:e.target.value}))} placeholder="e.g. Media team, or the shared account address"/></div>
        <div><Label theme={theme}>Cost</Label><Input theme={theme} value={form.cost||""} onChange={e=>setForm(p=>({...p,cost:e.target.value}))} placeholder="e.g. £20/mo"/></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setMediaTools(p=>p.filter(x=>x.id!==form.id));db.deleteMediaTool(form.id);log("deleted",form.name,"Media")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const tid=form.id||uid("mt");
            const td={id:tid,name:form.name||"",category:form.category||"",purpose:form.purpose||"",url:form.url||"",accessHolder:form.accessHolder||"",sharedAccess:form.sharedAccess||"",cost:form.cost||"",status:form.status||"In use",notes:form.notes||""};
            if(form.id){setMediaTools(p=>p.map(x=>x.id===form.id?td:x));log("updated",td.name,"Media")}
            else{setMediaTools(p=>[...p,td]);log("added",td.name,"Media")}
            db.saveMediaTool(td);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── MEDIA FOLDER MODAL ─── */
      case "editMediaFolder": return <Modal theme={theme} title={form.id?"Edit Folder":"Add Drive Folder"} onClose={closeM} width={560}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div><Label theme={theme}>Folder name</Label><Input theme={theme} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
        <div><Label theme={theme}>Product (leave blank for shared)</Label><Sel theme={theme} options={[{value:"",label:"Shared / all products"},...mediaProducts.map(p=>({value:p.id,label:p.name}))]} value={form.productId||""} onChange={e=>setForm(p=>({...p,productId:e.target.value}))}/></div>
        <div><Label theme={theme}>Google Drive link</Label><Input theme={theme} value={form.url||""} onChange={e=>setForm(p=>({...p,url:e.target.value}))} placeholder="https://drive.google.com/..."/></div>
        <div><Label theme={theme}>Purpose</Label><Input theme={theme} value={form.purpose||""} onChange={e=>setForm(p=>({...p,purpose:e.target.value}))} placeholder="What belongs in here"/></div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setMediaFolders(p=>p.filter(x=>x.id!==form.id));db.deleteMediaFolder(form.id);log("deleted",form.name,"Media")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const fdid=form.id||uid("mf");
            const fdd={id:fdid,name:form.name||"",productId:form.productId||"",url:form.url||"",purpose:form.purpose||"",notes:form.notes||""};
            if(form.id){setMediaFolders(p=>p.map(x=>x.id===form.id?fdd:x));log("updated",fdd.name,"Media")}
            else{setMediaFolders(p=>[...p,fdd]);log("added",fdd.name,"Media")}
            db.saveMediaFolder(fdd);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── MEDIA GUEST MODAL ─── */
      case "editMediaGuest": return <Modal theme={theme} title={form.id?"Edit Guest":"Add Guest"} onClose={closeM} width={580}><div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div className="nanu-form-row"><div><Label theme={theme}>Name</Label><Input theme={theme} value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div><div><Label theme={theme}>Status</Label><Sel theme={theme} options={GUEST_STATUS} value={form.status||"Approached"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Bio / who they are</Label><Input theme={theme} value={form.bio||""} onChange={e=>setForm(p=>({...p,bio:e.target.value}))} placeholder="One line — enough for whoever books them"/></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Email</Label><Input theme={theme} value={form.email||""} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/></div><div><Label theme={theme}>Phone</Label><Input theme={theme} value={form.phone||""} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/></div></div>
        <div className="nanu-form-row"><div><Label theme={theme}>Product</Label><Sel theme={theme} options={[{value:"",label:"Not set"},...mediaProducts.map(p=>({value:p.id,label:p.name}))]} value={form.productId||""} onChange={e=>setForm(p=>({...p,productId:e.target.value}))}/></div><div><Label theme={theme}>Recorded date</Label><Input theme={theme} type="date" value={form.recordedDate||""} onChange={e=>setForm(p=>({...p,recordedDate:e.target.value}))}/></div></div>
        <div><Label theme={theme}>Episode</Label><Sel theme={theme} options={[{value:"",label:"Not linked"},...mediaItems.filter(i=>!form.productId||i.productId===form.productId).map(i=>({value:i.id,label:i.title||"Untitled"}))]} value={form.itemId||""} onChange={e=>setForm(p=>({...p,itemId:e.target.value}))}/></div>
        <div style={{padding:"12px 14px",background:form.releaseSigned?`${theme.green}0d`:`${theme.red}0d`,borderRadius:10,border:`1px solid ${form.releaseSigned?theme.green:theme.red}40`}}>
          <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,fontWeight:600}}>
            <input type="checkbox" checked={!!form.releaseSigned} onChange={e=>setForm(p=>({...p,releaseSigned:e.target.checked}))} style={{accentColor:theme.green,width:15,height:15,cursor:"pointer"}}/>
            Signed release / consent form on file
          </label>
          <div style={{marginTop:8}}><Input theme={theme} value={form.releaseUrl||""} onChange={e=>setForm(p=>({...p,releaseUrl:e.target.value}))} placeholder="Link to the signed form in Drive"/></div>
          {!form.releaseSigned&&<p style={{fontSize:11,color:theme.red,margin:"8px 0 0",lineHeight:1.5}}>Without a signed release we shouldn't publish this recording.</p>}
        </div>
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
          {form.id&&<Btn theme={theme} danger onClick={()=>doSave(()=>{setMediaGuests(p=>p.filter(x=>x.id!==form.id));db.deleteMediaGuest(form.id);log("deleted",form.name,"Media")})}><Trash2 size={13}/> Delete</Btn>}
          <Btn theme={theme} onClick={closeM}>Cancel</Btn>
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            const gid=form.id||uid("mg");
            const gd={id:gid,name:form.name||"",email:form.email||"",phone:form.phone||"",productId:form.productId||"",itemId:form.itemId||"",bio:form.bio||"",recordedDate:form.recordedDate||"",releaseSigned:!!form.releaseSigned,releaseUrl:form.releaseUrl||"",status:form.status||"Approached",notes:form.notes||""};
            if(form.id){setMediaGuests(p=>p.map(x=>x.id===form.id?gd:x));log("updated",gd.name,"Media")}
            else{setMediaGuests(p=>[...p,gd]);log("added guest",gd.name,"Media")}
            db.saveMediaGuest(gd);
          })}>Done</Btn>
        </div>
      </div></Modal>;

      /* ─── BULK EPISODE GENERATOR ─── */
      case "bulkEpisodes": {
        const prod = mediaProducts.find(p=>p.id===form.productId);
        const stepDays = { Daily:1, Weekly:7, Fortnightly:14, Monthly:30 }[prod?.cadence] || 7;
        const preview = Array.from({length:Math.min(form.count||0,30)},(_,i)=>{
          const d=new Date(form.startDate+"T00:00:00"); d.setDate(d.getDate()+i*stepDays);
          return { no:`${prod?.episodePrefix||"EP"}${(Number(form.startNumber||1)+i)}`, date:d.toISOString().split("T")[0] };
        });
        return <Modal theme={theme} title="Generate episode slots" onClose={closeM} width={560}><div style={{display:"flex",flexDirection:"column",gap:14}}>
          <p style={{fontSize:13,color:theme.textSec,margin:0,lineHeight:1.6}}>Creates empty placeholders for <strong>{prod?.name}</strong> at its {prod?.cadence?.toLowerCase()} cadence, each with the product's checklist. Titles are left blank for you to fill in.</p>
          <div className="nanu-form-row"><div><Label theme={theme}>How many</Label><Input theme={theme} type="number" value={form.count??5} onChange={e=>setForm(p=>({...p,count:Math.max(0,Math.min(30,Number(e.target.value)))}))}/></div><div><Label theme={theme}>First air date</Label><Input theme={theme} type="date" value={form.startDate||""} onChange={e=>setForm(p=>({...p,startDate:e.target.value}))}/></div></div>
          <div><Label theme={theme}>Starting episode number</Label><Input theme={theme} type="number" value={form.startNumber??1} onChange={e=>setForm(p=>({...p,startNumber:Number(e.target.value)}))}/></div>
          <div>
            <Label theme={theme}>Preview</Label>
            <div style={{maxHeight:180,overflow:"auto",background:theme.bgInput,borderRadius:8,padding:10}}>
              {preview.map((p,i)=>(<div key={i} style={{display:"flex",gap:10,fontSize:12,padding:"2px 0"}}>
                <span style={{fontFamily:FONT_MONO,color:theme.teal,minWidth:70}}>{p.no}</span>
                <span style={{color:theme.textSec,fontFamily:FONT_MONO}}>{p.date}</span>
              </div>))}
              {preview.length===0&&<span style={{fontSize:12,color:theme.textMut}}>Nothing to create.</span>}
            </div>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
            <Btn theme={theme} onClick={closeM}>Cancel</Btn>
            <Btn primary theme={theme} disabled={preview.length===0} onClick={()=>doSave(()=>{
              const created=preview.map(p=>({id:uid("mi"),productId:form.productId,title:"",stage:"Idea",owner:prod?.defaultOwner||"",episodeNo:p.no,summary:"",dueDate:"",airDate:p.date,scriptUrl:"",assetsUrl:"",finalUrl:"",blocker:"",notes:"",needsDesign:false,designStatus:"",stageSince:todayStr,checklist:(prod?.checklistTemplate||[]).map(c=>({label:c,done:false})),linkedTasks:[]}));
              setMediaItems(prev=>[...prev,...created]);
              created.forEach(c=>db.saveMediaItem(c));
              log("generated",`${created.length} slots for ${prod?.name}`,"Media");
            })}><Repeat size={13}/> Create {preview.length}</Btn>
          </div>
        </div></Modal>;
      }

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
          <Btn primary theme={theme} onClick={()=>doSave(()=>{
            setUsers(p=>p.map(u=>u.id===curUser.id?{...u,socials:form.socials||{}}:u));db.saveUser({...curUser,socials:form.socials||{}});
            log("updated","My Socials","Team");
            })}>Done</Btn>
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
            {sidebar&&<div className="nanu-sidebar-header-text"><div style={{fontFamily:FONT_DISPLAY,fontSize:13,fontWeight:700,color:theme.teal}}>NANU</div><div style={{fontSize:11,color:theme.textMut}}>Team Hub</div></div>}
          </div>
        </div>
        <nav style={{flex:1,padding:"10px 6px",overflow:"auto"}}>

          {/* ── PINNED: MY SPACE ── */}
          <button onClick={()=>setSection("workspace")}
            style={{display:"flex",alignItems:"center",gap:11,width:"100%",padding:sidebar?"11px 12px":"11px 0",borderRadius:10,border:`1px solid ${section==="workspace"?theme.teal:theme.border}`,cursor:"pointer",marginBottom:12,background:section==="workspace"?`${theme.teal}18`:theme.bgInput,color:section==="workspace"?theme.teal:theme.textSec,fontFamily:FONT_BODY,fontWeight:600,fontSize:14,transition:"all .15s",justifyContent:sidebar?"flex-start":"center"}}>
            <BookOpen size={18}/>
            {sidebar&&<span className="nanu-sidebar-label">My Space</span>}
            {sidebar&&(()=>{const due=responsibilities.filter(r=>r.owner===curUser.id&&r.status==="Active"&&respIsDue(r)).length;
              return due>0?<span style={{marginLeft:"auto",background:theme.orange,color:"#0D1B21",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:700}}>{due}</span>:null;})()}
          </button>

          {/* ── CUSTOMISE BAR ── */}
          {sidebar&&navEdit&&<div style={{padding:"8px 10px",marginBottom:10,background:`${theme.teal}0d`,border:`1px solid ${theme.teal}40`,borderRadius:8}}>
            <div style={{fontSize:11,color:theme.teal,fontWeight:700,marginBottom:4}}>Customising your menu</div>
            <div style={{fontSize:10,color:theme.textMut,lineHeight:1.5,marginBottom:6}}>Hide what you don't use and reorder the rest. Only affects your view.</div>
            <div style={{display:"flex",gap:6}}>
              <button type="button" onClick={()=>setNavEdit(false)} style={{flex:1,background:theme.teal,border:"none",borderRadius:6,padding:"5px 8px",cursor:"pointer",color:"#0D1B21",fontSize:11,fontWeight:700}}>Done</button>
              <button type="button" onClick={resetNav} style={{background:"transparent",border:`1px solid ${theme.border}`,borderRadius:6,padding:"5px 8px",cursor:"pointer",color:theme.textMut,fontSize:11,fontWeight:600}}>Reset</button>
            </div>
          </div>}

          {orderedGroups.map((group,gi)=>{
            const isCollapsed = collapsedGroups[group.id];
            const visibleItems = navEdit ? group.items : group.items.filter(n=>!isNavHidden(n.key));
            if (!navEdit && visibleItems.length === 0) return null;
            return <div key={group.id} style={{marginBottom:8}}>
              {sidebar && <div style={{display:"flex",alignItems:"center",gap:2}}>
                <button type="button" onClick={()=>setCollapsedGroups(p=>({...p,[group.id]:!p[group.id]}))} style={{display:"flex",alignItems:"center",gap:6,flex:1,padding:"6px 12px",border:"none",background:"transparent",cursor:"pointer",fontSize:10,fontWeight:700,color:theme.textMut,textTransform:"uppercase",letterSpacing:".08em",justifyContent:"space-between"}}>
                  <span>{group.label}</span>
                  {!navEdit&&<ChevronRight size={11} style={{transform:isCollapsed?"none":"rotate(90deg)",transition:"transform .15s"}}/>}
                </button>
                {navEdit&&<>
                  <button type="button" title="Move group up" onClick={()=>moveNavGroup(group.id,-1)} disabled={gi===0} style={{background:"none",border:"none",cursor:gi===0?"not-allowed":"pointer",color:theme.textMut,opacity:gi===0?0.25:1,padding:"2px"}}><ArrowUp size={11}/></button>
                  <button type="button" title="Move group down" onClick={()=>moveNavGroup(group.id,1)} disabled={gi===orderedGroups.length-1} style={{background:"none",border:"none",cursor:gi===orderedGroups.length-1?"not-allowed":"pointer",color:theme.textMut,opacity:gi===orderedGroups.length-1?0.25:1,padding:"2px 6px 2px 2px"}}><ArrowDown size={11}/></button>
                </>}
              </div>}
              {(!sidebar || !isCollapsed || navEdit) && visibleItems.map((n,ii)=>{
                const hidden = isNavHidden(n.key);
                return <div key={n.key} style={{display:"flex",alignItems:"center",gap:2}}>
                  <button onClick={()=>navEdit?toggleNavItem(n.key):setSection(n.key)}
                    style={{display:"flex",alignItems:"center",gap:11,flex:1,minWidth:0,padding:sidebar?"9px 12px":"9px 0",borderRadius:8,border:"none",cursor:"pointer",marginBottom:1,background:section===n.key&&!navEdit?`${theme.teal}12`:"transparent",color:hidden?theme.textMut:(section===n.key&&!navEdit?theme.teal:theme.textSec),opacity:hidden?0.4:1,fontFamily:FONT_BODY,fontWeight:500,fontSize:14,transition:"all .15s",justifyContent:sidebar?"flex-start":"center",textDecoration:hidden?"line-through":"none"}}>
                    {n.icon}
                    {sidebar&&<span className="nanu-sidebar-label" style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.label}</span>}
                    {!navEdit&&n.key==="tasks"&&overdue>0&&<span style={{marginLeft:"auto",background:theme.red,color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:700}}>{overdue}</span>}
                  </button>
                  {sidebar&&navEdit&&<>
                    <button type="button" title={hidden?"Show":"Hide"} onClick={()=>toggleNavItem(n.key)} style={{background:"none",border:"none",cursor:"pointer",color:hidden?theme.textMut:theme.teal,padding:"2px"}}>{hidden?<EyeOff size={12}/>:<Eye size={12}/>}</button>
                    <button type="button" title="Move up" onClick={()=>moveNavItem(group.id,n.key,-1)} disabled={ii===0} style={{background:"none",border:"none",cursor:ii===0?"not-allowed":"pointer",color:theme.textMut,opacity:ii===0?0.25:1,padding:"2px"}}><ArrowUp size={11}/></button>
                    <button type="button" title="Move down" onClick={()=>moveNavItem(group.id,n.key,1)} disabled={ii===visibleItems.length-1} style={{background:"none",border:"none",cursor:ii===visibleItems.length-1?"not-allowed":"pointer",color:theme.textMut,opacity:ii===visibleItems.length-1?0.25:1,padding:"2px 6px 2px 2px"}}><ArrowDown size={11}/></button>
                  </>}
                </div>;
              })}
            </div>;
          })}

          {/* ── CUSTOMISE ENTRY POINT ── */}
          {sidebar&&!navEdit&&<button type="button" onClick={()=>setNavEdit(true)}
            style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 12px",marginTop:6,borderRadius:8,border:`1px dashed ${theme.border}`,background:"transparent",cursor:"pointer",color:theme.textMut,fontSize:11,fontWeight:600}}>
            <Settings size={12}/> Customise menu
            {navHidden.length>0&&<span style={{marginLeft:"auto",fontSize:10,opacity:0.7}}>{navHidden.length} hidden</span>}
          </button>}
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
          <div><span style={{fontWeight:600,fontSize:15}}>Welcome back, {curUser.name.split(" ")[0]}</span><span style={{fontSize:13,color:theme.textMut,marginLeft:12}}>{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {overdue>0&&<Badge label={`${overdue} overdue`} color={theme.red}/>}
            {approvals.length>0&&<Badge label={`${approvals.length} approvals`} color={theme.yellow}/>}
            {/* Notification Bell */}
            <div style={{position:"relative"}}>
              <button type="button" onClick={()=>{setShowNotifPanel(p=>!p);refreshNotifications()}} style={{background:"none",border:"none",cursor:"pointer",color:theme.textMut,position:"relative",padding:4}}>
                <Bell size={18}/>
                {notifications.filter(n=>!n.read).length>0&&<span style={{position:"absolute",top:0,right:0,width:8,height:8,borderRadius:"50%",background:theme.red}}/>}
              </button>
              {/* Notification Panel */}
              {showNotifPanel&&<div className="nanu-notif-panel" style={{position:"absolute",top:"100%",right:0,marginTop:8,width:380,maxHeight:480,background:theme.bgCard,border:`1px solid ${theme.border}`,borderRadius:12,boxShadow:theme.shadowLg,overflow:"hidden",zIndex:200}}>
                <div style={{padding:"14px 16px",borderBottom:`1px solid ${theme.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:15}}>Notifications</span>
                  <div style={{display:"flex",gap:8}}>
                    {notifications.filter(n=>!n.read).length>0&&<button type="button" onClick={()=>{setNotifications(p=>p.map(n=>({...n,read:true})));notifications.forEach(n=>{if(!n.read)db.markNotifRead(n.id)})}} style={{background:"none",border:"none",color:theme.teal,cursor:"pointer",fontSize:11,fontWeight:600}}>Mark all read</button>}
                    <button type="button" onClick={()=>{setSection("settings");setShowNotifPanel(false)}} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer"}}><Settings size={14}/></button>
                  </div>
                </div>
                <div style={{maxHeight:400,overflow:"auto"}}>
                  {notifications.length===0&&<p style={{padding:20,textAlign:"center",fontSize:13,color:theme.textMut}}>No notifications yet</p>}
                  {notifications.slice(0,30).map(n=>(
                    <div key={n.id} onClick={()=>{if(!n.read){setNotifications(p=>p.map(x=>x.id===n.id?{...x,read:true}:x));db.markNotifRead(n.id)}if(n.link){setSection(n.link);setShowNotifPanel(false)}}} style={{padding:"12px 16px",borderBottom:`1px solid ${theme.border}`,cursor:"pointer",background:n.read?"transparent":`${theme.teal}08`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                        <div>
                          <div style={{fontSize:13,fontWeight:n.read?400:600,color:theme.text}}>{n.title}</div>
                          <div style={{fontSize:12,color:theme.textMut,marginTop:2}}>{n.body}</div>
                        </div>
                        {!n.read&&<div style={{width:6,height:6,borderRadius:"50%",background:theme.teal,flexShrink:0,marginTop:6}}/>}
                      </div>
                      <div style={{fontSize:10,color:theme.textMut,fontFamily:FONT_MONO,marginTop:4}}>{new Date(n.time).toLocaleDateString("en-GB")} {new Date(n.time).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</div>
                    </div>
                  ))}
                </div>
              </div>}
            </div>
            <Badge label={curUser.role} color={ROLE_COLORS[curUser.role]||theme.teal}/>
          </div>
        </div>
        <div className="nanu-main-pad">{renderSection()}</div>
      </div>
      {renderModal()}

    </div>
  );
}
