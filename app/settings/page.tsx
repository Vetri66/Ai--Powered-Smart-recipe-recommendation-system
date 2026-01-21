"use client"

import { useState, useEffect } from "react"
import { Settings, Moon, Sun, Monitor, User, Bell, Shield, Palette, Volume2, Download, Trash2, Key, Database, Heart } from "lucide-react"

export default function SettingsPage() {
  const [theme, setTheme] = useState("system")
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [dataSync, setDataSync] = useState(true)
  const [dietaryPrefs, setDietaryPrefs] = useState([])

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system"
    const savedNotifications = localStorage.getItem("notifications") === "true"
    const savedAutoSave = localStorage.getItem("autoSave") === "true"
    const savedSoundEnabled = localStorage.getItem("soundEnabled") === "true"
    const savedDataSync = localStorage.getItem("dataSync") === "true"
    const savedDietaryPrefs = JSON.parse(localStorage.getItem("dietaryPrefs") || "[]")
    
    setTheme(savedTheme)
    setNotifications(savedNotifications)
    setAutoSave(savedAutoSave)
    setSoundEnabled(savedSoundEnabled)
    setDataSync(savedDataSync)
    setDietaryPrefs(savedDietaryPrefs)
    
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme: string) => {
    const root = document.documentElement
    
    if (newTheme === "dark") {
      root.classList.add("dark")
    } else if (newTheme === "light") {
      root.classList.remove("dark")
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  const handleNotificationsChange = (value: boolean) => {
    setNotifications(value)
    localStorage.setItem("notifications", value.toString())
  }

  const handleAutoSaveChange = (value: boolean) => {
    setAutoSave(value)
    localStorage.setItem("autoSave", value.toString())
  }

  const handleSoundChange = (value: boolean) => {
    setSoundEnabled(value)
    localStorage.setItem("soundEnabled", value.toString())
  }

  const handleDataSyncChange = (value: boolean) => {
    setDataSync(value)
    localStorage.setItem("dataSync", value.toString())
  }

  const handleDietaryPrefsChange = (diet: string) => {
    const newPrefs = dietaryPrefs.includes(diet)
      ? dietaryPrefs.filter(d => d !== diet)
      : [...dietaryPrefs, diet]
    setDietaryPrefs(newPrefs)
    localStorage.setItem("dietaryPrefs", JSON.stringify(newPrefs))
  }

  const handleExportData = () => {
    const data = {
      theme,
      notifications,
      autoSave,
      soundEnabled,
      dataSync,
      dietaryPrefs,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'smart-recipe-settings.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear all cached data?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full">
              <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">⚙️ Settings</h1>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">🎨 Theme</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleThemeChange("light")}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  theme === "light" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Sun className="h-6 w-6 text-yellow-500 mb-2" />
                <span className="text-sm font-medium">☀️ Light</span>
              </button>
              
              <button
                onClick={() => handleThemeChange("dark")}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  theme === "dark" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Moon className="h-6 w-6 text-blue-500 mb-2" />
                <span className="text-sm font-medium">🌙 Dark</span>
              </button>
              
              <button
                onClick={() => handleThemeChange("system")}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  theme === "system" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Monitor className="h-6 w-6 text-gray-500 mb-2" />
                <span className="text-sm font-medium">💻 System</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">👤 Preferences</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">🔔 Notifications</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about new recipes</p>
                </div>
                <button
                  onClick={() => handleNotificationsChange(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? "bg-green-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">💾 Auto-save</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Save recipes automatically</p>
                </div>
                <button
                  onClick={() => handleAutoSaveChange(!autoSave)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoSave ? "bg-green-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoSave ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>



          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">🥗 Dietary Preferences</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["Vegetarian", "Vegan", "Gluten-Free", "Keto", "Low-Carb", "High-Protein", "Dairy-Free", "Nut-Free"].map((diet) => {
                const isSelected = dietaryPrefs.includes(diet)
                return (
                  <button
                    key={diet}
                    onClick={() => handleDietaryPrefsChange(diet)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm ${isSelected ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    {diet}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Volume2 className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">🔊 Audio & Accessibility</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">🔊 Sound Effects</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enable cooking timer sounds</p>
                </div>
                <button
                  onClick={() => handleSoundChange(!soundEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${soundEnabled ? "bg-green-600" : "bg-gray-200"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${soundEnabled ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Database className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">💾 Data Management</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">☁️ Cloud Sync</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sync data across devices</p>
                </div>
                <button
                  onClick={() => handleDataSyncChange(!dataSync)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${dataSync ? "bg-green-600" : "bg-gray-200"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${dataSync ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={handleExportData}
                  className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Export Data
                </button>
                <button 
                  onClick={() => alert('Backup feature coming soon!')}
                  className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <Key className="h-4 w-4" />
                  Backup Keys
                </button>
                <button 
                  onClick={handleClearCache}
                  className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Cache
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">🔒 Privacy & Security</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-800 dark:text-white mb-2">🛡️ Data Protection</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Your recipes and preferences are encrypted and stored securely.</p>
                <button 
                  onClick={() => window.open('/privacy-policy', '_blank')}
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                >
                  View Privacy Policy
                </button>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-800 dark:text-white mb-2">🔐 Account Security</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Manage your account security settings.</p>
                <button 
                  onClick={() => alert('Password change feature coming soon!')}
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}