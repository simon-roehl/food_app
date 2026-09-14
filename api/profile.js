import { getUserId, unauthorized } from './_lib/auth'
import { redis } from './_lib/redis'

export const config = { runtime: 'edge' }

function validProfile(profile) {
  const { sex, age, heightCm, weightKg, dailySteps, goalType, workoutSplit } = profile ?? {}
  return (
    (sex === 'male' || sex === 'female') &&
    Number.isInteger(age) && age >= 13 && age <= 100 &&
    Number.isFinite(heightCm) && heightCm >= 100 && heightCm <= 250 &&
    Number.isFinite(weightKg) && weightKg >= 30 && weightKg <= 300 &&
    Number.isFinite(dailySteps) && dailySteps >= 0 && dailySteps <= 50000 &&
    ['cut', 'maintain', 'bulk'].includes(goalType) &&
    workoutSplit && /^\d{4}-\d{2}-\d{2}$/.test(workoutSplit.cycleStartDate) &&
    Number.isInteger(workoutSplit.cycleLengthDays) && workoutSplit.cycleLengthDays >= 1 && workoutSplit.cycleLengthDays <= 14 &&
    Array.isArray(workoutSplit.days) && workoutSplit.days.length === workoutSplit.cycleLengthDays &&
    workoutSplit.days.every((day) => typeof day.type === 'string' && day.type.length <= 40 && Number.isFinite(day.calorieBonus) && day.calorieBonus >= 0 && day.calorieBonus <= 2000)
  )
}

export default async function handler(request) {
  const userId = await getUserId(request)
  if (!userId) return unauthorized()
  const key = `user:${userId}:profile`

  if (request.method === 'GET') return Response.json((await redis.get(key)) ?? null)
  if (request.method !== 'PUT') return new Response('Method Not Allowed', { status: 405 })

  const profile = await request.json()
  if (!validProfile(profile)) return Response.json({ error: 'Invalid profile' }, { status: 400 })
  await redis.set(key, profile)
  return Response.json(profile)
}
