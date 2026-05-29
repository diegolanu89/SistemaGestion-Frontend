import { FC, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { REPORTS_PATHS } from '../routes/paths'

import { useDotationReportController } from '../hooks/useDotacionReprot.h'

import DotationReportTable from '../components/DotationReportTable'

export const DotationReport: FC = () => {
	const navigate = useNavigate()

	const { loading, reportData, summary, generatePreview } = useDotationReportController()

	const [fromDate, setFromDate] = useState('')

	const [toDate, setToDate] = useState('')

	const isValidRange = useMemo(() => {
		if (!fromDate || !toDate) {
			return false
		}

		return new Date(fromDate) <= new Date(toDate)
	}, [fromDate, toDate])

	const buildMonthKeys = (): string[] => {
		if (!isValidRange) {
			return []
		}

		const result: string[] = []

		const start = new Date(fromDate)

		const end = new Date(toDate)

		const current = new Date(start)

		while (current <= end) {
			const year = current.getFullYear()

			const month = String(current.getMonth() + 1).padStart(2, '0')

			result.push(`${year}-${month}`)

			current.setMonth(current.getMonth() + 1)
		}

		return result
	}

	const handleGenerate = async () => {
		await generatePreview(buildMonthKeys())
	}

	return (
		<div className="dotation-report">
			<div className="dotation-report__header">
				<button type="button" className="dotation-report__back" onClick={() => navigate(REPORTS_PATHS.REPORTS)}>
					<span className="material-icons">arrow_back</span>
				</button>

				<div>
					<h1>Generación de Dotación</h1>

					<p>Visualizá y analizá la dotación consolidada utilizando la misma información utilizada por el Dashboard de Horas.</p>
				</div>
			</div>

			<div className="dotation-report__filters-card">
				<div className="dotation-report__field">
					<label>Fecha Desde</label>

					<div className="dotation-report__date-input">
						<span className="material-icons">calendar_month</span>

						<input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
					</div>
				</div>

				<div className="dotation-report__field">
					<label>Fecha Hasta</label>

					<div className="dotation-report__date-input">
						<span className="material-icons">calendar_month</span>

						<input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
					</div>
				</div>

				<button type="button" className="dotation-report__generate" onClick={() => void handleGenerate()} disabled={!isValidRange || loading}>
					<span className="material-icons">analytics</span>

					<span>{loading ? 'Generando vista previa...' : 'Generar Vista Previa'}</span>
				</button>
			</div>

			{reportData && summary && (
				<>
					<div className="dotation-report__summary">
						<div className="dotation-report__metric">
							<span className="material-icons">groups</span>

							<div>
								<strong>{summary.users}</strong>

								<span>Usuarios</span>
							</div>
						</div>

						<div className="dotation-report__metric">
							<span className="material-icons">folder</span>

							<div>
								<strong>{summary.projects}</strong>

								<span>Proyectos</span>
							</div>
						</div>

						<div className="dotation-report__metric">
							<span className="material-icons">business</span>

							<div>
								<strong>{summary.clients}</strong>

								<span>Clientes</span>
							</div>
						</div>

						<div className="dotation-report__metric">
							<span className="material-icons">schedule</span>

							<div>
								<strong>{summary.totalHours.toFixed(0)}</strong>

								<span>Horas</span>
							</div>
						</div>

						<div className="dotation-report__metric">
							<span className="material-icons">inventory_2</span>

							<div>
								<strong>{summary.availability.toFixed(0)}</strong>

								<span>Disponibilidad</span>
							</div>
						</div>

						<div className="dotation-report__metric">
							<span className="material-icons">trending_up</span>

							<div>
								<strong>{summary.need.toFixed(0)}</strong>

								<span>Necesidad</span>
							</div>
						</div>

						<div className={`dotation-report__metric ${summary.difference >= 0 ? 'is-positive' : 'is-negative'}`}>
							<span className="material-icons">{summary.difference >= 0 ? 'check_circle' : 'warning'}</span>

							<div>
								<strong>{summary.difference.toFixed(0)}</strong>

								<span>Diferencia</span>
							</div>
						</div>

						<div className="dotation-report__metric">
							<span className="material-icons">person</span>

							<div>
								<strong>{summary.fte}</strong>

								<span>FTE</span>
							</div>
						</div>
					</div>

					<DotationReportTable reportData={reportData} />
				</>
			)}
		</div>
	)
}

export default DotationReport
