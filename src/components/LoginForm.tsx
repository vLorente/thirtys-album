import { useState } from 'preact/hooks'
import { getAuth, signInWithEmailAndPassword, inMemoryPersistence } from 'firebase/auth'
import { app } from '@/firebase/client'

type Props = {
	redirectUrl?: string
}

export default function LoginForm({ redirectUrl = '/dashboard' }: Props) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: Event) => {
		e.preventDefault()
		setLoading(true)
		setError(null)

		if (!email.trim() || !password.trim()) {
			setError('Email y contraseña son obligatorios.')
			setLoading(false)
			return
		}

		try {
			const auth = getAuth(app)
			await auth.setPersistence(inMemoryPersistence)

			const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim())
			const idToken = await userCredential.user.getIdToken()

			const response = await fetch('/api/auth/signin', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${idToken}`,
				},
			})

			if (!response.ok) {
				throw new Error('No se pudo iniciar sesión. Verifica tus credenciales.')
			}

			if (response.redirected) {
				window.location.assign(response.url)
			} else {
				window.location.assign(redirectUrl)
			}
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Error desconocido')
		} finally {
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} class="flex w-full max-w-sm flex-col gap-4 rounded-2xl p-6">
			<label for="email" class="font-bold">
				Email
			</label>
			<input
				type="email"
				id="email"
				name="email"
				value={email}
				onInput={(e: Event) => setEmail((e.target as HTMLInputElement).value)}
				required
				class="rounded-lg border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
			/>

			<label for="password" class="font-bold">
				Contraseña
			</label>
			<input
				type="password"
				id="password"
				name="password"
				value={password}
				onInput={(e: Event) => setPassword((e.target as HTMLInputElement).value)}
				required
				class="rounded-lg border-2 border-black p-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
			/>

			{error && <p class="text-sm font-medium text-red-600">{error}</p>}

			<button
				type="submit"
				disabled={loading}
				aria-busy={loading}
				class={`mt-4 rounded-xl border-2 border-black px-4 py-2 font-bold transition ${
					loading ? 'cursor-not-allowed bg-gray-300' : 'bg-pink-200 hover:bg-pink-300'
				}`}
			>
				{loading ? 'Accediendo…' : 'Acceder'}
			</button>
		</form>
	)
}
