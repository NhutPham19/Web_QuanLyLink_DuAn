# Web Quản Lý Link — Backend

## Cách chạy

```bash
# Build & chạy
docker compose up -d

# Xem logs
docker compose logs -f

# Dừng
docker compose down
```

Server chạy tại: `http://localhost:3000`

---

## API Reference

### Health Check
```
GET /health
```

---

### Categories

#### Lấy tất cả categories
```
GET /api/categories
```
Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Công việc",
      "color": "#6366f1",
      "icon": "briefcase",
      "created_at": "2024-01-01 00:00:00",
      "link_count": 5
    }
  ]
}
```

#### Tạo category mới
```
POST /api/categories
Content-Type: application/json

{
  "name": "Công việc",
  "color": "#6366f1",
  "icon": "briefcase"
}
```

#### Cập nhật category
```
PUT /api/categories/:id
Content-Type: application/json

{
  "name": "Công việc",
  "color": "#f59e0b",
  "icon": "star"
}
```

#### Xóa category
```
DELETE /api/categories/:id
```
> Khi xóa category, các link thuộc category đó sẽ có `category_id = null`

---

### Links

#### Lấy tất cả links
```
GET /api/links
```

#### Lấy links theo category
```
GET /api/links?category_id=1
```

#### Tìm kiếm
```
GET /api/links?search=github
GET /api/links?category_id=1&search=github
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "GitHub",
      "url": "https://github.com",
      "category_id": 1,
      "category_name": "Công việc",
      "category_color": "#6366f1",
      "category_icon": "briefcase",
      "created_at": "2024-01-01 00:00:00"
    }
  ]
}
```

#### Tạo link mới
```
POST /api/links
Content-Type: application/json

{
  "name": "GitHub",
  "url": "https://github.com",
  "category_id": 1
}
```

#### Cập nhật link
```
PUT /api/links/:id
Content-Type: application/json

{
  "name": "GitHub (mới)",
  "url": "https://github.com",
  "category_id": 2
}
```

#### Xóa link
```
DELETE /api/links/:id
```

---

## Cấu trúc project

```
web-quan-ly-link/
├── src/
│   ├── index.js          # Entry point
│   ├── database.js       # SQLite setup
│   └── routes/
│       ├── categories.js
│       └── links.js
├── data/                 # SQLite file (tự tạo khi chạy)
│   └── links.db
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Error Response

Tất cả lỗi trả về format:
```json
{
  "success": false,
  "message": "Mô tả lỗi"
}
```
