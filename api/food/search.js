import { redis } from '../_lib/redis.js'

const FDC_BASE = 'https://api.nal.usda.gov/fdc/v1'
const TTL = 60 * 60 * 24
const fdcKey = () => process.env.FDC_API_KEY ?? process.env.FOODDATA_API_KEY

async function handler(request) {
  const query = new URL(request.url).searchParams.get('q')?.trim()
  if (!query || query.length > 100) return new Response('A food query up to 100 characters is required', { status: 400 })
  const cacheKey = `food:search:${query.toLowerCase()}`
  const cached = await redis.get(cacheKey)
  if (cached) return Response.json(cached)
  if (!fdcKey()) return Response.json({ error: 'Food search is not configured' }, { status: 500 })

  const url = new URL(`${FDC_BASE}/foods/search`)
  url.searchParams.set('api_key', fdcKey())
  url.searchParams.set('query', query)
  url.searchParams.set('pageSize', '20')
  const response = await fetch(url)
  if (!response.ok) return Response.json({ error: 'FoodData Central request failed' }, { status: 502 })
  const results = ((await response.json()).foods ?? []).map((food) => ({
    fdcId: food.fdcId, name: food.description, brandName: food.brandOwner ?? food.brandName ?? null, dataType: food.dataType,
  }))
  await redis.set(cacheKey, results, { ex: TTL })
  return Response.json(results)
}
export default { fetch: handler }
