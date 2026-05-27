// sections/ProjectTrackingAccordion.tsx

import { FC, useEffect, useState } from 'react'

import { SectionLoader } from '../../../base/components/loading/SectionLoader'

import { useProyectViewContext } from '../../hooks/useProyectViewContext.h'

import { ProjectDto } from '../../models/ProyectViewDTO.m'
import { UpsertProjectTrackingDto, CreateTrackingUpdateDto, ProjectTrackingUpdateDto } from '../../models/IProjectTracking.m'
import { projectTrackingAdapter } from '../../services/ProjectTrackingAdapter.s'

interface Props {
	project: ProjectDto

	open: boolean

	onToggle: () => void
}

const EMPTY_TRACKING_FORM: UpsertProjectTrackingDto = {
	startDate: '',

	plannedEndDate: '',

	actualEndDate: '',

	implementationDate: '',
}

const EMPTY_UPDATE_FORM: CreateTrackingUpdateDto = {
	changeEndDate: '',

	observations: '',
}

const ProjectTrackingAccordion: FC<Props> = ({ project, open, onToggle }) => {
	const {
		tracking,
		setTracking,

		trackingLoading,
		setTrackingLoading,

		trackingError,
		setTrackingError,
	} = useProyectViewContext()

	const [trackingForm, setTrackingForm] = useState<UpsertProjectTrackingDto>(EMPTY_TRACKING_FORM)

	const [updateForm, setUpdateForm] = useState<CreateTrackingUpdateDto>(EMPTY_UPDATE_FORM)

	/* =====================================================
	🔹 LOAD TRACKING
	===================================================== */

	useEffect(() => {
		if (!open) return

		const loadTracking = async () => {
			try {
				setTrackingLoading(true)

				setTrackingError(null)

				const response = await projectTrackingAdapter.getTracking(project.id)

				setTracking(response)

				if (response) {
					setTrackingForm({
						startDate: response.startDate ?? '',

						plannedEndDate: response.plannedEndDate ?? '',

						actualEndDate: response.actualEndDate ?? '',

						implementationDate: response.implementationDate ?? '',
					})
				}
			} catch (error) {
				console.error(error)

				setTrackingError('Error al cargar el seguimiento.')
			} finally {
				setTrackingLoading(false)
			}
		}

		void loadTracking()
	}, [open, project.id])

	/* =====================================================
	🔹 SAVE BASE TRACKING
	===================================================== */

	const handleSaveTracking = async () => {
		try {
			setTrackingLoading(true)

			if (!tracking) {
				const created = await projectTrackingAdapter.createTracking(project.id, trackingForm)

				setTracking(created)

				return
			}

			const updated = await projectTrackingAdapter.updateTracking(project.id, trackingForm)

			setTracking(updated)
		} catch (error) {
			console.error(error)

			setTrackingError('Error al guardar fechas base.')
		} finally {
			setTrackingLoading(false)
		}
	}

	/* =====================================================
	🔹 ADD UPDATE
	===================================================== */

	const handleAddUpdate = async () => {
		try {
			if (!tracking) return

			setTrackingLoading(true)

			const created = await projectTrackingAdapter.addUpdate(project.id, updateForm)

			setTracking({
				...tracking,

				updates: [created, ...tracking.updates],
			})

			setUpdateForm(EMPTY_UPDATE_FORM)
		} catch (error) {
			console.error(error)

			setTrackingError('Error al agregar desvío.')
		} finally {
			setTrackingLoading(false)
		}
	}

	return (
		<div className={`project-detail-accordion ${open ? 'is-open' : ''}`}>
			<button className="project-detail-accordion__header" onClick={onToggle}>
				<div>
					<strong>Seguimiento de proyecto</strong>

					<span>Planificación, desvíos y fechas reales.</span>
				</div>

				<span className="material-icons">monitoring</span>
			</button>

			<div className={`project-detail-accordion__content ${open ? 'is-open' : 'is-closed'}`}>
				<div>
					{trackingLoading ? (
						<div className="project-tracking-section__loader">
							<SectionLoader text="Cargando seguimiento..." />
						</div>
					) : (
						<div className="project-tracking-section">
							{/* =========================================
							🔹 ERROR
							========================================= */}

							{trackingError && <div className="project-tracking-section__error">{trackingError}</div>}

							{/* =========================================
							🔹 BASE FORM
							========================================= */}

							<div className="project-tracking-section__card">
								<div className="project-tracking-section__card-header">
									<h3>Fechas base del proyecto</h3>

									<span className="material-icons">event</span>
								</div>

								<div className="project-tracking-section__grid">
									<div className="project-tracking-section__field">
										<label>Fecha inicio</label>

										<input
											type="date"
											value={trackingForm.startDate}
											onChange={(e) =>
												setTrackingForm((prev) => ({
													...prev,

													startDate: e.target.value,
												}))
											}
										/>
									</div>

									<div className="project-tracking-section__field">
										<label>Fin planificado</label>

										<input
											type="date"
											value={trackingForm.plannedEndDate}
											onChange={(e) =>
												setTrackingForm((prev) => ({
													...prev,

													plannedEndDate: e.target.value,
												}))
											}
										/>
									</div>

									<div className="project-tracking-section__field">
										<label>Fin real</label>

										<input
											type="date"
											value={trackingForm.actualEndDate ?? ''}
											onChange={(e) =>
												setTrackingForm((prev) => ({
													...prev,

													actualEndDate: e.target.value,
												}))
											}
										/>
									</div>

									<div className="project-tracking-section__field">
										<label>Fecha implementación</label>

										<input
											type="date"
											value={trackingForm.implementationDate ?? ''}
											onChange={(e) =>
												setTrackingForm((prev) => ({
													...prev,

													implementationDate: e.target.value,
												}))
											}
										/>
									</div>
								</div>

								<div className="project-tracking-section__actions">
									<button onClick={handleSaveTracking}>
										<span className="material-icons">save</span>

										<span>{tracking ? 'Actualizar seguimiento' : 'Guardar seguimiento'}</span>
									</button>
								</div>
							</div>

							{/* =========================================
							🔹 UPDATE FORM
							========================================= */}

							<div className="project-tracking-section__card">
								<div className="project-tracking-section__card-header">
									<h3>Historial de desvíos / demoras</h3>

									<span className="material-icons">history</span>
								</div>

								<div className="project-tracking-section__grid project-tracking-section__grid--updates">
									<div className="project-tracking-section__field">
										<label>Fecha fin con control de cambios</label>

										<input
											type="date"
											value={updateForm.changeEndDate}
											onChange={(e) =>
												setUpdateForm((prev) => ({
													...prev,

													changeEndDate: e.target.value,
												}))
											}
										/>
									</div>

									<div className="project-tracking-section__field project-tracking-section__field--full">
										<label>Observaciones</label>

										<textarea
											value={updateForm.observations}
											onChange={(e) =>
												setUpdateForm((prev) => ({
													...prev,

													observations: e.target.value,
												}))
											}
										/>
									</div>
								</div>

								<div className="project-tracking-section__actions">
									<button onClick={handleAddUpdate}>
										<span className="material-icons">add</span>

										<span>Agregar al historial</span>
									</button>
								</div>
							</div>

							{/* =========================================
							🔹 HISTORY
							========================================= */}

							<div className="project-tracking-section__history">
								{tracking?.updates?.length ? (
									tracking.updates.map((update: ProjectTrackingUpdateDto) => (
										<div key={update.id} className="project-tracking-section__history-item">
											<div className="project-tracking-section__history-top">
												<strong>{update.changeEndDate ?? '-'}</strong>

												<small>{update.createdAt?.slice(0, 10)}</small>
											</div>

											<p>{update.observations}</p>
										</div>
									))
								) : (
									<div className="project-tracking-section__empty">
										<span className="material-icons">schedule</span>

										<p>No existen desvíos registrados.</p>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default ProjectTrackingAccordion
