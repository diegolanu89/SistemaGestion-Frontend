import { defineConfig } from 'cypress'

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost:5173', // URL donde corre tu servidor de desarrollo
		supportFile: 'cypress/support/e2e.ts', // Configuración global para las pruebas
		video: true, // Habilita grabaciones de las pruebas
		screenshotsFolder: 'cypress/screenshots', // Carpeta para capturas
		videosFolder: 'cypress/videos', // Carpeta para videos
		specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
	},
})
