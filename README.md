# Grab Value Calculator

A lightweight web tool that scores a Grab ride's true value against the equivalent public transit journey. Rather than evaluating on fare alone, it quantifies the effort, time, and cost trade-offs — producing a single composite score out of 100.

**Core insight:** A Grab fare is a buyout of the friction involved in the public transit alternative — walking to stops, waiting in the heat, transferring between lines. This tool makes that trade-off explicit and measurable.

**Live:** [grab-value-calculator.vercel.app](https://grab-value-calculator.vercel.app)

---

## How It Works

1. Type your pickup address — select from autocomplete suggestions
2. Type your dropoff address — select from autocomplete suggestions
3. Route data auto-fills (driving distance, ETA, transit time, walking distance, waiting time, transfers)
4. Enter your Grab fare and party size
5. Hit **Calculate** — get a score, label, and full dimension breakdown

---

## Scoring Model

**Final Score = (Effort Saved × 50%) + (Cost Efficiency × 30%) + (Time Efficiency × 20%)**

All sub-parameters are normalised to 0–100 against Singapore-grounded reference ranges.

### Effort Saved (50%)

| Sub-param              | Weight | Score 0 | Score 100 |
| ---------------------- | ------ | ------- | --------- |
| Walking distance saved | 40%    | 0 m     | 1,500 m+  |
| Waiting time avoided   | 35%    | 0 mins  | 15+ mins  |
| Transfers avoided      | 25%    | 0       | 3+        |

### Cost Efficiency (30%)

| Sub-param       | Weight | Score 0      | Score 100    |
| --------------- | ------ | ------------ | ------------ |
| Fare per km     | 40%    | $2.50/km     | $0.80/km     |
| Per-person cost | 35%    | $15+/person  | $0/person    |
| Fare per minute | 25%    | $0.50/min    | $0.10/min    |

### Time Efficiency (20%)

| Sub-param                  | Weight | Score 0      | Score 100      |
| -------------------------- | ------ | ------------ | -------------- |
| Grab vs transit time delta | 60%    | 0 mins saved | 20+ mins saved |
| Waiting time avoided       | 40%    | 0 mins       | 15+ mins       |

### Score Bands

| Score  | Label           |
| ------ | --------------- |
| 80–100 | Excellent value |
| 60–79  | Good value      |
| 40–59  | Decent          |
| 20–39  | Poor value      |
| 0–19   | Not worth it    |

---

## Features

- **Auto route population** — Google Maps Directions + Places Autocomplete fills all 6 route fields on address selection
- **Party size support** — divides fare per person for accurate cost scoring
- **Grab Saver scheduling** — set a departure time for Saver trips; transit route uses matching departure window
- **Score breakdown** — expand any sub-parameter to see raw value, reference range, and tip
- **Shareable URLs** — copy a link that encodes all inputs for sharing or bookmarking
- **Trip history** — last 10 calculations stored in localStorage, one click to reload
- **SE Asia region support** — autocomplete scoped to Singapore, Malaysia, Indonesia, Thailand, Philippines, Vietnam
- No accounts, no sign-up, no stored data on any server

---

## Tech Stack

| Layer         | Choice                                           |
| ------------- | ------------------------------------------------ |
| Frontend      | React 19 + Vite 6 + TypeScript + Tailwind CSS v4 |
| UI components | shadcn/ui (Radix primitives + CVA)               |
| Font          | Plus Jakarta Sans Variable                       |
| Scoring logic | Client-side TypeScript — no backend              |
| Maps          | Google Maps Directions API + Places API          |
| Tests         | Vitest + @testing-library/react (120 tests)      |
| Hosting       | Vercel                                           |

---

## Local Development

### Prerequisites

- Node.js 18+
- A Google Maps API key with **Maps JavaScript API**, **Directions API**, and **Places API** enabled

### Setup

```bash
git clone https://github.com/your-username/grab-value-calculator.git
cd grab-value-calculator
npm install
```

Create a `.env.local` file:

```
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

```bash
npm run dev
```

### Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run test      # Run unit tests
npm run lint      # Lint
```

---

## Project Structure

```
src/
  lib/
    scoring/      # Pure TS scoring engine (constants, normalise, dimensions, calculator)
    maps/         # Maps layer (loader, directions, autocomplete, parseRouteData)
    shareUrl.ts   # URL encode/decode for shareable links
    history.ts    # localStorage trip history (10-entry cap)
  components/
    ui/           # shadcn/ui primitives
  types/
    calculator.ts # Shared TypeScript types
```

---

## Roadmap

| Phase | Status | Description |
| ----- | ------ | ----------- |
| 1 — MVP | Done | Scoring engine, full UI, mobile-responsive, deployed to Vercel |
| 2 — Auto route population | Done | Google Maps Directions + Places Autocomplete integration |
| 3 — Polish | Done | Shareable URLs, trip history, score breakdown expansion |
| 4 — UX improvements | Done | Country selector, Saver scheduling, app icon |
| 5 — Embeddable widget | Planned | Optional iframe-embeddable widget |

---

## Notes

- Transit waiting time is schedule-based (Google Maps), not real-time
- Scoring reference ranges are centralised in `src/lib/scoring/constants.ts` — update if SGD pricing drifts
- API key should be HTTP-referrer-restricted in Google Cloud Console
