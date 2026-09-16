import { redis } from '../_lib/redis.js'
import { mapFdcNutrients } from '../_lib/fdcNutrientMap.js'

const FDC_BASE = 'https://api.nal.usda.gov/fdc/v1'
const TTL = 60 * 60 * 24 * 7
const TRACKED_KEYS = ['calories', 'protein', 'carbs', 'fat', 'saturatedFat', 'addedSugar', 'cholesterol', 'sodium', 'vitaminA', 'vitaminC', 'vitaminD', 'vitaminE', 'vitaminK', 'thiamin', 'riboflavin', 'niacin', 'vitaminB6', 'vitaminB12', 'folate', 'choline', 'pantothenicAcid', 'calcium', 'iron', 'magnesium', 'phosphorus', 'potassium', 'zinc', 'copper', 'manganese', 'selenium']
const fdcKey = () => process.env.FDC_API_KEY ?? process.env.FOODDATA_API_KEY

async function getFood(fdcId) {
  const rawKey = `food:raw:${fdcId}`
  const cached = await redis.get(rawKey)
  if (cached) return cached
  const url = new URL(`${FDC_BASE}/food/${fdcId}`)
  url.searchParams.set('api_key', fdcKey())
  const response = await fetch(url)
  if (!response.ok) return null
  const food = await response.json()
  await redis.set(rawKey, food, { ex: TTL })
  return food
}

async function handler(request) {
  const fdcId = new URL(request.url).pathname.split('/').pop()
  if (!/^\d+$/.test(fdcId)) return new Response('Invalid FDC ID', { status: 400 })
  const cacheKey = `food:details:${fdcId}`
  const cached = await redis.get(cacheKey)
  if (cached) return Response.json(cached)
  if (!fdcKey()) return Response.json({ error: 'Food search is not configured' }, { status: 500 })
  const food = await getFood(fdcId)
  if (!food) return Response.json({ error: 'Food not found' }, { status: 404 })
  const nutrients = mapFdcNutrients(food.foodNutrients)
  for (const key of TRACKED_KEYS) if (!nutrients[key]) nutrients[key] = { value: 0, quality: 'unknown' }
  const result = { fdcId: food.fdcId, name: food.description, brandName: food.brandOwner ?? food.brandName ?? null, dataType: food.dataType, baseAmount: 100, baseUnit: 'g', nutrients }
  await redis.set(cacheKey, result, { ex: TTL })
  return Response.json(result)
}
export default { fetch: handler }
