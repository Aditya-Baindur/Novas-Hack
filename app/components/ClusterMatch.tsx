import React from "react";
import { CustomerCluster } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ClusterMatchProps {
  matchedCluster: CustomerCluster | null;
}

export function ClusterMatch({ matchedCluster }: ClusterMatchProps) {
  if (!matchedCluster) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Cluster Match</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Adjust the vector values to see which customer cluster best matches.
          </p>
        </CardContent>
      </Card>
    );
  }

  const vectorToPercentage = (value: number) => `${Math.round(value * 100)}%`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Cluster Match</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Best Match: {matchedCluster.name}</h3>
          <p className="text-sm text-muted-foreground">
            Cluster Size: {matchedCluster.size.toLocaleString()} customers
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Cluster Profile</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-muted-foreground">Brand Loyalty</span>
              <div className="flex items-center space-x-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    width: vectorToPercentage(matchedCluster.vector.loyalty),
                    backgroundColor: matchedCluster.color
                  }} 
                />
                <span className="text-xs">{vectorToPercentage(matchedCluster.vector.loyalty)}</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-muted-foreground">Risk Tolerance</span>
              <div className="flex items-center space-x-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    width: vectorToPercentage(matchedCluster.vector.riskTolerance),
                    backgroundColor: matchedCluster.color
                  }} 
                />
                <span className="text-xs">{vectorToPercentage(matchedCluster.vector.riskTolerance)}</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-muted-foreground">Innovation Adoption</span>
              <div className="flex items-center space-x-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    width: vectorToPercentage(matchedCluster.vector.innovation),
                    backgroundColor: matchedCluster.color
                  }} 
                />
                <span className="text-xs">{vectorToPercentage(matchedCluster.vector.innovation)}</span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-muted-foreground">Price Sensitivity</span>
              <div className="flex items-center space-x-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    width: vectorToPercentage(matchedCluster.vector.priceSensitivity),
                    backgroundColor: matchedCluster.color
                  }} 
                />
                <span className="text-xs">{vectorToPercentage(matchedCluster.vector.priceSensitivity)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 