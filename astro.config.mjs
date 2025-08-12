import preact from '@astrojs/preact'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
	output: 'server',
	integrations: [preact(), sitemap()],
	server: {
		host: process.env.NODE_ENV === 'development',
		port: 4321,
	},
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
	adapter: vercel({
		webAnalytics: {
			enabled: true,
		},
	}),
	site: 'https://thirtys-album.vlorente.dev',
})
