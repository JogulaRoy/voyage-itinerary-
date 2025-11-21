/**
 * Gemini Handler - Forward itinerary requests to Google Gemini API
 * This runs on the backend (Express) to avoid exposing the API key to the client.
 */

import https from 'https';

interface GeminiPayload {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

export async function callGeminiAPI(payload: GeminiPayload): Promise<string> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing environment variable: GOOGLE_GEMINI_API_KEY');
  }

  const bodyString = JSON.stringify(payload);

  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.0-flash-001:generateContent?key=${apiKey}`,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyString),
      },
      maxRedirects: 20,
    };

    const req = https.request(options, (res) => {
      let chunks: Buffer[] = [];

      res.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const body = Buffer.concat(chunks);
        const bodyStr = body.toString();

        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
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

    req.on('error', (error) => {
      reject(error);
    });

    req.write(bodyString);
    req.end();
  });
}
