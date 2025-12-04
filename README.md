# FuelEU Maritime Compliance Platform

FuelEU is a minimal yet end‑to‑end prototype of a compliance operations module for the upcoming FuelEU Maritime regulation.  
The repository contains an opinionated **hexagonal (Ports & Adapters)** architecture for both backend (Node/Express/Prisma/PostgreSQL) and frontend (React/Vite/Tailwind) layers.

## Repository Layout

```
frontend/   # React dashboard (hexagonal structure mirrored with ui/infrastructure adapters)
backend/    # Node + TS server exposing FuelEU APIs backed by Prisma/PostgreSQL
README.md
AGENT_WORKFLOW.md
REFLECTION.md
```

### High-Level Architecture

- **Core domain (shared between tiers)**: `src/core/domain` holds value objects/entities; `src/core/application` holds use-cases, and `src/core/ports` defines inbound/outbound contracts.
- **Adapters**:
  - Backend: HTTP controllers (`adapters/inbound/http`) and PostgreSQL repositories (`adapters/outbound/postgres`).
  - Frontend: React UI and API adapters implementing outbound ports.
- **Infrastructure**:
  - Backend: Express server bootstrap + Prisma client (`src/infrastructure`).
  - Frontend: Tailwind + shared HTTP client + dependency container wiring ports to adapters.

## Prerequisites

- Node.js 18+ (recommended 20+)
- npm 10+
- Local PostgreSQL (example uses `postgresql://sushil:Sushil@localhost:5432/project`)

## Backend Setup

```bash
cd backend
npm install
# configure backend/.env with DATABASE_URL
npm run prisma -- migrate dev     # creates DB tables
npm run prisma -- db seed         # or `npx tsx prisma/seed.ts`
npm run start                     # launches Express server on http://localhost:3001
```

### Backend Scripts

- `npm run dev` – hot-reload server via `tsx watch`
- `npm run start` – production server via `tsx`
- `npm run prisma -- <command>` – helper to forward Prisma CLI commands

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env   # optional, set VITE_API_URL=http://localhost:3001
npm run dev            # Vite dev server (http://localhost:5173)
npm run build          # production build
```

Tailwind 3 is configured with custom brand colors. The dashboard expects the backend running locally unless `VITE_API_URL` overrides the base URL.

## Feature Overview

| Tab       | Description                                                                                 |
|-----------|---------------------------------------------------------------------------------------------|
| Routes    | Fetches `/routes`, filters by vessel/fuel/year, allows setting baseline via `/routes/:id`.  |
| Compare   | Calls `/routes/comparison`, displays compliance vs target 89.3368 gCO₂e/MJ.                 |
| Banking   | Uses `/compliance/cb`, `/banking/*` for Article 20 flows (bank/apply positive CB).          |
| Pooling   | Calls `/pools` to execute Article 21 pooling with validation feedback.       


.

📸 UI Screenshots

Visual overview of the system.

<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/7b8bbdad-3f27-4282-8636-19985f3a99f4" />


Shows all voyages with filters for vessel type, fuel type, and year.




Compare View

Compare actual voyage GHG intensities against baseline and compliance targets.
<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/e9187814-7b14-48af-b673-2acb5bd28458" />





Banking View (Article 20)
<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/5c12b421-fdb0-42c3-b0d2-d03a4114c581" />


Bank surplus intensity credits or apply previously banked surplus.



Pooling View (Article 21)

<img width="1470" height="956" alt="image" src="https://github.com/user-attachments/assets/1818920b-cc47-413c-9015-7d93fcd39f23" />

Create ship pools and view redistributed compliance balances.

               |

## Testing / Verification

| Layer    | Command                | Notes                                                   |
|----------|------------------------|---------------------------------------------------------|
| Backend  | `npm run start`        | Manual verification via curl/Postman                    |
| Backend  | `npx prisma studio`    | Inspect seeded data (optional)                          |
| Frontend | `npm run build`        | Ensures TS + Vite bundle compiles                       |
| Frontend | `npm run dev`          | Manual QA: navigate tabs, banking/pooling interactions  |

*(Unit/integration tests can be expanded later; current focus is functional prototype.)*

## API Cheat Sheet

- `GET /routes` – optional `vesselType`, `fuelType`, `year`
- `POST /routes/:routeId/baseline`
- `GET /routes/comparison?target=89.3368`
- `GET /compliance/cb?shipId=...&year=...`
- `GET /compliance/adjusted-cb?shipId=...&year=...`
- `GET /banking/records?shipId=...&year=...`
- `POST /banking/bank` `{ shipId, year, amount }`
- `POST /banking/apply` `{ shipId, year, amount }`
- `POST /pools` `{ year, shipIds: [] }`

## Known Gaps / Future Enhancements

- Authentication/authorization is stubbed.
- No automated test suite yet (manual test matrix in progress).
- Pooling logic currently uses a greedy redistribution; swap with formal linear optimization if needed.

## License

MIT (default) – adjust as required for the assignment submission.
