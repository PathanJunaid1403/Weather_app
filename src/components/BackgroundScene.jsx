import "../styles/BackgroundScene.css";

// Temperature-based scenes (primary layer)
const TEMP_SCENES = {
  freezing: {
    gradient: "linear-gradient(160deg, #050d1a 0%, #0a1f35 45%, #1a3a5c 100%)",
    glow1: "rgba(160,210,255,0.15)",
    glow2: "rgba(80,140,200,0.1)",
    label: "Freezing",
    labelColor: "#a0d2ff",
  },
  cold: {
    gradient: "linear-gradient(160deg, #0a1628 0%, #152840 45%, #1e4060 100%)",
    glow1: "rgba(120,190,255,0.13)",
    glow2: "rgba(60,120,190,0.1)",
    label: "Cold",
    labelColor: "#78beff",
  },
  cool: {
    gradient: "linear-gradient(160deg, #0d1e38 0%, #1a3558 45%, #2a5080 100%)",
    glow1: "rgba(80,160,240,0.12)",
    glow2: "rgba(40,100,180,0.1)",
    label: "Cool",
    labelColor: "#50a0f0",
  },
  mild: {
    gradient: "linear-gradient(160deg, #0d2040 0%, #1a4060 45%, #2a6888 100%)",
    glow1: "rgba(50,180,200,0.13)",
    glow2: "rgba(30,140,160,0.1)",
    label: "Mild",
    labelColor: "#32b4c8",
  },
  warm: {
    gradient: "linear-gradient(160deg, #1a1a0a 0%, #3a2a10 45%, #c06010 100%)",
    glow1: "rgba(255,160,50,0.16)",
    glow2: "rgba(220,100,20,0.12)",
    label: "Warm",
    labelColor: "#ffa032",
  },
  hot: {
    gradient: "linear-gradient(160deg, #1a0a00 0%, #3a1000 45%, #c02010 100%)",
    glow1: "rgba(255,100,30,0.2)",
    glow2: "rgba(220,50,10,0.15)",
    label: "Hot",
    labelColor: "#ff6420",
  },
};

// Weather condition particles (secondary layer)
const CONDITION_PARTICLES = {
  Clear:        ["✦", "✧", "⋆", "✦", "✧"],
  Clouds:       ["☁", "⛅", "☁", "☁", "⛅"],
  Rain:         ["💧", "🌧", "💧", "💧", "🌧"],
  Drizzle:      ["💧", "💧", "🌦", "💧", "💧"],
  Thunderstorm: ["⚡", "🌩", "⚡", "🌩", "⚡"],
  Snow:         ["❄", "🌨", "❄", "❄", "🌨"],
  Mist:         ["🌫", "🌁", "🌫", "🌫", "🌁"],
  Haze:         ["🌫", "🌁", "🌫", "🌫", "🌁"],
};

const BackgroundScene = ({ condition, tempTier }) => {
  const scene = TEMP_SCENES[tempTier] || TEMP_SCENES.mild;
  const particles = CONDITION_PARTICLES[condition] || CONDITION_PARTICLES.Clear;

  return (
    <div className="bg-scene" style={{ background: scene.gradient }}>
      {/* Temperature badge */}
      {tempTier && (
        <div className="temp-tier-badge" style={{ color: scene.labelColor, borderColor: scene.labelColor + "44", background: scene.labelColor + "11" }}>
          <span className="tier-dot" style={{ background: scene.labelColor }} />
          {scene.label}
        </div>
      )}

      {/* Particles from weather condition */}
      {particles.map((p, i) => (
        <span key={i} className={`bg-particle particle-${i + 1}`}>{p}</span>
      ))}

      {/* Temperature-tinted glows */}
      <div className="bg-glow glow-1" style={{ background: `radial-gradient(circle, ${scene.glow1} 0%, transparent 70%)` }} />
      <div className="bg-glow glow-2" style={{ background: `radial-gradient(circle, ${scene.glow2} 0%, transparent 70%)` }} />
    </div>
  );
}

export default BackgroundScene;