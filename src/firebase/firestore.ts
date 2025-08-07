import type { UploadedImage } from '@/types/firebase'
import { collectionRef } from './server'

export async function saveImageDatabase(image: UploadedImage): Promise<string> {
	try {
		const result = await collectionRef.add(image)
		return result.id // Retornar el ID de Firestore
	} catch (error) {
		throw new Response('Something went wrong', {
			status: 500,
		})
	}
}

export async function getImageFromFirestore(imageId: string): Promise<UploadedImage | null> {
	try {
		const docRef = collectionRef.doc(imageId)
		const doc = await docRef.get()

		if (!doc.exists) {
			return null
		}

		return doc.data() as UploadedImage
	} catch (error) {
		throw new Response('Error getting image from database', {
			status: 500,
		})
	}
}

export async function deleteImageDatabase(imageId: string): Promise<void> {
	try {
		const docRef = collectionRef.doc(imageId)
		await docRef.delete()
	} catch (error) {
		throw new Response('Error deleting image from database', {
			status: 500,
		})
	}
}
