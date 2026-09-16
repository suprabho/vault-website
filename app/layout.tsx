import type { Metadata } from "next";
import { Familjen_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import RevealObserver from "@/components/layout/RevealObserver";

const familjen = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-familjen",
  display: "swap",
});

const newYork = localFont({
  src: [
    { path: "../public/fonts/new-york-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/new-york-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/new-york-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-new-york",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Vault — Where crypto compliance continues",
  description:
    "A private network for the people navigating financial crime, regulation and risk in digital assets — through trusted intelligence, considered introductions and closed-door convenings.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${familjen.variable} ${newYork.variable}`}>
      <body>
        <RevealObserver />
        {children}
      </body>
    </html>
  );
}
