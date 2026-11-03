<div align="center">

  <h1>🎓 VOLP Desk</h1>
  
  <p><strong>A calm, intelligent coursework companion and automated deadline reminder system for the Vishwakarma Online Learning Platform (<a href="https://classroom.volp.in">classroom.volp.in</a>).</strong></p>

  <p>
    <a href="https://volp-desk.shroojan.in"><img src="https://img.shields.io/badge/🚀_Live_App-volp--desk.shroojan.in-e58e39?style=for-the-badge&logoColor=white" alt="Live Production App" /></a>
    <a href="https://github.com/Shroojan2076/VOLP-Desk"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository" /></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 8" />
    <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white" alt="Express 5" />
    <img src="https://img.shields.io/badge/PostgreSQL-Neon_Cloud-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Cron_Sync-Every_4_Hours-e58e39?style=flat-square&logo=clock&logoColor=white" alt="Cron 4H" />
    <img src="https://img.shields.io/badge/Email_Alerts-Daily_Digest-34a853?style=flat-square&logo=gmail&logoColor=white" alt="Daily Notifications" />
    <img src="https://img.shields.io/badge/License-ISC-blue?style=flat-square" alt="License" />
  </p>

  <p>
    <a href="https://volp-desk.shroojan.in"><strong>Open Live Web App</strong></a>
    &nbsp;•&nbsp;
    <a href="#-screenshots--visual-tour"><strong>Screenshots</strong></a>
    &nbsp;•&nbsp;
    <a href="#%EF%B8%8F-system-architecture"><strong>Architecture</strong></a>
    &nbsp;•&nbsp;
    <a href="#-scheduled-cron-jobs--automation"><strong>Cron Jobs</strong></a>
    &nbsp;•&nbsp;
    <a href="#-getting-started"><strong>Run Locally</strong></a>
  </p>

  <br />
  
  <a href="https://volp-desk.shroojan.in">
    <img src="./screenshots/volp-desk-dashboard-1.png" alt="VOLP Desk Student Dashboard" width="96%" style="border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.1);" />
  </a>

</div>

---

## 📖 Overview

The native college portal (`classroom.volp.in`) often suffers from slow navigation, daily maintenance downtime, and a lack of proactive email notifications for approaching assignment deadlines.

**VOLP Desk** solves this by bridging directly into the portal:
1. **Automated 4-Hour Background Sync:** A scheduled cron job queries VOLP every 4 hours to keep courses, subjective assignments, submission statuses, and professor evaluations continually updated in a central PostgreSQL database.
2. **Daily Deadline Email Alerts:** An automated notification job runs once every day, scanning for pending assignments due within the next 3 days and dispatching personalized, beautifully styled HTML reminder emails to students.
3. **Calm, High-Performance Web Dashboard:** Built with React 19 and Vite, the dashboard presents a distraction-free editorial interface with real-time countdowns, active grace period tracking, instructor remarks, and instant search across all enrolled courses.

---

## 📸 Screenshots & Visual Tour

### 1. Student Dashboard & Enrolled Subjects
A clean, cohesive overview showing key metrics (assignments due, turned in %, average score), active semester curriculum cards, and one-click subject filtering.

<div align="center">
  <img src="./screenshots/volp-desk-dashboard-1.png" alt="VOLP Desk Main Dashboard" width="96%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 1.5rem;" />
</div>

---

### 2. Coursework Tracker & Urgency Badges
Real-time status indicators (`Due in 18h`, `Turned In`, `Past Due Date`, `Grace Window Active`), search bar across all questions and subjects, and status tabs (`Needs Action`, `Turned In`, `Graded`, `Past Deadline`).

<div align="center">
  <img src="./screenshots/volp-desk-dashboard-2.png" alt="Coursework Tracker and Deadline Urgency Badges" width="96%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 1.5rem;" />
</div>

---

### 3. Automated Daily Deadline Email Notification
A sample of the responsive daily reminder email delivered to student inboxes every morning with a 3-day lookahead for pending assignments.

