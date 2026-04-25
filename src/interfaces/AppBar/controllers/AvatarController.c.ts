/**
 * @class AvatarController
 *
 * Utility controller that provides helper methods used to generate:
 * - initials for user avatars
 * - deterministic colors based on a given string
 *
 * These helpers allow avatar components to remain simple, while ensuring
 * consistent behavior across the application.
 *
 * Both methods are static, meaning the controller does not need
 * to be instantiated.
 *
 * @example
 * ```ts
 * AvatarController.obtenerIniciales("Leonella Canepa") // "LC"
 * AvatarController.stringToColor("Leonella")           // "#a53f73"
 * ```
 */
export class AvatarController {
	/**
	 * Extracts initials from a full name.
	 *
	 * Each word contributes its first letter (uppercase). Useful for
	 * generating compact avatar representations (e.g., "LC", "JP").
	 *
	 * @static
	 * @param {string} nombre - Full name, such as "Leonella Canepa".
	 * @returns {string} Uppercase initials derived from the input string.
	 *
	 * @example
	 * ```ts
	 * AvatarController.obtenerIniciales("Juan Pérez")         // "JP"
	 * AvatarController.obtenerIniciales("ana maria lopez")    // "AML"
	 * AvatarController.obtenerIniciales("  Diego   Peyrano ") // "DP"
	 * ```
	 */
	static obtenerIniciales(nombre: string): string {
		return nombre
			.trim()
			.split(/\s+/)
			.map((word) => word[0]?.toUpperCase())
			.join('')
	}

	/**
	 * Converts a string into a deterministic hexadecimal color.
	 *
	 * Commonly used to assign avatar background colors based on the user's name.
	 * The same input string will always produce the same color.
	 *
	 * @static
	 * @param {string} str - Input string.
	 * @returns {string} A valid hexadecimal color (e.g., "#a53f73").
	 *
	 * @example
	 * ```ts
	 * AvatarController.stringToColor("Leonella") // "#a53f73"
	 * AvatarController.stringToColor("Diego")    // "#6f832c"
	 * AvatarController.stringToColor("PFA")      // "#3f6bb0"
	 * ```
	 */
	static stringToColor(str: string): string {
		let hash = 0
		for (let i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash)
		}
		let color = '#'
		for (let i = 0; i < 3; i++) {
			const value = (hash >> (i * 8)) & 0xff
			color += ('00' + value.toString(16)).slice(-2)
		}
		return color
	}
}
