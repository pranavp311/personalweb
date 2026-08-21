import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Bodoni_Moda } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import ThemeToggle from "@/components/ThemeToggle";
import { defaultFavicon, faviconInitScript } from "@/lib/favicon";
import { themeCss } from "@/lib/theme";
import { DEFAULT_THEME } from "@/lib/theme-preference";
import "./globals.css";
import "./fonts.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pranavpappu.dev"),
  title: "Pranav Pappu",
  description: "Builder / AI Researcher",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pranav Pappu",
    description: "Builder / AI Researcher",
    url: "/",
    siteName: "Pranav Pappu",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranav Pappu",
    description: "Builder / AI Researcher",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
      className={`${jakarta.variable} ${jetbrainsMono.variable} ${bodoni.variable}`}
    >
      <head>
        <link
          id="site-favicon"
          rel="icon"
          href={defaultFavicon}
          type="image/svg+xml"
          sizes="any"
        />
        <script dangerouslySetInnerHTML={{ __html: faviconInitScript }} />
        <style id="theme-tokens">{themeCss}</style>
      </head>
      <body>
        <ThemeToggle />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
