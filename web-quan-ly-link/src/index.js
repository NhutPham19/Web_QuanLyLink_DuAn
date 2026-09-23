const express = require('express');
const cors = require('cors');
const { init } = require('./database');

const categoriesRouter = require('./routes/categories');
const linksRouter = require('./routes/links');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/categories', categoriesRouter);
app.use('/api/links', linksRouter);

const path = require('path');
const fs = require('fs');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const DIST_DIR = path.join(__dirname, '..', '..', 'frontend', 'dist');
const STATIC_DIR = fs.existsSync(PUBLIC_DIR) ? PUBLIC_DIR : (fs.existsSync(DIST_DIR) ? DIST_DIR : null);

if (STATIC_DIR) {
  app.use(express.static(STATIC_DIR));
}

app.use((req, res, next) => {
  if (req.method === 'GET' && STATIC_DIR && !req.path.startsWith('/api') && !req.path.startsWith('/health')) {
    return res.sendFile(path.join(STATIC_DIR, 'index.html'));
  }
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} không tồn tại` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Lỗi server' });
});

// Khởi tạo DB rồi mới start server
init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Không thể khởi tạo database:', err.message);
    process.exit(1);
  });
