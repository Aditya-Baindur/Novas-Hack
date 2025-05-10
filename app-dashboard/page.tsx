import { redirect } from "next/navigation";

export default function Home({ searchParams }) {
  const simulation = searchParams?.simulation;
  
  // If a simulation parameter is present, redirect to the dashboard with it
  if (simulation) {
    redirect(`/dashboard?simulation=${simulation}`);
  } else {
    redirect("/dashboard");
  }
} 