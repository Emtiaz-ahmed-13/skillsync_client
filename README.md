# SkillSync Client

Frontend web application for **SkillSync** — a professional collaboration platform for freelancers and clients.

**Production:** https://skillsync-client-emtiaz.vercel.app  
**API:** https://skillsync-server-emtiaz.vercel.app/api/v1

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Auth | NextAuth.js 4 (Credentials + GitHub) |
| UI | Radix UI, shadcn-style components |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Payments | Stripe.js |
| Real-time | Socket.io client (local dev) |
| Deploy | Vercel |

---

## Features

### Public

- Landing page with live platform stats
- Project browsing with search and filters
- Freelancer directory (`/freelancers`)
- Articles/blog
- FAQ, features, how-it-works sections

### Authentication

- Email/password login and signup
- **GitHub OAuth** — auto-creates **freelancer** account (no role selection)
- Forgot password and reset password flows
- Email verification

### Client dashboard

- Project creation with **PDF AI brief analyzer**
- Bid management (accept/reject → auto milestones)
- Milestone **escrow payments** (Stripe)
- Work submission review
- Real-time messaging
- Reviews

### Freelancer dashboard

- Browse and bid on projects
- AI sprint planning and timeline estimation
- Task management (Kanban)
- Work submission with GitHub/live links
- Profile management (skills, portfolio, hourly rate)
- Active projects and bids

### Admin dashboard

- Platform analytics
- User management
- Project approval workflow
- Dispute resolution

---

## Getting Started

### Prerequisites

- Node.js 18+
- Running [SkillSync Server](../skillsync_server) (local or production API)
- npm

### Installation

```bash
cd skillsync_client
npm install
cp .env.production.example .env.local   # then fill in values
```

### Environment Variables

Create `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-min-32-chars

# Local backend
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1

# Socket.io (local dev only — leave empty on Vercel)
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001

# GitHub App OAuth (skillsync-client)
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# Stripe (optional — for milestone payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Run locally

```bash
# Terminal 1 — start backend
cd ../skillsync_server && npm run dev

# Terminal 2 — start frontend
npm run dev
```

Open **http://localhost:3000**

### Production build

```bash
npm run build
npm start
```

---

## GitHub OAuth Setup

1. Create a GitHub App at [github.com/settings/apps](https://github.com/settings/apps)
2. App name: `skillsync-client` (no underscores)
3. Callback URLs:
   - `http://localhost:3000/api/auth/callback/github`
   - `https://skillsync-client-emtiaz.vercel.app/api/auth/callback/github`
4. Permissions: **Email** (read), **Profile** (read)
5. Copy **Client ID** and generate **Client Secret** → add to `.env.local` and Vercel

GitHub sign-in automatically registers users as **freelancers** with verified email.

---

## API Proxy

The client proxies all `/api/v1/*` requests to the backend via Next.js rewrites (`next.config.ts`). No CORS issues in browser — requests go through the same origin.

```
Browser  →  localhost:3000/api/v1/...  →  localhost:5001/api/v1/...
Production → skillsync-client.../api/v1/... → skillsync-server.../api/v1/...
```

---

## Project Structure

```
skillsync_client/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx
│   ├── auth/                       # login, signup, forgot/reset password, verify
│   ├── dashboard/
│   │   ├── client/                 # Client dashboard + projects
│   │   ├── freelancer/             # Freelancer dashboard + tasks + bids
│   │   └── admin/                  # Admin panel + disputes
│   ├── projects/                   # Public project listing
│   ├── freelancers/                # Freelancer discovery
│   ├── articles/
│   └── api/auth/[...nextauth]/     # NextAuth route
├── components/
│   ├── features/                   # Domain components (dashboard, projects, chat…)
│   ├── shared/                     # Navbar, hero, stats, notifications
│   └── ui/                         # Reusable UI primitives
├── lib/
│   ├── api/                        # API client modules
│   └── hooks/                      # useNotifications, etc.
├── hooks/
│   └── use-socket.ts               # Socket.io hook
├── public/
│   └── manifest.json               # PWA manifest
├── next.config.ts
├── vercel.json
└── .env.production.example
```

---

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/auth/login` | Login (email + GitHub) |
| `/auth/signup` | Register (email + GitHub) |
| `/projects` | Browse approved projects |
| `/freelancers` | Find freelancers |
| `/dashboard` | Role-based redirect |
| `/dashboard/client` | Client home |
| `/dashboard/freelancer` | Freelancer home |
| `/dashboard/admin` | Admin panel |
| `/dashboard/messages` | Chat |

---

## Deployment (Vercel)

1. Link project: `vercel link`
2. Set environment variables:

| Variable | Example |
|----------|---------|
| `NEXTAUTH_URL` | `https://skillsync-client-emtiaz.vercel.app` |
| `NEXTAUTH_SECRET` | Random 32+ char string |
| `NEXT_PUBLIC_API_URL` | `https://skillsync-server-emtiaz.vercel.app/api/v1` |
| `GITHUB_ID` | GitHub App Client ID |
| `GITHUB_SECRET` | GitHub App Client Secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (optional) |

3. Deploy:

```bash
vercel --prod
```

> **Note:** Leave `NEXT_PUBLIC_SOCKET_URL` empty on Vercel. Chat uses REST + polling in production.

---

## Test Accounts

After running `npm run seed:admin` on the server:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@skillsync.dev` | `Admin@123456` |

GitHub login creates a new freelancer account automatically.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint |

---

## License

MIT
