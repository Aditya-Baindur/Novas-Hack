"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { VectorInputs } from "../components/VectorInputs";
import { EventSelector } from "../components/EventSelector";
import { DecisionResult } from "../components/DecisionResult";
import { CustomerVector, generateSampleClusters } from "../lib/utils";
import { Event, Decision, generateDecision } from "../lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { HistoricalDecisionsChart } from "./components/historical-decisions-chart";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const simulationParam = searchParams.get('simulation');

  const [customerVector, setCustomerVector] = useState<CustomerVector>({
    loyalty: 0.5,
    riskTolerance: 0.5,
    innovation: 0.5,
    priceSensitivity: 0.5,
  });
  
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [customerName, setCustomerName] = useState<string>(simulationParam || "");
  const clusters = generateSampleClusters();

  useEffect(() => {
    // Set the customer name from the simulation parameter when it changes
    if (simulationParam) {
      setCustomerName(simulationParam);
    }
  }, [simulationParam]);

  const handleVectorChange = (vector: CustomerVector) => {
    setCustomerVector(vector);
    if (selectedEvents.length > 0) {
      const newDecision = generateDecision(vector, selectedEvents);
      setDecision(newDecision);
    }
  };

  const handleEventsChange = (events: Event[]) => {
    setSelectedEvents(events);
    if (events.length > 0) {
      const newDecision = generateDecision(customerVector, events);
      setDecision(newDecision);
    } else {
      setDecision(null);
    }
  };

  const handleReset = () => {
    setCustomerVector({
      loyalty: 0.5,
      riskTolerance: 0.5,
      innovation: 0.5,
      priceSensitivity: 0.5,
    });
    setSelectedEvents([]);
    setDecision(null);
    setCustomerName(simulationParam || "");
  };

  const navigateBackToSessions = () => {
    window.location.href = "/main";
  };

  return (
    <div className="space-y-6 p-6">
      {simulationParam && (
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Simulation: {simulationParam}</h1>
          <Button onClick={navigateBackToSessions} variant="outline">
            Back to Sessions
          </Button>
        </div>
      )}
      
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
                <CardTitle>
                  {simulationParam 
                    ? `${simulationParam} Simulation Dashboard` 
                    : "Customer Purchase Simulator"}
                </CardTitle>
                <CardDescription>
                  {simulationParam 
                    ? `Viewing data for the "${simulationParam}" simulation` 
                    : "Adjust customer profile vectors and market events to predict decisions"}
                </CardDescription>
                <div className="flex gap-4 mt-4">
                  <Input 
                    placeholder="Customer Name" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  <Button variant="outline" onClick={handleReset}>Reset</Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Save Simulation</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Simulation</DialogTitle>
                        <DialogDescription>
                          This will save your current simulation configuration for future reference.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p>Customer: {customerName || "Unnamed Customer"}</p>
                        <p>Events Selected: {selectedEvents.length}</p>
                        {decision && (
                          <p>Predicted Decision: {decision.result === "BOUGHT" ? "Will Purchase" : "Won't Purchase"}</p>
                        )}
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
                <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</p>
                <Button variant="outline">Export PDF</Button>
              </CardFooter>
            </Card>

            <HistoricalDecisionsChart />
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
              <CardDescription>
                View advanced analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
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
                    <TableHead>Price Sensitivity</TableHead>
                    <TableHead>Size</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clusters.map((cluster) => (
                    <TableRow key={cluster.id}>
                      <TableCell className="font-medium">{cluster.name}</TableCell>
                      <TableCell>{(cluster.vector.loyalty * 100).toFixed(0)}%</TableCell>
                      <TableCell>{(cluster.vector.riskTolerance * 100).toFixed(0)}%</TableCell>
                      <TableCell>{(cluster.vector.innovation * 100).toFixed(0)}%</TableCell>
                      <TableCell>{(cluster.vector.priceSensitivity * 100).toFixed(0)}%</TableCell>
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