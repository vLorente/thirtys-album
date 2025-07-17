import siteImage from 'public/images/site-image.webp'

export interface SiteDataProps {
	title: string
	description: string
	author: string
	siteUrl: string
	siteImage: ImageMetadata
}

const siteData: SiteDataProps = {
	title: 'Thirtys Album',
	description: 'Colección de momentos en el año de nuestros 30s.',
	author: 'vLorente',
	siteUrl: 'https://thirtys-album.vlorente.dev',
	siteImage: siteImage,
}

export default siteData
