import { useState } from 'react'
import { useProyectContext } from '../hooks/useProyectContext.h'
import { PROYECT_CONFIG } from '../models/ProyectConfig.m'
import { ProjectIntakeRecordDto } from '../models/ProyectDTO.m'

type ColumnKey = 'projectName' | 'observations' | 'projectStatusCode' | 'categoryCode' | 'projectType'

const INITIAL_COLUMNS: { key: ColumnKey; label: string }[] = [
	{ key: 'projectName', label: PROYECT_CONFIG.TABLE.HEADERS[0] },
	{ key: 'observations', label: PROYECT_CONFIG.TABLE.HEADERS[1] },
	{ key: 'projectStatusCode', label: PROYECT_CONFIG.TABLE.HEADERS[2] },
	{ key: 'categoryCode', label: PROYECT_CONFIG.TABLE.HEADERS[3] },
	{ key: 'projectType', label: PROYECT_CONFIG.TABLE.HEADERS[4] },
]

export const ProyectTable = () => {
	const { filtered, loading } = useProyectContext()

	const [columns, setColumns] = useState(INITIAL_COLUMNS)
	const [dragIndex, setDragIndex] = useState<number | null>(null)

	const handleDragStart = (index: number) => {
		setDragIndex(index)
	}

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
	}

	const handleDrop = (index: number) => {
		if (dragIndex === null) return

		const updated = [...columns]
		const [moved] = updated.splice(dragIndex, 1)
		updated.splice(index, 0, moved)

		setColumns(updated)
		setDragIndex(null)
	}

	const handleEdit = (id: number) => {
		console.log('edit', id)
	}

	const handleDelete = (id: number) => {
		console.log('delete', id)
	}

	const renderCell = (p: ProjectIntakeRecordDto, key: ColumnKey) => {
		const value = p[key]

		if (value === null || value === undefined) return '-'

		return value
	}

	if (loading) {
		return <div className="proyect-table__empty">Cargando...</div>
	}

	return (
		<table className="proyect-table">
			<thead>
				<tr>
					{columns.map((col, index) => (
						<th
							key={col.key}
							draggable
							onDragStart={() => handleDragStart(index)}
							onDragOver={handleDragOver}
							onDrop={() => handleDrop(index)}
							className="proyect-table__draggable"
						>
							{col.label}
						</th>
					))}
					<th className="proyect-table__actions-header"></th>
				</tr>
			</thead>

			<tbody>
				{filtered.map((p) => (
					<tr key={p.id}>
						{columns.map((col) => (
							<td key={col.key}>{renderCell(p, col.key)}</td>
						))}

						<td className="proyect-table__actions">
							<button
								className="proyect-table__action proyect-table__action--edit"
								onClick={() => handleEdit(p.id)}
								data-tooltip={PROYECT_CONFIG.TABLE.ACTIONS.EDIT_TOOLTIP}
							>
								<span className="material-icons">{PROYECT_CONFIG.TABLE.ACTIONS.EDIT_ICON}</span>
							</button>

							<button
								className="proyect-table__action proyect-table__action--delete"
								onClick={() => handleDelete(p.id)}
								data-tooltip={PROYECT_CONFIG.TABLE.ACTIONS.DELETE_TOOLTIP}
							>
								<span className="material-icons">{PROYECT_CONFIG.TABLE.ACTIONS.DELETE_ICON}</span>
							</button>
						</td>
					</tr>
				))}

				{filtered.length === 0 && (
					<tr>
						<td colSpan={columns.length + 1}>{PROYECT_CONFIG.TEXTS.EMPTY}</td>
					</tr>
				)}
			</tbody>
		</table>
	)
}
