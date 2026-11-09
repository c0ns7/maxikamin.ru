"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/data";
import AnimatedPrice from "@/components/animations/AnimatedPrice";
import { useToast } from "@/components/Toast";

export default function CartDrawer() {
  const pathname = usePathname();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    setQty,
    total,
    count,
    clearCart,
  } = useCart();
  const { showToast } = useToast();

  if (pathname.startsWith("/admin")) return null;

  const checkout = () => {
    showToast("Заявка оформлена. Мы свяжемся для подтверждения.");
    clearCart();
    closeCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Закрыть корзину"
            className="fixed inset-0 z-[90] bg-ash/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Корзина"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-[95] flex w-full max-w-md flex-col bg-paper text-ash shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ash/10 px-5 py-5">
              <div>
                <p className="text-[11px] tracking-[0.2em] text-ember uppercase">
                  Корзина
                </p>
                <h2 className="font-display text-2xl">
                  {count > 0 ? `${count} поз.` : "Пусто"}
                </h2>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={closeCart}
                className="p-2 text-smoke hover:text-ash"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
                  <ShoppingBag className="h-10 w-10 text-smoke/40" />
                  <p className="font-display text-xl text-ash">Корзина пуста</p>
                  <p className="max-w-xs text-sm text-smoke">
                    Добавьте камин, топку или изделие из камня из каталога
                  </p>
                  <Link
                    href="/catalog"
                    onClick={closeCart}
                    className="mt-2 inline-flex bg-ember px-6 py-3 text-[12px] font-semibold tracking-[0.14em] text-cream uppercase transition hover:bg-ember-hot"
                  >
                    В каталог
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex gap-4 border-b border-ash/10 pb-5"
                      >
                        <Link
                          href={`/product/${item.id}`}
                          onClick={closeCart}
                          className="relative h-24 w-20 shrink-0 overflow-hidden bg-linen-deep"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </Link>

                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] tracking-[0.16em] text-ember uppercase">
                            {item.brand}
                          </p>
                          <Link
                            href={`/product/${item.id}`}
                            onClick={closeCart}
                            className="font-display mt-0.5 line-clamp-2 text-lg leading-snug hover:text-ember"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-sm tabular-nums text-ash">
                            {formatPrice(item.price)}
                          </p>

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <div className="inline-flex items-center border border-ash/20">
                              <button
                                type="button"
                                aria-label="Меньше"
                                onClick={() => setQty(item.id, item.qty - 1)}
                                className="p-2 text-smoke hover:text-ash"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-8 text-center text-sm tabular-nums">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                aria-label="Больше"
                                onClick={() => setQty(item.id, item.qty + 1)}
                                className="p-2 text-smoke hover:text-ash"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <button
                              type="button"
                              aria-label="Удалить"
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-smoke transition hover:text-ember"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-ash/10 bg-paper px-5 py-5">
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <span className="text-[11px] tracking-[0.18em] text-smoke uppercase">
                    Итого
                  </span>
                  <AnimatedPrice
                    value={total}
                    className="font-display text-3xl text-ash"
                  />
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={checkout}
                  className="w-full bg-ash py-4 text-[12px] font-medium tracking-[0.18em] text-cream uppercase transition hover:bg-ember"
                >
                  Оформить заказ
                </motion.button>
                <button
                  type="button"
                  onClick={clearCart}
                  className="mt-3 w-full text-center text-[11px] tracking-wider text-smoke uppercase hover:text-ash"
                >
                  Очистить корзину
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
