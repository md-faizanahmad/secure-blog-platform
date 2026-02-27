<h1>🔐 Secure Blog Platform – Backend</h1>

<p>
Production-ready backend for a Secure Blog Platform built using:
</p>

<ul>
  <li><strong>NestJS</strong> (latest stable)</li>
  <li><strong>TypeScript</strong> (strict mode enabled)</li>
  <li><strong>PostgreSQL</strong></li>
  <li><strong>Prisma ORM</strong></li>
  <li><strong>JWT Authentication</strong></li>
</ul>

<p>
This backend implements authentication, private blog management, public blog access, an optimized public feed, like system, and comment system with clean architecture and strong security practices.
</p>

<hr />

<h2>🚀 Setup Instructions</h2>

<h3>1️⃣ Clone Repository</h3>
<pre><code>git clone &lt;your-repo-url&gt;
cd backend</code></pre>

<h3>2️⃣ Install Dependencies</h3>
<pre><code>npm install</code></pre>

<h3>3️⃣ Environment Variables</h3>

<p>Create a <code>.env</code> file in the project root:</p>

<pre><code>DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secure_secret_key</code></pre>

<h3>4️⃣ Run Prisma Migration</h3>
<pre><code>npx prisma migrate dev</code></pre>

<p>This will:</p>
<ul>
  <li>Create database tables</li>
  <li>Apply constraints</li>
  <li>Generate Prisma Client</li>
</ul>

<h3>5️⃣ Start Development Server</h3>
<pre><code>npm run start:dev</code></pre>

<p>Server runs at:</p>
<pre><code>http://localhost:3000</code></pre>

<hr />

<h2>🏗 Architecture Overview</h2>

<h3>Modular, Feature-Based Structure</h3>

<pre><code>src/
├── auth/
├── users/
├── blogs/
├── public/
├── likes/
├── comments/
├── prisma/
├── common/
└── main.ts</code></pre>

<p>Each module contains:</p>
<ul>
  <li><strong>Controller</strong> – HTTP layer</li>
  <li><strong>Service</strong> – Business logic</li>
  <li><strong>DTOs</strong> – Validation layer</li>
</ul>

<p>
This structure ensures separation of concerns, scalability, maintainability, and testability.
</p>

<hr />

<h2>🔐 Authentication System</h2>

<ul>
  <li>Password hashing using <strong>bcrypt</strong></li>
  <li>JWT-based authentication</li>
  <li>Passport JWT strategy</li>
  <li>Guard-protected routes</li>
  <li><code>/auth/me</code> secured via validated JWT payload</li>
</ul>

<p><strong>Security Measures:</strong></p>
<ul>
  <li>No passwordHash exposure</li>
  <li>Proper 401 handling</li>
  <li>Strict DTO validation</li>
  <li>JWT secret loaded from environment variables</li>
</ul>

<hr />

<h2>🗄 Database Design (Prisma)</h2>

<p><strong>Core Models:</strong></p>
<ul>
  <li>User</li>
  <li>Blog</li>
  <li>Like</li>
  <li>Comment</li>
</ul>

<p><strong>Key Constraints:</strong></p>
<ul>
  <li><code>email</code> – Unique</li>
  <li><code>slug</code> – Unique</li>
  <li><code>@@unique([userId, blogId])</code> – Prevent duplicate likes</li>
  <li>Indexed <code>blogId</code> for optimized comment queries</li>
  <li>Cascade deletes for referential integrity</li>
</ul>

<p>
All integrity rules are enforced at the database level, not just in application logic.
</p>

<hr />

<h2>📝 Private Blog Management</h2>

<p>Authenticated users can:</p>
<ul>
  <li>Create blog</li>
  <li>Update blog (owner-only)</li>
  <li>Delete blog (owner-only)</li>
  <li>List own blogs</li>
</ul>

<p>
Ownership validation is enforced inside the service layer before any mutation.
</p>

<hr />

<h2>🌍 Public Blog Access</h2>

<p><code>GET /public/blogs/:slug</code></p>

<ul>
  <li>Only published blogs accessible</li>
  <li>Includes author basic information</li>
  <li>Includes like count</li>
  <li>Includes comment count</li>
  <li>Optimized Prisma query</li>
  <li>No N+1 query problem</li>
