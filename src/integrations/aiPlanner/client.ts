// Lightweight client for the ai-trip-planner RapidAPI endpoint.
// NOTE: Provide `VITE_RAPIDAPI_KEY` (and optionally `VITE_RAPIDAPI_HOST`) in your .env.
// Do NOT commit secrets to source control.

export interface DetailedPlanParams {
  days: number;
  destination: string;
  interests?: string[];
  budget?: string;
  travelMode?: string;
}

export async function generateDetailedPlan(params: DetailedPlanParams): Promise<string> {
  const key = (import.meta as any).env?.VITE_RAPIDAPI_KEY as string | undefined;
  const host = (import.meta as any).env?.VITE_RAPIDAPI_HOST as string | undefined || 'ai-trip-planner.p.rapidapi.com';

  if (!key) {
    throw new Error('Missing RapidAPI key. Set VITE_RAPIDAPI_KEY in your environment.');
  }

  const url = `https://${host}/detailed-plan`;

  const body = {
    days: params.days,
    destination: params.destination,
    interests: params.interests ?? [],
    budget: params.budget ?? 'medium',
    travelMode: params.travelMode ?? 'public transport',
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-key': key,
      'x-rapidapi-host': host,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`RapidAPI error: ${res.status} ${txt}`);
  }

  // API sometimes returns plain text or JSON depending on provider. Try JSON, fallback to text.
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    // Try to find meaningful text inside the JSON response
    // Common RapidAPI responses might wrap the text in different fields; fall back to JSON stringify
    return (
      (data?.itinerary as string) || data?.result || data?.plan || data?.data || JSON.stringify(data)
    );
  }

  const text = await res.text();
  return text;
}

export default generateDetailedPlan;
