## AI Weather – Development Phases

This document defines the concrete phases to build **AI Weather** from first commit to deployment.  
Each phase should end in something **runnable and stable**, even if visually minimal.

---

## Phase 0 – Foundations & Constraints ✅ **COMPLETED**

- **Goals**
  - Establish folder layout: `ai-weather-frontend` (Next.js) and `ai-weather-backend` (NestJS).
  - Confirm the **single source of weather truth**: backend only, provider hidden from frontend.
  - Decide initial provider (e.g. **Open‑Meteo**, no key) for fast MVP.
- **Deliverables**
  - Projects generated and buildable (`npm run dev` / `npm run start:dev`).
  - This file (`AI-WEATHER-DEVELOPMENT.md`) committed as living architecture guide.
- **Status**: ✅ Complete
  - Both Next.js and NestJS projects scaffolded
  - IntelliJ run configurations documented (`INTELLIJ-SETUP.md`)
  - Environment files structure established

---

## Phase 1 – API Contract & Domain Model ✅ **COMPLETED**

- **Goals**
  - Lock the **weather contract** between frontend and backend:
    - `GET /weather?city=Tokyo`
    - Response:
      - `city`, `country`, `temperature`, `feelsLike`, `condition`,
      - `humidity`, `windSpeed`, `updatedAt`.
  - Define **TypeScript types** on both sides (Nest interfaces + frontend types).
- **Backend Tasks**
  - Add `NormalizedWeather` and related interfaces (e.g. `CityLookupResult`).
  - Add a dedicated `weather` module in Nest (`weather.module`, `weather.service`, `weather.controller`).
- **Frontend Tasks**
  - Add a shared `WeatherResponse` type and `fetchWeather(city)` helper.
- **Deliverables**
  - Backend returns a **static or provider-backed** normalized object for a known city.
  - Frontend can call `/weather` and render the raw JSON (no final UI yet).
- **Status**: ✅ Complete
  - **API Contract**: `GET /weather?city=<cityName>` endpoint defined
  - **Types**: `NormalizedWeather` (backend) and `WeatherResponse` (frontend) match exactly
  - **DTO Validation**: `GetWeatherDto` with class-validator decorators
  - **Global Validation**: ValidationPipe enabled in `main.ts` with whitelist and transform
  - **Documentation**: API contract documented in controller and frontend API helper
  - **Files Created**:
    - `src/weather/dto/get-weather.dto.ts`
    - Updated: `weather.controller.ts`, `main.ts`, `api.ts`

---

## Phase 2 – Weather Provider Integration (Backend Only)

- **Goals**
  - Integrate a real provider (initially **Open‑Meteo**).
  - Keep the **provider fully hidden** behind NestJS.
- **Backend Tasks**
  - Implement city lookup (e.g. Open‑Meteo geocoding).
  - Implement current weather fetch, normalize it into `NormalizedWeather`.
  - Handle:
    - Invalid city → 404 + clear error message.
    - Provider/network failure → 5xx with safe, non‑leaky message.
- **Security & Reliability**
  - Use **timeouts** and basic error handling to avoid hanging requests.
  - No provider credentials are ever exposed to the frontend.
- **Deliverables**
  - `GET /weather?city=Tokyo` returns live data from the provider in normalized format.

---

## Phase 3 – Caching & Rate‑Limit Protection

- **Goals**
  - Avoid hammering the provider and make UX more stable.
  - Prepare for future Redis upgrade.
- **Backend Tasks**
  - Implement a simple in‑memory cache:
    - Key: lower‑cased `city`.
    - Value: normalized weather + `expiresAt`.
    - TTL: **10–30 minutes** (configurable).
  - Ensure cache is applied **after** successful provider response only.
- **Security / Anti‑abuse**
  - Add basic request logging (without sensitive provider details).
  - Add simple **rate limit per IP** (once Nest middleware/guard is introduced in later passes).
- **Deliverables**
  - Repeated calls for the same city hit the cache until TTL expires.
  - Provider calls can be observed to decrease when testing manually.

---

## Phase 4 – Frontend MVP UI (Search + Result)

- **Goals**
  - Build a **single-page MVP** to:
    - Search by city.
    - Display normalized data (temperature, feelsLike, condition, humidity, wind).
  - Apply a **minimal Japanese-inspired design**:
    - Calm colors, clear typography, subtle accents (no gimmicks).
