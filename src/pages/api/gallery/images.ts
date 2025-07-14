import { db } from '@/firebase/server'
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, redirect }) => {
	const formData = await request.formData()
	const name = formData.get('name')?.toString()
	const age = formData.get('age')?.toString()
	const isBestFriend = formData.get('isBestFriend') === 'on'

	if (!name || !age) {
		return new Response('Missing required fields', {
			status: 400,
		})
	}
	try {
		const friendsRef = db.collection('gallery')
		await friendsRef.add({
			name,
			age: parseInt(age),
			isBestFriend,
		})
	} catch (error) {
		return new Response('Something went wrong', {
			status: 500,
		})
	}
	return redirect('/dashboard')
}
