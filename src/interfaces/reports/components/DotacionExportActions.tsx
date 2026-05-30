import { FC } from 'react'

import { useReports } from '../hooks/useReport.h'

interface Props {
	disabled?: boolean
}

export const DotationExportActions: FC<Props> = ({ disabled = false }) => {
	const { setIsExportModalOpen } = useReports()

	return (
		<div className="dotation-report__export-actions">
			<div className="dotation-report__export-card">
				<div className="dotation-report__export-info">
					<span className="material-icons">assessment</span>

					<div>
						<h3>Exportación de Reportes</h3>

						<p>Descargá la dotación consolidada en Excel, CSV o PDF.</p>
					</div>
				</div>

				<button type="button" className="dotation-report__export-btn" disabled={disabled} onClick={() => setIsExportModalOpen(true)}>
					<span className="material-icons">download</span>

					<span>Exportar</span>
				</button>
			</div>
		</div>
	)
}

export default DotationExportActions
