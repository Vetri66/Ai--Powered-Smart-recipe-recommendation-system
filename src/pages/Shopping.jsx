"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Check, X, Plus, Trash2, Download } from "lucide-react"
import { useRecipe } from "../context/RecipeContext"

const Shopping = () => {
  const { shoppingList, removeFromShoppingList, addToShoppingList, clearShoppingList } = useRecipe()
  const [checkedItems, setCheckedItems] = useState(new Set())
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItem, setNewItem] = useState({ name: "", amount: "", category: "pantry" })

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups = {}
    shoppingList.forEach((item) => {
      const category = item.category || "other"
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(item)
    })
    return groups
  }, [shoppingList])

  const categoryLabels = {
    vegetables: "Vegetables",
    fruits: "Fruits",
    meat: "Meat & Poultry",
    seafood: "Seafood",
    dairy: "Dairy",
    grains: "Grains & Bread",
    pantry: "Pantry",
    herbs: "Herbs & Spices",
    other: "Other",
  }

  const categoryIcons = {
    vegetables: "🥕",
    fruits: "🍎",
    meat: "🥩",
    seafood: "🐟",
    dairy: "🥛",
    grains: "🌾",
    pantry: "🥫",
    herbs: "🌿",
    other: "📦",
  }

  const handleToggleItem = (itemName) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(itemName)) {
      newChecked.delete(itemName)
    } else {
      newChecked.add(itemName)
    }
    setCheckedItems(newChecked)
  }

  const handleAddItem = () => {
    if (newItem.name.trim()) {
      addToShoppingList(newItem)
      setNewItem({ name: "", amount: "", category: "pantry" })
      setShowAddItem(false)
    }
  }

  const handleExportList = () => {
    const listText = Object.entries(groupedItems)
      .map(([category, items]) => {
        const categoryName = categoryLabels[category] || category
        const itemList = items.map((item) => `- ${item.name} (${item.amount})`).join("\n")
        return `${categoryName}:\n${itemList}`
      })
      .join("\n\n")

    const blob = new Blob([listText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "shopping-list.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalItems = shoppingList.length
  const checkedCount = checkedItems.size
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <ShoppingCart className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Shopping List</h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">Your automatically generated shopping list from your meal plan</p>

          {/* Progress Bar */}
          {totalItems > 0 && (
            <div className="max-w-md mx-auto mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>
                  {checkedCount} of {totalItems} items
                </span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-primary-600 h-2 rounded-full"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button onClick={() => setShowAddItem(true)} className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </button>
            {totalItems > 0 && (
              <>
                <button onClick={handleExportList} className="btn-secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Export List
                </button>
                <button
                  onClick={clearShoppingList}
                  className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4 mr-2 inline" />
                  Clear All
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Shopping List */}
        {totalItems === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Your shopping list is empty</h3>
            <p className="text-gray-500 mb-6">
              Add recipes to your meal planner to generate a shopping list automatically
            </p>
            <button onClick={() => setShowAddItem(true)} className="btn-primary">
              Add Item Manually
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([category, items]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Category Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{categoryIcons[category] || "📦"}</span>
                    <h3 className="text-lg font-semibold text-gray-800">{categoryLabels[category] || category}</h3>
                    <span className="text-sm text-gray-500">
                      ({items.length} item{items.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-6">
                  <div className="space-y-3">
                    <AnimatePresence>
                      {items.map((item, index) => (
                        <motion.div
                          key={`${item.name}-${index}`}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`flex items-center space-x-4 p-3 rounded-lg border transition-all duration-200 ${
                            checkedItems.has(item.name)
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {/* Checkbox */}
                          <button
                            onClick={() => handleToggleItem(item.name)}
                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              checkedItems.has(item.name)
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-gray-300 hover:border-primary-500"
                            }`}
                          >
                            {checkedItems.has(item.name) && <Check className="h-4 w-4" />}
                          </button>

                          {/* Item Info */}
                          <div className="flex-1">
                            <div
                              className={`font-medium transition-all duration-200 ${
                                checkedItems.has(item.name) ? "text-green-700 line-through" : "text-gray-800"
                              }`}
                            >
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">{item.amount}</div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromShoppingList(item.name)}
                            className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Item Modal */}
        <AnimatePresence>
          {showAddItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowAddItem(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Add Item</h3>
                  <button
                    onClick={() => setShowAddItem(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="e.g., Tomatoes"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input
                      type="text"
                      value={newItem.amount}
                      onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                      placeholder="e.g., 2 lbs"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="input-field"
                    >
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button onClick={() => setShowAddItem(false)} className="flex-1 btn-secondary">
                    Cancel
                  </button>
                  <button
                    onClick={handleAddItem}
                    disabled={!newItem.name.trim()}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Item
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Shopping
