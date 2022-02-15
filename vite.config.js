import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import preprocess from 'svelte-preprocess'

export default defineConfig({
	server: {
		port: 3001,
		strictPort: true,
	},
	plugins: [
		svelte({
			preprocess: preprocess(),
			/* plugin options */
		})
	],
})