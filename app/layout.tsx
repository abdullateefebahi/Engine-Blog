import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FirebaseAnalytics from "@/components/FirebaseAnalytics";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoaderRegistrar from "@/components/LoaderRegistrar";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "@/components/ThemeProvider";
import NextTopLoader from "nextjs-toploader";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import ConnectionStatus from "@/components/ConnectionStatus";

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
    url: "https://engineblog.live",
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
  appleWebApp: {
    capable: true,
    title: "Engine Blog",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://engineblog.live"),
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
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
            <FirebaseAnalytics />
            <Navbar />
            <Toaster position="bottom-right" />
            <ConnectionStatus />
            {children}
            <Footer />
            <ScrollToTop />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
