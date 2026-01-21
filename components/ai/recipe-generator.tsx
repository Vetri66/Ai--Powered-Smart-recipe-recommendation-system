import { useState } from "react"
import { Wand2, Loader2, Plus, X, Sparkles, ChefHat, Star, Clock, Users, Flame } from "lucide-react"

const RecipeGenerator = () => {
  const [loading, setLoading] = useState(false)
  const [generatedRecipe, setGeneratedRecipe] = useState(null)
  const [ingredients, setIngredients] = useState([''])
  const [preferences, setPreferences] = useState('')
  const [dietaryRestrictions, setDietaryRestrictions] = useState([])
  const [error, setError] = useState('')
  const [testResult, setTestResult] = useState('')

  const addIngredient = () => {
    setIngredients([...ingredients, ''])
  }

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index, value) => {
    const updated = [...ingredients]
    updated[index] = value
    setIngredients(updated)
  }

  const generateRecipe = async () => {
    const validIngredients = ingredients.filter(ing => ing.trim())
    if (validIngredients.length === 0) {
      setError('Please add at least one ingredient')
      return
    }

    setLoading(true)
    setError('')
    setGeneratedRecipe(null)
    
    try {
      const response = await fetch('/api/openai-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ingredients: validIngredients,
          preferences,
          dietaryRestrictions
        })
      })
      
      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        throw new Error('Invalid response from server')
      }
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setGeneratedRecipe(data)
      
    } catch (error) {
      console.error('Failed to generate recipe:', error)
      setError(`Failed to generate recipe: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testOpenAI = async () => {
    try {
      const response = await fetch('/api/test-openai')
      const data = await response.json()
      setTestResult(data.status === 'success' ? '✅ OpenAI Connected' : `❌ ${data.message}`)
    } catch (error) {
      setTestResult(`❌ Test failed: ${error.message}`)
    }
  }

  return (
    <div className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-900/20 dark:via-gray-800 dark:to-emerald-900/20 rounded-2xl shadow-2xl p-8 border border-green-200/50 dark:border-green-700/50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-200/30 to-lime-200/30 rounded-full blur-2xl animate-bounce"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
                ✨ AI Recipe Generator
                <Sparkles className="h-5 w-5 text-yellow-500 animate-spin" />
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                <span className="animate-bounce">🤖</span> Powered by OpenAI GPT
              </p>
            </div>
          </div>
          <button
            onClick={testOpenAI}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            Test Connection
          </button>
        </div>
      
        {testResult && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-700 dark:text-blue-300 animate-fadeIn">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              {testResult}
            </div>
          </div>
        )}
      
        {/* Ingredients Input */}
        <div className="mb-6">
          <label className="block text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-2xl animate-bounce">🥘</span>
            Your Magic Ingredients
          </label>
          <div className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-3 group">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder="🥕 Enter an ingredient..."
                    className="w-full px-4 py-3 border-2 border-green-200 dark:border-green-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 group-hover:border-green-300"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
                {ingredients.length > 1 && (
                  <button
                    onClick={() => removeIngredient(index)}
                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 transform hover:scale-110"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addIngredient}
              className="flex items-center gap-3 px-4 py-3 text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 rounded-xl transition-all duration-300 transform hover:scale-105 border-2 border-dashed border-green-300 dark:border-green-600 hover:border-solid"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Add Another Ingredient</span>
              <span className="text-xl animate-bounce">✨</span>
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="mb-6">
          <label className="block text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-2xl animate-pulse">🎯</span>
            Cooking Preferences
          </label>
          
          {/* Quick Selection Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {[
              { label: "🌶️ Spicy", value: "spicy" },
              { label: "🥗 Low-carb", value: "low-carb" },
              { label: "⚡ Quick", value: "quick meal" },
              { label: "🌱 Vegan", value: "vegan" },
              { label: "🥩 High-protein", value: "high-protein" },
              { label: "🍯 Sweet", value: "sweet" },
              { label: "🧄 Savory", value: "savory" },
              { label: "🔥 Grilled", value: "grilled" }
            ].map((pref) => (
              <button
                key={pref.value}
                type="button"
                onClick={() => {
                  const current = preferences.split(',').map(p => p.trim()).filter(p => p)
                  if (current.includes(pref.value)) {
                    setPreferences(current.filter(p => p !== pref.value).join(', '))
                  } else {
                    setPreferences([...current, pref.value].join(', '))
                  }
                }}
                className={`px-3 py-2 text-sm rounded-lg border-2 transition-all duration-300 ${
                  preferences.includes(pref.value)
                    ? "bg-green-500 text-white border-green-500 transform scale-105"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-green-200 dark:border-green-700 hover:border-green-400 hover:scale-105"
                }`}
              >
                {pref.label}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <input
              type="text"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="Add custom preferences or use buttons above..."
              className="w-full px-4 py-3 border-2 border-green-200 dark:border-green-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400">
              <Star className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-shake">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={generateRecipe}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-2xl hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25 font-bold text-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          {loading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="animate-pulse">🧙‍♂️ Crafting Your Recipe...</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </>
          ) : (
            <>
              <Wand2 className="h-6 w-6 animate-pulse" />
              <span>✨ Generate Magic Recipe</span>
              <ChefHat className="h-6 w-6 animate-bounce" />
            </>
          )}
        </button>
      
        {/* Generated Recipe Display */}
        {generatedRecipe && (
          <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-emerald-900/20 dark:via-gray-800 dark:to-blue-900/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-700 shadow-2xl animate-fadeIn relative overflow-hidden">
            {/* Success Animation */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-2xl animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-bounce">
                    <ChefHat className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                      {generatedRecipe.name}
                    </h4>
                    {generatedRecipe.source && (
                      <span className="text-xs px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 text-green-600 dark:text-green-300 rounded-full font-medium">
                        ✨ {generatedRecipe.source}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-4xl animate-bounce">🎉</div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                {generatedRecipe.description}
              </p>
              
              {generatedRecipe.note && (
                <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💡</span>
                    <span className="text-yellow-700 dark:text-yellow-300 font-medium">{generatedRecipe.note}</span>
                  </div>
                </div>
              )}
              
              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl transform hover:scale-105 transition-all duration-300">
                  <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="font-bold text-xl text-green-700 dark:text-green-300">{generatedRecipe.cookingTime}min</div>
                  <div className="text-green-600 dark:text-green-400 text-sm font-medium">Cook Time</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl transform hover:scale-105 transition-all duration-300">
                  <Users className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="font-bold text-xl text-emerald-700 dark:text-emerald-300">{generatedRecipe.servings}</div>
                  <div className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">Servings</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30 rounded-xl transform hover:scale-105 transition-all duration-300">
                  <Star className="h-6 w-6 text-teal-600 mx-auto mb-2" />
                  <div className="font-bold text-xl text-teal-700 dark:text-teal-300">{generatedRecipe.difficulty}</div>
                  <div className="text-teal-600 dark:text-teal-400 text-sm font-medium">Difficulty</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-100 to-red-200 dark:from-orange-900/30 dark:to-red-800/30 rounded-xl transform hover:scale-105 transition-all duration-300">
                  <Flame className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <div className="font-bold text-xl text-orange-700 dark:text-orange-300">{generatedRecipe.nutrition?.calories || 'N/A'}</div>
                  <div className="text-orange-600 dark:text-orange-400 text-sm font-medium">Calories</div>
                </div>
              </div>

              {/* Enhanced Recipe Content */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/70 dark:bg-gray-800/70 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h5 className="font-bold text-lg text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">🥘</span>
                    Ingredients
                  </h5>
                  <ul className="space-y-2">
                    {generatedRecipe.ingredients?.map((ing, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors">
                        <span className="text-green-500">✓</span>
                        <span className="font-medium">{ing.amount}</span>
                        <span>{ing.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white/70 dark:bg-gray-800/70 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h5 className="font-bold text-lg text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">👨‍🍳</span>
                    Instructions
                  </h5>
                  <ol className="space-y-3">
                    {generatedRecipe.instructions?.map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors">
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipeGenerator