// components/EtcProjectToolbar.tsx

import { FC, useEffect, useState } from 'react'

import { useLocation } from 'react-router-dom'

import { useEtcContext } from '../hooks/useEtcContext.h'
import { useEtcProjectController } from '../hooks/useEtcProjectController.h'

import { proyectViewAdapter } from '../../ViewProyect/services/ProyectViewAdapter.s'

import { ProjectDto } from '../../ViewProyect/models/ProyectViewDTO.m'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

type NotificationState = {
	show: boolean
	type: 'success' | 'error'
	message: string
}

export const EtcProjectToolbar: FC = () => {
	const location = useLocation()

	const isLocked = Boolean(location.state?.projectId)

	const { projectId, projectName, bac, setBac, setProjectId, setProjectName } = useEtcContext()

	const { loadProject } = useEtcProjectController()

	const [projects, setProjects] = useState<ProjectDto[]>([])

	const [loadingProjects, setLoadingProjects] = useState(false)

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

	useEffect(() => {
		if (isLocked) return

		void loadProjects()

		setProjectId(0)
		setProjectName('')
		setBac(0)
	}, [isLocked])

	const loadProjects = async (): Promise<void> => {
		try {
			setLoadingProjects(true)

			const response = await proyectViewAdapter.getAll({
				page: 1,
				per_page: 500,
			})

			setProjects([...response.data].sort((a, b) => (b.code ?? '').localeCompare(a.code ?? '')))
		} catch (error: unknown) {
			logger.errorTag(LogTag.Adapter, error instanceof Error ? error : new Error(String(error)))
		} finally {
			setLoadingProjects(false)
		}
	}

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

			await proyectViewAdapter.updateBac(projectId, {
				bacBaseHours: bacValue,
			})

			setBac(bacValue)

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

				{isLocked ? (
					<div className="etc-toolbar__readonly">{projectName}</div>
				) : (
					<select
						className="etc-toolbar__input"
						value={projectId || ''}
						disabled={loadingProjects}
						onChange={(event) => {
							const id = Number(event.target.value)

							if (!id) {
								return
							}

							void loadProject(id)
						}}
					>
						<option value="">Seleccionar proyecto...</option>

						{projects.map((project) => (
							<option key={project.id} value={project.id}>
								{project.name}
							</option>
						))}
					</select>
				)}
			</div>

			{/* BAC */}

			<div className="etc-toolbar__field">
				<label className="etc-toolbar__label">BAC Base (horas)</label>

				<input
					type="number"
					min="0"
					step="0.01"
					value={bacInput}
					onChange={(event) => setBacInput(event.target.value)}
					className="etc-toolbar__input"
					disabled={!projectId}
				/>
			</div>

			{/* ACTIONS */}

			<div className="etc-toolbar__actions">
				<button className="etc-toolbar__save-btn" onClick={() => void handleSave()} disabled={!projectId || saving}>
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

export default EtcProjectToolbar
