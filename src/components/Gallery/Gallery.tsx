import '@/styles/global.css'
import 'photoswipe/style.css'
import '@/components/Gallery/styles/Gallery.css'
import Button from '@/components/Gallery/Button'
import ButtonToTop from '@/components/Gallery/ButtonToTop'
import { useGallery } from '@/components/Gallery/hooks/useGallery'
import { useState } from 'preact/hooks'

export default function Gallery() {
	const category = '1'
	const [isExpanded, setIsExpanded] = useState(false)
	const { first, photos, totalPhotos, LoadMore } = useGallery({ category, isExpanded })

	return (
		<section className="max-w-8xl mx-auto px-2 pt-5 md:px-5">
			{/* @ts-ignore */}
			<masonry-layout
				gap="24"
				maxColWidth="600"
				className="mx-4 sm:py-10 lg:mx-auto lg:py-2"
				id="gallery"
			>
				{photos.map(({ height, width }, index) => (
					<a
						key={`gallery-image-${index + 1}`}
						className="group relative rounded-xl pb-4 transition-all hover:scale-105 hover:contrast-[110%]"
						href={`/gallery/${category}/img-${index + 1}.webp`}
						target="_blank"
						data-cropped="true"
						data-pswp-width={width}
						data-pswp-height={height}
						ref={!first.current ? first : undefined}
					>
						<img
							className="h-auto w-full rounded-xl object-cover"
							loading="lazy"
							src={`/gallery/${category}/thumbnails/img-${index + 1}.webp`}
							alt="Fotografía de la boda de Nuria y Cristian"
						/>
						<img
							className="absolute inset-0 -z-10 object-cover opacity-0 blur-md contrast-150 transition group-hover:opacity-100"
							loading="lazy"
							src={`/gallery/${category}/thumbnails/img-${index + 1}.webp`}
							alt="Imagen con efecto blur para hacer de sombra de una fotografía de la boda de Nuria y Cristian"
						/>
					</a>
				))}
				{/* @ts-ignore */}
			</masonry-layout>
			<div className="mx-auto text-center">
				{!isExpanded && totalPhotos > 10 && (
					<Button
						onClick={(e) => {
							LoadMore(e)
							setIsExpanded(true)
						}}
						id="load-more"
						url="#"
					>
						Descúbrelas todas
					</Button>
				)}
			</div>
			<ButtonToTop scrollTo="#categories" />
		</section>
	)
}
