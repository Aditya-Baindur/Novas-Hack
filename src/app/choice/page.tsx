"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ChoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams ? searchParams.get("sessionId") : null;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      console.error("No session ID provided");
    }
  }, [sessionId]);

  const handleChoiceSelection = (choiceNumber: number) => {
    setLoading(true);
    // Navigate to the simulation page with the session ID and selected choice
    router.push(`/simulation?sessionId=${sessionId}&choice=${choiceNumber}`);
  };

  return (
    <div className="p-6 min-h-[calc(100vh-7rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Make a Choice for Session #{sessionId}</h1>
        <p className="text-gray-600 mt-2">
          Please select one of the available choices for this session.
        </p>
      </div>

      {!sessionId ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700">
            No session ID provided. Please go back and select a valid session.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div
            className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => handleChoiceSelection(1)}
          >
            <h2 className="text-xl font-semibold mb-3">Choice Option 1</h2>
            <p className="text-gray-600 mb-4">
              This is the first choice option for session #{sessionId}. Select this to proceed with option 1.
            </p>
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Loading..." : "Select Option 1"}
            </button>
          </div>

          <div
            className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => handleChoiceSelection(2)}
          >
            <h2 className="text-xl font-semibold mb-3">Choice Option 2</h2>
            <p className="text-gray-600 mb-4">
              This is the second choice option for session #{sessionId}. Select this to proceed with option 2.
            </p>
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Loading..." : "Select Option 2"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Back to Sessions
        </button>
      </div>
    </div>
  );
}