// components/ProyectEditModal.tsx

import { FC } from 'react'
import { useProyectContext } from '../hooks/useProyectContext.h'
import { ActionAlert } from '../../base/components/alert/ActionAlert'
import { SectionLoader } from '../../base/components/loading/SectionLoader'
import { ProyectEditForm } from './ProyectEditForm'

export const ProyectEditModal: FC = () => {
	const { closeEdit, editStatus } = useProyectContext()

	const submitting = editStatus === 'loading'

	return (
		<>
			<ActionAlert />

			<div className="modal-overlay">
				<div className="modal">
					<header className="modal__header">
						<h2>Editar Proyecto</h2>

						<button onClick={closeEdit} disabled={submitting}>
							✕
						</button>
					</header>

					<section className="modal__body">
						<ProyectEditForm />

						{submitting && <SectionLoader text="Actualizando proyecto…" />}
					</section>
				</div>
			</div>
		</>
	)
}
