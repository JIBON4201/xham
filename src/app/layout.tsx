import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AdScriptsProvider } from "@/components/ad-scripts-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://xham-amber.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  /* ─── Primary Meta ─── */
  title: "Private Video Platform (2026) – Instant Access | VaultStream",
  description:
    "Stream exclusive private HD & 4K videos instantly — no signup, no credit card. VaultStream offers secure encrypted streaming with zero tracking. 50,000+ premium videos available worldwide.",
  keywords: [
    "Sex video",
    "xxx video",
    "Beautiful girl",
    "beautiful girl sex",
    "viral sex video",
    "Sex xxx xnxx",
    "xhamster",
    "sexy girl porn video",
    "hot girl",
    "pronhub sex video",
    "porn",
    "porn video",
    "naked video",
    "Miya Khalifa",
    "Jony Sing",
    "sunny Leone",
    "doggy style",
  ],

  /* ─── Authors & Publisher ─── */
  authors: [{ name: "VaultStream", url: SITE_URL }],
  creator: "VaultStream",
  publisher: "VaultStream",

  /* ─── Canonical & Alternates ─── */
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": SITE_URL,
      "en-GB": SITE_URL,
      "en-AU": SITE_URL,
      "en-CA": SITE_URL,
    },
  },

  /* ─── Open Graph (Facebook, LinkedIn, etc.) ─── */
  openGraph: {
    title: "Private Video Platform (2026) – Instant Access | VaultStream",
    description:
      "Stream 50,000+ exclusive private videos in HD & 4K. No signup required. End-to-end encrypted, zero tracking. The #1 private video platform trusted by 2.4M+ viewers.",
    url: SITE_URL,
    siteName: "VaultStream",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1152,
        height: 864,
        alt: "VaultStream — Private Video Platform with Instant HD Streaming Access",
        type: "image/png",
      },
    ],
  },

  /* ─── Twitter Card ─── */
  twitter: {
    card: "summary_large_image",
    title: "Private Video Platform (2026) – Instant Access | VaultStream",
    description:
      "Stream 50,000+ exclusive private videos in HD & 4K. No signup, encrypted, private. Join 2.4M+ viewers.",
    images: ["/og-image.png"],
    creator: "@vaultstream",
  },

  /* ─── Robots & Crawling ─── */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* ─── Icons ─── */
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },

  /* ─── Other ─── */
  category: "Entertainment",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href={SITE_URL} />
        {/* Google Search Console verification */}
        <meta name="google-site-verification" content="0GDeDF84F2MqU6LjqWzbeXS37EOJCWbGHUYWp3VfcSA" />
        {/* Bing Webmaster Tools (replace with real code) */}
        <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <AdScriptsProvider />
        <Toaster />
      </body>
    </html>
  );
}
