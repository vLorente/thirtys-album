import { auth } from '@/firebase/server'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
	const authHeader = request.headers.get('Authorization')
	const idToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

	if (!idToken) {
		return new Response(JSON.stringify({ error: 'No token found' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		})
	}

	try {
		await auth.verifyIdToken(idToken)

		const expiresInMs = 60 * 60 * 24 * 5 * 1000 // 5 días
		const sessionCookie = await auth.createSessionCookie(idToken, {
			expiresIn: expiresInMs,
		})

		cookies.set('__session', sessionCookie, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: import.meta.env.PROD,
			maxAge: expiresInMs / 1000,
		})

		return redirect('/dashboard')
	} catch (err) {
		const error = err instanceof Error ? err.message : 'Unknown error'

		return new Response(JSON.stringify({ error }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		})
	}
}
