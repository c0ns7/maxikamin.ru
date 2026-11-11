# Деплой Maxi-Kamin на VPS (maxikamin.ru + Certbot)

Инструкция для Ubuntu 22.04 / 24.04. Сайт: Next.js + локальная SQLite (`data/maxi-kamin.db`).

Домен: **maxikamin.ru** (и желательно **www.maxikamin.ru**).

---

## 1. DNS у регистратора

Создайте A-записи на IP вашего VPS:

| Тип | Имя | Значение     | TTL  |
|-----|-----|--------------|------|
| A   | `@` | `IP_ВАШЕГО_VPS` | 300 |
| A   | `www` | `IP_ВАШЕГО_VPS` | 300 |

Проверка (с вашего ПК или с сервера):

```bash
dig +short maxikamin.ru
dig +short www.maxikamin.ru
```

Оба должны вернуть IP VPS. Дальше без этого Certbot не выпустит сертификат.

---

## 2. Первичная настройка сервера

Подключитесь:

```bash
ssh root@IP_ВАШЕГО_VPS
```

Обновление и базовые пакеты:

```bash
apt update && apt upgrade -y
apt install -y curl git nginx ufw build-essential python3
```

Firewall:

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

Node.js 22 LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node -v
npm -v
```

---

## 3. Пользователь и каталог приложения

```bash
adduser --disabled-password --gecos "" deploy
usermod -aG sudo deploy
mkdir -p /var/www/maxikamin
chown -R deploy:deploy /var/www/maxikamin
```

Дальше работайте от `deploy`:

```bash
su - deploy
cd /var/www/maxikamin
```

---

## 4. Код проекта

### Вариант A — Git

```bash
git clone URL_ВАШЕГО_РЕПОЗИТОРИЯ .
# или:
# git clone URL_ВАШЕГО_РЕПОЗИТОРИЯ maxikamin && cd maxikamin
```

### Вариант B — загрузка с ПК (если нет Git)

На своём компьютере (PowerShell):

```powershell
scp -r C:\Users\root\Desktop\web_kamni\* deploy@IP_ВАШЕГО_VPS:/var/www/maxikamin/
```

На сервере уберите лишнее перед установкой:

```bash
rm -rf node_modules .next
```

---

## 5. Переменные окружения (продакшен)

```bash
cd /var/www/maxikamin
nano .env.local
```

Минимум:

```env
NODE_ENV=production
ADMIN_PASSWORD=СИЛЬНЫЙ_ПАРОЛЬ_ДЛЯ_ВХОДА
ADMIN_SECRET=ДЛИННАЯ_СЛУЧАЙНАЯ_СТРОКА_32+_СИМВОЛА
```

Сгенерировать секрет:

```bash
openssl rand -hex 32
```

Права:

```bash
chmod 600 .env.local
```

> В продакшене без `ADMIN_PASSWORD` / `ADMIN_SECRET` вход и сессии админки не должны работать «по умолчанию».

---

## 6. Установка зависимостей, БД, сборка

```bash
cd /var/www/maxikamin
npm ci
# если ci нет lock-файла: npm install

npm run db:seed
# при необходимости перезалить каталог:
# npm run db:seed:force

npm run build
```

Проверка вручную:

```bash
npm run start
# Ctrl+C после проверки, что сайт отвечает на :3000
```

Каталоги данных (права на запись для SQLite и загрузок):

```bash
mkdir -p data public/uploads/gallery
chmod -R u+rwX data public/uploads
```

---

## 7. Systemd — автозапуск Next.js

От root:

```bash
sudo nano /etc/systemd/system/maxikamin.service
```

Содержимое:

```ini
[Unit]
Description=Maxi-Kamin Next.js
After=network.target

[Service]
Type=simple
User=deploy
Group=deploy
WorkingDirectory=/var/www/maxikamin
Environment=NODE_ENV=production
EnvironmentFile=/var/www/maxikamin/.env.local
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Запуск:

```bash
sudo systemctl daemon-reload
sudo systemctl enable maxikamin
sudo systemctl start maxikamin
sudo systemctl status maxikamin
```

Логи:

```bash
sudo journalctl -u maxikamin -f
```

---

## 8. Nginx (прокси на Node :3000)

От root:

```bash
sudo nano /etc/nginx/sites-available/maxikamin.ru
```

Сначала HTTP (для выпуска сертификата):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name maxikamin.ru www.maxikamin.ru;

    client_max_body_size 20M;

    # Загрузки галереи с диска сразу, без рестарта Next.js
    location /uploads/ {
        alias /var/www/maxikamin/public/uploads/;
        expires 30d;
        add_header Cache-Control "public";
        access_log off;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Включить сайт:

```bash
sudo ln -sf /etc/nginx/sites-available/maxikamin.ru /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Проверьте в браузере: `http://maxikamin.ru` (пока без HTTPS).

---

## 9. Certbot (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d maxikamin.ru -d www.maxikamin.ru
```

Ответы:
- email — ваш рабочий;
- согласие с ToS — Yes;
- редирект HTTP → HTTPS — **2 (Redirect)**.

Certbot сам дополнит Nginx SSL и редирект.

Проверка автообновления:

```bash
sudo certbot renew --dry-run
```

Сертификаты обновляются через systemd timer Certbot автоматически.

После успеха откройте:

- https://maxikamin.ru  
- https://www.maxikamin.ru  
- https://maxikamin.ru/admin  

---

## 10. Админка после деплоя

1. Зайдите на `/admin/login` с `ADMIN_PASSWORD` из `.env.local`.
2. В **Сайт → Смена пароля** задайте новый пароль (сохранится в БД).
3. Проверьте **Галерею**, каталог и контакты.

Бэкап БД и загрузок:

```bash
# от deploy
cd /var/www/maxikamin
tar -czf ~/maxikamin-backup-$(date +%F).tar.gz data public/uploads .env.local
```

Восстановление:

```bash
tar -xzf ~/maxikamin-backup-YYYY-MM-DD.tar.gz -C /var/www/maxikamin
sudo systemctl restart maxikamin
```

---

## 11. Обновление сайта (релиз)

```bash
su - deploy
cd /var/www/maxikamin

# git pull   # или снова scp файлов

npm ci
npm run build
sudo systemctl restart maxikamin
```

> Не запускайте `db:seed:force` на бою без бэкапа — это перезапишет каталог.

---

## 12. Частые проблемы

| Симптом | Что проверить |
|--------|----------------|
| 502 Bad Gateway | `systemctl status maxikamin`, `journalctl -u maxikamin -f` |
| Certbot failed | DNS A-записи, порты 80/443 в UFW и у хостера |
| Админка не пускает | `.env.local`, `ADMIN_PASSWORD` / пароль из БД |
| Нет картинок после загрузки | права на `public/uploads`, `client_max_body_size` в Nginx; блок `location /uploads/` (см. выше) — без него Next отдаёт новые файлы только после `systemctl restart maxikamin` |
| SQLite readonly | владелец `deploy`, права на `data/` |

---

## Краткий чеклист

1. DNS A → VPS  
2. Node 22 + Nginx + UFW  
3. Код в `/var/www/maxikamin`  
4. `.env.local` с сильными секретами  
5. `npm ci && npm run db:seed && npm run build`  
6. systemd `maxikamin`  
7. Nginx → `127.0.0.1:3000`  
8. `certbot --nginx -d maxikamin.ru -d www.maxikamin.ru`  
9. Проверка HTTPS и `/admin`  
10. Бэкап `data/` + `public/uploads/`
