import { imageSize } from 'image-size'
import sharp from 'sharp'

export function getImageSizeFromBuffer(buffer: Buffer): { width: number; height: number } {
	// Convert Buffer a Uint8Array explícitamente
	const uint8Array = new Uint8Array(buffer)
	const dimensions = imageSize(uint8Array)
	if (!dimensions.width || !dimensions.height) {
		throw new Error('Could not determine image dimensions')
	}
	return { width: dimensions.width, height: dimensions.height }
}

export function transformImage(image: Buffer): Promise<Buffer> {
	const convert = sharp(image)
		// Preserve orientation
		.rotate()
		.webp({
			lossless: false,
			quality: 90,
		})
		.toBuffer()

	return convert
}

export function generateThumbnail(image: Buffer): Promise<Buffer> {
	console.info('🖼️ Creating thumbnails')

	const convert = sharp(image)
		.resize(400)
		.webp({
			lossless: false,
			quality: 40,
		})
		.toBuffer()

	return convert
}
