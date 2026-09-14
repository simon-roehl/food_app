import { getUserId, unauthorized } from './_lib/auth'
import { redis } from './_lib/redis'

export const config = { runtime: 'nodejs' }

export default async function handler(request) {
  const userId = await getUserId(request)
  if (!userId) return unauthorized()

  const url = new URL(request.url)
  const type = url.searchParams.get('type')
  if (type !== 'items' && type !== 'meals') return new Response("type must be 'items' or 'meals'", { status: 400 })

  const idField = type === 'items' ? 'fdcId' : 'mealId'
  const key = `user:${userId}:favorites:${type}`
  const favorites = (await redis.get(key)) ?? []
  if (request.method === 'GET') return Response.json(favorites)

  if (request.method === 'POST') {
    const favorite = await request.json()
    if (favorite?.[idField] === undefined || favorite?.[idField] === null) return new Response(`Favorite requires ${idField}`, { status: 400 })
    if (!favorites.some((item) => item[idField] === favorite[idField])) {
      favorites.push(favorite)
      await redis.set(key, favorites)
    }
    return Response.json(favorite, { status: 201 })
  }

  if (request.method === 'DELETE') {
    const id = url.searchParams.get('id')
    if (!id) return new Response('id is required', { status: 400 })
    await redis.set(key, favorites.filter((item) => String(item[idField]) !== id))
    return new Response(null, { status: 204 })
  }

  return new Response('Method Not Allowed', { status: 405 })
}
