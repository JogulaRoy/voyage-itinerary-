import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ItineraryPlannerProps {
  destinations: { name: string }[];
}

const ItineraryPlanner = ({ destinations }: ItineraryPlannerProps) => {
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [duration, setDuration] = useState("3");
  const [budget, setBudget] = useState("moderate");
  const [interests, setInterests] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [structured, setStructured] = useState<{
    summary?: string;
    days?: { title: string; content: string }[];
    transport?: string;
    restaurants?: string[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const toggleDestination = (destination: string) => {
    setSelectedDestinations(prev =>
      prev.includes(destination)
        ? prev.filter(d => d !== destination)
        : [...prev, destination]
    );
  };

  const generateItinerary = async () => {
    if (selectedDestinations.length === 0) {
      toast({
        title: "No destinations selected",
        description: "Please select at least one destination",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setItinerary("");

    try {
      const { data, error } = await supabase.functions.invoke('generate-itinerary', {
        body: {
          destinations: selectedDestinations,
          duration: parseInt(duration),
          budget,
          interests: interests || "General sightseeing, culture, and food",
        },
      });

      if (error) throw error;

      if (data?.itinerary) {
        const text: string = data.itinerary;
        setItinerary(text);
        // Try to parse a day-by-day itinerary
        const days = parseDaysFromItinerary(text);
        const transport = extractSection(text, /transport|transportation|getting around/i);
        const restaurants = extractLines(text, /restaurant|dinner|breakfast|lunch|cafe/i).slice(0, 8);
        const summary = extractSection(text, /summary|overview|about this trip/i) ||
          text.split("\n\n")[0];

        setStructured({ summary, days, transport, restaurants });
        toast({
          title: "Itinerary generated!",
          description: "Your personalized travel plan is ready",
        });
      }
    } catch (error) {
      console.error("Error generating itinerary:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate itinerary",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 text-base md:text-lg">
      <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-2 border-primary/20">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">AI Itinerary Planner</h2>
        </div>

        <div className="space-y-6">
          {/* Destination Selection */}
          <div>
            <Label className="text-lg font-semibold mb-3 block">Select Destinations</Label>
            <div className="flex flex-wrap gap-2">
              {destinations.map((dest) => (
                <Button
                  key={dest.name}
                  variant={selectedDestinations.includes(dest.name) ? "default" : "outline"}
                  onClick={() => toggleDestination(dest.name)}
                  className="transition-all"
                >
                  {dest.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration" className="text-lg font-semibold mb-2 block">
              Trip Duration (days)
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="max-w-xs"
            />
          </div>

          {/* Budget */}
          <div>
            <Label className="text-lg font-semibold mb-3 block">Budget Level</Label>
            <div className="flex gap-3">
              {["budget", "moderate", "luxury"].map((level) => (
                <Button
                  key={level}
                  variant={budget === level ? "default" : "outline"}
                  onClick={() => setBudget(level)}
                  className="capitalize"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <Label htmlFor="interests" className="text-lg font-semibold mb-2 block">
              Your Interests (optional)
            </Label>
            <Textarea
              id="interests"
              placeholder="E.g., adventure sports, photography, local cuisine, historical sites..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateItinerary}
            disabled={isLoading || selectedDestinations.length === 0}
            className="w-full h-14 text-lg font-semibold"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Your Perfect Itinerary...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate AI Itinerary
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Itinerary Display */}
      {itinerary && (
        <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-2 border-primary/20">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Your Personalized Itinerary</h3>

            {/* Summary */}
            {structured.summary && (
              <div className="mb-6 border-l-4 border-primary/30 pl-4">
                <div className="flex items-center gap-3">
                  <CategoryBadge label="Overview" colorIndex={0} />
                  <h4 className="text-lg md:text-xl font-semibold">Trip Overview</h4>
                </div>
                <p className="text-sm md:text-base text-muted-foreground mt-2 whitespace-pre-wrap">{structured.summary}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Cost breakdown + pie chart */}
              <div className="col-span-1 md:col-span-1 border-l-4 border-emerald-200/50 pl-4">
                <div className="flex items-center gap-3">
                  <CategoryBadge label="Costs" colorIndex={1} />
                  <h4 className="text-lg md:text-xl font-semibold mb-2">Estimated Cost Breakdown</h4>
                </div>
                <div className="h-48 bg-white/0 rounded-md flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={buildCostData(parseInt(duration), budget)}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        innerRadius={30}
                        label
                      >
                        {buildCostData(parseInt(duration), budget).map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <ReTooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Costs table */}
              <div className="col-span-1 md:col-span-2 border-l-4 border-amber-200/50 pl-4">
                <div className="flex items-center gap-3">
                  <CategoryBadge label="Costs (table)" colorIndex={2} />
                  <h4 className="text-lg md:text-xl font-semibold mb-2">Estimated Costs (approx.)</h4>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-sm text-muted-foreground">
                      <th className="pb-2">Category</th>
                      <th className="pb-2">Estimated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buildCostData(parseInt(duration), budget).map((row) => (
                      <tr key={row.name} className="border-t">
                        <td className="py-2">{row.name}</td>
                        <td className="py-2 font-medium">${row.value.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Day by day */}
            <div className="space-y-4">
              {(structured.days && structured.days.length > 0) ? (
                structured.days.map((d, idx) => (
                  <div key={idx} className="border-l-4 pl-4" style={{ borderColor: COLORS[idx % COLORS.length] + "66" }}>
                    <DayAccordion key={idx} index={idx} title={d.title} content={d.content} />
                  </div>
                ))
              ) : (
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-foreground">{itinerary}</div>
                </div>
              )}
            </div>

            {/* Transport & restaurants */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {structured.transport && (
                <div className="border-l-4 border-sky-200/50 pl-4">
                  <div className="flex items-center gap-3">
                    <CategoryBadge label="Transport" colorIndex={3} />
                    <h4 className="text-lg md:text-xl font-semibold">Transportation Tips</h4>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground mt-2 whitespace-pre-wrap">{structured.transport}</p>
                </div>
              )}

              {structured.restaurants && structured.restaurants.length > 0 && (
                <div className="border-l-4 border-rose-200/50 pl-4">
                  <div className="flex items-center gap-3">
                    <CategoryBadge label="Food" colorIndex={4} />
                    <h4 className="text-lg md:text-xl font-semibold">Recommended Places to Eat</h4>
                  </div>
                  <ul className="list-disc pl-5 mt-2 text-sm md:text-base text-muted-foreground">
                    {structured.restaurants.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
            </div>
        </Card>
      )}
    </div>
  );
};

export default ItineraryPlanner;

// Helpers and small components
const COLORS = ["#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA"];

function buildCostData(days: number, budget: string) {
  // Rough per-day budget estimates by level
  const perDay = budget === "luxury" ? 400 : budget === "moderate" ? 120 : 50;
  const total = perDay * Math.max(1, days);
  // Category split
  const breakdown = [
    { name: "Accommodation", pct: 0.4 },
    { name: "Food", pct: 0.25 },
    { name: "Transport", pct: 0.2 },
    { name: "Activities", pct: 0.15 },
  ];
  return breakdown.map((b) => ({ name: b.name, value: Math.round(b.pct * total) }));
}

function parseDaysFromItinerary(text?: string) {
  if (!text) return [];
  // Try split by headers like "Day 1", "Day 2" or "Day 1:" etc.
  const parts = text.split(/(?=Day\s*\d+[:\-.]?)/i);
  if (parts.length <= 1) return [];
  return parts.map((p) => {
    const firstLine = p.split("\n")[0].trim();
    return { title: firstLine || "Day", content: p.replace(firstLine, "").trim() };
  });
}

function extractSection(text: string, re: RegExp) {
  const idx = text.search(re);
  if (idx === -1) return undefined;
  // return the paragraph containing that match
  const before = text.slice(0, idx);
  const after = text.slice(idx);
  const para = after.split("\n\n")[0];
  return para.trim();
}

function extractLines(text: string, re: RegExp) {
  return (text || "").split(/\n/).map((l) => l.trim()).filter((l) => re.test(l));
}

function DayAccordion({ index, title, content }: { index: number; title: string; content: string }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div>
          <h5 className="font-semibold text-lg md:text-xl">{title}</h5>
          <p className="text-sm md:text-base text-muted-foreground mt-1">{content.split('\n').slice(0,2).join(' ') }{content.split('\n').length>2?'...':''}</p>
        </div>
        <div>
          <Button variant="outline" size="sm" onClick={() => setOpen((s) => !s)}>
            {open ? "Collapse" : "Expand"}
          </Button>
        </div>
      </div>
      {open && (
        <div className="mt-4 text-sm md:text-base text-muted-foreground whitespace-pre-wrap">{content}</div>
      )}
    </div>
  );
}

function CategoryBadge({ label, colorIndex }: { label: string; colorIndex: number }) {
  const color = COLORS[colorIndex % COLORS.length];
  return (
    <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-sm font-medium" style={{ background: `${color}22`, color }}>
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span>{label}</span>
    </span>
  );
}
