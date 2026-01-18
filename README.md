# Discuss – A Modern Full-Stack Discussion Platform

🔗 **Live Application:** https://discuss-dusky.vercel.app  

Discuss is a modern, full-stack discussion platform where users can create topics, publish posts, and engage in conversations through comments and replies.

This project is built with **Next.js App Router**, **Prisma**, **PostgreSQL**, and **NextAuth**, following real-world production standards.

---

## ✨ Features

### 🔐 Authentication
- GitHub OAuth authentication using **NextAuth**
- Secure server-side sessions
- Protected routes (Profile, Topics, Posts)

### 🧵 Topics & Posts
- Create discussion topics
- Create posts under topics
- Topic-based post navigation
- Dynamic routes using Next.js App Router

### 💬 Comment System
- Add comments on posts
- Nested reply support
- Instant UI refresh using cache revalidation

### 👤 Profile Page
- View your own posts
- View activity history
- Secure user-only access

### 🔍 Search
- Global search across posts
- Server-side optimized searching

### 🎨 UI / UX
- Clean, minimal, and consistent design
- Fully responsive layout
- Reusable UI components
- Accessible components using Radix UI

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16 (App Router)**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Radix UI**
- **Lucide Icons**

### Backend
- **Next.js Server Components**
- **NextAuth.js** (Authentication)
- **Prisma ORM**

### Database
- **PostgreSQL**
- Hosted on **Supabase**
- PgBouncer enabled for production pooling

### Deployment
- **Vercel**
- Prisma client generation during build
- Environment-based configuration

---

## 🎨 UI / UX Design Approach

- Component-driven design
- Consistent spacing, typography, and colors
- Card-based layout for posts and topics
- Sidebar + main content pattern
- Accessible form inputs and buttons
- Minimal distractions, focus on content

Design philosophy:
> “Simple, readable, and scalable like real discussion platforms.”

---

---

## 🔑 GitHub OAuth Setup (Required for Local Development)

This project uses **GitHub OAuth** via **NextAuth**.  
If you clone this repository, you must create your own GitHub OAuth App.

### Create GitHub OAuth App
1. Go to https://github.com/settings/developers  
2. Click **New OAuth App**
3. Fill details:

Application name: Discuss (Local)
Homepage URL: http://localhost:3000

Authorization callback URL: http://localhost:3000/api/auth/callback/github


4. Copy **Client ID** and **Client Secret**

---

## 🖥️ Clone & Run Locally

### 1️⃣ Clone Repository
```bash
git clone https://github.com/alokX01/discuss-nextjs.git
cd discuss-nextjs
npm install

Create a .env file in the root directory:

DATABASE_URL=your_postgresql_pooling_url
DIRECT_URL=your_direct_postgresql_url

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

AUTH_SECRET=any_random_secure_string
NEXTAUTH_URL=http://localhost:3000

