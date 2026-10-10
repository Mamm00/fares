import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Anton, Archivo, Space_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "FARES MASHOUR® — Heavyweight Streetwear",
  description:
    "Fares Mashour is a heavyweight streetwear label. 240 GSM tees, armourweight fleece hoodies and accessories. Cut boxy. Printed loud. Worn everywhere.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${anton.variable} ${archivo.variable} ${spaceMono.variable} bg-ink text-paper font-body antialiased`}
      >
        <div className="grain" aria-hidden="true" />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
