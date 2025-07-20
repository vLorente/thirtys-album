import { useToastManager } from '@/hooks/useToastManager'
import { useRef, useState, useEffect } from 'preact/hooks'
import UploadIcon from '@/components/Icons/UploadIcon'
import ImageItem from '@/components/Dashboard/ImageItem'
import { useFirebaseUpload } from '@/hooks/useFirebaseUpload'

interface ImageEntry {
	file: File
	url: string
}

export default function DropzoneUploader() {
	const [images, setImages] = useState<ImageEntry[]>([])
	const [isDragging, setIsDragging] = useState(false)
	const [isLoadingImages, setIsLoadingImages] = useState(false)
	const dragCounter = useRef(0)
	const objectUrls = useRef<string[]>([])
	const { showToast, ToastContainer } = useToastManager()
	const wrapperRef = useRef<HTMLDivElement>(null)
	const { isUploading, error, result, uploadImages } = useFirebaseUpload()

	// Liberar URLs creadas al desmontar el componente
	useEffect(() => {
		return () => {
			objectUrls.current.forEach((url) => URL.revokeObjectURL(url))
		}
	}, [])

	const handleUploadToFirebase = async () => {
		const filesToUpload = images.map((img) => img.file)
		const uploaded = await uploadImages(filesToUpload)

		if (uploaded!.uploaded.length > 0) {
			showToast({ message: 'Subida a Firebase completada', status: 'success' })
		} else {
			showToast({ message: 'Error al subir imágenes', status: 'error' })
			console.error('Error al subir imágenes a Firebase:', error)
		}

		// Limpiar imágenes después de subir
		setImages([])
		objectUrls.current.forEach((url) => URL.revokeObjectURL(url))
		objectUrls.current = []
	}

	const handleWrapperClick = (e: MouseEvent) => {
		if (e.target === wrapperRef.current) {
			document.getElementById('fileInput')?.click()
		}
	}

	const isDuplicate = (newFile: File, existingFiles: File[]) =>
		existingFiles.some((file) => file.name === newFile.name && file.size === newFile.size)

	const addFiles = (files: File[]) => {
		setIsLoadingImages(true)
		const unique = files.filter(
			(file) =>
				!isDuplicate(
					file,
					images.map((i) => i.file),
				),
		)

		const newEntries = unique.map((file) => {
			const url = URL.createObjectURL(file)
			objectUrls.current.push(url) // guardar url para liberar luego
			return {
				file,
				url,
			}
		})

		setImages((prev) => [...prev, ...newEntries])

		if (unique.length > 0) {
			showToast({
				message:
					unique.length === 1 ? 'Imagen subida correctamente' : 'Imágenes subidas correctamente',
				status: 'success',
			})
		}
		if (unique.length < files.length) {
			showToast({ message: 'Algunas imágenes ya estaban añadidas', status: 'error' })
		}
		setIsLoadingImages(false)
	}

	const handleDrop = (e: DragEvent) => {
		e.preventDefault()
		dragCounter.current = 0
		setIsDragging(false)

		const dropped = Array.from(e.dataTransfer?.files || []).filter((file) =>
			file.type.startsWith('image/'),
		)
		addFiles(dropped)
	}

	const handleFileChange = (e: Event) => {
		const target = e.target as HTMLInputElement
		const selected = Array.from(target.files || []).filter((file) => file.type.startsWith('image/'))
		if (selected.length > 0) {
			console.log(`Se han seleccionado ${selected.length} imagen(es)`)
			addFiles(selected)
		}

		// Evalua aunque se seleccionen los mismos archivos
		target.value = ''
	}

	const handleDragEnter = (e: DragEvent) => {
		e.preventDefault()
		dragCounter.current += 1
		if (dragCounter.current === 1) {
			setIsDragging(true)
		}
	}

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault()
		dragCounter.current -= 1
		if (dragCounter.current === 0) {
			setIsDragging(false)
		}
	}

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault()
	}

	const removeImage = (img: ImageEntry) => {
		setImages((prev) => {
			URL.revokeObjectURL(img.url)
			objectUrls.current = objectUrls.current.filter((url) => url !== img.url)
			return prev.filter((f) => f !== img)
		})
		showToast({ message: 'Imagen eliminada', status: 'info' })
	}

	return (
		<>
			<div
				class={`h-full min-h-fit w-full cursor-pointer rounded-md border-2 border-dashed p-6 text-center text-white transition ${
					isDragging ? 'border-blue-500 bg-blue-900/20' : 'border-gray-500'
				}`}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onClick={handleWrapperClick}
				ref={wrapperRef}
			>
				<label for="fileInput" class="block cursor-pointer">
					<UploadIcon />
					<p class="mb-2 text-gray-600">Arrastra imágenes aquí o haz clic para seleccionar</p>
				</label>
				<input
					id="fileInput"
					type="file"
					accept="image/*"
					multiple
					onChange={handleFileChange}
					onClick={(e) => e.stopPropagation()}
					class="hidden"
				/>
			</div>
			<div class="w-full">
				{isLoadingImages && <p class="mt-4 text-sm italic text-gray-500">Cargando imágenes...</p>}
				{images.length > 0 && !isLoadingImages && (
					<ul class="mt-4 space-y-3">
						{images.map((img) => (
							<ImageItem
								key={`${img.file.name}-${img.file.size}`}
								image={img.file}
								url={img.url}
								onDelete={() => {
									removeImage(img)
								}}
							/>
						))}
					</ul>
				)}
			</div>
			{images.length > 0 && (
				<button
					onClick={handleUploadToFirebase}
					class={`mt-4 flex items-center justify-center gap-2 rounded px-4 py-2 text-white transition ${
						isUploading ? 'cursor-not-allowed bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
					}`}
					disabled={isUploading}
				>
					{isUploading && (
						<svg
							class="h-5 w-5 animate-spin text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
							></path>
						</svg>
					)}
					<span>{isUploading ? 'Subiendo' : 'Subir Imágenes'}</span>
				</button>
			)}

			{error && <p class="mt-2 text-sm text-red-500">{error}</p>}
			<ToastContainer />
		</>
	)
}
