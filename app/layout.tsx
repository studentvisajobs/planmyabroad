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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-slate-50 antialiased`}
      >
        <Providers>
          <header className="border-b bg-white">
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <Link href="/" className="flex min-w-0 items-center">
                  <div className="flex h-12 items-center sm:h-14">
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

                <div className="shrink-0">
                  <AuthButtons />
                </div>
              </div>

              <div className="mt-3 overflow-x-auto">
                <nav className="flex min-w-max items-center gap-6 whitespace-nowrap pb-1 text-sm font-medium text-slate-700">
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
              </div>
            </div>
          </header>

          <main>{children}</main>

          <footer className="mt-16 border-t bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
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