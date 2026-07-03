// Case-study content model.
// Each study is authored as an ordered list of typed content blocks so the
// renderer can style them consistently on-theme. Faithful to the source
// write-ups in each product repo, condensed for the web.
//
// Block types:
//   { type: 'lead', text }              opening deck paragraph
//   { type: 'h2', text }                section heading (auto-anchored)
//   { type: 'p', text }                 paragraph ( **bold** supported )
//   { type: 'quote', text }             pull quote
//   { type: 'stats', items:[{value,label}] }
//   { type: 'list', ordered?, items:[] }
//   { type: 'table', head:[], rows:[[]] }
//   { type: 'image', src, alt, title, caption }

// Media lives under /cs-media (NOT /case-study) so the folder does not shadow
// the /case-study SPA route in nginx's try_files fallback.
const BASE = '/cs-media';

export const caseStudies = [
  // ─────────────────────────────────────────────────────────────
  // 1 · PMHelper
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pmhelper',
    category: 'Product · Engineering',
    year: '2026',
    role: 'Product Owner & Full-Stack Engineer',
    title: 'PMHelper — running a whole team from one tool',
    deck: 'I forked an abandoned open-source project and turned it into a production project-management system with QA gates, OKR tracking, a mobile app, and a Claude MCP server. Five people depend on it every day.',
    stack: ['Laravel 9', 'Filament v2', 'PHP 8.3', 'Livewire + Pusher', 'MySQL', 'Expo · React Native', 'MCP'],
    live: { label: 'pm.cirrus-hub.net', url: 'https://pm.cirrus-hub.net' },
    ogImage: `${BASE}/og-pmhelper.jpg`,
    cardImage: `${BASE}/pmhelper-dashboard.webp`,
    cardImageAlt: 'PMHelper project dashboard with health scores and report overview',
    cardDesc: 'A production PM tool with a QA-gated ticket pipeline, auto-generated reports, OKR/KPI scoring, a React Native app, and a Claude MCP server.',
    cardTags: ['Laravel', 'Filament', 'React Native', 'MCP'],
    hero: {
      src: `${BASE}/pmhelper-okr.webp`,
      alt: 'PMHelper OKR dashboard showing Q2 2026 objectives, key results, and achievement percentages for a team member',
      title: 'PMHelper — OKR & KPI tracking (My OKR)',
    },
    seo: {
      title: 'PMHelper Case Study — QA-Gated PM Tool | Bintang Tobing',
      description: 'How I forked an abandoned open-source project and rebuilt it into PMHelper: a production project-management system with role-based access, a QA-gated ticket pipeline, auto-generated reports, OKR/KPI tracking, a React Native app, and a Claude MCP server. Five users depend on it daily.',
      keywords: 'PMHelper, project management tool, Laravel, Filament, QA workflow, OKR KPI, MCP server, Claude, React Native, Bintang Tobing case study',
    },
    blocks: [
      { type: 'lead', text: 'I built PMHelper to run my team’s project work in one place. It handles tickets, kanban boards, QA workflows, daily and weekly reports, OKR and KPI tracking, team messaging, and a mobile app. I forked it from an abandoned open-source project and turned it into a production system. Today five real users depend on it every day.' },

      { type: 'h2', text: 'The problem' },
      { type: 'p', text: 'My team spread work across too many tools. Tickets lived in one place. Reports lived in chat. Performance reviews lived in spreadsheets. Nobody had a single view.' },
      { type: 'p', text: 'I wanted four things: one place for tickets, reports, and reviews; real role-based access so a developer cannot do a stakeholder’s job; a QA workflow that blocks bad work before it ships; and objective performance data based on OKR and KPI, not opinion.' },
      { type: 'p', text: 'Off-the-shelf tools cost money per seat and did not match how I run QA. So I built my own.' },

      { type: 'h2', text: 'The starting point' },
      { type: 'p', text: 'I forked `devaslanphp/project-management`. The upstream project died in March 2024. I took the base and rebuilt it. I chose Laravel and Filament because I already knew them — that let me ship features in days, not weeks.' },
      { type: 'table', head: ['Layer', 'Choice'], rows: [
        ['Framework', 'Laravel 9.19'],
        ['Admin panel', 'Filament v2.16'],
        ['Language', 'PHP 8.3'],
        ['Access control', 'Spatie laravel-permission'],
        ['Realtime UI', 'Livewire + Pusher'],
        ['Frontend', 'Tailwind CSS 3, Vite 3'],
        ['Database', 'MySQL'],
      ] },

      { type: 'h2', text: 'Role-based access' },
      { type: 'p', text: 'I set up six production roles. Every policy checks the user’s role before it allows a delete, an edit, or a status change. A developer cannot start a sprint. A stakeholder cannot move a ticket to QA. The rules live in the database, not in hardcoded arrays, so I can change them without a deploy.' },
      { type: 'table', head: ['Role', 'Permissions'], rows: [
        ['Super Admin', '69'],
        ['Project Manager', '36'],
        ['QA / Tester', '27'],
        ['DevOps', '24'],
        ['Developer', '23'],
        ['Stakeholder', '14'],
      ] },

      { type: 'h2', text: 'The ticket system' },
      { type: 'p', text: 'The ticket system is the core. I designed it around a three-layer pipeline: **Dev, then QA, then Business.** It has 15 statuses, and each status belongs to a role group. A ticket only moves to the next status if your role owns that group. This stops a developer from marking their own bug as QA Passed.' },
      { type: 'p', text: 'It carries 9 ticket types (Bug, Task, Feature, Improvement, Sub-task, Epic, Spike, Hotfix, QA Test Case) and 4 priority levels (P0 Critical to P3 Low). Each ticket carries a QA checklist with pass, fail, and pending items. A ticket cannot reach QA Passed until QA clears the checklist. **That rule is what keeps quality high.** Developers log time with a `/spend` command inside comments.' },
      { type: 'image', src: `${BASE}/pmhelper-kanban.webp`, alt: 'PMHelper Kanban board showing tickets across Backlog, Ready for Dev, In Progress, Code Review, Ready for QA, and QA Testing columns with priority and sprint labels', title: 'PMHelper — Kanban board with a role-aware QA workflow', caption: 'The board enforces the pipeline: a ticket only advances if your role owns the next status group.' },

      { type: 'h2', text: 'Reports that write themselves' },
      { type: 'p', text: 'I added daily and weekly reports so I can see progress without asking for it. Weekly reports auto-generate a summary from ticket, activity, and timesheet data — a completion rate and a breakdown by status, type, and project. Reports follow a workflow: Draft → Submitted → Acknowledged. When you submit, the system notifies the Project Manager and Super Admin.' },

      { type: 'h2', text: 'OKR and KPI' },
      { type: 'p', text: 'This module answers one question: how do I evaluate people fairly? I shipped it across four sprints in a single day. The weight rules keep the math honest — objectives per user per period must sum to 100%, and key results per objective must sum to 100%. The system rejects anything over 100%.' },
      { type: 'p', text: 'Progress comes from three sources: manual entry, weekly reports, and automatic calculation. Automatic key results pull data from tickets and reports through pluggable adapters, and a scheduled command recalculates them every hour. The review flow runs in two steps — you score yourself, then your supervisor finalizes it — and the final score rolls up as objective weight × key-result weight × per-key-result score.' },
      { type: 'quote', text: 'When review time comes, I look at achievement scores, not memory.' },

      { type: 'h2', text: 'Messenger, meetings, and a mobile app' },
      { type: 'p', text: 'I added one-on-one messaging inside the app so the team stops jumping to external chat — images, link previews, file attachments, broadcast in real time through Pusher. I embedded Jitsi Meet for video calls that run inside the app, capture a live transcript, and auto-summarize the call when it ends.' },
      { type: 'p', text: 'Web stays my primary surface, but I wanted native clients for the six core modules. I built the app with Expo SDK 54, React Native, and TypeScript, sharing the backend through a REST API with 37 endpoints and Sanctum token auth. I gave it a warm editorial dark design on purpose — a terracotta accent and serif headlines, because most PM tools look cold and generic. The app subscribes to the same realtime kanban channel as the web, so when someone moves a ticket, the board updates on the phone.' },
      { type: 'image', src: `${BASE}/pmhelper-dashboard.webp`, alt: 'PMHelper dashboard showing project health scores, average health 90.3, completion rate 93.9%, overdue tickets, and a weekly report overview with OKR progress', title: 'PMHelper — the command-center dashboard', caption: 'Health scores, completion rate, overdue work, and OKR progress in one glance.' },

      { type: 'h2', text: 'An MCP server for Claude' },
      { type: 'p', text: 'I exposed a Model Context Protocol endpoint at `/api/mcp`. It gives Claude 14 tools — list and create tickets, update status, add comments, work with discussions, file daily reports. Every tool checks the same permissions as the web UI, so Claude cannot do anything the user cannot do. The team fetches ticket state and adds comments without leaving their editor.' },

      { type: 'h2', text: 'Results' },
      { type: 'stats', items: [
        { value: '5', label: 'users run daily work through it' },
        { value: '6', label: 'roles with database-driven policies' },
        { value: '15', label: 'QA-gated ticket statuses' },
        { value: '37', label: 'REST endpoints powering the app' },
      ] },
      { type: 'p', text: 'The QA checklist blocks tickets from shipping without a sign-off — quality now has a gate, not a hope. Weekly reports write themselves from ticket data, so I stopped chasing people for status updates. The OKR module gives me objective performance data. The mobile app and MCP server extend the same data to phones and to Claude, so the team works where they already are.' },

      { type: 'h2', text: 'Lessons I learned' },
      { type: 'p', text: 'Filament v2 uses Heroicons v1, not v2 — half my icon names failed until I learned this. Spatie settings crash the app when a new property has no database row, so I insert the row with raw SQL before I deploy. New Tailwind classes render as nothing until I rebuild on the server, because the build folder is gitignored. Eloquent accessors override SQL computed columns in union queries, so I bypass them with `getAttributes()` when I need the raw value. I write each lesson into a memory file, so every new feature costs me less.' },
      { type: 'quote', text: 'If you want to build something like this, start with the workflow you actually run. Match the tool to your process — not your process to a tool.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 2 · Bitunix MarTech Dashboard
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'bitunix-martech-dashboard',
    category: 'MarTech · Data',
    year: '2026',
    role: 'Marketing & Technology Manager',
    title: 'Running Bitunix marketing from one screen',
    deck: 'I replaced an hour of daily spreadsheet work with one dashboard that joins Google Search Console, GA4, and the Bitunix Partner Portal into a single funnel — so budget decisions rest on deposits, not clicks.',
    // Auto-link every occurrence of the brand word in the body copy.
    autolink: {
      word: 'Bitunix',
      url: 'https://www.bitunix.com/register?inviteCode=ab9nr3&utm_source=bintangtobing.com&utm_medium=referral&utm_campaign=bitunix-case-study&utm_content=case-study',
    },
    stack: ['Laravel 13', 'Next.js 16', 'PostgreSQL', 'Redis', 'BigQuery', 'GSC + GA4 + Partner API'],
    live: null,
    ogImage: `${BASE}/og-bitunix.jpg`,
    cardImage: `${BASE}/bitunix-overview.webp`,
    cardImageAlt: 'Bitunix MarTech Dashboard overview showing registrations, GSC clicks, average position, and GA4 sessions',
    cardDesc: 'One dashboard that joins search, analytics, and partner data into a single conversion funnel — attributing deposits to campaigns and cutting brand-traffic dependence from 71% to 58%.',
    cardTags: ['Laravel', 'Next.js', 'BigQuery', 'Attribution'],
    hero: {
      src: `${BASE}/bitunix-overview.webp`,
      alt: 'Bitunix MarTech Dashboard overview page — "One funnel, three sources, zero swivel-chair" — showing registrations, GSC clicks, average position 5.39, and GA4 sessions over the last 90 days',
      title: 'Bitunix MarTech Dashboard — marketing intelligence overview',
    },
    seo: {
      title: 'Bitunix MarTech Dashboard Case Study | Bintang Tobing',
      description: 'How I replaced an hour of daily spreadsheet work with one dashboard that joins Google Search Console, GA4, and the Bitunix Partner Portal into a single conversion funnel — attributing deposits to campaigns and cutting brand-traffic dependence from 71% to 58% in a quarter.',
      keywords: 'Bitunix, MarTech dashboard, Google Search Console, GA4, BigQuery, attribution, conversion funnel, Laravel, Next.js, Bintang Tobing case study',
    },
    blocks: [
      { type: 'lead', text: 'I run marketing for Bitunix. My job is to grow organic search, turn that traffic into partner signups, and prove which channels bring real deposits. I answer to numbers, not opinions.' },

      { type: 'h2', text: 'The problem I had' },
      { type: 'p', text: 'Every morning I opened three browser tabs. Google Search Console for organic search. GA4 for on-site behavior. The Bitunix Partner Portal for signups, deposits, and commissions. Each tab spoke its own language, and none of them talked to each other.' },
      { type: 'p', text: 'So I spent the first hour of my day copying numbers into a spreadsheet. I lined up dates by hand. I guessed which search campaign drove which deposit. My attribution was a hunch, not a fact. When my manager asked “which campaign paid for itself,” I gave a soft answer. I also missed things — the partner token expires after 180 days, and twice it lapsed without warning and the data went stale for a week before I noticed.' },

      { type: 'h2', text: 'What I built to fix it' },
      { type: 'p', text: 'I built the Bitunix MarTech Dashboard. It pulls from all three sources every morning and joins them into one funnel: a Google search click becomes a GA4 session becomes a partner signup becomes a first deposit. One screen, one story.' },
      { type: 'p', text: 'The stack is a Laravel 13 API on PostgreSQL and Redis, and a Next.js 16 dashboard. The API refreshes Search Console at 02:00, GA4 at 02:30, and the Partner Portal at 03:00, every day, in sequence. By the time I sit down, the numbers are ready. Every page defaults to the last 90 days, and every KPI shows a delta arrow against the previous window of equal length — with the colors flipped for average search position, because moving from 5 to 3 is a win.' },

      { type: 'h2', text: 'My 10-second morning check' },
      { type: 'p', text: 'I open the Overview page first. It answers one question: is anything broken or moving? One lead card with total fees and a sparkline, four KPIs below it, and a funnel widget from search clicks to first deposits.' },
      { type: 'p', text: 'Here is a real morning. Fees read 12,400 USDT, up 18%. Search clicks up too. But registrations showed a red arrow at −22%. In 10 seconds I knew traffic was up and signups were down — so the problem lived on the landing page, not in acquisition. I went straight to the right fix instead of hunting. Before the dashboard I would not have caught that gap for days.' },

      { type: 'h2', text: 'Finding which campaign actually pays' },
      { type: 'p', text: 'The Attribution page is the reason I built this. It joins Search Console clicks, GA4 sessions, and Bitunix signups by UTM source, medium, and campaign. Every row shows clicks, sessions, signups, first deposits, first trades, and trading volume side by side.' },
      { type: 'p', text: 'Last quarter I ran two campaigns at the same budget. Campaign A drove 4,100 clicks; Campaign B drove 2,700. On clicks alone A looked like the winner. The table told the truth: A produced 6 first deposits, B produced 19. **Campaign B brought triple the deposits from fewer clicks.** I moved the budget the same afternoon.' },
      { type: 'quote', text: 'Clicks flatter you. Deposits pay you. The dashboard shows both in the same row so I never confuse the two again.' },
      { type: 'image', src: `${BASE}/bitunix-conversion-funnel.webp`, alt: 'Bitunix conversion funnel joining Google Search Console, GA4, and Bitunix partner data — from 2.88M impressions and 26.8K clicks through GA4 sessions to registrations, first deposits, and first trades, with conversion rates at each stage', title: 'Bitunix MarTech Dashboard — the full conversion funnel', caption: 'From search impressions to first trade, each stage shows volume and the conversion rate from the previous step.' },

      { type: 'h2', text: 'Cutting my dependence on brand traffic' },
      { type: 'p', text: 'The Search Performance page splits every query into branded and non-branded. Branded traffic feels good and means little — those people already know Bitunix. Non-branded traffic is real growth. When I first looked, branded clicks were 71% of my organic total. That scared me: SEO was riding on brand awareness, not earning new demand.' },
      { type: 'p', text: 'I used the non-branded keyword table to find queries with impressions but weak position — several near position 8 with strong impression counts. I wrote content for them. Ninety days later, non-branded clicks grew and the branded share dropped to 58%.' },
      { type: 'image', src: `${BASE}/bitunix-partner-performance.webp`, alt: 'Bitunix MarTech Dashboard Partner Performance page — "Where the downline stands" — showing 2,088 registrations, 552 first deposits, 9,196 all-time registrations, and $1.00B all-time trading volume', title: 'Bitunix MarTech Dashboard — partner performance', caption: 'Live partner-portal data — registrations, first deposits, and lifetime volume — refreshed daily at 03:00 Dubai.' },

      { type: 'h2', text: 'Catching the token before it broke' },
      { type: 'p', text: 'The Settings page shows the Bitunix token status and an audit log of every data job — expiry date, last refresh, records processed, and any error. One morning the token showed 9 days to expiry. In the old world I would have learned about that only after the data went stale. This time I rotated the token in two minutes and the partner data never skipped a day. The audit log also caught a failed GA4 job once; I fixed the cause before lunch instead of finding a hole in my numbers a week later.' },

      { type: 'h2', text: 'What changed' },
      { type: 'stats', items: [
        { value: '1 hr → 10 s', label: 'daily reporting time' },
        { value: '71% → 58%', label: 'brand-traffic dependence in a quarter' },
        { value: '3 → 1', label: 'sources, joined on one screen' },
        { value: '$1.00B', label: 'partner trading volume tracked' },
      ] },
      { type: 'p', text: 'My budget decisions now rest on deposits, not clicks. My partner data has not gone stale since I started watching the token. And the biggest change is the answer I give my manager — when someone asks which campaign paid for itself, I open the Attribution page and point at the row. The hunch is gone.' },

      { type: 'h2', text: 'How you can apply this' },
      { type: 'p', text: 'You don’t need three tools open at once. Pick your three core sources and join them on one shared key — for marketing that’s usually the UTM tag and the date. Lead with the metric that pays you, not the one that flatters you. Compare every number to the same window before it. And watch the boring operational things: a token that expires quietly will cost you a week of blind data.' },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 3 · KlindrOS
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'klindros',
    category: 'Platform · AI',
    year: '2026',
    role: 'Founder & Product Lead',
    title: 'KlindrOS — three products on one marketing engine',
    deck: 'One data pipeline and one 0–100 scoring framework power three products: Core for brand teams, KScore Business as the sales front door, and KScore Personal as a three-minute personal-brand audit.',
    // Auto-link brand terms in the body copy. Longest phrase wins, so
    // "KScore Personal" / "KScore Business" are matched before "KlindrOS".
    autolink: [
      { word: 'KScore Business', url: 'https://klindros.com/kscore?utm_source=bintangtobing.com&utm_medium=referral&utm_campaign=klindros-case-study&utm_content=case-study-business' },
      { word: 'KScore Personal', url: 'https://klindros.com/kscore/personal?utm_source=bintangtobing.com&utm_medium=referral&utm_campaign=klindros-case-study&utm_content=case-study-personal' },
      { word: 'KlindrOS', url: 'https://klindros.com/kscore?utm_source=bintangtobing.com&utm_medium=referral&utm_campaign=klindros-case-study&utm_content=case-study-brand' },
    ],
    stack: ['Multi-tenant', 'Laravel 11', 'Next.js 16', 'Expo', 'KEI scoring', 'Multi-touch attribution', 'GPT-4o'],
    live: { label: 'klindros.com', url: 'https://klindros.com' },
    ogImage: `${BASE}/og-klindros.jpg`,
    cardImage: `${BASE}/klindros-kscore-engine.webp`,
    cardImageAlt: 'KlindrOS KScore Intelligence Engine showing a marketing score of 81.6 and a radar of nine operational areas',
    cardDesc: 'A Bloomberg-terminal-style platform for brand teams, plus two scan products that share the same engine — from a growth agency’s six-client screen to a job seeker’s personal-brand audit.',
    cardTags: ['Multi-tenant', 'Attribution', 'KEI score', 'AI'],
    hero: {
      src: `${BASE}/klindros-roi-engine.webp`,
      alt: 'KlindrOS Core ROI Engine showing revenue $121,613, cost $25,500, overall ROI 376.92%, ROAS 4.77×, channel performance bars, top performers, underperformers, and a decision log',
      title: 'KlindrOS Core — the ROI attribution engine',
    },
    seo: {
      title: 'KlindrOS Marketing Platform Case Study | Bintang Tobing',
      description: 'How KlindrOS ships three products on one engine: Core (a Bloomberg-terminal-style platform for brand teams), KScore Business (a sales-opening account scan), and KScore Personal (a three-minute personal-brand audit across six platforms). Real use cases from agencies, growth leads, creators, and job seekers.',
      keywords: 'KlindrOS, KScore, marketing intelligence, multi-touch attribution, KEI score, MarTech platform, personal brand audit, multi-tenant, GPT-4o, Bintang Tobing case study',
    },
    blocks: [
      { type: 'lead', text: 'People ask me what KlindrOS actually does in daily work, not in a feature list. So I wrote the real scenarios. KlindrOS ships as three products on one shared engine — Core for brand teams, KScore Business as a single-account sales scan, and KScore Personal as a three-minute personal-brand grade. All three read from the same pipeline and the same 0–100 scoring framework, called KEI.' },

      { type: 'h2', text: 'Part 1 · KlindrOS Core' },
      { type: 'p', text: 'Brand managers, heads of growth, and agency partners log in to Core. They connect Instagram, TikTok, LinkedIn, YouTube, Facebook, and X, plus Meta Ads, Google Ads, TikTok Ads, LinkedIn Ads, and GA4. Core unifies all of it into one screen with KEI scores, ROI attribution, autonomous optimization, and AI-written insights. Think Bloomberg Terminal for marketing: high data density, sharp answers.' },

      { type: 'h2', text: 'An agency runs six clients from one screen' },
      { type: 'p', text: 'You run a growth agency with six D2C clients, each in a different set of tools. Reporting eats two days of your week. You connect each client as a separate tenant in Core, isolated by an `org_id` so no client ever sees another’s data. Each account syncs through a native connector, not a CSV re-export. You open one client and see the KEI score, top posts, channel ROI, and AI alerts in under a second, because Core serves cached daily aggregates instead of hitting each platform live.' },
      { type: 'quote', text: 'Your Monday reporting drops from two days to two hours. You spot that Client A wastes budget on last-click, and Client B has a rising fatigue signal on Reels — and you act on both the same morning.' },

      { type: 'h2', text: 'A growth lead fixes wasted ad spend' },
      { type: 'p', text: 'You spend Rp 200 million a month across Meta and Google. Your reports credit the last click, so paid search always looks like the hero and social always looks weak. You open ROI Attribution and switch from last-touch to a data-driven model. Core rebuilds the credit across every touchpoint — and you see that Instagram and TikTok start most of the journeys that paid search closes. **Social was doing the first job. Last click hid it.**' },
      { type: 'p', text: 'You move budget with Media Plan Creation, set Budget Guardrails so no channel drops below a floor or blows past a ceiling, and turn on Autonomous Optimization, which flags weak line items and proposes shifts. The emergency-stop button stays in reach the whole time. Your blended cost per acquisition falls because you paid for the work that actually drove sales.' },
      { type: 'image', src: `${BASE}/klindros-roi-engine.webp`, alt: 'KlindrOS ROI Engine showing revenue, cost, conversions, overall ROI 376.92%, ROAS 4.77×, a channel performance bar chart, top performers and underperformers by ROAS, and a decision log', title: 'KlindrOS Core — ROI attribution across every touchpoint', caption: 'Switch attribution models and the engine rebuilds channel credit — with a logged decision trail against the forecast.' },

      { type: 'h2', text: 'A brand catches creative fatigue early' },
      { type: 'p', text: 'Your Reels used to pull strong engagement; lately the numbers slide. Core watches this with the Organic Fatigue Index — it tracks the slope of your engagement over time, and when the slope turns down it flags fatigue and triggers the Creative Auto Pipeline. That pipeline generates fresh variants, runs an A/B test with a real significance check, and keeps the winner. No person sits in the critical path, so you replace tired creative before the drop hits revenue.' },
      { type: 'image', src: `${BASE}/klindros-acquisition-appsflyer.webp`, alt: 'KlindrOS acquisition channels donut chart showing installs per source and an AppsFlyer channel cost-history line chart with per-channel cost, installs, and average CPI', title: 'KlindrOS Core — mobile attribution and acquisition mix (AppsFlyer)', caption: 'Installs per source and daily spend per channel, with AI insights calling out the top performer.' },

      { type: 'h2', text: 'A CMO skips the Friday deck' },
      { type: 'p', text: 'Every Friday your team burns four hours building a board deck. Core sends a weekly stakeholder email on a schedule you set per tenant — trend summary, anomalies, action items, with a PDF and CSV attached. The Executive Dashboard adds forecasting and scenario planning: preview what happens to revenue if you shift budget or refresh creative, and compare the current plan against the proposed one with a confidence interval. The four-hour deck becomes a five-minute review.' },
      { type: 'p', text: 'What makes Core different: every number traces back to a real scan or event. KlindrOS does not sell customer data or train public AI models on tenant data. The KEI score is not a naive average — it weights each platform and corrects for the denominator effect, because 100,000 followers on Instagram do not equal 100,000 on LinkedIn.' },

      { type: 'h2', text: 'Part 2 · KScore Business' },
      { type: 'p', text: 'KScore Business is the single-account scan for companies — the front door to Core. It scans one brand account on one platform and returns a report framed for a decision-maker, in about two minutes. You sell marketing services; cold outreach gets ignored because it offers no value up front. So you run KScore Business on the prospect’s Instagram and reach out with the report, not a pitch: here is where your brand stands, and here is the one gap that costs you reach. The message leads with the prospect’s own data, and your reply rate climbs because you opened with proof instead of a promise.' },
      { type: 'quote', text: 'You turn a pitch into a diagnosis. The prospect sees the gap and the path to close it in one session.' },
      { type: 'p', text: 'The scan is free, because its job is to start the relationship, not to earn a fee. Personal Scan sends a person toward a self-service upgrade; Business Scan sends a company toward a sales call. Same engine, different door.' },

      { type: 'h2', text: 'Part 3 · KScore Personal' },
      { type: 'p', text: 'KScore Personal is the consumer scan — it grades your personal brand across six platforms (Instagram, TikTok, LinkedIn, YouTube, Facebook, X) in three minutes, with a score per platform, an AI analysis naming your three strongest growth moves, and a PDF report. You pick a persona when you start — Brand, Career, or Creator — and the persona shapes the analysis and the AI chat.' },
      { type: 'p', text: 'A job seeker runs the Career persona: the scan grades their LinkedIn against the other platforms, and the paid tier adds an optimal posting schedule as a day-by-hour matrix, a content mix, and three evidence-backed growth moves. A creator runs the Creator persona to find out why growth stalled — the scan reads the last ninety days and returns an audience-quality read and a consistency audit, then Klaira, the AI strategist, explains why the score sits where it sits. Klaira talks strategy; she does not write your captions.' },
      { type: 'image', src: `${BASE}/klindros-kscore-engine.webp`, alt: 'KlindrOS KScore Intelligence Engine showing a KScore of 81.6 (Market Leader), 70% confidence, PGI 82.32, 64th percentile, a radar chart of nine operational areas, and five performance indices for SEO, data maturity, growth momentum, media efficiency, and creative performance', title: 'KlindrOS — the KScore intelligence engine', caption: 'Nine operational areas and five performance indices roll up into one 0–100 KEI score with an industry percentile.' },

      { type: 'h2', text: 'Honest unit economics' },
      { type: 'p', text: 'I include this so you see the model is real, not smoke. A baseline Personal scan costs KlindrOS about eight US cents — six scrapers around four cents together, the AI analysis about four cents, with YouTube data and IP geolocation on free tiers. A full Klaira chat at the fourteen-turn ceiling pushes the worst case to about thirty-four cents. Every cost gets logged per event in a vendor-cost dashboard, so the unit economics stay visible.' },

      { type: 'h2', text: 'How the three work together' },
      { type: 'stats', items: [
        { value: '3', label: 'products on one shared engine' },
        { value: '6', label: 'social platforms scored' },
        { value: '~2 min', label: 'a full account scan' },
        { value: '~$0.08', label: 'cost to run a personal scan' },
      ] },
      { type: 'p', text: 'The three products form one funnel. KScore Personal reaches an individual and builds awareness. KScore Business reaches a company and captures a lead. KlindrOS Core serves the brand team that signs on. You can enter at any door — a creator who scans a personal brand today may run an agency tomorrow that lives in Core — because one engine feeds all three.' },
      { type: 'quote', text: 'Lead with the customer’s own data. Trust the attribution, not the last click. Measure before you act. And keep the economics honest — you can price and scale on numbers you can see.' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 4 · KlindrOS CRM
// ─────────────────────────────────────────────────────────────
caseStudies.push({
  slug: 'klindros-crm',
  category: 'CRM · Growth Ops',
  year: '2026',
  role: 'Founder & Full-Stack Engineer',
  title: 'The KlindrOS CRM — turning a stranger into a paying tenant',
  deck: 'The engine behind the scans: four lead doors into one workspace, two-way email over IMAP, Calendly write-backs, a one-click convert-to-tenant, and a Ghost blog wired straight into the same sales pipeline.',
  stack: ['Laravel', 'Filament', 'IMAP two-way email', 'Calendly webhooks', 'Ghost CMS API', 'GA4 attribution'],
  live: null,
  autolink: [
    { word: 'KScore Business', url: 'https://klindros.com/kscore?utm_source=bintangtobing.com&utm_medium=referral&utm_campaign=klindros-crm-case-study&utm_content=case-study-business' },
    { word: 'KScore Personal', url: 'https://klindros.com/kscore/personal?utm_source=bintangtobing.com&utm_medium=referral&utm_campaign=klindros-crm-case-study&utm_content=case-study-personal' },
    { word: 'KlindrOS', url: 'https://klindros.com/kscore?utm_source=bintangtobing.com&utm_medium=referral&utm_campaign=klindros-crm-case-study&utm_content=case-study-brand' },
  ],
  ogImage: `${BASE}/og-klindros-crm.jpg`,
  cardImage: `${BASE}/klindros-crm-dashboard.webp`,
  cardImageAlt: 'KlindrOS CRM dashboard showing KScore Personal acquisition — signups, verified rate, paid scans, revenue, and daily activity',
  cardDesc: 'A Filament CRM that turns strangers into paying customers — four lead doors, two-way IMAP email, Calendly write-backs, one-click convert-to-tenant, and a Ghost blog joined to sales.',
  cardTags: ['Laravel', 'Filament', 'IMAP', 'Ghost CMS'],
  hero: {
    src: `${BASE}/klindros-crm-dashboard.webp`,
    alt: 'KlindrOS CRM dashboard — KScore Personal acquisition view with signups, 80% verified, paid scans, Rp 211,837 revenue, average score, top persona, and a daily activity chart',
    title: 'KlindrOS CRM — the acquisition dashboard',
  },
  seo: {
    title: 'KlindrOS CRM Case Study — Scan to Tenant | Bintang Tobing',
    description: 'How I built the KlindrOS CRM: a Filament admin that turns strangers into paying customers — four lead doors, two-way IMAP email, Calendly write-backs, a one-click convert-to-tenant, and a Ghost blog wired straight into the same sales engine.',
    keywords: 'KlindrOS CRM, Filament CRM, Laravel, two-way email IMAP, Calendly webhook, Ghost CMS integration, lead pipeline, sales automation, KScore, Bintang Tobing case study',
  },
  blocks: [
    { type: 'lead', text: 'People see the marketing platform and the scans, but they miss the engine that turns a stranger into a paying customer. That engine is the CRM. Every workflow below is real — my sales team runs these steps every day.' },

    { type: 'h2', text: 'What the CRM is' },
    { type: 'p', text: 'The CRM is an admin panel served at `/crm`. It runs on Filament inside the same Laravel backend as the rest of KlindrOS, under a module called PublicScanner. It is internal tooling for the KlindrOS and Digicrats sales team, and it is **single-tenant** — the product platform isolates every customer, but the CRM is our own house, so it stays one shared workspace for the whole team.' },
    { type: 'p', text: 'You sign in with Google. The panel never creates accounts on its own — it matches your Google email to an existing approved user, checks that you are active and hold an Admin or Super Admin role, then lets you in. Failed attempts go to a security log, and a time-based one-time passcode guards the login as a second factor.' },

    { type: 'h2', text: 'The four doors a lead comes through' },
    { type: 'p', text: 'A lead reaches the CRM through four doors, and every door feeds one workspace.' },
    { type: 'list', ordered: true, items: [
      'A **KScore Business** scan — a company scans one account on the landing page; the team sees the score before they write a word.',
      'A **KScore Personal** scan — an individual runs the three-minute personal-brand scan; a hot consumer signal never gets lost in the business pipeline.',
      'A **Calendly booking** — a prospect books a call; the webhook creates or matches the lead and moves it forward.',
      'The **blog** — a reader subscribes through Ghost and flows into the same module.',
    ] },
    { type: 'p', text: 'Manual entry, referral, and bulk import round out the sources.' },

    { type: 'h2', text: 'What lives inside' },
    { type: 'p', text: 'Leads are the core record — business name, contact, industry, size, status, source, assignee, and the full UTM trail from the landing page, each carrying its lite scans, activity timeline, and email threads. Alongside them sit personal-scan leads, ten prewritten email templates across four stages, a shared library of reusable PDF attachments, blog subscribers kept in sync with Ghost, and trackable short links with QR codes and click analytics. Three working pages — Scheduled Outbox, Bulk Send Campaign, and Broadcast Queue — drive the sending.' },
    { type: 'image', src: `${BASE}/klindros-crm-short-links.webp`, alt: 'KlindrOS CRM Short Links analytics — a short URL with UTM presets, server-side backend click log, GA4 attribution, a humans-vs-bots clicks-over-time chart, and top countries and cities', title: 'KlindrOS CRM — trackable short links with server-side + GA4 attribution', caption: 'Every outreach link is measured twice: a server-side backend log and GA4, split by real humans vs bots.' },

    { type: 'h2', text: 'The email engine' },
    { type: 'p', text: 'The CRM sends real email, not links to another tool. It authenticates as `hello@klindros.com` and sends as the `sales@` alias, so the prospect sees a sales address. Every email builds through one pipeline: substitute the lead’s variables, convert markdown to HTML, append the sender’s signature, wrap it in a branded template, inject a tracking pixel, rewrite every link through a click redirect with UTM, and add a one-click unsubscribe header. Each message gets a Message-ID in the KlindrOS domain — the key that ties replies back to the right conversation later.' },

    { type: 'h2', text: 'Working a lead from scan to signed customer' },
    { type: 'p', text: 'A growth head runs a KScore Business scan on their Instagram. The lead lands as new, scan attached. You read the KEI score and the two platform gaps, pick the cold-intro template on the attribution gap, and lead with the brand’s own numbers. The status moves to contacted. The CRM shows the prospect opened the email twice and clicked the report link — and that first open flips the lead to email-verified on its own.' },
    { type: 'p', text: 'No reply after a day, so you send the follow-up. The prospect replies from their own inbox and it threads back onto the lead, matched by the reply header — you never leave the panel. They ask for a demo, you send an invite, they book, and the lead moves to qualified automatically. After the demo you move it to trial. When they agree to buy, you click **Convert to Customer**.' },
    { type: 'quote', text: 'One atomic action creates an Organization, an admin user with a one-time password, attaches the Super Admin role, and flips the lead to customer. The lead just became a live tenant on the platform.' },

    { type: 'h2', text: 'Two-way email' },
    { type: 'p', text: 'The CRM reads replies, not just sends them. A background command polls the inbox every two minutes over IMAP and routes each message through a matcher: `In-Reply-To` against an outbound Message-ID first, then the references chain, then a subject starting with Re/Fwd plus sender, then the sender email alone as a new thread. Matched mail moves to a Processed folder so it never gets read twice, and the team answers from the timeline without opening Gmail. Failed and bounced sends are first-class states, shown in red on the dashboard.' },

    { type: 'h2', text: 'Booking meetings with Calendly' },
    { type: 'p', text: 'Each lead has a Send Meeting Invite action — pick an intro call, a demo, or a pricing discussion, and the CRM asks Calendly for a single-use scheduling link, decorates it with the lead’s details and a tracking id, and emails it through the same branded pipeline. When the prospect acts, a Calendly webhook writes back on its own: a booking moves the lead from new to qualified and records the times, location, and answers; a cancel logs the reason. The webhook proves it is really Calendly through a secret in the URL path, because the plan issues no signing keys.' },

    { type: 'h2', text: 'How the Ghost blog joins the CRM' },
    { type: 'p', text: 'Here is the part people miss: the blog is not a separate island. Our Ghost CMS runs the KlindrOS blog at `cms.klindros.com` and wires straight into the same CRM module — content and sales share one engine, one SMTP account, and one branded email wrapper. Ghost sends three webhooks, each verified by an HMAC signature with a five-minute replay window: **member added** writes the reader into the subscribers table, **member deleted** flips them to unsubscribed but keeps the row, and **post published** enriches the article through the Content API and queues it for a blast with an idempotency lock so a double-fire never double-sends.' },
    { type: 'p', text: 'Every evening at 18:00 Jakarta, a scheduled job gathers new posts and sends one digest to every active subscriber, one message at a time with a sixty-second gap to respect the mail server. The digest and the per-post blast use the same branded wrapper and the same tracking as the sales email.' },
    { type: 'image', src: `${BASE}/klindros-crm-vendor-costs.webp`, alt: 'KlindrOS CRM Vendor Costs page — total cost $0.0823 across 1,059 calls, a daily cost breakdown stacked by vendor (OpenAI, Apify, Other), and a per-actor/model table with cost per call and token counts', title: 'KlindrOS CRM — per-vendor cost tracking', caption: 'Every scan and AI call is costed per vendor and per actor/model, so the unit economics stay visible next to the pipeline.' },

    { type: 'h2', text: 'A blog reader becomes a sales conversation' },
    { type: 'p', text: 'A marketer reads a KlindrOS article on attribution and subscribes for the digest. Ghost fires the member-added webhook, she lands in the subscribers table, and she gets the branded welcome that evening. Over two weeks she opens five digests and clicks three articles — all tracked through the same pixel and redirect the sales email uses. Your team sees an engaged contact who keeps returning to attribution content. That is a buying signal.' },
    { type: 'quote', text: 'You open with a KScore Business scan of her company’s account. The blog reader became a warm lead, and the warmth came from data the CRM already held. Content fed the pipeline with no manual export.' },

    { type: 'h2', text: 'What you can take away' },
    { type: 'stats', items: [
      { value: '4', label: 'lead doors into one workspace' },
      { value: '2 min', label: 'IMAP reply-polling cadence' },
      { value: '1-click', label: 'convert a lead into a live tenant' },
      { value: '18:00', label: 'nightly Ghost digest, Jakarta time' },
    ] },
    { type: 'p', text: 'Put every door into one workspace, and your team works one pipeline, not five. Read the replies where you send. Let the tools write back on their own — Calendly bookings, opens, clicks, and blog engagement all log themselves. Close the loop from scan to tenant in one action. And join content to sales: a reader who keeps clicking attribution posts is a lead the data already warmed.' },
  ],
});

export const caseStudyBySlug = Object.fromEntries(caseStudies.map((c) => [c.slug, c]));
