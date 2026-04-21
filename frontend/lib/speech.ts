/**
 * Cross-browser Web Speech API wrapper.
 *
 * The API works in Chrome, Edge, Safari (incl. iOS). Firefox does not
 * support it natively — we return `null` from `getRecognition()` and
 * the UI shows an "unsupported browser" message.
 */

// webkit prefix on older Chrome/Safari
type SRConstructor = new () => SpeechRecognition;

interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror:  ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend:    (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event { error: string; }

declare global {
  interface Window {
    SpeechRecognition?:       SRConstructor;
    webkitSpeechRecognition?: SRConstructor;
  }
}

export function isSupported(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createRecognition(lang: string): SpeechRecognition | null {
  if (!isSupported()) return null;
  const SR = (window.SpeechRecognition || window.webkitSpeechRecognition)!;
  const r = new SR();
  r.lang = lang;
  r.interimResults = true;
  r.continuous = true;
  return r;
}

export const LANGUAGES: { code: string; label: string }[] = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "es-ES", label: "Español" },
  { code: "fr-FR", label: "Français" },
  { code: "de-DE", label: "Deutsch" },
  { code: "it-IT", label: "Italiano" },
  { code: "pt-PT", label: "Português" },
];
