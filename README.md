# AI Weather ☁️🇯🇵

A **full‑stack weather application** built with **Next.js (TypeScript)** on the frontend and **NestJS (Node.js)** on the backend. The project is intentionally structured to teach **real-world architecture**, not just API consumption.

Frontend is deployed on **Vercel**. Backend is deployed on **Railway**.

---

## Project Goals (Read This First)

This project is designed to teach you:

* Clean frontend ↔ backend separation
* API abstraction (provider‑agnostic design)
* Type safety across services
* Caching & rate‑limit awareness
* Professional deployment flow

---

## Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* Fetch / Server Actions
* Minimal CSS (or CSS Modules)

### Backend

* NestJS
* Node.js
* Axios / Fetch
* In‑memory cache (upgradeable to Redis)

### External Services

* Weather API (OpenWeatherMap / WeatherAPI / Open‑Meteo)
* Railway (Backend hosting)
* Vercel (Frontend hosting)

---

## High‑Level Architecture

```
Next.js (Vercel)
      ↓
NestJS API (Railway)
      ↓
Weather Provider API
```

**Important rule:** The frontend must NEVER call the weather provider directly.

---

# Phase 1 – Planning & API Contract

### 1. Define the Core Feature

* Search weather by city
* Display:

    * Temperature
    * Condition
    * Humidity
    * Wind speed
    * Local time

### 2. Define the Backend API Contract

```
GET /weather?city=Tokyo
```

### Sample Response (Normalized)

```json
{
  "city": "Tokyo",
  "country": "JP",
  "temperature": 27,
  "feelsLike": 29,
  "condition": "Cloudy",
  "humidity": 72,
  "windSpeed": 3.1,
  "updatedAt": "2025-01-01T10:00:00Z"
}
```

The frontend depends ONLY on this structure.

---

# Phase 2 – Backend Setup (NestJS)

### 1. Create the Project

```bash
npm i -g @nestjs/cli
nest new ai-weather-backend
cd ai-weather-backend
npm run start:dev
```

### 2. Create Weather Module

```bash
nest g module weather
nest g controller weather
nest g service weather
```

### 3. Folder Structure

```
src/
 ├─ weather/
 │   ├─ weather.controller.ts
 │   ├─ weather.service.ts
 │   ├─ dto/
 │   └─ interfaces/
 ├─ app.module.ts
```

---

# Phase 3 – Weather API Integration

### 1. Choose a Weather Provider

Recommended:

* OpenWeatherMap (free tier)
* Open‑Meteo (no API key)

### 2. Store API Key Securely

Create `.env`:

```
WEATHER_API_KEY=your_key_here
```

Never commit this file.

### 3. Implement Weather Service

Responsibilities:

* Fetch raw API data
* Normalize response
* Hide provider details

---

# Phase 4 – Caching & Stability

### Why Caching Matters

* Weather data doesn’t change every second
* APIs have rate limits
* No caching = fragile app

### Basic In‑Memory Cache

* Key: `city`
* TTL: 10–30 minutes

Later upgrade:

* Redis (Railway supports it)

---

# Phase 5 – Frontend Setup (Next.js)

### 1. Create Next.js App

```bash
npx create-next-app@latest ai-weather-frontend --typescript
cd ai-weather-frontend
npm run dev
```

### 2. Basic Routes

```
/app
 ├─ page.tsx          // Search page
 ├─ city/[name]/page.tsx
```

### 3. Data Fetching Rule

* Frontend calls **NestJS API only**
* Use server components or server actions

---

# Phase 6 – UI & Japanese Theme (Minimal, Not Gimmicky)

### Design Principles

* Clean
* Quiet colors
* No anime clutter

### Japanese‑Inspired Ideas

* Kanji‑based weather icons
* Season labels (季節)
* Romaji + Kana city toggle

If design distracts from readability, it’s wrong.

---

# Phase 7 – "AI" Features (Optional but Honest)

If you call it **AI Weather**, implement at least one:

1. Smart suggestions

    * “Rain likely in 2 hours — bring an umbrella”
2. Trend comparison

    * “Today is colder than average by 3°C”
3. Natural‑language summary

No intelligence = remove "AI" from the name.

---

# Phase 8 – Testing & Hardening

### Backend

* Test API with Postman
* Invalid city handling
* API timeout handling

### Frontend

* Loading states
* Error states
* Empty search prevention

---

# Phase 9 – Deployment (Final Phase)

## Backend – Railway

1. Push backend to GitHub
2. Create Railway project
3. Connect GitHub repo
4. Set environment variables
5. Deploy

Confirm:

```
https://your-backend.up.railway.app/weather?city=Tokyo
```

---

## Frontend – Vercel

1. Push frontend to GitHub
2. Import project into Vercel
3. Set backend API URL env var
4. Deploy

Never expose weather API keys in frontend.

---

## Final Outcome

You now have:

* A real full‑stack app
* Clean separation of concerns
* Deployable, scalable architecture

This is portfolio‑worthy **only if** you followed every phase properly.

---

## Next Level Improvements

* Redis caching
* User location detection
* Saved cities
* PWA offline mode
