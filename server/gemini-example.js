/**
 * Node.js Example: Call Google Gemini API for Itinerary Generation
 * This is a standalone example showing how to use the Gemini API with native Node.js
 * 
 * Usage:
 * Set environment variable: export GOOGLE_GEMINI_API_KEY="your-api-key"
 * Then run: node gemini-example.js
 */

const https = require('follow-redirects').https;

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('❌ Error: GOOGLE_GEMINI_API_KEY environment variable not set');
  console.error('Set it with: export GOOGLE_GEMINI_API_KEY="your-api-key"');
  process.exit(1);
}

/**
 * Build the itinerary request payload
 */
function buildPayload(destination, days = 4, interests = 'historical places', budget = 'luxury') {
  const promptText = `You're an AI Itinerary planner. You need to plan the best itinerary for ${days} days to cover all major tourist places from ${destination}. Please plan it in a luxurious way with user interests: '${interests}' and budget level: '${budget}'. Give me the plan in a well formatted string with bullet points and bold wherever necessary from Day 1 to Day ${days}, including food, travel and other costs.`;

  return {
    contents: [
      {
        parts: [
          { text: promptText }
        ]
      }
    ]
  };
}

/**
 * Call Gemini API and stream the response
 */
function callGemini(payload) {
  const options = {
    'method': 'POST',
    'hostname': 'generativelanguage.googleapis.com',
    'path': `/v1beta/models/gemini-2.0-flash-001:generateContent?key=${API_KEY}`,
    'headers': {
      'x-goog-api-key': API_KEY,
      'Content-Type': 'application/json'
    },
    'maxRedirects': 20
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, function (res) {
      let chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
        process.stdout.write('.');
      });

      res.on("end", function () {
        console.log('\n✅ Response complete\n');
        const body = Buffer.concat(chunks);
        try {
          const response = JSON.parse(body.toString());
          const responseText = response?.candidates?.[0]?.content?.parts?.[0]?.text || body.toString();
          resolve(responseText);
        } catch (e) {
          resolve(body.toString());
        }
      });

      res.on("error", function (error) {
        reject(error);
      });
    });

    req.on("error", function (error) {
      reject(error);
    });

    req.write(JSON.stringify(payload));
    req.end();
  });
}

/**
 * Main
 */
async function main() {
  console.log('🚀 Starting AI Itinerary Planner (Google Gemini)\n');

  // Example: Paris 4 days, luxury, historical interests
  const destination = 'Paris';
  const days = 4;
  const interests = 'historical places, museums, architecture';
  const budget = 'luxury';

  console.log(`📍 Destination: ${destination}`);
  console.log(`📅 Duration: ${days} days`);
  console.log(`💰 Budget: ${budget}`);
  console.log(`❤️  Interests: ${interests}\n`);

  const payload = buildPayload(destination, days, interests, budget);

  console.log('📤 Sending request to Google Gemini API...');
  console.log(`📝 Prompt: "${payload.contents[0].parts[0].text.slice(0, 80)}..."\n`);

  try {
    const itinerary = await callGemini(payload);
    console.log('📋 Generated Itinerary:\n');
    console.log('─'.repeat(80));
    console.log(itinerary);
    console.log('─'.repeat(80));
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
  }
}

main();
