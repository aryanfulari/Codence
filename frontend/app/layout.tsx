import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

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
    <html lang="en">
      <body>
        <div className="page-shell min-h-screen">
          <SiteHeader />
          <main className="relative z-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
