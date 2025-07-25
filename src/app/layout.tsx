import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard Laporan Bencana Provinsi Lampung",
  description: "Dibuat oleh Tim SYBAUG | SECOMP 2025",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head> 
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-sA+e2SM1ChXQxgMKCyDgZPUNIqzY9e1D06D+W+6P5eI="
          crossOrigin=""
        />
        <link
          rel="icon"
          href="/img/logo_2.png"
          type="image/png"
        />
        <title>Dashboard Laporan Bencana Provinsi Lampung</title>

      </head>
      <body className={`${geistSans.className} ${geistMono.className}`}>
        {children}
      </body>
    </html>
  );
}
