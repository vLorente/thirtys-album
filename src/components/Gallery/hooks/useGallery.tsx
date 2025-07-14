import photosInfo from '@/data/meta-gallery.json'
import { useEffect, useMemo, useRef } from 'preact/hooks'

export const useGallery = ({ category, isExpanded }: { category: string; isExpanded: boolean }) => {
	const categoryIndex = Number(category) - 1
	const totalPhotos = photosInfo[categoryIndex].length
	const first = useRef<HTMLAnchorElement>(null)

	// Usar useMemo para recalcular las fotos cuando cambian category o isExpanded
	const photos = useMemo(() => {
		if (isExpanded) {
			return photosInfo[categoryIndex]
		}
		return photosInfo[categoryIndex].slice(0, Math.min(10, totalPhotos))
	}, [categoryIndex, isExpanded, totalPhotos])

	useEffect(() => {
		const init = async () => {
			await import('@appnest/masonry-layout')
			const module = await import('photoswipe/lightbox')
			const PhotoSwipeLightbox = module.default
			const lightbox = new PhotoSwipeLightbox({
				gallery: '#gallery',
				children: 'a',
				pswpModule: () => import('photoswipe'),
			})
			lightbox.init()
		}
		init()
	}, [])

	const LoadMore = async (e: MouseEvent) => {
		e.preventDefault()
	}

	return {
		photos,
		totalPhotos,
		first,
		LoadMore,
	}
}
