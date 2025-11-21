import { useState } from 'react';
import PlannerForm, { FormData } from '@/components/ItineraryPlannerForm';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import { generateItinerary, ItineraryData } from '@/lib/geminiService';

const Planner = () => {
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: FormData) => {
    setFormData(data);
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateItinerary({
        from: data.from,
        to: data.to,
        days: data.days,
        budget: data.budget,
        interests: data.interests
      });
      setItinerary(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate itinerary';
      setError(errorMessage);
      console.error('Error generating itinerary:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setFormData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-slate-50 to-cream py-12">
      <div className="container mx-auto px-4">
        {!itinerary ? (
          <>
            <section className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
                AI Travel Itinerary Planner
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Create a personalized day-by-day itinerary using advanced AI. Tell us your destination, duration, budget, and interests — then let our AI generate a detailed travel plan optimized just for you.
              </p>
            </section>

            <section className="flex justify-center mb-8">
              <PlannerForm onGenerate={handleGenerate} isGenerating={isGenerating} />
            </section>

            {error && (
              <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-red-800">
                <h3 className="font-bold mb-2">Error generating itinerary:</h3>
                <p>{error}</p>
              </div>
            )}
          </>
        ) : (
          <>
            <section className="mb-8 flex justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
              >
                ← Plan Another Trip
              </button>
            </section>

            <section className="flex justify-center">
              {formData && (
                <ItineraryDisplay 
                  data={itinerary} 
                  from={formData.from} 
                  to={formData.to}
                />
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Planner;
