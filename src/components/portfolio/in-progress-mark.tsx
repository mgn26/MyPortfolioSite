export function InProgressMark() {
  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-50 size-[7.5rem] overflow-hidden"
      role="status"
      aria-label="Site in progress"
    >
      <span className="absolute top-[1.35rem] left-[-2.35rem] w-[9.5rem] -rotate-45 bg-heading py-1 text-center text-[9px] font-medium uppercase tracking-[0.14em] text-page shadow-sm sm:text-[10px]">
        In progress
      </span>
    </div>
  );
}
