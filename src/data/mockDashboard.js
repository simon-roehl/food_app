import { toDateKey } from '../utils/goals'

export const mockProfile = {
  sex: 'male', age: 27, heightCm: 178, weightKg: 79.4, dailySteps: 8000, goalType: 'cut',
  workoutSplit: { cycleLengthDays: 4, cycleStartDate: '2026-09-01', days: [{ type: 'Push', calorieBonus: 300 }, { type: 'Pull', calorieBonus: 300 }, { type: 'Legs', calorieBonus: 400 }, { type: 'Rest', calorieBonus: 0 }] },
}

const today = toDateKey(new Date())
export const mockDailyLogs = {
  [today]: [
    { entryId: 'entry_1', name: 'Grilled chicken breast', quantity: 180, unit: 'g', nutrients: { calories: { value: 297, quality: 'complete' }, protein: { value: 56, quality: 'complete' }, carbs: { value: 0, quality: 'complete' }, fat: { value: 6, quality: 'complete' }, zinc: { value: 0.9, quality: 'estimated' }, sodium: { value: 74, quality: 'complete' } } },
    { entryId: 'entry_2', name: 'Brown rice', quantity: 1, unit: 'cup', nutrients: { calories: { value: 216, quality: 'complete' }, protein: { value: 5, quality: 'complete' }, carbs: { value: 45, quality: 'complete' }, fat: { value: 1.8, quality: 'complete' }, sodium: { value: 10, quality: 'complete' } } },
  ],
}
