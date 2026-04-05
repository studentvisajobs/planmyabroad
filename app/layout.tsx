import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlanMyAbroad",
  description: "AI-powered migration planning platform",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}