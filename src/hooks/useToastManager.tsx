// components/ToastManager.tsx
import { useRef, useState } from 'preact/hooks'
import { createPortal } from 'preact/compat'

interface Toast {
	id: number
	message: string
	visible: boolean
	status: 'success' | 'error' | 'info'
}

interface ShowToastProps {
	message: string
	duration?: number
	status?: 'success' | 'error' | 'info'
}

export function useToastManager() {
	const [toasts, setToasts] = useState<Toast[]>([])
	const toastId = useRef(0)

	const showToast = ({ message, duration = 3000, status = 'info' }: ShowToastProps) => {
		const id = toastId.current++
		const toast: Toast = { id, message, visible: true, status }

		setToasts((prev) => [...prev, toast])

		// Empieza fade-out
		setTimeout(() => {
			setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)))
		}, duration - 300)

		// Elimina del DOM
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id))
		}, duration)
	}

	const getStatusClasses = (status: Toast['status']) => {
		switch (status) {
			case 'success':
				return 'bg-green-600 text-white'
			case 'error':
				return 'bg-red-600 text-white'
			case 'info':
			default:
				return 'bg-blue-600 text-white'
		}
	}

	const ToastContainer = () =>
		createPortal(
			<div class="fixed bottom-20 left-8 right-8 z-50 flex flex-col items-center justify-center space-y-2">
				{toasts.map((toast) => (
					<div
						key={toast.id}
						class={`rounded px-4 py-2 shadow-lg transition-all ${
							toast.visible ? 'animate-fade-in' : 'animate-fade-out'
						} ${getStatusClasses(toast.status)}`}
					>
						{toast.message}
					</div>
				))}
			</div>,
			document.body,
		)

	return { showToast, ToastContainer }
}
