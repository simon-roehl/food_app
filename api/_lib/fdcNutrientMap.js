export const FDC_NUTRIENT_MAP = {
  208: 'calories', 203: 'protein', 205: 'carbs', 204: 'fat', 606: 'saturatedFat',
  601: 'cholesterol', 307: 'sodium', 539: 'addedSugar', 320: 'vitaminA',
  401: 'vitaminC', 328: 'vitaminD', 323: 'vitaminE', 430: 'vitaminK',
  404: 'thiamin', 405: 'riboflavin', 406: 'niacin', 415: 'vitaminB6',
  418: 'vitaminB12', 417: 'folate', 421: 'choline', 410: 'pantothenicAcid',
  301: 'calcium', 303: 'iron', 304: 'magnesium', 305: 'phosphorus',
  306: 'potassium', 309: 'zinc', 312: 'copper', 315: 'manganese', 317: 'selenium',
}

export function mapFdcNutrients(foodNutrients = []) {
  const nutrients = {}
  for (const nutrient of foodNutrients) {
    const key = FDC_NUTRIENT_MAP[Number(nutrient.nutrient?.number ?? nutrient.nutrientNumber)]
    const value = nutrient.amount ?? nutrient.value
    if (key && typeof value === 'number') nutrients[key] = { value, quality: 'complete' }
  }
  return nutrients
}
