import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navigation } from "@/components/Navigation";
import { WalletButton } from "@/components/WalletButton";

export const metadata: Metadata = {
  title: "FHE Crypto Dashboard",
  description: "Fully Homomorphic Encryption Counter Demo with Analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {/* Background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl" />
        </div>

        <Providers>
          <div className="relative z-10 flex min-h-screen">
            {/* Sidebar Navigation */}
            <Navigation />

            {/* Main Content */}
            <div className="flex-1 ml-64">
              {/* Top Header with Wallet */}
              <header className="sticky top-0 z-40 glass border-b border-white/10">
                <div className="flex items-center justify-between px-8 py-4">
                  <div />
                  <WalletButton />
                </div>
              </header>

              {/* Page Content */}
              <main className="p-8">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
