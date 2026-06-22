import type { Metadata, Viewport } from "next";
import { mono, sans, serif } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tahona Hubs | Pan artesanal para recoger",
  description:
    "Pan artesanal Tahona apartado por semana, con retiro en hubs y casilleros inteligentes.",
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2040D0"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX">
      <body className={`${serif.variable} ${sans.variable} ${mono.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
