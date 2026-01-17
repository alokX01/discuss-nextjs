// app/layout.tsx

// Global CSS file
// This imports Tailwind base styles and any global styles
import "./globals.css";

// Providers component
// This wraps the entire app with NextAuth SessionProvider
import Providers from "@/components/providers";

// Global Header component
// Header is shown on every page
import Header from "@/components/header";

/**
 * RootLayout (Server Component)
 *
 * This is the root layout of the application.
 * Every page (home, topic, post, search, etc.) is rendered inside this.
 *
 * Why Server Component?
 * - Layouts do not need browser interactivity
 * - Runs on server → better performance
 * - Cleaner architecture
 */
export default function RootLayout({
  children,
}: {
  // `children` represents the page content
  // Example: Home page, Topic page, Post page
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 
        Body element
        - min-h-screen: page always fills full screen height
        - bg-gray-50: light neutral background (common in forums)
      */}
      <body className="min-h-screen bg-gray-50">
        {/*
          Providers:
          - Makes authentication session available everywhere
          - Required for useSession(), signIn(), signOut()
        */}
        <Providers>
          {/*
            Header is FULL WIDTH
            - Navigation should always span the full screen
            - Better UX for apps like Reddit / Discuss
          */}
          <Header />

          {/*
            Main content area
            - mx-auto centers content
            - max-w-7xl keeps content readable but wide
            - px-6 adds horizontal padding on small screens
            - pt-6 creates spacing below header
          */}
          <main className="mx-auto max-w-7xl px-6 pt-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
