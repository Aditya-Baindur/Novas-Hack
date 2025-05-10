import React from "react";
import { CustomerCluster } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ClusterOverviewProps {
  clusters: CustomerCluster[];
}

export function ClusterOverview({ clusters }: ClusterOverviewProps) {
  // Prepare data for pie chart
  const data = clusters.map((cluster) => ({
    name: cluster.name,
    value: cluster.size,
    color: cluster.color,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Cluster Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString()} customers`, "Size"]}
                labelFormatter={(name) => `Cluster: ${name}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium">Cluster Summary</h4>
          <div className="space-y-1">
            {clusters.map((cluster) => (
              <div key={cluster.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: cluster.color }}
                  />
                  <span>{cluster.name}</span>
                </div>
                <span className="text-muted-foreground">{cluster.size.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 