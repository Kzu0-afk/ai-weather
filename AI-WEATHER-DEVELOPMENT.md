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

## Phase 2 – Weather Provider Integration (Backend Only) ✅ **COMPLETED**

- **Goals**
  - Integrate a real provider (initially **Open‑Meteo**).
  - Keep the **provider fully hidden** behind NestJS.
  - **Additional**: Location-based weather detection for user's current location.
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
  - `GET /weather/coordinates?latitude=<lat>&longitude=<lon>` returns weather for coordinates.
- **Status**: ✅ Complete
  - **Provider Integration**: Open-Meteo API integrated (geocoding + forecast)
  - **City Lookup**: Open-Meteo geocoding API for city search
  - **Weather Fetch**: Open-Meteo forecast API for current weather data
  - **Normalization**: Raw provider data normalized to `NormalizedWeather` contract
  - **Error Handling**: 
    - 404 for invalid/unknown cities
    - 500 for network/provider errors (no internal details leaked)
    - 8-second timeout on all external requests
  - **Location-Based Weather**:
    - New endpoint: `GET /weather/coordinates?latitude=<lat>&longitude=<lon>`
    - Reverse geocoding via Nominatim (OpenStreetMap) to get city name
    - Fallback handling if reverse geocoding fails
  - **Frontend Geolocation**:
    - Automatic location request on page load
    - Auto-fetch weather when user grants location permission
    - Graceful fallback if user denies location (can still search manually)
  - **Files Created/Updated**:
    - `src/weather/dto/get-weather-by-coords.dto.ts` (new)
    - `weather.service.ts` (added `getWeatherByCoordinates`, `reverseGeocode`, `fetchWeatherByCoords`)
    - `weather.controller.ts` (added coordinates endpoint)
    - `api.ts` (added `fetchWeatherByCoordinates` function)
    - `page.tsx` (added geolocation detection with useEffect)
  - **Additional Enhancements**:
    - **City Autocomplete**: Added `GET /weather/search?query=<query>` endpoint for city suggestions
    - **Frontend Dropdown**: Implemented autocomplete dropdown with 300ms debounce, shows up to 5 suggestions
    - **Error Handling**: Improved user-friendly error messages (404 → "404 Error | Location not found")
    - **Files Added**:
      - `src/weather/dto/search-cities.dto.ts` (new)
      - `src/weather/interfaces/weather.types.ts` (added `CitySuggestion` interface)
      - `weather.service.ts` (added `searchCities()` method)
      - `weather.controller.ts` (added search endpoint)
      - `api.ts` (added `searchCities()` and improved error formatting)
      - `page.tsx` (added autocomplete UI with dropdown)
      - `page.module.css` (added dropdown and suggestion styles)

---

## Phase 3 – Caching & Rate‑Limit Protection ✅ **COMPLETED**

- **Goals**
  - Avoid hammering the provider and make UX more stable.
  - Prepare for future Redis upgrade.
  - **Note**: Basic in-memory caching already implemented in Phase 2 (15-minute TTL). Phase 3 will enhance and formalize it.
- **Backend Tasks**
  - Review and optimize existing in‑memory cache implementation:
    - Key: lower‑cased `city` or coordinates-based key.
    - Value: normalized weather + `expiresAt`.
    - Current TTL: 15 minutes (make configurable via environment variable).
  - Ensure cache is applied **after** successful provider response only.
  - Add cache statistics/monitoring (optional but useful).
- **Security / Anti‑abuse**
  - Add basic request logging (without sensitive provider details).
  - Add simple **rate limit per IP** using NestJS middleware/guard.
  - Implement request throttling to prevent abuse.
- **Deliverables**
  - Cache TTL configurable via environment variables.
  - Rate limiting middleware preventing excessive requests from single IP.
  - Request logging for monitoring and debugging.
  - Cache hit/miss metrics (optional).
