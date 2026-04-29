import { LoginInterface } from '../models/LoginInterface.m'
import { LoginMock } from './LoginMock.s'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { resolveCapabilities } from '../../base/model/ResolveCapabilities.m'
import { LoginBDT } from './LoginTrackFit.s'

/**
 * ============================================================================
 * AuthAdapterFactory
 * ============================================================================
 *
 * Factory responsable de decidir qué implementación concreta
 * de autenticación utilizar según el entorno.
 *
 * 👉 NO conoce IUser
 * 👉 NO conoce Context
 * 👉 SOLO retorna un adapter que cumple LoginInterface
 */
export class AuthAdapterFactory {
	/**
	 * Retorna una instancia del adaptador de autenticación correspondiente.
	 *
	 * El proveedor se define mediante la variable de entorno `VITE_AUTH_PROVIDER`.
	 * Si no se especifica o contiene un valor inválido, se usa por defecto el adaptador mock.
	 */
	static getAdapter(): LoginInterface {
		const { provider } = resolveCapabilities()
		logger.infoTag(LogTag.Provider, `Using auth provider: ${provider}`)

		switch (provider) {
			case 'ers':
				return new LoginBDT()

			case 'mock':
			default:
				return new LoginMock()
		}
	}
}

/**
 * ============================================================================
 * authAdapter
 * ============================================================================
 *
 * Instancia única del adaptador de autenticación activo.
 *
 * Debe ser utilizada por:
 * - AuthProvider
 * - Hooks de autenticación
 *
 * ❌ No usar directamente en componentes visuales
 */
export const authAdapter = AuthAdapterFactory.getAdapter()
