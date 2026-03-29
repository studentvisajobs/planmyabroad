import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import Providers from "./providers";
import AuthButtons from "./components/auth-buttons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlanMyAbroad",
  description: "Smart migration planning platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-50 antialiased`}
      >
        <Providers>
<header className="border-b bg-white">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    <Link href="/" className="flex items-center">
      <div className="h-14 flex items-center">
        <Image
          src="/logo.png"
          alt="PlanMyAbroad logo"
          width={400}
          height={150}
          className="h-full w-auto object-contain"
          priority
        />
      </div>
    </Link>

    <div className="flex items-center gap-6">
      <nav className="flex items-center gap-8 text-sm font-medium text-slate-700">
        <Link href="/profile" className="hover:text-slate-900">
          Profile
        </Link>
        <Link href="/recommend" className="hover:text-slate-900">
          Recommend
        </Link>
        <Link href="/pathways" className="hover:text-slate-900">
          Pathways
        </Link>
        <Link href="/compare" className="hover:text-slate-900">
          Compare
        </Link>
        <Link href="/assistant" className="hover:text-slate-900">
          AI Assistant
        </Link>
        <Link
          href="/premium"
          className="rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800"
        >
          Premium
        </Link>
      </nav>

      <AuthButtons />
    </div>
  </div>
</header>
          <main>{children}</main>

          <footer className="mt-16 border-t bg-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
              <p>© {new Date().getFullYear()} PlanMyAbroad</p>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="/privacy" className="hover:text-slate-700">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-slate-700">
                  Terms
                </Link>
                <Link href="/contact" className="hover:text-slate-700">
                  Contact
                </Link>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}