- **Frontend Tasks**
  - Implement `app/page.tsx` as the main search experience.
  - Use client component with:
    - City input, submit button, loading state, error state.
    - Result section with weather cards.
  - Ensure the frontend calls **only** `NEXT_PUBLIC_API_BASE_URL + /weather`.
- **Deliverables**
  - User can type a city → see a clean card-based summary of current weather.
  - Graceful error messages for invalid or unreachable cities.

---

## Phase 5 – Routing & City Pages (Optional Early, Required Before Launch)

- **Goals**
  - Add more structure to the frontend:
    - Root search page.
    - City‑specific route: `/city/[name]`.
- **Frontend Tasks**
  - Implement `/city/[name]/page.tsx`:
    - Server component that fetches from backend on the server.
    - Renders same normalized data using shared UI components.
  - Add navigation from the search page to canonical city URLs.
- **Deliverables**
  - Direct links like `/city/Tokyo` work and show weather.
  - Search page can deep‑link to city pages.

---

## Phase 6 – “AI” Layer (Honest Enhancements)

- **Goals**
  - Justify “AI Weather” with at least **one real intelligent behavior**, not marketing only.
- **Possible Features (pick 1–2 to start)**
  - **Smart suggestions**
    - E.g. “Rain likely in 2 hours — bring an umbrella” based on condition + wind + humidity.
  - **Trend comparison**
    - “Today is colder than average by 3°C” using simple historical or heuristic baselines.
  - **Natural‑language summary**
    - Short, human‑readable description of the current conditions.
- **Implementation Notes**
  - Start with **rule‑based logic** derived from normalized fields.
  - Optionally wrap with LLM later, but keep the weather facts from backend.
- **Deliverables**
  - Extra “Insight” block in the UI, driven from backend or shared logic, with clear text.

---

## Phase 7 – Hardening, Security & Observability

- **Goals**
  - Make the app resilient and safe enough for public internet.
- **Backend Hardening**
  - Validate query params (`city` length, characters) to reduce abuse.
  - Clamp request rates:
    - Add middleware/guard for simple per‑IP rate limiting.
  - Sanitize logs:
    - Avoid logging query strings or provider URLs in detail.
  - Enforce CORS:
    - Restrict `FRONTEND_ORIGIN` to known origins.
- **Frontend Hardening**
  - Prevent empty submits; show clear inline errors.
  - Ensure loading, error, and “no data” states are visually distinct.
- **Testing**
  - Manual tests with different cities (valid, invalid, non‑ASCII).
  - Basic e2e smoke test (script or manual checklist) for:
    - Load → search → view result → navigate to city route.
- **Deliverables**
  - Stable app that fails **gracefully** under bad input or provider outages.

---

## Phase 8 – Deployment Pipeline

- **Goals**
  - Deploy both backend and frontend with repeatable steps.
- **Backend – Railway**
  - Push backend to GitHub.
  - Create Railway project and connect the repo.
  - Configure environment variables:
    - `PORT`
    - `FRONTEND_ORIGIN` (comma‑separated if multiple).
    - Any provider‑specific settings if added later.
  - Deploy and verify:
    - `https://your-backend.up.railway.app/weather?city=Tokyo`
- **Frontend – Vercel**
  - Push frontend to GitHub.
  - Import repo into Vercel.
  - Configure:
    - `NEXT_PUBLIC_API_BASE_URL` → Railway backend URL.
  - Deploy and verify:
    - Main search page and at least one city URL.
- **Deliverables**
  - Public, shareable URLs for:
    - Backend API.
    - Frontend app.

---

## Phase 9 – Next-Level Improvements (Post-MVP)

These are **optional** once the deployed MVP is solid:

- **Performance & Scale**
  - Swap in-memory cache for **Redis** (Railway add‑on).
  - Add health check and readiness endpoints.
- **UX Enhancements**
  - Saved cities / “favorites”.
  - User location detection (with explicit consent).
  - PWA mode for basic offline caching of last city.
- **Security & Monitoring**
  - Structured logging with redaction.
  - Basic alerting when provider errors spike.

This roadmap should be kept up to date as architecture evolves; every significant change should touch this file so it remains the single source of truth for **how** AI Weather is built and shipped.