</ul>

<hr />

<h2>📢 Public Feed</h2>

<p><code>GET /public/feed?page=1&limit=10</code></p>

<ul>
  <li>Pagination enabled</li>
  <li>Sorted newest first</li>
  <li>Includes author info</li>
  <li>Includes like & comment counts</li>
  <li>Uses Prisma aggregation (<code>_count</code>)</li>
  <li>Optimized query strategy</li>
</ul>

<hr />

<h2>❤️ Like System</h2>

<ul>
  <li>Authentication required</li>
  <li>Database-level unique constraint prevents duplicates</li>
  <li>Composite unique key (<code>userId_blogId</code>)</li>
  <li>Returns updated like count</li>
</ul>

<hr />

<h2>💬 Comment System</h2>

<ul>
  <li>Authentication required for creation</li>
  <li>Sorted newest first</li>
  <li>Indexed by <code>blogId</code></li>
  <li>Includes author info</li>
  <li>No sensitive data exposed</li>
</ul>

<hr />

<h2>🛡 Security Practices</h2>

<ul>
  <li>Global validation pipe</li>
  <li>Whitelist & forbidNonWhitelisted enabled</li>
  <li>Strict DTO validation</li>
  <li>Ownership enforcement</li>
  <li>Proper HTTP status codes</li>
  <li>No sensitive data exposure</li>
  <li>Database-level constraints</li>
</ul>

<hr />

<h2>⚖ Tradeoffs</h2>

<ul>
  <li>Offset-based pagination instead of cursor-based (simpler implementation)</li>
  <li>No refresh tokens (kept authentication minimal)</li>
  <li>No background job processing</li>
  <li>No rate limiting (focused on core requirements)</li>
  <li>Hard deletes instead of soft deletes</li>
</ul>

<p>
The focus was correctness, clean architecture, and security rather than feature expansion.
</p>

<hr />

<h2>🔧 Future Improvements</h2>

<ul>
  <li>Cursor-based pagination</li>
  <li>Rate limiting</li>
  <li>Structured logging</li>
  <li>Refresh token rotation</li>
  <li>Redis caching</li>
  <li>Soft delete mechanism</li>
  <li>E2E tests</li>
  <li>Swagger API documentation</li>
  <li>CI/CD integration</li>
</ul>

<hr />

<h2>📈 Scaling Strategy (1M+ Users)</h2>

<ul>
  <li>Read replicas for scaling reads</li>
  <li>Proper indexing strategy</li>
  <li>Redis caching layer</li>
  <li>Stateless backend with horizontal scaling</li>
  <li>CDN caching for public content</li>
  <li>Async processing with queue workers</li>
  <li>Observability & monitoring tools</li>
</ul>

<hr />

<h2>📦 API Endpoints</h2>

<h3>Authentication</h3>
<ul>
  <li>POST /auth/register</li>
  <li>POST /auth/login</li>
  <li>GET /auth/me</li>
</ul>

<h3>Private Blogs</h3>
<ul>
  <li>POST /blogs</li>
  <li>PATCH /blogs/:id</li>
  <li>DELETE /blogs/:id</li>
  <li>GET /blogs/my</li>
</ul>

<h3>Public</h3>
<ul>
  <li>GET /public/blogs/:slug</li>
  <li>GET /public/feed</li>
</ul>

<h3>Likes</h3>
<ul>
  <li>POST /blogs/:id/like</li>
  <li>DELETE /blogs/:id/like</li>
</ul>

<h3>Comments</h3>
<ul>
  <li>POST /blogs/:id/comments</li>
  <li>GET /blogs/:id/comments</li>
</ul>

<hr />

<h2>🧠 Design Philosophy</h2>

<p>
This backend prioritizes:
</p>

<ul>
  <li>Clean modular architecture</li>
  <li>Strict TypeScript typing</li>
  <li>Database-level integrity</li>
  <li>Separation of concerns</li>
  <li>Secure API design</li>
  <li>Optimized queries</li>
  <li>No unnecessary overengineering</li>
</ul>

<p>
The primary focus was correctness, structure, and long-term scalability readiness.
</p>
