const HeaderUI = () => {
  return (
    <div className="absolute top-0 left-0 w-full pt-[50px] px-6 pb-5 flex justify-between items-center z-20 pointer-events-none">
      <div className="pointer-events-auto glass-surface rounded-full py-2 px-4 text-sm font-semibold flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[hsl(var(--status-green))] shadow-[0_0_8px_hsl(var(--status-green))]" />
        Linked
      </div>
    </div>
  );
};

export default HeaderUI;
