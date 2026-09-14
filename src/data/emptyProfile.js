import { toDateKey } from '../utils/goals'

export function emptyProfile() {
  return {
    sex: 'male', age: 25, heightCm: 175, weightKg: 70, dailySteps: 8000, goalType: 'maintain',
    workoutSplit: {
      cycleLengthDays: 4, cycleStartDate: toDateKey(new Date()),
      days: [{ type: 'Push', calorieBonus: 300 }, { type: 'Pull', calorieBonus: 300 }, { type: 'Legs', calorieBonus: 400 }, { type: 'Rest', calorieBonus: 0 }],
    },
  }
}
