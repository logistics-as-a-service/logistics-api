# Logistic As A Service 1.0

## Logistic Engine Endpoints

```
Base URL : http://localhost:3000
```

### ENV variables

```
NODE_ENV=development
BASE_URL=http://localhost
SERVER_PORT=3080

NODE_CONFIG_DIR=./src/configs

DB_TYPE=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=logistics-service

JWT_SECRET=c6497e90-3395-11ea-abf8-e76362653adb
JWT_REFRESH_SECRET=20816690-1585-11ea-b7ed-857b3beaa6ef

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

```

**To start server**

```
npm run start:dev
```
