import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "APPGYM - Entrenador Invisible",
  description: "Cero excusas. Cero fricción. Solo progreso.",
  themeColor: "#0a0a0a",
  manifest: "/manifest.json",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${inter.variable} font-sans bg-[#050505] text-white antialiased selection:bg-brand-orange/30 selection:text-brand-orange`}
      >
        <Providers>
          <main className="min-h-screen w-full relative">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
