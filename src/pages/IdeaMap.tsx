import { useState, useRef, useCallback } from "react";
import MainNode from "@/components/MainNode";
import BranchNode from "@/components/BranchNode";
import ConnectionLines from "@/components/ConnectionLines";
import BottomNav from "@/components/BottomNav";
import OrbOverlay from "@/components/OrbOverlay";
import HeaderUI from "@/components/HeaderUI";

const branches = [
  { label: "Business<br/>Plan", sub: "Ready", className: "top-[20%] left-1/2 -translate-x-1/2" },
  { label: "Brand<br/>Identity", sub: "Drafting", className: "top-[35%] right-[10%]" },
  { label: "Web<br/>Store", sub: "Pending", className: "bottom-[30%] right-[15%]" },
  { label: "Ad<br/>Campaigns", sub: "Suggestion", className: "bottom-[20%] left-1/2 -translate-x-1/2" },
  { label: "Sourcing<br/>Tech", sub: "Linked", className: "bottom-[30%] left-[15%]" },
  { label: "Local<br/>Permits", sub: "Action", className: "top-[35%] left-[10%]" },
];

const Index = () => {
  const [orbActive, setOrbActive] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const branchRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const setBranchRef = useCallback((el: HTMLDivElement | null, i: number) => {
    branchRefs.current[i] = el;
  }, []);

  return (
    <div className="ambient-bg h-screen w-screen flex flex-col relative overflow-hidden">
      {/* Ambient blur layer */}
      <div className="absolute inset-0 backdrop-blur-[60px] z-0 pointer-events-none" />

      <HeaderUI />

      <div ref={containerRef} className="relative flex-1 z-[1] overflow-hidden w-full flex items-center justify-center" style={{ perspective: "1000px" }}>
        <ConnectionLines mainRef={mainRef} branchRefs={branchRefs} containerRef={containerRef} />
        <MainNode ref={mainRef} />
        {branches.map((b, i) => (
          <BranchNode
            key={i}
            ref={(el) => setBranchRef(el, i)}
            label={b.label}
            sub={b.sub}
            className={b.className}
          />
        ))}
      </div>

      <OrbOverlay visible={orbActive} />
      <BottomNav onOrbClick={() => setOrbActive((v) => !v)} orbActive={orbActive} />
    </div>
  );
};

export default Index;
