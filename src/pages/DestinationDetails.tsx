import React from "react";
import { useParams } from "react-router-dom";
import { DESTINATION_INFO } from "@/lib/destinationInfo";

const DestinationDetails: React.FC = () => {
  const { name } = useParams();
  const destName = name ? decodeURIComponent(name) : undefined;
  const destInfo = destName ? DESTINATION_INFO[destName] : null;

  if (!destName || !destInfo) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h1>Destination not found</h1>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Hero Section with Image */}
      <div style={{ position: "relative", height: "400px", overflow: "hidden" }}>
        <img
          src={destInfo.image}
          alt={destInfo.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.7)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "white",
            zIndex: 10,
          }}
        >
          <h1 style={{ fontSize: "3.5rem", fontWeight: "700", margin: 0, textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}>
            {destInfo.name}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 20px" }}>
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "15px",
            padding: "40px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ lineHeight: "1.8", color: "#333", fontSize: "16px" }}>
            {destInfo.description.split("\n").map((paragraph, index) => (
              <p
                key={index}
                style={{
                  marginBottom: "20px",
                  textAlign: "justify",
                  fontSize: index === 0 ? "18px" : "16px",
                  fontWeight: index === 0 ? "500" : "normal",
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Decorative Elements */}
          <div style={{ marginTop: "40px", paddingTop: "40px", borderTop: "2px solid #55bd58" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "20px" }}>
              <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f0f9f4", borderRadius: "10px" }}>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#55bd58" }}>✈️</div>
                <p style={{ fontSize: "14px", marginTop: "10px", color: "#666" }}>Best Time to Visit</p>
              </div>
              <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f0f9f4", borderRadius: "10px" }}>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#55bd58" }}>🍜</div>
                <p style={{ fontSize: "14px", marginTop: "10px", color: "#666" }}>Local Cuisine</p>
              </div>
              <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f0f9f4", borderRadius: "10px" }}>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#55bd58" }}>🏛️</div>
                <p style={{ fontSize: "14px", marginTop: "10px", color: "#666" }}>Cultural Heritage</p>
              </div>
              <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f0f9f4", borderRadius: "10px" }}>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#55bd58" }}>🌍</div>
                <p style={{ fontSize: "14px", marginTop: "10px", color: "#666" }}>Natural Beauty</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <button
              onClick={() => window.history.back()}
              style={{
                backgroundColor: "#331a4b",
                color: "white",
                border: "none",
                padding: "15px 40px",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "30px",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(85, 189, 88, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = "#388E3C";
                (e.target as HTMLButtonElement).style.transform = "translateY(-3px)";
              }}
              onMouseOut={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = "#55bd58";
                (e.target as HTMLButtonElement).style.transform = "translateY(0)";
              }}
            >
              ← Back to Destinations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
