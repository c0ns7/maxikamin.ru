# Картинки сайта

Папка не хранится в GitHub (слишком тяжело для `git push`).

На VPS скопируйте сюда содержимое с локальной машины:

```bash
# с вашего ПК (пример)
scp -r public/images/* deploy@IP:/var/www/maxikamin/public/images/
```

Нужны как минимум:
- `hero.png`, `delivery.png`, `montage.png`
- `catalog/` (бренды)
- `granite/` (карьеры/цех)
