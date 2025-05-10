"use client";

import { useState } from "react";
import { VectorInputs } from "../components/VectorInputs";
import { EventSelector } from "../components/EventSelector";
import { DecisionResult } from "../components/DecisionResult";
import { CustomerVector } from "../lib/utils";
import { Event, Decision, generateDecision } from "../lib/mock-data";

export default function Dashboard() {
  const [customerVector, setCustomerVector] = useState<CustomerVector>({
    loyalty: 0.5,
    riskTolerance: 0.5,
    innovation: 0.5,
    priceSensitivity: 0.5,
  });
  
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [decision, setDecision] = useState<Decision | null>(null);

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Customer Purchase Predictor</h2>
        <p className="text-muted-foreground">
          Adjust customer profile and market events to predict purchase decisions.
        </p>
      </div>

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
    </div>
  );
} 