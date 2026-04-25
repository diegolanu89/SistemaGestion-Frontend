/* eslint-disable no-control-regex */
// src/interfaces/Login/controllers/SanitizacionController.ts

/**
 * SanitizacionController
 *
 * Centraliza la sanitización de inputs relacionados a autenticación.
 *
 * ❗ NO valida
 * ❗ NO lanza errores
 * ❗ NO aplica reglas de negocio
 *
 * Solo normaliza y limpia datos de entrada.
 */
export class SanitizacionController {
	/**
	 * Sanitiza un email:
	 * - trim
	 * - lowercase
	 * - colapsa espacios
	 */
	static sanitizeEmail(value: string): string {
		return value.trim().toLowerCase().replace(/\s+/g, '')
	}

	/**
	 * Sanitiza un nombre:
	 * - trim
	 * - colapsa espacios múltiples
	 */
	static sanitizeName(value: string): string {
		return value.trim().replace(/\s+/g, ' ')
	}

	/**
	 * Sanitiza texto genérico:
	 * - trim
	 * - elimina caracteres de control
	 */
	static sanitizeText(value: string): string {
		return value.trim().replace(/[\x00-\x1F\x7F]/g, '')
	}

	/**
	 * Sanitiza password:
	 *
	 * ⚠️ IMPORTANTE:
	 * - NO modificar contenido semántico
	 * - Solo trim (nunca lowercase, nunca replace)
	 */
	static sanitizePassword(value: string): string {
		return value.trim()
	}
}
