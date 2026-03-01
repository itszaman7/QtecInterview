# QuickHire - Job Board Platform

A modern, full-stack Job Board application built with a premium-crafted user interface and a robust relational database backend. This platform facilitates seamless connections between job seekers, employers, and administrators.

![QuickHire Preview](./1.2%20Landing%20Page.png)

## 🚀 Tech Stack

### Frontend Architecture
Built for performance, SEO, and developer experience.
* **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server/Client components)
* **Library:** [React 19](https://react.dev/)
* **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/) for fluid, dynamic interactions
* **Forms & Validation:** SweetAlert2 for beautiful alerts and user feedback
* **Utilities:** `pdf-lib` for client-side PDF resume compression

### Backend Architecture
Designed for scalability, data integrity, and strict security.
* **Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js v5](https://expressjs.com/)
* **Database ORM:** [Sequelize](https://sequelize.org/)
* **Database Engine:** MySQL / TiDB Cloud (with `utf8mb4_bin` collation support for precise searching)
* **Authentication:** Stateless JSON Web Tokens (JWT) stored securely in `HttpOnly` cookies
* **Validation:** [Zod](https://zod.dev/) for strict schema parsing and payload validation
* **Security:** `bcryptjs` for password hashing, `cors` for cross-origin security

---

## ✨ Core Features & Functionality

### 1. Unified Authentication System
* **Role-Based Access Control (RBAC):** Distinct roles for `Applicant`, `Company`, and `Admin`.
* **Cookie-Based Security:** JWT tokens are stored in `HttpOnly` cookies, protecting against XSS attacks.
* **Persistent Sessions:** Middleware automatically validates tokens on protected routes.

### 2. Job Seeker (Applicant) Portal
* **Advanced Job Search:** Dual-input search (Keyword/Title & Location) with case-insensitive robust querying.
* **Smart Filtering:** Filter by job category (e.g., Technology, Design) and job type (Full-Time, Remote).
* **Application Management:** One-click apply with automated client-side PDF compression to save bandwidth and storage.
* **Dashboard:** Track applied jobs and profile completion strength.

### 3. Employer (Company) Portal
* **Job Management:** Create, read, update, and delete (CRUD) job listings.
* **Applicant Tracking:** View incoming applications, review resumes, and update applicant statuses (e.g., Pending, Interview, Rejected).
* **Company Profile:** Manage company details, logo, website, and industry information.

### 4. Admin Portal
* **Company Verification:** Companies must be reviewed and verified by an Admin before their job postings go live. Promotes platform trust and quality.
* **System Monitoring:** Seed script ensures a secure Admin root account exists upon deployment.

---

## 🔌 API Documentation

The backend exposes a highly structured RESTful API.

### Authentication Endpoints
* `POST /api/users/register` - Create an applicant account
* `POST /api/users/login` - Applicant login (Sets HttpOnly cookie)
* `POST /api/company/register` - Create an employer account
* `POST /api/company/login` - Employer login (Sets HttpOnly cookie)
* `POST /api/admin/login` - Admin login (Sets HttpOnly cookie)

### Job Endpoints
* `GET /api/jobs` - List all active, verified jobs (Supports `?title=`, `?location=`, `?category=`, `?type=` queries)
* `GET /api/jobs/:id` - Fetch detailed job information along with similar suggested jobs
* `POST /api/company/jobs` - (Company Only) Create a new job posting
* `PUT /api/company/jobs/:id` - (Company Only) Update job details
* `DELETE /api/company/jobs/:id` - (Company Only) Remove a job posting

### Application Endpoints
* `POST /api/applications` - (Applicant Only) Apply to a job, supplying resume and cover note
* `GET /api/company/jobs/:id/applicants` - (Company Only) View all applicants for a specific job
* `PUT /api/company/jobs/applications/:id/status` - (Company Only) Update an applicant's status

### Admin Endpoints
* `GET /api/admin/companies` - (Admin Only) List all registered companies
* `PATCH /api/admin/companies/:id/verify` - (Admin Only) Approve a company's verification status

---

## 🛠️ Project Structure

The repository is structured as a monorepo containing both the frontend and backend applications to streamline development.

```text
/NashitaPharmaPOS
├── /jobboard_backend        # Express.js API Server
│   ├── /src
│   │   ├── /config          # Database (Sequelize) & general configuration
│   │   ├── /controllers     # Request logic & business rules
│   │   ├── /middlewares     # Auth, error handling, Zod validation
│   │   ├── /models          # Sequelize ORM schema definitions 
│   │   ├── /routes          # Express route definitions
│   │   └── /scripts         # Database seeding (e.g., seedAdmin.js)
│   ├── .env                 # Environment variables (DB credentials, JWT Secret)
│   └── package.json
│
└── /qtecinterview           # Next.js 16 Frontend application
    ├── /src
    │   ├── /app             # Next.js App Router (Pages, Layouts)
    │   ├── /components      # Reusable UI architecture (Layout, UI, Jobs)
    │   └── /lib             # Utility functions, API wrappers (api.js)
    ├── next.config.mjs      # Next.js build configuration
    ├── tailwind.config.ts   # Design system tokens
    └── package.json
```

---

## 💻 Getting Started (Local Development)

### 1. Database Setup
Ensure you have a MySQL or TiDB server running locally or externally.

### 2. Backend Setup
1. Navigate to the backend directory: `cd jobboard_backend`
2. Install dependencies: `pnpm install` (or `npm install`)
3. Create a `.env` file based on `.env.example` and fill in:
   * `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   * `JWT_SECRET` (Use a strong random string)
   * `PORT` (Default `5000`)
4. Start the server: `pnpm run dev`
   *(Note: The database tables automatically sync via Sequelize on startup)*
5. **(Optional)** Seed the admin account: `node src/scripts/seedAdmin.js`

### 3. Frontend Setup
1. Navigate to the frontend directory: `cd qtecinterview`
2. Install dependencies: `pnpm install` (or `npm install`)
3. **Important:** The frontend proxies requests to `:5000` via the Next.js config or hardcoded `API_BASE` in `/lib/api.js`. Ensure they point to your running backend.
4. Start the development server: `pnpm dev`
5. Visit `http://localhost:3000` to view the application!

---

## 💡 Engineering Decisions & Architecture

1. **Client vs Server Components:** Leveraged Next.js 16 App Router heavily. Stateful components requiring animations (Framer Motion) or hooks were explicitly marked with `'use client'`, while layout files take advantage of server-side data fetching where applicable.
2. **HttpOnly Cookies for Auth:** Instead of localized `localStorage` JWTs, the system sets tokens as HTTP-only cookies securely handled by the backend, drastically reducing the Attack Surface regarding XSS.
3. **Database Normalization:** Relational models between `Users`, `Companies`, `Jobs`, and `Applications` ensure strict referential integrity with cascading deletes (e.g. deleting a Job also clears its Applications).
4. **Resilient Error Handling:** Global error catching on both Node.js (via Express middleware) and Next.js ensures the user is gracefully informed (e.g. via SweetAlert or native UI banners) rather than experiencing hard crashes.
