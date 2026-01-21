import type React from "react"
import LoginForm from "../../src/components/auth/login-form"

export const metadata = {
  title: "Login • Smart Recipe System",
}

export default function LoginPage(): React.ReactNode {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <LoginForm />
      </div>
    </main>
  )
}
