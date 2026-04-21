import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", axes: ["opsz"] });
const jakarta  = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });
const mono     = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "ToText — speech + image to text",
  description:
    "Capture speech live, or scan images to extract clean text. Built by Sandra Kawombe with React and Python.",
  authors: [{ name: "Sandra Kawombe", url: "https://github.com/sandrakawombe" }],
  openGraph: {
    title: "ToText — speech + image to text",
    description: "Turn voice and images into text, instantly.",
    type: "website",
    siteName: "ToText",
  },
  themeColor: "#FBF6EF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable} ${mono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
