# LinkVault — Hệ Thống Quản Lý Link & Bookmark Cá Nhân (Chạy Local)

Hệ thống quản lý, phân loại, tìm kiếm và truy cập nhanh các liên kết cá nhân (Bookmark Manager) theo phong cách hiện đại (Raindrop/Raycast). Toàn bộ dữ liệu được lưu trữ an toàn 100% trên máy tính cá nhân của bạn qua SQLite.

---

## Cách Chạy Trên Máy Cục Bộ (Local)

### Cách 1: Chạy Bằng 1-Click (Khuyên Dùng)
- **Khởi động bằng Docker:** Nhấp đúp chuột vào file **`start.bat`** (trình duyệt sẽ tự động mở tại `http://localhost:3005`).
- **Dừng Docker:** Nhấp đúp chuột vào file **`stop.bat`**.
- **Khởi động không cần Docker (qua Node.js):** Nhấp đúp chuột vào file **`start-node.bat`** (mở tại `http://localhost:3000`).

---

### Cách 2: Chạy Bằng Dòng Lệnh Docker Compose
Mở PowerShell tại thư mục dự án và chạy:
```powershell
# Khởi động ngầm
docker compose up -d

# Xem log hoạt động
docker compose logs -f

# Dừng hệ thống
docker compose down
```
👉 Mở trình duyệt và truy cập: **`http://localhost:3005`**

> **Bảo toàn dữ liệu:** Toàn bộ dữ liệu danh mục và liên kết được lưu trữ bền vững trong thư mục `./data/links.db` trên máy của bạn. Khi tắt hoặc khởi động lại Docker, dữ liệu không bao giờ bị mất.

---

### Cách 3: Chạy Bằng Node.js Trực Tiếp
Nếu bạn không bật Docker Desktop:
```powershell
cd web-quan-ly-link
npm start
```
👉 Mở trình duyệt và truy cập: **`http://localhost:3000`**

---

## Tính Năng Giao Diện
- **Tìm kiếm thời gian thực:** Tìm nhanh liên kết theo tên hoặc URL (hỗ trợ phím tắt `/`).
- **Phân loại danh mục:** Tạo danh mục với mã màu sắc tùy chọn và biểu tượng (icons) phong phú.
- **Tự động nhận diện Favicon:** Tự động lấy icon trang web giúp nhận diện trực quan.
- **Thao tác 1-Click:** Sao chép liên kết vào clipboard hoặc mở tab mới an toàn.
- **Chế độ xem linh hoạt:** Hỗ trợ xem dạng Lưới (Grid) và Danh sách (List).
- **Giao diện Sáng / Tối (Dark / Light mode):** Chuyển đổi linh hoạt và tự động ghi nhớ tùy chọn.
