import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pocket Ai",
  description: "Powered by Google Gemini AI APIs. Tools to simplify your day-to-day tasks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col space-y-20 items-center`}>
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
