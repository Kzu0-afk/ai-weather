<div align="center">

# AI Weather
  
# ☁️ AI Weather (Development Phase)


**A minimal, intelligent weather application with clean architecture**

*Next.js + NestJS • TypeScript end-to-end • Vercel + Railway*

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11+-red?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 📖 Overview

AI Weather is a **full‑stack weather application** that demonstrates modern web development practices through clean architecture, type safety, and thoughtful design. The project showcases a complete development workflow from initial setup to production deployment.

### ✨ Key Features

- **Provider‑Agnostic Architecture** – Frontend talks only to the backend; provider details stay hidden
- **Type‑Safe End‑to‑End** – TypeScript across frontend and backend with a stable contract
- **Fast & Resilient** – Caching + rate limiting + timeouts to keep responses stable
- **Minimal JP UI** – Calm, clean design focused on clarity
- **Location Weather** – Optional geolocation to show local conditions (with consent)
- **Autocomplete Search** – City suggestions while typing
- **Shareable City Pages** – Clean routes like `/city/Tokyo`

---

## 🛠️ Tech Stack

<table>
<tr>
<td width="33%">

### Frontend
- Next.js 15+ (App Router)
- React 19+
- TypeScript
- CSS Modules

</td>
<td width="33%">

### Backend
- NestJS 11+
- Node.js
- Axios
- In‑memory Cache

</td>
<td width="33%">

### Infrastructure
- Vercel (Frontend)
- Railway (Backend)
- Open‑Meteo API

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                       │
│              (Next.js • Vercel)                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Search • Autocomplete • Location Detection    │  │
│  └───────────────────┬─────────────────────────────┘  │
└──────────────────────┼─────────────────────────────────┘
                       │ HTTPS / REST API
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend Service                        │
│              (NestJS • Railway)                        │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Rate Limiting • Caching • Logging • Validation │  │
│  └───────────────────┬─────────────────────────────┘  │
└──────────────────────┼─────────────────────────────────┘
                       │ Normalized Contract
                       ▼
┌─────────────────────────────────────────────────────────┐
│              External Weather Provider                   │
│              (Open‑Meteo API)                           │
└─────────────────────────────────────────────────────────┘
```

**Architecture Principle:** The frontend communicates exclusively with the backend API. All weather data flows through a normalized contract, ensuring provider independence and type safety.

---

## 🚀 Development Progress

This project follows a structured **9-phase development roadmap**:

| Phase | Status | Description |
|:-----:|:------:|-------------|
| **0** | ✅ | Foundations & Project Setup |
| **1** | ✅ | API Contract & Domain Model |
| **2** | ✅ | Weather Provider Integration |
| **3** | ✅ | Caching & Rate-Limit Protection |
| **4** | ✅ | Frontend MVP UI |
| **5** | ✅ | Routing & City Pages |
| **6** | 📋 | AI Enhancements |
| **7** | ✅ | Hardening, Security & Observability |
| **8** | 📋 | Deployment Pipeline |
| **9** | 📋 | Post‑MVP Improvements |

**Legend:** ✅ Complete | 🔄 In Progress | 📋 Planned

For detailed implementation documentation, see **[AI-WEATHER-DEVELOPMENT.md](./AI-WEATHER-DEVELOPMENT.md)**.

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

### Core Endpoints

#### `GET /weather`
Get current weather by city name.

**Query Parameters:**
- `city` (string, required) – City name

**Example Request:**
```bash
GET /weather?city=Tokyo
```

**Example Response:**
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

#### `GET /weather/coordinates`
Get weather by geographic coordinates.

**Query Parameters:**
- `latitude` (number, required)
- `longitude` (number, required)

#### `GET /weather/search`
Search for city suggestions (autocomplete).

**Query Parameters:**
- `query` (string, required) – Search term

**Status Codes:**
- `200` – Success
- `400` – Invalid parameters
- `404` – Location not found
- `429` – Rate limit exceeded
- `500` – Server error

---

## 🎨 Design Philosophy

The interface embraces **minimalism with Japanese sensibility**:

> *"If the design distracts from the data, it's wrong."*

### Design Principles

- 🎨 **Calm Color Palette** – Neutral gradients with subtle blue accents
- 📝 **Clear Typography** – Geist Sans for optimal readability
- 🧹 **No Clutter** – Only essential weather data displayed
- 📱 **Fully Responsive** – Seamless experience across all devices
- ⚡ **Fast & Smooth** – Optimized animations and transitions
- 🔍 **Intuitive UX** – Autocomplete, location detection, clear error states

---

## 🔒 Security & Best Practices

- 🔐 **CORS Protection** – Strict origin validation
- ✅ **Input Validation** – DTO-based validation with class-validator
- 🛡️ **Error Sanitization** – No internal details exposed to clients
- ⏱️ **Rate Limiting** – Per-IP throttling (20 requests/minute)
- 🔑 **Secret Management** – API keys never exposed to frontend
- 📊 **Request Logging** – Sanitized logging for monitoring
- 💾 **Intelligent Caching** – Configurable TTL to reduce provider load

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

Manual testing checklist: `TESTING-CHECKLIST.md`.

---

## 📊 Project Status

### ✅ Completed Features

- **Backend Infrastructure**
  - ✅ Normalized API contract with TypeScript types
  - ✅ Weather provider integration (Open-Meteo)
  - ✅ Configurable in-memory caching (15-min TTL)
  - ✅ Rate limiting & request throttling
  - ✅ Request logging & monitoring
  - ✅ Error handling & sanitization

- **Frontend Experience**
  - ✅ Search interface with autocomplete
  - ✅ Location-based weather detection
  - ✅ Card-based weather display
  - ✅ City pages with built-in search
  - ✅ Loading & error states
  - ✅ Global error boundary for graceful failures
  - ✅ Responsive design
  - ✅ Japanese-inspired minimal UI

### 🚧 Upcoming Features

- 📋 AI-powered weather insights
- 📋 Deployment pipeline (Railway + Vercel)
- 📋 Saved cities / favorites
- 📋 PWA support for offline mode
- 📋 Enhanced monitoring & analytics

---

## ⚠️ Disclaimer

This is a **personal learning project** designed to showcase modern full-stack development practices. While the application demonstrates production-ready patterns, it is not intended for commercial use without additional scalability improvements and deeper security review.

---

## 📄 License

See [LICENSE](./LICENSE) for details.

---

---

<div align="center">

### 📚 Documentation

**[Development Guide](./AI-WEATHER-DEVELOPMENT.md)** • **[Setup Instructions](./INTELLIJ-SETUP.md)**

---

**Built with ☕ and 静 (calm) in mind.**

*Last updated: January 2026*

</div>
