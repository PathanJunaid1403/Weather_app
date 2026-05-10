import { getWindDirection } from "../api/weather";
import "../styles/WeatherDetails.css";

const WeatherDetails = ({ weather }) => {
  const {
    main: { humidity, pressure },
    wind: { speed, deg },
    visibility,
    clouds: { all: cloudiness },
  } = weather;

  const details = [
    {
      icon: "💧",
      label: "Humidity",
      value: `${humidity}%`,
      bar: humidity,
    },
    {
      icon: "🌬️",
      label: "Wind",
      value: `${speed} m/s ${getWindDirection(deg)}`,
      bar: Math.min((speed / 30) * 100, 100),
    },
    {
      icon: "👁️",
      label: "Visibility",
      value: visibility >= 1000 ? `${(visibility / 1000).toFixed(1)} km` : `${visibility} m`,
      bar: Math.min((visibility / 10000) * 100, 100),
    },
    {
      icon: "☁️",
      label: "Cloud Cover",
      value: `${cloudiness}%`,
      bar: cloudiness,
    },
    {
      icon: "🧭",
      label: "Pressure",
      value: `${pressure} hPa`,
      bar: Math.min(((pressure - 950) / 100) * 100, 100),
    },
  ];

  return (
    <div className="weather-details">
      <h3 className="details-title">Atmospheric Data</h3>
      <div className="details-grid">
        {details.map(({ icon, label, value, bar }) => (
          <div key={label} className="detail-item">
            <div className="detail-header">
              <span className="detail-icon">{icon}</span>
              <span className="detail-label">{label}</span>
            </div>
            <span className="detail-value">{value}</span>
            <div className="detail-bar-track">
              <div
                className="detail-bar-fill"
                style={{ width: `${bar}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherDetails;