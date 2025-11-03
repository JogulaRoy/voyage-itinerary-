import React, { useState } from "react";

// Simple Weather page converted from provided HTML/JS
const Weather: React.FC = () => {
  // NOTE: API key added as requested. Be careful committing keys to public repos.
  const apiKey = "2a1618bff971de8745734b60b1a00693";

  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkWeather = async () => {
    const q = city.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&units=metric&appid=${apiKey}`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (res.status === 404 || data.cod === "404") {
        setError("City not found");
        return;
      }

      const mapped = {
        name: data.name,
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        wind: data.wind.speed,
        condition: data.weather?.[0]?.main || "",
      };
      setWeather(mapped);
    } catch (err: any) {
      setError("Failed to fetch weather data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIconFor = (condition: string) => {
    switch (condition) {
      case "Clouds":
        return "/images/clouds.png";
      case "Clear":
        return "/images/clear.png";
      case "Rain":
        return "/images/rain.png";
      case "Drizzle":
        return "/images/drizzle.png";
      case "Mist":
        return "/images/mist.png";
      default:
        return "/images/clouds.png";
    }
  };

  // Inline styles translated from the provided HTML/CSS
    const pageStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
    fontFamily: "Poppins, sans-serif",
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 80,
    color: "white",
    backgroundImage: "url('/pic7.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 500,
    background: "rgba(255,255,255,0.05)",
    padding: "40px 35px",
    borderRadius: 20,
    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
    textAlign: "center",
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={{ textAlign: "center", marginBottom: 20 }}>Weather Forecast</h1>

        <div style={{ display: "flex", gap: 10, marginBottom: 30 }}>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkWeather()}
            placeholder="Enter City Name"
            spellCheck={false}
            style={{
              flex: 1,
              padding: "10px 25px",
              height: 60,
              borderRadius: 30,
              border: "none",
              outline: "none",
              background: "#ebfffc",
              color: "#333",
              fontSize: 18,
            }}
          />
          <button
            onClick={checkWeather}
            style={{
              padding: "10px 20px",
              height: 60,
              borderRadius: 30,
              border: "none",
              outline: "none",
              background: "#ebfffc",
              color: "#333",
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {loading ? "..." : "Search"}
          </button>
        </div>

        {error && <div style={{ color: "#ffb4b4", marginBottom: 12 }}>{error}</div>}

        {weather && (
          <div style={{ marginTop: 20 }}>
            <img src={getIconFor(weather.condition)} alt="weather icon" style={{ width: 170, marginTop: 10 }} />
            <h1 style={{ fontSize: 60, fontWeight: 500, margin: "10px 0" }}>{weather.temp}°C</h1>
            <h2 style={{ fontSize: 35, fontWeight: 400, marginTop: -10 }}>{weather.name}</h2>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30, padding: "0 10px" }}>
              <div style={{ display: "flex", alignItems: "center", textAlign: "left" }}>
                <img src="/images/humidity.png" alt="humidity icon" style={{ width: 40, marginRight: 10 }} />
                <div>
                  <p style={{ fontSize: 20, marginTop: -6 }}>{weather.humidity}%</p>
                  <p>Humidity</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", textAlign: "left" }}>
                <img src="/images/wind.png" alt="wind icon" style={{ width: 40, marginRight: 10 }} />
                <div>
                  <p style={{ fontSize: 20, marginTop: -6 }}>{weather.wind} km/h</p>
                  <p>Wind Speed</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
