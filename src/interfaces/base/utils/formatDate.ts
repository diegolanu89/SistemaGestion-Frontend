/**
 * Convierte un string ISO `YYYY-MM-DD` (o datetime ISO) al formato de
 * visualización `DD/MM/YYYY`. Devuelve '-' si el valor es nulo/vacío/inválido.
 */
export function formatDate(value: string | null | undefined): string {
	if (!value) return '-'
	const parts = value.slice(0, 10).split('-')
	if (parts.length !== 3 || parts[0].length !== 4) return '-'
	return `${parts[2]}/${parts[1]}/${parts[0]}`
}
