"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, ArrowRight } from "lucide-react";
import { extractText } from "@/lib/api";

interface Props { onAppendText: (text: string) => void; }

const MAX_BYTES = 10 * 1024 * 1024;
const OK_TYPES = ["image/png", "image/jpeg", "image/webp"];

export default function ImagePanel({ onAppendText }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ kind: "err" | "ok" | ""; msg: string }>({ kind: "", msg: "" });
  const inputRef = useRef<HTMLInputElement>(null);

  function loadFile(f: File | undefined | null) {
    if (!f) return;
    if (!OK_TYPES.includes(f.type)) {
      return setStatus({ kind: "err", msg: "Please pick a PNG, JPG, or WEBP image." });
    }
    if (f.size > MAX_BYTES) {
      return setStatus({ kind: "err", msg: "Image is larger than 10 MB." });
    }
    setStatus({ kind: "", msg: "" });
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(String(e.target?.result ?? ""));
    reader.readAsDataURL(f);
  }

  async function runExtract() {
    if (!file) return;
    setLoading(true);
    setStatus({ kind: "", msg: "" });
    try {
      const result = await extractText(file, "eng");
      if (!result.text) {
        setStatus({ kind: "err", msg: "No text detected. Try a clearer or higher-contrast image." });
      } else {
        onAppendText(result.text + "\n");
        setStatus({ kind: "ok", msg: `✓ Extracted ${result.chars} characters (${result.words} words).` });
      }
    } catch (err) {
      setStatus({ kind: "err", msg: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass rounded-3xl p-6 sm:p-7">
      <label
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]); }}
        className={`block border-2 border-dashed rounded-[22px] px-6 py-10 text-center
                    cursor-pointer transition-colors
                    ${dragging
                      ? "border-magenta bg-blush-100/30 text-blush-500"
                      : "border-lavender-600/30 bg-white/35 text-plum-soft hover:border-magenta hover:text-blush-500"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => loadFile(e.target.files?.[0])}
        />
        <Upload size={30} className="mx-auto mb-2.5" />
        <p className="font-display text-xl text-plum">Drop an image here</p>
        <p className="text-xs mt-1">or tap to browse · PNG, JPG, WEBP · up to 10 MB</p>
      </label>

      {previewUrl && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 p-4 rounded-2xl bg-white/75 border border-lavender-600/15"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Uploaded preview"
            className="max-w-full max-h-72 rounded-xl mx-auto block"
          />
          <div className="flex justify-between items-center mt-3.5 gap-3 flex-wrap text-xs text-plum-soft">
            <span className="truncate">
              {file?.name} · {file ? `${Math.round(file.size / 1024)} KB` : ""}
            </span>
            <button
              onClick={runExtract}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                         bg-plum-ink text-cream text-sm font-medium shadow-ink
                         transition-transform hover:-translate-y-0.5
                         disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? "Extracting…" : "Extract text"}
              {!loading && <ArrowRight size={14} />}
            </button>
          </div>
          {loading && (
            <div className="mt-3">
              <div className="h-1 rounded-full bg-lavender-600/18 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-magenta to-lavender-600"
                  initial={{ width: "10%" }}
                  animate={{ width: ["10%", "80%", "60%", "90%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <p className="text-[11px] text-plum-soft text-center mt-1.5">
                Sending to OCR server…
              </p>
            </div>
          )}
        </motion.div>
      )}

      {status.msg && (
        <p className={`text-sm mt-3 ${status.kind === "ok" ? "text-[#3F8C5A]" : "text-blush-500"}`}>
          {status.msg}
        </p>
      )}
    </div>
  );
}
