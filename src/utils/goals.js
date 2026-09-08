const ACTIVITY_BANDS = [
  { maxSteps: 5000, multiplier: 1.2 },
  { maxSteps: 7500, multiplier: 1.375 },
  { maxSteps: 10000, multiplier: 1.55 },
  { maxSteps: Infinity, multiplier: 1.725 },
]

const GOAL_OFFSETS = { cut: -500, maintain: 0, bulk: 300 }

export function dateFromLocalValue(value) {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate())
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return new Date(value)

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

export function toDateKey(value) {
  const date = dateFromLocalValue(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function activityMultiplierForSteps(steps) {
  return ACTIVITY_BANDS.find((band) => steps <= band.maxSteps).multiplier
}

/** Mifflin-St Jeor BMR in kcal/day. Weight in kg, height in cm. */
export function calculateBMR({ sex, weightKg, heightCm, age }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'male' ? base + 5 : base - 161
}

export function splitDayForDate(workoutSplit, date) {
  const start = dateFromLocalValue(workoutSplit.cycleStartDate)
  const target = dateFromLocalValue(date)
  const diffDays = Math.round((target - start) / (1000 * 60 * 60 * 24))
  const index = ((diffDays % workoutSplit.cycleLengthDays) + workoutSplit.cycleLengthDays) % workoutSplit.cycleLengthDays
  return workoutSplit.days[index]
}

export function calculateDailyGoals(profile, date) {
  const bmr = calculateBMR(profile)
  const restDayTdee = bmr * activityMultiplierForSteps(profile.dailySteps)
  const splitDay = splitDayForDate(profile.workoutSplit, date)
  const calories = Math.round(restDayTdee + splitDay.calorieBonus + (GOAL_OFFSETS[profile.goalType] ?? 0))
  const protein = Math.round(0.8 * profile.weightKg)
  const remainingCalories = calories - protein * 4

  return {
    splitDayType: splitDay.type,
    calories,
    protein,
    carbs: Math.round((remainingCalories * (2 / 3)) / 4),
    fat: Math.round((remainingCalories * (1 / 3)) / 9),
  }
}
