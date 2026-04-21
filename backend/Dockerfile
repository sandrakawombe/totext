FROM python:3.12-slim

# Install Tesseract OCR + language packs at the system level.
# This is why we use Docker for this service — Render's plain Python
# runtime can't install apt packages.
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-eng \
    tesseract-ocr-fra \
    tesseract-ocr-spa \
    tesseract-ocr-deu \
    tesseract-ocr-ita \
    tesseract-ocr-por \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Render/Fly pass PORT; fallback to 8000 for local Docker runs.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
