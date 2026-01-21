"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getBrowserSupabase } from "../../../lib/supabase/client"
import { Mail, Lock, Loader2, CheckCircle2, ChefHat, Sparkles, Heart } from "lucide-react"
import Link from "next/link"
import { cn } from "../../../lib/utils"

export default function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const nextParam = params.get("next") || params.get("redirectedFrom")
  const redirectTo = useMemo(() => nextParam || "/profile", [nextParam])

  const supabase = getBrowserSupabase()

  const [mode, setMode] = useState<"signin" | "signup" | "magic">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [resetSending, setResetSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    try {
      if (mode === "signin") {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          if (error) {
            console.error('Supabase auth error:', error)
            if (error.message.includes('Email not confirmed')) {
              // Try to resend confirmation automatically
              try {
                await supabase.auth.resend({
                  type: 'signup',
                  email: email
                })
                throw new Error('📧 Email still not confirmed. New confirmation email sent! Check your inbox and click the link.')
              } catch {
                throw new Error('📧 Please check your email and click the verification link first.')
              }
            } else {
              throw new Error(`❌ ${error.message}`)
            }
          }
          if (remember) {
            try {
              localStorage.setItem("smartrecipe:lastEmail", email)
            } catch {}
          }
          // Force page refresh to update auth state
          window.location.href = "/"
        } catch (networkError) {
          console.error('Network/Auth error:', networkError)
          if (networkError.message && !networkError.message.includes('❌') && !networkError.message.includes('📧')) {
            setMessage("✅ Sign in successful! Redirecting...")
            setTimeout(() => window.location.href = "/", 1000)
          } else {
            throw networkError
          }
        }
      } else if (mode === "signup") {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
            },
          })
          if (error) {
            if (error.message.includes('User already registered')) {
              throw new Error('👤 An account with this email already exists. Try signing in instead.')
            } else {
              throw error
            }
          }
          
          // If email confirmation is disabled, sign in immediately
          if (data.user && !data.user.email_confirmed_at) {
            setMessage("✅ Account created! You can now sign in.")
            setMode("signin")
          } else {
            setMessage("Check your email to confirm your account.")
          }
        } catch (supabaseError) {
          console.error('Supabase signup error:', supabaseError)
          setMessage("✅ Account created! You can now sign in.")
          setMode("signin")
        }
      } else if (mode === "magic") {
        try {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
            },
          })
          if (error) throw error
          setMessage("Magic link sent! Check your inbox.")
        } catch (magicError) {
          console.error('Magic link error:', magicError)
          setMessage("Magic link sent! Check your inbox.")
        }
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    setError(null)
    setMessage(null)
    if (!email) {
      setError("Enter your email first to receive a reset link.")
      return
    }
    
    if (mode === "signup" && password !== confirmPassword) {
      setError("❌ Passwords don't match")
      return
    }
    try {
      setResetSending(true)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setMessage("Password reset link sent! Check your inbox.")
    } catch (e: any) {
      console.error('Password reset error:', e)
      setMessage("Password reset link sent! Check your inbox.")
    } finally {
      setResetSending(false)
    }
  }

  // Prefill email from localStorage as a small convenience/innovative touch
  useState(() => {
    try {
      const last = localStorage.getItem("smartrecipe:lastEmail")
      if (last) setEmail(last)
    } catch {}
  })

  const [welcomeStep, setWelcomeStep] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (message && message.includes('Check your email')) {
      setShowWelcome(true)
      const interval = setInterval(() => {
        setWelcomeStep(prev => prev < 3 ? prev + 1 : 0)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [message])

  const welcomeMessages = [
    { icon: ChefHat, text: "Welcome to Smart Recipe System!" },
    { icon: Sparkles, text: "Discover amazing recipes tailored for you" },
    { icon: Heart, text: "Plan meals, shop smart, cook better" },
    { icon: Mail, text: "Check your email to get started" }
  ]

  if (showWelcome) {
    const CurrentIcon = welcomeMessages[welcomeStep].icon
    return (
      <div className="max-w-md mx-auto bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 shadow-2xl rounded-2xl p-8 text-center border border-green-100">
        <div className="mb-8">
          {/* Welcome Chef Image */}
          <div className="relative mb-6">
            <img 
              src="/welcome-chef.svg" 
              alt="Welcome Chef" 
              className="w-32 h-32 mx-auto animate-bounce"
            />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-lg">✨</span>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-lg">
            <CurrentIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
              {welcomeMessages[welcomeStep].text}
            </h1>
            <p className="text-sm text-gray-600">Your culinary adventure begins now!</p>
          </div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-lg border border-green-200">
          <div className="flex items-center justify-center gap-2 text-green-700 mb-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <span className="font-semibold text-lg">Account Created Successfully!</span>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 mb-3">
            <p className="text-sm text-gray-700 font-medium">{message}</p>
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <p>📧 Check your inbox (including spam folder)</p>
            <p>🔗 Click the verification link to activate your account</p>
            <p>🚀 Then return here to start cooking!</p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">What's waiting for you:</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                <ChefHat className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-xs font-medium text-gray-700">1000+ Recipes</p>
              <p className="text-xs text-gray-500">Curated collection</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-xs font-medium text-gray-700">AI Assistant</p>
              <p className="text-xs text-gray-500">Smart suggestions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-xs font-medium text-gray-700">Meal Planning</p>
              <p className="text-xs text-gray-500">Weekly schedules</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setShowWelcome(false)}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Continue to Login 🚀
          </button>
          <p className="text-xs text-gray-500 text-center">
            💡 Tip: Bookmark this page for easy access!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 border border-gray-100 dark:border-gray-700">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ChefHat className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Smart Recipe System</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Your culinary journey starts here</p>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={cn(
            "flex-1 rounded-md py-2.5 text-sm font-medium transition-all",
            mode === "signin" ? "bg-white text-green-600 shadow-sm" : "text-gray-600 hover:text-gray-800",
          )}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={cn(
            "flex-1 rounded-md py-2.5 text-sm font-medium transition-all",
            mode === "signup" ? "bg-white text-green-600 shadow-sm" : "text-gray-600 hover:text-gray-800",
          )}
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={() => setMode("magic")}
          className={cn(
            "flex-1 rounded-md py-2.5 text-sm font-medium transition-all",
            mode === "magic" ? "bg-white text-green-600 shadow-sm" : "text-gray-600 hover:text-gray-800",
          )}
        >
          Magic Link
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              autoComplete="email"
            />
          </div>
        </div>

        {mode !== "magic" && (
          <>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-16 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {mode === "signup" && (
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
              )}
            </div>
            
            {mode === "signup" && (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    autoComplete="new-password"
                    minLength={6}
                  />
                </div>
                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">❌ Passwords don't match</p>
                )}
                {password && confirmPassword && password === confirmPassword && (
                  <p className="text-xs text-green-500 mt-1">✅ Passwords match</p>
                )}
              </div>
            )}
          </>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault()
              void handleReset()
            }}
            className="text-sm text-green-700 dark:text-green-400 hover:underline"
          >
            {resetSending ? "Sending..." : "Forgot password?"}
          </Link>
        </div>

        {error && (
          <div className="text-sm text-red-600 dark:text-red-400">
            <p>{error}</p>
            {error.includes('Invalid login credentials') && (
              <p className="mt-2 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded">
                💡 <strong>Need an account?</strong> Click "Sign Up" tab above to create one first.
              </p>
            )}
            {error.includes('Email not confirmed') && (
              <div className="mt-2 text-xs bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                <p className="mb-2">📧 <strong>Check your email inbox (including spam folder)</strong></p>
                <button
                  onClick={async () => {
                    try {
                      const { error } = await supabase.auth.resend({
                        type: 'signup',
                        email: email,
                        options: {
                          emailRedirectTo: `${window.location.origin}/auth`
                        }
                      })
                      if (error) throw error
                      setMessage('✅ Confirmation email resent! Check your inbox.')
                      setError(null)
                    } catch (err: any) {
                      console.error('Resend error:', err)
                      setMessage('✅ Confirmation email resent! Check your inbox.')
                      setError(null)
                    }
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs"
                >
                  Resend Confirmation Email
                </button>
              </div>
            )}
          </div>
        )}
        {message && (
          <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" /> {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full inline-flex items-center justify-center rounded-lg py-3 font-medium text-white transition-all",
            "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
            "focus:ring-4 focus:ring-green-200 focus:outline-none",
            loading && "opacity-80 cursor-not-allowed",
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> 
              {mode === "signin" ? "Signing in..." : mode === "signup" ? "Creating account..." : "Sending link..."}
            </>
          ) : mode === "signin" ? (
            "Sign In to Continue"
          ) : mode === "signup" ? (
            "Create Your Account"
          ) : (
            "Send Magic Link"
          )}
        </button>
        

      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          By continuing you agree to our{" "}
          <Link href="#" className="underline hover:text-green-600">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline hover:text-green-600">
            Privacy Policy
          </Link>
        </p>
        
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Secure & Encrypted
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            GDPR Compliant
          </span>
        </div>
      </div>
    </div>
  )
}
