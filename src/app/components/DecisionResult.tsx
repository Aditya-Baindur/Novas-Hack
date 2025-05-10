import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Decision } from "../lib/mock-data";

interface DecisionResultProps {
  decision: Decision | null;
}

export function DecisionResult({ decision }: DecisionResultProps) {
  if (!decision) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Decision Result</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-60 text-center">
            <p className="text-muted-foreground mb-2">
              Adjust customer vector and select market events to generate a
              decision prediction
            </p>
            <div className="w-16 h-16 rounded-full border-4 border-dashed border-muted flex items-center justify-center animate-pulse">
              <span className="text-2xl">?</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { result, confidence } = decision;
  const confidencePercent = Math.round(confidence * 100);
  const isPurchase = confidence >= 0.5;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Decision Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Prediction</h3>
              <p
                className={`text-lg font-bold ${
                  isPurchase ? "text-green-600" : "text-red-600"
                }`}
              >
                {result}
              </p>
            </div>
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isPurchase
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              <span className="text-2xl">{isPurchase ? "✓" : "✗"}</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Confidence</h4>
            <div className="w-full bg-muted rounded-full h-2.5 mb-1">
              <div
                className={`h-2.5 rounded-full ${
                  isPurchase ? "bg-green-600" : "bg-red-600"
                }`}
                style={{ width: `${confidencePercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Uncertain</span>
              <span>{confidencePercent}%</span>
              <span>Certain</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Reasoning</h4>
            <p className="text-sm text-muted-foreground"></p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
