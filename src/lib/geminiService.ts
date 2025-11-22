// Prefer the Vite env var `VITE_GEMINI_API_KEY` so users can set their key without committing it.
// Fallback to the existing value for backward compatibility.
const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string) || 'AIzaSyDluRtqHUT3XmI4Rfi0-GWbqU5czNH9Nek';
import { findDestination } from './destinations';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent';

export interface ItineraryRequest {
  from: string;
  to: string;
  days: number;
  budget: string;
  interests: string[];
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  cost: number;
  duration: string;
}

export interface Meal {
  type: string;
  suggestion: string;
  location: string;
  estimatedCost: number;
}

export interface DayPlan {
  day: number;
  date: string;
  activities: Activity[];
  meals: Meal[];
  accommodation: string;
  estimatedCost: number;
}

export interface ItineraryData {
  summary: string;
  totalEstimatedCost: number;
  budgetBreakdown: {
    accommodation: number;
    food: number;
    activities: number;
    transport: number;
    miscellaneous: number;
  };
  days: DayPlan[];
}

export async function generateItinerary(request: ItineraryRequest): Promise<ItineraryData> {
  const { from, to, days, budget, interests } = request;

  const prompt = `You're an AI Itinerary planner. You need to plan the best itinerary for traveling from ${from} to ${to} covering all major tourist places over ${days} days.

Please plan it in a ${budget} budget way with user interests in: ${interests.join(', ')}.

Provide VERY DETAILED information with lots of text for each activity. Include practical travel tips, historical context, local recommendations, and insider tips.

Provide the plan in JSON format with the following structure:
{
  "summary": "Brief overview of the trip",
  "totalEstimatedCost": <number>,
  "budgetBreakdown": {
    "accommodation": <number>,
    "food": <number>,
    "activities": <number>,
    "transport": <number>,
    "miscellaneous": <number>
  },
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Activity name",
          "description": "VERY DETAILED description with lots of information about what to do, how to get there, what to see, tips, local recommendations, historical background, practical advice, accessibility info, best times to visit this location, nearby attractions",
          "location": "Exact location name with address",
          "coordinates": {"lat": <number>, "lng": <number>},
          "cost": <number>,
          "duration": "2 hours"
        }
      ],
      "meals": [
        {
          "type": "breakfast",
          "suggestion": "Restaurant/dish suggestion",
          "location": "Restaurant name",
          "estimatedCost": <number>
        }
      ],
      "accommodation": "Hotel/stay suggestion",
      "estimatedCost": <number>
    }
  ]
}

Include:
- Morning, afternoon, and evening activities for each day with exact locations
- GPS coordinates for each location (realistic and accurate)
- Breakfast, lunch, and dinner suggestions with local cuisine
- Realistic GPS coordinates for each location
- Estimated costs in USD
- Travel times between locations
- Mix of popular attractions and hidden gems based on interests
- Accommodation recommendations
- Make it detailed, practical, and optimized for ${budget} budget travelers
- Give EXTENSIVE information for each and every activity with detailed guides, tips, and local knowledge
- Include travel times between locations
- Add historical context and local insider tips
- Provide practical advice like best times to visit, crowd levels, parking information
- Include local food recommendations
- Add cultural etiquette tips where relevant
- Make descriptions very detailed and informative`;

  const postData = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    }
  };

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'x-goog-api-key': GEMINI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const textContent = data.candidates[0].content.parts[0].text;

    // Try to find a JSON block using balanced braces (more robust than a simple regex)
    function extractJsonBlock(text: string): string | null {
      const start = text.indexOf('{');
      if (start === -1) return null;
      let depth = 0;
      for (let i = start; i < text.length; i++) {
        const ch = text[i];
        if (ch === '{') depth++;
        else if (ch === '}') depth--;
        if (depth === 0) {
          return text.slice(start, i + 1);
        }
      }
      return null;
    }

    function tryParseJson(raw: string): any {
      try {
        return JSON.parse(raw);
      } catch (e) {
        // Attempt a lightweight cleanup for common model issues: trailing commas, single quotes
        let cleaned = raw;
        // Remove trailing commas before } or ]
        cleaned = cleaned.replace(/,\s*(?=[}\]])/g, '');
        // Replace lone single quotes around property names or values with double quotes (best-effort)
        cleaned = cleaned.replace(/'([^']*)'(?=\s*:)/g, '"$1"');
        cleaned = cleaned.replace(/:\s*'([^']*)'/g, ': "$1"');
        // Remove code fences
        cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
        // Try parsing again
        return JSON.parse(cleaned);
      }
    }

    const jsonBlock = extractJsonBlock(textContent) || (textContent.match(/\{[\s\S]*\}/)?.[0] ?? null);

    if (jsonBlock) {
      try {
        const parsed = tryParseJson(jsonBlock);
        // Basic validation: ensure required fields exist
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.days)) {
          // Enrich activities with coordinates when missing by looking up known destinations
          try {
            parsed.days.forEach((day: any) => {
              if (Array.isArray(day.activities)) {
                day.activities.forEach((act: any) => {
                  if (!act.coordinates || !act.coordinates.lat || !act.coordinates.lng) {
                    const lookupName = (act.location || act.title || '').toString();
                    const dest = findDestination(lookupName);
                    if (dest && typeof dest.lat === 'number' && typeof dest.lon === 'number') {
                      act.coordinates = { lat: dest.lat, lng: dest.lon };
                    }
                  }
                });
              }
            });
          } catch (e) {
            // Non-fatal: continue even if enrichment fails
            console.warn('Coordinate enrichment failed:', e);
          }

          return parsed as ItineraryData;
        }
      } catch (parseErr) {
        console.warn('Failed to parse JSON block from Gemini response, will fall back to raw text. Parse error:', parseErr);
      }
    }

    // If we reach here, parsing failed. Return a safe fallback ItineraryData using the raw text as the summary
    console.warn('Could not extract valid JSON from Gemini response — returning fallback itinerary with raw text.');
    const fallback: ItineraryData = {
      summary: textContent.substring(0, 2000),
      totalEstimatedCost: 0,
      budgetBreakdown: {
        accommodation: 0,
        food: 0,
        activities: 0,
        transport: 0,
        miscellaneous: 0,
      },
      days: [],
    };

    return fallback;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw error;
  }
}
