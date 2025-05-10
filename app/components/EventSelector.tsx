"use client";

import { useState } from "react";
import { Event, sampleEvents } from "../lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";

interface EventSelectorProps {
  onEventsChange: (events: Event[]) => void;
}

export function EventSelector({ onEventsChange }: EventSelectorProps) {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const handleEventToggle = (eventId: string) => {
    const updatedEvents = selectedEvents.includes(eventId)
      ? selectedEvents.filter(id => id !== eventId)
      : [...selectedEvents, eventId];
    
    setSelectedEvents(updatedEvents);
    
    const fullEvents = sampleEvents.filter(event => 
      updatedEvents.includes(event.id)
    );
    
    onEventsChange(fullEvents);
  };

  const getImpactBadge = (value: number | undefined) => {
    if (!value) return null;
    
    const type = value > 0 ? "positive" : "negative";
    const label = `${value > 0 ? '+' : ''}${value}`;
    
    return (
      <Badge variant={type === "positive" ? "default" : "destructive"} className="ml-2">
        {label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select events that affect the customer's purchase decision.
          </p>
          
          <div className="space-y-3">
            {sampleEvents.map((event) => (
              <div key={event.id} className="flex items-start space-x-2">
                <Checkbox
                  id={`event-${event.id}`}
                  checked={selectedEvents.includes(event.id)}
                  onCheckedChange={() => handleEventToggle(event.id)}
                />
                <div className="space-y-1">
                  <label
                    htmlFor={`event-${event.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {event.name}
                  </label>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {event.impact.loyalty ? (
                      <span className="text-xs">
                        Loyalty {getImpactBadge(event.impact.loyalty)}
                      </span>
                    ) : null}
                    {event.impact.riskTolerance ? (
                      <span className="text-xs">
                        Risk {getImpactBadge(event.impact.riskTolerance)}
                      </span>
                    ) : null}
                    {event.impact.innovation ? (
                      <span className="text-xs">
                        Innovation {getImpactBadge(event.impact.innovation)}
                      </span>
                    ) : null}
                    {event.impact.priceSensitivity ? (
                      <span className="text-xs">
                        Price Sensitivity {getImpactBadge(event.impact.priceSensitivity)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 