# Musicology

A client-side React app that parses your Spotify extended streaming history and turns it into personalized data visualizations — no server, no accounts, no data ever leaves your browser.

**[Try it live →](https://musicology-one.vercel.app)**

---

## What it does

Upload your Spotify data zip and Musicology generates a set of insight cards about your listening history:

- **First Song** — the very first track in your Spotify history
- **Most Played** — your most-played song by play count and by total time
- **Most Skipped** — the song you keep starting and bailing on
- **Least Played** — the one that never got a fair shot
- **Rage Quits** — tracks you've skipped under 5 seconds, every time
- **Mood Shift** — what you reach for in the morning vs late at night
- **Rediscoveries** — songs you loved, forgot about, and came back to (clickable — cycles through all matches)
- **Where Were You When...** — your listening snapshot at cultural moments: Kendrick's "Not Like Us" drop, Election Night 2024, Chappell Roan at Coachella, and more. Add your own dates too.
- **Year Timeline** — click any year in your history to see that year's stats

---

## Privacy

All processing happens locally in your browser. Your data is never uploaded to any server. The app uses the [Deezer API](https://developers.deezer.com) only to fetch album artwork.

---

## Getting started

### Using your own Spotify data

1. Go to [spotify.com/account](https://www.spotify.com/account) and log in
2. Navigate to **Privacy Settings → Download your data**
3. Check **Extended streaming history** and submit the request
4. Wait for Spotify's email (up to 30 days) then download the zip
5. Drag the zip file onto the Musicology upload page

### Using sample data

Don't want to wait? Download the sample dataset and drag it onto the upload page to try the app instantly.

**[Download sample data →](https://musicology-one.vercel.app/sample-data.zip)**

---

## Running locally

```bash
git clone https://github.com/jigaski/musicology
cd musicology
npm install
npm run dev
```

Requires Node.js 18+. The Deezer API proxy is configured in `vite.config.js` for local development. On Vercel, `vercel.json` handles the rewrite.

---

## Tech stack

- **React** — component-based UI
- **Vite** — build tooling and local dev proxy
- **JSZip** — in-browser zip file parsing
- **Deezer API** — album artwork lookups
- **Vercel** — deployment and API proxy

---

## Project structure

```
src/
├── components/
│   └── cards/          # Individual stat card components
│       ├── StatsCard.jsx
│       ├── FirstSong.jsx
│       ├── MostPlayed.jsx
│       ├── MostSkipped.jsx
│       ├── LeastPlayed.jsx
│       ├── RageQuits.jsx
│       ├── MoodShift.jsx
│       └── Rediscoveries.jsx
├── utils/
│   ├── stats.js        # All data computation logic
│   └── useRandomCycle.js
├── Landing.jsx
├── Upload.jsx
└── Starfield.jsx
```

---

## Author

Jordan Gaskin — [github.com/jigaski](https://github.com/jigaski) · [linkedin.com/in/jordan-gaskin-081998](https://linkedin.com/in/jordan-gaskin-081998)
