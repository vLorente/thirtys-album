import { useEffect, useState } from 'preact/hooks'

export default function ButtonToTop({ className = '' }: { className?: string }) {
	const [showButtonToTop, setShowButtonToTop] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setShowButtonToTop(window.scrollY > window.innerHeight)
		}
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const scrollToTop = (e: Event) => {
		e.preventDefault()
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	return showButtonToTop ? (
		<button
			onClick={scrollToTop}
			className={`fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-800 shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-500 ${className}`}
			aria-label="Volver arriba"
		>
			<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
				<path
					d="M12 19V5M12 5L5 12M12 5L19 12"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</button>
	) : null
}
