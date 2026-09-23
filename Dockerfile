# Multi-stage Dockerfile cho toàn bộ dự án LinkVault (Frontend + Backend)

# Stage 1: Build Frontend React với Vite
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Backend Node.js & Static File Server
FROM node:20-alpine
WORKDIR /app

# Cài đặt backend dependencies
COPY web-quan-ly-link/package*.json ./
RUN npm install --omit=dev

# Copy mã nguồn backend
COPY web-quan-ly-link/src/ ./src/

# Copy thành phẩm build từ frontend vào thư mục public của backend
COPY --from=frontend-builder /app/frontend/dist/ ./public/

# Volume lưu trữ SQLite database ngoài container (tránh mất dữ liệu khi restart)
VOLUME ["/app/data"]

ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/index.js"]
