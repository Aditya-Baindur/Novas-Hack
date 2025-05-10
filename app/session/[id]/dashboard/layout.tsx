"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();
  const params = useParams();
  const sessionId = params.id as string;

  return (
    <div className="flex flex-col h-full">
      <header className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/session/${sessionId}`} className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Session
          </Link>
          <div className="w-px h-6 bg-border mx-2"></div>
          <h1 className="text-xl font-bold">Session {sessionId} Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} NoveX Session Dashboard
        </div>
      </footer>
    </div>
  );
} 