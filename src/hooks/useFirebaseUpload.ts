import type { UploadedImage } from '@/types/firebase'
import { useState } from 'preact/hooks'

export interface UploadResult {
	uploaded: UploadedImage[] // nombres de archivos o paths retornados
}

export function useFirebaseUpload() {
	const [isUploading, setUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [result, setResult] = useState<UploadResult | null>(null)

	const uploadImages = async (files: File[]) => {
		setUploading(true)
		setError(null)
		setResult(null)

		const formData = new FormData()
		files.forEach((file) => formData.append('images', file))

		try {
			const res = await fetch('/api/gallery/upload', {
				method: 'POST',
				body: formData,
			})

			if (!res.ok) {
				throw new Error(`Error al subir las imágenes: ${res.statusText}`)
			}

			const data = ((await res.json()) as UploadResult) || null
			setResult(data)
			return data
		} catch (err: any) {
			setError(err.message || 'Error desconocido')
			return null
		} finally {
			setUploading(false)
		}
	}

	return { isUploading, error, result, uploadImages }
}
