"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { MouseEvent } from "react";
import type { Product } from "@/lib/data";
import { formatPrice } from "@/lib/data";
import { useToast } from "@/components/Toast";
import { useCart } from "@/components/cart/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
  featured?: boolean;
  compact?: boolean;
}

export default function ProductCard({
  product,
  index = 0,
  featured = false,
  compact = false,
}: ProductCardProps) {
  const { showToast } = useToast();
  const { addItem } = useCart();

  const handleAdd = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    showToast(`«${product.name}» в корзине`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.06, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      <Link
        href={`/product/${product.id}`}
        className={`relative block overflow-hidden bg-linen-deep ${
          featured
            ? "aspect-[4/5] sm:aspect-[5/4]"
            : compact
              ? "aspect-[16/10]"
              : "aspect-[4/5]"
        }`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
          sizes={
            featured
              ? "(max-width: 1024px) 100vw, 55vw"
              : "(max-width: 640px) 100vw, 30vw"
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ash/45 via-transparent to-transparent opacity-70" />
        <span className="absolute top-4 left-4 bg-paper/90 px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] text-ash uppercase backdrop-blur-sm">
          {product.category}
        </span>
      </Link>

      <div className={`flex flex-col ${featured ? "mt-5" : "mt-4"}`}>
        <p className="text-[11px] font-medium tracking-[0.16em] text-ember uppercase">
          {product.brand}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3
            className={`font-display mt-1.5 leading-snug text-ash transition group-hover:text-ember ${
              featured ? "text-2xl sm:text-3xl" : "text-xl"
            }`}
          >
            {product.name}
          </h3>
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-base font-semibold text-ash tabular-nums">
            {formatPrice(product.price)}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={`/product/${product.id}`}
              className="text-[11px] font-medium tracking-[0.12em] text-smoke uppercase transition hover:text-ash"
            >
              Подробнее
            </Link>
            <button
              type="button"
              onClick={handleAdd}
              className="cursor-pointer border-b border-ash/30 pb-0.5 text-[11px] font-medium tracking-[0.12em] text-ash uppercase transition hover:border-ember hover:text-ember"
            >
              В корзину
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
