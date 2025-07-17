import { PEOPLE } from '@/constants/people'

const people = PEOPLE

export function getPersonById(personId: string) {
	return people.find((b) => b.id === personId) ?? people[0]
}
