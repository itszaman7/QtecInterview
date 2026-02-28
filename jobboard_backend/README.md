# QuickHire — Backend API

RESTful API for the QuickHire job board, built with Node.js, Express, Sequelize (MySQL/TiDB Cloud), Zod validation, and JWT cookie authentication.

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment variables (see .env.example below)
cp .env.example .env   # then edit values

# 3. Seed the admin user
node src/scripts/seedAdmin.js

# 4. Start dev server
pnpm run dev
```

## Required `.env` Variables

```env
PORT=5000
DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=your_tidb_user
DB_PASSWORD=your_tidb_password
DB_NAME=test
JWT_SECRET=your_random_secret_key
JWT_EXPIRES_IN=7d
# Optional:
# DB_CA_PATH=C:/path/to/ca.pem
# ADMIN_EMAIL=admin@quickhire.com
# ADMIN_PASSWORD=Admin@123
# CORS_ORIGIN=http://localhost:3000
```

## API Endpoints

### Auth

| Method | Endpoint           | Auth | Description            |
|--------|--------------------|------|------------------------|
| POST   | `/api/auth/login`  | ❌   | Login → sets cookie    |
| POST   | `/api/auth/logout` | ❌   | Logout → clears cookie |
| GET    | `/api/auth/me`     | ✅   | Get current admin      |

### Jobs

| Method | Endpoint        | Auth | Description                            |
|--------|-----------------|------|----------------------------------------|
| GET    | `/api/jobs`     | ❌   | List all jobs (?category=X&location=Y) |
| GET    | `/api/jobs/:id` | ❌   | Get job + its applications             |
| POST   | `/api/jobs`     | ✅   | Create a job listing                   |
| DELETE | `/api/jobs/:id` | ✅   | Delete job + cascade applications      |

### Applications

| Method | Endpoint             | Auth | Description           |
|--------|----------------------|------|-----------------------|
| POST   | `/api/applications`  | ❌   | Submit an application |

### Health

| Method | Endpoint   | Description    |
|--------|------------|----------------|
| GET    | `/health`  | Health check   |

## Project Structure

```
src/
├── app.js                    # Express app entry
├── config/
│   └── database.js           # Sequelize + TiDB config
├── controllers/
│   ├── authController.js     # Login, logout, getMe
│   ├── jobController.js      # CRUD jobs
│   └── applicationController.js
├── middleware/
│   ├── auth.js               # JWT cookie verification
│   ├── errorHandler.js       # Global error handler
│   ├── schemas.js            # Zod schemas
│   └── validate.js           # Zod middleware factory
├── models/
│   ├── Admin.js              # Admin (bcrypt)
│   ├── Application.js        # Application (FK → Job)
│   └── Job.js                # Job listing
├── routes/
│   ├── authRoutes.js
│   ├── jobRoutes.js
│   └── applicationRoutes.js
└── scripts/
    └── seedAdmin.js          # Create first admin
```
