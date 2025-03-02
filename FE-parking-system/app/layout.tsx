import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parking System Slot",
  description: "Sistem Manajemen Parkir Modern di Bandung",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
