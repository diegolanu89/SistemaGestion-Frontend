// exporters/DotationPdfExporter.ts

import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

import type { TDocumentDefinitions } from 'pdfmake/interfaces'

import { DotationPreviewDto } from '../models/DotacionPreviewDTO.m'
;(pdfMake as typeof pdfMake & { vfs: Record<string, string> }).vfs =
	(pdfFonts as { pdfMake?: { vfs: Record<string, string> }; vfs?: Record<string, string> }).pdfMake?.vfs ??
	(pdfFonts as { vfs?: Record<string, string> }).vfs ??
	{}

export class DotationPdfExporter {
	private static async imageToBase64(url: string): Promise<string> {
		return await new Promise((resolve, reject) => {
			const image = new Image()

			image.crossOrigin = 'anonymous'

			image.onload = () => {
				const canvas = document.createElement('canvas')

				canvas.width = image.width
				canvas.height = image.height

				const context = canvas.getContext('2d')

				if (!context) {
					reject(new Error('Canvas context unavailable'))

					return
				}

				context.drawImage(image, 0, 0)

				resolve(canvas.toDataURL('image/png'))
			}

			image.onerror = reject

			image.src = url
		})
	}

	static async export(preview: DotationPreviewDto, fileName: string, fromDate?: string, toDate?: string): Promise<void> {
		const logo = await this.imageToBase64('/bdt.png')

		const generatedAt = new Date().toLocaleString()

		const totalHours = preview.rows.reduce((acc, row) => acc + row.totalHours, 0)

		const totalCapacity = preview.rows.reduce((acc, row) => acc + row.capacity, 0)

		const totalForecastEtc = preview.rows.reduce((acc, row) => acc + row.forecastEtc, 0)

		const totalFutureCapacity = preview.rows.reduce((acc, row) => acc + row.futureCapacity, 0)

		const totalFutureDifference = preview.rows.reduce((acc, row) => acc + row.futureDifference, 0)

		const clients = new Set(preview.rows.flatMap((row) => row.clients))

		const projects = new Set(preview.rows.flatMap((row) => row.projects))

		const benchCount = preview.rows.filter((row) => row.isBench).length

		const months = preview.rows.length > 0 ? Object.keys(preview.rows[0].months) : []

		const executiveBody: string[][] = [
			['Usuario', 'Líder', 'Rol', 'Horas', 'Capacidad', '% Util.', 'Forecast ETC', 'Cap. Futura', 'Estado'],

			...preview.rows.map((row) => [
				row.userName,
				row.leader,
				row.role,
				row.totalHours.toFixed(1),
				row.capacity.toFixed(1),
				`${row.utilization.toFixed(1)}%`,
				row.forecastEtc.toFixed(1),
				row.futureCapacity.toFixed(1),
				row.status.toUpperCase(),
			]),
		]

		const monthlyBody: string[][] = [
			['Usuario', ...months],

			...preview.rows.map((row) => [
				row.userName,

				...months.map((month) => {
					const value = row.months[month]?.hours ?? 0

					return value.toFixed(1)
				}),
			]),
		]

		const assignmentsBody: string[][] = [
			['Usuario', 'Clientes', 'Proyectos'],

			...preview.rows.map((row) => [row.userName, row.clients.join(', '), row.projects.join(', ')]),
		]

		const documentDefinition: TDocumentDefinitions = {
			pageOrientation: 'landscape',

			pageMargins: [30, 70, 30, 40],

			header: {
				margin: [30, 20, 30, 10],

				columns: [
					[
						{
							text: 'REPORTE DE DOTACIÓN',
							fontSize: 20,
							bold: true,
						},

						{
							text: 'Sistema de Gestión de Proyectos',
							fontSize: 10,
							color: '#666666',
						},
					],

					{
						image: logo,

						width: 70,

						alignment: 'right',
					},
				],
			},

			footer(currentPage, pageCount) {
				return {
					margin: [30, 10, 30, 10],

					columns: [
						{
							text: `Generado: ${generatedAt}`,

							fontSize: 8,
						},

						{
							text: `Página ${currentPage} de ${pageCount}`,

							alignment: 'right',

							fontSize: 8,
						},
					],
				}
			},

			content: [
				{
					text: 'Resumen Ejecutivo',

					style: 'sectionTitle',
				},

				{
					text: `Período: ${fromDate ?? '-'} al ${toDate ?? '-'}`,

					margin: [0, 0, 0, 10],
				},

				{
					table: {
						widths: ['*', '*', '*', '*'],

						body: [
							['Recursos', 'Clientes', 'Proyectos', 'Bench'],

							[String(preview.rows.length), String(clients.size), String(projects.size), String(benchCount)],
						],
					},

					layout: 'lightHorizontalLines',
				},

				{
					margin: [0, 12, 0, 0],

					table: {
						widths: ['*', '*', '*', '*', '*'],

						body: [
							['Horas Totales', 'Capacidad', 'Forecast ETC', 'Capacidad Futura', 'Diferencia Futura'],

							[totalHours.toFixed(1), totalCapacity.toFixed(1), totalForecastEtc.toFixed(1), totalFutureCapacity.toFixed(1), totalFutureDifference.toFixed(1)],
						],
					},

					layout: 'lightHorizontalLines',
				},

				{
					text: 'Dotación Consolidada',

					style: 'sectionTitle',
				},

				{
					table: {
						headerRows: 1,

						widths: [110, 90, 55, 55, 65, 65, 70, 70, 70],

						body: executiveBody,
					},

					layout: 'lightHorizontalLines',
				},

				{
					text: '',

					pageBreak: 'before',
				},

				{
					text: 'Distribución Mensual',

					style: 'sectionTitle',
				},

				{
					table: {
						headerRows: 1,

						body: monthlyBody,
					},

					layout: 'lightHorizontalLines',
				},

				{
					text: '',

					pageBreak: 'before',
				},

				{
					text: 'Clientes y Proyectos por Recurso',

					style: 'sectionTitle',
				},

				{
					table: {
						headerRows: 1,

						widths: [120, 220, '*'],

						body: assignmentsBody,
					},

					layout: 'lightHorizontalLines',
				},
			],

			styles: {
				sectionTitle: {
					fontSize: 14,

					bold: true,

					margin: [0, 14, 0, 10],
				},
			},

			defaultStyle: {
				fontSize: 8,
			},
		}

		const safeFileName = fileName?.trim() || `Reporte_Dotacion_${new Date().toISOString().slice(0, 10)}`

		pdfMake.createPdf(documentDefinition).download(`${safeFileName}.pdf`)
	}
}
