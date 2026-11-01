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
  title: "ELEMENT EXPLORER — Interactive Periodic Table & 3D Chemistry Experience",
  description:
    "Explore the building blocks of everything. A world-class scientific instrument combining real-time 3D atomic orbital visualizations, comprehensive IUPAC/NIST scientific data, and precision periodic table exploration.",
  keywords: [
    "Periodic Table",
    "3D Chemistry",
    "Atomic Orbitals",
    "Chemical Elements",
    "IUPAC",
    "Quantum Orbitals",
    "Scientific Instrument",
  ],
  icons: {
    icon: [
      { url: "/element_logo.png", type: "image/png" },
      { url: "/icon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/element_logo.png",
  },
  authors: [{ name: "Element Explorer Scientific Laboratory" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased scroll-smooth`}
    >
      <head>
        <link rel="icon" type="image/png" href="/element_logo.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-[#06070A] text-[#F1F4FA] selection:bg-sky-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
