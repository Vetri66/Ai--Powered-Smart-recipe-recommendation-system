import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { RecipeProvider } from "../src/context/RecipeContext"
import Navbar from "../src/components/Navbar"
import ProtectedLayout from "../components/auth/protected-layout"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Smart Recipe System",
  description: "Discover amazing recipes and plan your meals",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        <Suspense fallback={<div>Loading...</div>}>
          <ProtectedLayout>
            <RecipeProvider>
              <Navbar />
              <main className="pt-16">{children}</main>
            </RecipeProvider>
          </ProtectedLayout>
        </Suspense>
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
