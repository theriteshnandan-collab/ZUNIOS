import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import BackgroundLayout from "@/components/BackgroundLayout";
import FloatingNav from "@/components/FloatingNav";
import Footer from "@/components/Footer";
import NotificationManager from "@/components/NotificationManager";
import { ModeProvider } from "@/components/ModeProvider";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import dynamic from "next/dynamic";

const OnboardingModal = dynamic(() => import("@/components/OnboardingModal"), { ssr: false });
import { Inter, Crimson_Pro, JetBrains_Mono } from "next/font/google";

// 1. The Machine (System Interface)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap", // Performance: Show text immediately
});

// 2. The Code (Monospace)
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

// 3. The Soul (Reading Experience)
const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  themeColor: "#050510",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  interactiveWidget: "resizes-content", // Key for mobile keyboard handling
};

export const metadata: Metadata = {
  title: "Zunios | The OS for Your Mind",
  description: "Capture your consciousness. Record visions, builds, logs, and thoughts in a unified operating system for your potential.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg", // We can use SVG for Apple touch icon in most modern contexts or it will fallback
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Zunios",
  },
  applicationName: "Zunios",
  keywords: ["journal", "AI analysis", "second brain", "personal OS", "dream journal", "Zunios"],
  authors: [{ name: "Zunios Systems" }],
  openGraph: {
    title: "Zunios | The OS for Your Mind",
    description: "Capture your consciousness. Record visions, builds, logs, and thoughts in a unified operating system for your potential.",
    url: "https://zunios.codes",
    siteName: "Zunios",
    images: [{
      url: "https://zunios.codes/og-image.jpg", // You need to add this image to public/ folder
      width: 1200,
      height: 630,
      alt: "Zunios Dashboard Interface"
    }],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zunios | The OS for Your Mind",
    description: "Decode your subconscious with AI-powered analysis",
    images: ["https://zunios.codes/og-image.jpg"],
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
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${crimsonPro.variable} ${jetbrainsMono.variable} antialiased bg-[#050510] text-[#E0E0E0] select-none`}
      >
        <ModeProvider>
          <OnboardingModal />
          <NotificationManager />
          {/* <NeuralSearch /> Removed as per user request */}
          {/* <PrivacyShield /> Removed as per user request */}
          <NoiseOverlay />
          <BackgroundLayout>
            <FloatingNav />
            <div className="flex flex-col min-h-screen pt-16">
              <main className="flex-1 pb-32 md:pb-0">
                {children}
              </main>
              <Footer />
            </div>
          </BackgroundLayout>
        </ModeProvider>
        <Toaster richColors position="top-center" />
        <Analytics />
      </body>
    </html>
  );
}
