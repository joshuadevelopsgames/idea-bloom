import { forwardRef } from "react";
import ShaderOrb from "./ShaderOrb";

const MainNode = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full flex flex-col items-center justify-center text-center cursor-pointer z-10 transition-transform duration-400 active:scale-95"
    >
      {/* Shader orb background */}
      <div className="absolute inset-[-20px] flex items-center justify-center pointer-events-none">
        <ShaderOrb size={200} />
      </div>
      {/* Breathing ring */}
      <div className="absolute -inset-1 rounded-full border-2 border-foreground/10 animate-breathe pointer-events-none" />
      {/* Leaf icon */}
      <svg className="w-8 h-8 mb-2 opacity-90 relative z-10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
      </svg>
      <span className="font-semibold text-sm leading-tight relative z-10">
        Urban Vertical<br />Garden
      </span>
      <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest relative z-10">
        Main Idea
      </span>
    </div>
  );
});

MainNode.displayName = "MainNode";
export default MainNode;
