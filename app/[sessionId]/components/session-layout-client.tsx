"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { MoonIcon, SunIcon, PanelLeftIcon, PanelLeftCloseIcon } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Sidebar } from "@/app/components/dashboard/sidebar";
import Link from "next/link";

interface SessionLayoutClientProps {
  children: React.ReactNode;
}

export function SessionLayoutClient({ children }: SessionLayoutClientProps) {
  const { theme, setTheme } = useTheme();
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="sticky top-0 z-40 border-b bg-background p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="mr-2"
          >
            {sidebarOpen ? (
              <PanelLeftCloseIcon className="h-5 w-5" />
            ) : (
              <PanelLeftIcon className="h-5 w-5" />
            )}
          </Button>
          <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
            NoveX
          </Link>
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

      <div className="flex h-[calc(100vh-65px)] overflow-hidden">
        {/* Sidebar - fixed position with transform for sliding */}
        <div 
          className={`fixed top-[65px] h-[calc(100vh-65px)] shadow-lg transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } z-30`}
        >
          <Sidebar sessionId={sessionId} onCloseSidebar={() => setSidebarOpen(false)} />
        </div>
        
        {/* Sidebar backdrop - only shown when sidebar is open on mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 top-[65px] bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col h-full w-full">
          {/* Main content with conditional margin based on sidebar state */}
          <main 
            className={`flex-1 overflow-auto transition-all duration-300 ${
              sidebarOpen ? "lg:ml-64" : "ml-0"
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 