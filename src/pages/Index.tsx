import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleServiceClick = (service: string) => {
    if (service === "ai-itinerary") {
      navigate("/planner");
    } else if (service === "bookings") {
      window.open("https://www.booking.com", "_blank");
    } else if (service === "live-weather") {
      navigate("/weather");
    } else if (service === "share") {
      const url = window.location.href;
      const text = `Check out my travel plan: ${url}`;
      if ((navigator as any).share) {
        (navigator as any).share({ title: "Voyage Travel Plan", text, url });
      } else {
        navigator.clipboard.writeText(url);
        toast({ title: "Link copied", description: "URL copied to clipboard" });
      }
    }
  };

  return (
    <div className="voyage-container">
      {/* Header */}
      <header className="voyage-header">
        <div className="logo">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: "900", letterSpacing: "2px" }}>Voyage</h1>
        </div>
        <nav className="voyage-nav">
          <ul>
            <li>
              <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}>
                Home
              </a>
            </li>
            <li>
              <a href="#destination" onClick={(e) => { e.preventDefault(); scrollToSection("destination"); }}>
                Destination
              </a>
            </li>
            <li>
              <a href="#service" onClick={(e) => { e.preventDefault(); scrollToSection("service"); }}>
                Service
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection("about"); }}>
                About Us
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="main" id="home" ref={heroRef}>
        <video autoPlay muted loop>
          <source src="/bgvid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="main-content">
          <h1>Plan Less, Travel More — AI Does the Hard Work</h1>
          <p>
            <b>
              Fast, personalized itineraries and destination insights powered by AI.
              <br />
              "Travel smarter, not harder — let AI handle the planning so you can enjoy the journey."
            </b>
          </p>
          <a href="#service" className="btn" onClick={(e) => { e.preventDefault(); scrollToSection("service"); }}>
            Explore Services
          </a>
        </div>
      </section>

      {/* Famous Destinations Section */}
      <section className="services" id="destination" style={{ backgroundColor: "white", backgroundImage: "url('pic12.jpeg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
        <h2 style={{ textAlign: "center", color: "white", paddingTop: "40px", fontWeight: "bold", fontSize: "2.5rem", fontFamily: "'Great Vibes', 'Cursive', cursive", fontStyle: "italic" }}>Famous Destinations</h2>
        
        {/* Top 4 Destinations */}
        <div className="destination-grid" style={{ paddingBottom: "20px" }}>
          <div className="destination-card" onClick={() => navigate("/destination/Greece")} style={{ cursor: "pointer" }}>
            <img src="/src/assets/destinations/greece.jpg" alt="Greece" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px 10px 0 0" }} />
            <h3 style={{ padding: "15px", textAlign: "center", margin: 0 }}>Greece</h3>
          </div>
          <div className="destination-card" onClick={() => navigate("/destination/Japan")} style={{ cursor: "pointer" }}>
            <img src="/src/assets/destinations/japan.jpg" alt="Japan" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px 10px 0 0" }} />
            <h3 style={{ padding: "15px", textAlign: "center", margin: 0 }}>Japan</h3>
          </div>
          <div className="destination-card" onClick={() => navigate("/destination/Rome")} style={{ cursor: "pointer" }}>
            <img src="/src/assets/destinations/rome.jpg" alt="Rome" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px 10px 0 0" }} />
            <h3 style={{ padding: "15px", textAlign: "center", margin: 0 }}>Rome</h3>
          </div>
          <div className="destination-card" onClick={() => navigate("/destination/Morocco")} style={{ cursor: "pointer" }}>
            <img src="/src/assets/destinations/morocco.jpg" alt="Morocco" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px 10px 0 0" }} />
            <h3 style={{ padding: "15px", textAlign: "center", margin: 0 }}>Morocco</h3>
          </div>
        </div>

        {/* Bottom 4 Destinations */}
        <div className="destination-grid" style={{ paddingBottom: "40px" }}>
          <div className="destination-card" onClick={() => navigate("/destination/Vietnam")} style={{ cursor: "pointer" }}>
            <img src="/src/assets/destinations/vietnam.jpg" alt="Vietnam" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px 10px 0 0" }} />
            <h3 style={{ padding: "15px", textAlign: "center", margin: 0 }}>Vietnam</h3>
          </div>
          <div className="destination-card" onClick={() => navigate("/destination/Phuket")} style={{ cursor: "pointer" }}>
            <img src="/src/assets/destinations/phuket.jpg" alt="Phuket" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px 10px 0 0" }} />
            <h3 style={{ padding: "15px", textAlign: "center", margin: 0 }}>Phuket</h3>
          </div>
          <div className="destination-card" onClick={() => navigate("/destination/Barcelona")} style={{ cursor: "pointer" }}>
            <img src="/src/assets/destinations/barcelona.jpg" alt="Barcelona" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px 10px 0 0" }} />
            <h3 style={{ padding: "15px", textAlign: "center", margin: 0 }}>Barcelona</h3>
          </div>
          <div className="destination-card" onClick={() => navigate("/destination/Sri%20Lanka")} style={{ cursor: "pointer" }}>
            <img src="/src/assets/destinations/sri-lanka.jpg" alt="Sri Lanka" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px 10px 0 0" }} />
            <h3 style={{ padding: "15px", textAlign: "center", margin: 0 }}>Sri Lanka</h3>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="service" style={{ paddingTop: "40px", paddingBottom: "40px", backgroundImage: "url('pic18.jpeg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
        <h2 style={{ textAlign: "center", fontWeight: "bold", fontSize: "2.5rem", fontFamily: "'Great Vibes', 'Cursive', cursive", fontStyle: "italic" }}>Our Services</h2>
        <div className="service-cards">
          <div className="card" onClick={() => handleServiceClick("ai-itinerary")}>
            <div className="card-icon">
              <i className="icon-ai">📋</i>
            </div>
            <h3>AI Itinerary</h3>
            <p>Generate personalized day-by-day itineraries tailored to your interests and budget</p>
            <button className="btn">Explore</button>
          </div>

          <div className="card" onClick={() => handleServiceClick("bookings")}>
            <div className="card-icon">
              <i className="icon-booking">✈️</i>
            </div>
            <h3>Bookings</h3>
            <p>Book flights and hotels through our trusted booking partners</p>
            <button className="btn">Book Now</button>
          </div>

          <div className="card" onClick={() => handleServiceClick("live-weather")}>
            <div className="card-icon">
              <i className="icon-weather">⛅</i>
            </div>
            <h3>Live Weather</h3>
            <p>Check real-time weather forecasts for your destination</p>
            <button className="btn">Check Weather</button>
          </div>

          <div className="card" onClick={() => handleServiceClick("share")}>
            <div className="card-icon">
              <i className="icon-share">📤</i>
            </div>
            <h3>Share Your Itinerary</h3>
            <p>Share your travel plans with friends and family easily</p>
            <button className="btn">Share</button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about" style={{ paddingTop: "40px", paddingBottom: "40px", backgroundImage: "url('pic17.jpeg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
        <div className="about-content">
          <h2 style={{ fontSize: "2.5rem", marginBottom: "30px", textShadow: "2px 2px 4px rgba(0,0,0,0.2)", fontFamily: "'Great Vibes', 'Cursive', cursive", fontStyle: "italic" }}>About Voyage</h2>
          <p style={{ fontSize: "1.2rem", lineHeight: "1.8", marginBottom: "25px", maxWidth: "700px", margin: "0 auto 25px" }}>
            We are an AI-driven itinerary planner built to simplify travel planning. Our mission is to empower travelers to explore the world with confidence and ease.
            <br />
            <br />
            Our platform creates personalized travel plans based on your unique interests, budget, and schedule. Whether you're seeking adventure, culture, relaxation, or adventure sports, Voyage adapts to your preferences.
            <br />
            <br />
            No more endless research or confusing travel guides. Just smart, efficient, and flexible travel planning powered by artificial intelligence.
            <br />
            <br />
            Designed to help you explore the world with ease, Voyage brings together the best of modern technology and travel expertise.
          </p>
          
          {/* Features Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginTop: "40px" }}>
            <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "20px", borderRadius: "10px", textAlign: "center", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🤖</div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px", color: "white" }}>AI Powered</h3>
              <p style={{ fontSize: "0.9rem", color: "#e0e0e0" }}>Smart algorithms create perfect itineraries for you</p>
            </div>
            <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "20px", borderRadius: "10px", textAlign: "center", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>⚡</div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px", color: "white" }}>Fast & Easy</h3>
              <p style={{ fontSize: "0.9rem", color: "#e0e0e0" }}>Plan your trip in minutes, not hours</p>
            </div>
            <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "20px", borderRadius: "10px", textAlign: "center", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🌍</div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px", color: "white" }}>Global Coverage</h3>
              <p style={{ fontSize: "0.9rem", color: "#e0e0e0" }}>Explore thousands of destinations worldwide</p>
            </div>
            <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "20px", borderRadius: "10px", textAlign: "center", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>💰</div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px", color: "white" }}>Budget Friendly</h3>
              <p style={{ fontSize: "0.9rem", color: "#e0e0e0" }}>Plans tailored to any budget level</p>
            </div>
          </div>

          <div style={{ marginTop: "40px" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "20px", color: "white" }}>Why Choose Voyage?</h3>
            <ul style={{ textAlign: "left", maxWidth: "600px", margin: "0 auto", fontSize: "1rem", lineHeight: "2", color: "#e0e0e0" }}>
              <li>✓ Personalized recommendations based on your preferences</li>
              <li>✓ Real-time weather and travel updates</li>
              <li>✓ Integration with booking platforms</li>
              <li>✓ Share plans with friends and family easily</li>
              <li>✓ 24/7 travel support and tips</li>
              <li>✓ Offline access to your itineraries</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="voyage-footer" style={{ paddingTop: "40px", paddingBottom: "20px" }}>
        <div className="footer-content">
          <div className="footer-logo">
            <h2>Voyage</h2>
            <p>Plan Easy - Save Time</p>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}>
                  Home
                </a>
              </li>
              <li>
                <a href="#destination" onClick={(e) => { e.preventDefault(); scrollToSection("destination"); }}>
                  Destination
                </a>
              </li>
              <li>
                <a href="#service" onClick={(e) => { e.preventDefault(); scrollToSection("service"); }}>
                  Service
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection("about"); }}>
                  About Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
