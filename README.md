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

