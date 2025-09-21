HireWire – Job Tracker (Mini ATS)

A showcase web application that helps users log, track, and analyze their job applications.
This project demonstrates how to build a modern full-stack application using:

.NET 8 Web API (backend)

Entity Framework Core + SQL Server (data)

React + TypeScript + Vite (frontend)

TailwindCSS + Recharts (UI & data visualization)

✨ Features
Core

Add Jobs → Create job applications with company, role, and status.

Track Progress → Update job status (Applied, Interview, Offer, Rejected).

Analytics Dashboard → Visualize applications by status (pie chart).

Job List → Table view of all applications.

Optional (Future Enhancements)

Authentication (JWT-based login).

Microsoft Authenticator / 2FA.

Multi-tenant support (for teams).

🏗️ Tech Stack
Backend (HireWire.Server)

.NET 8 Web API

Entity Framework Core

SQL Server

REST Endpoints:

POST /jobs – Add job application

GET /jobs – List all jobs

PUT /jobs/{id} – Update job status

GET /jobs/stats – Job counts by status

Frontend (hirewire.client)

React + TypeScript + Vite

React Query (data fetching & caching)

TailwindCSS (utility-first styling)

Recharts (charts & analytics)

📂 Project Structure
HireWire/
│
├── hirewire.client/         # React + Vite frontend
│   ├── public/              # Static assets
│   ├── src/                 # React source code
│   ├── package.json         # Frontend dependencies
│   └── vite.config.ts       # Vite configuration
│
├── HireWire.Server/         # .NET backend
│   ├── Controllers/         # API controllers (Jobs, WeatherForecast)
│   ├── Data/                # ApplicationDbContext (EF Core)
│   ├── Migrations/          # EF migrations
│   ├── Models/              # Domain models (Job, etc.)
│   ├── Program.cs           # Application entrypoint
│   └── appsettings.json     # Config (DB connection, etc.)
│
└── README.md                # This file

⚡ Getting Started
1. Clone the Repository
git clone https://github.com/your-username/HireWire.git
cd HireWire

2. Backend Setup (API)

Navigate to the server project:

cd HireWire.Server


Configure SQL Server connection string in appsettings.json. Example:

"ConnectionStrings": {
  "DefaultConnection": "Server=localhost,1433;Database=HireWire;User Id=sa;Password=YourPassword;TrustServerCertificate=True;"
}


Apply EF Core migrations:

dotnet ef database update


Run the server:

dotnet run


API will be available at: https://localhost:5001/api/

3. Frontend Setup (React + Vite)

Navigate to the client project:

cd hirewire.client


Install dependencies:

npm install


Start the dev server:

npm run dev


App will be available at: http://localhost:5173

🔄 Example Workflow

Go to Add Job Page → Enter Company, Role, and Status.

See it appear in Job List Page.

Dashboard updates with Pie Chart (Applied 10, Interview 3, Offer 1, Rejected 5).

🚀 Roadmap

 Authentication (JWT)

 Role-based access

 CI/CD with GitHub Actions

 Deploy to Azure App Service

📜 License

MIT License. Free to use and modify.
