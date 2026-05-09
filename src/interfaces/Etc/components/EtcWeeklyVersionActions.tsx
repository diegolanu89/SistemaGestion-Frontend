// components/EtcWeeklyVersionActions.tsx

import { FC } from 'react'

import { useEtcWeeklyVersionController } from '../hooks/useEtcWeelyVersionController.h'

export const EtcWeeklyVersionActions: FC = () => {
	const { loading, setLoading, handleBack, saveSnapshot } = useEtcWeeklyVersionController()

	const handleSave = async () => {
		try {
			setLoading(true)

			await new Promise((resolve) => setTimeout(resolve, 2000))

			await saveSnapshot()
		} finally {
			setLoading(false)
		}
	}

	return (
		<footer className="etc-weekly-actions">
			<button type="button" className="etc-weekly-actions__cancel" onClick={handleBack}>
				Cancelar
			</button>

			<button type="button" className="etc-weekly-actions__save" onClick={handleSave} disabled={loading}>
				{loading ? 'Guardando...' : 'Guardar versión'}
			</button>
		</footer>
	)
}
