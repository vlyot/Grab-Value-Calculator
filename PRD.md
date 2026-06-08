**Grab Value Calculator — PRD v1.0**

---

**1. Overview**

A lightweight web tool that scores a Grab ride's true value against the equivalent public transit journey. Rather than evaluating on fare alone, it quantifies the effort, time, and cost trade-offs — producing a single composite score out of 100.

The core insight: a Grab fare is a buyout of the friction involved in the public transit alternative — walking to stops, waiting in the heat, transferring between lines. This tool makes that trade-off explicit and measurable.

---

**2. Problem Statement**

When deciding whether to take Grab, most people intuitively weigh fare against convenience but have no structured way to evaluate true value. "Fare per km" ignores effort entirely. Comparing Grab against transit on price alone ignores the significant friction of the transit journey. This tool replaces that crude mental model with a transparent, data-driven score.

---

**3. Goals**

- Produce a single interpretable value score for any Grab ride
- Ground the score in objective Google Maps data, not subjective input
- Weight effort saved as the primary dimension, reflecting the core thesis
- Handle party size correctly — per-person cost fundamentally changes value perception
- No accounts, no sign-up, no stored data — plug-and-play

---

**4. Non-Goals**

- Live Grab fare integration — fare is user-inputted
- Head-to-head Grab vs transit price comparison
- Personalised scoring weights
- Historical ride tracking
- Mobile app — web only

---

**5. User Inputs**

| Field                        | Source (Phase 2)                                     |
| ---------------------------- | ---------------------------------------------------- |
| Pickup location              | Places Autocomplete — triggers route fetch           |
| Dropoff location             | Places Autocomplete — triggers route fetch           |
| Grab fare (SGD)              | **Manual** — actual or estimated fare                |
| Party size (1–6)             | **Manual** — divides fare for per-person scoring     |
| Grab Saver                   | **Manual** — display metadata only, not scored       |
| Grab route distance (km)     | Auto-filled from Directions API driving leg distance |
| Grab ETA (mins)              | Auto-filled from Directions API driving leg duration |
| Transit total time (mins)    | Auto-filled from Directions API transit leg duration |
| Transit walking distance (m) | Auto-filled — sum of all WALKING step distances      |
| Transit waiting time (mins)  | Auto-filled — residual: total − walking − riding     |
| Number of transfers          | Auto-filled — count of TRANSIT steps minus 1        |

---

**6. Scoring Model**

Formula: `Final Score = (Effort Saved × 0.50) + (Cost Efficiency × 0.30) + (Time Efficiency × 0.20)`

All sub-params normalised to 0–100 against Singapore-grounded reference ranges.

**Cost Efficiency (30%)**

| Sub-param       | Weight | Score 0     | Score 100 |
| --------------- | ------ | ----------- | --------- |
| Fare per km     | 40%    | $2.50/km    | $0.80/km  |
| Per-person cost | 35%    | $15+/person | $0/person |
| Fare per minute | 25%    | $0.50/min   | $0.10/min |

**Time Efficiency (20%)**

| Sub-param                  | Weight | Score 0      | Score 100      |
| -------------------------- | ------ | ------------ | -------------- |
| Grab vs transit time delta | 60%    | 0 mins saved | 20+ mins saved |
| Waiting time avoided       | 40%    | 0 mins       | 15+ mins       |

**Effort Saved (50%)**

| Sub-param              | Weight | Score 0 | Score 100 |
| ---------------------- | ------ | ------- | --------- |
| Walking distance saved | 40%    | 0m      | 1500m+    |
| Waiting time avoided   | 35%    | 0 mins  | 15+ mins  |
| Transfers avoided      | 25%    | 0       | 3+        |

**Score bands**

| Score  | Label           |
| ------ | --------------- |
| 80–100 | Excellent value |
| 60–79  | Good value      |
| 40–59  | Decent          |
| 20–39  | Poor value      |
| 0–19   | Not worth it    |

---

**7. Data Sources**

Two Google Maps Directions API calls per calculation — driving (distance + ETA) and transit (journey time, walking distance, waiting time, transfers). Phase 1: manual entry by user. Phase 2: auto-populated via API.

Known limitation: GMaps transit waiting time is schedule-based, not real-time.

---

**8. User Flow**

