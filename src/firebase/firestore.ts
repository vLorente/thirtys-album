import type { UploadedImage } from '@/types/firebase'
import { db } from './server'

export async function saveImageMetadata(image: UploadedImage): Promise<void> {
	try {
		const galleryRef = db.collection('gallery')
		await galleryRef.add(image)
	} catch (error) {
		throw new Response('Something went wrong', {
			status: 500,
		})
	}
}
