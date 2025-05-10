import React, { useState } from "react";
import { CustomerVector } from "../lib/utils";
import { Slider } from "./ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface VectorInputsProps {
  onVectorChange: (vector: CustomerVector) => void;
}

export function VectorInputs({ onVectorChange }: VectorInputsProps) {
  const [vector, setVector] = useState<CustomerVector>({
    riskSeeking: 0.5,
    marketSucc: 0.5,
    income: 60000,
  });

  const handleVectorChange = (key: keyof CustomerVector, value: number) => {
    const newVector = { ...vector, [key]: value };
    setVector(newVector);
    onVectorChange(newVector);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Behavioral Vector</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium" htmlFor="loyalty">
              Risk Seeking
            </label>
            <span className="text-sm text-muted-foreground">
              {Math.round(vector.riskSeeking * 100)}%
            </span>
          </div>
          <Slider
            id="loyalty"
            min={0}
            max={100}
            step={1}
            value={[vector.riskSeeking * 100]}
            onValueChange={(value: number[]) =>
              handleVectorChange("riskSeeking", value[0] / 100)
            }
          />
          <p className="text-xs text-muted-foreground">
            How loyal the customer is to specific brands
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium" htmlFor="riskTolerance">
              Mark Susceptibility
            </label>
            <span className="text-sm text-muted-foreground">
              {Math.round(vector.marketSucc * 100)}%
            </span>
          </div>
          <Slider
            id="riskTolerance"
            min={0}
            max={100}
            step={1}
            value={[vector.marketSucc * 100]}
            onValueChange={(value: number[]) =>
              handleVectorChange("marketSucc", value[0] / 100)
            }
          />
          <p className="text-xs text-muted-foreground">
            How willing the customer is to take risks with purchases
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium" htmlFor="innovation">
              Income
            </label>
            <span className="text-sm text-muted-foreground">
              {vector.income}
            </span>
          </div>
          <Slider
            id="innovation"
            min={0}
            step={10000}
            max={500000}
            value={[vector.income]}
            onValueChange={(value: number[]) =>
              handleVectorChange("income", value[0])
            }
          />
          <p className="text-xs text-muted-foreground">
            How quickly the customer adopts new technology or products
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
