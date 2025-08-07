import { app, collectionRef } from '@/firebase/server'
import type { APIContext } from 'astro'
import { getAuth } from 'firebase-admin/auth'

const PAGE_SIZE = 10

export async function GET({ request, cookies }: APIContext) {
	const auth = getAuth(app)
	const url = new URL(request.url)
	const cursor = url.searchParams.get('cursor') // opcional
	const omi = url.searchParams.get('omi') === 'true' // "only my images"

	// Solo verificar autenticación si se solicita filtrar por "mis imágenes"
	if (omi && !cookies.has('__session')) {
		return new Response(
			JSON.stringify({ error: 'Autenticación requerida para filtrar por mis imágenes' }),
			{
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			},
		)
	}

	try {
		let userId: string | null = null

		// Solo obtener el usuario si se solicita filtrar por "mis imágenes"
		if (omi) {
			const sessionCookie = cookies.get('__session')!.value
			const decodedCookie = await auth.verifySessionCookie(sessionCookie)
			const user = await auth.getUser(decodedCookie.uid)

			if (!user) {
				return new Response(JSON.stringify({ error: 'Usuario no válido' }), {
					status: 401,
					headers: { 'Content-Type': 'application/json' },
				})
			}

			userId = user.uid
		}

		let baseQuery = collectionRef.orderBy('timeCreated', 'desc')

		// Si se solicita filtrar solo por las imágenes del usuario actual
		if (omi && userId) {
			baseQuery = baseQuery.where('uploadedBy', '==', userId)
		}

		baseQuery = baseQuery.limit(PAGE_SIZE)

		if (cursor) {
			const lastDocRef = await collectionRef.doc(cursor).get()
			if (lastDocRef.exists) {
				baseQuery = baseQuery.startAfter(lastDocRef)
			}
		}

		const snapshot = await baseQuery.get()
		let images = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}))

		const lastVisible = snapshot.docs[snapshot.docs.length - 1]
		const nextCursor = lastVisible ? lastVisible.id : null

		// images = shuffleArray(images)

		return new Response(JSON.stringify({ images, nextCursor }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})
	} catch (error) {
		console.error('Get images error:', error)

		// Manejar errores de autenticación específicamente solo si se está usando omi
		if (omi && error && typeof error === 'object' && 'code' in error) {
			const authError = error as { code: string }
			if (
				authError.code === 'auth/argument-error' ||
				authError.code === 'auth/invalid-session-cookie-duration'
			) {
				return new Response(JSON.stringify({ error: 'Sesión inválida' }), {
					status: 401,
					headers: { 'Content-Type': 'application/json' },
				})
			}
		}

		return new Response(JSON.stringify({ error: 'Error obteniendo imágenes' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		})
	}
}
