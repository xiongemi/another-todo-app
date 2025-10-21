# Repository Guidelines

## Project Structure & Module Organization
- Nx monorepo. Primary app in `apps/another-todo-app` (Next.js). API/server in `apps/mcp-server` (Express). E2E in `apps/*-e2e`.
- Shared code in `libs/date` and `libs/states`.
- Config at root: `nx.json`, `tsconfig.base.json`, `eslint.config.mjs`, `.editorconfig`, `.prettierrc`.

## Build, Test, and Development Commands
- App (Next.js): `npx nx dev another-todo-app` (dev), `npx nx build another-todo-app` (prod), `npx nx show project another-todo-app` (targets).
- Server (Node): `npx nx serve @another-todo-app/mcp-server` (watch), `npx nx build @another-todo-app/mcp-server` (bundle to `apps/mcp-server/dist`).
- Unit tests (Jest): `npx nx test <project>` (e.g., `libs/states`).
- E2E (Playwright): `npx nx e2e another-todo-app-e2e`.
- Lint: `npx nx lint <project>`.

## Coding Style & Naming Conventions
- TypeScript throughout; 2‑space indent per `.editorconfig`.
- Prettier + ESLint: run `npx nx lint <project>` before commits.
- File naming: React components `PascalCase.tsx`, hooks `useX.ts`, utilities `camelCase.ts`. Tests mirror source with `.spec.ts(x)`.

## Testing Guidelines
- Frameworks: Jest (+ jsdom for React), React Testing Library, Playwright for E2E.
- Place unit tests next to source: `*.spec.ts` / `*.spec.tsx`.
- Aim for meaningful assertions over implementation details; prefer RTL queries by role/label.
- Run all tests locally: `npx nx run-many -t test`.

## Commit & Pull Request Guidelines
- Commits: concise, imperative subject (≤72 chars). Group logical changes; reference issues (`#123`). Example: `feat(todos): add voice input toggle`.
- PRs: include description, screenshots for UI, reproduction steps for bugs, and link related issues. Ensure CI passes (build, lint, test).

## Security & Configuration Tips
- Do not commit secrets. Use `.env` locally; never check it in.
- Review `next.config.js` `basePath/assetPrefix` when deploying under a subpath.

## Agent-Specific Notes
- Prefer `rg` for search and `npx nx show project <name>` to discover targets.
- Keep changes minimal and within existing structure; avoid renames unless necessary.
