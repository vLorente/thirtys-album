import type { Social } from '@/types/social'

import GitHub from '@/assets/svg/github.svg'
import Instagram from '@/assets/svg/instagram.svg'

export const SOCIAL: Social[] = [
	{
		id: 'instagram',
		name: 'Instagram',
		url: 'https://instagram.com/vlorente94',
		label: 'Visitar perfil de InfoLaVelada en Instagram',
		image: {
			logo: Instagram,
			width: 200,
			height: 200,
		},
	},

	{
		id: 'github',
		name: 'GitHub',
		url: 'https://github.com/vlorente/thirtys-album',
		label: 'Visitar repositorio de la web en GitHub',
		image: {
			logo: GitHub,
			width: 200,
			height: 200,
		},
	},
]
