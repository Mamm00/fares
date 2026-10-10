import type { CSSProperties } from "react";

export default function Marquee({
  items,
  speed = 22,
  className = "",
}: {
  items: string[];
  speed?: number;
  className?: string;
}) {
  const Row = ({ hidden = false }: { hidden?: boolean }) => (
    <div
      className="marquee-track"
      aria-hidden={hidden}
      style={{ "--marquee-speed": `${speed}s` } as CSSProperties}
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-10 whitespace-nowrap">
          <span className="font-display text-lg uppercase tracking-wide md:text-xl">
            {item}
          </span>
          <span className="h-2 w-2 rotate-45 bg-ink" aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee ${className}`}>
      <Row />
      <Row hidden />
    </div>
  );
}
