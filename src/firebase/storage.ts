import type { UploadedImage } from '@/types/firebase'
import { getImageSizeFromBuffer } from '@/utils/images'
import { storage } from './server'

export async function uploadImageToStorage(
	fileBuffer: Buffer,
	fileName: string,
	pathPrefix: string,
	contentType: string,
): Promise<UploadedImage> {
	const bucket = storage.bucket()
	const finalName = `${crypto.randomUUID()}-${fileName}`
	const filePath = `${pathPrefix}/${finalName}`
	const file = bucket.file(filePath)

	const { width, height } = getImageSizeFromBuffer(fileBuffer)

	await file.save(fileBuffer, {
		metadata: {
			contentType,
		},
		public: true, // 🔑 Hacer el archivo público
	})

	// Construir la URL pública directamente
	const url = `https://storage.googleapis.com/${bucket.name}/${filePath}`
	const image: UploadedImage = {
		name: file.metadata.name,
		bucket: file.metadata.bucket,
		size: file.metadata.size?.toString(),
		witdh: width,
		height: height,
		timeCreated: file.metadata.timeCreated,
		url,
		// uploadedBy:
	}

	return image
}