- **Status**: ✅ Complete
  - **Configurable Cache TTL**: Cache TTL now configurable via `CACHE_TTL_MINUTES` environment variable (default: 15 minutes)
  - **Cache Statistics**: Added `getCacheStats()` method tracking hits, misses, cache size, and TTL
  - **Rate Limiting**: Implemented using `@nestjs/throttler` with configurable limits via `RATE_LIMIT_REQUESTS` (default: 20 requests per minute)
  - **Request Logging**: Added `LoggingInterceptor` that logs all HTTP requests with:
    - Method, URL (sanitized), status code, duration, IP address
    - Query parameter values are masked to prevent logging sensitive data
    - Error logging includes error messages
  - **Cache Stats Endpoint**: Added `GET /weather/cache/stats` endpoint for monitoring cache performance
  - **Files Created/Updated**:
    - `src/common/interceptors/logging.interceptor.ts` (new)
    - `app.module.ts` (added ThrottlerModule and global guard)
    - `main.ts` (added global LoggingInterceptor)
    - `weather.service.ts` (made cache TTL configurable, added cache statistics)
    - `weather.controller.ts` (added cache stats endpoint)
  - **Testing Verified**:
    - Rate limiting tested: 429 responses after exceeding limit
    - Cache stats endpoint functional: returns hits, misses, size, TTL
    - Request logging verified: sanitized URLs and status codes logged
    - Cache TTL configuration tested: environment variable works correctly

---

## Phase 4 – Frontend MVP UI (Search + Result) ✅ **COMPLETED**

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
- **Status**: ✅ Complete
  - **Core Features** (from Phase 2):
    - ✅ Search functionality with autocomplete dropdown
    - ✅ Weather display with card-based layout
    - ✅ Loading states and error handling
    - ✅ Japanese-inspired minimal design
    - ✅ Location detection and auto-fetch
  - **Phase 4 Refinements**:
    - ✅ **Metadata Updated**: Title, description, OpenGraph tags in `layout.tsx`
    - ✅ **Loading Skeleton**: Animated skeleton component for better perceived performance
    - ✅ **Enhanced Animations**: Fade-in, slide-in, and hover transitions
    - ✅ **Accessibility Improvements**: 
      - ARIA labels and roles throughout
      - Keyboard navigation support (Escape key to close dropdown)
      - Focus states and focus-visible styles
      - Semantic HTML (h2 for city name, proper heading structure)
    - ✅ **Typography Polish**: Improved font sizes, weights, line-heights, and spacing
    - ✅ **Responsive Design**: 
      - Enhanced mobile breakpoints (720px, 480px)
      - Better touch targets (48px minimum)
      - Improved spacing and layout on small screens
      - Prevents iOS zoom on input focus (16px font size)
  - **Files Created/Updated**:
    - `src/app/components/WeatherSkeleton.tsx` (new)
    - `src/app/components/WeatherSkeleton.module.css` (new)
    - `src/app/layout.tsx` (updated metadata)
    - `src/app/page.tsx` (added skeleton, accessibility improvements)
    - `src/app/page.module.css` (animations, typography, responsive enhancements)

---

## Phase 5 – Routing & City Pages (Optional Early, Required Before Launch) ✅ **COMPLETED**

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
- **Status**: ✅ Complete
  - **Shared Component**: Extracted `WeatherDisplay` component for reuse across pages
  - **Dynamic Route**: Created `/city/[name]/page.tsx` as server component with:
    - Server-side data fetching for SEO optimization
    - URL encoding/decoding support for city names with spaces/special characters
    - Dynamic metadata generation per city (title, description)
  - **Navigation Integration**:
    - Search page navigates to city pages instead of inline display
    - Autocomplete suggestions navigate directly to city pages
    - Location detection navigates to city page after fetching coordinates
    - Link back to home page from city page header
  - **Error Handling**: Custom 404 page (`not-found.tsx`) for invalid cities with branded design
  - **URL Structure**: Clean, shareable URLs like `/city/Tokyo`, `/city/New%20York`
  - **Files Created/Updated**:
    - `src/app/components/WeatherDisplay.tsx` (new - shared component)
    - `src/app/components/WeatherDisplay.module.css` (new)
    - `src/app/city/[name]/page.tsx` (new - server component)
    - `src/app/city/[name]/page.module.css` (new)
    - `src/app/city/[name]/not-found.tsx` (new - custom 404)
    - `src/app/city/[name]/not-found.module.css` (new)
    - `src/app/page.tsx` (updated - navigation logic, removed inline display)

---

