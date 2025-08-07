interface ImageItemProps {
	image: File
	url: string
	onDelete: () => void
}

export default function ImageItem({ image, url, onDelete }: ImageItemProps) {
	const sizeInMB = (image.size / (1024 * 1024)).toFixed(2)

	return (
		<li class="flex items-center justify-between gap-4 rounded border bg-white p-2 shadow-sm">
			<div class="flex items-center gap-4">
				<img src={url} alt={image.name} class="h-12 w-12 rounded object-cover" draggable={false} />
				<div class="text-left">
					<p class="max-w-[200px] truncate text-sm font-medium text-gray-800">{image.name}</p>
					<p class="text-xs text-gray-500">{sizeInMB} MB</p>
				</div>
			</div>
			<button
				onClick={onDelete}
				class="px-2 py-1 text-sm text-red-500 hover:text-red-700"
				aria-label="Eliminar imagen"
			>
				✕
			</button>
		</li>
	)
}
