import { useState, useMemo } from 'react'
import { useProyectContext } from '../hooks/useProyectContext.h'
import { PROYECT_CONFIG } from '../models/ProyectConfig.m'
import { ProjectIntakeRecordDto } from '../models/ProyectDTO.m'

type SortDirection = 'asc' | 'desc'

type ColumnConfig = {
	key: string
	label: string
	getValue: (p: ProjectIntakeRecordDto) => string
}

const INITIAL_COLUMNS: ColumnConfig[] = [
	{
		key: 'clockify',
		label: PROYECT_CONFIG.TABLE.HEADERS_CLOCKIFY ?? 'Clockify',
		getValue: (p) => (p.ClockifyRecordId ? '1' : '0'),
	},
	{
		key: 'projectName',
		label: PROYECT_CONFIG.TABLE.HEADERS[0],
		getValue: (p) => p.ProjectName ?? '',
	},
	{
		key: 'clientName',
		label: PROYECT_CONFIG.TABLE.HEADERS[1],
		getValue: (p) => p.ClientName ?? 'Sin cliente',
	},
	{
		key: 'observations',
		label: PROYECT_CONFIG.TABLE.HEADERS[2],
		getValue: (p) => p.Observations ?? '',
	},
	{
		key: 'projectStatusCode',
		label: PROYECT_CONFIG.TABLE.HEADERS[3],
		getValue: (p) => p.StatusRef?.Label ?? p.ProjectStatusCode ?? '',
	},
	{
		key: 'categoryCode',
		label: PROYECT_CONFIG.TABLE.HEADERS[4],
		getValue: (p) => p.CategoryRef?.Label ?? p.CategoryCode ?? '',
	},
	{
		key: 'projectType',
		label: PROYECT_CONFIG.TABLE.HEADERS[5],
		getValue: (p) => p.TypeRef?.Label ?? p.ProjectType ?? '',
	},
]

export const ProyectTable = () => {
	const { filtered, loading, openEdit, openDelete } = useProyectContext()

	const [columns, setColumns] = useState(INITIAL_COLUMNS)
	const [dragIndex, setDragIndex] = useState<number | null>(null)
	const [hoveredColumn, setHoveredColumn] = useState<number | null>(null)

	const [sortKey, setSortKey] = useState<string | null>(null)
	const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

	const handleSort = (key: string) => {
		if (sortKey === key) {
			setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
		} else {
			setSortKey(key)
			setSortDirection('asc')
		}
	}

	const handleDelete = (project: ProjectIntakeRecordDto) => {
		openDelete(project)
	}

	const sortedData = useMemo(() => {
		if (!sortKey) return filtered

		const column = columns.find((c) => c.key === sortKey)
		if (!column) return filtered

		return [...filtered].sort((a, b) => {
			const aVal = column.getValue(a).toLowerCase()
			const bVal = column.getValue(b).toLowerCase()

			if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
			if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
			return 0
		})
	}, [filtered, sortKey, sortDirection, columns])

	const handleDragStart = (index: number) => setDragIndex(index)

	const handleDragOver = (e: React.DragEvent) => e.preventDefault()

	const handleDrop = (index: number) => {
		if (dragIndex === null) return

		const updated = [...columns]
		const [moved] = updated.splice(dragIndex, 1)
		updated.splice(index, 0, moved)

		setColumns(updated)
		setDragIndex(null)
	}

	const handleEdit = (project: ProjectIntakeRecordDto) => openEdit(project)

	const renderCell = (p: ProjectIntakeRecordDto, col: ColumnConfig) => {
		if (col.key === 'clockify') {
			const isInClockify = !!p.ClockifyRecordId

			return (
				<span className="proyect-table__clockify" data-tooltip={isInClockify ? 'En Clockify' : 'No vinculado a Clockify'}>
					<span
						className="material-icons"
						style={{
							color: isInClockify ? '#22c55e' : '#9ca3af',
							fontSize: '18px',
						}}
					>
						schedule
					</span>
				</span>
			)
		}

		const value = col.getValue(p)
		return value || '-'
	}

	if (loading) return <div className="proyect-table__empty">Cargando...</div>

	return (
		<table className="proyect-table">
			<thead>
				<tr>
					{columns.map((col, index) => (
						<th
							key={col.key}
							draggable
							onClick={() => handleSort(col.key)}
							onDragStart={() => handleDragStart(index)}
							onDragOver={handleDragOver}
							onDrop={() => handleDrop(index)}
							onMouseEnter={() => setHoveredColumn(index)}
							onMouseLeave={() => setHoveredColumn(null)}
							className={hoveredColumn === index ? 'is-hovered' : ''}
						>
							{col.label}
							{sortKey === col.key && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
						</th>
					))}
					<th className="proyect-table__actions-header" />
				</tr>
			</thead>

			<tbody>
				{sortedData.map((p) => (
					<tr key={p.Id}>
						{columns.map((col, index) => (
							<td key={col.key} className={hoveredColumn === index ? 'is-hovered' : ''}>
								{renderCell(p, col)}
							</td>
						))}

						<td className="proyect-table__actions">
							<button
								className="proyect-table__action proyect-table__action--edit"
								onClick={() => handleEdit(p)}
								data-tooltip={PROYECT_CONFIG.TABLE.ACTIONS.EDIT_TOOLTIP}
							>
								<span className="material-icons">{PROYECT_CONFIG.TABLE.ACTIONS.EDIT_ICON}</span>
							</button>

							<button
								className="proyect-table__action proyect-table__action--delete"
								onClick={() => handleDelete(p)}
								data-tooltip={PROYECT_CONFIG.TABLE.ACTIONS.DELETE_TOOLTIP}
							>
								<span className="material-icons">{PROYECT_CONFIG.TABLE.ACTIONS.DELETE_ICON}</span>
							</button>
						</td>
					</tr>
				))}

				{sortedData.length === 0 && (
					<tr>
						<td colSpan={columns.length + 1}>{PROYECT_CONFIG.TEXTS.EMPTY}</td>
					</tr>
				)}
			</tbody>
		</table>
	)
}
