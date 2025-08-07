import { saveImageDatabase } from '@/firebase/firestore'
import { uploadImageToStorage } from '@/firebase/storage'
import type { UploadedImage } from '@/types/firebase'
import type { APIRoute } from 'astro'

const pathPrefix = import.meta.env.FIREBASE_STORAGE_FOLDER

export const POST: APIRoute = async ({ request }) => {
	try {
		const formData = await request.formData()
		const files = formData.getAll('images') as File[]
		const uploaded: UploadedImage[] = []

		for (const file of files) {
			const arrayBuffer = await file.arrayBuffer()
			const buffer = Buffer.from(arrayBuffer)

			const result = await uploadImageToStorage(buffer, file.name, pathPrefix)
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
		return new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500 })
	}
}
