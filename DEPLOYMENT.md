# Hướng Dẫn Triển Khai LinkVault (Vercel + Koyeb + Turso)

Kiến trúc triển khai tối ưu 100% Free & Hiệu năng cao:
- **Database:** **Turso (LibSQL)** — SQLite trên Cloud, datacenter Singapore (`sin`), tốc độ phản hồi cực nhanh (<15ms), 500 DBs miễn phí vĩnh viễn, không lo mất dữ liệu khi backend restart.
- **Backend:** **Koyeb** — Free Tier chạy container liên tục, không tính giờ như Render, hỗ trợ kết nối trực tiếp Turso.
- **Frontend:** **Vercel** — Global Edge CDN, deploy tự động từ nhánh GitHub, miễn phí và tốc độ tải trang tức thì.

---

## 1. Thiết lập Database Turso (Đã sẵn sàng mã nguồn)

1. Đăng nhập [Turso Dashboard](https://turso.tech).
2. Tạo database:
   - **Name:** `web-quan-ly-link`
   - **Location:** `Singapore (sin)`
3. Lấy thông tin kết nối từ giao diện:
   - **Database URL:** dạng `libsql://web-quan-ly-link-<username>.turso.io`
   - **Auth Token:** Nhấn nút **Create Token** -> Sao chép chuỗi Token bí mật.
4. Tạo file `.env` tại thư mục gốc hoặc `web-quan-ly-link/`:
   ```env
   TURSO_DATABASE_URL=libsql://web-quan-ly-link-<username>.turso.io
   TURSO_AUTH_TOKEN=eyJhbGciOi...
   ```
5. *(Tùy chọn)* Đẩy toàn bộ dữ liệu SQLite hiện tại lên Turso Cloud:
   ```bash
   cd web-quan-ly-link
   npm run sync:turso
   ```

---

## 2. Triển khai Backend lên Koyeb (Khi bạn sẵn sàng)

1. Đăng nhập [Koyeb.com](https://www.koyeb.com) bằng GitHub.
2. Nhấn **Create App** -> Chọn **GitHub**.
3. Chọn repository: `NhutPham19/Web_QuanLyLink_DuAn`.
4. Cấu hình triển khai:
   - **Work directory:** `web-quan-ly-link`
   - **Build Command:** `npm install`
   - **Run Command:** `npm start`
   - **Ports:** `3000` (hoặc match PORT trong env)
5. Thêm biến môi trường (**Environment Variables**):
   - `TURSO_DATABASE_URL`: `libsql://...turso.io`
   - `TURSO_AUTH_TOKEN`: `<your-token>`
   - `PORT`: `8000` (hoặc để mặc định của Koyeb)
6. Nhấn **Deploy**. Koyeb sẽ cấp URL cho bạn (ví dụ: `https://web-quan-ly-link-nhutpham.koyeb.app`).
   - Kiểm tra API tại: `https://web-quan-ly-link-nhutpham.koyeb.app/health` -> Nhận `{"status":"ok"}`.

---

## 3. Triển khai Frontend lên Vercel

1. Đăng nhập [Vercel.com](https://vercel.com) bằng GitHub.
2. Nhấn **Add New...** -> **Project**.
3. Chọn repo `NhutPham19/Web_QuanLyLink_DuAn`.
4. Cấu hình:
   - **Framework Preset:** Vite
   - **Root Directory:** Chọn `frontend`
5. Thêm biến môi trường (**Environment Variables**):
   - `VITE_API_URL`: Điền URL backend từ Koyeb (ví dụ: `https://web-quan-ly-link-nhutpham.koyeb.app`)
6. Nhấn **Deploy**.

---

## 4. Chạy Local (Offline / Phát triển nội bộ)

- Nếu **không có** `TURSO_DATABASE_URL`, hệ thống tự động dùng file SQLite cục bộ tại `data/links.db`.
- Khởi chạy nhanh bằng file script:
  - `start.bat`: Chạy toàn bộ hệ thống bằng Docker.
  - `start-node.bat`: Chạy trực tiếp bằng Node.js (cổng `3005`).
