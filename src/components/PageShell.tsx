import type { ReactNode } from "react";

interface PageShellProps {
  eyebrow: string;
  title: string;
  lead?: string;
  children: ReactNode;
}

export default function PageShell({
  eyebrow,
  title,
  lead,
  children,
}: PageShellProps) {
  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-28 sm:px-8 lg:px-10 lg:pt-32">
      <header className="max-w-3xl border-b border-ash/10 pb-10">
        <p className="text-[11px] font-medium tracking-[0.28em] text-ember uppercase">
          {eyebrow}
        </p>
        <h1 className="font-display mt-3 text-4xl leading-none text-ash sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-smoke">
            {lead}
          </p>
        )}
      </header>
      <div className="mt-12">{children}</div>
    </div>
  );
}
