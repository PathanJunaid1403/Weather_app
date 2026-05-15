import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import WeatherDetails from "./components/WeatherDetails";
import Forecast from "./components/Forecast";
import Footer from "./components/Footer";
import ErrorMessage from "./components/ErrorMessage";
import Loader from "./components/Loader";
import BackgroundScene from "./components/BackgroundScene";
import { fetchWeatherByCity, fetchWeatherByCoords, fetchForecastByCity, fetchForecastByCoords, getTemperatureTier } from "./api/weather";
import "./App.css";
// App.jsx - Main application component for Nimbus Weather App
export default function App() {
  const [weather, setWeather]     = useState(null);
  const [forecast, setForecast]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [geoLoading, setGeoLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude: lat, longitude: lon } = pos.coords;
            const [data, fcData] = await Promise.all([
              fetchWeatherByCoords(lat, lon),
              fetchForecastByCoords(lat, lon),
            ]);
            setWeather(data);
            setForecast(fcData);
          } catch (err) {
            setError("Could not fetch weather for your location.");
          } finally {
            setGeoLoading(false);
          }
        },
        () => {
          setGeoLoading(false);
          setError("Location access denied. Search for a city above.");
        }
      );
    } else {
      setGeoLoading(false);
    }
  }, []);

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    setWeather(null);
    setForecast(null);
    try {
      const [data, fcData] = await Promise.all([
        fetchWeatherByCity(city),
        fetchForecastByCity(city),
      ]);
      setWeather(data);
      setForecast(fcData);
    } catch (err) {
      setError(err.message || "City not found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || geoLoading;
  const weatherCondition = weather?.weather?.[0]?.main || "Clear";
  const tempTier = weather ? getTemperatureTier(weather.main.temp) : null;

  return (
    <div className="app">
      <BackgroundScene condition={weatherCondition} tempTier={tempTier} />
      <div className="app-content">
        <header className="app-header">
          <div className="logo">
            <span className="logo-icon">⛅</span>
            <h1 className="logo-text">Nimbus</h1>
          </div>
          <p className="tagline">Real-time weather, anywhere on Earth</p>
        </header>

        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        <main className="main-content">
          {isLoading && <Loader />}
          {error && !isLoading && <ErrorMessage message={error} />}
          {weather && !isLoading && (
            <div className="weather-wrapper">
              <WeatherCard weather={weather} />
              <WeatherDetails weather={weather} />
              {forecast && <Forecast forecastData={forecast} />}
            </div>
          )}
          {!weather && !isLoading && !error && (
            <div className="welcome-hint">
              <p>🌍 Search a city or allow location access to get started</p>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}