import '@/styles/global.css'
import 'photoswipe/style.css'
import '@/components/Gallery/styles/Gallery.css'
import Button from '@/components/Gallery/Button'
import ButtonToTop from '@/components/Gallery/ButtonToTop'
import { useEffect, useRef, useState } from 'preact/hooks'
import { useGalleryImages } from '@/hooks/useGalleryImages'

export default function Gallery() {
	const category = '1'
	const [isExpanded, setIsExpanded] = useState(false)
	// const { first, photos, totalPhotos, LoadMore } = useGallery({ category, isExpanded })
	const { images, hasMore, loadMore, loading } = useGalleryImages()
	const sentinelRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (!sentinelRef.current || !hasMore || loading) return

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					loadMore()
				}
			},
			{
				rootMargin: '100px',
			},
		)

		observer.observe(sentinelRef.current)

		return () => observer.disconnect()
	}, [hasMore, loading])

	return (
		<section className="max-w-8xl mx-auto px-2 pt-5 md:px-5">
			{/* @ts-ignore */}
			<masonry-layout
				gap="24"
				maxColWidth="600"
				className="mx-4 sm:py-10 lg:mx-auto lg:py-2"
				id="gallery"
			>
				{images.map(({ height, width, url, name }, index) => (
					<a
						key={`gallery-image-${index + 1}`}
						className="group relative rounded-xl pb-4 transition-all hover:scale-105 hover:contrast-[110%]"
						href={url}
						target="_blank"
						data-cropped="true"
						data-pswp-width={width}
						data-pswp-height={height}
					>
						{/* Thumbnail */}
						<img
							className="h-auto w-full rounded-xl object-cover"
							loading="lazy"
							src={url}
							alt={name}
						/>
						<img
							className="absolute inset-0 -z-10 object-cover opacity-0 blur-md contrast-150 transition group-hover:opacity-100"
							loading="lazy"
							src={url}
							alt="Imagen con efecto blur para hacer de sombra de una fotografía"
						/>
					</a>
				))}
				{/* Sentinel (invisible, para el scroll infinito) */}
				<div ref={sentinelRef} className="h-8 w-full" />
				{/* @ts-ignore */}
			</masonry-layout>
			{loading && <p className="py-4 text-center">Cargando más imágenes...</p>}
			<ButtonToTop scrollTo="#header" />
		</section>
	)
}
