# Монгол Дэлгүүр — Taobao Store

Taobao API ашиглан бүтээгдэхүүн татаж, Монгол хэл рүү орчуулан харуулдаг дэлгүүр.

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** Vanilla JS + Tailwind CSS
- **Database:** PostgreSQL (Docker)
- **API:** Taobao via RapidAPI
- **Translation:** MyMemory API (zh → mn)

## Эхлүүлэх

### 1. .env тохиргоо

```bash
cp .env.example .env
```

`.env` файлд `TAOBAO_API_KEY`-г тавина (RapidAPI-аас авна).

### 2. Docker ажиллуулах

```bash
docker-compose up -d
```

### 3. Хөтчөөр нээх

```
http://localhost:3000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | Хадгалагдсан бүтээгдэхүүнүүд |
| POST | `/api/products/search` | Taobao-оос хайж татах |
| GET | `/api/products/:id` | Нэг бүтээгдэхүүний дэлгэрэнгүй |

## Хавтас бүтэц

```
├── server/
│   ├── index.js          # Express app
│   ├── db/               # PostgreSQL connection + schema
│   ├── routes/           # API routes
│   └── services/         # Taobao API + Translator
├── public/               # Vanilla JS + Tailwind frontend
├── docker-compose.yml
└── Dockerfile
```
