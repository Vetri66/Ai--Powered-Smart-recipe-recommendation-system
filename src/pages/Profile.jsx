"use client"
import { motion } from "framer-motion"
import { User, Heart, Calendar, ShoppingCart, Settings, Award } from "lucide-react"
import { useRecipe } from "../context/RecipeContext"

const Profile = () => {
  const { favorites, mealPlan, shoppingList } = useRecipe()

  const getTotalMeals = () => {
    return Object.values(mealPlan).reduce((total, dayRecipes) => total + dayRecipes.length, 0)
  }

  const stats = [
    {
      icon: Heart,
      label: "Favorite Recipes",
      value: favorites.length,
      color: "text-red-500",
      bgColor: "bg-red-100",
    },
    {
      icon: Calendar,
      label: "Planned Meals",
      value: getTotalMeals(),
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      icon: ShoppingCart,
      label: "Shopping Items",
      value: shoppingList.length,
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      icon: Award,
      label: "Recipes Tried",
      value: 12, // This would come from user data in a real app
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
    },
  ]

  const achievements = [
    { name: "First Recipe", description: "Added your first recipe to favorites", earned: true },
    { name: "Meal Planner", description: "Planned your first week of meals", earned: true },
    { name: "Shopping Pro", description: "Generated 5 shopping lists", earned: false },
    { name: "Recipe Explorer", description: "Tried 20 different recipes", earned: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Your Profile</h1>
          <p className="text-lg text-gray-600">Track your cooking journey and preferences</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            )
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Favorite Recipes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Heart className="h-5 w-5 text-red-500 mr-2" />
              Favorite Recipes
            </h3>
            {favorites.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No favorite recipes yet. Start exploring and add some favorites!
              </p>
            ) : (
              <div className="space-y-3">
                {favorites.slice(0, 3).map((recipe) => (
                  <div key={recipe.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={recipe.image || "/placeholder.svg"}
                      alt={recipe.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{recipe.name}</h4>
                      <p className="text-sm text-gray-600">
                        {recipe.cookingTime} min • {recipe.difficulty}
                      </p>
                    </div>
                  </div>
                ))}
                {favorites.length > 3 && (
                  <p className="text-sm text-gray-500 text-center pt-2">And {favorites.length - 3} more...</p>
                )}
              </div>
            )}
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Award className="h-5 w-5 text-yellow-500 mr-2" />
              Achievements
            </h3>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div
                  key={achievement.name}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    achievement.earned ? "bg-green-50 border border-green-200" : "bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      achievement.earned ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {achievement.earned ? "✓" : "?"}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${achievement.earned ? "text-green-800" : "text-gray-600"}`}>
                      {achievement.name}
                    </h4>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Settings className="h-5 w-5 text-gray-600 mr-2" />
            Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Dietary Preferences</h4>
              <div className="space-y-2">
                {["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free"].map((diet) => (
                  <label key={diet} className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-gray-600">{diet}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Cooking Skill Level</h4>
              <select className="input-field">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
