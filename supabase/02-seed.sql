-- ═══════════════════════════════════════════════════════════════
-- NANU MARKETING HUB — Seed Data
-- Run this AFTER 01-schema.sql in: Supabase → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- USERS
INSERT INTO users (id, name, username, pin, role, email, tz_label, tz, resp, socials) VALUES
('u1','Nicholas Martin','nicholas','1234','Admin','nicholas@nanu-app.com','London','Europe/London','Founder, Product Vision, Investor Relations','{"linkedin":"https://linkedin.com/in/nicholasmartin","x":"","instagram":"","tiktok":"","youtube":""}'),
('u2','Holly Wood','holly','2345','Marketing Lead','holly@nanu-app.com','London','Europe/London','CMO, Community, Events, Live Newsletter','{}'),
('u3','Sean Cahill','sean','3456','Content Creator','sean@nanu-app.com','New York','America/New_York','Video Content, Public-facing Personality','{}'),
('u4','Alexander Lockwood','alexander','4567','Content Creator','alexander@nanu-app.com','London','Europe/London','Written Content, Email, Reddit Strategy','{}'),
('u5','Ed','ed','5678','Social Media Manager','ed@nanu-app.com','London','Europe/London','Discord Outreach, Ambassador Programme','{}');

-- WEEKLY THEMES
INSERT INTO weekly_themes (day, theme, color, sort_order) VALUES
('Monday','Nanu Moments','#1FC2C2',0),
('Tuesday','How-To Tuesday','#69DB7C',1),
('Wednesday','Curiosity Wednesday','#748FFC',2),
('Thursday','From the Archive','#FFA94D',3),
('Friday','Friday Discussions','#DA77F2',4),
('Saturday','Behind the Mystery','#FF6B6B',5),
('Sunday','Mystery of the Week','#FFD43B',6);

-- PROJECTS
INSERT INTO projects (id, name, description, color, owner, status) VALUES
('proj1','Ambassador Programme','Recruit, onboard, and manage community ambassadors with playbooks, invite codes, and content templates.','#69DB7C','u5','Active'),
('proj2','The Signal Launch','Full launch campaign for nanu-signal.com — brand teaser, editorial pipeline, RSS backend, and social rollout.','#1FC2C2','u4','Active'),
('proj3','Partnerships & Outreach','Podcast circuit, community collaborations, event appearances, and micro-creator programme.','#DA77F2','u2','Active'),
('proj4','Nanu Orbis','Monthly members-only live event — production, promotion, and post-event content.','#FFA94D','u2','Planning');

-- CALENDAR ITEMS
INSERT INTO calendar_items (id, title, platform, status, owner, due_date, publish_time, caption, asset_link, campaign) VALUES
('c1','Nanu Moments — Weekly Highlight','Instagram','Scheduled','u3','2026-03-09','10:00','Every mystery tells a story. This week''s Nanu Moment explores…','',''),
('c2','How-To: Submit Your First Experience','LinkedIn','In Design','u4','2026-03-10','09:00','New to Nanu? Here''s how to document your experience in under 2 minutes.','',''),
('c3','Curiosity Wednesday: Consciousness & UAP','X / Twitter','Idea','u2','2026-03-11','12:00','','',''),
('c4','From the Archive: 1952 DC Sightings','Nanu App','Review','u4','2026-03-12','14:00','A deep dive into one of the most well-documented UAP events in history.','',''),
('c5','Friday Discussion: What Defines Credibility?','Reddit','Idea','u5','2026-03-13','16:00','','',''),
('c6','Newsletter: March Week 2 Roundup','LinkedIn','Needs Approval','u2','2026-03-14','08:00','This week in Nanu: new features, top experiences, and community highlights.','',''),
('c7','Partnership Announcement: Future Folklore','X / Twitter','Blocked','u2','2026-03-16','11:00','Waiting on Joel''s announcement copy.','','signal-launch'),
('c8','Ambassador Spotlight','Instagram','In Design','u5','2026-03-14','18:00','','',''),
('c9','Mystery of the Week: Skinwalker Ranch','TikTok','Scheduled','u3','2026-03-15','19:00','What makes this location one of the most investigated sites in the world?','',''),
('c10','The Signal Launch Teaser','LinkedIn','In Design','u4','2026-03-18','09:00','News through every lens. The Signal by Nanu — coming soon.','','signal-launch');

