import LoginForm from "../../src/components/auth/login-form"

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-lg">
        <LoginForm />
      </div>
    </main>
  )
}