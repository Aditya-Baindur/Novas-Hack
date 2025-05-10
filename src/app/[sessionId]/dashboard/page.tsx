"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { VectorInputs } from "@/app/components/VectorInputs";
import { EventSelector } from "@/app/components/EventSelector";
import { DecisionResult } from "@/app/components/DecisionResult";
import { CustomerVector, generateSampleClusters } from "@/app/lib/utils";
import { Decision, Event, sampleEvents } from "@/app/lib/mock-data";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { HistoricalDecisionsChart } from "@/app/components/dashboard/historical-decisions-chart";
import { get_profiles, run_simulation } from "@/lib/model";

export default function SessionDashboard() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.sessionId as string;

  const [customerVector, setCustomerVector] = useState<CustomerVector>({
    riskSeeking: 0.5,
    marketSucc: 0.5,
    income: 0.5,
  });

  const [selectedEvents, setSelectedEvents] = useState<Event[]>([
    sampleEvents[0],
  ]);
  const [decision, setDecision] = useState<Decision | null>();
  const [customerName, setCustomerName] = useState<string>("");
  const [profiles, setProfiles] = useState<number[][]>([[0, 0, 0]]);
  const [environment, setEnvironment] = useState<number[]>([100, 0]);

  const clusters = generateSampleClusters();

  useEffect(() => {
    if (!sessionId) {
      console.error("No session ID provided");
      router.push("/session");
    }
  }, [sessionId, router]);

  const handleVectorChange = (vector: CustomerVector) => {
    setCustomerVector(vector);

    if (selectedEvents.length > 0) {
      const newProfiles = get_profiles(
        [vector.riskSeeking, vector.marketSucc, vector.income],
        10
      );

      setProfiles(newProfiles);

      console.log(environment, newProfiles);

      const decision_vec = run_simulation(environment, newProfiles);
      console.log("decision", decision_vec);
      const conf =
        decision_vec.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        ) / decision_vec.length;

      console.log("newDecision", conf);
      setDecision({ result: conf ? "Buy" : "Not buy", confidence: conf });
    }
  };

  const handleEventsChange = (events: {
    originalPrice: number;
    priceChange: number;
  }) => {
    const environment = [events.originalPrice, events.priceChange];

    setEnvironment(environment);
    const newDecision = run_simulation(environment, profiles);

    setDecision(newDecision ? "Buy" : "Not buy");
  };

  const handleReset = () => {
    setCustomerVector({
      riskSeeking: 0.5,
      marketSucc: 0.5,
      income: 0.5,
    });
    setSelectedEvents([]);
    setDecision(null);
    setCustomerName("");
  };

  const handleBackToSessions = () => {
    router.push("/session");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Dashboard for Session #{sessionId}
          </h1>
        </div>
        <Button variant="outline" onClick={handleBackToSessions}>
          Back to Sessions
        </Button>
      </div>

      <Tabs defaultValue="simulator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="simulator">Simulator</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="clusters">Clusters</TabsTrigger>
        </TabsList>

        <TabsContent value="simulator" className="mt-6">
          <div className="grid gap-6 grid-cols-1">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Customer Purchase Simulator</CardTitle>
                <CardDescription>
                  Adjust customer profile vectors and market events to predict
                  decisions
                </CardDescription>
                <div className="flex gap-4 mt-4">
                  <Input
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  <Button variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Save Simulation</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Simulation</DialogTitle>
                        <DialogDescription>
                          This will save your current simulation configuration
                          for future reference.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p>Customer: {customerName || "Unnamed Customer"}</p>
                        <p>Events Selected: {selectedEvents.length}</p>
                        {decision && <p>Predicted Decision: {decision}</p>}
                      </div>
                      <div className="flex justify-end">
                        <Button>Save</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="md:col-span-1">
                    <VectorInputs onVectorChange={handleVectorChange} />
                  </div>
                  <div className="md:col-span-1">
                    <EventSelector onEventsChange={handleEventsChange} />
                  </div>
                  <div className="md:col-span-2 lg:col-span-1">
                    <DecisionResult decision={decision} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleString()}
                </p>
                <Button variant="outline">Export PDF</Button>
              </CardFooter>
            </Card>

            <HistoricalDecisionsChart />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Session #{sessionId} Analytics</CardTitle>
              <CardDescription>
                View advanced analytics and insights for this session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">
                  Analytics dashboard coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clusters" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Clusters</CardTitle>
              <CardDescription>
                Overview of existing customer clusters and their characteristics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>A list of all customer clusters</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Loyalty</TableHead>
                    <TableHead>Risk Tolerance</TableHead>
                    <TableHead>Innovation</TableHead>
                    <TableHead>Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clusters.map((cluster) => (
                    <TableRow key={cluster.id}>
                      <TableCell className="font-medium">
                        {cluster.name}
                      </TableCell>
                      <TableCell>
                        {(cluster.vector.riskSeeking * 100).toFixed(0)}%
                      </TableCell>
                      <TableCell>
                        {(cluster.vector.marketSucc * 100).toFixed(0)}%
                      </TableCell>
                      <TableCell>
                        {(cluster.vector.income * 100).toFixed(0)}%
                      </TableCell>
                      <TableCell>{cluster.size.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
