import Link from "next/link";

const items = [
  {
    title: "Подбор под объект",
    text: "Считаем тепло и комплектуем дымоход",
  },
  {
    title: "Свой гранит",
    text: "Елизаветинский — от карьера до монтажа",
  },
  {
    title: "Монтаж под ключ",
    text: "Топки, печи, камень — одной командой",
  },
  {
    title: "Честная смета",
    text: (
      <>
        Считайте сами в{" "}
        <Link href="/calculator" className="text-ember underline-offset-2 hover:underline">
          калькуляторе
        </Link>
      </>
    ),
  },
];

export default function TrustBar() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-6 lg:px-10 lg:py-12">
        {items.map((item) => (
          <div key={item.title}>
            <p className="font-display text-xl text-ash sm:text-[1.35rem]">
              {item.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-smoke">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
