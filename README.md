# ToText — speech + image to text

> Live: <https://totext-sandra.vercel.app>  
> Tech: React · FastAPI · Tesseract OCR · Web Speech API

A clean utility that turns **voice into text** (live, in your browser) and
**images into text** (via a Python OCR backend). Journals, meetings, receipts,
handwritten notes — all in seconds, no sign-up.

![ToText screenshot](docs/screenshot.png)

## Features

- 🎙️ **Live speech-to-text** — browser-native Web Speech API. Works in Chrome, Edge, Safari (incl. iOS).
- 📷 **Image OCR** — drop a photo, scan, or screenshot → get the text out. Handles PNG, JPG, WEBP up to 10 MB.
- 🌍 **Multi-language** — 6 OCR languages (English, French, Spanish, German, Italian, Portuguese). Speech supports 7 locales.
- ✨ **Clean glassmorphic UI** with the same design system as my portfolio.
- 🗄️ **Zero server storage** — your data never touches a database. Images are processed in-memory, then discarded.
- 📱 **Mobile-first** — built to feel great on a phone (where you actually want to record speech).

## Stack

| Layer    | Tech                                              |
|----------|---------------------------------------------------|
| Frontend | Next.js 14 · TypeScript · Tailwind · Framer Motion |
| Backend  | FastAPI · Pydantic · pytesseract · Pillow          |
| OCR      | Tesseract (installed via Docker)                   |
| Hosting  | Vercel (frontend) · Render (backend, Docker)       |

## Project structure

```
totext/
├── preview.html              ← open in browser, works immediately (no install)
├── docker-compose.yml        ← one-command local dev
│
├── frontend/                 ← Next.js 14
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx          ← single page, two modes
│   │   └── globals.css
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── ModeToggle.tsx
│   │   ├── SpeechPanel.tsx   ← Web Speech API wrapper + UI
│   │   ├── ImagePanel.tsx    ← drop zone → backend OCR
│   │   ├── OutputBox.tsx     ← textarea + copy/download/clear
│   │   └── BlobBg.tsx        ← animated ambient background
│   ├── lib/
│   │   ├── speech.ts         ← cross-browser speech recognition
│   │   └── api.ts            ← backend client
│   └── Dockerfile · tailwind.config.ts · …
│
└── backend/                  ← FastAPI + Tesseract
    ├── main.py               ← /api/ocr · /api/languages · /
    ├── requirements.txt
    └── Dockerfile            ← installs tesseract-ocr at system level
```

---

## Quickstart — just look

```bash
open preview.html        # macOS
xdg-open preview.html    # Linux
start preview.html       # Windows
```

That self-contained file runs both features in-browser via Tesseract.js.
No Node, no Python, no install.

## Quickstart — run the full stack locally

```bash
docker compose up --build
```

Frontend at <http://localhost:3000>, backend at <http://localhost:8000>.

Or run each half natively:

```bash
# frontend
cd frontend
cp .env.example .env.local
npm install
npm run dev

# backend (in another terminal)
cd backend
# ⚠️ Requires Tesseract OCR on your machine:
#   macOS:   brew install tesseract
#   Ubuntu:  sudo apt install tesseract-ocr
#   Windows: https://github.com/UB-Mannheim/tesseract/wiki
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs auto-generated at <http://localhost:8000/docs>.

---

## Deploy to production

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — ToText"
gh repo create totext --public --source=. --push
```

### 2. Frontend → Vercel

1. <https://vercel.com/new> → import the `totext` repo
2. **Root Directory** → `frontend`
3. Framework preset → Next.js (auto-detected)
4. Env var: `NEXT_PUBLIC_API_URL` → set to `http://localhost:8000` for now (updated in step 4)
5. **Deploy**

You'll get a URL like `https://totext-sandra.vercel.app`.

### 3. Backend → Render (Docker)

This backend **must** use Docker (not Render's plain Python runtime) because
Tesseract is a system-level apt package.

1. <https://dashboard.render.com/> → **New → Web Service**
2. Connect `totext` repo
3. Fill in:

   | Field               | Value                              |
   |---------------------|------------------------------------|
   | **Name**            | `totext-api`                       |
   | **Language**        | **Docker** *(critical)*            |
   | **Root Directory**  | `backend`                          |
   | **Branch**          | `main`                             |
   | **Plan**            | Free                               |

4. Environment variable:

   | Key                | Value                                |
   |--------------------|--------------------------------------|
   | `ALLOWED_ORIGINS`  | `https://totext-sandra.vercel.app`   |

   *(Put your actual Vercel URL here. Comma-separate multiple, no trailing slashes.)*

5. **Create Web Service**. First build takes 5-7 min (Tesseract + language packs).

6. Once live, copy the URL (e.g. `https://totext-api.onrender.com`) and hit it in
   your browser — you should see `{"ok":true,"service":"totext-api"}`.

### 4. Connect frontend to backend

1. Back in **Vercel** → your project → **Settings → Environment Variables**
2. Edit `NEXT_PUBLIC_API_URL` → paste your Render URL
3. **Deployments** → ⋯ → **Redeploy**

Visit your Vercel URL. Upload an image. Watch Python do the work. 🎉

> **Note:** Render's free tier sleeps after 15 min of no traffic. First request
> after idle takes ~30 sec to wake. Fine for a portfolio; upgrade to $7/mo
> Starter plan to keep it always-on.

---

## API reference

The backend exposes a tiny, clean JSON API:

### `GET /`
Health check. Returns `{"ok": true, "service": "totext-api"}`.

### `GET /api/languages`
Lists OCR language packs installed on this server.
Returns `{"languages": ["eng", "fra", "spa", ...]}`.

### `POST /api/ocr`
Extract text from an uploaded image.

**Request** (multipart/form-data):
- `image` — the image file (PNG/JPEG/WEBP/TIFF, ≤ 10 MB)

**Query params:**
- `lang` — language code (default `eng`). One of: `eng`, `fra`, `spa`, `deu`, `ita`, `por`.

**Response:**
```json
{
  "text":  "The full extracted text.",
  "chars": 42,
  "words": 8,
  "lang":  "eng"
}
```

**Errors:** 400 (bad input), 413 (too large), 500 (OCR failed).

---

## What I learned building this

- **Web Speech API is great but quirky** — Chrome's continuous mode auto-stops
  after ~60 seconds, so the UI auto-restarts it. iOS Safari needed explicit
  permission handling. Firefox still doesn't support it.
- **Tesseract loves preprocessed images** — resizing anything over 2500px down
  before OCR improved both speed and accuracy. Low-contrast scans still
  struggle; proper preprocessing (binarization, deskew) would be a v2 upgrade.
- **Render's Python runtime vs Docker** — the plain runtime can't `apt install`
  system packages, so anything needing Tesseract / ffmpeg / poppler has to ship
  as Docker. Build is slower but works.

---

## Roadmap

- [ ] PDF support (pdf2image → Tesseract page-by-page)
- [ ] Language auto-detect on the server
- [ ] Image preprocessing (binarization, deskew) for better OCR on low-contrast scans
- [ ] Export to `.md` / `.docx`
- [ ] Client-side history (localStorage)
- [ ] Whisper backend as a speech-to-text fallback for Firefox users

---

Built by [Sandra Kawombe](https://github.com/sandrakawombe). [LinkedIn](https://www.linkedin.com/in/sandra-nakayima/) · [kawombe60@gmail.com](mailto:kawombe60@gmail.com)

MIT License.
