import CameraIcon from '../Icons/CameraIcon'

export default function EmptyGallery() {
	return (
		<div className="text-primary-700 flex h-64 flex-col items-center justify-center text-center">
			<CameraIcon width={40} height={40} className="fill-primary-700" />
			<p className="mt-2 text-sm">¡Vaya por dios!</p>
			<h2 className="text-xl font-semibold">No hay imágenes para mostrar</h2>
		</div>
	)
}
