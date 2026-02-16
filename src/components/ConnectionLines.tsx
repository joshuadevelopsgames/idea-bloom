import { useEffect, useRef } from "react";

interface ConnectionLinesProps {
  mainRef: React.RefObject<HTMLDivElement>;
  branchRefs: React.RefObject<(HTMLDivElement | null)[]>;
  containerRef: React.RefObject<HTMLDivElement>;
}

const ConnectionLines = ({ mainRef, branchRefs, containerRef }: ConnectionLinesProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const draw = () => {
      const svg = svgRef.current;
      const main = mainRef.current;
      const container = containerRef.current;
      const branches = branchRefs.current;
      if (!svg || !main || !container || !branches) return;

      const cRect = container.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${cRect.width} ${cRect.height}`);

      const mRect = main.getBoundingClientRect();
      const mx = mRect.left - cRect.left + mRect.width / 2;
      const my = mRect.top - cRect.top + mRect.height / 2;

      let paths = "";
      branches.forEach((b) => {
        if (!b) return;
        const bRect = b.getBoundingClientRect();
        const bx = bRect.left - cRect.left + bRect.width / 2;
        const by = bRect.top - cRect.top + bRect.height / 2;
        const midX = (mx + bx) / 2;
        paths += `<path d="M${mx},${my} C${midX},${my} ${midX},${by} ${bx},${by}" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" fill="none" />`;
      });
      svg.innerHTML = paths;
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [mainRef, branchRefs, containerRef]);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
    >
      <style>{`
        .connection-line {
          stroke: rgba(255, 255, 255, 0.3);
          stroke-width: 1.5;
          fill: none;
          filter: drop-shadow(0 0 2px rgba(255,255,255,0.2));
        }
      `}</style>
    </svg>
  );
};

export default ConnectionLines;
