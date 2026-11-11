"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useToast } from "@/components/Toast";
import { useCart } from "@/components/cart/CartContext";
import type { Product } from "@/lib/data";

interface ProductActionsProps {
  product: Product;
  phone?: string;
}

export default function ProductActions({ product, phone }: ProductActionsProps) {
  const { showToast } = useToast();
  const { addItem, openCart } = useCart();
  const tel = phone?.replace(/[^\d+]/g, "") ?? "";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            addItem(product);
            showToast(`«${product.name}» в корзине`);
            openCart();
          }}
          className="inline-flex cursor-pointer items-center justify-center bg-ember px-8 py-4 text-[12px] font-semibold tracking-[0.14em] text-cream uppercase transition hover:bg-ember-hot"
        >
          В корзину
        </motion.button>
        {tel ? (
          <a
            href={`tel:${tel}`}
            className="inline-flex cursor-pointer items-center justify-center border border-ash/25 px-8 py-4 text-[12px] font-medium tracking-[0.14em] text-ash uppercase transition hover:border-ash hover:bg-ash hover:text-cream"
          >
            Спросить менеджера
          </a>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-smoke">
        <Link href="/calculator" className="hover:text-ember">
          Рассчитать с доставкой и монтажом
        </Link>
        <button
          type="button"
          onClick={() =>
            showToast("Заявка на монтаж принята. Мы свяжемся с вами.")
          }
          className="cursor-pointer hover:text-ember"
        >
          Заказать замер / монтаж
        </button>
      </div>
    </div>
  );
}
