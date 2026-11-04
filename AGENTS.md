# Project Rules

## Stack
- Vite + React 19 + TypeScript.
- TanStack Router and TanStack Query.
- Follow existing architecture, dependencies, and conventions.

## Commands
- `bun run lint` — ESLint.
- `bun run typecheck` — TypeScript.
- **Never run the build command unless explicitly asked.**

## Reuse Before Creating
Before implementing anything, search the relevant codebase for existing components, hooks, utilities, types, and services.

Follow this order:
1. Reuse existing code if suitable.
2. Extend it if backward-compatible.
3. Extract duplicated logic when beneficial.
4. Create new code only when necessary.

Avoid duplicate logic, unnecessary abstractions, dependencies, and files.

## File Placement
Follow existing project conventions. Otherwise:
- `components/ui/` — UI primitives.
- `hooks/` — Reusable React hooks.
- `utils/` — Pure helper functions.
- `lib/` — Library configuration and integrations.
- `services/` — API operations.
- `types/` — Shared TypeScript types.
- `features/<name>/` — Feature-specific components, hooks, and utilities.

Keep feature-specific code inside its feature. Never put React components or hooks in `utils/`.

## UI Rules
- Active/open borders must remain present: use `border-transparent` by default and change only the color on activation. Example: `border border-transparent group-data-[state=open]:border-primary`.
- Always use `PageHeader` from `@/components/page-header` for page titles and descriptions. Never manually create page-level `<h1>` + `<p>` blocks instead.
- Pass page action buttons through `PageHeader`'s `children`.
- Reuse existing UI and shadcn components. Check actual props and existing usage before implementation.

## Code Quality
- Follow existing TanStack Router and TanStack Query patterns.
- Reuse API clients, hooks, query keys, types, and services.
- Use proper TypeScript types; avoid `any`.
- Keep components focused and accessible.
- Follow existing loading, error, empty-state, form, and styling conventions.
- Avoid unnecessary effects, prop drilling, duplicate API logic, and circular dependencies.

## Documentation
Read relevant documentation when needed:
- `docs/project-structure.md`
- `docs/conventions.md`
- `docs/shadcn-ui.md`

## Validation
- Run  `bun run typecheck` when appropriate.
- Never run the build command unless asked.
- Do not modify unrelated files.
- Report checks that were not run.

## Final Response
Briefly report:
- Reused existing code.
- New files and their locations.
- Existing code extended and why.
- Lint/typecheck results.

**Golden rule:** Search → Reuse → Extend → Create only when necessary → Validate.