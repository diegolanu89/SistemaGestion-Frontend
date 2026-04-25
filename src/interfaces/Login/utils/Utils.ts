/**
 * Clase estática de utilidades generales para procesamiento de strings, colores y nombres.
 *
 * Todos los métodos son estáticos, por lo que se usan directamente como `Utils.metodo()`.
 */
export class Utils {
	/**
	 * Devuelve un string con la primera letra en mayúscula y el resto en minúscula.
	 *
	 * @param str - El string de entrada.
	 * @returns El string con la primera letra en mayúscula.
	 *
	 * @example
	 * Utils.primeraLetraEnMayuscula('hola') // "Hola"
	 * Utils.primeraLetraEnMayuscula('MUNDO') // "Mundo"
	 */
	static primeraLetraEnMayuscula(str: string): string {
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
	}

	/**
	 * Determina si un color CSS es visualmente claro, utilizando el modelo de luminosidad.
	 *
	 * @param colorName - Nombre del color (por ejemplo: "white", "#f1f1f1", "rgb(200,200,200)").
	 * @returns `true` si el color es claro, `false` si es oscuro.
	 *
	 * @example
	 * Utils.isColorClaro('white') // true
	 * Utils.isColorClaro('#000000') // false
	 */
	static isColorClaro(colorName: string): boolean {
		const tempElement = document.createElement('div')
		tempElement.style.color = colorName
		document.body.appendChild(tempElement)

		const color = window.getComputedStyle(tempElement).color
		document.body.removeChild(tempElement)

		const rgb = color.match(/\d+/g) as string[]
		const r = parseInt(rgb[0])
		const g = parseInt(rgb[1])
		const b = parseInt(rgb[2])

		const luminosidad = (0.299 * r + 0.587 * g + 0.114 * b) / 255
		return luminosidad > 0.5
	}
}
