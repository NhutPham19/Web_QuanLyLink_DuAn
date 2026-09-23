# Hướng Dẫn Triển Khai LinkVault (Frontend lên Vercel + Backend lên Render)

Hệ thống đã được cấu hình tối ưu để triển khai theo mô hình:
- **Frontend:** Lưu trữ trên **Vercel** (Miễn phí, CDN toàn cầu, tốc độ tải tức thì).
- **Backend & Database:** Lưu trữ trên **Render.com** (hoặc Railway / Fly.io / VPS) có gắn ổ đĩa **Persistent Disk** để bảo toàn dữ liệu SQLite.

---

## Bước 1: Đẩy mã nguồn lên GitHub

Mở PowerShell tại thư mục dự án và chạy:
```bash
# Đổi tên nhánh sang main
git branch -M main

# Thêm remote GitHub của bạn (thay URL bên dưới bằng repo của bạn trên GitHub)
git remote add origin https://github.com/<username>/<repo-name>.git

# Push code lên GitHub
git push -u origin main
```

---

## Bước 2: Triển khai Backend lên Render.com (3 phút)

1. Đăng nhập vào [Render.com](https://render.com) (bằng tài khoản GitHub).
2. Nhấn nút **New +** -> Chọn **Web Service**.
3. Kết nối với repository GitHub vừa push ở Bước 1.
4. Điền các thông số:
   - **Name:** `linkvault-backend`
   - **Root Directory:** `web-quan-ly-link`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. **Cấu hình Ổ đĩa lưu SQLite (Quan trọng):**
   - Kéo xuống mục **Disks** (hoặc Advanced) -> Nhấn **Add Disk**:
     - **Name:** `linkvault-data`
     - **Mount Path:** `/app/data`
     - **Size:** `1 GB`
6. Nhấn **Deploy Web Service**.
7. Sau khi deploy xong, Render sẽ cấp cho bạn một đường dẫn (URL), ví dụ:
   👉 `https://linkvault-backend.onrender.com`
   *(Hãy kiểm tra bằng cách mở `https://linkvault-backend.onrender.com/health` -> nếu thấy `{"status":"ok"}` là backend đã sẵn sàng!)*

---

## Bước 3: Triển khai Frontend lên Vercel (1 phút)

1. Đăng nhập vào [Vercel.com](https://vercel.com) (bằng GitHub).
2. Nhấn **Add New...** -> Chọn **Project**.
3. Chọn repository LinkVault của bạn từ danh sách.
4. **Cấu hình Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** Nhấn **Edit** và chọn thư mục `frontend`.
5. **Thêm Biến Môi Trường (Environment Variables):**
   - **Name / Key:** `VITE_API_URL`
   - **Value:** Điền URL backend từ Bước 2 (ví dụ: `https://linkvault-backend.onrender.com`).
6. Nhấn nút **Deploy**!

🎉 **Hoàn tất!** Vercel sẽ tự động build và cấp domain cho giao diện (ví dụ: `https://linkvault-app.vercel.app`). Giao diện sẽ tự động kết nối và đồng bộ với backend SQLite!

---

## Tùy chọn: Deploy Frontend nhanh bằng Vercel CLI

Nếu không muốn dùng web dashboard, bạn có thể deploy trực tiếp từ terminal:
```powershell
cd frontend
npx vercel
```
Vercel CLI sẽ hỏi bạn liên kết tài khoản và tạo link deploy ngay lập tức!