## Phase 7 – Hardening, Security & Observability ✅ **COMPLETED**

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
  - Add error boundaries for unexpected runtime errors.
- **Testing**
  - Manual tests with different cities (valid, invalid, non‑ASCII).
  - Basic e2e smoke test (script or manual checklist) for:
    - Load → search → view result → navigate to city route.
- **Deliverables**
  - Stable app that fails **gracefully** under bad input or provider outages.
- **Status**: ✅ Complete
  - **Frontend Hardening**
    - Added global React error boundary wrapper to prevent hard crashes:
      - `ai-weather-frontend/src/app/components/ErrorBoundary.tsx` (new)
      - `ai-weather-frontend/src/app/components/ErrorBoundary.module.css` (new)
      - `ai-weather-frontend/src/app/layout.tsx` (wrapped app in `ErrorBoundary`)
    - Added client-side city validation for better UX (length, empty input, basic invalid characters).
  - **UX Fixes / Reliability**
    - Location auto-detection no longer blocks manual search:
      - Home page now **displays** detected-location weather instead of auto-navigating.
    - City pages now include a search bar (with autocomplete) so you can search again without returning home:
      - `ai-weather-frontend/src/app/components/CitySearch.tsx` (new)
      - `ai-weather-frontend/src/app/components/CitySearch.module.css` (new)
      - `ai-weather-frontend/src/app/city/[name]/page.tsx` (renders `CitySearch`)
  - **Testing Documentation**
    - Added comprehensive manual testing checklist:
      - `TESTING-CHECKLIST.md` (new)
  - **Backend Verification**
    - DTO validation, rate limiting, CORS restriction, and sanitized logging are confirmed as implemented from earlier phases.

---

## Phase 8 – Deployment Pipeline

- **Goals**
  - Deploy frontend to production hosting (Vercel).
  - **Note**: Backend hosting (Railway) skipped due to free trial expiration. Backend will run locally or be deployed separately if needed.
- **Backend – Railway** (Skipped)
  - ~~Push backend to GitHub.~~
  - ~~Create Railway project and connect the repo.~~
  - ~~Configure environment variables.~~
  - ~~Deploy and verify.~~
  - **Status**: Skipped - Railway free trial expired. Backend remains local for development.
- **Frontend – Vercel**
  - Push frontend to GitHub (or connect existing repo).
  - Import repo into Vercel.
  - Configure project settings:
    - **Root Directory**: `ai-weather-frontend`
    - **Framework Preset**: Next.js (auto-detected)
    - **Build Command**: `npm run build` (default)
    - **Output Directory**: `.next` (default)
  - Configure environment variables:
    - `NEXT_PUBLIC_API_BASE_URL` → Backend API URL (e.g., `http://localhost:3001` for local backend, or production backend URL if available)
  - Deploy and verify:
    - Main search page loads correctly
    - Autocomplete dropdown works
    - Location weather detection works (with user consent)
    - City pages (`/city/[name]`) work correctly
    - Favorites and recent searches persist (localStorage)
    - PWA installability works
    - Service worker registers successfully
- **Deliverables**
  - Public, shareable URL for frontend app
  - Production-ready frontend deployment
  - Verified PWA functionality in production

- **Status**: 🔄 In Progress (deployment prep completed; Vercel hosting integration pending)
  - **Phase 8 Improvements Implemented (Deployment-Ready Prep)**
    - **Next.js build warnings resolved**:
      - Moved `viewport` / `themeColor` from `metadata` → `export const viewport` in `ai-weather-frontend/src/app/layout.tsx`
      - Confirmed frontend production build succeeds without warnings
    - **Backend production start made hosting-safe**:
      - Updated `ai-weather-backend/package.json` so `npm start` runs `node dist/main` (recommended for Railway, ready if needed later)
    - **Health endpoint added for hosting checks**:
      - Added `GET /health` in `ai-weather-backend/src/app.controller.ts`
    - **Environment templates added** (to guide Vercel env vars):
      - `ai-weather-backend/env.example`
      - `ai-weather-frontend/env.local.example`
    - **Git safety**:
      - Added root `.gitignore` to prevent committing any `**/.env*` files
  - **Remaining (Vercel Hosting Integration Not Done Yet)**
    - Create Vercel project and deploy `ai-weather-frontend`
    - Configure production environment variables on Vercel:
      - `NEXT_PUBLIC_API_BASE_URL` (pointing to local backend or production backend if available)
    - Verify production frontend:
      - Home page loads and search works
      - Autocomplete dropdown functions correctly
      - Location weather detection works (with user consent)
      - City pages (`/city/[name]`) work correctly
      - Favorites and recent searches persist (localStorage)
      - PWA installability works in production
      - Service worker registers successfully

