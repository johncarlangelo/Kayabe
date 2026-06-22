# Kayabé - Collaborative Task Management Platform

A monorepo project containing a Next.js frontend, NestJS backend, and shared TypeScript types.

## Project Structure

This is a monorepo using npm workspaces with the following structure:

```
kayabe/
├── apps/
│   ├── web/          # Next.js frontend application
│   └── api/          # NestJS backend + Socket.io server
├── packages/
│   └── shared/       # Shared TypeScript types and constants
├── docs/             # Documentation (architecture, PRD, security, etc.)
```
<!-- └── e2e/              # Playwright end-to-end tests, will add on Sprint X -->

### apps/web (Next.js Frontend)

**Location**: `apps/web/`

- **Next.js 16.2.9** with App Router
- **React 19.2.4** with TypeScript
- **Tailwind CSS** for styling
- **ESLint** for code quality

Structure:
- `src/app/` - App Router pages and layouts
- `src/components/` - Reusable UI components
- `src/features/` - Feature modules (auth, workspaces, projects, tasks, etc.)
- `src/hooks/` - Custom React hooks
- `src/services/` - API client and Socket.io wrapper
- `src/utils/` - Formatters, validators, constants
- `public/` - Static assets

### apps/api (NestJS Backend)

**Location**: `apps/api/`

- **NestJS** - Node.js framework with TypeScript
- **Socket.io** - Real-time communication
- **Prisma** - Database ORM (planned)

Structure:
- `src/modules/` - Feature modules (auth, workspaces, projects, tasks, notifications)
- `src/domain/` - Core business entities and rules
- `src/application/` - Use cases and orchestration
- `src/infrastructure/` - Repositories, Socket.io gateway, integrations
- `src/config/` - Environment and feature flag configuration
- `src/common/` - Guards, interceptors, decorators, RBAC

### packages/shared

**Location**: `packages/shared/`

- Shared TypeScript types and interfaces
- Constants and enums used across frontend and backend
- Exports: `@kayabe/shared/types`, `@kayabe/shared/constants`

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+ or pnpm

### Installation

```bash
# Install dependencies for all workspaces
npm install
```

### Development

```bash
# Run the Next.js frontend (port 3000)
npm run dev

# Run the NestJS backend (port 3001)
npm run dev -w apps/api

# Run both simultaneously (requires separate terminals or process manager)
```

### Build

```bash
# Build all workspaces
npm run build

# Build specific workspace
npm run build -w apps/web
npm run build -w apps/api
```

### Linting

```bash
# Lint all workspaces
npm run lint

# Lint specific workspace
npm run lint -w apps/web
npm run lint -w apps/api
```

## Development Workflow

1. **Frontend changes**: Edit files in `apps/web/src/`
2. **Backend changes**: Edit files in `apps/api/src/`
3. **Shared types**: Edit `packages/shared/src/types/` when adding new types
4. **Update both apps** to use new shared types

## Architecture Notes

- **Monorepo Pattern**: Single repository with multiple applications sharing types
- **Domain-Driven Design (Backend)**: Business logic separated in domain/application/infrastructure layers
- **Feature Modules (Frontend)**: Organized by business domain
- **Shared Types**: Backend and frontend use the same TypeScript types for DTOs and entities

## Documentation

See `docs/structure.md` for detailed architecture documentation.

## Contributing

1. Create feature branches from `main`
2. Write tests for new features
3. Ensure `npm run lint` passes
4. Submit pull requests with clear descriptions
