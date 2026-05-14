// components/EtcToolBar.tsx

import { FC } from 'react'

import { useEtcWeeklyVersionController } from '../hooks/useEtcWeelyVersionController.h'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

export const EtcToolbar: FC = () => {
	const { projectId, projectName, bac } = useEtcWeeklyVersionController()

	const handleSave = () => {
		logger.infoTag(LogTag.Adapter, '[ETC] Save BAC clicked', {
			projectId,
			bac,
		})
	}

	return (
		<div className="etc-toolbar">
			{/* PROJECT */}

			<div className="etc-toolbar__field">
				<label className="etc-toolbar__label">Proyecto</label>

				<div className="etc-toolbar__readonly">{projectName}</div>
			</div>

			{/* BAC */}

			<div className="etc-toolbar__field">
				<label className="etc-toolbar__label">BAC Base (horas)</label>

				<div className="etc-toolbar__readonly">{bac.toFixed(2)} hs</div>
			</div>

			{/* ACTION */}

			<div className="etc-toolbar__actions">
				<button className="etc-toolbar__save-btn" onClick={handleSave} data-tooltip="Guardar BAC del proyecto">
					<span className="material-icons etc-toolbar__icon">save</span>
				</button>
			</div>
		</div>
	)
}
