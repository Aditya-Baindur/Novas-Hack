"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  LayoutDashboardIcon, 
  HistoryIcon,
  UsersIcon,
  PieChartIcon,
  CheckCircleIcon,
  XCircleIcon,
  HomeIcon,
  XIcon
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

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onCloseSidebar?: () => void;
  sessionId?: string;
}

export function Sidebar({ className, onCloseSidebar, sessionId: propSessionId }: SidebarProps) {
  const router = useRouter();
  const params = useParams();
  const sessionId = propSessionId || (params?.sessionId as string);
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);

  return (
    <aside className={cn("flex flex-col bg-background/95 backdrop-blur-sm h-screen w-64 border-r", className)}>
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">
          Customer Analyzer
        </h2>
        {onCloseSidebar && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onCloseSidebar}
            className="lg:hidden"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="px-4 pt-4">
        <div className="space-y-1">
          <Button 
            variant="secondary" 
            className="w-full justify-start"
            onClick={() => sessionId ? router.push(`/${sessionId}/dashboard`) : router.push('/dashboard')}
          >
            <LayoutDashboardIcon className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => router.push('/session')}
          >
            <PieChartIcon className="mr-2 h-4 w-4" />
            Sessions
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => router.push('/customers')}
          >
            <UsersIcon className="mr-2 h-4 w-4" />
            Customers
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => router.push('/history')}
          >
            <HistoryIcon className="mr-2 h-4 w-4" />
            History
          </Button>
        </div>
      </div>
      
      <div className="px-4 py-2 flex-1 overflow-auto">
        <h2 className="mb-2 text-sm font-semibold tracking-tight text-muted-foreground">
          Past Simulations
        </h2>
        <div className="space-y-1">
          {pastSimulations.map((simulation) => (
            <Button
              key={simulation.id}
              variant={activeSimulation === simulation.id ? "secondary" : "ghost"}
              className="w-full justify-start h-auto py-1.5"
              onClick={() => {
                setActiveSimulation(simulation.id);
                if (sessionId) {
                  router.push(`/${sessionId}/simulation/${simulation.id}`);
                }
              }}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  {simulation.decision === "BOUGHT" ? (
                    <CheckCircleIcon className="mr-2 h-3 w-3 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircleIcon className="mr-2 h-3 w-3 text-red-500 flex-shrink-0" />
                  )}
                  <span className="truncate text-sm">{simulation.customerName}</span>
                </div>
                <Badge variant="outline" className="ml-2 text-xs py-0 h-4 px-1.5">
                  {Math.round(simulation.confidence * 100)}%
                </Badge>
              </div>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Analyst</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => router.push('/')}
          >
            <HomeIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
} 