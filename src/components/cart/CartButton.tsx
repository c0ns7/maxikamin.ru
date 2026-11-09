"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

export default function CartButton() {
  const { count, openCart } = useCart();

  return (
    <motion.button
      type="button"
      onClick={openCart}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      className="relative p-1"
      aria-label={`Корзина${count ? `, ${count} товаров` : ""}`}
    >
      <ShoppingBag className="h-5 w-5" />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1.5 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-ember px-1 text-[10px] font-semibold leading-none text-cream"
          >
            {count > 99 ? "99+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
