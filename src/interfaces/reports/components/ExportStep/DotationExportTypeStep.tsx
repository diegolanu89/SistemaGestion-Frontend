// components/DotationExportTypeStep.tsx

import { FC } from 'react'

interface Props {
	onSelect: (type: 'excel' | 'csv' | 'pdf') => void
}

export const DotationExportTypeStep: FC<Props> = ({ onSelect }) => {
	return (
		<div className="dotation-export-modal__content">
			<button type="button" className="dotation-export-modal__option is-excel" onClick={() => onSelect('excel')}>
				<span className="material-icons">table_view</span>

				<div>
					<strong>Excel (.xlsx)</strong>

					<span>Exportación completa para análisis y seguimiento</span>
				</div>
			</button>

			<button type="button" className="dotation-export-modal__option is-csv" onClick={() => onSelect('csv')}>
				<span className="material-icons">description</span>

				<div>
					<strong>CSV (.csv)</strong>

					<span>Compatible con Excel, Power BI y otras herramientas</span>
				</div>
			</button>

			<button type="button" className="dotation-export-modal__option is-pdf" onClick={() => onSelect('pdf')}>
				<span className="material-icons">picture_as_pdf</span>

				<div>
					<strong>PDF (.pdf)</strong>

					<span>Documento listo para compartir o presentar</span>
				</div>
			</button>
		</div>
	)
}

export default DotationExportTypeStep
