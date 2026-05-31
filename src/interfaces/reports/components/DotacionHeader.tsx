import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { REPORTS_PATHS } from '../routes/paths'

export const DotationHeader: FC = () => {
	const navigate = useNavigate()

	return (
		<div className="dotation-report__header">
			<button type="button" className="dotation-report__back" onClick={() => navigate(REPORTS_PATHS.REPORTS)}>
				<span className="material-icons">arrow_back</span>
			</button>

			<div>
				<h1>Generación de Dotación</h1>

				<p>Visualizá y analizá la dotación consolidada utilizando la misma información utilizada por el Dashboard de Horas.</p>
			</div>
		</div>
	)
}

export default DotationHeader
