/**
 * Formatea una fecha "date-only" del backend (string "YYYY-MM-DD") a texto
 * legible en es-AR, p.ej. "1 de junio de 2026".
 *
 * Ojo timezone: new Date("YYYY-MM-DD") interpreta el string como medianoche
 * UTC y, al renderizar en una zona con offset negativo (AR = UTC-3), retrocede
 * un día. Por eso, cuando el valor es date-only, parseamos los componentes a
 * mano y construimos una fecha local para evitar el corrimiento. Strings con
 * hora completa (ISO datetime) caen al parseo normal de Date.
 */
export const formatDate = (value: string | null | undefined): string => {
	if (!value) return '—'

	const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
	const date = dateOnly
		? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
		: new Date(value)
	if (Number.isNaN(date.getTime())) return value

	return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}
