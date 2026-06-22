# Project Structure — Kayabé

Your original template assumed a single `src/` tree, which fits a single-app project. Kayabé has two deployable services (Next.js frontend, NestJS + Socket.io backend), so a single shared `src/` doesn't map cleanly — frontend and backend have different build targets, dependencies, and deploy destinations. Structured as a monorepo instead.

## Top-Level Layout

```
kayabe/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend + Socket.io
├── packages/
│   └── shared/       # Shared TypeScript types (DTOs, enums) used by both apps
├── docs/             # PRD, stack.md, security.md, etc.
├── e2e/              # Playwright E2E tests (will implement on Sprint X)
├── package.json      # Workspace root (npm workspaces)
└── tsconfig.base.json
```

## apps/web/ (Next.js)

```
apps/web/
├── src/
│   ├── app/                 # App Router pages/layouts/routes
│   ├── components/          # Reusable UI building blocks
│   ├── features/            # Feature modules: auth/, workspaces/, projects/, tasks/, board/, notifications/
│   ├── hooks/               # useSocket, useAuth, useQuery hooks
│   ├── services/            # API client, Socket.io client wrapper
│   └── utils/               # Formatters, validators, shared constants
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── eslint.config.mjs
```

## apps/api/ (NestJS)

```
apps/api/
├── src/
│   ├── modules/             # One module per domain area
│   ├── domain/              # Core business entities and rules
│   ├── application/         # Use cases/orchestration
│   ├── infrastructure/      # Prisma, Socket.io gateway
│   ├── config/              # Environment parsing, feature flags
│   └── common/              # Guards, interceptors, decorators
├── package.json
├── tsconfig.json
└── main.ts
```

## packages/shared/

```
packages/shared/
├── src/
│   ├── types/               # Task, Project, Workspace, User, Role enums
│   └── constants/           # Shared constants
├── package.json
└── tsconfig.json
```

## Testing

- Unit/integration tests: co-located `*.spec.ts` files
- E2E tests: `e2e/` directory at root (Playwright)
<!-- `npm init playwright@latest` -->
