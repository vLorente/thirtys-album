// src/utils/images.ts
import { imageSize } from 'image-size'

export function getImageSizeFromBuffer(buffer: Buffer): { width: number; height: number } {
	// Convert Buffer a Uint8Array explícitamente
	const uint8Array = new Uint8Array(buffer)
	const dimensions = imageSize(uint8Array)
	if (!dimensions.width || !dimensions.height) {
		throw new Error('Could not determine image dimensions')
	}
	return { width: dimensions.width, height: dimensions.height }
}
