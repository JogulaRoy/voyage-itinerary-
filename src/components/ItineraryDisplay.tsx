import { useState } from 'react';
import { MapPin, Clock, DollarSign, Download, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ItineraryData, Activity, DayPlan } from '@/lib/geminiService';

interface ItineraryDisplayProps {
  data: ItineraryData;
  from: string;
  to: string;
}

const destinationImages: Record<string, string> = {
  paris: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1200',
  tokyo: 'https://images.pexels.com/photos/2339009/pexels-photo-2339009.jpeg?auto=compress&cs=tinysrgb&w=1200',
  santorini: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'new york': 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1200',
  bali: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=1200',
  dubai: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=1200',
  london: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1200',
  rome: 'https://images.pexels.com/photos/2600286/pexels-photo-2600286.jpeg?auto=compress&cs=tinysrgb&w=1200',
  barcelona: 'https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1200',
  amsterdam: 'https://images.pexels.com/photos/1450082/pexels-photo-1450082.jpeg?auto=compress&cs=tinysrgb&w=1200',
  singapore: 'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=1200',
  thailand: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

export default function ItineraryDisplay({ data, from, to }: ItineraryDisplayProps) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [expandedActivities, setExpandedActivities] = useState<Set<number>>(new Set());

  const COLORS = ['hsl(250 60% 55% / 0.95)', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6'];

  const getDestinationImage = (location: string) => {
    const key = location.toLowerCase();
    return destinationImages[key] || 'https://images.pexels.com/photos/3408355/pexels-photo-3408355.jpeg?auto=compress&cs=tinysrgb&w=1200';
  };

  const budgetData = [
    { name: 'Accommodation', value: data.budgetBreakdown.accommodation },
    { name: 'Food', value: data.budgetBreakdown.food },
    { name: 'Activities', value: data.budgetBreakdown.activities },
    { name: 'Transport', value: data.budgetBreakdown.transport },
    { name: 'Miscellaneous', value: data.budgetBreakdown.miscellaneous },
  ];

  const toggleActivity = (index: number) => {
    const newExpanded = new Set(expandedActivities);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedActivities(newExpanded);
  };

  const currentDay = data.days[selectedDay - 1];
  const allLocations = currentDay?.activities
    .filter(a => a.coordinates)
    .map(a => ({
      ...a.coordinates!,
      title: a.title,
      location: a.location
    }));

  const handleDownload = () => {
    const content = `
VOYAGE - Your AI Travel Itinerary
${from} to ${to}

${data.summary}

Total Estimated Cost: $${data.totalEstimatedCost}

${data.days.map(day => `
DAY ${day.day} - ${day.date}
${'-'.repeat(50)}
${day.activities.map(act => `
${act.time} - ${act.title}
Location: ${act.location}
Duration: ${act.duration}
Cost: $${act.cost}
${act.description}
`).join('\n')}

Meals:
${day.meals.map(meal => `${meal.type}: ${meal.suggestion} at ${meal.location} ($${meal.estimatedCost})`).join('\n')}

Accommodation: ${day.accommodation}
Day Total: $${day.estimatedCost}
`).join('\n\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voyage-itinerary-${to.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${to} Itinerary`,
          text: `Check out my ${data.days.length}-day trip to ${to}! Total cost: $${data.totalEstimatedCost}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="w-full max-w-7xl">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="relative h-96 overflow-hidden">
          <img
            src={getDestinationImage(to)}
            alt={to}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
          <div className="absolute inset-0 flex items-end p-8">
            <div className="w-full flex justify-between items-end">
              <div className="text-white">
                <h2 className="text-5xl font-bold mb-3">
                  {from} → {to}
                </h2>
                <p className="text-lg max-w-2xl" style={{ color: 'hsl(250 60% 55% / 0.95)' }}>{data.summary}</p>
                <div className="mt-6 flex items-center space-x-8">
                  <div>
                    <div className="text-4xl font-bold">${data.totalEstimatedCost}</div>
                    <div className="text-sm" style={{ color: 'hsl(250 60% 55% / 0.95)' }}>Total Cost</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold">{data.days.length}</div>
                    <div className="text-sm" style={{ color: 'hsl(250 60% 55% / 0.95)' }}>Days</div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleShare}
                  className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all"
                  title="Share"
                >
                  <Share2 className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all"
                  title="Download"
                >
                  <Download className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Budget Breakdown</h3>
            <div className="bg-slate-50 rounded-2xl p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `$${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {budgetData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Day Selector</h3>
              <div className="space-y-2">
                {data.days.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${selectedDay === day.day ? 'text-white shadow-lg' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                    style={
                      selectedDay === day.day
                        ? { background: 'linear-gradient(90deg, hsl(250 60% 55% / 0.95), hsl(260 50% 40% / 0.95))' }
                        : undefined
                    }
                  >
                    <div className="font-semibold">Day {day.day}</div>
                    <div className="text-sm" style={selectedDay === day.day ? { color: 'hsl(250 60% 55% / 0.95)' } : undefined}>
                      {day.date}
                    </div>
                    <div className="text-sm mt-1" style={selectedDay === day.day ? { color: '#ffffff' } : undefined}>
                      ${day.estimatedCost}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              {currentDay && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-slate-800">
                      Day {currentDay.day} - {currentDay.date}
                    </h3>
                    <div className="text-lg font-semibold" style={{ color: 'hsl(250 60% 55% / 0.95)' }}>
                      ${currentDay.estimatedCost}
                    </div>
                  </div>

                  {allLocations && allLocations.length > 0 && (
                    <div className="mb-6">
                      <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-800">{allLocations[0].title || allLocations[0].location}</div>
                          <div className="text-sm text-slate-600">{allLocations[0].location}</div>
                        </div>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(allLocations[0].location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg text-white font-semibold"
                          style={{ backgroundColor: 'hsl(250 60% 55% / 0.95)' }}
                        >
                          Open in Google Maps
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-800">Activities</h4>
                    {currentDay.activities.map((activity, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                      >
                        <div
                          className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                          onClick={() => toggleActivity(idx)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="text-white px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: 'hsl(250 60% 55% / 0.95)' }}>
                                  {activity.time}
                                </span>
                                <h5 className="text-lg font-bold text-slate-800">{activity.title}</h5>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                <span className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" style={{ color: 'hsl(250 60% 55% / 0.95)' }} />
                                  {activity.location}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1 text-blue-600" />
                                  {activity.duration}
                                </span>
                                <span className="flex items-center">
                                  <DollarSign className="h-4 w-4 mr-1 text-teal-600" />
                                  ${activity.cost}
                                </span>
                              </div>
                            </div>
                            {expandedActivities.has(idx) ? (
                              <ChevronUp className="h-5 w-5 text-slate-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                        </div>
                        {expandedActivities.has(idx) && (
                          <div className="border-t bg-slate-50 p-4 space-y-4">
                            <p className="text-slate-700 leading-relaxed">{activity.description}</p>
                            <div className="space-y-3">
                              {activity.coordinates && (
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${activity.coordinates.lat},${activity.coordinates.lng}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-4 py-2 transition-colors rounded-lg font-semibold text-sm"
                                  style={{ backgroundColor: 'hsl(250 60% 95% / 0.12)', border: '1px solid hsl(250 60% 55% / 0.15)', color: 'hsl(250 60% 55% / 0.95)' }}
                                >
                                  <MapPin className="h-4 w-4 mr-1" style={{ color: 'hsl(250 60% 55% / 0.95)' }} />
                                  View on Google Maps
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-4">
                    <h4 className="text-lg font-bold text-slate-800">Meals</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {currentDay.meals.map((meal, idx) => (
                        <div key={idx} className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, hsl(250 60% 95% / 0.08), hsl(260 50% 92% / 0.06))' }}>
                          <div className="text-xs font-semibold uppercase mb-2" style={{ color: 'hsl(250 60% 55% / 0.95)' }}>
                            {meal.type}
                          </div>
                          <div className="font-semibold text-slate-800 mb-1">{meal.suggestion}</div>
                          <div className="text-sm text-slate-600 mb-2">{meal.location}</div>
                          <div className="text-sm font-bold" style={{ color: 'hsl(250 60% 55% / 0.95)' }}>${meal.estimatedCost}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-slate-800 mb-2">Accommodation</h4>
                    <p className="text-slate-700">{currentDay.accommodation}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
