import type { SiteSettings } from "@/lib/types";

export const defaultSettings: SiteSettings = {
  contacts: {
    phone: "+7 (495) 123-45-67",
    email: "info@maxi-kamin.ru",
    site: "maxi-kamin.ru",
    address: "Москва",
  },
  hero: {
    headline: "Maxi-Kamin",
    subtitle:
      "Подберём топку или печь под ваш дом и изготовим изделия из елизаветинского гранита. Доставка и монтаж — под ключ.",
    image: "/images/hero.png",
    ctaPrimary: "Смотреть каталог",
    ctaSecondary: "Рассчитать стоимость",
  },
  featuredProductIds: [
    "Каминный портал Madeira Altea",
    "Топка Kratki ERYK 700",
    "Полка / каминная доска Елизаветинский",
    "Печь-камин La Nordica Super Junior Nera",
  ],
  metaTitle: "Maxi-Kamin — камины, топки и гранит Елизаветинский",
  metaDescription:
    "Камины, топки, печи и изделия из гранита Елизаветинский. Madeira, Экокамин, Kratki, ABX, Brunner, La Nordica и другие. Доставка и монтаж.",
};
