import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import DestinationCard from "@/components/DestinationCard";
import ServiceCard from "@/components/ServiceCard";
import ItineraryPlanner from "@/components/ItineraryPlanner";
import { Sparkles, Clock, Cloud, MapPin, Share2, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DESTINATIONS } from "@/lib/destinations";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Index = () => {
  const [selectedDest, setSelectedDest] = useState<string | null>(null);
  const plannerRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const services = [
    { icon: Calendar, title: "AI Itinerary", color: "hsl(170, 70%, 50%)", description: "Generate a day-by-day plan tailored to your interests, budget, and travel dates." },
    { icon: Cloud, title: "Live Weather", color: "hsl(200, 80%, 55%)", description: "See up-to-date weather forecasts for your destination so you can pack and plan with confidence." },
    { icon: MapPin, title: "Navigate", color: "hsl(40, 90%, 55%)", description: "Quickly open maps for directions and local transit options to get around easily." },
    { icon: Share2, title: "Share Plans", color: "hsl(340, 75%, 60%)", description: "Share your itinerary with friends via link, social apps, or copy-to-clipboard." },
  ];

  const { toast } = useToast();

  const onServiceClick = async (title: string) => {
    if (title === "AI Itinerary") {
      // navigate to planner page
      navigate('/planner');
      return;
    }

    if (title === "Live Weather") {
      // open weather page for selected destination or default to first
      const dest = selectedDest || DESTINATIONS[0]?.name;
      navigate(`/weather?dest=${encodeURIComponent(dest || "")}`);
      return;
    }

    if (title === "Navigate") {
      // open Google Maps root (could open destination-specific maps)
      window.open("https://www.google.com/maps", "_blank");
      return;
    }

    if (title === "Share Plans") {
      // robust share flow:
      const url = window.location.href;
      const shareTitle = selectedDest ? `My travel plan — ${selectedDest}` : document.title || 'Travel plan';
      const shareText = selectedDest ? `Check out my plan for ${selectedDest}: ${url}` : `Check out my travel plan: ${url}`;

      const tryClipboard = async () => {
        try {
          await navigator.clipboard.writeText(url);
          toast({ title: 'Link copied', description: 'URL copied to clipboard' });
          return true;
        } catch (e) {
          return false;
        }
      };

      // 1) Web Share API
      if ((navigator as any).share) {
        try {
          await (navigator as any).share({ title: shareTitle, text: shareText, url });
          toast({ title: 'Shared', description: 'Thanks for sharing!' });
          return;
        } catch (e) {
          // user dismissed or failed - fallthrough to clipboard
        }
      }

      // 2) Clipboard
      const copied = await tryClipboard();
      if (copied) return;

      // 3) Open fallback share links (WhatsApp / Telegram / Mail)
      const wa = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      const tg = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;
      const mailto = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText)}`;

      // Open a small window with WhatsApp (works on desktop/mobile)
      try {
        window.open(wa, '_blank');
        toast({ title: 'Share', description: 'Opened share options (WhatsApp). If that failed, try the copy link option.' });
      } catch (e) {
        // last resort: open mailto
        try { window.open(mailto, '_blank'); } catch { /* swallow */ }
        toast({ title: 'Could not open share', description: 'Please copy the link manually.' });
      }
      return;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      {/* Header with shortcuts */}
      <header className="container mx-auto px-4 py-6 sticky-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Voyage</h1>
          </div>
          <nav className="flex items-center gap-4">
            <button className="text-sm" onClick={() => heroRef.current?.scrollIntoView({ behavior: 'smooth' })}>Home</button>
            <button className="text-sm" onClick={() => document.getElementById('famous')?.scrollIntoView({ behavior: 'smooth' })}>Destination Places</button>
            <button className="text-sm" onClick={() => document.getElementById('our-services')?.scrollIntoView({ behavior: 'smooth' })}>Services</button>
            <button className="text-sm" onClick={() => plannerRef.current?.scrollIntoView({ behavior: 'smooth' })}> AI Planner</button>
            <button className="text-sm" onClick={() => document.getElementById('feedback')?.scrollIntoView({ behavior: 'smooth' })}>Feedback</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
  {/* 1. Hero Section (full div) */}
  <section id="home" ref={heroRef} className="mb-16 hero-full section-bg" style={{ backgroundImage: "url('/pic1.jpg')" }}>
          <div className="section-content max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-6" style={{ color: 'rgba(255,255,255,0.97)' }}>Plan Less, Travel More — AI Does the Hard Work</h1>
            <p className="text-xl mb-4" style={{ color: 'rgba(255,255,255,0.9)' }}>Fast, personalized itineraries and destination insights powered by AI.</p>
            <blockquote className="italic text-lg" style={{ color: 'rgba(255,255,255,0.88)' }}>"Travel smarter, not harder — let AI handle the planning so you can enjoy the journey."</blockquote>
          </div>
        </section>

  {/* 2. Trending Destinations */}
  <section id="famous" className="mb-16 section-bg" style={{ backgroundImage: "url('/pic2.jpg')" }}>
          <div className="section-content">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <span className="text-white text-2xl">✈️</span>
                    <h2 className="text-2xl font-semibold" style={{ color: 'rgba(255,255,255,0.95)' }}>Famous Destination Places</h2>
                  </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {DESTINATIONS.map((destination, index) => (
        <div key={index} onClick={() => { setSelectedDest(destination.name); navigate(`/destination/${encodeURIComponent(destination.name)}`); }}>
          <DestinationCard
            name={destination.name}
            image={destination.image}
            selected={selectedDest === destination.name}
          />
        </div>
      ))}
    </div>
    </div>
        </section>
    

  {/* 3. Our Services (new section, icons larger, no Open links) */}
  <section id="our-services" className="mb-16 section-bg" style={{ backgroundImage: "url('/pic3.jpg')" }}>
    <div className="section-content">
      <div className="flex items-center justify-center gap-2 mb-8">
        <h2 className="text-2xl font-semibold" style={{ color: 'rgba(255,255,255,0.95)' }}>Our Services</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {services.map((service, index) => (
        <div key={index} className="p-2 flex justify-center">
          <ServiceCard icon={service.icon} title={service.title} color={service.color} size="lg" iconSmall={true} description={service.description} onClick={() => onServiceClick(service.title)} />
        </div>
      ))}
    </div>
    </div>
  </section>

  {/* About & Feedback will be placed below the planner for better flow */}

  {/* AI Itinerary Planner moved to its own page */}
  {/* About Us (moved from planner) */}
  <section id="about-us" className="mb-8">
    <div className="max-w-3xl mx-auto section-content">
      <h2 className="text-2xl font-semibold mb-3">About Us</h2>
      <p>Voyage builds tools to help travelers plan faster and smarter. Our AI-driven planner combines public knowledge and your preferences to deliver practical, day-by-day itineraries.</p>
    </div>
  </section>

  {/* Feedback (moved below planner) */}
  <section id="feedback" className="mb-16 section-bg" style={{ backgroundImage: "url('/pic5.jpg')" }}>
    <div className="section-content max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>Feedback</h2>
      <div className="contact-form bg-white/80 p-6 rounded-lg shadow">
        <form onSubmit={(e) => {
          e.preventDefault();
          toast({ title: 'Feedback sent', description: 'Thanks — we appreciate your feedback.' });
        }}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input type="email" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <Textarea rows={5} required />
            </div>
            <div>
              <Button type="submit">Send Feedback</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>

  {/* Footer */}
  <footer className="mt-12 section-bg" style={{ backgroundImage: "url('/pic6.jpg')" }}>
    <div className="section-content footer-content flex flex-col md:flex-row justify-between items-start gap-6 p-6 bg-card/60 rounded-lg">
      <div className="footer-logo">
        <h2 className="text-xl font-bold">Voyage</h2>
        <p>Empowering travelers with technology</p>
      </div>
      <div className="footer-links">
        <h3 className="font-semibold">Quick Links</h3>
        <ul className="mt-2">
          <li><a className="text-sm" href="#home">Home</a></li>
          <li><a className="text-sm" href="#famous">Destination Places</a></li>
          <li><a className="text-sm" href="#our-services">Our Services</a></li>
          <li><a className="text-sm" href="#planner">AI Planner</a></li>
        </ul>
      </div>
    </div>
  </footer>

    </main>
  </div>
  );
};

export default Index;
