export default function EmptyGallery() {
	return (
		<div className="flex h-64 flex-col items-center justify-center text-center text-gray-500">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="mb-4 h-12 w-12"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={1.5}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M3.98 8.223A10.003 10.003 0 0112 2c5.523 0 10 4.477 10 10 0 1.858-.507 3.595-1.387 5.077M4.93 4.93l14.14 14.14M9.88 9.88a3 3 0 104.24 4.24"
				/>
			</svg>
			<h2 className="text-xl font-semibold">No hay imágenes para mostrar</h2>
			<p className="mt-2 text-sm">Cuando subas imágenes aparecerán aquí.</p>
		</div>
	)
}
