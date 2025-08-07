import { saveImageDatabase } from '@/firebase/firestore'
import { app } from '@/firebase/server'
import { uploadImageToStorage } from '@/firebase/storage'
import type { UploadedImage } from '@/types/firebase'
import type { APIRoute } from 'astro'
import { getAuth } from 'firebase-admin/auth'

const pathPrefix = import.meta.env.FIREBASE_STORAGE_FOLDER

export const POST: APIRoute = async ({ request, cookies }) => {
	const auth = getAuth(app)

	// Verificar autenticación
	if (!cookies.has('__session')) {
		return new Response(JSON.stringify({ error: 'No autenticado' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		})
	}

	try {
		// Verificar sesión del usuario
		const sessionCookie = cookies.get('__session')!.value
		const decodedCookie = await auth.verifySessionCookie(sessionCookie)
		const user = await auth.getUser(decodedCookie.uid)

		if (!user) {
			return new Response(JSON.stringify({ error: 'Usuario no válido' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		const formData = await request.formData()
		const files = formData.getAll('images') as File[]
		const uploaded: UploadedImage[] = []

		for (const file of files) {
			const arrayBuffer = await file.arrayBuffer()
			const buffer = Buffer.from(arrayBuffer)

			const result = await uploadImageToStorage(buffer, file.name, pathPrefix)

			// Agregar el UID del usuario autenticado
			result.uploadedBy = user.uid

			const dbID = await saveImageDatabase(result)
			result.id = dbID // Asignar el ID de Firestore al objeto UploadedImage

			uploaded.push(result)
		}

		return new Response(JSON.stringify({ uploaded }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})
	} catch (error) {
		console.error('Upload error:', error)

		// Manejar errores de autenticación específicamente
		if (
			(typeof error === 'object' &&
				error !== null &&
				'code' in error &&
				(error as { code?: string }).code === 'auth/argument-error') ||
			(error as { code?: string }).code === 'auth/invalid-session-cookie-duration'
		) {
			return new Response(JSON.stringify({ error: 'Sesión inválida' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		return new Response(JSON.stringify({ error: 'Upload failed' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		})
	}
}