<div align="center">
  <img src="./screenshots/email-recieved.png" alt="Daily Deadline Reminder Email Received" width="96%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 1.5rem;" />
</div>

---

### 4. Seamless Student Authentication & Onboarding
Students can sign in directly or register by verifying their existing credentials against `classroom.volp.in`. An initial synchronization imports their courses and subjective assignments immediately.

<div align="center">
  <img src="./screenshots/volp-desk-signin-page.png" alt="Sign In and Student Onboarding" width="96%" style="border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 1.5rem;" />
</div>

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph External Schedulers ["⏰ External Cron Triggers (e.g., cron-job.org)"]
        Cron4H["Every 4 Hours<br/>GET /api/resync"]
        CronDaily["Once Daily<br/>GET /api/notify/deadlines"]
    end

    subgraph Backend ["⚡ VOLP Desk Server (Express 5 & Node.js)"]
        Router["Express Router<br/>(Rate Limiting & JWT Auth)"]
        SyncEngine["Sync Engine<br/>(WAF Jitter & Maintenance Checks)"]
        EmailService["Nodemailer Alert Dispatcher"]
        DBLayer["PostgreSQL Connection Pool<br/>(pg & Neon Database)"]
    end

    subgraph External Services ["🌐 Upstream Services"]
        VOLP["VOLP Upstream Portal<br/>(classroom.volp.in / admin.volp.in)"]
        SMTP["SMTP Mail Service<br/>(Gmail / Brevo)"]
        StudentInbox["Student Email Inboxes 📬"]
    end

    subgraph Frontend ["💻 VOLP Desk Client (React 19 + Vite)"]
        UI["Student Dashboard & Dossier<br/>(Lucide Icons & Theme Engine)"]
        HealthPill["Dynamic Connection Indicator<br/>& Custom Host Switcher"]
    end

    Cron4H -->|"x-cron-secret"| Router
    CronDaily -->|"x-cron-secret"| Router
    UI <-->|"JWT Bearer Auth"| Router
    HealthPill <-->|"/api/health"| Router

    Router --> SyncEngine
    Router --> EmailService
    Router <--> DBLayer

    SyncEngine <-->|"Scrapes Courses & Assignments"| VOLP
    SyncEngine -->|"Upsert Data"| DBLayer
    EmailService -->|"Read Pending < 3 Days"| DBLayer
    EmailService -->|"Send Reminder"| SMTP
    SMTP --> StudentInbox
