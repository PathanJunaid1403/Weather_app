import { useState, useMemo } from "react";
import { groupForecastByDay, getWeatherIconUrl } from "../api/weather";
import "../styles/Forecast.css";

function formatHour(dt) {
  return new Date(dt * 1000).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

function getDayLabel(dateStr, index) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return dateStr.split(",")[0]; // "Mon", "Tue" etc.
}

function TempBar({ min, max, globalMin, globalMax }) {
  const range = globalMax - globalMin || 1;
  const left  = ((min - globalMin) / range) * 100;
  const width = ((max - min) / range) * 100;
  return (
    <div className="temp-bar-track">
      <div
        className="temp-bar-fill"
        style={{ left: `${left}%`, width: `${Math.max(width, 4)}%` }}
      />
    </div>
  );
}

const Forecast = ({ forecastData }) =>{
  const grouped = useMemo(
    () => groupForecastByDay(forecastData.list),
    [forecastData]
  );

  const days = Object.entries(grouped).slice(0, 5);
  const [activeDay, setActiveDay] = useState(0);

  // Global min/max for the temp bar scale
  const allTemps = forecastData.list.map((s) => s.main.temp);
  const globalMin = Math.floor(Math.min(...allTemps));
  const globalMax = Math.ceil(Math.max(...allTemps));

  // Per-day summary (icon, hi/lo)
  const daySummaries = days.map(([label, slots]) => {
    const temps = slots.map((s) => s.main.temp);
    const dominant = slots[Math.floor(slots.length / 2)];
    return {
      label,
      icon: dominant.weather[0].icon,
      desc: dominant.weather[0].main,
      hi: Math.round(Math.max(...temps)),
      lo: Math.round(Math.min(...temps)),
    };
  });

  const activeSlots = days[activeDay]?.[1] ?? [];

  return (
    <div className="forecast-card">
      <h3 className="forecast-title">5-Day Forecast · 3-Hour Intervals</h3>

      {/* ── Day tabs ── */}
      <div className="day-tabs">
        {daySummaries.map((day, i) => (
          <button
            key={day.label}
            className={`day-tab ${i === activeDay ? "active" : ""}`}
            onClick={() => setActiveDay(i)}
          >
            <span className="tab-day">{getDayLabel(day.label, i)}</span>
            <img
              src={getWeatherIconUrl(day.icon, "2x")}
              alt={day.desc}
              className="tab-icon"
            />
            <span className="tab-temps">
              <span className="tab-hi">{day.hi}°</span>
              <span className="tab-lo">{day.lo}°</span>
            </span>
            <TempBar
              min={day.lo}
              max={day.hi}
              globalMin={globalMin}
              globalMax={globalMax}
            />
          </button>
        ))}
      </div>

      {/* ── Hourly slots for active day ── */}
      <div className="hourly-scroll">
        <div className="hourly-track">
          {activeSlots.map((slot, i) => {
            const temp  = Math.round(slot.main.temp);
            const feels = Math.round(slot.main.feels_like);
            const pop   = Math.round((slot.pop ?? 0) * 100);
            const { icon, description, main } = slot.weather[0];
            const wind  = slot.wind.speed.toFixed(1);
            const hour  = formatHour(slot.dt);

            return (
              <div key={slot.dt} className="hour-slot" style={{ "--delay": `${i * 0.04}s` }}>
                <span className="hour-time">{hour}</span>
                <img
                  src={getWeatherIconUrl(icon, "2x")}
                  alt={description}
                  className="hour-icon"
                />
                <span className="hour-temp">{temp}°</span>
                <span className="hour-feels">Feels {feels}°</span>
                <span className="hour-desc">{main}</span>
                <div className="hour-meta">
                  {pop > 0 && (
                    <span className="hour-pop" title="Chance of rain">
                      💧 {pop}%
                    </span>
                  )}
                  <span className="hour-wind" title="Wind speed">
                    🌬 {wind} m/s
                  </span>
                </div>
                <div className="hour-humidity">
                  <div
                    className="humidity-bar"
                    style={{ height: `${slot.main.humidity}%` }}
                    title={`Humidity ${slot.main.humidity}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mini legend ── */}
      <div className="forecast-legend">
        <span>💧 Rain chance</span>
        <span>🌬 Wind</span>
        <span className="legend-bar-sample" /> Humidity
      </div>
    </div>
  );
}
export default Forecast;