# Jaemangho Workspace Rules

This file outlines strict guidelines for styling, architecture, state management, and Riot API integration within the **Jaemangho** (재망호) League of Legends Squad Dashboard project.

## 1. Design & Aesthetic Constraints (MongoDB Theme)

All UI development must strictly adhere to the MongoDB-design-analysis in `DESIGN.md`. 
DO NOT introduce custom ad-hoc styling that violates these tokens:

- **Color Palette**:
  - **Primary CTA**: Bright MongoDB Green (`#00ed64`) with Deep Navy text (`#001e2b`).
  - **Background / Hero Band**: Brand Teal Deep (`#001e2b`) or Charcoal (`#1c2d38`).
  - **Surface Canvas**: White (`#ffffff`) for standard tiles and documentation surfaces, Surface Soft (`#f4f7f6`) for card sections.
  - **Borders**: 1px Hairline (`#e1e5e8`) or Hairline Strong (`#c1ccd6`) for text inputs.
  - **Category Colors (University Accent Tags)**:
    - Database & Security: Accent Purple (`#7b3ff2`)
    - Search: Accent Orange (`#fa6e39`)
    - Web / Others: Accent Pink (`#f06bb8`)
    - Cloud / Atlas: Accent Blue (`#3d4f9f`)

- **Typography**:
  - **UI Font**: `Euclid Circular A`, fallbacks: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
  - **Code Font**: `Source Code Pro`, fallbacks: `'SF Mono', Menlo, Consolas, monospace`.
  - Tight leading for display headers (e.g. `lineHeight: 1.1` on hero displays) and negative letter spacing (`-1.5px` to `-0.5px`).

- **Shapes & Corners**:
  - **Buttons**: MUST be pill-shaped (`border-radius: 9999px` / `{rounded.full}`) universally. No square or rounded-rectangle buttons.
  - **Cards & Tiles**: MUST use `border-radius: 12px` (`{rounded.lg}`).
  - **Inputs & Search Pills**: Use `border-radius: 8px` (`{rounded.md}`).

- **Animations**:
  - Standard micro-animations for interactive tiles: 150-200ms transition using `ease`.

---

## 2. React State & Persistence Constraints

- **LocalStorage Synchronization**:
  - The squad data and settings must always sync to `localStorage`:
    - Members: `jaemangho_members`
    - API Mode: `jaemangho_api_mode`
    - API Key: `jaemangho_api_key`
    - CORS Proxy: `jaemangho_cors_proxy`
  - In `App.tsx`, keep initial states hydrated from these keys with fallback values.

- **Race Condition Prevention in Simulation Ticks**:
  - In Mock API mode, simulation ticks generate simulated active games and matches.
  - When updating player members or state, **always use functional updates** (e.g., `setMembers(prev => prev.map(...))`). Never mutate current arrays directly or rely on stale closures.

---

## 3. Riot Developer API & CORS Proxy Constraints

- **Endpoints & Conventions**:
  - Riot ID PUUID lookup: Account-V1 (`/riot/account/v1/accounts/by-riot-id/`) using region `asia`.
  - Summoner lookup: Summoner-V4 (`/lol/summoner/v4/summoners/by-puuid/`) using region `kr`.
  - Ranked info lookup: League-V4 (`/lol/league/v4/entries/by-summoner/`) using region `kr`.
  - Champion Mastery lookup: Champion-Mastery-V4 (`/lol/champion-mastery/v4/champion-masteries/by-puuid/top`) using region `kr`.

- **CORS Bypass Policy**:
  - Because Riot APIs restrict client-side requests via CORS policies, all live fetches must be prefixed with the active CORS Proxy URL (`jaemangho_cors_proxy`, e.g. `https://cors-anywhere.herokuapp.com/`).
  - Proactively check if the proxy URL ends with `/` and append it cleanly before making fetch requests.

- **High-Quality Error Handling & Debugging**:
  - Do not let API calls fail silently or show generic `TypeError: Failed to fetch` errors. Catch errors and map them to descriptive, action-oriented troubleshooting banners:
    - **401 Unauthorized**: Key is malformed. Direct user to double check settings key format.
    - **403 Forbidden**: Riot API Key has expired. Direct user to Riot Developer site to regenerate.
    - **404 Not Found**: Summoner/Riot ID does not exist. Suggest spelling check for gameName or tagLine.
    - **429 Rate Limit**: Too many requests. Advise waiting a few minutes.

---

## 4. Build & Deployment Constraints (GitHub Pages)

- **Static Deployment Environment**:
  - This project is configured to build as a client-side SPA and is deployed on **GitHub Pages** (configured in [.github/workflows/deploy.yml](file:///c:/Users/zes13/OneDrive/Dokumen/Jaemangho/.github/workflows/deploy.yml)).
  - Any architectural changes must maintain a strict zero-backend dependency (client-side only).

- **Relative Asset Paths**:
  - Always maintain `base: './'` in [vite.config.ts](file:///c:/Users/zes13/OneDrive/Dokumen/Jaemangho/vite.config.ts) to ensure assets (js, css, icons) resolve correctly when hosted in a subfolder on GitHub Pages (e.g. `https://<username>.github.io/<repo-name>/`).
  - Do not use absolute paths starting with `/` for local assets or custom components.

- **Manual Trigger Rule**:
  - Automatic push deployment is disabled. Deployment must be triggered manually from the GitHub Actions tab (`workflow_dispatch`).

