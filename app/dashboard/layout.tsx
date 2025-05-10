import React from "react";
import { Sidebar } from "./components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      <Sidebar className="h-screen w-64 border-r" />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
} 