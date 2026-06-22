# Security Audit Log Dashboard

A full-stack security operations dashboard for uploading, searching, filtering, sorting, and investigating system audit logs at scale (100,000+ records).

**Stack:** React (Vite) + Tailwind CSS · Node.js + Express · MongoDB (Mongoose)

---

## 1. Project Structure

```
security-audit-dashboard/
├── server/                 # Express API
│   ├── src/
│   │   ├── config/         # DB connection, constants
│   │   ├── controllers/    # HTTP request handlers
│   │   ├── services/       # Business logic (query building, bulk insert)
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   ├── middlewares/    # Error handling, rate limiting, validation, upload
│   │   ├── utils/          # ApiError, asyncHandler, validators, seed script
│   │   └── app.js          # Express app wiring
│   ├── server.js           # Entry point
│   └── .env.example
│
└── client/                 # React (Vite) frontend
    ├── src/
    │   ├── components/     # StatCard, FilterPanel, LogTable, UploadDropzone, etc.
    │   ├── pages/           # DashboardPage, UploadPage
    │   ├── layouts/         # DashboardLayout (header)
    │   ├── hooks/           # useLogs, useDebounce
    │   ├── services/        # apiClient, logService (axios)
    │   └── App.jsx
    └── .env.example
```

---

## 2. Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB instance)

---

## 3. Backend Setup

```bash
cd server
cp .env.example .env
# edit .env and set MONGO_URI to your Atlas connection string
npm install
npm run dev         
```


```bash
npm run seed -- 10000   # generates 10,000 sample audit log records
```

### Environment Variables (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | API port (default 5000) |
| `MONGO_URI` | MongoDB Atlas / local connection string |
| `CLIENT_ORIGIN` | Comma-separated list of allowed CORS origins |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window per IP |
| `MAX_BULK_RECORDS` | Max records accepted per bulk upload (default 20,000) |
| `BULK_INSERT_BATCH_SIZE` | Batch size used for `insertMany` (default 1,000) |

---

## 4. Frontend Setup

```bash
cd client
cp .env.example .env
# edit .env if your API is not on http://localhost:5000/api
npm install
npm run dev          # starts on http://localhost:5173
```

---

## 5. API Reference

### `GET /api/health`
Health check.

### `GET /api/logs`
Server-side paginated, filtered, sorted log listing.

Query parameters:

| Param | Example | Description |
|---|---|---|
| `page` | `1` | Page number (default 1) |
| `limit` | `50` | Page size, max 200 |
| `sortBy` | `timestamp` | Any log field |
| `order` | `desc` | `asc` or `desc` |
| `search` | `priya` | Global search across actor, action, resource, ipAddress |
| `severity` | `HIGH` | `LOW`/`MEDIUM`/`HIGH`/`CRITICAL` |
| `status` | `Unresolved` | `Resolved`/`Unresolved`/`Investigating`/`Ignored` |
| `role` | `admin` | Exact match |
| `action` | `DELETE_USER` | Exact match (case-insensitive, stored uppercase) |
| `region` | `ap-south-1` | Exact match |
| `startDate` / `endDate` | ISO date | Filters on `timestamp` |

Response:

```json
{
  "success": true,
  "data": [ /* log documents */ ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "totalCount": 12345,
    "totalPages": 247,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### `GET /api/logs/stats`
Returns dashboard stat-card aggregates (`totalLogs`, `highSeverityLogs`, `resolvedLogs`, `unresolvedLogs`) computed via a single `$facet` aggregation.

### `GET /api/logs/filter-options`
Returns distinct `actions`, `roles`, and `regions` currently present in the collection, used to populate filter dropdowns.

### `POST /api/logs/bulk-upload`
`multipart/form-data` with a `file` field containing a JSON array of log records (supports 10,000+ records per request, capped by `MAX_BULK_RECORDS`).

Each record must contain:

```json
{
  "actor": "priya.sharma",
  "role": "admin",
  "action": "DELETE_USER",
  "resource": "user-4821",
  "resourceType": "User",
  "ipAddress": "192.168.10.4",
  "region": "ap-south-1",
  "severity": "HIGH",
  "status": "Unresolved",
  "timestamp": "2026-06-01T10:23:00Z"
}
```

Response:

```json
{
  "success": true,
  "insertedCount": 10000,
  "failedCount": 0
}
```

Invalid records are skipped individually (not the whole batch); failures are summarized in `failedCount` with a capped `sampleFailures` array for debugging.

## 6. Performance Notes

- Indexes exist on `actor`, `action`, `severity`, `status`, `timestamp` (single-field) plus compound indexes on common filter+sort combinations (`severity+timestamp`, `status+timestamp`, `region+timestamp`) and a weighted text index for search.
- All filtering, searching, sorting, and pagination happen server-side via Mongoose query + `$facet` aggregation — never in React.
- `.lean()` is used on read queries to skip Mongoose document hydration overhead.
- Bulk uploads use batched `insertMany({ ordered: false })` so a single malformed record doesn't block the rest of the batch.

---

## 7. Deployment

### Frontend → Vercel
1. Push the `client/` folder to a GitHub repo (or import the monorepo and set the root directory to `client`).
2. In Vercel project settings, set the build command to `npm run build` and output directory to `dist`.
3. Add environment variable `VITE_API_BASE_URL` pointing to your deployed backend (e.g. `https://your-api.onrender.com/api`).

### Backend → Render / Railway
1. Create a new Web Service pointing at the `server/` directory.
2. Build command: `npm install`. Start command: `npm start`.
3. Add environment variables from `server/.env.example` (`MONGO_URI`, `CLIENT_ORIGIN` set to your Vercel domain, etc.).

### Database → MongoDB Atlas
1. Create a free or dedicated cluster.
2. Create a database user and whitelist your backend host's IP (or `0.0.0.0/0` for simplicity in non-production setups).
3. Copy the connection string into `MONGO_URI`.


## 8. Security Measures Implemented

- `helmet` for secure HTTP headers
- Strict `cors` allow-list driven by `CLIENT_ORIGIN`
- Global and bulk-upload-specific rate limiting (`express-rate-limit`)
- Request validation (`express-validator`) on all query parameters
- Centralized error middleware that never leaks stack traces in production
- All secrets/config sourced from environment variables, never hardcoded
