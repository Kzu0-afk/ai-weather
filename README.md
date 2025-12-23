# ☁️ AI-Weather ☁️

A **full‑stack weather application** with clean architecture, built to demonstrate modern web development practices using **Next.js** and **NestJS**.

---

## 📖 Overview

AI Weather is a personal project showcasing:

- **Provider‑agnostic weather service**: Backend abstracts third-party APIs, exposing only a normalized contract to the frontend
- **Type‑safe architecture**: End‑to‑end TypeScript with consistent domain models
- **Performance & reliability**: In‑memory caching with TTL, graceful error handling, and CORS protection
- **Minimal, Japanese‑inspired UI**: Clean design prioritizing readability over decoration
- **Production deployment**: Backend on Railway, frontend on Vercel

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15+** (App Router)
- **TypeScript**
- **React 19+**
- **CSS Modules** (minimal styling)

### Backend
- **NestJS**
- **Node.js**
- **Axios** (HTTP client)
- **In‑memory caching** (upgradeable to Redis)

### Infrastructure
- **Vercel** (frontend hosting)
- **Railway** (backend hosting)
- **Open‑Meteo** (weather data provider)

---

## 🏗️ Architecture

```
┌─────────────────┐
│  Next.js Client │  (Vercel)
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│   NestJS API    │  (Railway)
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│ Weather Provider│  (Open‑Meteo)
└─────────────────┘
```

**Core principle:** The frontend never calls the weather provider directly. All data flows through the backend, which normalizes responses into a stable, provider‑agnostic contract.

---

## 🚀 Development Phases

This project is structured in **9 distinct phases**, from initial setup to production deployment:

1. **Foundations** – Project scaffolding and constraints
2. **API Contract** – Define the normalized weather schema
3. **Provider Integration** – Connect to external weather APIs
4. **Caching & Rate Limits** – Add stability and abuse protection
5. **Frontend MVP** – Build the search and result UI
6. **Routing** – Add city‑specific pages
7. **AI Enhancements** – Intelligent suggestions and insights
8. **Hardening** – Security, validation, error handling
9. **Deployment** – Push to production (Railway + Vercel)

For detailed phase‑by‑phase implementation guidance, see **[AI-WEATHER-DEVELOPMENT.md](./AI-WEATHER-DEVELOPMENT.md)**.

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend
```bash
cd ai-weather-backend
npm install
npm run start:dev  # Runs on http://localhost:3001
```

### Frontend
```bash
cd ai-weather-frontend
npm install
npm run dev  # Runs on http://localhost:3000
```

### Environment Variables

**Backend** (`.env` in `ai-weather-backend/`):
```bash
PORT=3001
FRONTEND_ORIGIN=http://localhost:3000
```

**Frontend** (`.env.local` in `ai-weather-frontend/`):
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

---

## 📝 API Reference

### `GET /weather`

**Query Parameters:**
- `city` (string, required): Name of the city

**Response:**
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

**Status Codes:**
- `200` – Success
- `400` – Missing or invalid city parameter
- `404` – City not found
- `500` – Provider or server error

---

## 🎨 Design Philosophy

The UI follows a **minimal, Japanese‑inspired aesthetic**:

- **Calm color palette** – Neutral tones with subtle accents
- **Clear typography** – Prioritizes readability
- **No clutter** – Only essential information displayed
- **Responsive** – Works across devices

*"If the design distracts from the data, it's wrong."*

---

## 🔒 Security & Best Practices

- **CORS enforcement** – Backend restricts origins via `FRONTEND_ORIGIN`
- **Input validation** – City parameters sanitized before processing
- **Error sanitization** – No provider details leaked to frontend
- **Rate limiting** – (Planned) Middleware to prevent abuse
- **No exposed secrets** – API keys never reach the browser

---

## 🧪 Testing

Run backend tests:
```bash
cd ai-weather-backend
npm test
```

Run frontend checks:
```bash
cd ai-weather-frontend
npm run lint
```

Manual testing checklist available in `AI-WEATHER-DEVELOPMENT.md` (Phase 7).

---

## 📊 Roadmap

**Completed:**
- ✅ Backend API with normalized contract
- ✅ Frontend search and result UI
- ✅ In‑memory caching (15-minute TTL)
- ✅ CORS and error handling

**Planned:**
- [ ] Redis-based distributed cache
- [ ] "AI" insights (smart suggestions, trend analysis)
- [ ] Saved cities / favorites
- [ ] PWA support for offline mode
- [ ] User location detection
- [ ] Structured logging and monitoring

---

## ⚠️ Disclaimer

This is a **personal project** built for learning and portfolio purposes. It demonstrates clean architecture, modern tooling, and deployment workflows, but is not intended for commercial use without further hardening and scaling considerations.

---

## 📄 License

See [LICENSE](./LICENSE) for details.

---

## 🔗 Links

- **Live Demo:** *(Coming soon)*
- **Documentation:** [AI-WEATHER-DEVELOPMENT.md](./AI-WEATHER-DEVELOPMENT.md)
- **GitHub:** *(Repository link)*

---

**Built with ☕ and 静 (calm) in mind.**
