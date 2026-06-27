import { FC, useState } from 'react'

import { SectionLoader } from '../../../base/components/loading/SectionLoader'

import { ProjectDto } from '../../models/ProyectViewDTO.m'

import { ChangeRequestDto, ChangeRequestStatus } from '../../models/IChange.m'

import { useProjectChangesController, isApprovalStatus } from '../../hooks/useProjectChangesController.h'

import { useAuth } from '../../../Login/hooks/useAuth.h'

interface Props {
	project: ProjectDto

	open: boolean

	onToggle: () => void
}

const ProjectChangesAccordion: FC<Props> = ({ project, open, onToggle }) => {
	const {
		changeRequests,
		changeRequestsLoading,
		changeRequestsError,

		form,
		setForm,

		totalHours,
		totalCost,

		handleSubmit,
		handleDelete,
		handleEdit,
		handleCancelEdit,

		STATUS_OPTIONS,

		actionMessage,
	} = useProjectChangesController(project.id, open)

	const { user } = useAuth()

	const currentUserName = user?.name ?? ''

	const [deleteModalId, setDeleteModalId] = useState<number | null>(null)

	const [editModalItem, setEditModalItem] = useState<ChangeRequestDto | null>(null)

	/* =====================================================
	🔹 DELETE CONFIRM
	===================================================== */

	const confirmDelete = async () => {
		if (!deleteModalId) return

		await handleDelete(deleteModalId)

		setDeleteModalId(null)
	}

	/* =====================================================
	🔹 EDIT MODAL
	===================================================== */

	const openEditModal = (item: ChangeRequestDto) => {
		handleEdit(item)

		setEditModalItem(item)
	}

	const closeEditModal = () => {
		handleCancelEdit()

		setEditModalItem(null)
	}

	return (
		<>
			<div className={`project-detail-accordion ${open ? 'is-open' : ''}`}>
				<button className="project-detail-accordion__header" onClick={onToggle}>
					<div>
						<strong>Control de cambios</strong>

						<span>Variaciones de alcance y ajustes sobre la línea base.</span>
					</div>

					<span className="material-icons">history</span>
				</button>

				<div className={`project-detail-accordion__content ${open ? 'is-open' : 'is-closed'}`}>
					<div>
						{changeRequestsLoading ? (
							<div className="project-changes-section__loader">
								<SectionLoader text="Cargando controles de cambio..." />
							</div>
						) : (
							<div className="project-changes-section">
								{/* =====================================
								🔹 ERROR
								===================================== */}

								{changeRequestsError && <div className="project-changes-section__error">{changeRequestsError}</div>}

								{/* =====================================
								🔹 SUCCESS
								===================================== */}

								{actionMessage && <div className="project-changes-section__success">{actionMessage}</div>}

								{/* =====================================
								🔹 SUMMARY
								===================================== */}

								<div className="project-changes-section__summary">
									<div className="project-changes-section__summary-card">
										<span>Cambios</span>

										<strong>{changeRequests.length}</strong>
									</div>

									<div className="project-changes-section__summary-card">
										<span>Horas BAC</span>

										<strong>+{totalHours}h</strong>
									</div>

									<div className="project-changes-section__summary-card">
										<span>Costo BAC</span>

										<strong>${totalCost.toLocaleString()}</strong>
									</div>

									<div className="project-changes-section__summary-card">
										<span>BAC Total</span>

										<strong>${(project.bacTotalCost ?? 0).toLocaleString()}</strong>
									</div>
								</div>

								{/* =====================================
								🔹 CREATE FORM
								===================================== */}

								<div className="project-changes-section__card">
									<div className="project-changes-section__card-header">
										<h3>Nuevo control de cambio</h3>

										<span className="material-icons">rule_folder</span>
									</div>

									<div className="project-changes-section__grid">
										<div className="project-changes-section__field">
											<label>Código</label>

											<input
												placeholder="Ej: CR-001"
												value={form.code}
												onChange={(e) =>
													setForm((prev) => ({
														...prev,

														code: e.target.value,
													}))
												}
											/>
										</div>

										<div className="project-changes-section__field">
											<label>Título</label>

											<input
												placeholder="Ej: Ajuste alcance dashboard"
												value={form.title}
												onChange={(e) =>
													setForm((prev) => ({
														...prev,

														title: e.target.value,
													}))
												}
											/>
										</div>

										<div className="project-changes-section__field">
											<label>Solicitado por</label>

											<input value={currentUserName} disabled />
										</div>

										<div className="project-changes-section__field">
											<label>Fecha solicitud</label>

											<input
												type="date"
												value={form.requestedDate ?? ''}
												onChange={(e) =>
													setForm((prev) => ({
														...prev,

														requestedDate: e.target.value,
													}))
												}
											/>
										</div>

										<div className="project-changes-section__field">
											<label>Estado</label>

											<select
												value={form.status}
												onChange={(e) =>
													setForm((prev) => ({
														...prev,

														status: e.target.value as ChangeRequestStatus,
													}))
												}
											>
												{STATUS_OPTIONS.map((status) => (
													<option key={status} value={status}>
														{status}
													</option>
												))}
											</select>
										</div>

										<div className="project-changes-section__field">
											<label>Incremento horas</label>

											<input
												type="number"
												value={form.bacHoursIncrement ?? 0}
												onChange={(e) =>
													setForm((prev) => ({
														...prev,

														bacHoursIncrement: Number(e.target.value),
													}))
												}
											/>
										</div>

										<div className="project-changes-section__field">
											<label>Incremento costo</label>

											<input
												type="number"
												value={form.bacCostIncrement ?? 0}
												onChange={(e) =>
													setForm((prev) => ({
														...prev,

														bacCostIncrement: Number(e.target.value),
													}))
												}
											/>
										</div>

										{isApprovalStatus(form.status) && (
											<>
												<div className="project-changes-section__field">
													<label>Aprobado por</label>

													<input value={currentUserName} disabled />
												</div>

												<div className="project-changes-section__field">
													<label>Fecha aprobación</label>

													<input
														type="date"
														value={form.approvedDate ?? ''}
														onChange={(e) =>
															setForm((prev) => ({
																...prev,

																approvedDate: e.target.value,
															}))
														}
													/>
												</div>
											</>
										)}

										<div className="project-changes-section__field project-changes-section__field--full">
											<label>Descripción</label>

											<textarea
												placeholder="Detalle funcional, impacto esperado y motivo del cambio..."
												value={form.description ?? ''}
												onChange={(e) =>
													setForm((prev) => ({
														...prev,

														description: e.target.value,
													}))
												}
											/>
										</div>
									</div>

									<div className="project-changes-section__actions">
										<button onClick={handleSubmit} data-tooltip="Registrar nuevo control de cambio">
											<span className="material-icons">save</span>

											<span>Registrar cambio</span>
										</button>
									</div>
								</div>

								{/* =====================================
								🔹 HISTORY
								===================================== */}

								<div className="project-changes-section__history">
									{changeRequests.length ? (
										changeRequests.map((item: ChangeRequestDto) => (
											<div key={item.id} className={`project-changes-section__history-item project-changes-section__history-item--${item.status}`}>
												<div className="project-changes-section__history-top">
													<div>
														<strong>{item.code}</strong>

														<h4>{item.title}</h4>
													</div>

													<div className={`project-changes-section__status project-changes-section__status--${item.status}`}>{item.status}</div>
												</div>

												<p>{item.description}</p>

												<div className="project-changes-section__meta">
													<span>
														<strong>Solicitó</strong>

														<small>{item.requestedBy ?? '-'}</small>
													</span>

													<span>
														<strong>Fecha</strong>

														<small>{item.requestedDate}</small>
													</span>

													<span>
														<strong>Horas BAC</strong>

														<small>+{item.bacHoursIncrement ?? 0}h</small>
													</span>

													<span>
														<strong>Costo BAC</strong>

														<small>${(item.bacCostIncrement ?? 0).toLocaleString()}</small>
													</span>

													<span>
														<strong>Aprobó</strong>

														<small>{item.approvedBy ?? '-'}</small>
													</span>
												</div>

												<div className="project-changes-section__history-actions">
													<button onClick={() => openEditModal(item)} data-tooltip="Editar control de cambio">
														<span className="material-icons">edit</span>
													</button>

													<button onClick={() => setDeleteModalId(item.id)} data-tooltip="Eliminar definitivamente">
														<span className="material-icons">delete</span>
													</button>
												</div>
											</div>
										))
									) : (
										<div className="project-changes-section__empty">
											<span className="material-icons">history_toggle_off</span>

											<p>No existen controles de cambio registrados.</p>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* =====================================================
			🔹 DELETE MODAL
			===================================================== */}

			{deleteModalId && (
				<div className="project-changes-modal">
					<div className="project-changes-modal__content">
						<span className="material-icons">warning</span>

						<h3>Eliminar control de cambio</h3>

						<p>Esta acción eliminará definitivamente el registro histórico seleccionado.</p>

						<div className="project-changes-modal__actions">
							<button onClick={() => setDeleteModalId(null)}>Cancelar</button>

							<button className="is-danger" onClick={confirmDelete}>
								Eliminar
							</button>
						</div>
					</div>
				</div>
			)}

			{/* =====================================================
			🔹 EDIT MODAL
			===================================================== */}

			{editModalItem && (
				<div className="project-changes-modal">
					<div className="project-changes-modal__content project-changes-modal__content--large">
						<div className="project-changes-modal__header">
							<h3>Editar control de cambio</h3>

							<button onClick={closeEditModal}>
								<span className="material-icons">close</span>
							</button>
						</div>

						<div className="project-changes-section__grid">
							<div className="project-changes-section__field">
								<label>Código</label>

								<input
									value={form.code}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,

											code: e.target.value,
										}))
									}
								/>
							</div>

							<div className="project-changes-section__field">
								<label>Título</label>

								<input
									value={form.title}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,

											title: e.target.value,
										}))
									}
								/>
							</div>

							<div className="project-changes-section__field">
								<label>Solicitado por</label>

								<input value={form.requestedBy || currentUserName} disabled />
							</div>

							<div className="project-changes-section__field">
								<label>Fecha solicitud</label>

								<input
									type="date"
									value={form.requestedDate ?? ''}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,

											requestedDate: e.target.value,
										}))
									}
								/>
							</div>

							<div className="project-changes-section__field">
								<label>Estado</label>

								<select
									value={form.status}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,

											status: e.target.value as ChangeRequestStatus,
										}))
									}
								>
									{STATUS_OPTIONS.map((status) => (
										<option key={status} value={status}>
											{status}
										</option>
									))}
								</select>
							</div>

							<div className="project-changes-section__field">
								<label>Incremento horas</label>

								<input
									type="number"
									value={form.bacHoursIncrement ?? 0}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,

											bacHoursIncrement: Number(e.target.value),
										}))
									}
								/>
							</div>

							<div className="project-changes-section__field">
								<label>Incremento costo</label>

								<input
									type="number"
									value={form.bacCostIncrement ?? 0}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,

											bacCostIncrement: Number(e.target.value),
										}))
									}
								/>
							</div>

							{isApprovalStatus(form.status) && (
								<>
									<div className="project-changes-section__field">
										<label>Aprobado por</label>

										<input value={form.approvedBy || currentUserName} disabled />
									</div>

									<div className="project-changes-section__field">
										<label>Fecha aprobación</label>

										<input
											type="date"
											value={form.approvedDate ?? ''}
											onChange={(e) =>
												setForm((prev) => ({
													...prev,

													approvedDate: e.target.value,
												}))
											}
										/>
									</div>
								</>
							)}

							<div className="project-changes-section__field project-changes-section__field--full">
								<label>Descripción</label>

								<textarea
									value={form.description ?? ''}
									onChange={(e) =>
										setForm((prev) => ({
											...prev,

											description: e.target.value,
										}))
									}
								/>
							</div>
						</div>

						<div className="project-changes-modal__actions">
							<button onClick={closeEditModal}>Cancelar</button>

							<button
								className="is-primary"
								onClick={async () => {
									const ok = await handleSubmit()

									if (ok) closeEditModal()
								}}
							>
								Guardar cambios
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default ProjectChangesAccordion
