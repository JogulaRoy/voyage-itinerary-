import { useState } from 'react';
import { MapPin, Calendar, DollarSign, Heart, Sparkles } from 'lucide-react';

interface PlannerFormProps {
  onGenerate: (data: FormData) => void;
  isGenerating: boolean;
}

export interface FormData {
  from: string;
  to: string;
  days: number;
  budget: string;
  interests: string[];
}

export default function PlannerForm({ onGenerate, isGenerating }: PlannerFormProps) {
  const [formData, setFormData] = useState<FormData>({
    from: '',
    to: '',
    days: 3,
    budget: 'moderate',
    interests: []
  });

  const interestOptions = [
    'Culture',
    'Adventure',
    'Food',
    'Nature',
    'Beach',
    'Shopping',
    'Nightlife',
    'Photography',
    'Art',
    'Sports'
  ];

  const budgetOptions = [
    { value: 'budget', label: 'Budget', desc: 'Economical travel' },
    { value: 'moderate', label: 'Moderate', desc: 'Balanced comfort' },
    { value: 'luxury', label: 'Luxury', desc: 'Premium experience' }
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.from && formData.to && formData.interests.length > 0) {
      onGenerate(formData);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, hsl(250 60% 55% / 0.95), hsl(260 50% 40% / 0.9))' }}>
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            AI Travel Planner
          </h2>
          <p className="text-slate-600">
            Tell us about your dream trip and let AI do the magic
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                From
              </label>
                <input
                type="text"
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                placeholder="e.g., New York"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none transition-colors focus-accent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                To
              </label>
                <input
                type="text"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                placeholder="e.g., Paris"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none transition-colors focus-accent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Number of Days
            </label>
            <input
              type="number"
              value={formData.days}
              onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
              min="1"
              max="30"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none transition-colors focus-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              <DollarSign className="inline h-4 w-4 mr-1" />
              Budget Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {budgetOptions.map((option) => (
                <label
                  key={option.value}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col ${
                    formData.budget === option.value
                      ? 'text-white shadow-lg'
                      : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 hover:shadow-md'
                  }`}
                  style={formData.budget === option.value ? { background: 'linear-gradient(90deg, hsl(250 60% 55% / 0.95), hsl(260 50% 40% / 0.9))', borderColor: 'hsl(250 60% 55% / 0.3)' } : undefined}
                >
                  <input
                    type="radio"
                    name="budget"
                    value={option.value}
                    checked={formData.budget === option.value}
                    onChange={() => setFormData({ ...formData, budget: option.value })}
                    className="sr-only"
                    aria-checked={formData.budget === option.value}
                  />
                  <div className="font-semibold">{option.label}</div>
                  <div className={`text-xs mt-1 ${formData.budget === option.value ? 'text-white/80' : 'text-slate-600'}`}>{option.desc}</div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              <Heart className="inline h-4 w-4 mr-1" />
              Your Interests (Select at least one)
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.interests.includes(interest)
                      ? 'text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  style={formData.interests.includes(interest) ? { background: 'linear-gradient(90deg, hsl(250 60% 55% / 0.95), hsl(260 50% 40% / 0.9))' } : undefined}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating || !formData.from || !formData.to || formData.interests.length === 0}
            className="w-full text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{ background: 'linear-gradient(90deg, hsl(250 60% 55% / 0.95), hsl(260 50% 40% / 0.9))' }}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating Your Perfect Itinerary...
              </span>
            ) : (
              'Generate Itinerary'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
