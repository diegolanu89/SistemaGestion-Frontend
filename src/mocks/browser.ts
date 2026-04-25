/**
 * Inicializa el Mock Service Worker en entorno de desarrollo.
 *
 * @module Mocks
 * @description
 * Este módulo configura e inicia el Service Worker de MSW para interceptar
 * solicitudes HTTP en el navegador. Utiliza los handlers definidos en `./handlers`.
 *
 * El worker solo se activa si el entorno es de desarrollo (`import.meta.env.DEV`),
 * lo que permite simular respuestas sin afectar el entorno de producción.
 *
 * @example
 * // En entorno de desarrollo, al hacer una solicitud GET a /api/users:
 * // Se recibe una respuesta simulada definida en los handlers.
 */
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
import { resolveCapabilities } from '../interfaces/base/model/ResolveCapabilities.m'

export const worker = setupWorker(...handlers)
const { isDev } = resolveCapabilities()
if (isDev) {
	worker.start({
		onUnhandledRequest: 'bypass',
	})
}
