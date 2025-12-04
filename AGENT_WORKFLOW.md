# AI Agent Workflow Log

## Agents Used

- Cursor Agent (GPT‑5.1 Codex) for multi-step coding, refactors, documentation.
- Built-in Cursor inline completions for boilerplate React/TypeScript snippets.

## Prompts & Outputs

- **Example 1 – Backend scaffolding**
  - *Prompt*: “Set up the backend hexagonal architecture: create domain entities, ports, Prisma repositories, Express controllers, DI wiring.”
  - *Output*: Generated TypeScript files for `Route`, `ComplianceBalance`, `RouteService`, Prisma adapters, and Express wiring (`app.ts`, controllers). Adjusted imports manually afterward.
- **Example 2 – Frontend dashboard**
  - *Prompt*: “Replace the Vite starter UI with a four-tab FuelEU dashboard using Tailwind, hooking into backend routes via typed ports.”
  - *Output*: Produced React components for Routes/Compare/Banking/Pooling tabs, associated hooks, Tailwind config, and HTTP adapters. Required tweaks for Tailwind versioning and `useAsyncData` hook.

## Validation / Corrections

- Ran `npm run build` (frontend) to ensure TypeScript + Tailwind compilation succeeded.
- Seeded PostgreSQL via `npx tsx prisma/seed.ts`; validated data with Prisma Studio locally.
- Manually tested API endpoints with sample curl calls (e.g., `GET /routes`, `POST /banking/bank`) while the Express server was running.
- Adjusted Prisma schema and adapters when Prisma 7 required explicit driver adapter injection.

## Observations

- **Where the agent saved time**: Boilerplate-heavy code (ports, adapters, React components) and cross-file consistency benefited from automated generation, maintaining the hexagonal structure without manual duplication.
- **Where it failed or needed guidance**: Tailwind 4 beta auto-installed, breaking `npx tailwindcss init`. Downgraded to 3.4 manually. Prisma 7 driver requirements triggered multiple iterations until `@prisma/adapter-pg` was wired correctly.
- **Tool combo**: Used Cursor Agent for multi-file generation, inline completions for quick JSX snippets, and manual shell commands for installs/migrations.

## Best Practices Followed

- Clarified architecture expectations (ports/use cases) before asking for code generation.
- Iterated in small prompts (backend structure → adapters → controllers) to keep diffs reviewable.
- Verified every substantial change via build/seed commands before moving on.
# AI Agent Workflow Log

## Agents Used
- Cursor AI (ChatGPT-based coding assistant)

## Prompts & Outputs
- **Example 1 – Backend scaffolding**
  - *Prompt*: “Set up the backend hexagonal architecture, including domain models, ports, use-cases, Express HTTP adapters, and Prisma repositories.”
  - *Output*: Generated TypeScript files for core domain/entities, inbound/outbound ports, service implementations, Express controllers, Prisma repository adapters, and dependency wiring.
- **Example 2 – Frontend dashboard**
  - *Prompt*: “Implement the React dashboard tabs (Routes, Compare, Banking, Pooling) using Tailwind and wire them to backend APIs through ports/adapters.”
  - *Output*: Created Tailwind setup, API adapters, use-case wiring, reusable hooks, and tab components rendering the requested KPIs/actions.

## Validation / Corrections
- Manually reviewed generated files, ensuring TypeScript imports matched project structure.
- Ran `npm run build` in `frontend/` to validate compilation after Tailwind & component work.
- Executed Prisma migrations/seeds and `npm run start` for the backend to ensure API availability.

## Observations
- **Saved time**: Boilerplate-heavy areas (domain types, controller scaffolds, UI layouts) were produced quickly.
- **Failures / Hallucinations**: Needed to re-run Tailwind install due to version mismatch; adjusted Prisma schema (removed unsupported `@@unique`) after agent suggestion conflicted with Prisma 7 config.
- **Tool synergy**: Used Cursor for multi-file edits, shell for npm/prisma commands, and manual edits for sensitive sections (README/docs).

## Best Practices Followed
- Maintained hexagonal boundaries (core vs adapters vs infrastructure) in both frontend and backend as requested.
- Documented environment setup, scripts, and verification steps inside `README.md`.
- Captured agent interactions and validation steps here per assignment instructions.

