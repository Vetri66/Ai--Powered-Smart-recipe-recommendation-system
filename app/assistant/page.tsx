"use client"

import { useState, useRef } from "react"
import { ChefHat, Send, Sparkles, Camera, Mic, MicOff } from "lucide-react"

// Type declarations for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export default function AssistantPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [filters, setFilters] = useState({})
  const fileInputRef = useRef(null)

  const suggestions = [
    "What can I cook with chicken and rice?",
    "Create a meal plan for weight loss",
    "Suggest recipes for my dietary restrictions",
    "Help me use leftover ingredients",
    "Quick healthy breakfast ideas",
    "Budget-friendly dinner recipes"
  ]

  const handleSend = async (text) => {
    if (!text.trim()) return
    
    const userMessage = { id: Date.now(), role: "user", text }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    // Simulate AI response without API calls
    setTimeout(() => {
      const responses = {
        'chicken': "🍗 **Chicken Recipe Ideas:**\n\n• Grilled Chicken with herbs (25 min, 320 cal)\n• Chicken Stir Fry with vegetables (15 min, 280 cal)\n• Baked Chicken Breast with lemon (30 min, 250 cal)\n\n**Tip:** Always let chicken rest 5 minutes after cooking!",
        'rice': "🍚 **Rice Cooking Tips:**\n\n• Perfect ratio: 1 cup rice to 1.5 cups water\n• Rinse rice until water runs clear\n• Let it rest 10 minutes after cooking\n\n**Variations:** Add herbs, spices, or broth for flavor!",
        'pasta': "🍝 **Pasta Perfection:**\n\n• Use plenty of salted water\n• Cook until al dente (firm to bite)\n• Save pasta water for sauce\n\n**Quick Sauce:** Garlic, olive oil, and parmesan!",
        'healthy': "🥗 **Healthy Cooking Tips:**\n\n• Use herbs and spices instead of salt\n• Steam or grill instead of frying\n• Add colorful vegetables\n• Choose lean proteins\n\n**Remember:** Fresh ingredients make the biggest difference!",
        'quick': "⚡ **Quick Meal Ideas:**\n\n• Scrambled eggs with toast (5 min)\n• Pasta with garlic oil (10 min)\n• Stir-fried vegetables (8 min)\n• Grilled cheese sandwich (6 min)\n\n**Tip:** Prep ingredients in advance!",
        'breakfast': "🥞 **Breakfast Ideas:**\n\n• Overnight oats with fruits\n• Avocado toast with egg\n• Greek yogurt with berries\n• Smoothie bowl\n\n**Pro tip:** Prepare the night before for busy mornings!"
      }
      
      let response = "🍳 **Cooking Assistant Here!**\n\n"
      
      // Find matching keywords
      const keywords = Object.keys(responses)
      const matchedKeyword = keywords.find(keyword => 
        text.toLowerCase().includes(keyword)
      )
      
      if (matchedKeyword) {
        response = responses[matchedKeyword]
      } else {
        response += "Here are some general cooking tips:\n\n• Taste as you cook and adjust seasoning\n• Prep all ingredients before starting\n• Keep your knives sharp\n• Clean as you go\n\n**Ask me about:** chicken, rice, pasta, healthy meals, quick recipes, or breakfast ideas!"
      }
      
      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: response
      }
      setMessages(prev => [...prev, aiMessage])
      setLoading(false)
    }, 1000)
  }

  const extractIngredients = (text) => {
    const commonIngredients = ['chicken', 'beef', 'salmon', 'rice', 'pasta', 'tomato', 'onion', 'garlic', 'cheese']
    return commonIngredients.filter(ingredient => 
      text.toLowerCase().includes(ingredient)
    )
  }



  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser. Please use Chrome or Edge.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsRecording(true)
      console.log('Voice recognition started')
    }
    
    recognition.onend = () => {
      setIsRecording(false)
      console.log('Voice recognition ended')
    }
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      console.log('Voice input:', transcript)
      setInput(transcript)
    }
    
    recognition.onerror = (event) => {
      setIsRecording(false)
      
      // Handle different error types gracefully
      if (event.error === 'aborted') {
        // User stopped recording - no need to show error
        return
      } else if (event.error === 'no-speech') {
        console.warn('No speech detected')
      } else if (event.error === 'not-allowed') {
        console.warn('Microphone access denied')
      } else {
        console.warn('Voice recognition error:', event.error)
      }
    }

    try {
      recognition.start()
    } catch (error) {
      console.error('Failed to start voice recognition:', error)
      setIsRecording(false)
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageMessage = {
          id: Date.now(),
          role: "user",
          text: "[Image uploaded] What can I cook with these ingredients?",
          image: e.target.result
        }
        setMessages(prev => [...prev, imageMessage])
        handleSend("I uploaded an image of ingredients. What recipes can you suggest?")
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 transition-colors">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative">
            <div className="absolute -top-4 -left-4 text-4xl animate-bounce">🍳</div>
            <div className="absolute -top-2 -right-6 text-3xl animate-pulse">✨</div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-full shadow-lg animate-pulse">
                <ChefHat className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                🤖 AI Recipe Assistant
              </h1>
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce" style={{animationDelay: '0.5s'}}>👨‍🍳</div>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-6 font-medium">
            🍽️ Ask me anything about cooking, recipes, or meal planning! 🥘
          </p>
          <div className="flex justify-center gap-2 mt-4 text-sm text-gray-600">
            <span className="bg-white/70 px-3 py-1 rounded-full">🔥 Smart Recipes</span>
            <span className="bg-white/70 px-3 py-1 rounded-full">🎯 Personalized</span>
            <span className="bg-white/70 px-3 py-1 rounded-full">⚡ Instant Help</span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-gradient-to-r from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-700/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-6 border border-white/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                🎛️ Smart Filters
              </h3>
              <p className="text-sm text-gray-600 mt-1">✨ Customize your perfect recipe search</p>
            </div>
            <button
              onClick={() => {
                setFilters({})
                setMessages([])
                setInput("")
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              🔄 Reset All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Duration Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                ⏱️ Cooking Time
              </label>
              <select 
                value={filters.duration || ""} 
                onChange={(e) => setFilters({...filters, duration: e.target.value})}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300 shadow-sm"
              >
                <option value="">⏰ Any Duration</option>
                <option value="15">⚡ Under 15 mins</option>
                <option value="30">🏃 Under 30 mins</option>
                <option value="60">🚶 Under 1 hour</option>
              </select>
            </div>
            
            {/* Calories Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                🔥 Calories
              </label>
              <select 
                value={filters.calories || ""} 
                onChange={(e) => setFilters({...filters, calories: e.target.value})}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all hover:border-gray-300 shadow-sm"
              >
                <option value="">🍽️ Any Calories</option>
                <option value="200">🥗 Under 200 cal</option>
                <option value="400">🍲 Under 400 cal</option>
                <option value="600">🍖 Under 600 cal</option>
              </select>
            </div>
            
            {/* Cuisine Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                🌍 Cuisine
              </label>
              <select 
                value={filters.cuisine || ""} 
                onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all hover:border-gray-300 shadow-sm"
              >
                <option value="">🌎 All Cuisines</option>
                <option value="italian">🍝 Italian</option>
                <option value="asian">🍜 Asian</option>
                <option value="indian">🍛 Indian</option>
                <option value="mexican">🌮 Mexican</option>
              </select>
            </div>
            
            {/* Difficulty Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                📊 Difficulty
              </label>
              <select 
                value={filters.difficulty || ""} 
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all hover:border-gray-300 shadow-sm"
              >
                <option value="">🎯 Any Level</option>
                <option value="easy">😊 Easy</option>
                <option value="medium">🤔 Medium</option>
                <option value="hard">😤 Hard</option>
              </select>
            </div>
            
            {/* Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                🥬 Diet Type
              </label>
              <select 
                value={filters.type || ""} 
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all hover:border-gray-300 shadow-sm"
              >
                <option value="">🍽️ All Types</option>
                <option value="veg">🥕 Vegetarian</option>
                <option value="non-veg">🍖 Non-Vegetarian</option>
                <option value="vegan">🌱 Vegan</option>
              </select>
            </div>
          </div>
          
          {/* Active Filters Display */}
          {Object.keys(filters).some(key => filters[key]) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800 mb-2">🎯 Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => 
                  value && (
                    <span key={key} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {key}: {value}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Chat Container */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/50 dark:border-gray-700/50">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="relative mb-6">
                  <div className="text-6xl mb-4 animate-bounce">🤖</div>
                  <Sparkles className="h-8 w-8 text-yellow-400 mx-auto mb-2 animate-pulse" />
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
                    <div className="flex gap-1">
                      <span className="text-2xl animate-bounce" style={{animationDelay: '0s'}}>✨</span>
                      <span className="text-2xl animate-bounce" style={{animationDelay: '0.2s'}}>🌟</span>
                      <span className="text-2xl animate-bounce" style={{animationDelay: '0.4s'}}>✨</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">👋 Hello, Chef!</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">🍳 Ready to create something delicious? Pick a suggestion or ask me anything!</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestions.map((suggestion, index) => {
                    const emojis = ['🍗🍚', '📋💪', '🥗⚡', '🍽️♻️', '🥞☀️', '💰🍽️']
                    return (
                      <button
                        key={index}
                        onClick={() => handleSend(suggestion)}
                        className="p-4 text-left bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-green-50 hover:to-blue-50 transition-all duration-300 text-sm border border-gray-200 hover:border-green-300 hover:shadow-md transform hover:-translate-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{emojis[index]}</span>
                          <span className="font-medium">{suggestion}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                    message.role === "user" 
                      ? "bg-gradient-to-r from-green-600 to-green-700 text-white" 
                      : "bg-gradient-to-r from-white to-gray-50 text-gray-800 border border-gray-200"
                  }`}>
                  {message.role === "assistant" && <span className="text-lg mr-2">🤖</span>}
                  {message.role === "user" && <span className="text-lg mr-2">👨‍🍳</span>}
                    {message.image && (
                      <img src={message.image} alt="Uploaded" className="w-full h-32 object-cover rounded-lg mb-2" />
                    )}
                    <div className="whitespace-pre-wrap text-sm">{message.text}</div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-blue-100 to-green-100 px-6 py-4 rounded-2xl shadow-md border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg animate-bounce">🤖</span>
                    <span className="text-sm text-gray-600 font-medium">Cooking up an answer...</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-6">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(input) }} className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="🍳 Ask about recipes, ingredients, cooking tips... 🥘"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white shadow-sm"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  title="Upload ingredient photo"
                >
                  <Camera className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`p-3 border rounded-xl transition-colors ${
                    isRecording 
                      ? 'bg-red-100 border-red-300 text-red-600' 
                      : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                  }`}
                  title="Voice input"
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => handleSend("I have chicken and rice, what can I cook?")}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-blue-200"
                >
                  <span className="text-2xl mb-1">🧠</span>
                  <span className="text-sm font-semibold">Smart Suggestions</span>
                  <span className="text-xs text-blue-600 mt-1">AI-powered recipes</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const message = "📅 **7-Day Meal Plan Suggestion:**\n\nDay 1: Grilled Chicken Salad (320 cal)\nDay 2: Salmon Rice Bowl (450 cal)\nDay 3: Turkey Wrap (380 cal)\nDay 4: Vegetable Stir Fry (280 cal)\nDay 5: Pasta Primavera (420 cal)\nDay 6: Fish Tacos (350 cal)\nDay 7: Quinoa Buddha Bowl (390 cal)\n\n💪 Balanced nutrition with variety!"
                    handleSend(message)
                  }}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-700 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-green-200"
                >
                  <span className="text-2xl mb-1">📊</span>
                  <span className="text-sm font-semibold">Meal Optimizer</span>
                  <span className="text-xs text-green-600 mt-1">Dynamic programming</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSend("Analyze nutrition for pasta with chicken and tomato")}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 text-purple-700 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-purple-200"
                >
                  <span className="text-2xl mb-1">🔬</span>
                  <span className="text-sm font-semibold">Nutrition Analysis</span>
                  <span className="text-xs text-purple-600 mt-1">Health optimization</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSend("Find alternatives for chicken in my recipe")}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-100 to-orange-200 hover:from-orange-200 hover:to-orange-300 text-orange-700 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-orange-200"
                >
                  <span className="text-2xl mb-1">🔄</span>
                  <span className="text-sm font-semibold">Smart Alternatives</span>
                  <span className="text-xs text-orange-600 mt-1">Graph algorithms</span>
                </button>
              </div>
            </form>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  )
}