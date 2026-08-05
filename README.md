# Angry Uncle 👴😡

A tiny browser game inspired by the party-game classic: tap boxes on a grid one at a
time, revealing calm faces — except one, which is the **angry uncle**. Survive as
many taps as you can before you wake him up.

No frameworks, no build step — just static HTML/CSS/JS, so it deploys anywhere
for free.

## Play locally

Open `index.html` directly in a browser, or serve the folder:

```bash
npx serve .
```

## Deploy to Vercel (free)

1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Framework preset: **Other** (it's a static site, no build command needed).
4. Click **Deploy** — Vercel serves `index.html` at the root automatically.

Or via the CLI:

```bash
npm i -g vercel
vercel
```

## How it works

- Pick a grid size (3×3 up to 8×8).
- Tap boxes one at a time. Safe boxes flip to reveal a calm face and stay open.
- One randomly-placed box is the angry uncle — tap it and the round ends.
- Clear every safe box without hitting the angry uncle to win the round.
- Your best streak per grid size is saved locally in your browser.

## Files

- `index.html` — page structure
- `style.css` — layout, theme (light/dark aware), animations
- `script.js` — game logic (grid generation, reveal/lose/win state, best-score tracking)
