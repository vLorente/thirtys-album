export interface UploadedImage {
	id: string | undefined
	name: string | undefined
	bucket: string | undefined
	url: string | undefined
	thumbnailUrl: string | undefined
	thumbnailId: string | undefined
	size: string | undefined
	height: number | undefined
	width: number | undefined
	timeCreated: string | undefined
	// uploadedBy: string | undefined // UID del usuario autenticado
}
