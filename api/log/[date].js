import { getUserId, unauthorized } from '../_lib/auth'
import { redis } from '../_lib/redis'

export const config = { runtime: 'edge' }

export default async function handler(request) {
  const userId = await getUserId(request)
  if (!userId) return unauthorized()

  const url = new URL(request.url)
  const date = url.pathname.split('/').pop()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return new Response('Invalid date', { status: 400 })
  const key = `user:${userId}:log:${date}`
  const entries = (await redis.get(key)) ?? []

  if (request.method === 'GET') return Response.json(entries)
  if (request.method === 'POST') {
    const entry = await request.json()
    if (!entry || typeof entry.name !== 'string' || !entry.name.trim()) return new Response('Entry name is required', { status: 400 })
    const saved = { ...entry, entryId: entry.entryId ?? crypto.randomUUID() }
    entries.push(saved)
    await redis.set(key, entries)
    return Response.json(saved, { status: 201 })
  }
  if (request.method === 'DELETE') {
    const entryId = url.searchParams.get('entryId')
    if (!entryId) return new Response('entryId is required', { status: 400 })
    await redis.set(key, entries.filter((entry) => entry.entryId !== entryId))
    return new Response(null, { status: 204 })
  }
  return new Response('Method Not Allowed', { status: 405 })
}
