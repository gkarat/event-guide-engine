# Event Guide CLI

Command-line tools for scaffolding and managing Event Guide instances.

## Installation

Published on npm as `create-event-guide-app`:

```bash
npx create-event-guide-app my-event-guide
```

## Commands

### Scaffold New Instance

Create a new Event Guide instance:

```bash
npx create-event-guide-app <project-name>
```

This will:

1. Clone the Event Guide app template (only `/app` directory)
2. Initialize git with upstream remote configured for subtree tracking
3. Copy version tracking file

The scaffold sets up git subtree tracking so updates only pull changes from the `/app` directory, not `/cli` or root files.

After scaffolding, you need to:

1. Edit `config/instance.ts` with your settings
2. Copy `.env.example` to `.env` and configure
3. Replace logos in `public/media/`
4. Run `pnpm install && pnpm dev`

### Update Existing Instance

Update an existing instance from upstream:

```bash
cd your-event-guide-project
npx create-event-guide-app update
```

This will:

1. Verify it's a valid Event Guide project
2. Fetch latest version from upstream
3. Show changelog
4. Create backup branch
5. Use git subtree to pull **only** `/app` directory changes from upstream
6. Merge updates (preserving your config and media)

**How subtree works:**

- Only pulls changes from upstream's `/app` directory
- Ignores `/cli`, root `README.md`, and other monorepo files
- Clean merges without manual cleanup

**Protected directories** (never touched by update):

- `/config/` - Your instance configuration
- `/public/media/` - Your logos and assets
- `.env` - Your secrets

## Development

Working on the CLI itself:

```bash
cd cli
pnpm install

# Run in dev mode
pnpm dev scaffold test-project

# Build for production
pnpm build

# Test locally
npm link
create-event-guide-app test-project
```

## Publishing

```bash
cd cli
pnpm build
npm publish
```

## Architecture

- **scaffold.ts** - Creates new instances by cloning app directory
- **update.ts** - Merges updates from upstream while preserving customizations
- **validation.ts** - Input validation utilities
- **types.ts** - TypeScript type definitions
