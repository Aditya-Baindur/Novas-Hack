import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Customer Cluster Analysis Platform",
  description: "Analyze and match customer behavior to existing clusters",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <header className="border-b">
            <div className="container mx-auto flex h-16 items-center px-4">
              <h1 className="text-xl font-bold">Customer Cluster Analysis</h1>
            </div>
          </header>
          <main className="container mx-auto px-4 py-6">{children}</main>
          <footer className="border-t py-4">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Customer Cluster Analysis Platform
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 