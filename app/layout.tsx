import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Vignesh Balasubramaniyan | Full Stack & React Native Developer",
    template: "%s | Vignesh Balasubramaniyan",
  },
  description:
    "Experienced Full Stack and React Native Developer specializing in building high-performance mobile apps, interactive web interfaces, and robust backend architectures with Node.js and Next.js.",
  keywords: [
    "Vignesh Balasubramaniyan",
    "Full Stack Developer",
    "React Native Developer",
    "Next.js",
    "Node.js",
    "React Native",
    "Fastify",
    "Zustand",
    "React Query",
    "Portfolio",
    "V-Labs",
    "Software Engineer",
    "Mobile App Developer",
    "Web Developer",
    "TICMPL",
    "Montra Electric",
    "iSportz",
  ],
  authors: [
    {
      name: "Vignesh Balasubramaniyan",
      url: "https://github.com/super-spiderr",
    },
  ],
  creator: "Vignesh Balasubramaniyan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vignesh.dev",
    title: "Vignesh Balasubramaniyan | Full Stack & React Native Developer",
    description:
      "Experienced Full Stack and React Native Developer specializing in building high-performance mobile apps, interactive web interfaces, and robust backend architectures with Node.js and Next.js.",
    siteName: "Vignesh Balasubramaniyan Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vignesh Balasubramaniyan | Full Stack & React Native Developer",
    description:
      "Experienced Full Stack and React Native Developer specializing in building high-performance mobile apps, interactive web interfaces, and robust backend architectures.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "dark",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        figtree.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
