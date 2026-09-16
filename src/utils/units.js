export const MASS_UNITS = ['g', 'oz', 'lb']
const GRAMS_PER_UNIT = { g: 1, oz: 28.3495, lb: 453.592 }
export const convertToGrams = (quantity, unit) => quantity * (GRAMS_PER_UNIT[unit] ?? 1)
