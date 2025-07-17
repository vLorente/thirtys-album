import type { Social } from './social'
type personId = 'teresa' | 'valen' | 'carlos'

type personName = 'Teresa' | 'Valentín' | 'Carlos'

export interface Person {
	id: personId
	name: personName
	alternativeName?: string
	city?: string
	realName?: string
	birthDate: Date
	age: number
	drink: string
	pub: string
	song: string
	gallery?: boolean
	socials: Social[]
	bio: string
}
