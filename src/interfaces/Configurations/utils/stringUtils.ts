export function normalizeSearchText(value: string | null | undefined): string {
	return (value || '')
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.trim()
}
