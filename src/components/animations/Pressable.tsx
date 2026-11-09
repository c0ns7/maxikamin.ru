"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type PressableProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
  as?: "button" | "div";
};

/** Кнопка с тактильным press/hover */
export default function Pressable({
  children,
  className,
  as = "button",
  type = "button",
  ...rest
}: PressableProps) {
  const shared = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.96 },
    transition: { type: "spring" as const, stiffness: 420, damping: 24 },
    className,
  };

  if (as === "div") {
    return (
      <motion.div {...shared} {...(rest as HTMLMotionProps<"div">)}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.button type={type} {...shared} {...rest}>
      {children}
    </motion.button>
  );
}
