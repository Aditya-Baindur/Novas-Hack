import { CustomerVector } from "./utils";

export interface Event {
  id: string;
  name: string;
  description: string;
}

export interface Decision {
  result: string;
  confidence: number;
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
    name: "Price change",
    description: "Price changed",
  },
  // {
  //   id: "e2",
  //   name: "Product Recall",
  //   description: "Main competitor had a major product recall",
  //   impact: {
  //     loyalty: 0.15,
  //     riskTolerance: -0.1
  //   }
  // },
  // {
  //   id: "e3",
  //   name: "Price Increase",
  //   description: "Our product price increased by 10%",
  //   impact: {
  //     priceSensitivity: 0.15
  //   }
  // },
  // {
  //   id: "e4",
  //   name: "Innovation Award",
  //   description: "Our product won an innovation award",
  //   impact: {
  //     innovation: 0.2,
  //     loyalty: 0.1
  //   }
  // },
  // {
  //   id: "e5",
  //   name: "Negative Reviews",
  //   description: "Product received several negative reviews",
  //   impact: {
  //     loyalty: -0.15,
  //     riskTolerance: -0.1
  //   }
  // }
];

// Decision logic based on vectors and events
export function generateDecision(
  vector: CustomerVector,
  events: Event[]
): Decision {
  // Apply event impacts to the vector
  const modifiedVector = { ...vector };

  events.forEach((event) => {
    if (event.impact.loyalty)
      modifiedVector.riskSeeking = Math.max(
        0,
        Math.min(1, modifiedVector.riskSeeking + event.impact.loyalty)
      );
    if (event.impact.riskTolerance)
      modifiedVector.marketSucc = Math.max(
        0,
        Math.min(1, modifiedVector.marketSucc + event.impact.riskTolerance)
      );
    if (event.impact.innovation)
      modifiedVector.income = Math.max(
        0,
        Math.min(1, modifiedVector.income + event.impact.innovation)
      );
    if (event.impact.priceSensitivity)
      modifiedVector.priceSensitivity = Math.max(
        0,
        Math.min(
          1,
          modifiedVector.priceSensitivity + event.impact.priceSensitivity
        )
      );
  });

  // Calculate purchase probability based on vector values
  const purchaseProbability =
    modifiedVector.riskSeeking * 0.3 +
    modifiedVector.marketSucc * 0.2 +
    modifiedVector.income * 0.3 +
    (1 - modifiedVector.priceSensitivity) * 0.2; // Inverted because high price sensitivity means less likely to buy

  const result = purchaseProbability > 0.5 ? "BOUGHT" : "NOT BOUGHT";
  const confidence = Math.abs(purchaseProbability - 0.5) * 2; // Scale to 0-1

  return {
    id: Date.now().toString(),
    result,
    confidence,
    reasoning: generateReasoning(modifiedVector, purchaseProbability),
  };
}

function generateReasoning(
  vector: CustomerVector,
  probability: number
): string {
  let reasons = [];

  if (vector.riskSeeking > 0.7) reasons.push("high brand loyalty");
  else if (vector.riskSeeking < 0.3) reasons.push("low brand loyalty");

  if (vector.marketSucc > 0.7) reasons.push("high risk tolerance");
  else if (vector.marketSucc < 0.3) reasons.push("low risk tolerance");

  if (vector.income > 0.7) reasons.push("early innovation adopter");
  else if (vector.income < 0.3) reasons.push("late innovation adopter");

  if (vector.priceSensitivity > 0.7) reasons.push("high price sensitivity");
  else if (vector.priceSensitivity < 0.3) reasons.push("low price sensitivity");

  const reasonText = reasons.length
    ? reasons.join(", ")
    : "balanced customer profile";

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
    decision,
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
