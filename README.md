# Event Guide

A customizable event management platform for communities. Built with Next.js and Payload CMS.

## What is Event Guide?

A ready-to-deploy application that anyone can fork, configure, and run for their local event scene. Manage events, artists, and venues with minimal technical knowledge.

## Repository Structure

This is a monorepo containing:

- **`/app`** - The Event Guide application template
- **`/cli`** - Scaffolding and update tools (published as `create-event-guide-app`)

## Quick Start

### For Users: Create Your Instance

```bash
# Create a new Event Guide instance
npx create-event-guide-app my-city-events
cd my-city-events
```

### Configuration

After scaffolding, you need to configure three areas:

#### 1. Instance Configuration (`/config/instance.ts`)

Edit `/config/instance.ts` with your settings:

```typescript
export const config = {
  site: {
    name: "My City Events",
    url: "https://mycity-events.com",
    timezone: "America/New_York",
  },
  theme: {
    brandColor: "#FF0000",
    textPrimary: "#1A1A1A",
    textSecondary: "#666666",
    // ... see file for all options
  },
  // ... branding, i18n, etc.
};
```

This is your main configuration file - customize colors, fonts, logos, and localization.

#### 2. Environment Variables (`.env`)

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URI=postgresql://user:password@localhost:5432/eventguide
PAYLOAD_SECRET=your-secret-32-chars-min  # Generate with: openssl rand -base64 32
```

Only two environment variables needed - database and Payload secret.

#### 3. Branding Assets (`/public/media/`)

Replace these placeholder files with your own:

- `logo-desktop.svg` (650x100px recommended)
- `logo-mobile.svg` (250x50px recommended)
- `logo-footer.svg` (SVG recommended)

### Install and Run

```bash
pnpm install
pnpm dev
```

Visit http://localhost:3000

## First-Time Setup

### 1. Database Migrations (PostgreSQL only)

If using PostgreSQL, Payload will prompt you to run migrations on first start. Follow the prompts or run:

```bash
pnpm payload migrate
```

SQLite users can skip this step.

### 2. Create First Admin User

1. Visit **http://localhost:3000/admin**
2. You'll be prompted to create your first admin user
3. **Important**: Use a real email address if you plan to enable email verification
4. Set a strong password

### 3. Configure Site Settings

After logging in:

1. Go to **Globals → Site Config** in the Payload admin panel
2. Set your UI text and labels:
   - Navigation menu labels (Events, Artists)
   - Footer link text
3. These override the defaults and support multi-language content

### 4. Familiarize with Payload CMS

Take a few minutes to explore the admin panel:

- **Collections**: Events, Artists, Venues, Media, Users, Feedback
- **Globals**: Site Config (UI text and labels)
- **Media**: Upload and manage images
- **Users**: Manage admin and moderator accounts

See [Payload CMS Documentation](https://payloadcms.com/docs) for detailed guides.

## Features

- 📅 Event management with artists and venues
- 🎨 Fully customizable theming (colors, fonts, logos)
- 🌍 Multi-language content support
- 🔐 Role-based access control (Admin, Moderator, User)
- 🚀 Deploy anywhere (Vercel, Railway, Fly.io, self-hosted)
- 🔄 Easy updates from upstream

## Updating Your Instance

Pull updates from the main repository:

```bash
cd your-event-guide-project
npx create-event-guide-app update
```

The update command:

- Fetches latest version from upstream
- Shows changelog
- Creates automatic backup branch
- Uses git subtree to merge **only** `/app` directory changes
- Preserves your `/config`, `/public/media`, and `.env`

See **[CLI Documentation](./cli/README.md)** for detailed update workflow.

## Architecture

- **Frontend**: Next.js 15 with App Router
- **CMS**: Payload CMS 3.x
- **Database**: PostgreSQL (or SQLite)
- **Styling**: CSS Modules with dynamic theme system
- **Distribution**: Git subtree + npm CLI

## Documentation

- **[CLI Tools](./cli/README.md)** - Scaffolding and update commands
- **[App Documentation](./app/README.md)** - Application details (if exists)

## License

MIT - fork and customize as needed!
