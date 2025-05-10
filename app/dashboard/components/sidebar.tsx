"use client";

import { useState } from "react";
import { 
  LayoutDashboardIcon, 
  HistoryIcon,
  UsersIcon,
  PieChartIcon,
  CheckCircleIcon,
  XCircleIcon,
  HomeIcon
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";

// Mock past simulations data
const pastSimulations = [
  { 
    id: "sim_1", 
    customerName: "Acme Corp", 
    date: "2023-05-15", 
    decision: "BOUGHT", 
    confidence: 0.78,
    vectors: {
      loyalty: 0.8,
      riskTolerance: 0.4,
      innovation: 0.6,
      priceSensitivity: 0.3
    }
  },
  { 
    id: "sim_2", 
    customerName: "TechGiant", 
    date: "2023-05-14", 
    decision: "NOT BOUGHT", 
    confidence: 0.65,
    vectors: {
      loyalty: 0.3,
      riskTolerance: 0.2,
      innovation: 0.4,
      priceSensitivity: 0.9
    }
  },
  { 
    id: "sim_3", 
    customerName: "StartupXYZ", 
    date: "2023-05-13", 
    decision: "BOUGHT", 
    confidence: 0.92,
    vectors: {
      loyalty: 0.7,
      riskTolerance: 0.8,
      innovation: 0.9,
      priceSensitivity: 0.2
    }
  },
  { 
    id: "sim_4", 
    customerName: "Retail Co", 
    date: "2023-05-12", 
    decision: "NOT BOUGHT", 
    confidence: 0.54,
    vectors: {
      loyalty: 0.4,
      riskTolerance: 0.3,
      innovation: 0.2,
      priceSensitivity: 0.8
    }
  },
  { 
    id: "sim_5", 
    customerName: "MegaCorp", 
    date: "2023-05-11", 
    decision: "BOUGHT", 
    confidence: 0.81,
    vectors: {
      loyalty: 0.9,
      riskTolerance: 0.6,
      innovation: 0.5,
      priceSensitivity: 0.4
    }
  },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);

  return (
    <aside className={cn("flex flex-col bg-muted/40", className)}>
      <div className="px-3 py-4">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Customer Analyzer
        </h2>
        <div className="space-y-1">
          <Button variant="secondary" className="w-full justify-start">
            <LayoutDashboardIcon className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <PieChartIcon className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <UsersIcon className="mr-2 h-4 w-4" />
            Customers
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <HistoryIcon className="mr-2 h-4 w-4" />
            History
          </Button>
        </div>
      </div>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Past Simulations
        </h2>
        <div className="space-y-1">
          {pastSimulations.map((simulation) => (
            <Button
              key={simulation.id}
              variant={activeSimulation === simulation.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSimulation(simulation.id)}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  {simulation.decision === "BOUGHT" ? (
                    <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <XCircleIcon className="mr-2 h-4 w-4 text-red-500" />
                  )}
                  <span className="truncate">{simulation.customerName}</span>
                </div>
                <Badge variant="outline" className="ml-2">
                  {Math.round(simulation.confidence * 100)}%
                </Badge>
              </div>
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-auto px-3 py-4">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="text-sm">Analyst</span>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <HomeIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
} 