import { useEffect, useState } from 'preact/hooks'

export function useResponsiveMaxColWidth() {
	const [maxColWidth, setMaxColWidth] = useState(400) // valor por defecto

	useEffect(() => {
		function updateMaxColWidth() {
			const width = window.innerWidth
			if (width >= 1536)
				setMaxColWidth(450) // 2XL
			else if (width >= 1280)
				setMaxColWidth(400) // XL
			else if (width >= 1024)
				setMaxColWidth(350) // LG
			else if (width >= 768)
				setMaxColWidth(300) // MD
			else setMaxColWidth(200) // SM
		}

		updateMaxColWidth() // inicial
		window.addEventListener('resize', updateMaxColWidth)
		return () => window.removeEventListener('resize', updateMaxColWidth)
	}, [])

	return maxColWidth
}
