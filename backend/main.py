"""
ToText — OCR backend.

Endpoints
---------
GET  /                health check
GET  /api/languages   which Tesseract language packs are installed
POST /api/ocr         accept an image file, return extracted text

Run locally:
    uvicorn main:app --reload --port 8000

Requires Tesseract OCR installed on the system (handled by Dockerfile).
"""
from __future__ import annotations

import io
import logging
import os

import pytesseract
from PIL import Image, UnidentifiedImageError
from fastapi import FastAPI, File, HTTPException, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

log = logging.getLogger("totext")
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="ToText API", version="1.0.0")

# ---------- CORS ----------
origins = [
    o.strip()
    for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    if o.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
    allow_credentials=False,
)

# ---------- config ----------
MAX_IMAGE_BYTES = 10 * 1024 * 1024  # 10 MB
SUPPORTED_LANGS = {"eng", "fra", "spa", "deu", "ita", "por"}


# ---------- models ----------
class OCRResult(BaseModel):
    text: str
    chars: int
    words: int
    lang: str


# ---------- routes ----------
@app.get("/")
def health() -> dict:
    return {"ok": True, "service": "totext-api"}


@app.get("/api/languages")
def languages() -> dict:
    """Which OCR language packs are installed on this server."""
    try:
        available = set(pytesseract.get_languages(config=""))
    except pytesseract.TesseractError:
        available = {"eng"}
    return {"languages": sorted(available & SUPPORTED_LANGS)}


@app.post("/api/ocr", response_model=OCRResult)
async def ocr(
    image: UploadFile = File(...),
    lang: str = Query("eng", description="Tesseract language code: eng, fra, spa, deu, ita, por"),
) -> OCRResult:
    """Extract text from an uploaded image."""
    if lang not in SUPPORTED_LANGS:
        raise HTTPException(
            400, f"Unsupported language '{lang}'. Supported: {sorted(SUPPORTED_LANGS)}"
        )

    content = await image.read()
    if not content:
        raise HTTPException(400, "Empty upload.")
    if len(content) > MAX_IMAGE_BYTES:
        raise HTTPException(
            413, f"Image too large (max {MAX_IMAGE_BYTES // 1024 // 1024} MB)."
        )

    # decode + validate
    try:
        Image.open(io.BytesIO(content)).verify()
        img = Image.open(io.BytesIO(content))       # verify() consumes the file object
    except UnidentifiedImageError:
        raise HTTPException(400, "Could not decode image. Supported formats: PNG, JPEG, WEBP, TIFF.")
    except Exception as exc:
        raise HTTPException(400, f"Invalid image: {exc}") from exc

    # normalize for OCR — RGB, reasonable max dimension
    if img.mode not in ("RGB", "L"):
        img = img.convert("RGB")
    max_side = 2500
    if max(img.size) > max_side:
        ratio = max_side / max(img.size)
        img = img.resize((int(img.size[0] * ratio), int(img.size[1] * ratio)), Image.LANCZOS)

    # OCR
    try:
        text = pytesseract.image_to_string(img, lang=lang).strip()
    except pytesseract.TesseractError as exc:
        log.exception("Tesseract failed")
        raise HTTPException(500, f"OCR failed: {exc}") from exc

    words = len([w for w in text.split() if w])
    return OCRResult(text=text, chars=len(text), words=words, lang=lang)
