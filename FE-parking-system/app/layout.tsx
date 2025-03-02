import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Parking System Slot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-300 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
        <Navbar />
        <Toaster position="top-right" reverseOrder={false} />
        <main className="pt-24 p-8 max-w-7xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
