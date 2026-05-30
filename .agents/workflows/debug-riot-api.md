# Workflow: Debug Riot API Integration

This workflow automates the diagnostic auditing and debugging of the Riot Games API integration and CORS proxy components within the Jaemangho squad dashboard.

## Activation Trigger
- Command: `/debug-riot-api`
- Usage: `/debug-riot-api <observed issue e.g. "403 error on masteries fetch" or "CORS block in console">`

## Steps to Execute

### 1. Audit Connection Logic in App.tsx
- Read and inspect the API fetch engine in [src/App.tsx](file:///c:/Users/zes13/OneDrive/Dokumen/Jaemangho/src/App.tsx) (look for `fetchRealRiotData`).
- Verify the API URL formats:
  - Account-V1: `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}?api_key={apiKey}`
  - Summoner-V4: `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}?api_key={apiKey}`
  - League-V4: `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/{encryptedId}?api_key={apiKey}`
  - ChampionMastery-V4: `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}/top?count=3&api_key={apiKey}`
- Check for correct query parameter formatting and character encoding (`encodeURIComponent`).

### 2. Verify CORS Proxy Concat
- Confirm the proxy concatenation logic:
  - Ensure the proxy prefix `corsProxy` is loaded correctly.
  - Confirm the logic checks if `corsProxy` ends with `/` and automatically appends it if missing, avoiding double slashes or broken URLs.

### 3. Check HTTP Error Handlers
Ensure the `try-catch` blocks map exact HTTP response codes to helpful in-app warnings:
- `401`: Suggests key is incorrectly typed or invalid.
- `403`: Prompts that the temporary Development API Key (expires every 24 hours) has expired and links directly to [Riot Developer Portal](https://developer.riotgames.com/) to regenerate.
- `404`: Informs that the specific player name + tag combination doesn't exist, suggesting checking space formatting.
- `429`: Alerts about rate limits.

### 4. Code Recommendations & Correction
- Propose specific code patches to fix any detected logic flaws, incorrect URL regions, missing type definitions, or unhandled promise rejections.
- Ensure all states (`isLoadingRealData`, `apiError`) are cleanly cleared and synchronized during fetch lifecycles.
