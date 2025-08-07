// hooks/useInfiniteScroll.ts
import { useEffect } from 'preact/hooks'

export function useInfiniteScroll({
	ref,
	hasMore,
	loading,
	onLoadMore,
	rootMargin = '100px',
}: {
	ref: React.RefObject<Element>
	hasMore: boolean
	loading: boolean
	onLoadMore: () => void
	rootMargin?: string
}) {
	useEffect(() => {
		const target = ref.current
		if (!target || !hasMore || loading) return

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					onLoadMore()
				}
			},
			{ rootMargin },
		)

		observer.observe(target)
		return () => observer.disconnect()
	}, [ref, hasMore, loading, onLoadMore])
}
