"use client";

import React from "react";
import Link from "next/link";
import { Sidebar } from "./components/sidebar";
import { ArrowLeft, MoonIcon, SunIcon, UserCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-full">
      <Sidebar className="h-screen w-64 border-r" />
      <div className="flex-1 overflow-auto flex flex-col h-screen">
        <header className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/main" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sessions
            </Link>
            <div className="w-px h-6 bg-border mx-2"></div>
            <h1 className="text-xl font-bold">NoveX</h1>
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
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        <footer className="border-t py-4">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} NoveX Customer Analysis Platform
          </div>
        </footer>
      </div>
    </div>
  );
} 