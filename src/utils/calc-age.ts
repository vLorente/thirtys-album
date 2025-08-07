export function calculateAge(birthDate: Date | string | number): number {
	const birth = new Date(birthDate)
	const today = new Date()

	let age = today.getFullYear() - birth.getFullYear()
	const monthDiff = today.getMonth() - birth.getMonth()
	const dayDiff = today.getDate() - birth.getDate()

	// Si aún no ha cumplido años este año, restamos uno
	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
		age--
	}

	return age
}
