// 🔑 Replace with your OpenWeatherMap API key
// Get free key at: https://openweathermap.org/api
const API_KEY = "db8a37ecc3c902d8c1d5ae1205434402";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

export async function fetchWeatherByCity(city) {
  const res = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) {
    if (res.status === 404) throw new Error(`"${city}" not found. Check the spelling.`);
    if (res.status === 401) throw new Error("Invalid API key. Please check your config.");
    throw new Error("Failed to fetch weather. Please try again.");
  }
  return res.json();
}

export async function fetchWeatherByCoords(lat, lon) {
  const res = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("Failed to fetch location weather.");
  return res.json();
}

export async function fetchForecastByCity(city) {
  const res = await fetch(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("Failed to fetch forecast.");
  return res.json();
}

export async function fetchForecastByCoords(lat, lon) {
  const res = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("Failed to fetch forecast.");
  return res.json();
}

// Groups forecast list by day → { "Mon May 12": [...slots], ... }
export function groupForecastByDay(list) {
  return list.reduce((acc, slot) => {
    const date = new Date(slot.dt * 1000);
    const key = date.toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric",
    });
    if (!acc[key]) acc[key] = [];
    acc[key].push(slot);
    return acc;
  }, {});
}

export async function fetchCitySuggestions(query) {
  if (!query || query.trim().length < 2) return [];
  const res = await fetch(
    `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  // Deduplicate by city+country
  const seen = new Set();
  return data.filter((city) => {
    const key = `${city.name}-${city.country}-${city.state || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getWeatherIconUrl(iconCode, size = "2x") {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
}

export function formatTime(timestamp, timezone) {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toUTCString().slice(17, 22);
}

export function getWindDirection(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

// Returns a temperature tier for background theming
// Freezing < 0 | Cold 0-10 | Cool 10-18 | Mild 18-25 | Warm 25-32 | Hot >32
export function getTemperatureTier(temp) {
  if (temp < 0)   return "freezing";
  if (temp < 10)  return "cold";
  if (temp < 18)  return "cool";
  if (temp < 25)  return "mild";
  if (temp < 32)  return "warm";
  return "hot";
}