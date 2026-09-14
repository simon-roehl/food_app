import { createClerkClient } from '@clerk/backend'

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  // The existing VITE_ variable is safe to use server-side too. A separate
  // CLERK_PUBLISHABLE_KEY may be supplied in Vercel if preferred.
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY ?? process.env.VITE_CLERK_PUBLISHABLE_KEY,
})

export async function getUserId(request) {
  const requestState = await clerkClient.authenticateRequest(request, {
    jwtKey: process.env.CLERK_JWT_KEY,
    authorizedParties: (process.env.CLERK_AUTHORIZED_PARTIES ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  })

  return requestState.isAuthenticated ? requestState.toAuth()?.userId ?? null : null
}

export function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}
