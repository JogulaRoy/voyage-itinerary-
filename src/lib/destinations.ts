// Centralized destination data (images + coordinates)
import japanImg from "@/assets/destinations/japan.jpg";
import romeImg from "@/assets/destinations/rome.jpg";
import moroccoImg from "@/assets/destinations/morocco.jpg";
import vietnamImg from "@/assets/destinations/vietnam.jpg";
import phuketImg from "@/assets/destinations/phuket.jpg";
import sriLankaImg from "@/assets/destinations/sri-lanka.jpg";
import barcelonaImg from "@/assets/destinations/barcelona.jpg";
import greeceImg from "@/assets/destinations/greece.jpg";

export interface Destination {
  name: string;
  image: string;
  lat?: number;
  lon?: number;
}

export const DESTINATIONS: Destination[] = [
  { name: "Greece", image: greeceImg, lat: 37.9838, lon: 23.7275 },
  { name: "Santorini", image: "/placeholder.svg", lat: 36.3932, lon: 25.4615 },
  { name: "Japan", image: japanImg, lat: 35.6762, lon: 139.6503 },
  { name: "Tokyo", image: "/placeholder.svg", lat: 35.6762, lon: 139.6503 },
  { name: "Osaka", image: "/placeholder.svg", lat: 34.6937, lon: 135.5023 },
  { name: "Rome", image: romeImg, lat: 41.9028, lon: 12.4964 },
  { name: "Morocco", image: moroccoImg, lat: 31.7917, lon: -7.0926 },
  { name: "Marrakesh", image: "/placeholder.svg", lat: 31.6295, lon: -7.9811 },
  { name: "Vietnam", image: vietnamImg, lat: 21.0278, lon: 105.8342 },
  { name: "Hanoi", image: "/placeholder.svg", lat: 21.0278, lon: 105.8342 },
  { name: "Ho Chi Minh City", image: "/placeholder.svg", lat: 10.8231, lon: 106.6297 },
  { name: "Phuket", image: phuketImg, lat: 7.8804, lon: 98.3923 },
  { name: "Bangkok", image: "/placeholder.svg", lat: 13.7563, lon: 100.5018 },
  { name: "Sri Lanka", image: sriLankaImg, lat: 7.8731, lon: 80.7718 },
  { name: "Colombo", image: "/placeholder.svg", lat: 6.9271, lon: 79.8612 },
  { name: "Barcelona", image: barcelonaImg, lat: 41.3851, lon: 2.1734 },
  { name: "Paris", image: "/placeholder.svg", lat: 48.8566, lon: 2.3522 },
  { name: "London", image: "/placeholder.svg", lat: 51.5074, lon: -0.1278 },
  { name: "New York", image: "/placeholder.svg", lat: 40.7128, lon: -74.006 },
  { name: "Los Angeles", image: "/placeholder.svg", lat: 34.0522, lon: -118.2437 },
  { name: "San Francisco", image: "/placeholder.svg", lat: 37.7749, lon: -122.4194 },
  { name: "Sydney", image: "/placeholder.svg", lat: -33.8688, lon: 151.2093 },
  { name: "Melbourne", image: "/placeholder.svg", lat: -37.8136, lon: 144.9631 },
  { name: "Singapore", image: "/placeholder.svg", lat: 1.3521, lon: 103.8198 },
  { name: "Dubai", image: "/placeholder.svg", lat: 25.2048, lon: 55.2708 },
  { name: "Istanbul", image: "/placeholder.svg", lat: 41.0082, lon: 28.9784 },
  { name: "Cairo", image: "/placeholder.svg", lat: 30.0444, lon: 31.2357 },
  { name: "Nairobi", image: "/placeholder.svg", lat: -1.2921, lon: 36.8219 },
  { name: "Cape Town", image: "/placeholder.svg", lat: -33.9249, lon: 18.4241 },
  { name: "Buenos Aires", image: "/placeholder.svg", lat: -34.6037, lon: -58.3816 },
  { name: "Rio de Janeiro", image: "/placeholder.svg", lat: -22.9068, lon: -43.1729 },
  { name: "Lisbon", image: "/placeholder.svg", lat: 38.7223, lon: -9.1393 },
  { name: "Amsterdam", image: "/placeholder.svg", lat: 52.3676, lon: 4.9041 },
  { name: "Berlin", image: "/placeholder.svg", lat: 52.52, lon: 13.405 },
  { name: "Prague", image: "/placeholder.svg", lat: 50.0755, lon: 14.4378 },
  { name: "Vienna", image: "/placeholder.svg", lat: 48.2082, lon: 16.3738 },
  { name: "Budapest", image: "/placeholder.svg", lat: 47.4979, lon: 19.04 },
  { name: "Krakow", image: "/placeholder.svg", lat: 50.0647, lon: 19.945 },
  { name: "Stockholm", image: "/placeholder.svg", lat: 59.3293, lon: 18.0686 },
  { name: "Oslo", image: "/placeholder.svg", lat: 59.9139, lon: 10.7522 },
  { name: "Helsinki", image: "/placeholder.svg", lat: 60.1699, lon: 24.9384 },
  { name: "Copenhagen", image: "/placeholder.svg", lat: 55.6761, lon: 12.5683 },
  { name: "Reykjavik", image: "/placeholder.svg", lat: 64.1466, lon: -21.9426 },
  { name: "Montreal", image: "/placeholder.svg", lat: 45.5017, lon: -73.5673 },
  { name: "Toronto", image: "/placeholder.svg", lat: 43.6532, lon: -79.3832 },
  { name: "Vancouver", image: "/placeholder.svg", lat: 49.2827, lon: -123.1207 },
  { name: "Mexico City", image: "/placeholder.svg", lat: 19.4326, lon: -99.1332 },
  { name: "Cancun", image: "/placeholder.svg", lat: 21.1619, lon: -86.8515 },
  { name: "Tulum", image: "/placeholder.svg", lat: 20.211, lon: -87.4654 },
  { name: "Havana", image: "/placeholder.svg", lat: 23.1136, lon: -82.3666 },
  { name: "Lima", image: "/placeholder.svg", lat: -12.0464, lon: -77.0428 },
  { name: "Santiago", image: "/placeholder.svg", lat: -33.4489, lon: -70.6693 },
  { name: "Quito", image: "/placeholder.svg", lat: -0.1807, lon: -78.4678 },
  { name: "Bogota", image: "/placeholder.svg", lat: 4.711, lon: -74.0721 },
  { name: "Kuala Lumpur", image: "/placeholder.svg", lat: 3.139, lon: 101.6869 },
  { name: "Seoul", image: "/placeholder.svg", lat: 37.5665, lon: 126.978 },
  { name: "Hong Kong", image: "/placeholder.svg", lat: 22.3193, lon: 114.1694 },
  { name: "Taipei", image: "/placeholder.svg", lat: 25.033, lon: 121.5654 },
  { name: "Shanghai", image: "/placeholder.svg", lat: 31.2304, lon: 121.4737 },
  { name: "Beijing", image: "/placeholder.svg", lat: 39.9042, lon: 116.4074 },
  { name: "Delhi", image: "/placeholder.svg", lat: 28.7041, lon: 77.1025 },
  { name: "Mumbai", image: "/placeholder.svg", lat: 19.076, lon: 72.8777 },
  { name: "Goa", image: "/placeholder.svg", lat: 15.2993, lon: 73.9496 },
  { name: "Agra", image: "/placeholder.svg", lat: 27.1767, lon: 78.0081 },
  { name: "Jaipur", image: "/placeholder.svg", lat: 26.9124, lon: 75.7873 },
  { name: "Kathmandu", image: "/placeholder.svg", lat: 27.7172, lon: 85.324 },
  { name: "Zurich", image: "/placeholder.svg", lat: 47.3769, lon: 8.5417 },
  { name: "Geneva", image: "/placeholder.svg", lat: 46.2044, lon: 6.1432 },
  { name: "Maldives", image: "/placeholder.svg", lat: 4.1755, lon: 73.5093 },
  { name: "Bora Bora", image: "/placeholder.svg", lat: -16.5004, lon: -151.7415 },
  { name: "Seychelles", image: "/placeholder.svg", lat: -4.6195, lon: 55.4513 },
  { name: "Auckland", image: "/placeholder.svg", lat: -36.8485, lon: 174.7633 },
];

export const findDestination = (name?: string) =>
  DESTINATIONS.find((d) => d.name.toLowerCase() === (name || "").toLowerCase());
