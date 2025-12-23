import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoaderRegistrar from "@/components/LoaderRegistrar";
import ScrollToTop from "@/components/ScrollToTop";
import NextTopLoader from "nextjs-toploader";

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
    default: "Engine Blog",
    template: "%s | Engine Blog",
  },
  description: "Official digital heartbeat of the Faculty of Engineering, University of Benin (UNIBEN). Updates, news, and insights.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://engine-blog.vercel.app",
    siteName: "Engine Blog",
    images: [
      {
        url: "/og-image.png", // Make sure this exists or replace with a real link
        width: 1200,
        height: 630,
        alt: "Engine Blog - UNIBEN",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engine Blog",
    description: "Official digital heartbeat of the Faculty of Engineering, UNIBEN.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://engine-blog.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="#2563eb"
          height={3}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2563eb,0 0 5px #2563eb"
        />
        <LoaderRegistrar />
        <Navbar />
        {children}
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
