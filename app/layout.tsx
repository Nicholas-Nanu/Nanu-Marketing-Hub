import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nanu Marketing Hub",
  description: "Internal marketing operations dashboard for Nanu by Unknown Systems Ltd",
  icons: {
    icon: "/favicon.svg",
  },
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
