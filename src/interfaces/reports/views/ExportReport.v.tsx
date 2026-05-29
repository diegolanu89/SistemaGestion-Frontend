// views/ExportReport.v.tsx

import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { REPORTS_PATHS } from '../routes/paths'

export const ExportReport: FC = () => {
	const navigate = useNavigate()

	return (
		<div className="export-report">
			<div className="export-report__header">
				<button type="button" className="export-report__back" onClick={() => navigate(REPORTS_PATHS.REPORTS)}>
					<span className="material-icons">arrow_back</span>

					<span>Volver</span>
				</button>

				<div>
					<h1>Exportación</h1>

					<p>Exporta información consolidada para análisis externos.</p>
				</div>
			</div>

			<div className="export-report__content">
				<div className="export-report__card">
					<span className="material-icons">file_download</span>

					<h2>Exportar Información</h2>

					<p>Genera archivos para consumo externo y análisis de información.</p>

					<button type="button">
						<span className="material-icons">download</span>

						<span>Exportar</span>
					</button>
				</div>
			</div>
		</div>
	)
}

export default ExportReport
