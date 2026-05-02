// components/EtcToolBar.tsx

import { FC, useMemo } from 'react'
import { useEtcContext } from '../hooks/useEtcContext.h'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

export const EtcToolbar: FC = () => {
	const { projectId } = useEtcContext()

	// 🔥 MOCK → después backend
	const projectLabel = useMemo(() => {
		return `PRJ-${projectId} - Cliente X - Proyecto Demo`
	}, [projectId])

	const bacBase = useMemo(() => {
		// 🔥 acá después viene del backend (EVM / BAC real)
		return 240
	}, [])

	const handleSave = () => {
		logger.infoTag(LogTag.Adapter, '[ETC] Save BAC clicked', {
			projectId,
			bacBase,
		})
	}

	return (
		<div className="etc-toolbar">
			{/* PROJECT */}
			<div className="etc-toolbar__field">
				<label className="etc-toolbar__label">Proyecto</label>

				<div className="etc-toolbar__readonly">{projectLabel}</div>
			</div>

			{/* BAC BASE */}
			<div className="etc-toolbar__field">
				<label className="etc-toolbar__label">BAC Base (horas)</label>

				<div className="etc-toolbar__readonly">{bacBase} hs</div>
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
