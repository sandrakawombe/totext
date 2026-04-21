"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { createRecognition, isSupported, LANGUAGES } from "@/lib/speech";

interface Props { onAppendText: (text: string) => void; }

export default function SpeechPanel({ onAppendText }: Props) {
  const [recording, setRecording] = useState(false);
  const [lang, setLang] = useState("en-US");
  const [status, setStatus] = useState("");
  const [supported, setSupported] = useState(true);
  const recRef = useRef<ReturnType<typeof createRecognition> | null>(null);
  const interimRef = useRef<string>("");
  const onAppendRef = useRef(onAppendText);
  onAppendRef.current = onAppendText;

  useEffect(() => { setSupported(isSupported()); }, []);
  useEffect(() => () => { try { recRef.current?.stop(); } catch {} }, []);

  function start() {
    const r = createRecognition(lang);
    if (!r) { setSupported(false); return; }

    r.onresult = (e) => {
      let finalText = "", interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const chunk = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += chunk; else interim += chunk;
      }
      if (finalText) {
        onAppendRef.current(finalText.trim() + " ");
        interimRef.current = "";
      }
      // we intentionally don't render interim in the output here — avoids
      // double-commits. The live caption could be added with a dedicated state.
      interimRef.current = interim;
    };
    r.onerror = (e) => { setStatus(`Mic error: ${e.error}`); stop(); };
    r.onend = () => {
      // chrome drops continuous sessions after ~60s; auto-restart if the user
      // hasn't hit Stop
      if (recRef.current && recording) { try { r.start(); } catch {} }
    };

    try {
      r.start();
      recRef.current = r;
      setRecording(true);
      setStatus("");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not start.");
    }
  }

  function stop() {
    try { recRef.current?.stop(); } catch {}
    recRef.current = null;
    setRecording(false);
  }

  if (!supported) {
    return (
      <div className="glass rounded-3xl p-6 sm:p-7">
        <p className="font-display text-xl text-plum">
          Browser <em className="italic text-blush-500 font-light">unsupported</em>
        </p>
        <p className="text-sm text-plum-soft mt-2">
          Live speech-to-text uses the Web Speech API. Use Chrome, Edge, or Safari
          (desktop or iOS) to try this feature. Image-to-text works in every browser.
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6 sm:p-7">
      <div className="flex items-center gap-5 flex-wrap">
        <motion.button
          onClick={() => (recording ? stop() : start())}
          whileTap={{ scale: 0.94 }}
          aria-label={recording ? "Stop recording" : "Start recording"}
          className={`w-[72px] h-[72px] rounded-full flex items-center justify-center
                      text-white transition-shadow
                      bg-gradient-to-br from-magenta to-blush-500
                      ${recording ? "animate-pulseRing" : "shadow-lg"}`}
        >
          <Mic size={26} />
        </motion.button>

        <div className="flex-1 min-w-[200px]">
          <p className="font-display text-xl text-plum leading-tight">
            {recording ? (
              <>Listening <em className="italic text-blush-500 font-light">closely</em>…</>
            ) : (
              <>Tap to <em className="italic text-blush-500 font-light">begin</em></>
            )}
          </p>
          <p className="text-xs text-plum-soft mt-1">
            {recording
              ? "Tap the mic again to stop. Your speech stays on-device."
              : "Your browser will ask for microphone permission the first time."}
          </p>
        </div>

        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          disabled={recording}
          aria-label="Language"
          className="px-3.5 py-2.5 rounded-xl bg-white/85
                     border border-lavender-600/18 text-sm text-plum cursor-pointer
                     outline-none focus:border-magenta
                     focus:ring-4 focus:ring-magenta/15 disabled:opacity-60"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>

      {/* vu meter */}
      <div className={`flex items-end gap-[3px] h-7 mt-5 transition-opacity
                       ${recording ? "opacity-100" : "opacity-30"}`}>
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className={`flex-1 bg-magenta rounded-sm origin-bottom
                        ${recording ? "animate-vu" : ""}`}
            style={{
              height: `${[30,50,70,40,80,60,90,45,75,55,65,35,85,50,70,40][i]}%`,
              animationDelay: `${i * 0.08}s`,
            }}
          />
        ))}
      </div>

      {status && <p className="text-sm text-blush-500 mt-3">{status}</p>}
    </div>
  );
}
