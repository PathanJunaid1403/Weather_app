import "../styles/Loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-orb">
        <div className="orb-ring ring-1" />
        <div className="orb-ring ring-2" />
        <div className="orb-ring ring-3" />
        <span className="orb-icon">🌤️</span>
      </div>
      <p className="loader-text">Fetching weather data…</p>
    </div>
  );
}

export default Loader;