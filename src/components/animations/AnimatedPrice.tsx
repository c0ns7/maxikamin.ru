"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "framer-motion";

interface AnimatedPriceProps {
  value: number;
  className?: string;
  duration?: number;
}

function formatRub(n: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

/** Плавный счётчик суммы — цифра «катится» к новому значению */
export default function AnimatedPrice({
  value,
  className,
  duration = 0.9,
}: AnimatedPriceProps) {
  const [label, setLabel] = useState(() => formatRub(value));
  const scale = useMotionValue(1);
  const fromRef = useRef(value);

  useEffect(() => {
    const from = fromRef.current;
    if (from === value) {
      setLabel(formatRub(value));
      return;
    }

    const growing = value > from;
    const controls = animate(from, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setLabel(formatRub(latest)),
      onComplete: () => {
        fromRef.current = value;
        setLabel(formatRub(value));
      },
    });

    animate(scale, growing ? [1, 1.06, 1] : [1, 0.97, 1], {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => controls.stop();
  }, [value, duration, scale]);

  return (
    <motion.span
      className={`inline-block tabular-nums ${className ?? ""}`}
      style={{ scale }}
    >
      {label}
    </motion.span>
  );
}