1. User types pickup address — autocomplete dropdown shows SE Asia place suggestions
2. User selects a suggestion — pickup confirmed
3. User types dropoff address — selects suggestion — both confirmed
4. App fires Directions API (driving + transit) in parallel — "Fetching route data…" indicator shown
5. On success, 6 route fields auto-fill with green MapPin icons — "Route data loaded" confirmation shown
6. User enters fare and selects party size (only 2 manual inputs remaining)
7. Taps Calculate — gets score, label, dimension breakdown, and supporting stats

---

**9. Tech Stack**

| Layer              | Choice                                            |
| ------------------ | ------------------------------------------------- |
| Frontend           | React 19 + Vite 6 + TypeScript + Tailwind CSS v4  |
| UI components      | shadcn/ui (Radix primitives + CVA)                |
| Font               | Plus Jakarta Sans Variable (@fontsource-variable) |
| Scoring logic      | Client-side TypeScript — no backend needed        |
| Tests              | Vitest + @testing-library/react                   |
| Maps API (Phase 2) | Google Maps Directions + Places API               |
| Hosting            | Vercel free tier (vercel.json SPA rewrite)        |

---

**10. Phased Roadmap**

**Phase 1 — MVP** ✅ Implemented
All input fields, full scoring engine, score output with dimension bars and stats, Saver metadata, mobile-responsive layout, deployed to Vercel.

Implementation notes:
- Scoring engine is pure TypeScript with no React dependency (`src/lib/scoring/`), fully unit-tested (53 tests)
- All scoring reference constants centralised in `src/lib/scoring/constants.ts` — update anchors there if SGD pricing drifts
- Single `useCalculator` hook owns all form state; validation runs on submit only
- shadcn/ui `Progress` component drives all dimension and sub-score bars (value prop maps directly to 0–100 score)
- Score band → badge colour mapping uses a static lookup object (avoids Tailwind purging dynamic classes)
- `transitWaitingMins` feeds both Effort Saved and Time Efficiency dimensions independently

**Phase 2 — Auto route population** ✅ Implemented
Google Maps Directions API + Places Autocomplete integration. Both location inputs trigger address suggestions via the new Places API (`AutocompleteSuggestion`). Once both addresses are confirmed, driving and transit Directions API calls fire in parallel and auto-populate all 6 route fields. Manual input reduced to: fare, party size, and Saver flag only.

Implementation notes:
- Maps layer lives in `src/lib/maps/` (types, loader, directions, parseRouteData, autocomplete) — pure TypeScript, no React dependency
- Loader singleton (`loader.ts`) uses `@googlemaps/js-api-loader` functional API (`setOptions` + `importLibrary`); loads `maps` and `places` libraries together on first call
- Places autocomplete uses new `AutocompleteSuggestion.fetchAutocompleteSuggestions()` API (legacy `AutocompleteService` is not enabled for new API keys)
- `transitWaitingMins` is derived via residual method: `totalSecs − walkingSecs − transitRideSecs`, divided by 60 and clamped ≥ 0
- Transit route uses `FEWER_TRANSFERS` preference and a `nearestHalfHour()` departure time (rounds up to next :00/:30 boundary)
- `useRouteData` hook owns `idle|loading|success|error` status and calls `setField` × 6 on success; instantiated in `CalculatorForm` so `App.tsx` and `useCalculator` are untouched
- `usePlacesAutocomplete` debounces predictions by 300ms; uses a ref-based session token for billing grouping
- Auto-filled fields show a green MapPin icon and subtle green tint; descriptive hint text updates per status
- All errors surfaced inline in `RouteStatusBar` (shadcn `Alert`, variant="destructive") — no toast notifications
- Requires `VITE_GOOGLE_MAPS_API_KEY` env var; key should be HTTP-referrer-restricted in Google Cloud Console
- New shadcn primitives added: `command.tsx` (cmdk), `popover.tsx` (@radix-ui/react-popover), `alert.tsx`
- Test count: 74 unit tests (was 53; +21 new tests covering parseRouteData, directions utilities, and useRouteData hook)

**Phase 3 — Polish**
Shareable score URL via query params, localStorage history for recent trips, optional embeddable widget.

---

**11. Risks**

| Risk                                        | Mitigation                                                 |
| ------------------------------------------- | ---------------------------------------------------------- |
| Fixed weights feel wrong to some users      | Transparent dimension breakdown shows what drove the score |
| Manual GMaps entry is friction in Phase 1   | Phase 2 API integration removes this                       |
| Transit waiting time is estimated, not live | Noted as a known limitation in the UI                      |
| Grab pricing ranges drift over time         | Reference ranges are constants — easy to update            |
