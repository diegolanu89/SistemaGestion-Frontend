// components/EtcWeeklyVersionActions.tsx

import { FC } from 'react'

interface Props {
	loading: boolean
	onCancel: () => void
	onSave: () => void
}

export const EtcWeeklyVersionActions: FC<Props> = ({ loading, onCancel, onSave }) => {
	return (
		<footer className="etc-weekly-actions">
			<button type="button" className="etc-weekly-actions__cancel" onClick={onCancel}>
				Cancelar
			</button>

			<button type="button" className="etc-weekly-actions__save" onClick={onSave} disabled={loading}>
				{loading ? 'Guardando...' : 'Guardar versión'}
			</button>
		</footer>
	)
}
