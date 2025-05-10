import { useState } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { sampleEvents, Event } from "../lib/mock-data";

interface EventSelectorProps {
  onEventsChange: (events: Event[]) => void;
}

export function EventSelector({ onEventsChange }: EventSelectorProps) {
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);

  const toggleEvent = (event: Event) => {
    const isSelected = selectedEvents.some((e) => e.id === event.id);
    let updatedEvents: Event[];
    
    if (isSelected) {
      updatedEvents = selectedEvents.filter((e) => e.id !== event.id);
    } else {
      updatedEvents = [...selectedEvents, event];
    }
    
    setSelectedEvents(updatedEvents);
    onEventsChange(updatedEvents);
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