---

## Phase 9 – Next-Level Improvements (Post-MVP) ✅ **COMPLETED**

- **Goals**
  - Enhance user experience with persistent features (favorites, recent searches).
  - Add PWA support for offline capability and installability.
  - Improve location detection UX with better messaging.
- **UX Enhancements**
  - **Saved Cities / Favorites**: 
    - localStorage-based favorites system
    - Star button on weather displays to add/remove favorites
    - Favorites list on home page with quick navigation
    - Maximum 20 favorites with automatic cleanup
  - **Recent Searches**:
    - Automatically tracks viewed cities
    - Recent searches list on home page
    - Maximum 10 recent searches
    - Clear button to reset recent searches
  - **Enhanced Location Detection**:
    - Improved loading message with helpful hint
    - Better accessibility (ARIA live regions)
- **PWA Support**
  - **Web App Manifest**: `public/manifest.json` with app metadata
  - **Service Worker**: `public/sw.js` for offline caching
    - Caches static pages (home, city routes)
    - Network-first strategy for API calls (always fresh weather data)
    - Fallback to cache for offline navigation
  - **Installability**: App can be installed on mobile/desktop devices
  - **Offline Support**: Basic offline page caching (no mock data per user rules)
- **Deliverables**
  - Users can save favorite cities and quickly access them
  - Recent searches provide quick access to previously viewed cities
  - App works offline (cached pages, no fresh weather data)
  - App can be installed as a PWA
- **Status**: ✅ Complete
  - **Favorites System**:
    - `src/lib/storage.ts` - localStorage utilities for favorites and recent searches
    - `src/app/components/FavoritesList.tsx` - Favorites display component
    - `src/app/components/WeatherDisplay.tsx` - Added star button for favoriting
    - Home page displays favorites list
  - **Recent Searches**:
    - `src/app/components/RecentSearches.tsx` - Recent searches display component
    - `src/app/components/CityWeatherWrapper.tsx` - Automatically adds cities to recent searches
    - Home page displays recent searches list
  - **PWA Implementation**:
    - `public/manifest.json` - Web app manifest
    - `public/sw.js` - Service worker for offline caching
    - `src/app/components/ServiceWorkerRegistration.tsx` - Client-side service worker registration
    - `src/app/layout.tsx` - Updated metadata with PWA support
  - **Location UX Enhancement**:
    - Improved loading message with helpful hint text
    - Better accessibility attributes
  - **Files Created/Updated**:
    - `src/lib/storage.ts` (new)
    - `src/app/components/FavoritesList.tsx` (new)
    - `src/app/components/FavoritesList.module.css` (new)
    - `src/app/components/RecentSearches.tsx` (new)
    - `src/app/components/RecentSearches.module.css` (new)
    - `src/app/components/CityWeatherWrapper.tsx` (new)
    - `src/app/components/ServiceWorkerRegistration.tsx` (new)
    - `src/app/components/WeatherDisplay.tsx` (updated - added favorite button)
    - `src/app/components/WeatherDisplay.module.css` (updated - favorite button styles)
    - `src/app/page.tsx` (updated - added favorites and recent searches)
    - `src/app/page.module.css` (updated - location loading styles)
    - `src/app/city/[name]/page.tsx` (updated - uses CityWeatherWrapper)
    - `src/app/layout.tsx` (updated - PWA metadata and service worker)
    - `public/manifest.json` (new)
    - `public/sw.js` (new)

**Note**: Backend hosting (Railway) was skipped due to free trial expiration. Frontend hosting (Vercel) is ready to be set up in Phase 8.

This roadmap should be kept up to date as architecture evolves; every significant change should touch this file so it remains the single source of truth for **how** AI Weather is built and shipped.


