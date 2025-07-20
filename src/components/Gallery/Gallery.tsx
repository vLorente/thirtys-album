import '@/styles/global.css'
import 'photoswipe/style.css'
import '@/components/Gallery/styles/Gallery.css'
import ButtonToTop from '@/components/Gallery/ButtonToTop'
import { useRef } from 'preact/hooks'
import { useGalleryImages } from '@/hooks/useGalleryImages'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useResponsiveMaxColWidth } from '@/hooks/useResponsiveMaxColWidth'
import EmptyGallery from '@/components/Gallery/EmptyGallery' // Asegúrate de que la ruta sea correcta

export default function Gallery() {
	const { images, hasMore, loadMore, loading } = useGalleryImages()
	const sentinelRef = useRef<HTMLDivElement | null>(null)
	const maxColWidth = useResponsiveMaxColWidth()

	useInfiniteScroll({
		ref: sentinelRef,
		hasMore,
		loading,
		onLoadMore: loadMore,
	})

	return (
		<section className="pt-18 min-h-screen w-full px-2 md:px-5">
			{images.length === 0 && !loading ? (
				<EmptyGallery />
			) : (
				<>
					{/* @ts-ignore */}
					<masonry-layout
						gap="24"
						maxColWidth={maxColWidth}
						className="mx-4 sm:py-10 lg:mx-auto lg:py-2"
						id="gallery"
					>
						{images.map(({ height, width, url, name, thumbnailUrl }, index) => (
							<a
								key={`gallery-image-${index + 1}`}
								className="group relative rounded-xl pb-4 transition-all hover:scale-105 hover:contrast-[110%]"
								href={url}
								target="_blank"
								data-cropped="true"
								data-pswp-width={width}
								data-pswp-height={height}
							>
								<img
									className="h-auto w-full rounded-xl object-cover"
									loading="lazy"
									src={thumbnailUrl}
									alt={name}
								/>
								<img
									className="absolute inset-0 -z-10 object-cover opacity-0 blur-md contrast-150 transition group-hover:opacity-100"
									loading="lazy"
									src={thumbnailUrl}
									alt="Imagen con efecto blur para hacer de sombra de una fotografía"
								/>
							</a>
						))}
						{/* Sentinel (invisible, para el scroll infinito) */}
						<div ref={sentinelRef} className="h-10 w-full bg-transparent" />
						{/* @ts-ignore */}
					</masonry-layout>
				</>
			)}
			{loading && <p className="py-4 text-center">Cargando más imágenes...</p>}
			<ButtonToTop />
		</section>
	)
}
