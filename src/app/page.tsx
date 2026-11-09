import { Suspense } from "react";
import { connection } from "next/server";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Benefits from "@/components/Benefits";
import Categories from "@/components/Categories";
import Brands from "@/components/Brands";
import Services from "@/components/Services";
import CalculatorTeaser from "@/components/CalculatorTeaser";
import FeaturedProducts from "@/components/FeaturedProducts";
import GraniteShowcase from "@/components/GraniteShowcase";
import FinalCTA from "@/components/FinalCTA";
import {
  getFeaturedProducts,
  getSettings,
  listBrands,
  listCategories,
  listProducts,
} from "@/lib/db/queries";

export const instant = false;

async function HomeContent() {
  await connection();
  const settings = getSettings();
  const brandNames = listBrands().map((b) => b.name);
  const categoryRows = listCategories();
  const allProducts = listProducts();
  const featured = getFeaturedProducts(settings.featuredProductIds);

  const teaserImage =
    allProducts.find((p) => p.name.includes("ERYK"))?.image ??
    allProducts.find((p) => p.category === "Топки")?.image ??
    settings.hero.image;

  return (
    <>
      <Hero content={settings.hero} brandCount={brandNames.length} />
      <TrustBar />
      <Categories categories={categoryRows} products={allProducts} />
      <FeaturedProducts products={featured} />
      <GraniteShowcase products={allProducts} />
      <Benefits />
      <CalculatorTeaser image={teaserImage} />
      <Brands brands={brandNames} />
      <Services />
      <FinalCTA />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-smoke">
          Загрузка…
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
