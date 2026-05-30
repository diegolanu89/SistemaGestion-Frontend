// exporters/DotationCsvExporter.ts

import { DotationPreviewDto } from '../models/DotacionPreviewDTO.m'

export class DotationCsvExporter {
	static export(preview: DotationPreviewDto, fileName: string): void {
		const rows = preview.rows

		const generatedAt = new Date().toLocaleString()

		const months = rows.length > 0 ? Object.keys(rows[0].months) : []

		const headers = [
			'Usuario',
			'Lider',
			'Rol',
			'Estado',
			'Bench',
			'Horas',
			'Capacidad',
			'Utilizacion (%)',
			'Desvio',
			'Forecast ETC',
			'Capacidad Futura',
			'Diferencia Futura',
			'Cantidad Clientes',
			'Cantidad Proyectos',
			'Clientes',
			'Proyectos',

			...months,
		]

		const csvRows = rows.map((row) => [
			row.userName,
			row.leader,
			row.role,
			row.status,
			row.isBench ? 'SI' : 'NO',

			row.totalHours.toFixed(1),
			row.capacity.toFixed(1),
			row.utilization.toFixed(1),
			row.deviation.toFixed(1),

			row.forecastEtc.toFixed(1),
			row.futureCapacity.toFixed(1),
			row.futureDifference.toFixed(1),

			row.clients.length,
			row.projects.length,

			row.clients.join(' | '),
			row.projects.join(' | '),

			...months.map((month) => {
				const value = row.months[month]?.hours ?? 0

				return value.toFixed(1)
			}),
		])

		const metadataRows = [['Reporte', 'Dotación Consolidada'], ['Generado', generatedAt], []]

		const content = [...metadataRows, headers, ...csvRows].map((row) => row.map((value) => `"${String(value ?? '')}"`).join(',')).join('\n')

		const blob = new Blob([content], {
			type: 'text/csv;charset=utf-8;',
		})

		const url = URL.createObjectURL(blob)

		const link = document.createElement('a')

		link.href = url

		const safeFileName = fileName?.trim() || `Reporte_Dotacion_${new Date().toISOString().slice(0, 10)}`

		link.download = `${safeFileName}.csv`

		link.click()

		URL.revokeObjectURL(url)
	}
}
