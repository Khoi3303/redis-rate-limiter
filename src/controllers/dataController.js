const redis = require('../config/redis');

const getProducts = async (req, res) => {
    const cacheKey = 'cache:products';

    try {
        // Upstash REST tự parse JSON nếu lưu dạng object
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                success: true,
                source: 'REDIS_CACHE (Tốc độ phản hồi tức thì)',
                data: cachedData
            });
        }

        // Giả lập truy vấn Database nặng mất 1.5 giây
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const products = [
            { id: 1, name: 'Laptop Dell Latitude', price: 1200 },
            { id: 2, name: 'Bàn phím cơ Custom', price: 150 },
            { id: 3, name: 'Màn hình 27 inch 2K', price: 350 }
        ];

        // Lưu vào Redis với TTL 30 giây
        await redis.set(cacheKey, products, { ex: 30 });

        return res.status(200).json({
            success: true,
            source: 'DATABASE_QUERY (Chậm, mất 1.5s)',
            data: products
        });
    } catch (error) {
        console.error('Lỗi Data Controller:', error.message);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

module.exports = {
    getProducts
};