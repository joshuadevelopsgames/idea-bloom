import { forwardRef } from "react";

interface BranchNodeProps {
  label: string;
  sub: string;
  className?: string;
}

const BranchNode = forwardRef<HTMLDivElement, BranchNodeProps>(
  ({ label, sub, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`absolute glass-surface rounded-[var(--radius)] w-[110px] h-[80px] flex flex-col items-center justify-center text-center cursor-pointer z-[2] transition-transform duration-400 active:scale-95 ${className}`}
      >
        <span className="font-semibold text-[13px] leading-tight" dangerouslySetInnerHTML={{ __html: label }} />
        <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">
          {sub}
        </span>
      </div>
    );
  }
);

BranchNode.displayName = "BranchNode";
export default BranchNode;
