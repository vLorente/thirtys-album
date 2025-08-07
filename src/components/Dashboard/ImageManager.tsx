import { useToastManager } from '@/hooks/useToastManager'
import { useManageImages } from '@/hooks/useManageImages'

export default function ImageManager() {
	const {
		images,
		loading,
		selectedImages,
		isDeleting,
		toggleImageSelection,
		selectAll,
		clearSelection,
		deleteSelectedImages,
		refreshImages,
		selectedCount,
		totalCount,
		hasSelection,
		allSelected,
	} = useManageImages()

	const { showToast, ToastContainer } = useToastManager()

	const handleDeleteImages = async () => {
		const result = await deleteSelectedImages()
		if (result) {
			showToast({
				message: result.message,
				status: result.success ? 'success' : 'error',
			})
		}
	}

	if (loading) {
		return (
			<div class="w-full py-8 text-center">
				<div class="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
				<p class="mt-2 text-gray-600">Cargando imágenes...</p>
			</div>
		)
	}

	return (
		<div class="w-full">
			{/* Botón de recargar siempre visible */}
			<div class="mb-4 w-full">
				<button
					onClick={refreshImages}
					class="w-full rounded bg-green-100 px-3 py-2 text-sm text-green-700 transition hover:bg-green-200"
					disabled={loading}
				>
					🔄 Recargar
				</button>
			</div>

			{images.length === 0 ? (
				<p class="py-8 text-center text-gray-500">No hay imágenes para gestionar</p>
			) : (
				<>
					<div class="mb-4 flex w-full flex-col gap-3">
						<div class="flex w-full gap-2">
							<button
								onClick={selectAll}
								class="flex-1 rounded bg-blue-100 px-3 py-2 text-sm text-blue-700 transition hover:bg-blue-200"
								disabled={allSelected}
							>
								Seleccionar todas
							</button>
							<button
								onClick={clearSelection}
								class="flex-1 rounded bg-gray-100 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-200"
								disabled={!hasSelection}
							>
								Limpiar selección
							</button>
						</div>
						<div class="text-center">
							<span class="text-sm text-gray-600">
								{selectedCount} de {totalCount} seleccionadas
							</span>
						</div>
					</div>

					<div class="grid max-h-96 grid-cols-2 gap-4 overflow-y-auto sm:grid-cols-3 md:grid-cols-4">
						{images.map((image) => (
							<div
								key={image.storageID}
								class={`relative cursor-pointer overflow-hidden rounded-lg border-2 transition ${
									image.storageID && selectedImages.includes(image.storageID)
										? 'border-red-500 ring-2 ring-red-200'
										: 'border-transparent hover:border-gray-300'
								}`}
								onClick={() => image.storageID && toggleImageSelection(image.storageID)}
							>
								<img
									src={image.thumbnailUrl || image.url}
									alt={`Imagen ${image.name}`}
									class="h-24 w-full object-cover"
								/>
								{image.storageID && selectedImages.includes(image.storageID) && (
									<div class="absolute inset-0 flex items-center justify-center bg-red-500/40 bg-opacity-30">
										<svg class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
								)}
							</div>
						))}
					</div>

					<button
						onClick={handleDeleteImages}
						class={`mt-4 flex w-full items-center justify-center gap-2 rounded px-4 py-2 text-white transition ${
							isDeleting
								? 'cursor-not-allowed bg-gray-500'
								: hasSelection
									? 'bg-red-600 hover:bg-red-700'
									: 'cursor-not-allowed bg-gray-400'
						}`}
						disabled={isDeleting || !hasSelection}
					>
						{isDeleting && (
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
						<span>
							{isDeleting
								? 'Eliminando...'
								: hasSelection
									? `Eliminar ${selectedCount} imagen(es)`
									: 'Selecciona imágenes para eliminar'}
						</span>
					</button>
				</>
			)}
			<ToastContainer />
		</div>
	)
}
