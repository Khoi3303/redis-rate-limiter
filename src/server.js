require('dotenv').config();
const express = require('express');
// Nạp config redis ngay khi server khởi động
require('./config/redis');

const rateLimiter = require('./middlewares/rateLimiter');
const { getProducts } = require('./controllers/dataController');

const app = express();
app.use(express.json());

// Endpoint kiểm tra server sống
app.get('/', (req, res) => {
    res.send('API Rate Limiter & Redis Caching Service đang chạy!');
});

// Endpoint test Rate Limiter và Caching
app.get('/api/products', rateLimiter(60, 5), getProducts);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});