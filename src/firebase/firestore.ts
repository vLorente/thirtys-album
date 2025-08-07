import type { UploadedImage } from '@/types/firebase'
import { collectionRef } from './server'

export async function saveImageDatabase(image: UploadedImage): Promise<void> {
	try {
		await collectionRef.add(image)
	} catch (error) {
		throw new Response('Something went wrong', {
			status: 500,
		})
	}
}
