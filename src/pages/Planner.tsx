import ItineraryPlanner from "@/components/ItineraryPlanner";
import { DESTINATIONS } from "@/lib/destinations";

const Planner = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">AI Itinerary Planner</h1>
          <p className="text-muted-foreground">Create a personalized day-by-day itinerary using AI. Select destinations, duration and interests — then generate a plan you can refine.</p>
        </div>
      </section>

      <section className="mb-12">
        <ItineraryPlanner destinations={DESTINATIONS} />
      </section>

      {/* About Us moved to the homepage above the feedback section */}
    </div>
  );
};

export default Planner;
