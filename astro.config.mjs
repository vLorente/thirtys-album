import preact from '@astrojs/preact'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
	output: 'server',
	integrations: [preact(), sitemap()],
	vite: {
		plugins: [
			tailwindcss({
				globalStyle: './src/styles/global.css',
				applyBaseStyles: false,
			}),
		],
	},
	build: {
		inlineStylesheets: 'always',
	},
	adapter: vercel(),
	site: 'https://threetys-album.vlorente.dev',
})
