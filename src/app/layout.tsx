import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stray Rescue App",
  description: "Report stray animals and find vets nearby",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen pb-20`}>
        <main className="container mx-auto px-4 py-6 max-w-md md:max-w-2xl lg:max-w-4xl">
          {children}
        </main>
        <Navbar />
      </body>
    </html>
  );
}
