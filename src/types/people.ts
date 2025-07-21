import type { Social } from './social'
type personId =
	| 'teresa'
	| 'valen'
	| 'carlos'
	| 'esther'
	| 'mariu'
	| 'vicky'
	| 'majo'
	| 'adrian'
	| 'eu'
	| 'maria'
	| 'fatima'
	| 'rafa'
	| 'rocio'

type personName =
	| 'Teresa'
	| 'Valentín'
	| 'Carlos'
	| 'Esther'
	| 'Mariu'
	| 'Vicky'
	| 'Majo'
	| 'Adrián'
	| 'Eu'
	| 'María'
	| 'Fátima'
	| 'Rafa'
	| 'Rocío'

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
	songUrl?: string
	gallery?: boolean
	socials: Social[]
	bio: string
}
