// File: app/api/save-session/route.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    // Get the session data from the request body
    const sessionData = await request.json();
    
    if (!sessionData.sessionID) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }
    
    // Path to the session.json file
    const filePath = path.join(process.cwd(), 'public', 'session.json');
    
    // Read existing data or create empty object if file doesn't exist
    let sessions = {};
    
    try {
      await fs.access(filePath);
      const fileContent = await fs.readFile(filePath, 'utf8');
      sessions = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist or can't be parsed, create with empty object
      sessions = {};
    }
    
    // Add or update the session data
    sessions[sessionData.sessionID] = {
      sessionID: sessionData.sessionID,
      sessionName: sessionData.sessionName || "",
      sessionBio: sessionData.sessionBio || "",
      imageURL: sessionData.imageURL || ""
    };
    
    // Write the updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(sessions, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, message: 'Session data saved successfully' });
    
  } catch (error) {
    console.error('Error saving session data:', error);
    return NextResponse.json({ error: 'Failed to save session data' }, { status: 500 });
  }
}