"use client";

import { Decision } from "../lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CircleDollarSign, XCircle, AlertCircle } from "lucide-react";

interface DecisionResultProps {
  decision: Decision | null;
}

export function DecisionResult({ decision }: DecisionResultProps) {
  if (!decision) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Purchase Decision</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">
              Adjust customer profile and select events to see the purchase decision.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { result, confidence, reasoning } = decision;
  const isBought = result === "BOUGHT";
  
  return (
    <Card className={isBought ? "border-green-500" : "border-red-500"}>
      <CardHeader className={isBought ? "bg-green-50" : "bg-red-50"}>
        <CardTitle className="flex items-center justify-between">
          <span>Purchase Decision</span>
          <span className={isBought ? "text-green-600" : "text-red-600"}>
            {result}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center text-center mb-6">
          {isBought ? (
            <CircleDollarSign className="h-16 w-16 text-green-500 mb-4" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
          )}
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isBought 
                ? "Customer will likely purchase your product" 
                : "Customer is unlikely to purchase your product"}
            </p>
            <p className="text-sm text-muted-foreground">
              Confidence: {Math.round(confidence * 100)}%
            </p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Reasoning:</h3>
          <p className="text-sm text-muted-foreground">{reasoning}</p>
        </div>
      </CardContent>
    </Card>
  );
} 