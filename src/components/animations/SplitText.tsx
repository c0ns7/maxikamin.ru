"use client";

import { motion } from "framer-motion";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "p" | "span";
}

/** Посимвольное появление — в духе React Bits Split / Blur Text */
export default function SplitText({
  text,
  className,
  delay = 0.15,
  stagger = 0.035,
  as: Tag = "h1",
}: SplitTextProps) {
  const chars = Array.from(text);

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        className="inline"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: stagger, delayChildren: delay },
          },
        }}
        aria-hidden
      >
        {chars.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            className="inline-block"
            style={{ whiteSpace: char === " " ? "pre" : undefined }}
            variants={{
              hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
