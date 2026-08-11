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
  Share2, FileEdit, CircleDot, BookOpen, MessageCircle, AtSign,
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
    const u = users.find(x => x.username.toLowerCase() === username.toLowerCase().trim() && x.pin === pin);
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
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [calView, setCalView] = useState("month");
  const [calMonth, setCalMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [calEventFilter, setCalEventFilter] = useState("All");
  const [calPersonFilter, setCalPersonFilter] = useState("mine");
  const [taskView, setTaskView] = useState("mine");
  const [masterGroupBy, setMasterGroupBy] = useState("member");
  const [bulkSelected, setBulkSelected] = useState([]);
  const [bulkReassignTo, setBulkReassignTo] = useState("");
  const [tfProject, setTfProject] = useState("All");
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
  const [chatChannel, setChatChannel] = useState("general");
  const [chatMessages, setChatMessages] = useState({});
  const [chatInput, setChatInput] = useState("");
  const [chatBubble, setChatBubble] = useState(false);
  const [chatBubbleChannel, setChatBubbleChannel] = useState("general");
  const [showMentions, setShowMentions] = useState(false);
  const [showLinkPicker, setShowLinkPicker] = useState(false);
  const [chatLastRead, setChatLastRead] = useState({});
  const [replyTo, setReplyTo] = useState(null);
  const [chatMobileSidebar, setChatMobileSidebar] = useState(false);
  const [pallyyKey, setPallyyKey] = useState(0);
  const [copiedField, setCopiedField] = useState(null);
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
  const chatEndRef = useRef(null);
  const chatInputRef = useRef(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [dbError, setDbError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    taskAssigned: true,
    taskUpdated: true,
    taskDue: true,
    projectUpdated: true,
    weeklyRecap: true,
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
      setActivity(data.activity);
      // If users table is empty, this is a fresh DB — seed it
      if (!data.users.length) {
        console.log("Empty database detected — seeding with defaults");
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
    db.loadChatMessages().then(m => { if (m) setChatMessages(m); });
    db.loadChatLastRead(curUser.id).then(lr => { if (lr) setChatLastRead(lr); });
  }, [curUser]);

  // Chat auto-refresh — 3 seconds for snappy feel
  useEffect(() => {
    if (!curUser) return;
    const i = setInterval(() => db.loadChatMessages().then(m => { if (m) setChatMessages(m); }), 3000);
    return () => clearInterval(i);
  }, [curUser]);

  // Mark the active channel as read — on switch AND as new messages arrive while viewing it.
  // Only marks read while the user is actually on the chat section (not just has it selected).
  useEffect(() => {
    if (!curUser || !chatChannel || section !== "chat") return;
    const latest = (chatMessages[chatChannel] || []).reduce((max, m) => m.time > max ? m.time : max, "");
    const now = new Date().toISOString();
    const stamp = latest && latest > now ? latest : now;
    setChatLastRead(prev => {
      if (prev[chatChannel] === stamp) return prev; // no change, avoid loop
      const next = { ...prev, [chatChannel]: stamp };
      db.saveChatLastRead(curUser.id, next);
      return next;
    });
  }, [chatChannel, curUser, section, chatMessages]);

  // Also mark the bubble's channel read while the bubble is open
  useEffect(() => {
    if (!curUser || !chatBubble || !chatBubbleChannel) return;
    const now = new Date().toISOString();
    setChatLastRead(prev => {
      if (prev[chatBubbleChannel] === now) return prev;
      const next = { ...prev, [chatBubbleChannel]: now };
      db.saveChatLastRead(curUser.id, next);
      return next;
    });
  }, [chatBubbleChannel, chatBubble, curUser, chatMessages]);

  // Chat channels definition
  const CHAT_CHANNELS = [
    { id: "general", label: "General", icon: "💬", desc: "Team-wide updates and conversation" },
    { id: "content", label: "Content", icon: "📝", desc: "Content planning, captions, and scheduling" },
    { id: "outreach", label: "Outreach", icon: "📣", desc: "Partnerships, podcasts, and collaborations" },
    { id: "dev", label: "Dev & Product", icon: "⚙️", desc: "Development, features, and product decisions" },
  ];

  const getDmKey = (otherUserId) => {
    if (!curUser) return "dm_none";
    const ids = [curUser.id, otherUserId].sort();
    return `dm_${ids[0]}_${ids[1]}`;
  };

  const getChannelMessages = (channelId) => (chatMessages[channelId] || []);

  // Unread count for a channel
  const getUnreadCount = (channelId) => {
    if (!curUser) return 0;
    const lastRead = chatLastRead[channelId];
    if (!lastRead) return (chatMessages[channelId] || []).length;
    return (chatMessages[channelId] || []).filter(m => m.time > lastRead && m.author !== curUser.id).length;
  };

  const totalUnread = [...CHAT_CHANNELS.map(c => getUnreadCount(c.id)), ...users.filter(u => u.id !== curUser?.id).map(u => getUnreadCount(getDmKey(u.id)))].reduce((a, b) => a + b, 0);

  // Date separator helper
  const getDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  };

  // Send message
  const sendChat = (channelId, text) => {
    if (!text.trim() || !curUser) return;
    const msg = {
      id: uid("msg"),
      author: curUser.id,
      text: text.trim(),
      time: new Date().toISOString(),
      mentions: [...(text.match(/@(\w+)/g) || [])].map(m => {
        const name = m.slice(1).toLowerCase();
        return users.find(u => u.name.toLowerCase().includes(name) || u.username.toLowerCase() === name)?.id;
      }).filter(Boolean),
      linkedEntity: null,
      replyTo: replyTo ? { id: replyTo.id, author: replyTo.author, text: (replyTo.text || "").slice(0, 60) } : null,
    };
    setChatMessages(prev => {
      const next = { ...prev, [channelId]: [...(prev[channelId] || []), msg] };
      db.saveChatMessages(next);
      return next;
    });
    msg.mentions.forEach(uid2 => {
      if (uid2 !== curUser.id) {
        const chLabel = CHAT_CHANNELS.find(c => c.id === channelId)?.label || channelId;
        notify(uid2, "task_updated", `${curUser.name} mentioned you in #${chLabel}`, text.slice(0, 80), "chat");
      }
    });
    setChatInput("");
    setReplyTo(null);
    setShowMentions(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const sendChatWithLink = (channelId, text, entityType, entityId, entityName) => {
    if (!text.trim() && !entityName) return;
    const msg = {
      id: uid("msg"), author: curUser.id, text: text.trim(), time: new Date().toISOString(),
      mentions: [], linkedEntity: { type: entityType, id: entityId, name: entityName }, replyTo: null,
    };
    setChatMessages(prev => {
      const next = { ...prev, [channelId]: [...(prev[channelId] || []), msg] };
      db.saveChatMessages(next);
      return next;
    });
    setChatInput("");
    setShowLinkPicker(false);
  };

  // Handle @mention detection in input
  const handleChatInputChange = (e) => {
    setChatInput(e.target.value);
    const match = e.target.value.match(/@(\w*)$/);
    setShowMentions(!!match);
  };

  const insertMention = (username) => {
    setChatInput(prev => prev.replace(/@\w*$/, `@${username} `));
    setShowMentions(false);
    chatInputRef.current?.focus();
  };

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
    "Admin": "Leadership",
    "Executive": "Leadership",
    "Marketing Lead": "Marketing",
    "Content Creator": "Marketing",
    "Social Media Manager": "Community",
    "Community Lead": "Community",
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
        { key:"tasks", label:"Tasks", icon:<CheckSquare size={18}/> },
        { key:"responsibilities", label:"Responsibilities", icon:<Repeat size={18}/> },
        { key:"projects", label:"Projects", icon:<FolderKanban size={18}/> },
        { key:"chat", label:"Chat", icon:<MessageCircle size={18}/> },
        { key:"stats", label:"Stats", icon:<BarChart3 size={18}/> },
        { key:"resources", label:"Resources", icon:<Link2 size={18}/> },
        { key:"notes", label:"Notes", icon:<StickyNote size={18}/> },
        { key:"workspace", label:"My Space", icon:<BookOpen size={18}/> },
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
        { key:"engagement", label:"Engagement", icon:<Activity size={18}/> },
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
  // Flat list for compatibility
  const NAV = NAV_GROUPS.flatMap(g => g.items);

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
                <span style={{ fontFamily:FONT_MONO, fontSize:11, color:theme.textMut }}>{c.publishTime}</span>
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
      const CAL_EVENT_TYPES = ["All","Task","Project","Partnership","Outreach","Event","Responsibility","Meeting","Key Date"];
      const CAL_TYPE_COLORS = { Task:theme.teal, Project:"#DA77F2", Partnership:"#748FFC", Outreach:"#FFA94D", Event:"#69DB7C", Responsibility:"#FFD43B", Meeting:"#22B8CF", "Key Date":"#FF6B6B" };

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
            <Sel theme={theme} options={[{value:"mine",label:"My Calendar"},{value:"all",label:"All Team"},...users.map(u=>({value:u.id,label:u.name}))]} value={calPersonFilter} onChange={e=>setCalPersonFilter(e.target.value)} style={{width:"auto",fontSize:13,padding:"6px 10px"}}/>
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
      const copyText = (text, field) => { navigator.clipboard.writeText(text).then(() => { setCopiedField(field); setTimeout(() => setCopiedField(null), 2000); }); };

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

          {/* Login credentials card */}
          <Card theme={theme} style={{padding:20,marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <Lock size={16} color={theme.teal}/>
              <span style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:15}}>Team Login Credentials</span>
            </div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <div style={{flex:"1 1 240px",padding:14,background:theme.bgInput,borderRadius:10,border:`1px solid ${theme.border}`}}>
                <div style={{fontSize:11,fontWeight:600,color:theme.textMut,textTransform:"uppercase",letterSpacing:".04em",marginBottom:6}}>Email</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                  <code style={{fontSize:14,color:theme.text,fontFamily:FONT_MONO}}>socials@nanu-app.com</code>
                  <button type="button" onClick={()=>copyText("socials@nanu-app.com","user")} style={{background:copiedField==="user"?theme.green:theme.teal,border:"none",borderRadius:6,padding:"6px 12px",cursor:"pointer",color:"#0D1B21",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                    {copiedField==="user"?<><Check size={12}/> Copied</>:<><Copy size={12}/> Copy</>}
                  </button>
                </div>
              </div>
              <div style={{flex:"1 1 240px",padding:14,background:theme.bgInput,borderRadius:10,border:`1px solid ${theme.border}`}}>
                <div style={{fontSize:11,fontWeight:600,color:theme.textMut,textTransform:"uppercase",letterSpacing:".04em",marginBottom:6}}>Password</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                  <code style={{fontSize:14,color:theme.text,fontFamily:FONT_MONO}}>Ws!czbCykyg69yK</code>
                  <button type="button" onClick={()=>copyText("Ws!czbCykyg69yK","pass")} style={{background:copiedField==="pass"?theme.green:theme.teal,border:"none",borderRadius:6,padding:"6px 12px",cursor:"pointer",color:"#0D1B21",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                    {copiedField==="pass"?<><Check size={12}/> Copied</>:<><Copy size={12}/> Copy</>}
                  </button>
                </div>
              </div>
            </div>
            <p style={{fontSize:12,color:theme.textMut,marginTop:12}}>Copy credentials above, then click "Open Pallyy" to log in. This is a shared team account.</p>
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
          <Sel theme={theme} options={[{value:"All",label:"All People"},...users.map(u=>({value:u.id,label:u.name}))]} value={tfPerson} onChange={e=>setTfPerson(e.target.value)} style={{width:"auto",fontSize:12,padding:"5px 8px"}}/>
          <Sel theme={theme} options={[{value:"All",label:"All Dates"},{value:"Overdue",label:"Overdue"},{value:"This Week",label:"This Week"},{value:"Upcoming",label:"Upcoming"}]} value={tfDue} onChange={e=>setTfDue(e.target.value)} style={{width:"auto",fontSize:12,padding:"5px 8px"}}/>
          {(tfProject!=="All"||tfPriority!=="All"||tfStatus!=="All"||tfPerson!=="All"||tfDue!=="All")&&<button onClick={()=>{setTfProject("All");setTfPriority("All");setTfStatus("All");setTfPerson("All");setTfDue("All")}} style={{background:"none",border:"none",color:theme.red,cursor:"pointer",fontSize:12,fontWeight:600}}>Clear filters</button>}
        </div>

        {taskView==="master"&&isAdmin ? (()=>{
          // Master admin view — uses filteredTasks (respects the filter bar) minus Done unless filtered
          const mTasks = filteredTasks;
          const activeTasks = mTasks.filter(t=>t.status!=="Done");
          const toggleBulk = (id) => setBulkSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);
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
                const rows=[["Title","Status","Priority","Due Date","Owner","Department","Project","Overdue","Blocker","Notes"]];
                mTasks.forEach(t=>{const o=Array.isArray(t.owners)?t.owners[0]:t.owners;rows.push([t.title,t.status,t.priority||"",t.dueDate||"",uNames(t.owners),userDept(o),visibleProjects.find(p=>p.id===t.project)?.name||"",isOverdue(t)?"YES":"",t.blocker||"",t.notes||""])});
                exportCSV(rows,`nanu-team-tasks-${new Date().toISOString().slice(0,10)}.csv`);
              }}><Download size={13}/> Team Report</Btn>
            </div>

            {/* Bulk action bar */}
            {bulkSelected.length>0&&<Card theme={theme} style={{padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",borderLeft:`3px solid ${theme.teal}`}}>
              <span style={{fontSize:13,fontWeight:600}}>{bulkSelected.length} selected</span>
              <span style={{fontSize:12,color:theme.textMut}}>Reassign to:</span>
              <Sel theme={theme} options={[{value:"",label:"Choose person..."},...users.map(u=>({value:u.id,label:u.name}))]} value={bulkReassignTo} onChange={e=>setBulkReassignTo(e.target.value)} style={{width:"auto",fontSize:12,padding:"5px 8px"}}/>
              <Btn primary theme={theme} small onClick={doBulkReassign} disabled={!bulkReassignTo}>Reassign</Btn>
              <button onClick={()=>{setBulkSelected([]);setBulkReassignTo("")}} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer",fontSize:12,fontWeight:600}}>Clear</button>
            </Card>}

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
            {t.blocker&&<p style={{fontSize:12,color:theme.red,margin:"4px 0 0"}}>Blocker: {t.blocker}</p>}
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
          <Sel theme={theme} options={[{value:"All",label:"All Owners"},...users.map(u=>({value:u.id,label:u.name}))]} value={outreachUserFilter} onChange={(e)=>setOutreachUserFilter(e.target.value)} style={{width:"auto",fontSize:13,padding:"6px 10px"}}/>
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
                    {ev.date&&<span style={{fontSize:12,color:theme.textMut}}>{ev.date} {ev.time&&`at ${ev.time}`} · {ev.duration}min</span>}
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
            {[["metrics","Metrics & KPIs",TrendingUp],["investors","Investors",Handshake],["board","Board Updates",FileText],["initiatives","Initiatives",Flag]].map(([k,l,Icon])=>(
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
            {[["todos","To-Dos",CheckSquare],["wnotes","Scratchpad",FileEdit],["bookmarks","Bookmarks",Bookmark],["contacts","Address Book",Users2],["goals","Goals",Target],["drafts","Drafts",FileText],["myactivity","Activity",Clock]].map(([k,l,Icon])=>(
              <button key={k} type="button" onClick={()=>setWsTab(k)} style={{padding:"8px 14px",borderRadius:8,border:"none",fontSize:12,fontWeight:600,background:wsTab===k?theme.teal:"transparent",color:wsTab===k?"#0D1B21":theme.textSec,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
                <Icon size={13}/>{l}
                {k==="todos"&&todos.filter(t=>!t.done).length>0&&<span style={{background:wsTab===k?"#0D1B2130":theme.teal,color:wsTab===k?"#0D1B21":"#0D1B21",padding:"1px 6px",borderRadius:10,fontSize:10,fontWeight:700}}>{todos.filter(t=>!t.done).length}</span>}
              </button>
            ))}
          </div>

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

    /* ─── CHAT ─── */
    case "chat": {
      const activeChannel = chatChannel;
      const msgs = getChannelMessages(activeChannel);
      const isDm = activeChannel.startsWith("dm_");
      const dmUserId = isDm ? activeChannel.replace("dm_","").split("_").find(id=>id!==curUser.id) : null;
      const chInfo = CHAT_CHANNELS.find(c=>c.id===activeChannel);

      // Render a single message (with grouping support)
      const renderMsg = (m, idx, arr) => {
        const isMine = m.author === curUser?.id;
        const prevMsg = idx > 0 ? arr[idx-1] : null;
        const isGrouped = prevMsg && prevMsg.author === m.author && (new Date(m.time) - new Date(prevMsg.time)) < 300000; // 5 min
        const mentionText = (m.text||"").replace(/@(\w+)/g, '<span style="color:#1FC2C2;font-weight:600">@$1</span>');

        // Date separator
        const prevDate = prevMsg ? new Date(prevMsg.time).toDateString() : null;
        const thisDate = new Date(m.time).toDateString();
        const showDate = !prevMsg || prevDate !== thisDate;

        return <div key={m.id}>
          {showDate && <div style={{textAlign:"center",padding:"16px 0 8px"}}><span style={{fontSize:11,fontWeight:600,color:theme.textMut,background:theme.bgCard,padding:"4px 12px",borderRadius:20,border:`1px solid ${theme.border}`}}>{getDateLabel(m.time)}</span></div>}
          <div style={{display:"flex",gap:10,padding:isGrouped?"2px 0":"10px 0",alignItems:"flex-start",paddingLeft:isGrouped?42:0}}>
            {!isGrouped&&<div style={{width:32,height:32,borderRadius:"50%",background:isMine?theme.teal:"#748FFC",display:"flex",alignItems:"center",justifyContent:"center",color:"#0D1B21",fontWeight:800,fontSize:13,flexShrink:0}}>{uName(m.author).charAt(0)}</div>}
            <div style={{flex:1,minWidth:0}}>
              {!isGrouped&&<div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:13,fontWeight:700,color:isMine?theme.teal:theme.text}}>{uName(m.author)}</span>
                <span style={{fontSize:10,color:theme.textMut,fontFamily:FONT_MONO}}>{new Date(m.time).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</span>
              </div>}
              {m.replyTo&&<div style={{padding:"4px 10px",background:theme.bgInput,borderLeft:`2px solid ${theme.teal}`,borderRadius:"0 6px 6px 0",marginBottom:4,fontSize:12,color:theme.textMut}}>
                <span style={{fontWeight:600}}>{uName(m.replyTo.author)}</span>: {m.replyTo.text}
              </div>}
              <div style={{fontSize:14,color:theme.textSec,lineHeight:1.6,marginTop:isGrouped?0:2}} dangerouslySetInnerHTML={{__html:mentionText}}/>
              {m.linkedEntity&&<div onClick={()=>{
                if(m.linkedEntity.type==="task"){const t=tasks.find(x=>x.id===m.linkedEntity.id);if(t)openM("editTask",{...t})}
                else if(m.linkedEntity.type==="project")setSection("projects");
                else if(m.linkedEntity.type==="outreach"){const o=outreach.find(x=>x.id===m.linkedEntity.id);if(o)openM("editOutreach",{...o})}
              }} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 10px",background:theme.bgInput,borderRadius:6,border:`1px solid ${theme.border}`,cursor:"pointer",marginTop:4,fontSize:12,color:theme.teal}}>
                <Link2 size={11}/>{m.linkedEntity.name}<Badge label={m.linkedEntity.type} color={theme.textMut} style={{fontSize:9}}/>
              </div>}
              {/* Reply button */}
              <button type="button" onClick={()=>{setReplyTo(m);chatInputRef.current?.focus()}} style={{background:"none",border:"none",cursor:"pointer",color:theme.textMut,opacity:0,fontSize:10,marginTop:2,transition:"opacity .15s"}} onMouseEnter={e=>e.target.style.opacity=1} onMouseLeave={e=>e.target.style.opacity=0}>Reply</button>
            </div>
          </div>
        </div>;
      };

      // Chat input component (reused in section and bubble)
      const chatInputBar = (channelId, inputVal, setInputVal, refEl) => (
        <div style={{padding:"12px 16px",borderTop:`1px solid ${theme.border}`,position:"relative"}}>
          {/* Reply indicator */}
          {replyTo&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",marginBottom:8,background:theme.bgInput,borderRadius:8,borderLeft:`2px solid ${theme.teal}`,fontSize:12}}>
            <span style={{color:theme.textMut}}>Replying to <strong style={{color:theme.text}}>{uName(replyTo.author)}</strong></span>
            <span style={{flex:1,color:theme.textMut,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(replyTo.text||"").slice(0,50)}</span>
            <button type="button" onClick={()=>setReplyTo(null)} style={{background:"none",border:"none",cursor:"pointer",color:theme.textMut}}><X size={12}/></button>
          </div>}

          {/* @mention dropdown */}
          {showMentions&&<div style={{position:"absolute",bottom:"100%",left:16,background:theme.bgCard,border:`1px solid ${theme.border}`,borderRadius:8,padding:4,boxShadow:theme.shadowLg,maxHeight:200,overflow:"auto",width:200,zIndex:10}}>
            {users.map(u=>(
              <button key={u.id} type="button" onClick={()=>insertMention(u.username)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",border:"none",background:"transparent",cursor:"pointer",width:"100%",fontFamily:FONT_BODY,fontSize:13,color:theme.text,borderRadius:6}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:theme.teal,display:"flex",alignItems:"center",justifyContent:"center",color:"#0D1B21",fontSize:10,fontWeight:700}}>{u.name.charAt(0)}</div>
                {u.name} <span style={{color:theme.textMut,fontSize:11}}>@{u.username}</span>
              </button>
            ))}
          </div>}

          {/* Link picker */}
          {showLinkPicker&&<div style={{position:"absolute",bottom:"100%",left:16,background:theme.bgCard,border:`1px solid ${theme.border}`,borderRadius:8,padding:8,boxShadow:theme.shadowLg,maxHeight:300,overflow:"auto",width:320,zIndex:10}}>
            <div style={{fontSize:11,fontWeight:600,color:theme.textMut,padding:"4px 8px",textTransform:"uppercase"}}>Tasks</div>
            {tasks.slice(0,6).map(t=>(<button key={t.id} type="button" onClick={()=>sendChatWithLink(channelId,inputVal,"task",t.id,t.title)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 8px",border:"none",background:"transparent",cursor:"pointer",width:"100%",fontFamily:FONT_BODY,fontSize:12,color:theme.text,borderRadius:4}}><CheckSquare size={12} color={theme.teal}/>{t.title}</button>))}
            <div style={{fontSize:11,fontWeight:600,color:theme.textMut,padding:"8px 8px 4px",textTransform:"uppercase"}}>Projects</div>
            {visibleProjects.slice(0,4).map(p=>(<button key={p.id} type="button" onClick={()=>sendChatWithLink(channelId,inputVal,"project",p.id,p.name)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 8px",border:"none",background:"transparent",cursor:"pointer",width:"100%",fontFamily:FONT_BODY,fontSize:12,color:theme.text,borderRadius:4}}><FolderKanban size={12} color="#DA77F2"/>{p.name}</button>))}
            <div style={{fontSize:11,fontWeight:600,color:theme.textMut,padding:"8px 8px 4px",textTransform:"uppercase"}}>Outreach</div>
            {outreach.slice(0,4).map(o=>(<button key={o.id} type="button" onClick={()=>sendChatWithLink(channelId,inputVal,"outreach",o.id,o.name)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 8px",border:"none",background:"transparent",cursor:"pointer",width:"100%",fontFamily:FONT_BODY,fontSize:12,color:theme.text,borderRadius:4}}><Megaphone size={12} color="#FFA94D"/>{o.name}</button>))}
            <button type="button" onClick={()=>setShowLinkPicker(false)} style={{marginTop:4,padding:"4px 8px",border:"none",background:"transparent",cursor:"pointer",fontSize:11,color:theme.textMut,width:"100%",textAlign:"center"}}>Cancel</button>
          </div>}

          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button type="button" onClick={()=>{setShowLinkPicker(p=>!p);setShowMentions(false)}} style={{background:"none",border:"none",cursor:"pointer",color:showLinkPicker?theme.teal:theme.textMut,flexShrink:0}}><Link2 size={16}/></button>
            <input ref={refEl} value={inputVal} onChange={handleChatInputChange}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat(channelId,inputVal)}if(e.key==="Escape"){setShowMentions(false);setShowLinkPicker(false);setReplyTo(null)}}}
              placeholder={isDm?`Message ${uName(dmUserId)}...`:`Message #${chInfo?.label||activeChannel}... (@ to mention)`}
              style={{flex:1,padding:"10px 14px",borderRadius:10,border:`1px solid ${theme.border}`,background:theme.bgInput,color:theme.text,fontFamily:FONT_BODY,fontSize:14,outline:"none"}}/>
            <Btn primary theme={theme} small onClick={()=>sendChat(channelId,inputVal)}><Send size={14}/></Btn>
          </div>
        </div>
      );

      return (
        <div className="nanu-chat-layout" style={{display:"flex",gap:0,height:"calc(100vh - 120px)"}}>
          {/* Mobile channel toggle */}
          <button type="button" className="nanu-chat-mobile-toggle" onClick={()=>setChatMobileSidebar(p=>!p)} style={{display:"none",position:"absolute",top:8,left:8,background:theme.teal,border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",zIndex:10,fontSize:12,fontWeight:600,color:"#0D1B21"}}>
            {chatMobileSidebar?"Close":"Channels"}
          </button>

          {/* Sidebar — channels + DMs */}
          <div className={`nanu-chat-sidebar${chatMobileSidebar?" nanu-chat-sidebar-open":""}`} style={{width:220,flexShrink:0,borderRight:`1px solid ${theme.border}`,display:"flex",flexDirection:"column",overflow:"auto",padding:"12px 0"}}>
            <div style={{fontSize:11,fontWeight:600,color:theme.textMut,padding:"6px 16px",textTransform:"uppercase"}}>Channels</div>
            {CHAT_CHANNELS.map(ch=>{
              const unread=getUnreadCount(ch.id);
              return <button key={ch.id} type="button" onClick={()=>{setChatChannel(ch.id);setChatMobileSidebar(false)}} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",border:"none",background:chatChannel===ch.id?`${theme.teal}15`:"transparent",color:chatChannel===ch.id?theme.teal:theme.textSec,cursor:"pointer",fontFamily:FONT_BODY,fontSize:13,fontWeight:chatChannel===ch.id?600:400,textAlign:"left",width:"100%"}}>
                <span>{ch.icon}</span><span className="nanu-chat-ch-label"># {ch.label}</span>
                {unread>0&&<span style={{background:theme.teal,color:"#0D1B21",padding:"1px 6px",borderRadius:10,fontSize:10,fontWeight:700,marginLeft:"auto"}}>{unread}</span>}
              </button>;
            })}
            <div style={{fontSize:11,fontWeight:600,color:theme.textMut,padding:"16px 16px 6px",textTransform:"uppercase"}}>Direct Messages</div>
            {users.filter(u=>u.id!==curUser.id).map(u=>{
              const dmKey=getDmKey(u.id);
              const unread=getUnreadCount(dmKey);
              return <button key={u.id} type="button" onClick={()=>{setChatChannel(dmKey);setChatMobileSidebar(false)}} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",border:"none",background:chatChannel===dmKey?`${theme.teal}15`:"transparent",color:chatChannel===dmKey?theme.teal:theme.textSec,cursor:"pointer",fontFamily:FONT_BODY,fontSize:13,fontWeight:chatChannel===dmKey?600:400,textAlign:"left",width:"100%"}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:"#748FFC",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:10,fontWeight:700}}>{u.name.charAt(0)}</div>
                <span className="nanu-chat-ch-label">{u.name.split(" ")[0]}</span>
                {unread>0&&<span style={{background:theme.teal,color:"#0D1B21",padding:"1px 6px",borderRadius:10,fontSize:10,fontWeight:700,marginLeft:"auto"}}>{unread}</span>}
              </button>;
            })}
          </div>

          {/* Main chat area */}
          <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
            <div style={{padding:"12px 20px",borderBottom:`1px solid ${theme.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <span style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16}}>
                  {isDm ? uName(dmUserId) : `# ${chInfo?.label||activeChannel}`}
                </span>
                {!isDm&&chInfo?.desc&&<span style={{fontSize:12,color:theme.textMut,marginLeft:10}}>{chInfo.desc}</span>}
              </div>
              {msgs.length>0&&<span style={{fontSize:11,color:theme.textMut}}>{msgs.length} messages</span>}
            </div>

            <div style={{flex:1,overflow:"auto",padding:"4px 20px"}}>
              {msgs.length===0&&<div style={{textAlign:"center",padding:40}}>
                <MessageCircle size={32} color={theme.textMut} style={{opacity:0.3,marginBottom:8}}/>
                <p style={{fontSize:15,fontWeight:600,color:theme.textSec,marginBottom:4}}>{isDm?`Start a conversation with ${uName(dmUserId)}`:`Welcome to #${chInfo?.label||activeChannel}`}</p>
                <p style={{fontSize:13,color:theme.textMut}}>{isDm?"Your messages are private between you two.":(chInfo?.desc||"Send a message to get started.")}</p>
              </div>}
              {msgs.map((m,i)=>renderMsg(m,i,msgs))}
              <div ref={chatEndRef}/>
            </div>

            {chatInputBar(activeChannel, chatInput, setChatInput, chatInputRef)}
          </div>
        </div>
      );
    }


    case "settings": {
      refreshNotifications();
      return (
      <div>
        <SectionHead theme={theme}>Notification Settings</SectionHead>
        <Card theme={theme} style={{maxWidth:600}}>
          <div style={{fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:16,marginBottom:16}}>Email & In-Hub Notifications</div>
          <p style={{fontSize:13,color:theme.textSec,marginBottom:20,lineHeight:1.5}}>Choose which notifications you receive. Email notifications are sent to your registered email address. In-hub notifications appear in the bell icon.</p>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[
              {key:"taskAssigned",label:"Task assigned to me",desc:"When someone assigns you to a task"},
              {key:"taskUpdated",label:"Task I'm on was updated",desc:"When a task you're assigned to gets updated or someone posts an update"},
              {key:"taskDue",label:"Task due today / overdue",desc:"Daily reminder for tasks due today or overdue"},
              {key:"projectUpdated",label:"Project I'm on was updated",desc:"When a project you're part of gets updated"},
              {key:"weeklyRecap",label:"Weekly recap email",desc:"Monday morning summary of your tasks, projects, and team activity"},
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
          <div style={{marginTop:20,padding:"14px 16px",background:theme.bgInput,borderRadius:10,border:`1px solid ${theme.border}`}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>Notification email address</div>
            <div style={{fontSize:13,color:theme.textSec}}>{curUser.email||"No email set — update in Team settings"}</div>
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
                  {u.id!==curUser.id&&<Btn theme={theme} small danger onClick={()=>{if(confirm(`Remove ${u.name}?`)){setUsers(p=>p.filter(x=>x.id!==u.id));db.deleteUser(u.id);log("removed",u.name,"Admin")}}}><Trash2 size={12}/></Btn>}
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
        <div className="nanu-form-row"><div><Label theme={theme}>Due Date</Label><Input theme={theme} type="date" value={form.dueDate||""} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))}/></div><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={users.map(u=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div></div>
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
        <div><Label theme={theme}>Notes</Label><Textarea theme={theme} value={form.notes||""} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} placeholder="Add context, details, links, or instructions for this task..." style={{minHeight:80}}/></div>
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
          <Btn primary theme={theme} onClick={()=>doSave(()=>{const {_newUpdate,...cleanForm}=form;const tid=cleanForm.id||uid("t");const tdata={...cleanForm,id:tid};
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
          <Btn primary theme={theme} onClick={()=>doSave(()=>{const uuid=form.id||uid("u");const udata={...form,id:uuid,socials:form.socials||{}};if(form.id){setUsers(p=>p.map(u=>u.id===form.id?udata:u));log("updated",form.name,"Team")}else{setUsers(p=>[...p,udata]);log("added",form.name,"Team")}db.saveUser(udata)})}>Done</Btn>
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
        <div className="nanu-form-row"><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={users.map(u=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div><div><Label theme={theme}>Linked Outreach</Label><Sel theme={theme} options={[{value:"",label:"None"},...outreach.map(o=>({value:o.id,label:o.name}))]} value={form.linkedOutreach||""} onChange={e=>setForm(p=>({...p,linkedOutreach:e.target.value}))}/></div></div>
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
        <div><Label theme={theme}>Owner</Label><Sel theme={theme} options={users.map(u=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div>
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
        <div className="nanu-form-row"><div><Label theme={theme}>Duration (min)</Label><Input theme={theme} type="number" value={form.duration||60} onChange={e=>setForm(p=>({...p,duration:Number(e.target.value)}))}/></div><div><Label theme={theme}>Host</Label><Sel theme={theme} options={users.map(u=>({value:u.id,label:u.name}))} value={form.host||""} onChange={e=>setForm(p=>({...p,host:e.target.value}))}/></div></div>
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
        <div className="nanu-form-row"><div><Label theme={theme}>Status</Label><Sel theme={theme} options={FEEDBACK_STATUS} value={form.status||"New"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={[{value:"",label:"Unassigned"},...users.map(u=>({value:u.id,label:u.name}))]} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div></div>
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
        <div className="nanu-form-row"><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={users.map(u=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div><div><Label theme={theme}>Area</Label><Sel theme={theme} options={RESP_AREAS} value={form.area||"Content"} onChange={e=>setForm(p=>({...p,area:e.target.value}))}/></div></div>
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
        <div className="nanu-form-row"><div><Label theme={theme}>Check Size</Label><Input theme={theme} value={form.checkSize||""} onChange={e=>setForm(p=>({...p,checkSize:e.target.value}))} placeholder="e.g. £50k–£100k"/></div><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={users.map(u=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div></div>
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
        <div className="nanu-form-row"><div><Label theme={theme}>Status</Label><Sel theme={theme} options={BOARD_UPDATE_STATUS} value={form.status||"Draft"} onChange={e=>setForm(p=>({...p,status:e.target.value}))}/></div><div><Label theme={theme}>Author</Label><Sel theme={theme} options={users.map(u=>({value:u.id,label:u.name}))} value={form.author||""} onChange={e=>setForm(p=>({...p,author:e.target.value}))}/></div></div>
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
        <div className="nanu-form-row"><div><Label theme={theme}>Owner</Label><Sel theme={theme} options={users.map(u=>({value:u.id,label:u.name}))} value={form.owner||""} onChange={e=>setForm(p=>({...p,owner:e.target.value}))}/></div><div><Label theme={theme}>Horizon</Label><Sel theme={theme} options={INITIATIVE_HORIZONS} value={form.horizon||"This Quarter"} onChange={e=>setForm(p=>({...p,horizon:e.target.value}))}/></div></div>
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
          {NAV_GROUPS.map(group=>{
            const isCollapsed = collapsedGroups[group.id];
            return <div key={group.id} style={{marginBottom:8}}>
              {sidebar && <button type="button" onClick={()=>setCollapsedGroups(p=>({...p,[group.id]:!p[group.id]}))} style={{display:"flex",alignItems:"center",gap:6,width:"100%",padding:"6px 12px",border:"none",background:"transparent",cursor:"pointer",fontSize:10,fontWeight:700,color:theme.textMut,textTransform:"uppercase",letterSpacing:".08em",justifyContent:"space-between"}}>
                <span>{group.label}</span>
                <ChevronRight size={11} style={{transform:isCollapsed?"none":"rotate(90deg)",transition:"transform .15s"}}/>
              </button>}
              {(!sidebar || !isCollapsed) && group.items.map(n=>(
                <button key={n.key} onClick={()=>setSection(n.key)} style={{display:"flex",alignItems:"center",gap:11,width:"100%",padding:sidebar?"9px 12px":"9px 0",borderRadius:8,border:"none",cursor:"pointer",marginBottom:1,background:section===n.key?`${theme.teal}12`:"transparent",color:section===n.key?theme.teal:theme.textSec,fontFamily:FONT_BODY,fontWeight:500,fontSize:14,transition:"all .15s",justifyContent:sidebar?"flex-start":"center"}}>{n.icon}{sidebar&&<span className="nanu-sidebar-label">{n.label}</span>}
                  {n.key==="tasks"&&overdue>0&&<span style={{marginLeft:"auto",background:theme.red,color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:700}}>{overdue}</span>}
                </button>
              ))}
            </div>;
          })}
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

      {/* Floating Chat Bubble */}
      {section!=="chat"&&<>
        {chatBubble&&<div className="nanu-chat-bubble-panel" style={{position:"fixed",bottom:80,right:24,width:360,height:460,background:theme.bgCard,border:`1px solid ${theme.border}`,borderRadius:16,boxShadow:theme.shadowLg,zIndex:180,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${theme.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <select value={chatBubbleChannel} onChange={e=>setChatBubbleChannel(e.target.value)} style={{background:"transparent",border:"none",fontFamily:FONT_DISPLAY,fontWeight:700,fontSize:14,color:theme.text,cursor:"pointer",outline:"none"}}>
              {CHAT_CHANNELS.map(ch=><option key={ch.id} value={ch.id}>{ch.icon} #{ch.label}{getUnreadCount(ch.id)>0?` (${getUnreadCount(ch.id)})`:""}</option>)}
              {users.filter(u=>u.id!==curUser.id).map(u=>{const dk=getDmKey(u.id);return <option key={dk} value={dk}>💬 {u.name.split(" ")[0]}{getUnreadCount(dk)>0?` (${getUnreadCount(dk)})`:""}</option>})}
            </select>
            <div style={{display:"flex",gap:6}}>
              <button type="button" onClick={()=>{setSection("chat");setChatChannel(chatBubbleChannel);setChatBubble(false)}} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer"}}><ExternalLink size={14}/></button>
              <button type="button" onClick={()=>setChatBubble(false)} style={{background:"none",border:"none",color:theme.textMut,cursor:"pointer"}}><X size={16}/></button>
            </div>
          </div>
          <div style={{flex:1,overflow:"auto",padding:"8px 14px"}}>
            {(chatMessages[chatBubbleChannel]||[]).length===0&&<p style={{textAlign:"center",color:theme.textMut,fontSize:12,paddingTop:20}}>No messages yet</p>}
            {(chatMessages[chatBubbleChannel]||[]).slice(-25).map((m,i,arr)=>{
              const isMine=m.author===curUser?.id;
              const prev=i>0?arr[i-1]:null;
              const isGrouped=prev&&prev.author===m.author&&(new Date(m.time)-new Date(prev.time))<300000;
              return <div key={m.id} style={{display:"flex",gap:8,padding:isGrouped?"2px 0":"6px 0",alignItems:"flex-start",paddingLeft:isGrouped?32:0}}>
                {!isGrouped&&<div style={{width:24,height:24,borderRadius:"50%",background:isMine?theme.teal:"#748FFC",display:"flex",alignItems:"center",justifyContent:"center",color:"#0D1B21",fontWeight:700,fontSize:10,flexShrink:0}}>{uName(m.author).charAt(0)}</div>}
                <div style={{flex:1,minWidth:0}}>
                  {!isGrouped&&<div style={{fontSize:11,fontWeight:600,color:isMine?theme.teal:theme.text}}>{uName(m.author)} <span style={{fontWeight:400,color:theme.textMut,fontFamily:FONT_MONO,fontSize:9}}>{new Date(m.time).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</span></div>}
                  {m.replyTo&&<div style={{padding:"2px 8px",borderLeft:`2px solid ${theme.teal}`,fontSize:11,color:theme.textMut,marginBottom:2}}>{uName(m.replyTo.author)}: {m.replyTo.text}</div>}
                  <div style={{fontSize:13,color:theme.textSec,lineHeight:1.5}} dangerouslySetInnerHTML={{__html:(m.text||"").replace(/@(\w+)/g,'<span style="color:#1FC2C2;font-weight:600">@$1</span>')}}/>
                  {m.linkedEntity&&<div style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",background:theme.bgInput,borderRadius:4,fontSize:11,color:theme.teal,marginTop:2}}><Link2 size={9}/>{m.linkedEntity.name}</div>}
                </div>
              </div>;
            })}
          </div>
          <div style={{padding:"8px 14px",borderTop:`1px solid ${theme.border}`,display:"flex",gap:6}}>
            <input value={chatInput} onChange={handleChatInputChange}
              onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();sendChat(chatBubbleChannel,chatInput)}}}
              placeholder="Message..." style={{flex:1,padding:"8px 12px",borderRadius:8,border:`1px solid ${theme.border}`,background:theme.bgInput,color:theme.text,fontFamily:FONT_BODY,fontSize:13,outline:"none"}}/>
            <button type="button" onClick={()=>sendChat(chatBubbleChannel,chatInput)} style={{background:theme.teal,border:"none",borderRadius:8,padding:"8px 10px",cursor:"pointer",color:"#0D1B21"}}><Send size={14}/></button>
          </div>
        </div>}

        {/* Bubble toggle button with unread badge */}
        <button type="button" onClick={()=>setChatBubble(p=>!p)} style={{position:"fixed",bottom:24,right:24,width:52,height:52,borderRadius:"50%",background:theme.teal,border:"none",cursor:"pointer",boxShadow:"0 4px 16px rgba(31,194,194,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:180}}>
          {chatBubble?<X size={22} color="#0D1B21"/>:<MessageCircle size={22} color="#0D1B21"/>}
          {!chatBubble&&totalUnread>0&&<span style={{position:"absolute",top:-2,right:-2,background:"#FF6B6B",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:10,minWidth:16,textAlign:"center"}}>{totalUnread}</span>}
        </button>
      </>}
    </div>
  );
}
