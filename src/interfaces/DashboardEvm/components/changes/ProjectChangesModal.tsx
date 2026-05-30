import { FC } from 'react'
import { SectionLoader } from '../../../base/components/loading/SectionLoader'
import { DashboardEvmRowDto } from '../../models/DashboardEvmDTO.m'
import { ChangeRequestDto } from '../../models/ChangeRequestDTO.m'
import { ChangeRequestsTable } from './ChangeRequestsTable'

interface Props {
	selectedRow: DashboardEvmRowDto | null
	changeRequests: ChangeRequestDto[] | null
	loading: boolean
	error: string | null
	onClose: () => void
}

export const ProjectChangesModal: FC<Props> = ({ selectedRow, changeRequests, loading, error, onClose }) => {
	const subtitle = selectedRow ? (selectedRow.code ? `${selectedRow.code} - ${selectedRow.name}` : selectedRow.name) : null

	return (
		<div className="modal-overlay" role="dialog" aria-modal="true">
			<div className="modal changes-modal">
				<header className="modal__header">
					<div className="changes-modal__title">
						<h2>Control de cambios</h2>
						{subtitle && <span className="changes-modal__subtitle">{subtitle}</span>}
					</div>
					<button type="button" onClick={onClose} aria-label="Cerrar">
						✕
					</button>
				</header>

				<section className="modal__body">
					{loading && <SectionLoader text="Cargando control de cambios..." />}

					{!loading && error && <div className="changes-modal__error">{error}</div>}

					{!loading && !error && changeRequests && <ChangeRequestsTable changeRequests={changeRequests} />}
				</section>
			</div>
		</div>
	)
}
