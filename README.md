# Discuss – Modern Discussion Platform 🚀

**Live Demo:** [https://discuss-nextjs-five.vercel.app](https://discuss-nextjs-five.vercel.app)

A full-stack discussion platform built with Next.js 16, enabling users to create topics, share posts, and engage in threaded conversations.

---

## ✨ Features

### 🔐 **Authentication**
- **GitHub & Google OAuth** via NextAuth
- Secure server-side sessions
- Protected routes with automatic redirects

### 🧵 **Topics & Posts**
- Create and browse discussion topics
- Write posts within topics
- Owner-only edit and delete capabilities
- Dynamic routing with Next.js App Router

### 💬 **Nested Comments**
- Add comments to any post
- Reply to comments (unlimited nesting)
- Real-time UI updates via cache revalidation

### 👤 **User Profile**
- View your posts and comments
- Activity history
- Profile customization

### 🔍 **Search**
- Global search across all posts
- Server-side optimized queries

### 🎨 **Modern UI/UX**
- Clean, minimal interface
- Fully responsive design
- Accessible components (Radix UI)
- Consistent design system

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **UI Components** | Radix UI + Shadcn/ui |
| **Icons** | Lucide React |
| **Authentication** | NextAuth.js |
| **ORM** | Prisma |
| **Database** | PostgreSQL (Supabase) |
| **Deployment** | Vercel |

---

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or Supabase account)
- GitHub OAuth App
- Google OAuth App

---

### 1️⃣ **Clone Repository**
```bash
git clone https://github.com/alokX01/discuss-nextjs.git
cd discuss-nextjs
npm install
```

---

### 2️⃣ **Setup Environment Variables**

Create `.env` file in root:
```env
# Database (Supabase or your PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/DATABASE?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# GitHub OAuth
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

---

### 3️⃣ **Setup OAuth Providers**

#### **GitHub OAuth App**

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** `Discuss (Local)`
   - **Homepage URL:** `http://localhost:3000`
   - **Callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Copy **Client ID** and **Client Secret** to `.env`

#### **Google OAuth App**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure OAuth consent screen (External)
6. Create **Web application** credentials:
   - **Authorized JavaScript origins:** `http://localhost:3000`
   - **Authorized redirect URIs:** `http://localhost:3000/api/auth/callback/google`
7. Copy **Client ID** and **Client Secret** to `.env`

---

### 4️⃣ **Setup Database**
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

---

### 5️⃣ **Run Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables (same as `.env`)
4. Update OAuth callback URLs:
   - **GitHub:** `https://yourdomain.com/api/auth/callback/github`
   - **Google:** `https://yourdomain.com/api/auth/callback/google`
5. Deploy!

---

## 📁 Project Structure
```
discuss-nextjs/
├── app/
│   ├── action/              # Server Actions
│   ├── api/auth/            # NextAuth API routes
│   ├── auth/login/          # Login page
│   ├── profile/             # Profile pages
│   ├── search/              # Search page
│   ├── topic/[slug]/        # Topic pages
│   └── layout.tsx           # Root layout
├── components/
│   ├── comments/            # Comment system
│   ├── header/              # Navigation
│   ├── posts/               # Post components
│   ├── topic/               # Topic components
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── auth.ts              # NextAuth config
│   ├── prisma.ts            # Prisma client
│   └── query/               # Database queries
├── prisma/
│   └── schema.prisma        # Database schema
└── public/                  # Static assets
```

---

## 🎨 Design Philosophy

- **Minimalist:** Focus on content, not clutter
- **Accessible:** Keyboard navigation, screen reader support
- **Responsive:** Works on all devices
- **Consistent:** Unified design system throughout

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Alok Kumar**

- GitHub: [@alokX01](https://github.com/alokX01)
- Email: helloalokkumar108@gmail.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/)

---

**⭐ Star this repo if you find it helpful!**
