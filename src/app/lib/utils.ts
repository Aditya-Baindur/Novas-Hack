import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Vector types used throughout the application
export interface CustomerVector {
  loyalty: number;
  riskTolerance: number;
  innovation: number;
  priceSensitivity: number;
}

// Customer cluster data
export interface CustomerCluster {
  id: string;
  name: string;
  vector: CustomerVector;
  size: number;
  color: string;
}

// Generate sample customer clusters
export function generateSampleClusters(): CustomerCluster[] {
  return [
    {
      id: "1",
      name: "Loyal Conservatives",
      vector: { loyalty: 0.8, riskTolerance: 0.2, innovation: 0.3, priceSensitivity: 0.7 },
      size: 2500,
      color: "hsl(var(--chart-1))"
    },
    {
      id: "2",
      name: "Tech Enthusiasts",
      vector: { loyalty: 0.5, riskTolerance: 0.7, innovation: 0.9, priceSensitivity: 0.4 },
      size: 1800,
      color: "hsl(var(--chart-2))"
    },
    {
      id: "3",
      name: "Price Hunters",
      vector: { loyalty: 0.3, riskTolerance: 0.4, innovation: 0.5, priceSensitivity: 0.9 },
      size: 3200,
      color: "hsl(var(--chart-3))"
    },
    {
      id: "4",
      name: "Brand Loyalists",
      vector: { loyalty: 0.9, riskTolerance: 0.3, innovation: 0.6, priceSensitivity: 0.3 },
      size: 1500,
      color: "hsl(var(--chart-4))"
    },
    {
      id: "5",
      name: "Risk Takers",
      vector: { loyalty: 0.4, riskTolerance: 0.9, innovation: 0.8, priceSensitivity: 0.5 },
      size: 1200,
      color: "hsl(var(--chart-5))"
    }
  ];
}

// Calculate Euclidean distance between two vectors
export function calculateDistance(vectorA: CustomerVector, vectorB: CustomerVector): number {
  const squaredDiffs = 
    Math.pow(vectorA.loyalty - vectorB.loyalty, 2) +
    Math.pow(vectorA.riskTolerance - vectorB.riskTolerance, 2) +
    Math.pow(vectorA.innovation - vectorB.innovation, 2) +
    Math.pow(vectorA.priceSensitivity - vectorB.priceSensitivity, 2);
  
  return Math.sqrt(squaredDiffs);
}

// Find nearest cluster for a customer vector
export function findNearestCluster(customerVector: CustomerVector, clusters: CustomerCluster[]): CustomerCluster {
  let nearestCluster = clusters[0];
  let minDistance = calculateDistance(customerVector, clusters[0].vector);
  
  for (let i = 1; i < clusters.length; i++) {
    const distance = calculateDistance(customerVector, clusters[i].vector);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCluster = clusters[i];
    }
  }
  
  return nearestCluster;
} 