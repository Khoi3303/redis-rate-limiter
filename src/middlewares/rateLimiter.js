const redis = require('../config/redis');

const rateLimiter = (windowSec = 60, limit = 5) => {
    return async (req, res, next) => {
        try {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown_client';
            const key = `rate_limit:${ip}`;
            const currentTime = Date.now();
            const windowStartTime = currentTime - windowSec * 1000;

            // Pipeline REST của Upstash
            const p = redis.pipeline();
            p.zremrangebyscore(key, 0, windowStartTime);
            p.zadd(key, { score: currentTime, member: `${currentTime}` });
            p.zcard(key);
            p.expire(key, windowSec);

            const results = await p.exec();
            const requestCount = results[2]; // Số lượng request hiện tại

            res.setHeader('X-RateLimit-Limit', limit);
            res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - requestCount));

            if (requestCount > limit) {
                return res.status(429).json({
                    success: false,
                    message: 'Quá nhiều yêu cầu! Bạn đã bị giới hạn truy cập (Rate limit exceeded).',
                    retryAfterSeconds: windowSec
                });
            }

            next();
        } catch (error) {
            console.error('Lỗi Rate Limiter:', error.message);
            next(); // Fail-open: không chặn user nếu cache có sự cố
        }
    };
};

module.exports = rateLimiter;