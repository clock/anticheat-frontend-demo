# CS:GO Anti-Cheat Admin Panel — Frontend Showcase

A React admin panel UI for a CS:GO user-mode anti-cheat system. This repository is a **frontend-only demo** — all data is fake and generated locally. No backend or game client code is included.

**[Live Demo](https://clock.github.io/anticheat-frontend-demo/)**

> **Note:** All player data, detection records, Steam accounts, and version history shown in the UI are entirely fictional and generated for demonstration purposes.

> **Credit:** The original codebase was a real, live production anti-cheat service. All fake data generation, API stub-outs, and conversion from the live product to this static demo were done by Claude with one prompt. If it's not perfect, that is why.

## Features

- Player list with search, sorting, and pagination
- Per-player detail view: detections, sessions, HWID history, IP history, fingerprint traces
- Detection signatures and pattern breaker management
- Module and process whitelist configuration
- Automation scripts with JavaScript code editor
- Version control for watchdog and anti-cheat DLL components
- System log viewer with filtering
- Maintenance mode toggle

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui (Radix UI)
- Lucide Icons

## Running Locally

```bash
cd frontend
npm install
npm run dev
```

## Building

```bash
cd frontend
npm run build
# Output is in frontend/dist/
```