import { useState } from "react";

interface BottomNavProps {
  onOrbClick: () => void;
  orbActive: boolean;
}

const BottomNav = ({ onOrbClick, orbActive }: BottomNavProps) => {
  const [active, setActive] = useState(1);

  const navItems = [
    {
      id: 0,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current drop-shadow-sm">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
      ),
    },
    {
      id: 1,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current drop-shadow-sm">
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="12" cy="4" r="1.5" />
          <circle cx="12" cy="20" r="1.5" />
          <circle cx="4" cy="12" r="1.5" />
          <circle cx="20" cy="12" r="1.5" />
        </svg>
      ),
    },
    {
      id: "orb",
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current drop-shadow-sm">
          <circle cx="12" cy="12" r="10" fillOpacity="0.3" />
          <circle cx="12" cy="12" r="6" />
        </svg>
      ),
    },
    {
      id: 2,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current drop-shadow-sm">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
      ),
    },
    {
      id: 3,
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current drop-shadow-sm">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="absolute bottom-10 left-0 w-full flex justify-center z-50 px-6">
      <div className="glass-nav rounded-full px-1.5 flex items-center gap-2 h-16">
        {navItems.map((item) => {
          const isOrb = item.id === "orb";
          const isActive = isOrb ? orbActive : active === item.id;

          return (
            <div
              key={String(item.id)}
              onClick={() => {
                if (isOrb) {
                  onOrbClick();
                } else {
                  setActive(item.id as number);
                }
              }}
              className={`w-[52px] h-[52px] rounded-full flex items-center justify-center text-foreground transition-all duration-300 cursor-pointer ${
                isOrb ? "w-16 mx-2" : ""
              } ${isActive ? "bg-[hsl(var(--active-surface))] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]" : ""}`}
            >
              {item.icon}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
