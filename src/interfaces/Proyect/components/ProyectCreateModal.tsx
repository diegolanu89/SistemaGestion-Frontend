import { FC } from 'react'
import { useProyectContext } from '../hooks/useProyectContext.h'
import { ProyectCreateForm } from './ProyectCreateForm'
import { PROYECT_CONFIG } from '../models/ProyectConfig.m'
import { ActionAlert } from '../../base/components/alert/ActionAlert'
import { SectionLoader } from '../../base/components/loading/SectionLoader'

export const ProyectCreateModal: FC = () => {
	const { closeCreate, createStatus } = useProyectContext()

	const { CREATE } = PROYECT_CONFIG
	const submitting = createStatus === 'loading'

	return (
		<>
			<ActionAlert />

			<div className="modal-overlay">
				<div className="modal">
					<header className="modal__header">
						<h2>{CREATE.MODAL.TITLE}</h2>
						<button onClick={closeCreate} disabled={submitting} aria-label={CREATE.MODAL.CLOSE_ARIA_LABEL} title={CREATE.MODAL.CLOSE_TOOLTIP}>
							✕
						</button>
					</header>

					<section className="modal__body">
						<ProyectCreateForm />

						{submitting && <SectionLoader text="Creando proyecto…" />}
					</section>
				</div>
			</div>
		</>
	)
}
