// exporters/DotationExcelExporter.ts

import ExcelJS from 'exceljs'

import { DotationPreviewDto } from '../models/DotacionPreviewDTO.m'

export class DotationExcelExporter {
	static async export(preview: DotationPreviewDto, fileName: string): Promise<void> {
		const workbook = new ExcelJS.Workbook()

		workbook.creator = 'Sistema de Gestión de Proyectos'

		workbook.created = new Date()

		const generatedAt = new Date().toLocaleString()

		const rows = preview.rows

		const months = rows.length > 0 ? Object.keys(rows[0].months) : []

		const totalHours = rows.reduce((acc, row) => acc + row.totalHours, 0)

		const totalCapacity = rows.reduce((acc, row) => acc + row.capacity, 0)

		const totalForecastEtc = rows.reduce((acc, row) => acc + row.forecastEtc, 0)

		const totalFutureCapacity = rows.reduce((acc, row) => acc + row.futureCapacity, 0)

		const totalFutureDifference = rows.reduce((acc, row) => acc + row.futureDifference, 0)

		const clients = new Set(rows.flatMap((row) => row.clients))

		const projects = new Set(rows.flatMap((row) => row.projects))

		const benchCount = rows.filter((row) => row.isBench).length

		// =====================================================
		// RESUMEN
		// =====================================================

		const summarySheet = workbook.addWorksheet('Resumen')

		summarySheet.columns = [
			{
				width: 35,
			},
			{
				width: 25,
			},
		]

		summarySheet.addRow(['Reporte', 'Dotación Consolidada'])

		summarySheet.addRow(['Generado', generatedAt])

		summarySheet.addRow([])

		summarySheet.addRow(['Recursos', rows.length])

		summarySheet.addRow(['Clientes', clients.size])

		summarySheet.addRow(['Proyectos', projects.size])

		summarySheet.addRow(['Bench', benchCount])

		summarySheet.addRow([])

		summarySheet.addRow(['Horas Totales', totalHours])

		summarySheet.addRow(['Capacidad Total', totalCapacity])

		summarySheet.addRow(['Forecast ETC', totalForecastEtc])

		summarySheet.addRow(['Capacidad Futura', totalFutureCapacity])

		summarySheet.addRow(['Diferencia Futura', totalFutureDifference])

		summarySheet.getRow(1).font = {
			bold: true,
			size: 16,
		}

		// =====================================================
		// DOTACION
		// =====================================================

		const worksheet = workbook.addWorksheet('Dotacion')

		worksheet.columns = [
			{ header: 'Usuario', key: 'userName', width: 30 },

			{ header: 'Lider', key: 'leader', width: 25 },

			{ header: 'Rol', key: 'role', width: 15 },

			{ header: 'Estado', key: 'status', width: 15 },

			{ header: 'Bench', key: 'bench', width: 12 },

			{ header: 'Horas', key: 'totalHours', width: 15 },

			{ header: 'Capacidad', key: 'capacity', width: 15 },

			{ header: '% Utilizacion', key: 'utilization', width: 15 },

			{ header: 'Desvio', key: 'deviation', width: 15 },

			{ header: 'Forecast ETC', key: 'forecastEtc', width: 15 },

			{ header: 'Capacidad Futura', key: 'futureCapacity', width: 18 },

			{ header: 'Dif. Futura', key: 'futureDifference', width: 15 },

			{ header: 'Clientes', key: 'clients', width: 40 },

			{ header: 'Proyectos', key: 'projects', width: 50 },
		]

		rows.forEach((row) => {
			worksheet.addRow({
				userName: row.userName,

				leader: row.leader,

				role: row.role,

				status: row.status,

				bench: row.isBench ? 'SI' : 'NO',

				totalHours: row.totalHours,

				capacity: row.capacity,

				utilization: row.utilization,

				deviation: row.deviation,

				forecastEtc: row.forecastEtc,

				futureCapacity: row.futureCapacity,

				futureDifference: row.futureDifference,

				clients: row.clients.join(', '),

				projects: row.projects.join(', '),
			})
		})

		worksheet.getRow(1).font = {
			bold: true,
		}

		// =====================================================
		// DISTRIBUCION MENSUAL
		// =====================================================

		const monthlySheet = workbook.addWorksheet('Mensual')

		monthlySheet.columns = [
			{
				header: 'Usuario',
				key: 'userName',
				width: 30,
			},

			...months.map((month) => ({
				header: month,
				key: month,
				width: 15,
			})),
		]

		rows.forEach((row) => {
			const monthlyRow: Record<string, string | number> = {
				userName: row.userName,
			}

			months.forEach((month) => {
				monthlyRow[month] = row.months[month]?.hours ?? 0
			})

			monthlySheet.addRow(monthlyRow)
		})

		monthlySheet.getRow(1).font = {
			bold: true,
		}

		// =====================================================
		// ASIGNACIONES
		// =====================================================

		const assignmentSheet = workbook.addWorksheet('Asignaciones')

		assignmentSheet.columns = [
			{
				header: 'Usuario',
				key: 'userName',
				width: 30,
			},

			{
				header: 'Clientes',
				key: 'clients',
				width: 50,
			},

			{
				header: 'Proyectos',
				key: 'projects',
				width: 70,
			},
		]

		rows.forEach((row) => {
			assignmentSheet.addRow({
				userName: row.userName,

				clients: row.clients.join(', '),

				projects: row.projects.join(', '),
			})
		})

		assignmentSheet.getRow(1).font = {
			bold: true,
		}

		const buffer = await workbook.xlsx.writeBuffer()

		const blob = new Blob([buffer])

		const url = URL.createObjectURL(blob)

		const link = document.createElement('a')

		link.href = url

		const safeFileName = fileName?.trim() || `Reporte_Dotacion_${new Date().toISOString().slice(0, 10)}`

		link.download = `${safeFileName}.xlsx`

		link.click()

		URL.revokeObjectURL(url)
	}
}
