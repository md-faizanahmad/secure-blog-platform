🔐Secure Blog Platform – Backend
Production-ready backend for a Secure Blog Platform built using:
NestJS (latest stable)
TypeScript (strict mode enabled)
PostgreSQL
Prisma ORM
JWT Authentication

This backend implements authentication, private blog management, public blog access, public feed with aggregation, like system, and comment system with clean architecture and proper security practices.

🚀 Setup Instructions:

1️⃣ Clone Repository
git clone <your-repo-url>
cd backend

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables

Create .env file in project root:

DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secure_secret_key

4️⃣ Run Prisma Migration
npx prisma migrate dev

This will:
Create database tables
Apply constraints
Generate Prisma client

5️⃣ Start Development Server
npm run start:dev

Server runs at:

http://localhost:3000

🏗 Architecture Explanation

1️⃣ Modular Feature-Based Structure

Each domain is isolated into its own module:

src/
├── auth/
├── users/
├── blogs/
├── public/
├── likes/
├── comments/
├── prisma/
├── common/
└── main.ts

Each module contains:

Controller (HTTP layer)
Service (business logic)
DTOs (validation)
Types (response contracts)

This ensures:
Clear separation of concerns
Scalability
Maintainability
Testability

2️⃣ Layer Responsibilities

Layer Responsibility
Controller Handles HTTP layer, guards, request mapping
Service Business logic and DB interaction
Prisma Database abstraction
DTOs Input validation
Types Output contract definitions

Controllers do not contain business logic.
All database access happens inside services.

3️⃣ Authentication System
Password hashing using bcrypt
JWT-based authentication
Passport JWT strategy
Guard-protected routes

/auth/me implemented using validated JWT payload

Security practices:
No passwordHash exposure
Proper 401 handling
Secure error responses
JWT secret validated at startup

4️⃣ Database Design (Prisma)

Core Models:
User
Blog
Like
Comment

Important Constraints:
email → unique
slug → unique

@@unique([userId, blogId]) in Like

blogId indexed in Comment
Cascade deletes for referential integrity
Integrity is enforced at database level, not just in code.

5️⃣ Private Blog Management

Authenticated users can:
Create blog
Update blog (owner-only)
Delete blog (owner-only)
List own blogs

Ownership is validated inside service layer before any mutation.

6️⃣ Public Blog Access
GET /public/blogs/:slug

Features:
Only published blogs accessible
Includes author basic info
Includes like count
Includes comment count
Single optimized Prisma query
Avoids N+1 problem

7️⃣ Public Feed (Optimized)
GET /public/feed?page=1&limit=10

Features:
Strict query validation
Pagination
Sorted newest first

Includes:
Author basic info
Like count
Comment count
Uses \_count aggregation
Uses Prisma $transaction
Avoids N+1 queries
Limit capped for safety

8️⃣ Like System

Auth required
DB-level unique constraint prevents duplicate likes
Composite unique key (userId_blogId)
Returns updated like count

9️⃣ Comment System

Auth required for creation
Sorted newest first
Indexed query by blogId
Includes author info
Clean response shape
No sensitive data exposed

🔐 Security Practices

Global validation pipe
whitelist enabled
forbidNonWhitelisted enabled
transform enabled
Strict DTO validation
Ownership enforcement
Proper HTTP status codes
No sensitive data exposure
DB constraints for integrity

⚖ Tradeoffs Made
Offset-based pagination instead of cursor-based
Simpler implementation
Good for moderate dataset size
Cursor pagination preferred for very large datasets
No refresh tokens
JWT access token only
Simpler auth flow
Could be extended for production-grade auth
No background jobs
No async summary generation
Could add queue system later (BullMQ / Redis)
No rate limiting
Not implemented to keep scope aligned with core requirements
Hard deletes
No soft delete mechanism
Could be added for audit requirements
Focus was correctness, clean architecture, and security over feature expansion.

🔧 What I Would Improve

Implement cursor-based pagination
Add rate limiting (authentication + public feed)
Add structured logging (Pino)
Introduce refresh token rotation
Add Redis caching for public feed
Implement soft deletes with audit trails

Add E2E tests
Add OpenAPI documentation (Swagger)
Introduce role-based access system
Add CI/CD pipeline with automated linting & testing

📈 How I Would Scale to 1M Users

1️⃣ Database Scaling

Use read replicas
Partition large tables
Introduce proper indexing strategy
Move to cursor pagination

2️⃣ Caching Layer

Redis for:
Public feed
Blog details
Like counts

3️⃣ Horizontal Scaling

Stateless authentication using JWT
Deploy multiple backend instances behind load balancer

4️⃣ CDN

Cache public blog responses at CDN level

5️⃣ Async Processing

Use queue system (BullMQ + Redis)
Move heavy operations to background workers

6️⃣ Observability

Structured logging
Centralized log aggregation
Metrics & monitoring (Prometheus + Grafana)

📦 API Endpoints
Authentication

POST /auth/register
POST /auth/login
GET /auth/me

Private Blogs
POST /blogs
PATCH /blogs/:id
DELETE /blogs/:id
GET /blogs/my

Public
GET /public/blogs/:slug
GET /public/feed

Likes
POST /blogs/:id/like
DELETE /blogs/:id/like

Comments
POST /blogs/:id/comments
GET /blogs/:id/comments

🧠 Design Philosophy

This backend prioritizes:
Clean architecture
Strict TypeScript typing
Database-level integrity
Clear separation of concerns
Secure API design
Optimized queries
No unnecessary overengineering
The focus was correctness, structure, and scalability readiness.
