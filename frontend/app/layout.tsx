import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeScript } from "@/components/ThemeScript";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"]
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"]
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"]
});

// Monad style-guide experiment (landing page only) — substitutes for the
// paid Untitled Serif / ABC Diatype Mono typefaces.
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-monad-mono",
  weight: ["400", "500"]
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-monad-serif",
  weight: ["400"]
});

export const metadata: Metadata = {
  title: "Codence",
  description: "Frontend shell for Codence hackathon flow."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${ibmPlexMono.variable} ${sourceSerif4.variable}`}
    >
      <body>
        <ThemeScript />
        <div className="page-shell flex min-h-screen flex-col">
          <SiteHeader />
          <main className="relative z-10 flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
