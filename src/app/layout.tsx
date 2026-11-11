import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import SiteHeader from "@/components/SiteHeader";
import { ToastProvider } from "@/components/Toast";
import { CartProvider } from "@/components/cart/CartContext";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MaxiKamin — камины, топки и гранит Елизаветинский",
  description:
    "Камины, топки, печи и изделия из гранита Елизаветинский. Madeira, Экокамин, Kratki, ABX, Brunner, La Nordica и другие. Доставка и монтаж.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-linen font-sans text-ash">
        <ToastProvider>
          <CartProvider>
            <Suspense fallback={null}>
              <SiteHeader />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Suspense fallback={null}>
              <SiteChrome />
            </Suspense>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