```

---

## ✨ Key Features

- **Automated 4-Hour Background Sync:**
  - Synchronizes enrolled subjects and subjective assignments for all active student accounts.
  - Built-in **Maintenance Window Guard**: VOLP is routinely down between `12:00 AM` and `07:00 AM IST`. During this window, sync attempts gracefully exit without generating false errors.
  - **Upstream WAF Protection**: Injects randomized jitter delays between individual student requests (500–1000ms) and course fetches (300–600ms) to avoid triggering upstream rate limits or IP bans.
  - **Account Safety & Auto-Deactivation**: Tracks consecutive authentication failures (`auth_failure_count`); deactivates accounts with 3 consecutive failures to safeguard student credentials if passwords change.
- **Daily Deadline Email Reminders:**
  - Runs once every day via cron webhook or CLI command.
  - Scans for assignments where `submitted = FALSE` and `due_date` falls within the next 3 days.
  - Dispatches responsive HTML emails displaying course codes, assignment prompts, points, and formatted IST due dates.
- **Modern Student Workspace (Frontend):**
  - **Subject Directory & Filtering**: Interactive cards displaying course code, professor name, active/archived state, and pending vs. submitted tallies.
  - **Assignment Dossier Sheet**: Modal view detailing the complete problem statement, official due date, grace period cutoff, weightage points, instructor evaluation score, and submitted attachment path.
  - **Intelligent Urgency Badges**: Visual status indicators (`Grace Window Active`, `Due in X hours`, `Due Tomorrow`, `Past Due Date`, `Turned In`).
  - **Live Backend Health Monitor**: Dynamic connection pill polling `/api/health` every 60s with an in-app modal allowing instant runtime switching of the API server URL.
- **Robust Security & Resiliency:**
  - Strict rate limiting on authentication routes (25 attempts / 15m) and student data routes (150 requests / 15m).
  - Secure JWT bearer authentication with IDOR prevention (ensures students can only query their own records).
  - Atomic rollback during registration: if the initial sync fails, newly registered DB records are rolled back.
  - Graceful process termination handling `SIGTERM` and `SIGINT` with 10-second connection draining for PostgreSQL pools.

---

## ⏰ Scheduled Cron Jobs & Automation

The core automation workflow of VOLP Desk relies on two key endpoints triggered by an external scheduler (such as [cron-job.org](https://cron-job.org/), GitHub Actions, Render Cron, or native Linux crontab).

### 1. Coursework Resync Endpoint (`GET /api/resync`)
- **Execution Frequency:** **Every 4 hours** (cron: `0 */4 * * *`).
- **Purpose:** Synchronizes courses and subjective assignment questions, marks, deadlines, and submissions from VOLP into the database.
- **Maintenance Safety:** Automatically skips execution between **12:00 AM and 07:00 AM IST** when the college portal undergoes daily offline maintenance.
- **Concurrency Guard:** Rejects overlapping runs if a previous sync is still processing.
- **Authentication:** Protected by the `x-cron-secret` HTTP header or the `?secret=<CRON_SECRET>` URL parameter.

**Sample cURL Request:**
```bash
curl -X GET "https://volp-desk-server.onrender.com/api/resync" \
  -H "x-cron-secret: YOUR_CRON_SECRET"
```

### 2. Daily Deadline Notification Endpoint (`GET /api/notify/deadlines`)
- **Execution Frequency:** **Once a day** (recommended: **08:00 AM IST**, cron: `30 2 * * *` UTC).
- **Purpose:** Queries all unsubmitted assignments due within the next **3 days**, groups them by student, and delivers a branded HTML deadline reminder email.
- **Concurrency Guard:** Prevents duplicate email blasts if triggered multiple times simultaneously.
- **CLI Alternative:** Can also be executed directly on the server terminal or in a container job:
  ```bash
  npm run notify:deadlines
  ```

**Sample cURL Request:**
```bash
curl -X GET "https://volp-desk-server.onrender.com/api/notify/deadlines" \
  -H "x-cron-secret: YOUR_CRON_SECRET"
