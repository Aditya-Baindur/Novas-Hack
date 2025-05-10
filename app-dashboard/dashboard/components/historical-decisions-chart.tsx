"use client";

import React, { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

// Mock historical data - 90 days of purchase decisions with dates
const generateHistoricalData = () => {
  const data = [];
  const today = new Date();
  for (let i = 90; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Generate random bought/not bought numbers with some correlation
    const bought = Math.floor(Math.random() * 10) + 5;
    const notBought = Math.floor(Math.random() * 8) + 3;
    
    data.push({
      date: date.toISOString().split('T')[0],
      bought,
      notBought,
      total: bought + notBought,
    });
  }
  return data;
};

const historicalData = generateHistoricalData();

export function HistoricalDecisionsChart() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  // Filter data based on selected time range
  const filteredData = historicalData.filter((item) => {
    const date = new Date(item.date);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (timeRange === "7d") return diffDays <= 7;
    if (timeRange === "30d") return diffDays <= 30;
    return true; // 90d shows all data
  });

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Purchase Decisions History</CardTitle>
          <CardDescription>
            Historical data of purchase decisions over time
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={timeRange === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("7d")}
          >
            7 days
          </Button>
          <Button
            variant={timeRange === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("30d")}
          >
            30 days
          </Button>
          <Button
            variant={timeRange === "90d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("90d")}
          >
            90 days
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="colorBought" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorNotBought" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  return [value, name === "bought" ? "Purchased" : "Not Purchased"];
                }}
                labelFormatter={(date) => {
                  const d = new Date(date);
                  return d.toLocaleDateString();
                }}
              />
              <Legend
                formatter={(value) => {
                  return value === "bought" ? "Purchased" : "Not Purchased";
                }}
              />
              <Area
                type="monotone"
                dataKey="bought"
                stroke="#4f46e5"
                fillOpacity={1}
                fill="url(#colorBought)"
              />
              <Area
                type="monotone"
                dataKey="notBought"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#colorNotBought)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 