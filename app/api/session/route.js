// File: app/api/session/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request) {
  try {
    // Get the sessionId from query parameters
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }
    
    // Path to the session.json file
    const filePath = path.join(process.cwd(), 'public', 'session.json');
    
    // Check if the file exists, if not return empty data
    try {
      await fs.access(filePath);
    } catch (error) {
      // Create an empty JSON file if it doesn't exist
      await fs.writeFile(filePath, JSON.stringify({}), 'utf8');
      return NextResponse.json({
        sessionID: sessionId,
        sessionName: "",
        sessionBio: "",
        imageURL: ""
      });
    }
    
    // Read the file
    const fileContent = await fs.readFile(filePath, 'utf8');
    const sessions = JSON.parse(fileContent);
    
    // Look for the session with the matching ID
    if (sessions[sessionId]) {
      return NextResponse.json(sessions[sessionId]);
    } else {
      // Return empty session data if not found
      return NextResponse.json({
        sessionID: sessionId,
        sessionName: "",
        sessionBio: "",
        imageURL: ""
      });
    }
    
  } catch (error) {
    console.error('Error reading session data:', error);
    return NextResponse.json({ error: 'Failed to fetch session data' }, { status: 500 });
  }
}