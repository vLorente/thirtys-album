import { saveImageMetadata } from '@/firebase/firestore'
import { uploadImageToStorage } from '@/firebase/storage'
import type { UploadedImage } from '@/types/firebase'
import type { APIRoute } from 'astro'

const PATH_PREFIX = 'gallery'

export const POST: APIRoute = async ({ request }) => {
	try {
		const formData = await request.formData()
		const files = formData.getAll('images') as File[]
		const uploaded: UploadedImage[] = []

		for (const file of files) {
			const arrayBuffer = await file.arrayBuffer()
			const buffer = Buffer.from(arrayBuffer)

			const result = await uploadImageToStorage(buffer, file.name, PATH_PREFIX, file.type)
			await saveImageMetadata(result)

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
