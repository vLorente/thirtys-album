import type { UploadedImage } from '@/types/firebase'
import 'photoswipe/style.css'
import { useCallback, useEffect, useState } from 'preact/hooks'

export function useGalleryImages() {
	const [images, setImages] = useState<UploadedImage[]>([])
	const [loading, setLoading] = useState(false)
	const [nextCursor, setNextCursor] = useState<string | null>(null)
	const [hasMore, setHasMore] = useState(true)

	useEffect(() => {
		const init = async () => {
			await import('@appnest/masonry-layout')
			const module = await import('photoswipe/lightbox')
			const PhotoSwipeLightbox = module.default
			const lightbox = new PhotoSwipeLightbox({
				gallery: '#gallery',
				children: 'a',
				showHideAnimationType: 'zoom',
				pswpModule: () => import('photoswipe'),
			})
			lightbox.init()
		}
		init()
	}, [])

	const loadMore = useCallback(async () => {
		if (loading || !hasMore) return

		setLoading(true)
		const url = nextCursor
			? `/api/gallery/images?cursor=${encodeURIComponent(nextCursor)}`
			: `/api/gallery/images`

		const res = await fetch(url)
		const data = await res.json()
		const more = !(data.images.length < 10)

		setImages((prev) => [...prev, ...data.images])
		setNextCursor(data.nextCursor)
		setHasMore(more)
		setLoading(false)
	}, [loading, hasMore, nextCursor])

	useEffect(() => {
		loadMore()
	}, [])

	return { images, loadMore, hasMore, loading }
}
