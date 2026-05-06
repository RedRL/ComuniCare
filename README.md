# ComuniCare

> Understand your baby's non-verbal communication.

ComuniCare is a mobile-first, AI-assisted **Baby State Interpreter**. It reads cues across video, audio, and images — facial expression, body movement, posture, engagement, sound — and gently translates them into what your baby might be communicating.

This repo is a demo-ready React app. The AI layer is mocked but designed so it can be replaced with a real provider (OpenAI, Gemini, custom model) without touching the UI.

---

## ✨ Highlights

- **Mobile-first** UI tuned for ~390px viewports, with a bottom nav and large tap targets.
- **Demo mode** — one tap runs a full analysis flow on a sample baby video.
- **Refinement flow** — two optional questions (last feed, wake duration) bump confidence and update reasoning.
- **Feedback loop** — “Was this accurate?” updates the personal model.
- **Dashboard** — donut + bar charts, insights (e.g. *“Tired signals cluster in the evening”*), advice, and history.
- **Persistence** — `localStorage` for `babyProfile` and `analysisHistory`.
- **Safety language** — “may indicate”, “could suggest”, never “diagnosed”.

---

## 🧱 Tech stack

- React 18 + TypeScript (strict)
- Vite
- Tailwind CSS
- React Router
- Recharts

Clean modular layout:

```
src/
  components/   # Shared UI (charts, forms, nav, icons)
  hooks/        # useBabyProfile, useAnalysisHistory, useBabyAge
  models/       # Type definitions
  pages/        # LandingPage, SetupPage, AnalyzePage, DashboardPage, AboutPage
  services/     # aiService.ts (mock AI), storageService.ts
```

---

## 🚀 Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173 .

```bash
npm run build     # type-check + production build
npm run preview   # preview built app
```

---

## 🎬 Demo flow (1–2 minutes)

1. **Landing** → tap **“Try demo with baby video”**
2. The Analyze page autoruns the demo — animated placeholder (or your video, see below) plays while the AI “thinks”.
3. You see:
   - Primary state: *Likely tired and slightly overstimulated*
   - Confidence: ~74%
   - Probability breakdown (tired / overstimulated / hungry / other)
   - Detected signals
   - Suggestions
4. Tap **Refine result** with last-feed + wake-duration → confidence rises (~84%) with a generated *“Why it changed”* explanation.
5. Tap **Yes / Partly / No** to give feedback.
6. Open **My Baby** → charts, insights, advice, and history all update.

### Adding a real demo video

If you drop a clip at:

```
public/demo-baby-video.mp4
```

…the demo player will use it. Otherwise it shows a calm animated placeholder labeled *“Demo baby video loaded”*.

---

## 🧠 AI architecture

`src/services/aiService.ts` exposes:

- `analyzeBabyInput(input, profile, history, opts?)`
- `refineAnalysisWithContext(analysis, context, profile, history)`
- `generateParentAdvice(profile, history)`
- `generatePersonalInsights(profile, history)`

All return structured JSON shapes (`AnalysisResult`, `PersonalInsight`, `ParentAdvice`) plus natural-language fields (`explanation`, `rationale`).

To swap in a real provider later, replace the function bodies — the call sites and types stay the same.

---

## 🛟 Safety

ComuniCare is a **support tool, not a medical diagnosis**. It uses cautious language and reminds the user to trust their intuition and consult a pediatrician for concerns.
