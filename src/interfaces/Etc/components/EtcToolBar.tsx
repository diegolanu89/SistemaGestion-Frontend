// components/EtcToolbar.tsx

import { FC } from 'react'
import { useEtcController } from '../hooks/useEtcController.h'
import { useEtcContext } from '../hooks/useEtcContext.h'

export const EtcToolbar: FC = () => {
	const { validate, save, snapshot } = useEtcController()
	const { loading } = useEtcContext()

	return (
		<div className="etc-toolbar">
			<button data-tooltip="Validar capacidad de carga por recurso y mes" onClick={validate} disabled={loading}>
				<span className="material-icons">rule</span>
				Validar
			</button>

			<button data-tooltip="Guardar estimaciones ETC del proyecto" onClick={save} disabled={loading}>
				<span className="material-icons">save</span>
				Guardar
			</button>

			<button data-tooltip="Generar snapshot (nueva versión del ETC)" onClick={snapshot} disabled={loading}>
				<span className="material-icons">timeline</span>
				Snapshot
			</button>
		</div>
	)
}
