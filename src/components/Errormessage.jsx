import "../styles/ErrorMessage.css";

export default function ErrorMessage({ message }) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p className="error-message">{message}</p>
      <p className="error-hint">Try searching another city name</p>
    </div>
  );
}