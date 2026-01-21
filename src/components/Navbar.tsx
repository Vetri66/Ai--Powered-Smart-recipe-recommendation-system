"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { ChefHat, Home, Calendar, ShoppingCart, User, Menu, X, LogOut, LogIn, Bot, Settings, Moon, Sun, Store } from "lucide-react"
import useSWR from "swr"
import { getBrowserSupabase } from "../../lib/supabase/client"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const pathname = usePathname()
  const supabase = useMemo(() => getBrowserSupabase(), [])

  useEffect(() => {
    const theme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = theme === "dark" || (theme === "system" && prefersDark)
    setIsDark(shouldBeDark)
    if (shouldBeDark) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark"
    setIsDark(!isDark)
    localStorage.setItem("theme", newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
  }

  const { data: user } = useSWR("supabase-user", fetchUser)

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/planner", label: "Planner", icon: Calendar },
    { path: "/shopping", label: "Shopping", icon: ShoppingCart },
    { path: "/grocery-compare", label: "Grocery Compare", icon: Store },
    { path: "/assistant", label: "Assistant", icon: Bot },
    { path: "/profile", label: "Profile", icon: User },
    { path: "/settings", label: "Settings", icon: Settings },
  ]

  const isActive = (path) => pathname === path

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    // refresh by navigating to login
    window.location.href = "/login"
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-green-600 p-2 rounded-lg"
            >
              <ChefHat className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">Smart Recipe</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                      : "text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}

            {/* Theme Toggle & Auth */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </div>
              </div>
              
              {user ? (
                <div className="relative group">
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Sign out of your account
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                    aria-label="Login"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="font-medium hidden lg:inline">Login</span>
                  </Link>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Sign in to your account
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {!user ? (
              <Link href="/login" className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg text-sm">
                Login
              </Link>
            ) : (
              <button onClick={handleSignOut} className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 p-2" aria-label="Sign out">
                <LogOut className="h-6 w-6" />
              </button>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg mx-2 mb-2 transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                      : "text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
