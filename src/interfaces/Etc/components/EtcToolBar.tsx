import { FC, useState, useEffect } from 'react'
import { useEtcWeeklyVersionController } from '../hooks/useEtcWeelyVersionController.h'
import { useEtcContext } from '../hooks/useEtcContext.h'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { proyectViewAdapter } from '../../ViewProyect/services/ProyectViewAdapter.s'

type NotificationState = {
	show: boolean
	type: 'success' | 'error'
	message: string
}

export const EtcToolbar: FC = () => {
	const { projectId, projectName, bac } = useEtcWeeklyVersionController()

	const { setBac } = useEtcContext()

	const [saving, setSaving] = useState(false)

	const [bacInput, setBacInput] = useState('0')

	const [notification, setNotification] = useState<NotificationState>({
		show: false,
		type: 'success',
		message: '',
	})

	useEffect(() => {
		setBacInput(String(bac))
	}, [bac])

	const showNotification = (type: NotificationState['type'], message: string): void => {
		setNotification({
			show: true,
			type,
			message,
		})

		window.setTimeout(() => {
			setNotification((prev) => ({
				...prev,
				show: false,
			}))
		}, 3500)
	}

	const handleSave = async (): Promise<void> => {
		if (!projectId || saving) {
			return
		}

		try {
			setSaving(true)

			const bacValue = Number(bacInput)

			if (Number.isNaN(bacValue) || bacValue < 0) {
				showNotification('error', 'Ingrese un BAC válido')

				return
			}

			logger.infoTag(LogTag.Adapter, '[ETC] Saving BAC', {
				projectId,
				bac: bacValue,
			})

			await proyectViewAdapter.updateBac(projectId, {
				bacBaseHours: bacValue,
			})

			setBac(bacValue)

			logger.infoTag(LogTag.Adapter, '[ETC] BAC saved successfully', {
				projectId,
				bac: bacValue,
			})

			showNotification('success', 'BAC actualizado correctamente')
		} catch (error: unknown) {
			logger.errorTag(LogTag.Adapter, error instanceof Error ? error : new Error(String(error)))

			showNotification('error', 'No fue posible actualizar el BAC')
		} finally {
			setSaving(false)
		}
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

				<input type="number" min="0" step="0.01" value={bacInput} onChange={(event) => setBacInput(event.target.value)} className="etc-toolbar__input" />
			</div>

			{/* ACTION */}

			<div className="etc-toolbar__actions">
				<button className="etc-toolbar__save-btn" onClick={() => void handleSave()} disabled={saving} data-tooltip="Guardar BAC del proyecto">
					<span className="material-icons etc-toolbar__icon">{saving ? 'hourglass_top' : 'save'}</span>

					<span>{saving ? 'Guardando...' : 'Guardar BAC'}</span>
				</button>

				{notification.show && (
					<div className={`etc-toolbar__notification etc-toolbar__notification--${notification.type}`}>
						<span className="material-icons">{notification.type === 'success' ? 'check_circle' : 'error'}</span>

						<span>{notification.message}</span>
					</div>
				)}
			</div>
		</div>
	)
}

export default EtcToolbar
