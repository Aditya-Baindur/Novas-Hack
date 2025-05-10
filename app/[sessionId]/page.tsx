"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

export default function SessionRedirect() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.sessionId as string;

  useEffect(() => {
    router.push(`/${sessionId}/dashboard`);
  }, [router, sessionId]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
        <p>Redirecting to dashboard...</p>
      </div>
    </div>
  );
} 