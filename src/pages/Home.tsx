import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UnicornScene from "unicornstudio-react";

const Home = () => {
  const [listening, setListening] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="ambient-bg h-screen w-screen flex flex-col relative overflow-hidden">
      {/* Ambient blur layer */}
      <div className="absolute inset-0 backdrop-blur-[60px] z-0 pointer-events-none" />

      {/* Header */}
      <div className="relative z-20 pt-14 px-6 pb-4 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto glass-surface rounded-full py-2 px-4 text-sm font-semibold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[hsl(var(--status-green))] shadow-[0_0_8px_hsl(var(--status-green))]" />
          Ready
        </div>
      </div>

      {/* Main content — centered orb */}
      <div className="relative flex-1 z-[1] flex flex-col items-center justify-center gap-8">
        {/* Unicorn Studio Orb */}
        <div
          className={`relative w-[280px] h-[280px] rounded-full cursor-pointer transition-transform duration-500 ${
            listening ? "scale-105" : ""
          }`}
          onClick={() => setListening((v) => !v)}
        >
          {/* Breathing / pulsing ring */}
          <div
            className={`absolute -inset-3 rounded-full border-2 pointer-events-none transition-all duration-700 ${
              listening
                ? "border-foreground/30 animate-breathe shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                : "border-foreground/10 animate-breathe"
            }`}
          />
          {/* Second pulse ring when listening */}
          {listening && (
            <div
              className="absolute -inset-6 rounded-full border border-foreground/10 animate-breathe pointer-events-none"
              style={{ animationDelay: "2s" }}
            />
          )}

          <div className="w-full h-full rounded-full overflow-hidden">
            <UnicornScene
              projectId="Lgdtqo6IcVdXW37hvOeJ"
              sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js"
              width="100%"
              height="100%"
            />
          </div>
        </div>

        {/* Status text */}
        <div className="text-center">
          <p className="text-lg font-semibold tracking-tight">
            {listening ? "Listening..." : "Tap the orb to share your idea"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {listening
              ? "Tell me what you're thinking"
              : "Voice or text — your call"}
          </p>
        </div>

        {/* Voice wave indicator when listening */}
        {listening && (
          <div className="flex justify-center gap-1 h-6 items-center">
            {[0, 0.1, 0.2, 0.1, 0].map((delay, i) => (
              <div
                key={i}
                className="w-1 bg-foreground rounded-full animate-wave"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        )}

        {/* Text input alternative */}
        <div className="w-[90%] max-w-[400px]">
          <div
            className="glass-surface rounded-full px-5 py-3 flex items-center gap-3 cursor-text"
            onClick={() => setListening(false)}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-muted-foreground flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-muted-foreground text-sm">
              Type your idea here...
            </span>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="absolute bottom-10 left-0 w-full flex justify-center z-50 px-6">
        <div className="glass-nav rounded-full px-1.5 flex items-center gap-2 h-16">
          {/* Home (active) */}
          <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-foreground bg-[hsl(var(--active-surface))] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <circle cx="12" cy="12" r="10" fillOpacity="0.3" />
              <circle cx="12" cy="12" r="6" />
            </svg>
          </div>
          {/* Map */}
          <div
            className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-foreground cursor-pointer transition-all duration-300"
            onClick={() => navigate("/map")}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <circle cx="12" cy="12" r="3.5" />
              <circle cx="12" cy="4" r="1.5" />
              <circle cx="12" cy="20" r="1.5" />
              <circle cx="4" cy="12" r="1.5" />
              <circle cx="20" cy="12" r="1.5" />
            </svg>
          </div>
          {/* Notes */}
          <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-foreground cursor-pointer transition-all duration-300">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
          </div>
          {/* Profile */}
          <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-foreground cursor-pointer transition-all duration-300">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
