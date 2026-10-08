import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import RevealObserver from "@/components/layout/RevealObserver";
import { SITE_URL } from "@/lib/site";

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

const title = "The Vault — Where crypto compliance continues";
const description =
  "A private network for the people shaping and navigating financial crime, regulation and risk across digital assets.";

/* favicon.ico, icon.svg, apple-icon.png and the share images are file conventions in app/ (scripts/make-brand-assets.mjs) */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: "The Vault",
  openGraph: { type: "website", siteName: "The Vault", title, description, locale: "en_GB" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = { themeColor: "#010016", colorScheme: "dark" };

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
