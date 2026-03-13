# Nanu Marketing Hub

Internal marketing operations dashboard for the Nanu team.

## Quick Start (Local)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

### Option A: GitHub (Recommended)

1. Push this repo to GitHub (public or private)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the GitHub repo
4. Click **Deploy** — no config needed, Vercel auto-detects Next.js

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts. Done.

## Team Logins

| Name               | Username    | Default PIN |
|--------------------|-------------|-------------|
| Nicholas Martin    | nicholas    | 1234        |
| Holly Wood         | holly       | 2345        |
| Sean Cahill        | sean        | 3456        |
| Alexander Lockwood | alexander   | 4567        |
| Ed                 | ed          | 5678        |

Admin can reset PINs and add new users from the Admin panel.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Lucide React** (icons)
- **Inline styles** + CSS classes for responsiveness
- **No database** — v1 uses in-memory state (ready for backend upgrade)

## Project Structure

```
nanu-hub/
├── app/
│   ├── globals.css       ← responsive CSS + fonts
│   ├── layout.tsx         ← root layout + metadata
│   └── page.tsx           ← entry point
├── components/
│   └── MarketingHub.tsx   ← main dashboard component
├── public/
│   └── favicon.svg        ← Nanu logo
├── package.json
├── next.config.js
└── tsconfig.json
```
