"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Define types needed for dashboard
type CustomerVector = {
  loyalty: number;
  riskTolerance: number;
  innovation: number;
  priceSensitivity: number;
};

type Event = {
  id: string;
  name: string;
  description: string;
  impact: "positive" | "negative" | "neutral";
};

type Decision = {
  result: "BOUGHT" | "NOT_BOUGHT";
  confidence: number;
  factors: string[];
};

type Cluster = {
  id: number;
  name: string;
  vector: CustomerVector;
  size: number;
};

// Mock data and functions
const generateSampleClusters = (): Cluster[] => {
  return [
    {
      id: 1,
      name: "Risk Averse Loyalists",
      vector: { loyalty: 0.9, riskTolerance: 0.2, innovation: 0.3, priceSensitivity: 0.7 },
      size: 12500
    },
    {
      id: 2,
      name: "Innovation Seekers",
      vector: { loyalty: 0.4, riskTolerance: 0.8, innovation: 0.9, priceSensitivity: 0.3 },
      size: 8200
    },
    {
      id: 3,
      name: "Price Sensitive Customers",
      vector: { loyalty: 0.3, riskTolerance: 0.4, innovation: 0.5, priceSensitivity: 0.9 },
      size: 15000
    },
    {
      id: 4,
      name: "Balanced Customers",
      vector: { loyalty: 0.5, riskTolerance: 0.5, innovation: 0.5, priceSensitivity: 0.5 },
      size: 9800
    }
  ];
};

const sampleEvents: Event[] = [
  {
    id: "evt1",
    name: "Competitor Price Drop",
    description: "A major competitor has dropped their prices by 15%",
    impact: "negative"
  },
  {
    id: "evt2",
    name: "New Feature Launch",
    description: "Your company launched a highly anticipated feature",
    impact: "positive"
  },
  {
    id: "evt3",
    name: "Market Uncertainty",
    description: "General economic uncertainty in the market",
    impact: "negative"
  },
  {
    id: "evt4",
    name: "Positive Press Coverage",
    description: "Your company received positive media attention",
    impact: "positive"
  }
];

const generateDecision = (vector: CustomerVector, events: Event[]): Decision => {
  // Simple algorithm to determine if customer would buy
  let score = 0;
  
  // Base score from vectors
  score += (vector.loyalty * 2) - vector.priceSensitivity + (vector.innovation * 0.5);
  
  // Adjust based on events
  events.forEach(event => {
    if (event.impact === "positive") {
      score += 0.3;
    } else if (event.impact === "negative") {
      score -= 0.4;
    }
  });
  
  // Calculate confidence (as percentage)
  const confidence = Math.min(Math.abs(score) * 25, 99);
  
  // Determine factors
  const factors = [];
  if (vector.loyalty > 0.7) factors.push("High customer loyalty");
  if (vector.priceSensitivity > 0.7) factors.push("Price sensitivity");
  if (vector.innovation > 0.7) factors.push("Interest in innovation");
  
  events.forEach(event => {
    if (event.impact !== "neutral") {
      factors.push(event.name);
    }
  });
  
  return {
    result: score >= 0.5 ? "BOUGHT" : "NOT_BOUGHT",
    confidence,
    factors: factors.slice(0, 3) // Limit to top 3 factors
  };
};

// Dashboard components
const VectorInputs = ({ onVectorChange }: { onVectorChange: (v: CustomerVector) => void }) => {
  const [values, setValues] = useState<CustomerVector>({
    loyalty: 0.5,
    riskTolerance: 0.5,
    innovation: 0.5,
    priceSensitivity: 0.5
  });
  
  const handleChange = (key: keyof CustomerVector, value: number) => {
    const newValues = { ...values, [key]: value };
    setValues(newValues);
    onVectorChange(newValues);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Customer Profile</h3>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">
            Loyalty: {(values.loyalty * 100).toFixed(0)}%
          </label>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={values.loyalty}
            onChange={(e) => handleChange('loyalty', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">
            Risk Tolerance: {(values.riskTolerance * 100).toFixed(0)}%
          </label>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={values.riskTolerance}
            onChange={(e) => handleChange('riskTolerance', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">
            Innovation: {(values.innovation * 100).toFixed(0)}%
          </label>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={values.innovation}
            onChange={(e) => handleChange('innovation', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">
            Price Sensitivity: {(values.priceSensitivity * 100).toFixed(0)}%
          </label>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={values.priceSensitivity}
            onChange={(e) => handleChange('priceSensitivity', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

const EventSelector = ({ onEventsChange }: { onEventsChange: (e: Event[]) => void }) => {
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  
  const toggleEvent = (event: Event) => {
    const isSelected = selectedEvents.some(e => e.id === event.id);
    
    let newEvents;
    if (isSelected) {
      newEvents = selectedEvents.filter(e => e.id !== event.id);
    } else {
      newEvents = [...selectedEvents, event];
    }
    
    setSelectedEvents(newEvents);
    onEventsChange(newEvents);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Market Events</h3>
      <div className="space-y-2">
        {sampleEvents.map(event => (
          <div 
            key={event.id}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedEvents.some(e => e.id === event.id)
                ? 'bg-primary/10 border-primary'
                : 'hover:bg-muted'
            }`}
            onClick={() => toggleEvent(event)}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                event.impact === 'positive' ? 'bg-green-500' :
                event.impact === 'negative' ? 'bg-red-500' : 'bg-gray-500'
              }`} />
              <span className="font-medium">{event.name}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const DecisionResult = ({ decision }: { decision: Decision | null }) => {
  if (!decision) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Select market events to see prediction</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Prediction Result</h3>
      
      <div className={`p-4 rounded-lg border ${
        decision.result === 'BOUGHT' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex justify-between items-center">
          <span className="font-medium">Customer Decision:</span>
          <span className={`font-bold ${
            decision.result === 'BOUGHT' ? 'text-green-600' : 'text-red-600'
          }`}>
            {decision.result === 'BOUGHT' ? 'Will Purchase' : 'Won\'t Purchase'}
          </span>
        </div>
        <div className="mt-2">
          <span className="text-sm">Confidence: {decision.confidence.toFixed(0)}%</span>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className={`h-2 rounded-full ${decision.result === 'BOUGHT' ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${decision.confidence}%` }}
            ></div>
          </div>
        </div>
        
        {decision.factors.length > 0 && (
          <div className="mt-4">
            <span className="text-sm font-medium">Key Factors:</span>
            <ul className="mt-1 text-sm">
              {decision.factors.map((factor, i) => (
                <li key={i} className="flex items-center gap-1">
                  <span>•</span> {factor}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default function SessionDashboard() {
  const params = useParams();
  const sessionId = params.id as string;
  
  const [customerVector, setCustomerVector] = useState<CustomerVector>({
    loyalty: 0.5,
    riskTolerance: 0.5,
    innovation: 0.5,
    priceSensitivity: 0.5,
  });
  
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [customerName, setCustomerName] = useState<string>(`Session ${sessionId}`);
  const clusters = generateSampleClusters();

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
    setCustomerName(`Session ${sessionId}`);
  };
  
  return (
    <div className="space-y-6 p-6">      
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
                  {`Session ${sessionId} Simulation Dashboard`}
                </CardTitle>
                <CardDescription>
                  {`Analyzing data for Session ${sessionId}`}
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
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Analytics</CardTitle>
              <CardDescription>
                View advanced analytics and insights for this session
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