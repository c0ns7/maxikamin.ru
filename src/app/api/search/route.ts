import { connection } from "next/server";
import { formatPrice } from "@/lib/data";
import { listProducts } from "@/lib/db/queries";

export async function GET(request: Request) {
  await connection();
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (q.length < 2) {
    return Response.json({ items: [] });
  }

  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const items = listProducts()
    .filter((p) => {
      const hay = [p.name, p.brand, p.category, p.line ?? "", p.description ?? ""]
        .join(" ")
        .toLowerCase();
      return terms.every((term) => hay.includes(term));
    })
    .slice(0, 8)
    .map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      priceLabel: formatPrice(p.price),
    }));

  return Response.json({ items });
}
