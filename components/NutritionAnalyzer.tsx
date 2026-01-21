import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const NutritionAnalyzer = ({ recipes }) => {
  if (!recipes || recipes.length === 0) return null

  const totalNutrition = recipes.reduce((total, recipe) => ({
    calories: total.calories + (recipe.nutrition?.calories || recipe.calories || 0),
    protein: total.protein + (recipe.nutrition?.protein || recipe.protein || 0),
    carbs: total.carbs + (recipe.nutrition?.carbs || 0),
    fat: total.fat + (recipe.nutrition?.fat || 0),
    fiber: total.fiber + (recipe.nutrition?.fiber || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 })

  const avgNutrition = {
    calories: Math.round(totalNutrition.calories / recipes.length),
    protein: Math.round(totalNutrition.protein / recipes.length),
    carbs: Math.round(totalNutrition.carbs / recipes.length),
    fat: Math.round(totalNutrition.fat / recipes.length),
    fiber: Math.round(totalNutrition.fiber / recipes.length)
  }

  const getHealthScore = () => {
    let score = 0
    if (avgNutrition.protein >= 15) score += 25
    if (avgNutrition.calories <= 400) score += 25
    if (avgNutrition.fiber >= 5) score += 25
    if (avgNutrition.fat <= 15) score += 25
    return score
  }

  const healthScore = getHealthScore()

  // Chart data
  const pieData = [
    { name: 'Protein', value: avgNutrition.protein, color: '#3B82F6' },
    { name: 'Carbs', value: avgNutrition.carbs, color: '#EAB308' },
    { name: 'Fat', value: avgNutrition.fat, color: '#EF4444' },
    { name: 'Fiber', value: avgNutrition.fiber, color: '#8B5CF6' }
  ]

  const barData = [
    { name: 'Protein', value: avgNutrition.protein, color: '#3B82F6' },
    { name: 'Carbs', value: avgNutrition.carbs, color: '#EAB308' },
    { name: 'Fat', value: avgNutrition.fat, color: '#EF4444' },
    { name: 'Fiber', value: avgNutrition.fiber, color: '#8B5CF6' }
  ]

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg p-6 border border-green-200 dark:border-green-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          📊 Nutrition Analysis
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Health Score:</span>
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${
            healthScore >= 75 ? 'bg-green-500 text-white' :
            healthScore >= 50 ? 'bg-yellow-500 text-white' :
            'bg-red-500 text-white'
          }`}>
            {healthScore}%
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-green-200 dark:border-green-700">
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-2xl font-bold text-green-600">{avgNutrition.calories}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Calories</div>
        </div>
        <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-green-200 dark:border-green-700">
          <div className="text-2xl mb-1">🥩</div>
          <div className="text-2xl font-bold text-blue-600">{avgNutrition.protein}g</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Protein</div>
        </div>
        <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-green-200 dark:border-green-700">
          <div className="text-2xl mb-1">🍞</div>
          <div className="text-2xl font-bold text-yellow-600">{avgNutrition.carbs}g</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Carbs</div>
        </div>
        <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-green-200 dark:border-green-700">
          <div className="text-2xl mb-1">🥑</div>
          <div className="text-2xl font-bold text-red-600">{avgNutrition.fat}g</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Fat</div>
        </div>
        <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-green-200 dark:border-green-700">
          <div className="text-2xl mb-1">🌾</div>
          <div className="text-2xl font-bold text-purple-600">{avgNutrition.fiber}g</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Fiber</div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Pie Chart */}
        <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-green-200 dark:border-green-700">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">Macronutrient Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}g`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-green-200 dark:border-green-700">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">Nutritional Breakdown</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6B7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
              <Tooltip 
                formatter={(value) => [`${value}g`, 'Amount']}
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
        <p className="text-sm text-green-800 dark:text-green-300">
          💡 <strong>Analysis:</strong> {recipes.length} recipes analyzed. 
          {healthScore >= 75 ? 'Excellent nutritional balance!' :
           healthScore >= 50 ? 'Good nutrition with room for improvement.' :
           'Consider adding more nutrient-dense recipes.'}
        </p>
      </div>
    </div>
  )
}

export default NutritionAnalyzer