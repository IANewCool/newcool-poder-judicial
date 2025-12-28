import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Poder Judicial Chile | NewCooltura Informada",
  description: "Buscador de causas judiciales, estructura del Poder Judicial y guia procesal de Chile",
  keywords: ["poder judicial", "causas judiciales", "tribunales Chile", "consulta causas", "juzgados"],
  openGraph: {
    title: "Poder Judicial Chile - NewCooltura Informada",
    description: "Consulta de causas y tribunales",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
