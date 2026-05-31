// components/DotationExportConfigurationStep.tsx

import { FC } from 'react'

interface Props {
	fileName: string

	exportType: 'excel' | 'csv' | 'pdf'

	onFileNameChange: (value: string) => void

	onBack: () => void

	onExport: () => void
}

export const DotationExportConfigurationStep: FC<Props> = ({ fileName, exportType, onFileNameChange, onBack, onExport }) => {
	return (
		<div className="dotation-export-modal__configuration">
			<div className="dotation-export-modal__step">
				<span className="dotation-export-modal__step-label">Paso 2 de 2</span>

				<h3>Configuración de Exportación</h3>

				<p>Definí el nombre del archivo antes de generar el reporte.</p>
			</div>

			<div className="dotation-export-modal__field">
				<label htmlFor="dotation-file-name">Nombre del archivo</label>

				<input
					id="dotation-file-name"
					type="text"
					value={fileName}
					onChange={(event) => onFileNameChange(event.target.value)}
					placeholder="Nombre del reporte"
				/>
			</div>

			<div className="dotation-export-modal__field">
				<label>Formato seleccionado</label>

				<div className="dotation-export-modal__selected-format">
					<span className="material-icons">{exportType === 'excel' ? 'table_view' : exportType === 'csv' ? 'description' : 'picture_as_pdf'}</span>

					<span>
						{exportType === 'excel' && 'Excel (.xlsx)'}
						{exportType === 'csv' && 'CSV (.csv)'}
						{exportType === 'pdf' && 'PDF (.pdf)'}
					</span>
				</div>
			</div>

			<div className="dotation-export-modal__footer">
				<button type="button" className="dotation-export-modal__secondary" onClick={onBack}>
					<span className="material-icons">arrow_back</span>

					<span>Volver</span>
				</button>

				<button type="button" className="dotation-export-modal__primary" onClick={onExport} disabled={!fileName.trim()}>
					<span className="material-icons">download</span>

					<span>Exportar</span>
				</button>
			</div>
		</div>
	)
}

export default DotationExportConfigurationStep
