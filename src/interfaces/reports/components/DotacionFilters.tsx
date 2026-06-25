import { FC } from 'react'

interface Props {
	fromDate: string

	toDate: string

	loading: boolean

	isValidRange: boolean

	onFromDateChange: (value: string) => void

	onToDateChange: (value: string) => void

	onGenerate: () => void
}

export const DotationFilters: FC<Props> = ({ fromDate, toDate, loading, isValidRange, onFromDateChange, onToDateChange, onGenerate }) => {
	return (
		<div className="dotation-report__filters-card">
			<div className="dotation-report__field">
				<label>Fecha Desde</label>

				<label className="dotation-report__date-input">
					<span className="material-icons">calendar_month</span>

					<input type="date" value={fromDate} onChange={(event) => onFromDateChange(event.target.value)} />
				</label>
			</div>

			<div className="dotation-report__field">
				<label>Fecha Hasta</label>

				<label className="dotation-report__date-input">
					<span className="material-icons">calendar_month</span>

					<input type="date" value={toDate} onChange={(event) => onToDateChange(event.target.value)} />
				</label>
			</div>

			<button type="button" className="dotation-report__generate" onClick={onGenerate} disabled={!isValidRange || loading}>
				<span className="material-icons">analytics</span>

				<span>{loading ? 'Generando vista previa...' : 'Generar Vista Previa'}</span>
			</button>
		</div>
	)
}

export default DotationFilters
