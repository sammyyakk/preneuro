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
  title: "PreNeuro — AI-Powered Neurodegenerative Screening",
  description: "Early detection platform for Alzheimer's, Parkinson's, and ALS using advanced AI predictive models.",
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
          <main className="lg:pl-64 min-h-screen">
            <div className="gradient-mesh min-h-screen">
              <div className="px-6 lg:px-10 py-8 lg:py-10 pt-20 lg:pt-10 page-transition max-w-[1280px] mx-auto">
                {children}
              </div>
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
