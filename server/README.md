# AI Itinerary Planner - Server Setup & Usage Guide

This directory contains the backend infrastructure for the AI Itinerary Planner that integrates with **Google Gemini API**.

## 📋 Files Overview

| File | Purpose |
|------|---------|
| `server.js` | Main Express server with `/api/generate-itinerary` endpoint |
| `gemini-handler.ts` | TypeScript handler for calling Gemini API (for production) |
| `gemini-example.js` | Standalone Node.js example showing how to call Gemini directly |
| `POSTMAN_COLLECTION.json` | Postman collection with example requests |

## 🚀 Quick Start

### 1. Get Your Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click **"Get API Key"**
3. Create a new API key for the Gemini API
4. Copy the key

### 2. Set Environment Variable

```bash
# macOS/Linux
export GOOGLE_GEMINI_API_KEY="your-api-key-here"

# Windows (PowerShell)
$env:GOOGLE_GEMINI_API_KEY="your-api-key-here"

# Windows (Command Prompt)
set GOOGLE_GEMINI_API_KEY=your-api-key-here
```

### 3. Install Dependencies

```bash
npm install express follow-redirects
```

### 4. Start the Server

```bash
node server.js
```

You should see:
```
🚀 Itinerary planner server running on http://localhost:3001
📝 Endpoint: POST http://localhost:3001/api/generate-itinerary
⚙️  Required ENV: GOOGLE_GEMINI_API_KEY
✅ Health check: GET http://localhost:3001/health
```

### 5. Test with curl

```bash
curl -X POST http://localhost:3001/api/generate-itinerary \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Tokyo",
    "days": 4,
    "budget": "luxury",
    "interests": "culture, food, technology"
  }'
```

## 📝 API Endpoint

### POST `/api/generate-itinerary`

**Request Body:**
```json
{
  "destination": "Paris",
  "days": 5,
  "budget": "luxury|moderate|budget",
  "interests": "historical places, museums, art"
}
```

**Response:**
```json
{
  "itinerary": "Day 1: Arrive in Paris...",
  "destination": "Paris",
  "days": 5,
  "budget": "luxury",
  "interests": "historical places, museums, art"
}
```

**Error Response (missing API key):**
```json
{
  "error": "Failed to generate itinerary",
  "details": "Missing environment variable: GOOGLE_GEMINI_API_KEY"
}
```

## 🧪 Testing Options

### Option 1: Postman Collection

1. Import `POSTMAN_COLLECTION.json` into Postman
2. Replace `YOUR_GOOGLE_GEMINI_API_KEY` with your actual API key
3. Use the **"Generate Itinerary (Direct Gemini Call)"** request to test Gemini directly
4. Use the **"Generate Itinerary (Via Local Server)"** to test the Express endpoint

### Option 2: Standalone Example

Run the standalone Node.js example:

```bash
export GOOGLE_GEMINI_API_KEY="your-api-key"
node gemini-example.js
```

This will generate an itinerary for Paris, 4 days, luxury budget.

### Option 3: cURL

```bash
curl -X POST http://localhost:3001/api/generate-itinerary \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Tokyo",
    "days": 5,
    "budget": "luxury",
    "interests": "anime, technology, food"
  }'
```

## 🔧 Frontend Integration

The React frontend (`ItineraryPlanner.tsx`) automatically:

1. **Builds a Gemini API payload** with destination, duration, budget, and interests
2. **Displays the JSON payload** in a readable format
3. **Attempts to call the local server** (if `VITE_GEMINI_ENDPOINT` is configured)
4. **Falls back to Postman** if the server is not running

### To Enable Frontend Server Calls:

Set the `.env` in your React project:

```env
VITE_GEMINI_ENDPOINT=http://localhost:3001/api/generate-itinerary
```

## 📊 API Call Flow

### Option A: Direct Gemini Call (Postman)

```
Postman → Google Gemini API → Postman
          (with API key in header)
```

### Option B: Via Express Server

```
Frontend (React) → Express Server → Google Gemini API
  (ItineraryPlanner.tsx)     (server.js)         (with API key)
                                 ↓
                            Response parsed & returned to frontend
```

## 🛡️ Security Best Practices

✅ **Do:**
- Store API keys in environment variables only
- Use the Express server to hide API keys from the client
- Never commit `.env` files to git

❌ **Don't:**
- Hardcode API keys in source files
- Expose API keys in the frontend
- Share API keys in repositories

## 📚 Payload Structure (Google Gemini Format)

```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "Your prompt here..."
        }
      ]
    }
  ]
}
```

This is the standard format for the Google Gemini API. The text field contains your prompt or instructions.

## 🎯 Example Payloads

### Paris Itinerary (Luxury, Historical)

```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "You're an AI Itinerary planner. You need to plan the best itinerary for 5 days to cover all major tourist places from Paris. Please plan it in a luxurious way with user interests: 'historical places, museums, architecture' and budget level: 'luxury'. Give me the plan in a well formatted string with bullet points and bold wherever necessary from Day 1 to Day 5, including food, travel and other costs."
        }
      ]
    }
  ]
}
```

### Tokyo Itinerary (Moderate, Food & Tech)

```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "You're an AI Itinerary planner. You need to plan the best itinerary for 4 days to cover all major tourist places from Tokyo. Please plan it in a moderate way with user interests: 'food, technology, anime' and budget level: 'moderate'. Give me the plan in a well formatted string with bullet points and bold wherever necessary from Day 1 to Day 4, including food, travel and other costs."
        }
      ]
    }
  ]
}
```

## 🔗 Useful Links

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Google AI Studio](https://aistudio.google.com)
- [Express.js Docs](https://expressjs.com)

## 📞 Troubleshooting

### Server won't start
- Check if port 3001 is already in use: `lsof -i :3001`
- Try a different port: `PORT=3002 node server.js`

### API Key not recognized
- Verify you exported the environment variable: `echo $GOOGLE_GEMINI_API_KEY`
- Make sure the key is valid and active in Google Cloud

### Gemini API returns error
- Check your API key is correct
- Verify the API is enabled in Google Cloud
- Check your request quota and rate limits

### CORS issues (frontend)
- Add CORS middleware to Express:
  ```javascript
  const cors = require('cors');
  app.use(cors());
  ```

## 🚀 Production Deployment

For production:

1. Use environment variable management (e.g., AWS Secrets, Heroku Config Vars)
2. Add authentication to the `/api/generate-itinerary` endpoint
3. Implement rate limiting
4. Add request/response logging
5. Use HTTPS only
6. Add error monitoring (Sentry, etc.)

Example rate limiting middleware:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```
