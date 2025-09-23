# HireWire – Job Tracker (Mini ATS)

A showcase full-stack application to log, track and analyze job applications. This repository contains a .NET Web API backend and a React + Vite frontend with a modern Tailwind-based UI.

Quick summary of what was added since initial scaffold:

- JWT authentication (register/login) with server-issued tokens
- Role-based access control (User / Admin) and an Admin API + UI
- Owner-scoped data: each Job is owned by a user (OwnerId) and users only see/modify their own jobs unless Admin
- Admin features: list users, change user role, delete users, remove any job
- Candidate model & resume uploads: create candidates, upload resume files (saved to wwwroot/uploads), preview resumes in the UI
- Candidate ↔ Job linking: Job records store CandidateId + CandidateName when linked
- Server-side file serving for uploaded resumes (absolute URLs returned)
- EF Core migrations applied for all schema changes (seeded admin user on startup)
- UI: "luxury" Tailwind theme, dark-mode with theme toggle, glass inputs, cards, animations, resume preview modal, and accessibility improvements
- Modal portal & pointer-events fixes so modals aren't clipped or block background interactions unexpectedly

Technologies
- Backend: .NET 9 (ASP.NET Core), Entity Framework Core, SQL Server, JWT
- Frontend: React + TypeScript, Vite, Tailwind CSS
- Other: Git (feature branches used), PostCSS/Tailwind, Heroicons

Repository layout
- hirewire.client/ — React + Vite frontend (src/, public/, index.html)
- HireWire.Server/ — ASP.NET Core Web API (Controllers/, Data/, Models/, Migrations/)

New/Updated Backend Features (HireWire.Server)
- AuthenticationController
  - Register and Login endpoints
  - Login returns JWT and user id; token contains NameIdentifier and Role claims
- AdminController (Admin-only)
  - GET /api/admin/users — list users
  - POST /api/admin/users/{id}/role — change role
  - DELETE /api/admin/users/{id} — delete user
- JobsController
  - Jobs are owner-scoped: non-admin users only see/manage their jobs
  - CreateJob sets OwnerId and OwnerUsername
  - UpdateJob enforces owner-or-admin permissions
  - DELETE /api/jobs/{id} requires Admin role (admin delete retained)
  - Jobs now include CandidateId and CandidateName when linked
- CandidatesController (new)
  - CRUD for candidates
  - POST /api/candidates/{id}/uploadResume — accepts multipart/form-data and stores file to wwwroot/uploads
  - Resume URLs are returned as absolute URLs so frontend can preview directly
- ApplicationDbContext
  - DbSet<Candidate> added; Jobs and Candidates mappings updated for new columns
- Program.cs
  - db.Database.Migrate() used at startup
  - Admin user seeded from configuration (Admin:Username & Admin:Password)

Migrations
- Migrations were added and applied for:
  - User role column
  - Candidates table
  - Job Candidate columns (CandidateId, CandidateName)

New/Updated Frontend Features (hirewire.client)
- AuthContext
  - Persists token, role, userId in localStorage and exposes isAuthenticated/isAdmin helpers
- Theme handling
  - ThemeToggle + useTheme hook implement class-based dark mode and early init to avoid flash
- JobService & CandidateService
  - AuthFetch uses Authorization header with token from localStorage
  - New endpoints: getCandidates, createCandidate, uploadResume, admin user endpoints
- Pages & Components
  - Login/Signup: redirects when already authenticated
  - PrivateRoute: protects routes and enforces requiredRole
  - Candidates page: create, upload resume, preview (ResumeViewer)
  - ResumeViewer: rendered with React portal to avoid clipping; fixed pointer-events behavior
  - AddJob, JobList, JobTable: candidate select and candidate column added
  - Dashboard: analytics and luxury UI components
- Styling
  - Tailwind config and index.css include a luxury palette, .lux-card, .glass-input, .lux-btn, animations and dark-mode fallbacks

Important endpoints (examples)
- Auth
  - POST /api/auth/register
  - POST /api/auth/login → returns { token, role, id }
  - GET /api/auth/me
- Jobs
  - GET /api/jobs
  - GET /api/jobs/{id}
  - POST /api/jobs
  - PUT /api/jobs/{id}
  - DELETE /api/jobs/{id} (Admin only)
  - GET /api/jobs/stats
- Candidates
  - GET /api/candidates
  - POST /api/candidates
  - GET /api/candidates/{id}
  - PUT /api/candidates/{id}
  - DELETE /api/candidates/{id}
  - POST /api/candidates/{id}/uploadResume (multipart/form-data) → returns absolute URL
- Admin
  - GET /api/admin/users
  - POST /api/admin/users/{id}/role
  - DELETE /api/admin/users/{id}

How to run (updated)
1) Backend
- Set the connection string in `HireWire.Server/appsettings.json` (DefaultConnection)
- Ensure `Admin:Username` and `Admin:Password` are set for initial seeding (or skip seeding)
- From the server folder:
  dotnet tool restore
  dotnet ef database update
  dotnet run
- API base (when running locally) typically: http://localhost:5035 (verify Program.cs output)

2) Frontend
- From `hirewire.client`:
  npm install
  npm run dev
- App runs on the Vite dev server (port shown by Vite, e.g. http://localhost:5173)
- Theme: the app stores theme in localStorage key `theme` and toggles the `dark` class on `<html>` and `<body>`.
- Auth: after login, the app stores `token`, `role`, and `userId` in localStorage; the frontend includes the token in Authorization headers for protected requests.

Notes & troubleshooting
- Uploaded resumes are stored in `HireWire.Server/wwwroot/uploads`. The server serves them as static files and returns absolute URLs — verify files exist if preview fails.
- If the Resume preview is clipped or unclickable, clear the `#modal-root` children or restart the frontend; the portal mounts into `#modal-root` and pointer-events are enabled only for active overlays.
- Editor linters may complain about `@apply` and `@tailwind` usage in `index.css`; these are processed at build time by Tailwind — ensure dev dependencies are installed and `npm run dev` is used.

Future improvements / roadmap
- Add refresh tokens and stronger auth session handling
- Multi-user teams / organization support
- Webhooks, notifications (Slack, email)
- CI (GitHub Actions) for build/test and deploy
- Unit/integration tests for server and frontend

License
MIT
