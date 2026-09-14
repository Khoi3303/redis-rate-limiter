const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(process.cwd(), '.env') });

const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Kiểm tra kết nối ngay lập tức qua HTTP REST
redis.ping()
  .then((res) => console.log(`✅ Kết nối Upstash Redis (REST) thành công: ${res}`))
  .catch((err) => console.error('❌ Lỗi Upstash Redis:', err.message));

module.exports = redis;