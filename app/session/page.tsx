"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import fs from 'fs/promises';
import path from 'path';

export default function ChoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams ? searchParams.get("sessionId") : null;
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [inputName, setInputName] = useState("");
  const [inputBio, setInputBio] = useState("");
  const [imageURL, setImageURL] = useState("");

  // Load existing session data if available
  useEffect(() => {
    const loadSessionData = async () => {
      if (!sessionId) {
        console.error("No session ID provided");
        return;
      }
      
      try {
        // Using fetch to get the JSON file
        const response = await fetch('/api/session?sessionId=' + sessionId);
        if (response.ok) {
          const data = await response.json();
          setSessionData(data);
          // Pre-fill form fields if data exists
          if (data.sessionName) setInputName(data.sessionName);
          if (data.sessionBio) setInputBio(data.sessionBio);
          if (data.imageURL) setImageURL(data.imageURL);
        }
      } catch (error) {
        console.error("Error loading session data:", error);
      }
    };

    loadSessionData();
  }, [sessionId]);

  const saveSessionData = async () => {
    if (!sessionId) return;
    
    setLoading(true);
    
    try {
      const data = {
        sessionID: sessionId,
        sessionName: inputName || "Unnamed Session",
        sessionBio: inputBio || "No description provided",
        imageURL: imageURL || ""
      };
      
      // Send data to API route that will save it to the JSON file
      const response = await fetch('/api/save-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save session data');
      }
      
      return data;
    } catch (error) {
      console.error("Error saving session data:", error);
      alert("Failed to save session data");
    } finally {
      setLoading(false);
    }
  };

  const handleAgentChoiceSelection = async () => {
    const savedData = await saveSessionData();
    if (savedData) {
      router.push(`/agent?sessionId=${sessionId}`);
    }
  };

  const handleEnvChoiceSelection = async () => {
    const savedData = await saveSessionData();
    if (savedData) {
      router.push(`/environment?sessionId=${sessionId}`);
    }
  };

  // Return loading screen or error message if no sessionId is available
  if (!sessionId) {
    return (
      <div className="p-6 min-h-[calc(100vh-7rem)]">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700">
            No session ID provided. Please go back and select a valid session.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  // Main content when sessionId is present
  return (
    <div className="p-6 min-h-[calc(100vh-7rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Session #{sessionId} Configuration</h1>
        <p className="text-gray-600 mt-2">
          Please provide details for this session before making a choice.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Session Details</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="sessionName" className="block text-sm font-medium text-gray-700">
              Session Name
            </label>
            <input
              type="text"
              id="sessionName"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter session name"
            />
          </div>
          <div>
            <label htmlFor="sessionBio" className="block text-sm font-medium text-gray-700">
              Session Description
            </label>
            <textarea
              id="sessionBio"
              value={inputBio}
              onChange={(e) => setInputBio(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe this session"
            />
          </div>
          <div>
            <label htmlFor="imageURL" className="block text-sm font-medium text-gray-700">
              Image URL (optional)
            </label>
            <input
              type="text"
              id="imageURL"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div
          className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
          onClick={handleAgentChoiceSelection}
        >
          <h2 className="text-xl font-semibold mb-3">Agent</h2>
          <p className="text-gray-600 mb-4">
            This is the first choice option for session #{sessionId}. Select this to proceed with option 1.
          </p>
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Select Agent"}
          </button>
        </div>
        <div
          className="bg-white shadow-lg rounded-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
          onClick={handleEnvChoiceSelection}
        >
          <h2 className="text-xl font-semibold mb-3">Environment</h2>
          <p className="text-gray-600 mb-4">
            This is the second choice option for session #{sessionId}. Select this to proceed with option 2.
          </p>
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Select Environment"}
          </button>
        </div>
      </div>
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