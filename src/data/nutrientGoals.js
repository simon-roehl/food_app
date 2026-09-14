// Daily micronutrient goals for non-pregnant adults ages 19–50. Values are
// RDA where one exists and AI otherwise; sodium is the 2,300 mg CDRR limit.
// Units match MICRONUTRIENTS in utils/nutrients.js.
// TODO: add age- and pregnancy-specific profiles before collecting those data.
export const MICRONUTRIENT_GOALS = {
  male: {
    vitaminA: 900, vitaminC: 90, vitaminD: 15, vitaminE: 15, vitaminK: 120,
    thiamin: 1.2, riboflavin: 1.3, niacin: 16, vitaminB6: 1.3, vitaminB12: 2.4,
    folate: 400, choline: 550, pantothenicAcid: 5, calcium: 1000, iron: 8,
    magnesium: 420, phosphorus: 700, potassium: 3400, sodium: 2300, zinc: 11,
    copper: 0.9, manganese: 2.3, selenium: 55,
  },
  female: {
    vitaminA: 700, vitaminC: 75, vitaminD: 15, vitaminE: 15, vitaminK: 90,
    thiamin: 1.1, riboflavin: 1.1, niacin: 14, vitaminB6: 1.3, vitaminB12: 2.4,
    folate: 400, choline: 425, pantothenicAcid: 5, calcium: 1000, iron: 18,
    magnesium: 320, phosphorus: 700, potassium: 2600, sodium: 2300, zinc: 8,
    copper: 0.9, manganese: 1.8, selenium: 55,
  },
}

export function getMicronutrientGoals(sex) {
  return MICRONUTRIENT_GOALS[sex] ?? MICRONUTRIENT_GOALS.male
}
