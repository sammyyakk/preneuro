import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PreNeuro - AI-Powered Neurodegenerative Disease Detection",
  description: "Early detection platform for Alzheimer's, Parkinson's, and ALS using advanced AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background antialiased">
        <Providers>
          <Sidebar />
          <main className="lg:pl-72 min-h-screen">
            <div className="gradient-mesh min-h-screen">
              <div className="p-6 lg:p-8 pt-20 lg:pt-8 page-transition">
                {children}
              </div>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