-- TASKS
INSERT INTO tasks (id, title, owner, due_date, status, blocker, priority, notes, linked_content, project) VALUES
('t1','Finalise Ambassador Programme tracker','u5','2026-03-10','In Progress','','High','Master Excel tracker needs final column for engagement metrics. Ed has the latest version — check with him before updating.','','proj1'),
('t2','Create podcast one-pager for Traci (Total Conundrum)','u2','2026-03-09','Overdue','','Urgent','Traci specifically requested a one-pager. Keep it concise: what Nanu is, Nicholas''s story, key talking points, and a media kit link.','','proj3'),
('t3','Design Founding Community badge variants','u3','2026-03-12','In Progress','','Medium','Four badge variants needed for Alex to implement. Reference the brand guide for colour palette. Dark and light versions of each.','',''),
('t4','Draft The Signal brand launch post','u4','2026-03-14','Not Started','','High','Use the Signal Broadcast logo mark. Tagline: ''News through every lens · by Nanu''. Tease the lens ratings system without giving too much away.','c10','proj2'),
('t5','Follow up with Joel on Buildathon commitments','u2','2026-03-11','In Progress','Waiting on Joel''s response','High','Joel still owes: announcement copy, mentor/judge bench, brand assets, and distribution channels. Chase via email and WhatsApp.','c7','proj3'),
('t6','UApedia follow-up','u2','2026-03-13','Not Started','','Low','Pending task flagged for Holly. Check status of the collaboration discussion.','','proj3'),
('t7','Prepare Vanessa Rogers podcast brief','u1','2026-03-20','Not Started','','Medium','Fabric of Folklore — April Calendly confirmed. Prepare talking points around Nanu''s Myths & History category.','','proj3'),
('t8','Weekly content calendar sign-off','u2','2026-03-09','Needs Approval','','Medium','Review all scheduled posts for W2 March. Check captions, platforms, and publish times are correct before approving.','','');

-- RESOURCES
INSERT INTO resources (id, grp, label, url) VALUES
('r1','Drives','Marketing Drive','https://drive.google.com'),
('r2','Drives','Brand Assets','https://drive.google.com'),
('r3','Drives','The Signal Assets','https://drive.google.com'),
('r4','Social Platforms','LinkedIn','https://linkedin.com/company/nanu'),
('r5','Social Platforms','X / Twitter','https://x.com/nanu'),
('r6','Social Platforms','Instagram','https://instagram.com/nanu'),
('r7','Social Platforms','TikTok','https://tiktok.com/@nanu'),
('r8','Social Platforms','Reddit','https://reddit.com/r/nanu'),
('r9','Design Tools','Canva','https://canva.com'),
('r10','Design Tools','Lovart.ai','https://lovart.ai'),
('r11','Docs','Marketing Bible','#'),
('r12','Docs','Growth Plan','#'),
('r13','Docs','Brand Guidelines','#'),
('r14','Forms','Ambassador Application','#'),
('r15','Forms','Partnership Enquiry','#');

-- CONTENT IDEAS
INSERT INTO content_ideas (id, text, category, votes, status) VALUES
('i1','Interview series with experiencers','Video',3,'Open'),
('i2','Infographic: 9 Categories of the Unknown','Design',5,'Approved'),
('i3','Reddit AMA announcing Communities feature','Campaign',4,'Open'),
('i4','Behind-the-scenes: Building the AI Interviewer','Blog',2,'Open');

-- CAPTIONS
INSERT INTO captions (id, text, tags) VALUES
('cap1','Every mystery tells a story. What have you experienced?','["awareness","engagement"]'),
('cap2','The unknown isn''t empty — it''s full of data waiting to be structured.','["mission","product"]'),
('cap3','Discover. Discuss. Disclose. Join the community mapping humanity''s mysteries.','["tagline","CTA"]'),
('cap4','What if the next great discovery starts with your experience?','["experiencer","CTA"]');

-- HASHTAG GROUPS
INSERT INTO hashtag_groups (id, grp, tags) VALUES
('h1','Core','["#Nanu","#DiscoverDiscussDisclose","#NanuApp","#SocialScience"]'),
('h2','UAP','["#UAP","#UFO","#UAPDisclosure","#UnidentifiedAerialPhenomena"]'),
('h3','Community','["#ExploreTheUnknown","#MysteriesUnfold","#Community","#NanuMoments"]'),
('h4','Consciousness','["#Consciousness","#NonHumanIntelligence","#NHI"]');

-- MESSAGING PILLARS
INSERT INTO messaging_pillars (id, pillar, line) VALUES
('m1','Transparency','Your data is yours. Always.'),
('m2','Trust','Built by the community, for the community.'),
('m3','Discovery','Every mystery adds to the bigger picture.'),
('m4','Empowerment','You decide what''s real — we provide the tools.'),
('m5','Responsibility','Exploring the unknown should never compromise wellbeing.');

