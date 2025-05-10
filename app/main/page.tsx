"use client";
import { useState, useEffect } from "react";

type Session = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

export default function SessionGrid() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [newSessionTitle, setNewSessionTitle] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initialSessions: Omit<Session, "imageUrl">[] = [
      {
        id: 1,
        title: "Example",
        description: "Available soon.",
      },
    ];

    const fetchAllImages = async () => {
      try {
        const sessionsWithImages: Session[] = await Promise.all(
          initialSessions.map(async (session) => {
            const imageUrl = await fetchUnsplashImage(session.title);
            return { ...session, imageUrl };
          })
        );
        setSessions(sessionsWithImages);
      } catch (error) {
        console.error("Failed to fetch images:", error);
        setSessions(
          initialSessions.map((session) => ({
            ...session,
            imageUrl: "/api/placeholder/400/300",
          }))
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllImages();
  }, []);

  const fetchUnsplashImage = async (query: string): Promise<string> => {
    try {
      const response = await fetch(`/api/unsplash?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.statusText}`);
      }
      const data = await response.json();
      return data.imageUrl || `/api/placeholder/400/300?${query}`;
    } catch (error) {
      console.error("Error fetching Unsplash image:", error);
      return `/api/placeholder/400/300?${query}`;
    }
  };

  const handleCardClick = (id: number) => {
    setSelectedSession(id === selectedSession ? null : id);
    
    // If a session is selected, navigate to the session page
    if (id !== selectedSession) {
      // Navigate to the session details page
      window.location.href = `/session/${id}`;
    }
  };

  const addNewSession = async () => {
    if (newSessionTitle.trim() === "") return;

    setIsLoading(true);

    try {
      const imageUrl = await fetchUnsplashImage(newSessionTitle);
      const newSession: Session = {
        id: Date.now(),
        title: newSessionTitle,
        description: "New session created.",
        imageUrl,
      };
      setSessions([...sessions, newSession]);
    } catch (error) {
      console.error("Failed to create new session:", error);
      const fallbackSession: Session = {
        id: Date.now(),
        title: newSessionTitle,
        description: "New session created.",
        imageUrl: `/api/placeholder/400/300?${newSessionTitle}`,
      };
      setSessions([...sessions, fallbackSession]);
    } finally {
      setNewSessionTitle("");
      setIsFormOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Create a new session</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          disabled={isLoading}
        >
          New Session
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Create New Session</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSessionTitle}
              onChange={(e) => setNewSessionTitle(e.target.value)}
              placeholder="Session Title"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={addNewSession}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
            <button
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading && sessions.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p>Loading sessions...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`relative rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-300 transform ${
              selectedSession === session.id
                ? "scale-105 ring-2 ring-blue-500"
                : "hover:scale-102"
            }`}
            onClick={() => handleCardClick(session.id)}
          >
            <div className="relative h-48">
              <img
                src={session.imageUrl}
                alt={session.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 px-4 py-2 bg-black/40 backdrop-blur-sm border border-white/20">
                <div className="flex justify-between items-center">
                  <p className="text-white text-sm">{session.description}</p>
                  <button
                    className="px-3 py-1 text-xs text-white bg-black/30 rounded-lg hover:bg-black/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`You'll be notified about "${session.title}"`);
                    }}
                  >
                    Notify me
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white">
              <h3 className="font-semibold text-lg">{session.title}</h3>
              {selectedSession === session.id && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>Click the Notify button to get updates on this session.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedSession && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center text-blue-800">
            Session #{selectedSession} is selected. Click again to deselect.
          </p>
        </div>
      )}
    </div>
  );
}
