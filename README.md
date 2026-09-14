# High-Performance API Rate Limiter & Caching Service

A robust, cloud-native backend microservice demonstrating **API Traffic Control** and **Data Caching Strategies** built with **Node.js**, **Express**, and **Upstash Redis (Serverless/REST)**.

---

## 🚀 Key Features & Architectural Highlights

### 1. Sliding Window Counter Rate Limiting
- **Mechanism**: Implemented using Redis Sorted Sets (`ZADD`, `ZREMRANGEBYSCORE`, `ZCARD`) within an atomic pipeline.
- **Advantage**: Prevents traffic bursts at window boundaries (a critical flaw in traditional Fixed Window algorithms).
- **Graceful Degradation (Fail-Open)**: Ensures upstream user traffic remains uninterrupted even during temporary cache outages.
- **RFC Standards**: Attaches `X-RateLimit-Limit` and `X-RateLimit-Remaining` headers to every response.

### 2. Cache-Aside (Lazy Loading) Pattern
- **Latency Optimization**: Cuts response times from **~1,500ms** (heavy database simulation) down to **<20ms** on cache hits.
- **TTL Expiration**: Automatically invalidates cached datasets after a specified time to maintain data freshness.

### 3. Serverless Redis Integration
- Built on top of **`@upstash/redis`** (HTTP/REST protocol), eliminating TCP keep-alive issues, idle connection resets, and TLS handshake overhead common in edge/serverless environments.

---

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database / Cache**: Upstash Redis (Serverless REST API)
- **Environment Management**: Dotenv

---

## 📦 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone [https://github.com/](https://github.com/)<your-username>/redis-rate-limiter-api.git
cd redis-rate-limiter-api
npm install
```

### 2. Environment Variables Setup
Create a `.env` file in the root directory:
```env
PORT=5000
UPSTASH_REDIS_REST_URL="your_upstash_rest_url"
UPSTASH_REDIS_REST_TOKEN="your_upstash_rest_token"
```

### 3. Run Development Server
```bash
npm run dev
```

---

## 🧪 Verification & Benchmarks

| Scenario | Request | Source | Latency | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| **First Hit (Cold)** | `GET /api/products` | `DATABASE_QUERY` | ~1,500ms | `200 OK` |
| **Second Hit (Warm)** | `GET /api/products` | `REDIS_CACHE` | <20ms | `200 OK` |
| **Exceed Limit (Spam)** | 6th Request within 60s | Blocked by Middleware | ~5ms | `429 Too Many Requests` |
