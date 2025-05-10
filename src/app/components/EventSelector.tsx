"use client";

import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { sampleEvents, Event } from "../lib/mock-data";
import { Input } from "./ui/input";

interface EventSelectorProps {
  onEventsChange: (events: {
    originalPrice: number;
    priceChange: number;
  }) => void;
}

export function EventSelector({ onEventsChange }: EventSelectorProps) {
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([
    sampleEvents[0],
  ]);
  const [originalPrice, setOriginalPrice] = useState<number>(100);
  const [priceChange, setPriceChange] = useState<number>(0);

  useEffect(() => {
    onEventsChange({ originalPrice, priceChange });
  }, [originalPrice, priceChange]);

  const toggleEvent = (event: Event) => {
    const isSelected = selectedEvents.some((e) => e.id === event.id);
    let updatedEvents: Event[];

    if (isSelected) {
      updatedEvents = selectedEvents.filter((e) => e.id !== event.id);
    } else {
      updatedEvents = [...selectedEvents, event];
    }

    setSelectedEvents(updatedEvents);
  };

  const isSelected = (event: Event) => {
    return selectedEvents.some((e) => e.id === event.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-2">
            Select market events that may impact the customer's decision
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleEvents.map((event) => (
              <Badge
                key={event.id}
                variant={isSelected(event) ? "default" : "outline"}
                className={`cursor-pointer select-none ${
                  isSelected(event) ? "bg-primary" : ""
                }`}
                onClick={() => toggleEvent(event)}
              >
                {event.name}
              </Badge>
            ))}
          </div>
          <div className="mt-4">
            {selectedEvents.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Events:</p>
                <ul className="space-y-1">
                  {selectedEvents.map((event) => (
                    <li key={event.id} className="text-sm">
                      <span className="font-medium">{event.name}</span>:{" "}
                      <span className="text-muted-foreground">
                        {event.description}
                      </span>
                    </li>
                  ))}
                </ul>

                <Input
                  type="number"
                  placeholder="Original price"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="change"
                  value={priceChange}
                  onChange={(e) => setPriceChange(e.target.value)}
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No events selected
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
