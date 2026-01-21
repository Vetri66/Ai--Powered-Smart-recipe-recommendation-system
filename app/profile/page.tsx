"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useRecipe } from "../../src/context/RecipeContext"
import { Heart, Calendar, ShoppingCart, ChefHat, Sparkles, User, LogOut, Clock, TrendingUp, Award, Target, Flame, Utensils, Star, BookOpen, Edit, Camera, Mail, Phone, MapPin, Cake } from "lucide-react"
import useSWR from "swr"
import { getBrowserSupabase } from "../../lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const Profile = () => {
  const { favorites, mealPlan, shoppingList } = useRecipe()
  const router = useRouter()
  const supabase = getBrowserSupabase()
  
  const { data: user } = useSWR("supabase-user", async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) return null
    return data.user
  })

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (limit to 1MB)
      if (file.size > 1024 * 1024) {
        alert('Image too large. Please select an image under 1MB.')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const newProfile = { ...profileData, avatar: e.target.result }
          setProfileData(newProfile)
          localStorage.setItem('userProfile', JSON.stringify(newProfile))
        } catch (error) {
          alert('Image too large for storage. Please select a smaller image.')
          console.error('Storage error:', error)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSave = () => {
    try {
      localStorage.setItem('userProfile', JSON.stringify(profileData))
      setIsEditing(false)
    } catch (error) {
      alert('Unable to save profile. Storage quota exceeded.')
      console.error('Storage error:', error)
    }
  }

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const [favoriteCount, setFavoriteCount] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    avatar: ''
  })
  
  useEffect(() => {
    const updateFavoriteCount = () => {
      const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]')
      setFavoriteCount(favorites.length)
    }
    
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}')
    setProfileData(prev => ({
      ...prev,
      name: savedProfile.name || user?.email?.split('@')[0] || 'Chef',
      phone: savedProfile.phone || '+1 (555) 123-4567',
      location: savedProfile.location || 'New York, USA',
      avatar: savedProfile.avatar || ''
    }))
    
    updateFavoriteCount()
    
    window.addEventListener('storage', updateFavoriteCount)
    window.addEventListener('favoritesUpdated', updateFavoriteCount)
    
    return () => {
      window.removeEventListener('storage', updateFavoriteCount)
      window.removeEventListener('favoritesUpdated', updateFavoriteCount)
    }
  }, [user])
  const plannedCount = Object.values(mealPlan || {}).flat().length || 0
  const shoppingCount = shoppingList?.length || 0
  const recipesCooked = 12
  const cookingStreak = 7
  const totalCookingTime = 24
  const weeklyGoal = 5
  const weeklyProgress = 2

  const achievements = [
    { id: 1, name: "First Recipe", desc: "Cooked your first recipe", icon: "🍳", earned: true },
    { id: 2, name: "Recipe Explorer", desc: "Tried 10 different recipes", icon: "🗺️", earned: false },
    { id: 3, name: "Meal Planner", desc: "Planned a full week of meals", icon: "📅", earned: false },
    { id: 4, name: "Healthy Chef", desc: "Cooked 20 healthy recipes", icon: "🥗", earned: false }
  ]

  const recentActivity = [
    { action: "Added 3 recipes to favorites", time: "Today", icon: Heart },
    { action: "Planned 5 meals for the week", time: "Yesterday", icon: Calendar },
    { action: "Created shopping list with 12 items", time: "2 days ago", icon: ShoppingCart },
    { action: "Completed 'Italian Week' challenge", time: "3 days ago", icon: Award }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {profileData.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'C'}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute -bottom-2 -right-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  <Camera className="h-4 w-4" />
                </label>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-3xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none text-gray-800 dark:text-white"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                      {profileData.name}
                    </h1>
                  )}
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email || 'chef@example.com'}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <MapPin className="h-4 w-4" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <span>{profileData.location}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Cake className="h-4 w-4" />
                    <span>Joined {new Date().getFullYear()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-4 justify-center md:justify-start">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">Level 5</div>
                    <div className="text-sm text-gray-500">Home Chef</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1,250</div>
                    <div className="text-sm text-gray-500">XP Points</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                {isEditing ? (
                  <button 
                    onClick={handleProfileSave}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Save Profile
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress to Level 6</span>
                <span className="text-sm text-gray-500">1,250 / 1,500 XP</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: '83%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <ChefHat className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-gray-800 dark:text-white">{recipesCooked}</span>
            </div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Recipes Cooked</h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-2xl font-bold text-gray-800">{favoriteCount}</span>
            </div>
            <h3 className="font-semibold text-gray-700">Favorite Recipes</h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-800">{plannedCount}</span>
            </div>
            <h3 className="font-semibold text-gray-700">Meal Plans</h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-800">{shoppingCount}</span>
            </div>
            <h3 className="font-semibold text-gray-700">Shopping Items</h3>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Weekly Goal */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Weekly Cooking Goal</h3>
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>{weeklyProgress} / {weeklyGoal} recipes</span>
                  <span>{Math.round((weeklyProgress / weeklyGoal) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{ width: `${(weeklyProgress / weeklyGoal) * 100}%` }}></div>
                </div>
              </div>
              <p className="text-gray-600">{weeklyGoal - weeklyProgress} more recipes to reach your goal</p>
            </motion.div>

            {/* Cooking Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Cooking Stats</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="p-4 bg-purple-100 rounded-xl mb-3 mx-auto w-fit">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{totalCookingTime}</p>
                  <p className="text-sm text-gray-600">Total Cooking Time</p>
                  <p className="text-xs text-gray-500">hours</p>
                </div>
                <div className="text-center">
                  <div className="p-4 bg-yellow-100 rounded-xl mb-3 mx-auto w-fit">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{Math.round(totalCookingTime * 60 / recipesCooked)}</p>
                  <p className="text-sm text-gray-600">Average per Recipe</p>
                  <p className="text-xs text-gray-500">mins</p>
                </div>
                <div className="text-center">
                  <div className="p-4 bg-green-100 rounded-xl mb-3 mx-auto w-fit">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">95%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Achievements</h3>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`p-4 rounded-xl border-2 transition-all ${achievement.earned ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                        {achievement.earned && <span className="text-xs text-green-600 font-medium">✓ Earned</span>}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{achievement.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Profile Details */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Profile Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-800">Full Name</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-white border border-gray-300 rounded px-2 py-1 text-gray-600"
                    />
                  ) : (
                    <span className="text-gray-600">{profileData.name}</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-800">Email</span>
                  </div>
                  <span className="text-gray-600">{user?.email || 'chef@example.com'}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-800">Phone</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-white border border-gray-300 rounded px-2 py-1 text-gray-600"
                    />
                  ) : (
                    <span className="text-gray-600">{profileData.phone}</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-800">Location</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="bg-white border border-gray-300 rounded px-2 py-1 text-gray-600"
                    />
                  ) : (
                    <span className="text-gray-600">{profileData.location}</span>
                  )}
                </div>
                
                {isEditing ? (
                  <button 
                    onClick={handleProfileSave}
                    className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Edit Profile Details
                  </button>
                )}
              </div>
            </motion.div>
            
            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/" className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <ChefHat className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-800">Cook Recipe</span>
                </Link>
                <Link href="/" className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-800">Recipe Book</span>
                </Link>
                <Link href="/" className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                  <Utensils className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-800">Nutrition</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-800">Settings</span>
                </Link>
              </div>
            </motion.div>

            {/* Cooking Streaks */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Cooking Streaks</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔥</span>
                    <div>
                      <p className="font-semibold text-gray-800">{cookingStreak}</p>
                      <p className="text-sm text-gray-600">Daily Cooking</p>
                    </div>
                  </div>
                  <span className="text-sm text-orange-600 font-medium">{cookingStreak} days streak</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🥗</span>
                    <div>
                      <p className="font-semibold text-gray-800">3</p>
                      <p className="text-sm text-gray-600">Healthy Meals</p>
                    </div>
                  </div>
                  <span className="text-sm text-green-600 font-medium">3 days streak</span>
                </div>
              </div>
            </motion.div>

            {/* Weekly Challenges */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Weekly Challenges</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2">Try 3 New Cuisines</h4>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress: 2/3 completed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '66%' }}></div>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-xl">
                  <h4 className="font-semibold text-gray-800 mb-2">Cook 5 Healthy Meals</h4>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress: 1/5 completed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile