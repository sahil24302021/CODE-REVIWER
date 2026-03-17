# CodeLens AI — Intelligent Code Review Platform

CodeLens AI is a modern, full-stack SaaS application that provides automated, AI-powered code reviews. By analyzing your source code, it detects bugs, security vulnerabilities, performance bottlenecks, and style issues, providing actionable feedback within seconds.

https://code-reviwer-three.vercel.app/

---

## 🚀 Key Features

### 1. Advanced AI Code Analysis
- Powered by Google Gemini AI (Backend API Integration).
- Provides quality scores (0-100) based on complexity, security, and best practices.
- Catches OWASP Top 10 vulnerabilities like SQL Injection or XSS.
- Generates detailed metrics (cyclomatic complexity, line counts, duplicate patterns).

### 2. Multi-Provider Authentication
- **NextAuth Integration**: Robust session management across the entire platform.
- **GitHub OAuth**: 1-click login using native GitHub profiles.
- **Google OAuth**: 1-click login via Google Workspace.
- **Credentials**: Standard Email/Password registration with bcrypt hashing.
- Backend user synchronization ensures OAuth users have full API access instantly.

### 3. Beautiful, Premium SaaS Dashboard
- Built with **Next.js 14 App Router** and native React Server Components.
- Custom **Glassmorphism UI** with deep gradients, shimmer effects, and stagger animations.
- Intelligent code editor using **Monaco Editor** (the engine behind VS Code).
- Real-time animated charts and data visualization.

---

## 🏗️ Architecture & Tech Stack

CodeLens AI uses a decoupled client-server architecture.

### Frontend (Next.js & React)
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules with custom CSS Variables (No external UI libraries)
- **Auth:** NextAuth.js (`next-auth/react`)
- **Editor:** `@monaco-editor/react`
- **State/Requests:** Axios & React Hooks

### Backend (Node.js & Express)
- **Framework:** Express.js
- **Language:** JavaScript (Node 20+)
- **Database:** PostgreSQL (via Aiven/Neon)
- **ORM:** Prisma
- **AI Integration:** `@google/genai` (Gemini Flash API)
- **Security:** JWT Auth Middleware, Bcrypt, CORS

---

## 📂 Code Logic Deep Dive

### Authentication Flow (`[...nextauth]/route.ts` & `auth.routes.js`)
When a user logs in via GitHub or Google:
1. **NextAuth** handles the initial OAuth handshake with the provider.
2. In the NextAuth `jwt` callback, the frontend immediately makes a `POST` request to our custom backend (`/api/auth/github` or `/api/auth/google`), passing the OAuth profile data (email, name, avatar).
3. The **Backend Express Server** uses Prisma to find the existing PostgreSQL user, or creates a new one.
4. The backend generates a secure standard **JSON Web Token (JWT)** and returns it to NextAuth.
5. NextAuth stores this backend JWT inside the user's secure session cookie.
6. The frontend **Axios Interceptor** (`services/api.ts`) automatically extracts this token from the NextAuth session and attaches it to the `Authorization: Bearer <token>` header for all future requests.

### Core AI Analysis Engine (`ai.service.js`)
When code is submitted for review:
1. The Express backend receives the raw string via `POST /api/reviews`.
2. The `ai.service.js` prepares a rigorous system prompt instructing the **Gemini model** to act as a Senior Staff Engineer.
3. The prompt explicitly demands the output to be formatted as strict **JSON** containing defined keys: `score`, `issues[]` (with line numbers, severity, description), `suggestions[]`, and `metrics`.
4. The backend parses the AI response and calculates physical metrics (like Cyclomatic Complexity) if the AI missed them.
5. The review is securely saved to the Postgres Database via Prisma under the authenticated user's ID.

### Protected Frontend Routing
All protected pages (Dashboard, Review, History, Settings, Analytics) utilize a strict React `useEffect` Auth Guard mapping to `useSession()` from NextAuth. If `status === "unauthenticated"`, the user is hard-redirected back to `/login`, eliminating flash-of-unauthenticated-content.

---

## 🛠️ Local Setup & Installation

You need **Node.js 18+** and a **PostgreSQL** database url to run this locally.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/sahil24302021/CODE-REVIWER.git
cd CODE-REVIWER

# Install frontend deps
cd frontend
npm install

# Install backend deps
cd ../backend
npm install
```

### 2. Configure Backend Environment
Create a `.env` file in the `/backend` folder:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@hostname:5432/dbname?sslmode=require"
JWT_SECRET="your_super_secret_jwt_key"
FRONTEND_URL="http://localhost:3000"
GEMINI_API_KEY="your_google_gemini_api_key"
```
Run Database Migrations:
```bash
npx prisma db push
```

### 3. Configure Frontend Environment
Create a `.env.local` file in the `/frontend` folder:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_super_secret_nextauth_key"

# Obtain from Google Cloud Console
GOOGLE_ID="your_google_client_id"
GOOGLE_SECRET="your_google_client_secret"

# Obtain from GitHub Developer Settings
GITHUB_ID="your_github_client_id"
GITHUB_SECRET="your_github_client_secret"
```

### 4. Start the Application
Open two terminal windows:

**Terminal 1 (Backend)**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend)**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🌐 Production Deployment

- **Frontend:** Designed for zero-config deployment on **Vercel**. Simply connect the repository and map the `.env.local` variables. Ensure `NEXTAUTH_URL` points to your active Vercel domain.
- **Backend:** Designed for deployment on **Render** as a Web Service. Map the `.env` variables and ensure `FRONTEND_URL` allows CORS requests from your Vercel URL.
- **Database:** Hosted serverless Postgres via Neon DB or Supabase.

## 📝 License
This project is licensed under the MIT License.
