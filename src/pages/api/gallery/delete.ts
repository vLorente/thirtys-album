import { deleteImageDatabase } from '@/firebase/firestore'
import { app } from '@/firebase/server'
import { deleteImageFromStorage } from '@/firebase/storage'
import type { UploadedImage } from '@/types/firebase'
import type { APIContext } from 'astro'
import { getAuth } from 'firebase-admin/auth'

export async function DELETE({ request, cookies }: APIContext) {
	const auth = getAuth(app)

	// Verificar autenticación
	if (!cookies.has('__session')) {
		return new Response(JSON.stringify({ error: 'No autenticado' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		})
	}

	try {
		const sessionCookie = cookies.get('__session')!.value
		const decodedCookie = await auth.verifySessionCookie(sessionCookie)
		const user = await auth.getUser(decodedCookie.uid)
		if (!user) {
			return new Response(JSON.stringify({ error: 'Usuario no válido' }), {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		const body = await request.json()
		const { images } = body

		if (!images || !Array.isArray(images) || images.length === 0) {
			return new Response(JSON.stringify({ error: 'Imágenes no válidas' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		const deletedImages = []
		const errors = []

		// Procesar cada imagen
		for (const imageData of images as UploadedImage[]) {
			try {
				if (!imageData.storageID) {
					errors.push('Imagen sin storageID válido')
					continue
				}

				if (!imageData.id) {
					errors.push(`Imagen ${imageData.storageID} sin dbID válido`)
					continue
				}

				// Eliminar archivos de Storage usando la función específica
				await deleteImageFromStorage(imageData)

				// Eliminar documento de Firestore usando la función específica
				await deleteImageDatabase(imageData.id)

				deletedImages.push(imageData.storageID)
			} catch (error) {
				console.error(`Error eliminando imagen ${imageData.storageID}:`, error)
				errors.push(`Error eliminando imagen ${imageData.storageID}`)
			}
		}

		const response = {
			success: true,
			deletedImages,
			deletedCount: deletedImages.length,
			errors: errors.length > 0 ? errors : undefined,
		}

		return new Response(JSON.stringify(response), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		})
	} catch (error) {
		console.error('Error en DELETE /api/gallery/delete:', error)
		return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		})
	}
}
