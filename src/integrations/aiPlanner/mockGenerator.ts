/**
 * Mock itinerary generator for development/testing.
 * Provides realistic-looking itineraries without requiring API keys.
 */

export function generateMockItinerary(
  destinations: string[],
  duration: number,
  budget: string,
  interests: string
): string {
  const dest = destinations[0] || "Your Destination";
  const interests_list = interests ? interests.split(",").map(s => s.trim()).slice(0, 3) : ["sightseeing", "food", "culture"];
  
  // Budget-based cost estimates
  const dailyCost = budget === "luxury" ? "$400-500" : budget === "moderate" ? "$120-180" : "$40-70";
  
  return `# ${duration}-Day Itinerary for ${dest}

## Trip Overview
This ${duration}-day itinerary is designed to showcase the best of ${dest} while staying within your ${budget} budget. With a focus on ${interests_list.join(", ")}, you'll experience authentic local culture, delicious cuisine, and memorable attractions.

---

## Daily Breakdown

${generateDailyPlans(dest, duration, interests_list)}

## Transportation
- **Getting Around**: Use public transport (metro/buses) for daily travel. Purchase a travel card for discounts.
- **Airport Transfer**: Take the airport bus or train to city center (approximately 30-45 minutes, $10-15).
- **Inter-city Travel**: If visiting multiple cities, consider regional trains or buses for scenic routes.
- **Ride-sharing**: Apps like Uber/Grab available in most areas ($5-15 per ride).

## Estimated Daily Costs (${budget} budget)
- Accommodation: $30-100 (varies by location)
- Meals: $15-40 (mix of street food and restaurants)
- Activities: $20-50 (many free walking tours available)
- Transport: $5-20 (daily passes often cheaper)
- **Daily Total: ${dailyCost}**

## Recommended Restaurants & Cafes
- Local street food markets for breakfast
- Mid-range restaurants for lunch ($8-15)
- Fine dining for special occasions ($30-60)
- Cafes for coffee and snacks ($2-5)

## Local Tips & Cultural Insights
- Learn basic phrases in the local language
- Respect local customs and dress codes at religious sites
- Visit markets early morning for best selection and prices
- Try local specialties recommended by your accommodation hosts
- Take time to explore neighborhoods beyond tourist areas
- Be respectful when taking photographs of people

## Suggested Activities & Attractions
${interests_list.map(interest => `- **${capitalize(interest)}**: Explore local ${interest.toLowerCase()} scene, cooking classes, cultural shows`).join("\n")}

---

**Generated**: ${new Date().toLocaleDateString()}
**Note**: This is a sample itinerary. Customize based on your preferences, current travel advisories, and local events.
`;
}

function generateDailyPlans(dest: string, duration: number, interests: string[]): string {
  const days: string[] = [];
  
  for (let i = 1; i <= duration; i++) {
    if (i === 1) {
      days.push(`### Day ${i}: Arrival & Orientation
**Morning**: Arrive and settle into accommodation. Rest and freshen up.
**Afternoon**: Take a walking tour of the neighborhood. Grab lunch at a local cafe.
**Evening**: Explore the main market or shopping street. Dinner at a recommended restaurant.
**Suggested Activity**: Visit a nearby park or waterfront to get your bearings.`);
    } else if (i === duration) {
      days.push(`### Day ${i}: Final Exploration & Departure
**Morning**: Last-minute shopping or visit to a place you missed.
**Afternoon**: Return to accommodation, pack, and prepare for departure.
**Evening**: Farewell dinner at a favorite restaurant. Transfer to airport/station.
**Note**: Confirm your transportation to the airport in advance.`);
    } else {
      const activities = [
        `Explore historic ${dest} with a guided tour`,
        `Visit local museums and cultural centers`,
        `Day trip to nearby attractions`,
        `Street food tour and cooking class`,
        `Adventure activity: hiking, cycling, water sports`,
        `Shopping at local markets and artisan shops`,
        `Relax at parks, spas, or beaches`,
        `Take a photography walk through scenic neighborhoods`
      ];
      const activity = activities[(i - 2) % activities.length];
      
      days.push(`### Day ${i}: Exploration
**Morning**: Breakfast at local cafe. Start exploring the city.
**Afternoon**: ${activity}.
**Evening**: Relax at your accommodation or explore nightlife.
**Dining**: Try a new restaurant recommended by locals.`);
    }
  }
  
  return days.join("\n\n");
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
