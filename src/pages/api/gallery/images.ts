import { collectionRef } from '@/firebase/server'
import { shuffleArray } from '@/utils/array'
import type { APIContext } from 'astro'

const PAGE_SIZE = 10

export async function GET({ request }: APIContext) {
	const url = new URL(request.url)
	const cursor = url.searchParams.get('cursor') // opcional

	let baseQuery = collectionRef.orderBy('timeCreated', 'desc').limit(PAGE_SIZE)

	if (cursor) {
		const lastDocRef = await collectionRef.doc(cursor).get()
		if (lastDocRef.exists) {
			baseQuery = baseQuery.startAfter(lastDocRef)
		}
	}

	const snapshot = await baseQuery.get()
	let images = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}))

	const lastVisible = snapshot.docs[snapshot.docs.length - 1]
	const nextCursor = lastVisible ? lastVisible.id : null

	images = shuffleArray(images)

	return new Response(JSON.stringify({ images, nextCursor }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	})
}