-- CONTENT TEMPLATES
INSERT INTO content_templates (id, name, platform, caption, tags) VALUES
('tp1','Nanu Moments Post','Instagram','Every mystery tells a story. This week''s #NanuMoment explores…\n\n[DESCRIPTION]\n\nWhat do you think? Share your thoughts below.\n\n#Nanu #DiscoverDiscussDisclose','["weekly","monday"]'),
('tp2','How-To Tuesday','LinkedIn','New to Nanu? Here''s a quick guide:\n\n[STEPS]\n\nStart exploring today → nanu-app.com\n\n#Nanu #HowTo #SocialScience','["weekly","tuesday"]');

-- STATS
INSERT INTO stats (id, last_updated, totals, targets) VALUES (1, '2026-03-07',
'{"followers":2847,"reach":45200,"impressions":128500,"engagement":3.2,"shares":892,"linkClicks":1240,"videoViews":18700,"websiteTraffic":4320,"newsletterSignups":187}',
'{"followers":5000,"reach":100000,"impressions":250000,"engagement":5.0,"linkClicks":3000,"newsletterSignups":500,"nanuUsers":5000}');

-- PLATFORM STATS
INSERT INTO platform_stats (platform, followers, last_week, reach, engagement, growth) VALUES
('LinkedIn',620,580,12400,4.1,8.2),
('X / Twitter',890,845,18200,2.8,5.4),
('Instagram',445,398,6800,3.9,12.1),
('TikTok',312,263,4200,5.2,18.5),
('Reddit',280,270,2100,2.1,3.8),
('YouTube',180,170,1200,1.8,6.0),
('Facebook',120,123,300,1.2,-2.1);

-- WEEKLY GROWTH
INSERT INTO weekly_growth (week, users_count, sort_order) VALUES
('W1 Feb',812,0),('W2 Feb',831,1),('W3 Feb',849,2),
('W4 Feb',858,3),('W1 Mar',869,4),('W2 Mar',891,5);

-- TOP POSTS
INSERT INTO top_posts (platform, title, metric) VALUES
('X / Twitter','First peer-reviewed community case','12.4K imp.'),
('Instagram','9 Categories infographic','2.1K saves'),
('LinkedIn','Founder story: Why I built Nanu','890 eng.');

-- NOTES
INSERT INTO notes (id, text, author, pinned, date, color) VALUES
('n1','Holly: Monthly live event needs a date confirmed for March','u2',true,'2026-03-07','#1FC2C2'),
('n2','Nick Cook event — London, April. Invite-only. Nicholas + Steve attending.','u1',false,'2026-03-06','#FFA94D'),
('n3','Joel still owes: announcement copy, mentor bench, brand assets, distribution channels','u2',true,'2026-03-08','#FF6B6B');

-- KEY DATES
INSERT INTO key_dates (id, title, date, color) VALUES
('kd1','Vanessa Rogers Podcast','2026-04-15','#DA77F2'),
('kd2','Nick Cook Event (London)','2026-04-20','#FFA94D'),
('kd3','Q2 Growth Target: 5,000 users','2026-06-30','#1FC2C2');

-- CAMPAIGNS
INSERT INTO campaigns (id, name, tag, color) VALUES
('camp1','The Signal Launch','signal-launch','#1FC2C2'),
('camp2','Buildathon','buildathon','#DA77F2');

-- OUTREACH
INSERT INTO outreach (id, name, type, platform, status, owner, notes, url, date) VALUES
('out1','Vanessa Y. Rogers','Content Creator','Podcast — Fabric of Folklore','Confirmed','u1','April Calendly confirmed. Prepare talking points around Myths & History.','','2026-04-15'),
('out2','Traci — Total Conundrum','Content Creator','Podcast','In Conversation','u2','One-pager requested. Waiting on scheduling.','',''),
('out3','The Activity Continues','Content Creator','Podcast','Contacted','u2','Registration done. Awaiting response.','',''),
('out4','James Fox','Influencer','X / Twitter','In Conversation','u1','X Space co-hosting event planned for 20 March.','','2026-03-20'),
('out5','Nathan Cole — UAPWatch','Community','Discord / YouTube','In Conversation','u5','Potential cross-community collaboration.','',''),
('out6','Nick Cook Event','Organisation','In-person (London)','Confirmed','u1','Invite-only. April. Nicholas attending.','','2026-04-20'),
('out7','Reddit AMA','Community','Reddit','Identified','u4','Plan to announce Communities feature via AMA.','','');

-- ACTIVITY LOG
INSERT INTO activity_log (id, user_id, action, target, section, time) VALUES
('a1','u4','updated','The Signal Launch Teaser','Calendar','2026-03-09T08:30:00Z'),
('a2','u5','added','Ambassador Spotlight','Calendar','2026-03-08T16:20:00Z'),
('a3','u2','created','UApedia follow-up','Tasks','2026-03-08T11:00:00Z');
