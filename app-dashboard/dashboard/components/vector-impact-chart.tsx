"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { CustomerVector } from "@/app/lib/utils";

interface VectorImpactChartProps {
  customerVector: CustomerVector;
}

export function VectorImpactChart({ customerVector }: VectorImpactChartProps) {
  // Transform the vector data for the chart
  const chartData = [
    {
      name: "Loyalty",
      value: customerVector.loyalty * 100,
      fill: "#4f46e5", // Indigo
    },
    {
      name: "Risk Tolerance",
      value: customerVector.riskTolerance * 100,
      fill: "#059669", // Emerald
    },
    {
      name: "Innovation",
      value: customerVector.innovation * 100,
      fill: "#0891b2", // Cyan
    },
    {
      name: "Price Sensitivity",
      value: customerVector.priceSensitivity * 100,
      fill: "#d97706", // Amber
    },
  ];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Vector Impact</CardTitle>
        <CardDescription>
          Current customer vector values (percentage)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value) => [`${value}%`, "Value"]}
                labelStyle={{ color: "var(--foreground)" }}
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                }}
              />
              <Legend />
              <Bar dataKey="value" name="Value (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 