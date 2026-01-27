import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";
import { Geist, Geist_Mono, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import BackgroundLayout from "@/components/BackgroundLayout";
import FloatingNav from "@/components/FloatingNav";
import Footer from "@/components/Footer";
import PrivacyShield from "@/components/layout/PrivacyShield";
import NotificationManager from "@/components/NotificationManager";
import { ModeProvider } from "@/components/ModeProvider";
import OnboardingModal from "@/components/OnboardingModal";
import NoiseOverlay from "@/components/ui/NoiseOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
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
    type: "website",
    locale: "en_US",
    siteName: "Zunios",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zunios | The OS for Your Mind",
    description: "Decode your subconscious with AI-powered analysis",
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
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${crimsonPro.variable} antialiased bg-background text-foreground`}
        >
          <ModeProvider>
            <OnboardingModal />
            <NotificationManager />
            <PrivacyShield />
            <NoiseOverlay />
            <BackgroundLayout>
              <FloatingNav />
              <div className="flex flex-col min-h-screen pt-16">
                <main className="flex-1">
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
    </ClerkProvider>
  );
}
