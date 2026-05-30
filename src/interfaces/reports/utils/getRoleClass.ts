export const getRoleClass = (role?: string | null): string => {
	switch ((role ?? '').toLowerCase()) {
		case 'dev':
		case 'developer':
		case 'des':
			return 'is-dev'

		case 'qa':
			return 'is-qa'

		case 'pm':
			return 'is-pm'

		case 'ld':
		case 'lead':
		case 'líder':
		case 'lider':
			return 'is-lead'

		case 'af':
		case 'ba':
		case 'analista':
			return 'is-ba'

		default:
			return 'is-default'
	}
}
