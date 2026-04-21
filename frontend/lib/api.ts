const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type OCRResult = {
  text: string;
  chars: number;
  words: number;
  lang: string;
};

/**
 * Upload an image to the FastAPI backend and get back extracted text.
 * Throws on any non-2xx response with the backend's error detail.
 */
export async function extractText(file: File, lang = "eng"): Promise<OCRResult> {
  const body = new FormData();
  body.append("image", file);

  const res = await fetch(`${API_URL}/api/ocr?lang=${encodeURIComponent(lang)}`, {
    method: "POST",
    body,
  });

  if (!res.ok) {
    const msg = await res
      .json()
      .then((d) => d.detail || `Server returned ${res.status}`)
      .catch(() => `Server returned ${res.status}`);
    throw new Error(msg);
  }

  return res.json();
}

/** Languages supported on the server. Safe to call on mount; fails silently. */
export async function fetchLanguages(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/api/languages`);
    if (!res.ok) return ["eng"];
    const data = await res.json();
    return data.languages || ["eng"];
  } catch {
    return ["eng"];
  }
}
