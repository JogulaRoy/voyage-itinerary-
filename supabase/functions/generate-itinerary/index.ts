import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log("📥 Server received request:", JSON.stringify(requestBody, null, 2));
    
    const { destinations, duration, budget, interests } = requestBody;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("❌ LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured on the server");
    }

    console.log("✅ LOVABLE_API_KEY is set. Generating itinerary for:", { destinations, duration, budget });

    const systemPrompt = `You are an expert travel planner. Create detailed, personalized itineraries based on user preferences. 
    Format your response as a structured itinerary with daily plans, including:
    - Day-by-day schedule
    - Attractions and activities
    - Restaurant recommendations
    - Transportation tips
    - Estimated costs
    - Local tips and cultural insights
    
    Make the itinerary practical, engaging, and tailored to the user's interests and budget.`;

    const userPrompt = `Create a ${duration}-day travel itinerary for the following destination(s): ${destinations.join(', ')}.
    
    Budget level: ${budget}
    Interests: ${interests}
    
    Please provide a detailed day-by-day itinerary with specific recommendations for attractions, restaurants, and activities that match these preferences.`;

    console.log("🚀 Calling Lovable AI gateway...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    console.log("📥 AI gateway response status:", response.status);

    if (!response.ok) {
      if (response.status === 429) {
        console.error("❌ Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("❌ Payment required");
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 401) {
        console.error("❌ Unauthorized - LOVABLE_API_KEY may be invalid");
        return new Response(
          JSON.stringify({ error: "Unauthorized - LOVABLE_API_KEY is invalid or expired." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("❌ AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ AI response received. Choices length:", data?.choices?.length);

    if (!data?.choices?.[0]?.message?.content) {
      console.error("❌ Unexpected response structure:", JSON.stringify(data, null, 2));
      throw new Error("Unexpected response format from AI gateway");
    }

    const itinerary = data.choices[0].message.content;
    console.log("✅ Successfully generated itinerary, length:", itinerary.length);

    return new Response(
      JSON.stringify({ itinerary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error in generate-itinerary function:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
