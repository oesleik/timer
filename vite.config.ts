import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
	base: "/timer/",
	plugins: [
		react(),
		tailwindcss(),
	],
	build: {
		rollupOptions: {
			input: {
				index: 'index.html',
			},
		},
	},
	server: {
		host: "localhost",
		port: 5174,
	}
})
