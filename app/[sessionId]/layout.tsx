import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Session Dashboard",
  description: "Dashboard for the selected session",
};

export default function SessionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
} 