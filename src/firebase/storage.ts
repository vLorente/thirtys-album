import type { UploadedImage } from '@/types/firebase'
import { generateThumbnail, getImageSizeFromBuffer, transformImage } from '@/utils/images'
import { storage } from './server'

export async function uploadImageToStorage(
	fileBuffer: Buffer,
	fileName: string,
	pathPrefix: string,
): Promise<UploadedImage> {
	const bucket = storage.bucket()
	const uniqueId = crypto.randomUUID()
	const baseName = `${uniqueId}-${fileName.replace(/\.[^/.]+$/, '')}.webp`
	const originalPath = `${pathPrefix}/${baseName}`
	const thumbPath = `${pathPrefix}/thumbs/${baseName}`

	// 🔧 Comprimir imagen original
	const compressedBuffer = await transformImage(fileBuffer)
	const { width, height } = getImageSizeFromBuffer(compressedBuffer)

	// 📤 Subir imagen comprimida
	const originalFile = bucket.file(originalPath)
	await originalFile.save(compressedBuffer, {
		metadata: { contentType: 'image/webp' },
		public: true,
	})

	// 🔧 Generar thumbnail
	const thumbnailBuffer = await generateThumbnail(fileBuffer)

	// 📤 Subir thumbnail
	const thumbFile = bucket.file(thumbPath)
	await thumbFile.save(thumbnailBuffer, {
		metadata: { contentType: 'image/webp' },
		public: true,
	})

	// 🔗 URLs públicas
	const baseUrl = `https://storage.googleapis.com/${bucket.name}`
	const url = `${baseUrl}/${originalPath}`
	const thumbnailUrl = `${baseUrl}/${thumbPath}`

	const image: UploadedImage = {
		id: originalFile.id,
		name: originalFile.metadata.name,
		bucket: originalFile.metadata.bucket,
		size: originalFile.metadata.size?.toString(),
		width: width,
		height: height,
		timeCreated: originalFile.metadata.timeCreated,
		url: url,
		thumbnailUrl: thumbnailUrl,
		thumbnailId: thumbFile.id,
	}

	return image
}
