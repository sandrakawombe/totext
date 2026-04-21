"use client";

import { Mic, Image as ImageIcon } from "lucide-react";

export type Mode = "speech" | "image";

interface Props {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export default function ModeToggle({ mode, onChange }: Props) {
  return (
    <div
      role="tablist"
      className="inline-flex p-1.5 glass rounded-full shadow-soft
                 w-full sm:w-auto"
    >
      <TabButton
        active={mode === "speech"}
        onClick={() => onChange("speech")}
        icon={<Mic size={16} />}
        label="Speech"
      />
      <TabButton
        active={mode === "image"}
        onClick={() => onChange("image")}
        icon={<ImageIcon size={16} />}
        label="Image"
      />
    </div>
  );
}

function TabButton({
  active, onClick, icon, label,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2
                  px-5 sm:px-6 py-3 rounded-full text-sm font-medium
                  transition-all flex-1 sm:flex-initial
                  ${active
                    ? "bg-plum-ink text-cream shadow-ink"
                    : "text-plum-soft hover:text-magenta"}`}
    >
      {icon}
      {label}
    </button>
  );
}
