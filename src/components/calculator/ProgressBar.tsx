"use client";

const STEPS = [
  { n: 1, label: "Тип" },
  { n: 2, label: "Параметры" },
  { n: 3, label: "Услуги" },
  { n: 4, label: "Заявка" },
];

interface ProgressBarProps {
  current: number;
  onStepClick?: (step: number) => void;
}

export default function ProgressBar({ current, onStepClick }: ProgressBarProps) {
  return (
    <nav
      aria-label="Шаги калькулятора"
      className="sticky top-[4.25rem] z-30 border-b border-ash/10 bg-paper/95 backdrop-blur-md"
    >
      <ol className="mx-auto flex max-w-[1400px] px-5 sm:px-8 lg:px-10">
        {STEPS.map((step, i) => {
          const done = current > step.n;
          const active = current === step.n;
          const clickable = Boolean(onStepClick) && step.n < current;

          return (
            <li key={step.n} className="relative flex flex-1">
              {i > 0 && (
                <span
                  className={`absolute top-[1.65rem] right-1/2 left-[-50%] hidden h-px sm:block ${
                    done || active ? "bg-ash/25" : "bg-ash/10"
                  }`}
                  aria-hidden
                />
              )}
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick?.(step.n)}
                className={`relative z-10 flex w-full flex-col items-start gap-1 border-b-2 py-4 text-left transition sm:py-5 ${
                  active
                    ? "border-ember"
                    : done
                      ? "border-ash/40"
                      : "border-transparent"
                } ${clickable ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={`text-[11px] font-medium tracking-[0.18em] tabular-nums ${
                    active || done ? "text-ember" : "text-smoke/50"
                  }`}
                >
                  {step.n}/{STEPS.length}
                </span>
                <span
                  className={`font-display text-base leading-none sm:text-xl ${
                    active
                      ? "text-ash"
                      : done
                        ? "text-ash/75"
                        : "text-smoke/45"
                  }`}
                >
                  {step.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
