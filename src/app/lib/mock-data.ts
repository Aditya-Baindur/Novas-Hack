import { CustomerVector } from "./utils";

export interface Event {
  id: string;
  name: string;
  description: string;
  impact: {
    loyalty?: number;
    riskTolerance?: number;
    innovation?: number;
    priceSensitivity?: number;
  };
}

export interface Decision {
  id: string;
  result: "BOUGHT" | "NOT BOUGHT";
  confidence: number;
  reasoning: string;
}

export interface DecisionHistory {
  id: string;
  timestamp: string;
  customerVector: CustomerVector;
  events: Event[];
  decision: Decision;
}

// Sample events that can impact customer behavior
export const sampleEvents: Event[] = [
  {
    id: "e1",
    name: "New Competitor",
    description: "A new competitor entered the market with lower prices",
    impact: {
      loyalty: -0.1,
      priceSensitivity: 0.2
    }
  },
  {
    id: "e2",
    name: "Product Recall",
    description: "Main competitor had a major product recall",
    impact: {
      loyalty: 0.15,
      riskTolerance: -0.1
    }
  },
  {
    id: "e3",
    name: "Price Increase",
    description: "Our product price increased by 10%",
    impact: {
      priceSensitivity: 0.15
    }
  },
  {
    id: "e4",
    name: "Innovation Award",
    description: "Our product won an innovation award",
    impact: {
      innovation: 0.2,
      loyalty: 0.1
    }
  },
  {
    id: "e5",
    name: "Negative Reviews",
    description: "Product received several negative reviews",
    impact: {
      loyalty: -0.15,
      riskTolerance: -0.1
    }
  }
];

// Decision logic based on vectors and events
export function generateDecision(vector: CustomerVector, events: Event[]): Decision {
  // Apply event impacts to the vector
  const modifiedVector = { ...vector };
  
  events.forEach(event => {
    if (event.impact.loyalty) modifiedVector.loyalty = Math.max(0, Math.min(1, modifiedVector.loyalty + event.impact.loyalty));
    if (event.impact.riskTolerance) modifiedVector.riskTolerance = Math.max(0, Math.min(1, modifiedVector.riskTolerance + event.impact.riskTolerance));
    if (event.impact.innovation) modifiedVector.innovation = Math.max(0, Math.min(1, modifiedVector.innovation + event.impact.innovation));
    if (event.impact.priceSensitivity) modifiedVector.priceSensitivity = Math.max(0, Math.min(1, modifiedVector.priceSensitivity + event.impact.priceSensitivity));
  });

  // Calculate purchase probability based on vector values
  const purchaseProbability = (
    modifiedVector.loyalty * 0.3 +
    modifiedVector.riskTolerance * 0.2 +
    modifiedVector.innovation * 0.3 +
    (1 - modifiedVector.priceSensitivity) * 0.2  // Inverted because high price sensitivity means less likely to buy
  );

  const result = purchaseProbability > 0.5 ? "BOUGHT" : "NOT BOUGHT";
  const confidence = Math.abs(purchaseProbability - 0.5) * 2; // Scale to 0-1

  return {
    id: Date.now().toString(),
    result,
    confidence,
    reasoning: generateReasoning(modifiedVector, purchaseProbability)
  };
}

function generateReasoning(vector: CustomerVector, probability: number): string {
  let reasons = [];
  
  if (vector.loyalty > 0.7) reasons.push("high brand loyalty");
  else if (vector.loyalty < 0.3) reasons.push("low brand loyalty");
  
  if (vector.riskTolerance > 0.7) reasons.push("high risk tolerance");
  else if (vector.riskTolerance < 0.3) reasons.push("low risk tolerance");
  
  if (vector.innovation > 0.7) reasons.push("early innovation adopter");
  else if (vector.innovation < 0.3) reasons.push("late innovation adopter");
  
  if (vector.priceSensitivity > 0.7) reasons.push("high price sensitivity");
  else if (vector.priceSensitivity < 0.3) reasons.push("low price sensitivity");
  
  const reasonText = reasons.length ? reasons.join(", ") : "balanced customer profile";
  
  return `Decision based on ${reasonText}. Confidence: ${Math.round(probability * 100)}%.`;
}

// Mock API function to save decision history
export async function saveDecisionHistory(
  customerVector: CustomerVector,
  events: Event[],
  decision: Decision
): Promise<DecisionHistory> {
  const history: DecisionHistory = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    customerVector,
    events,
    decision
  };
  
  // In a real app, this would save to a database
  console.log("Saving decision history:", history);
  
  return new Promise((resolve) => {
    setTimeout(() => resolve(history), 500);
  });
}

// Mock API function to get decision history
export async function getDecisionHistory(): Promise<DecisionHistory[]> {
  // In a real app, this would fetch from a database
  return new Promise((resolve) => {
    setTimeout(() => resolve([]), 500);
  });
} 