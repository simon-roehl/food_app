export const MICRONUTRIENTS = [
  { key: 'vitaminA', label: 'Vitamin A', unit: 'mcg' },
  { key: 'vitaminC', label: 'Vitamin C', unit: 'mg' },
  { key: 'vitaminD', label: 'Vitamin D', unit: 'mcg' },
  { key: 'vitaminE', label: 'Vitamin E', unit: 'mg' },
  { key: 'vitaminK', label: 'Vitamin K', unit: 'mcg' },
  { key: 'thiamin', label: 'Thiamin (B1)', unit: 'mg' },
  { key: 'riboflavin', label: 'Riboflavin (B2)', unit: 'mg' },
  { key: 'niacin', label: 'Niacin (B3)', unit: 'mg' },
  { key: 'vitaminB6', label: 'Vitamin B6', unit: 'mg' },
  { key: 'vitaminB12', label: 'Vitamin B12', unit: 'mcg' },
  { key: 'folate', label: 'Folate', unit: 'mcg' },
  { key: 'choline', label: 'Choline', unit: 'mg' },
  { key: 'pantothenicAcid', label: 'Pantothenic Acid', unit: 'mg' },
  { key: 'calcium', label: 'Calcium', unit: 'mg' },
  { key: 'iron', label: 'Iron', unit: 'mg' },
  { key: 'magnesium', label: 'Magnesium', unit: 'mg' },
  { key: 'phosphorus', label: 'Phosphorus', unit: 'mg' },
  { key: 'potassium', label: 'Potassium', unit: 'mg' },
  { key: 'sodium', label: 'Sodium', unit: 'mg' },
  { key: 'zinc', label: 'Zinc', unit: 'mg' },
  { key: 'copper', label: 'Copper', unit: 'mg' },
  { key: 'manganese', label: 'Manganese', unit: 'mg' },
  { key: 'selenium', label: 'Selenium', unit: 'mcg' },
]

export const MACROS = [
  { key: 'calories', label: 'Calories', unit: 'kcal' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'carbs', label: 'Carbs', unit: 'g' },
  { key: 'fat', label: 'Fat', unit: 'g' },
]

const LIMIT_NUTRIENTS = new Set(['sodium', 'saturatedFat', 'addedSugar', 'cholesterol'])

export function colorForPercent(percent, key) {
  if (LIMIT_NUTRIENTS.has(key)) {
    if (percent <= 80) return 'var(--bar-good)'
    if (percent <= 100) return 'var(--bar-caution)'
    return 'var(--bar-bad)'
  }
  if (percent <= 30) return 'var(--bar-bad)'
  if (percent <= 80) return 'var(--bar-caution)'
  if (percent <= 130) return 'var(--bar-good)'
  if (percent <= 160) return 'var(--bar-caution)'
  return 'var(--bar-bad)'
}

export function widthForPercent(percent) {
  return `${Math.min(Math.max(percent, 0), 100)}%`
}

// Missing values are unknown, not zero. A period with no entries is complete
// enough to display zero without an asterisk.
export function isIncomplete(entries, nutrientKey) {
  return entries.some((entry) => entry.nutrients?.[nutrientKey]?.quality !== 'complete')
}
