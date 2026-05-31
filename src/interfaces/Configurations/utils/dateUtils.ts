export function diffDays(from: string, to: string): number | null {
	if (!from || from.length < 10 || !to || to.length < 10) return null
	const dFrom = new Date(from)
	const dTo = new Date(to)
	if (isNaN(dFrom.getTime()) || isNaN(dTo.getTime()) || dTo < dFrom) return null
	return Math.round((dTo.getTime() - dFrom.getTime()) / (24 * 60 * 60 * 1000)) + 1
}