```

---

## 📁 Repository Structure

```
VOLP-Desk/
├── client/                          # React 19 + Vite Frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── AssignmentList.jsx   # Search, filter tabs & assignment cards
│   │   │   ├── AssignmentModal.jsx  # Detailed assignment prompt & grading modal
│   │   │   ├── AuthView.jsx         # Sign-in & new student onboarding form
│   │   │   ├── CourseGrid.jsx       # Enrolled course cards & subject filter
│   │   │   ├── DashboardView.jsx    # Main student workspace layout
│   │   │   ├── Navbar.jsx           # Top bar with live backend status pill
│   │   │   └── StatsOverview.jsx    # Metric summaries (due, turned in, average grade)
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication state & health monitor
│   │   ├── services/
│   │   │   └── api.js               # API client, normalizers & localStorage config
│   │   ├── App.jsx                  # Root layout wrapper
│   │   ├── index.css                # Editorial theme styling & CSS variables
│   │   └── main.jsx                 # Client entry point
│   ├── .env.example                 # Sample client environment configuration
│   ├── .env.production             # Production environment configuration
│   ├── index.html                   # HTML document template
│   ├── package.json                 # Client dependencies & scripts
│   ├── vercel.json                  # SPA routing configuration for Vercel
│   └── vite.config.js               # Vite bundler & local dev proxy setup
│
├── server/                          # Node.js + Express 5 Backend
│   ├── api/
│   │   └── api.js                   # Upstream VOLP API client (Axios HTTP calls)
│   ├── db/
│   │   ├── createDatabase.js        # DDL migration script & performance indexes
│   │   ├── database.js              # PostgreSQL connection pool configuration
│   │   ├── fetchFromDatabase.js     # Query helpers (users, courses, assignments, deadlines)
│   │   └── saveToDatabase.js        # Upsert queries (ON CONFLICT DO UPDATE)
│   ├── server/
│   │   ├── routes/
│   │   │   ├── auth.js              # Register & login endpoints
│   │   │   ├── fetch.js             # Authenticated course & assignment queries
│   │   │   ├── notify.js            # GET /api/notify/deadlines webhook
│   │   │   └── resync.js            # GET /api/resync webhook
│   │   └── server.js                # Express app setup, rate limiters & shutdown logic
│   ├── services/
│   │   ├── date.js                  # VOLP timestamp parser (converts to IST Date)
│   │   ├── mailer.js                # Nodemailer transport & HTML template generator
│   │   ├── parser.js                # Raw JSON response payload sanitizers
│   │   └── sendDeadlineEmails.js    # Standalone CLI runner for email reminders
│   ├── sync/
│   │   └── sync.js                  # Multi-user synchronization orchestration
│   ├── .env.example                 # Sample server environment configuration
│   ├── package.json                 # Server dependencies & scripts
│   └── .gitignore                   # Server git ignore patterns
│
├── screenshots/                     # Application screenshots & UI previews
│   ├── email-recieved.png           # Daily notification email preview
│   ├── volp-desk-dashboard-1.png    # Primary dashboard preview
│   ├── volp-desk-dashboard-2.png    # Assignment tracker & deadline preview
│   └── volp-desk-signin-page.png    # Student login & setup preview
│
└── README.md                        # Documentation
```

---

## 🗄️ Database Schema

The database utilizes relational PostgreSQL tables with foreign key cascades, upsert constraints, and specialized partial indexes:

```mermaid
erDiagram
    users ||--o{ courses : "enrolled in"
    users ||--o{ assignments : "assigned to"
    courses ||--o{ assignments : "contains"

    users {
        SERIAL id PK
        VARCHAR email UK
        VARCHAR password_hash
        VARCHAR first_name
        VARCHAR last_name
        BOOLEAN is_active
        INT auth_failure_count
        TEXT auth_error_message
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }

    courses {
        SERIAL id PK
        INT user_id FK
        INT course_id
        INT course_offering_learner_id
        VARCHAR code
        VARCHAR name
        TEXT description
        VARCHAR professor
        TIMESTAMPTZ last_seen
        NUMERIC progress
        BOOLEAN active
        BOOLEAN allow_assessment
        BOOLEAN archived
        TIMESTAMPTZ last_synced_at
    }

    assignments {
        SERIAL id PK
        INT user_id FK
        INT assignment_id
        INT course_id FK
        NUMERIC marks
        BOOLEAN submitted
        TEXT question
        TIMESTAMPTZ due_date
        TIMESTAMPTZ grace_date
        BOOLEAN graded
        BOOLEAN evaluated
        NUMERIC score
        VARCHAR submission_file
        TEXT submission_path
        TIMESTAMPTZ last_synced_at
    }
```

### Performance Indexes
```sql
-- Fast index for upcoming pending assignment deadline queries:
CREATE INDEX idx_assignments_pending_deadlines 
ON assignments (due_date ASC) 
WHERE submitted = FALSE;

-- Fast index for user-filtered assignment queries:
CREATE INDEX idx_assignments_user_course 
ON assignments (user_id, course_id);
```

---

## 🔌 API Reference

### Health Check
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | None | Returns server health status, current timestamp, and serving host. |

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | None | Validates credentials against VOLP live, saves student, runs initial sync, and returns JWT. |
| `POST` | `/api/auth/login` | None | Authenticates existing user and returns JWT token + coursework. |

### Coursework (Student)
| Method | Endpoint | Auth | Query Params | Description |
|---|---|---|---|---|
| `GET` | `/api/fetch/courses` | Bearer JWT | `email` | Retrieves all synced courses for the authenticated student. |
| `GET` | `/api/fetch/assignments` | Bearer JWT | `email`, `courseId` (optional) | Retrieves assignments, optionally filtered by course. |

### Webhooks & Schedulers
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/resync` | `CRON_SECRET` | Triggers asynchronous multi-user background coursework synchronization (every 4 hours). |
| `GET` | `/api/notify/deadlines` | `CRON_SECRET` | Queries approaching assignments (< 3 days) and dispatches reminder emails (once a day). |

---

## ⚙️ Environment Configuration

### Backend (`server/.env`)
Create a `.env` file in the `server/` directory based on `server/.env.example`:

```env
# Server Port
PORT=3000

# PostgreSQL Connection (Local PostgreSQL or Cloud like Neon / Supabase)
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# Secret used to sign session JWTs (30-day lifetime)
JWT_SECRET=your_jwt_session_secret_key_here

# Secret required by external cron triggers (x-cron-secret header)
CRON_SECRET=your_super_secret_cron_passphrase

# SMTP Mail Delivery Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=alerts@example.com
SMTP_PASS=your_app_specific_password
EMAIL_FROM="VOLP Academic Alerts <alerts@example.com>"
```

### Frontend (`client/.env`)
Create a `.env` file in the `client/` directory based on `client/.env.example`:

```env
# Backend server URL (omit or leave empty in local dev to use Vite proxy)
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14.0 or higher (or a cloud PostgreSQL instance like [Neon.tech](https://neon.tech))
- **npm** or **pnpm** package manager

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Shroojan2076/VOLP-Desk.git
cd VOLP-Desk
```

---

### Step 2: Configure & Initialize the Database

1. Navigate to the server folder and install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Configure `server/.env` with your `DATABASE_URL` and other required variables.
3. Run the schema creation script to build tables and indexes:
   ```bash
   node db/createDatabase.js
   ```
   *(Expected output: `Complete relational schema initialization successful.`)*

---

### Step 3: Start the Backend Server

```bash
# Inside server/
npm start
```
The API server will be available at `http://localhost:3000`. Verify it by opening `http://localhost:3000/api/health`.

---

### Step 4: Start the Client Application

In a separate terminal:
```bash
cd client
npm install
npm run dev
```
The frontend development server will launch at `http://localhost:5173`. Open this URL in your browser to sign in or connect a new student account.

---

## 🚢 Deployment

### Production Links
- **Live Web Application:** [https://volp-desk.shroojan.in](https://volp-desk.shroojan.in)
- **API Server:** [https://api.volp-desk.shroojan.in](https://volp-desk-server.onrender.com)
- **GitHub Repository:** [https://github.com/Shroojan2076/VOLP-Desk](https://github.com/Shroojan2076/VOLP-Desk)

### Backend (e.g. Render / Railway)
1. Deploy the `server/` subdirectory as a Node.js web service.
2. Build command: `npm install`
3. Start command: `node server/server.js`
4. Set all required environment variables in the host dashboard.
5. Setup the two cron triggers using [cron-job.org](https://cron-job.org/):
   - **Resync Webhook:** `GET https://volp-desk-server.onrender.com/api/resync` with header `x-cron-secret: <CRON_SECRET>` every **4 hours**.
   - **Notify Webhook:** `GET https://volp-desk-server.onrender.com/api/notify/deadlines` with header `x-cron-secret: <CRON_SECRET>` **once daily** at 8:00 AM IST.

### Frontend (e.g. Vercel)
1. Deploy the `client/` subdirectory to Vercel (or custom domain `volp-desk.shroojan.in`).
2. Framework Preset: **Vite**
3. Set the environment variable `VITE_API_BASE_URL` to your production backend URL: `https://volp-desk-server.onrender.com`.
4. `vercel.json` is already included to handle SPA single-page routing rewrites.

---

## 🛡️ License

This project is licensed under the [ISC License](LICENSE).
