/**
 * Express API Route for Itinerary Generation
 * Use in your Express app: app.post('/api/generate-itinerary', handleGenerateItinerary)
 * 
 * Example:
 * import express from 'express';
 * import { handleGenerateItinerary } from './api/itinerary';
 * 
 * const app = express();
 * app.use(express.json());
 * app.post('/api/generate-itinerary', handleGenerateItinerary);
 */

import { Request, Response } from 'express';
import { callGeminiAPI } from '../gemini-handler';

interface ItineraryRequest {
  destination: string;
  days: number;
  budget: string;
  interests: string;
}

export async function handleGenerateItinerary(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { destination, days, budget, interests } = req.body as ItineraryRequest;

    if (!destination || !days) {
      res.status(400).json({ error: 'Missing required fields: destination, days' });
      return;
    }

    const userInterests = interests || 'historical places';
    const trimmedDays = Math.max(1, Math.min(30, parseInt(String(days)) || 3));

    // Build Gemini request payload
    const promptText = `You're an AI Itinerary planner. You need to plan the best itinerary for ${trimmedDays} days to cover all major tourist places from ${destination}. Please plan it in a luxurious way with user interests: '${userInterests}' and budget level: '${budget}'. Give me the plan in a well formatted string with bullet points and bold wherever necessary from Day 1 to Day ${trimmedDays}, including food, travel and other costs.`;

    const payload = {
      contents: [
        {
          parts: [
            { text: promptText }
          ]
        }
      ]
    };

    const responseText = await callGeminiAPI(payload);
    res.json({ itinerary: responseText, destination, days: trimmedDays, budget, interests: userInterests });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Itinerary generation error:', msg);
    res.status(500).json({ error: 'Failed to generate itinerary', details: msg });
  }
}
