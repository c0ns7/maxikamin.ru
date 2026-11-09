# Maxi-Kamin

Frontend интернет-магазина каминов, топок, печей и изделий из гранита Елизаветинский.

**Стек:** Next.js (App Router) · TypeScript · Tailwind CSS · lucide-react · framer-motion

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Медиа

| Путь | Содержимое |
|------|------------|
| `public/images/hero.png` | Hero |
| `public/images/delivery.png`, `montage.png` | Услуги |
| `public/images/granite/quarry/` | Карьер |
| `public/images/granite/production/` | Цех и склад |
| `public/images/granite/products/` | Изделия |
| `public/videos/` | Видео производства |

Пути в коде: `src/lib/images.ts`.

## Где менять данные

- **Товары, бренды, ассортимент** — `src/lib/data.ts`
- **Калькулятор** — `src/lib/calculator.ts`
- **Контакты** — `Header.tsx`, `Footer.tsx`
