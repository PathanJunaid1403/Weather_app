import { getWeatherIconUrl, formatTime } from "../api/weather";
import "../styles/WeatherCard.css";

const WeatherCard = ({ weather }) => {
  const {
    name,
    sys: { country, sunrise, sunset },
    main: { temp, feels_like, temp_min, temp_max },
    weather: [{ description, icon }],
    timezone,
  } = weather;

  const sunriseTime = formatTime(sunrise, timezone);
  const sunsetTime = formatTime(sunset, timezone);

  return (
    <div className="weather-card">
      <div className="card-top">
        <div className="location-info">
          <h2 className="city-name">{name}</h2>
          <span className="country-badge">{country}</span>
        </div>
        <div className="sun-times">
          <span>🌅 {sunriseTime}</span>
          <span>🌇 {sunsetTime}</span>
        </div>
      </div>

      <div className="card-center">
        <div className="temp-display">
          <span className="temp-value">{Math.round(temp)}</span>
          <span className="temp-unit">°C</span>
        </div>
        <div className="weather-icon-wrap">
          <img
            src={getWeatherIconUrl(icon, "4x")}
            alt={description}
            className="weather-icon"
          />
          <p className="weather-desc">{description}</p>
        </div>
      </div>

      <div className="card-bottom">
        <div className="temp-range">
          <span className="temp-item">
            <span className="temp-label">Feels like</span>
            <span className="temp-val">{Math.round(feels_like)}°</span>
          </span>
          <div className="divider" />
          <span className="temp-item">
            <span className="temp-label">Low</span>
            <span className="temp-val">{Math.round(temp_min)}°</span>
          </span>
          <div className="divider" />
          <span className="temp-item">
            <span className="temp-label">High</span>
            <span className="temp-val">{Math.round(temp_max)}°</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;