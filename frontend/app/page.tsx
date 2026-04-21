"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BlobBg from "@/components/BlobBg";
import Header from "@/components/Header";
import ModeToggle, { Mode } from "@/components/ModeToggle";
import SpeechPanel from "@/components/SpeechPanel";
import ImagePanel from "@/components/ImagePanel";
import OutputBox from "@/components/OutputBox";

export default function HomePage() {
  const [mode, setMode] = useState<Mode>("speech");
  const [text, setText] = useState("");

  function appendText(chunk: string) {
    setText((prev) => {
      if (!prev) return chunk;
      const sep = prev.endsWith(" ") || prev.endsWith("\n") ? "" : " ";
      return prev + sep + chunk;
    });
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <BlobBg />
      <Header />

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 pt-10 sm:pt-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className="label">Listen · Scan · Extract</div>
          <h1 className="font-display font-normal leading-[0.98] tracking-tight
                         text-plum mt-5 text-[clamp(40px,7vw,64px)]
                         serif-display">
            Your words,<br />
            your notes, <em className="text-blush-500">instantly</em>.
          </h1>
          <p className="mt-4 max-w-lg text-lg text-plum-soft leading-relaxed">
            Capture speech live, or drop in a photo of anything with text — ToText
            turns both into clean, copyable text in seconds. Journals, meetings,
            receipts, handwritten notes. No sign-up.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-8"
        >
          <ModeToggle mode={mode} onChange={setMode} />
        </motion.div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {mode === "speech"
                ? <SpeechPanel onAppendText={appendText} />
                : <ImagePanel onAppendText={appendText} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <OutputBox value={text} onChange={setText} />
      </div>

      <footer className="relative z-10 pt-6 pb-10 text-center text-xs text-plum-soft
                         border-t border-lavender-600/12 max-w-4xl mx-auto px-5 sm:px-6">
        Built with <span className="text-magenta">♡</span> by{" "}
        <a href="https://github.com/sandrakawombe" target="_blank" rel="noopener"
           className="text-magenta hover:underline">Sandra Kawombe</a>
        {" "}· React + Python ·{" "}
        <a href="https://www.linkedin.com/in/sandra-nakayima/" target="_blank" rel="noopener"
           className="text-magenta hover:underline">LinkedIn</a>
      </footer>
    </main>
  );
}
