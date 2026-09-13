# Repository Guidelines

## Project Structure & Module Organization
Core app code lives in `src/` with two active UI areas:
- `src/client/`: main React client entry (`main.jsx`), legacy/shared UI assets, providers, hooks, and component-heavy feature screens.
- `src/components/`, `src/hooks/`, `src/tables/`, `src/utils/`, `src/lib/`: reusable UI, data hooks, table views, utility logic, and Supabase helpers.

Static files are in `public/`; production output is generated in `dist/`. Configuration is at root (`vite.config.js`, `tailwind.config.js`, `tsconfig.json`, `components.json`).

## Build, Test, and Development Commands
- `npm run dev`: runs the Express/Nodemon server (`src/server/main.js`) for full-stack local development.
- `npm run dev:vite`: runs the Vite frontend dev server only.
- `npm run build`: creates a production frontend bundle in `dist/`.
- `npm run preview`: serves the built bundle locally on port `8080`.
- `npm run start`: starts server mode with `NODE_ENV=production`.
- `npx tsc --noEmit`: runs strict type-checking using `tsconfig.json`.

## Coding Style & Naming Conventions
Use TypeScript for new logic where possible (`.ts`/`.tsx`), with React function components and hooks. Follow existing style: 2-space indentation, semicolons, double quotes, and named exports for shared hooks/utilities.

Naming patterns:
- Components: `PascalCase` (`MonthlyAbsenceTable.tsx`)
- Hooks: `useCamelCase` (`useDailyReportData.ts`)
- Utilities/constants/selectors: `camelCase` files grouped by domain

Keep imports path-aliased through `@/*` when targeting `src/*`.

## Testing Guidelines
There is currently no committed automated test suite or `npm test` script. At minimum, validate changes by:
1. Running `npx tsc --noEmit`
2. Running `npm run build`
3. Smoke-testing impacted flows in `npm run dev` or `npm run dev:vite`

When adding tests, colocate them near the feature (`*.test.ts`/`*.test.tsx`) and prioritize selectors, table transforms, and absence-calculation utilities.

## Commit & Pull Request Guidelines
Git history mostly follows Conventional Commits (`feat: ...`, `fix: ...`) with occasional plain summaries. Prefer:
- `feat(scope): short description`
- `fix(scope): short description`

PRs should include:
1. What changed and why
2. Linked issue/task (if available)
3. Screenshots or PDF samples for UI/print changes
4. Local verification steps and commands run

## Security & Configuration Tips
Keep secrets in `.env` only; never commit credentials. Supabase access is centralized via `src/lib/supabaseClient.ts`, so apply auth/data-access changes there first.
