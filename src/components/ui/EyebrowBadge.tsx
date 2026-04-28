type Props = { children: React.ReactNode; className?: string };

export function EyebrowBadge({ children, className = "" }: Props) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-amber-700/30 bg-amber-900/20 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-accent backdrop-blur-md ${className}`}
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 24px -8px rgba(200,146,42,0.4)" }}>
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(200,146,42,0.9)]" />
      {children}
    </span>
  );
}
