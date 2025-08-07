import type { UploadedImage } from '@/types/firebase'
import { useCallback, useEffect, useState } from 'preact/hooks'

export function useManageImages() {
	const [images, setImages] = useState<UploadedImage[]>([])
	const [loading, setLoading] = useState(false)
	const [selectedImages, setSelectedImages] = useState<string[]>([])
	const [isDeleting, setIsDeleting] = useState(false)

	// Cargar imágenes al montar el componente
	useEffect(() => {
		loadImages()
	}, [])

	const loadImages = useCallback(async () => {
		setLoading(true)
		try {
			const response = await fetch('/api/gallery/images')
			const data = await response.json()
			console.log('Imágenes cargadas para gestión:', data.images)
			setImages(data.images || [])
		} catch (error) {
			console.error('Error cargando imágenes:', error)
		} finally {
			setLoading(false)
		}
	}, [])

	const refreshImages = useCallback(() => {
		loadImages()
	}, [loadImages])

	const deleteImages = useCallback(async (imagesToDelete: UploadedImage[]) => {
		const response = await fetch('/api/gallery/delete', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ images: imagesToDelete }),
		})

		const result = await response.json()

		if (response.ok) {
			// Eliminar las imágenes del estado local
			const deletedStorageIds = imagesToDelete.map((img) => img.storageID).filter(Boolean)
			setImages((prev) => prev.filter((img) => !deletedStorageIds.includes(img.storageID)))
			return { success: true, deletedCount: result.deletedCount, errors: result.errors }
		} else {
			return { success: false, error: result.error }
		}
	}, [])

	const toggleImageSelection = (imageId: string) => {
		setSelectedImages((prev) =>
			prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId],
		)
	}

	const selectAll = () => {
		setSelectedImages(
			images
				.map((img: UploadedImage) => img.storageID)
				.filter((id): id is string => id !== undefined),
		)
	}

	const clearSelection = () => {
		setSelectedImages([])
	}

	const deleteSelectedImages = async () => {
		if (selectedImages.length === 0) return null

		// Obtener los objetos completos de las imágenes seleccionadas
		const imagesToDelete = images.filter(
			(img) => img.storageID && selectedImages.includes(img.storageID),
		)

		console.log('Imágenes seleccionadas:', selectedImages)
		console.log('Objetos a eliminar:', imagesToDelete)

		setIsDeleting(true)
		try {
			const result = await deleteImages(imagesToDelete)
			console.log('Resultado de eliminación:', result)

			if (result.success) {
				setSelectedImages([])
				return {
					success: true,
					message: `${selectedImages.length} imagen(es) eliminada(s) correctamente`,
					deletedCount: result.deletedCount,
				}
			} else {
				console.error('Error del servidor:', result.error)
				return {
					success: false,
					message: result.error || 'Error al eliminar las imágenes',
				}
			}
		} catch (error) {
			console.error('Error al eliminar imágenes:', error)
			return {
				success: false,
				message: 'Error de conexión al eliminar las imágenes',
			}
		} finally {
			setIsDeleting(false)
		}
	}

	return {
		// Estado de imágenes
		images,
		loading,

		// Estado de selección
		selectedImages,
		isDeleting,

		// Acciones de selección
		toggleImageSelection,
		selectAll,
		clearSelection,

		// Acciones de gestión
		deleteSelectedImages,
		refreshImages,

		// Datos calculados
		selectedCount: selectedImages.length,
		totalCount: images.length,
		hasSelection: selectedImages.length > 0,
		allSelected: selectedImages.length === images.length,
	}
}
