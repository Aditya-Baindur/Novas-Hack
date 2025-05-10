import React, { useState } from "react";
import { CustomerVector } from "../lib/utils";
import { Slider } from "./ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface VectorInputsProps {
  onVectorChange: (vector: CustomerVector) => void;
}

export function VectorInputs({ onVectorChange }: VectorInputsProps) {
  const [vector, setVector] = useState<CustomerVector>({
    loyalty: 0.5,
    riskTolerance: 0.5,
    innovation: 0.5,
    priceSensitivity: 0.5,
  });

  const handleVectorChange = (key: keyof CustomerVector, value: number) => {
    const newVector = { ...vector, [key]: value / 100 };
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
              Brand Loyalty
            </label>
            <span className="text-sm text-muted-foreground">
              {Math.round(vector.loyalty * 100)}%
            </span>
          </div>
          <Slider
            id="loyalty"
            min={0}
            max={100}
            step={1}
            value={[vector.loyalty * 100]}
            onValueChange={(value: number[]) => handleVectorChange("loyalty", value[0])}
          />
          <p className="text-xs text-muted-foreground">
            How loyal the customer is to specific brands
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium" htmlFor="riskTolerance">
              Risk Tolerance
            </label>
            <span className="text-sm text-muted-foreground">
              {Math.round(vector.riskTolerance * 100)}%
            </span>
          </div>
          <Slider
            id="riskTolerance"
            min={0}
            max={100}
            step={1}
            value={[vector.riskTolerance * 100]}
            onValueChange={(value: number[]) => handleVectorChange("riskTolerance", value[0])}
          />
          <p className="text-xs text-muted-foreground">
            How willing the customer is to take risks with purchases
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium" htmlFor="innovation">
              Innovation Adoption
            </label>
            <span className="text-sm text-muted-foreground">
              {Math.round(vector.innovation * 100)}%
            </span>
          </div>
          <Slider
            id="innovation"
            min={0}
            max={100}
            step={1}
            value={[vector.innovation * 100]}
            onValueChange={(value: number[]) => handleVectorChange("innovation", value[0])}
          />
          <p className="text-xs text-muted-foreground">
            How quickly the customer adopts new technology or products
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium" htmlFor="priceSensitivity">
              Price Sensitivity
            </label>
            <span className="text-sm text-muted-foreground">
              {Math.round(vector.priceSensitivity * 100)}%
            </span>
          </div>
          <Slider
            id="priceSensitivity"
            min={0}
            max={100}
            step={1}
            value={[vector.priceSensitivity * 100]}
            onValueChange={(value: number[]) => handleVectorChange("priceSensitivity", value[0])}
          />
          <p className="text-xs text-muted-foreground">
            How concerned the customer is with price versus value
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 