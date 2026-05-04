import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });

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
        className={`${inter.variable} ${bebas.variable} font-sans bg-[#0a0a0a] text-white antialiased selection:bg-brand-orange/30 selection:text-brand-orange`}
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
