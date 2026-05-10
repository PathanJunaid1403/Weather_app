import "../styles/Footer.css";

const CURRENT_YEAR = new Date().getFullYear();

const links = [
  { label: "OpenWeatherMap", href: "https://openweathermap.org" },
  { label: "API Docs", href: "https://openweathermap.org/api" },
  { label: "Privacy", href: "https://openweathermap.org/privacy-policy" },
];

const features = [
  { icon: "📍", text: "Live geolocation" },
  { icon: "🔄", text: "3-hour intervals" },
  { icon: "📅", text: "5-day forecast" },
  { icon: "🌡️", text: "Metric units" },
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">⛅</span>
            <span className="footer-logo-text">Nimbus</span>
          </div>
          <p className="footer-tagline">
            Real-time weather intelligence,<br />powered by OpenWeatherMap.
          </p>
        </div>

        {/* Feature pills */}
        <div className="footer-features">
          {features.map(({ icon, text }) => (
            <span key={text} className="feature-pill">
              <span>{icon}</span> {text}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom row */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {CURRENT_YEAR} Nimbus · Weather data by{" "}
            <a
              href="https://openweathermap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              OpenWeatherMap
            </a>
          </p>

          <nav className="footer-nav">
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-nav-link"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

      </div>
    </footer>
  );
}

export default Footer;