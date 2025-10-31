import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProgressLoader from "./client"
import OneSignalInit from "@/components/OneSignalInit";
import Sidebar from "@/components/sidebar";
import { ThemeProvider } from "@/app/theme-provider";
import { Open_Sans } from "next/font/google";
import { Toaster } from "sonner";
import Preloader from "@/components/Preloader";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SafeStep - For The Love of Walking",
  description: "SafeStep is a student-driven innovation project from Rajuk Uttara Model College, Bangladesh, focusing on assistive technologies for persons with disabilities. Our vision is to use affordable embedded systems to improve accessibility and mobility for visually impaired individuals. With expertise in Arduino development, IoT integration, and human-centered design, we aim to bridge the technology gap and create low-cost, scalable solutions that positively impact society.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${openSans.variable} antialiased`}
      >
        <ThemeProvider>
          <ProgressLoader />
          <Preloader />
          <Toaster />
          <Sidebar>
            <OneSignalInit />
            <ProgressLoader />
            {children}
          </Sidebar>
        </ThemeProvider>
      </body>
    </html>
  );
}
