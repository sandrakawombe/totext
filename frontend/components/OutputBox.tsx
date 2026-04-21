"use client";

import { useState } from "react";
import { Copy, Download, Trash2, Check } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function OutputBox({ value, onChange }: Props) {
  const [copied, setCopied] = useState(false);

  const chars = value.trim().length;
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  async function copy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard permission denied — silently fail */
    }
  }

  function download() {
    if (!value) return;
    const blob = new Blob([value], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `totext-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function clear() {
    if (!value) return;
    if (confirm("Clear the transcript?")) onChange("");
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <h3 className="font-display text-xl text-plum font-normal">Transcript</h3>
        <div className="text-xs font-mono text-plum-soft">
          <span className="text-magenta font-medium">{words}</span> words ·{" "}
          <span className="text-magenta font-medium">{chars}</span> chars
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Your transcribed text will appear here…"
        className="w-full min-h-[180px] px-5 py-4 rounded-[22px]
                   bg-white/85 border border-lavender-600/18
                   font-display text-[17px] leading-relaxed text-plum
                   resize-y outline-none transition-all
                   focus:border-magenta focus:ring-4 focus:ring-magenta/12
                   focus:bg-white
                   placeholder:text-plum-soft/40 placeholder:italic"
      />

      <div className="flex flex-wrap gap-2.5 mt-3.5">
        <ActionButton onClick={copy} disabled={!value}>
          {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
        </ActionButton>
        <ActionButton onClick={download} disabled={!value}>
          <Download size={14} /> Download .txt
        </ActionButton>
        <ActionButton onClick={clear} disabled={!value}>
          <Trash2 size={14} /> Clear
        </ActionButton>
      </div>
    </div>
  );
}

function ActionButton({
  onClick, disabled, children,
}: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                 text-sm font-medium text-plum
                 bg-transparent border border-plum/20
                 transition-all hover:bg-lavender-100/60 hover:-translate-y-0.5
                 disabled:opacity-40 disabled:cursor-not-allowed
                 disabled:hover:translate-y-0 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
