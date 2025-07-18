import { app } from '@/firebase/server'
import type { APIRoute } from 'astro'
import { getAuth } from 'firebase-admin/auth'

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
	const auth = getAuth(app)

	/* Get token from request headers */
	const idToken = request.headers.get('Authorization')?.split('Bearer ')[1]
	if (!idToken) {
		return new Response('No token found', { status: 401 })
	}

	/* Verify id token */
	try {
		await auth.verifyIdToken(idToken)
	} catch (error) {
		return new Response(`Invalid token: ${error}`, { status: 401 })
	}

	/* Create and set session cookie */
	const oneDay = 60 * 60 * 24 * 1 * 1000
	const sessionCookie = await auth.createSessionCookie(idToken, {
		expiresIn: oneDay,
	})

	cookies.set('__session', sessionCookie, {
		path: '/',
	})

	return redirect('/dashboard')
}
