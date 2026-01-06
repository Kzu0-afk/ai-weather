import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "./components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Weather | Find calm, clear forecasts",
  description: "A minimal, intelligent weather application with clean architecture. Search by city for essential weather data—temperature, humidity, wind, and conditions.",
  keywords: ["weather", "forecast", "weather app", "weather API", "climate"],
  authors: [{ name: "AI Weather" }],
  openGraph: {
    title: "AI Weather | Find calm, clear forecasts",
    description: "A minimal, intelligent weather application with clean architecture.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f7fb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
