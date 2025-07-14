export interface UploadedImage {
	name: string | undefined
	bucket: string | undefined
	url: string | undefined
	size: string | undefined
	height: number | undefined
	witdh: number | undefined
	timeCreated: string | undefined
	// uploadedBy: string | undefined // UID del usuario autenticado
}
