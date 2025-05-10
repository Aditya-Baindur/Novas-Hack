"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type Session = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Mock function to get session data
    const getSessionData = async () => {
      try {
        // In a real app, fetch session data from an API
        // For now, we'll use mock data
        const mockSession: Session = {
          id: parseInt(sessionId),
          title: `Session ${sessionId}`,
          description: 'Session details will be available here.',
          imageUrl: `/api/placeholder/400/300?${sessionId}`,
        };
        
        setSession(mockSession);
      } catch (error) {
        console.error('Failed to fetch session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getSessionData();
  }, [sessionId]);
  
  // Function to navigate to dashboard
  const navigateToDashboard = () => {
    router.push(`/session/${sessionId}/dashboard`);
  };
  
  // Function to go back to sessions
  const navigateToSessions = () => {
    router.push('/main');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p>Loading session...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      {session && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">{session.title}</h1>
            <div className="flex gap-3">
              <Button variant="outline" onClick={navigateToSessions}>
                Back to Sessions
              </Button>
              <Button onClick={navigateToDashboard}>
                View Dashboard
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={session.imageUrl} 
                  alt={session.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Session Description</h2>
                <p>{session.description}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Session Details</h2>
                <ul className="space-y-2">
                  <li>Session ID: {session.id}</li>
                  <li>Created: {new Date().toLocaleDateString()}</li>
                  <li>Status: Active</li>
                </ul>
              </div>
              
              <Button onClick={navigateToDashboard} className="w-full">
                Open Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 