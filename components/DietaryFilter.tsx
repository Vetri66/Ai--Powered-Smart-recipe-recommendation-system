const DietaryFilter = ({ selectedRestrictions, onRestrictionsChange }) => {
  const restrictions = [
    'vegetarian',
    'vegan', 
    'gluten-free',
    'dairy-free',
    'seafood'
  ]

  const toggleRestriction = (restriction) => {
    if (selectedRestrictions.includes(restriction)) {
      onRestrictionsChange(selectedRestrictions.filter(r => r !== restriction))
    } else {
      onRestrictionsChange([...selectedRestrictions, restriction])
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Dietary Restrictions
      </h3>
      <div className="flex flex-wrap gap-2">
        {restrictions.map((restriction) => (
          <button
            key={restriction}
            onClick={() => toggleRestriction(restriction)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedRestrictions.includes(restriction)
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {restriction.charAt(0).toUpperCase() + restriction.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

export default DietaryFilter