"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SimulationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams ? searchParams.get("sessionId") : null;
  const choiceId = searchParams ? searchParams.get("choice") : null;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!sessionId || !choiceId) {
      console.error("Missing session ID or choice ID");
    }
  }, [sessionId, choiceId]);

  const handleActionClick = (actionNumber: number) => {
    setIsLoading(true);
    setTimeout(() => {
      alert(`Action ${actionNumber} performed for Session #${sessionId} with Choice #${choiceId}`);
      setIsLoading(false);
    }, 500);
  };

  if (!sessionId || !choiceId) {
    return (
      <div className="p-6 min-h-[calc(100vh-7rem)]">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">
            Missing required parameters. Please go back and make a valid selection.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-[calc(100vh-7rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Simulation for Session #{sessionId} - Choice #{choiceId}
        </h1>
        <p className="text-gray-600 mt-2">
          Below are the available actions for your selected session and choice.
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-blue-800">
          You are currently in Session #{sessionId} with Choice #{choiceId} selected.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Action Button 1</h2>
          <p className="text-gray-600 mb-4">
            This is the first placeholder action button for your current simulation.
          </p>
          <button
            onClick={() => handleActionClick(1)}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Perform Action 1"}
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Action Button 2</h2>
          <p className="text-gray-600 mb-4">
            This is the second placeholder action button for your current simulation.
          </p>
          <button
            onClick={() => handleActionClick(2)}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Perform Action 2"}
          </button>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Back to Choices
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Sessions
        </button>
      </div>
    </div>
  );
}