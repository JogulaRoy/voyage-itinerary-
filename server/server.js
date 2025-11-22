/**
 * Simple Express Server Example for AI Itinerary Planner
 * Start with: node server.js (after building TypeScript or using ts-node)
 * 
 * Environment Variables:
 * - GOOGLE_GEMINI_API_KEY: Your Google Gemini API key
 * - PORT: Server port (default 3001)
 */

const express = require('express');
const https = require('follow-redirects').https;

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
// Allow CORS for development (adjust in production)
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

/**
 * Call Google Gemini API
 */
async function callGeminiAPI(payload) {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing environment variable: GOOGLE_GEMINI_API_KEY');
  }

  const bodyString = JSON.stringify(payload);

  return new Promise((resolve, reject) => {
    const options = {
      'method': 'POST',
      'hostname': 'generativelanguage.googleapis.com',
      'path': `/v1beta/models/gemini-2.0-flash-001:generateContent?key=${apiKey}`,
      'headers': {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyString),
      },
      'maxRedirects': 20
    };

    const req = https.request(options, function (res) {
      let chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        const body = Buffer.concat(chunks);
        const bodyStr = body.toString();

        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const jsonResponse = JSON.parse(bodyStr);
            // Extract text from Gemini response
            const responseText =
              jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text ||
              bodyStr;
            resolve(responseText);
          } catch (_e) {
            resolve(bodyStr);
          }
        } else {
          reject(new Error(`Gemini API error: ${res.statusCode} ${bodyStr}`));
        }
      });
    });

    req.on("error", function (error) {
      reject(error);
    });

    req.write(bodyString);
    req.end();
  });
}

/**
 * POST /api/generate-itinerary
 * Generate an itinerary using Google Gemini
 */
app.post('/api/generate-itinerary', async (req, res) => {
  try {
    const { destination, days, budget, interests } = req.body;

    if (!destination || !days) {
      return res.status(400).json({ error: 'Missing required fields: destination, days' });
    }

    const userInterests = interests || 'historical places';
    const trimmedDays = Math.max(1, Math.min(30, parseInt(days) || 3));

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

    console.log('📤 Sending to Gemini:', promptText.slice(0, 100) + '...');
    const responseText = await callGeminiAPI(payload);
    console.log('📥 Received from Gemini, length:', responseText.length);

    res.json({
      itinerary: responseText,
      destination,
      days: trimmedDays,
      budget,
      interests: userInterests
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('❌ Itinerary generation error:', msg);
    res.status(500).json({ error: 'Failed to generate itinerary', details: msg });
  }
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Itinerary planner server running on http://localhost:${PORT}`);
  console.log(`\n📝 Endpoint: POST http://localhost:${PORT}/api/generate-itinerary`);
  console.log(`\n⚙️  Required ENV: GOOGLE_GEMINI_API_KEY`);
  console.log(`\n✅ Health check: GET http://localhost:${PORT}/health`);
});
