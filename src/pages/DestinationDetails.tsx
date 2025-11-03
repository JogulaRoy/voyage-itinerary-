import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { DESTINATIONS, findDestination } from "@/lib/destinations";

const DestinationDetails: React.FC = () => {
  const { name } = useParams();
  const destName = name ? decodeURIComponent(name) : undefined;
  const dest = findDestination(destName);

  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!destName) return;
      setLoading(true);
      try {
        // Use Wikipedia REST API to get top extracts for the destination
        const search = encodeURIComponent(destName);
        const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro&explaintext&titles=${search}`;
        const res = await fetch(url);
        const json = await res.json();
        const pages = json.query?.pages || {};
        const entries = Object.values(pages).map((p: any) => ({ title: p.title, extract: p.extract }));
        // For 'famous places', do a second search using 'destName attractions' and take top results
        const attractionsUrl = `https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(destName + ' attractions')}&limit=5`;
        const aRes = await fetch(attractionsUrl);
        const aJson = await aRes.json();
        const titles = (aJson?.pages || []).map((p: any) => p.title).slice(0, 5);
        const attractionDetails = await Promise.all(titles.map(async (t: string) => {
          const aUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`;
          const r = await fetch(aUrl);
          return r.json();
        }));
        setPlaces(attractionDetails.filter(Boolean));
      } catch (err: any) {
        setError(err?.message || "Failed to fetch details");
      } finally {
        setLoading(false);
      }
    })();
  }, [destName]);

  if (!destName) return <div className="p-6">No destination specified.</div>;

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4">
          <img src={dest?.image} alt={destName} className="w-24 h-24 object-cover rounded-lg" />
          <div>
            <h1 className="text-3xl font-bold">{destName}</h1>
            <p className="text-sm text-muted-foreground">Famous places and short summaries (from Wikipedia)</p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {loading && <div>Loading famous places...</div>}
        {error && <div className="text-red-600">Error: {error}</div>}
        {places.map((p: any, i: number) => (
          <Card key={i} className="p-4">
            <h3 className="text-xl font-semibold">{p.title}</h3>
            <p className="text-sm text-muted-foreground">{p.extract || p.description || 'No summary available'}</p>
            {p.thumbnail && <img src={p.thumbnail.source} alt={p.title} className="w-full max-w-xs mt-2 rounded" />}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DestinationDetails;
