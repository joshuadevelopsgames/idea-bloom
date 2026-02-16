interface OrbOverlayProps {
  visible: boolean;
}

const OrbOverlay = ({ visible }: OrbOverlayProps) => {
  return (
    <div
      className={`absolute bottom-[120px] left-1/2 glass-surface rounded-[20px] p-4 w-[90%] max-w-[340px] text-center transition-all duration-400 ${
        visible
          ? "opacity-100 -translate-x-1/2 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-x-1/2 translate-y-5 pointer-events-none"
      }`}
      style={{ zIndex: 60 }}
    >
      <p className="text-[15px] font-medium mb-3">Listening for new ideas...</p>
      <div className="flex justify-center gap-1 h-6 items-center">
        {[0, 0.1, 0.2, 0.1, 0].map((delay, i) => (
          <div
            key={i}
            className="w-1 bg-foreground rounded-full animate-wave"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default OrbOverlay;
