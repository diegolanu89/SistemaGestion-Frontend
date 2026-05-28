// components/AddProjectsModal.tsx

import { ChangeEvent, FC } from 'react'

import SelectableProjectList from './SelectableProjectList'

import ProjectAssignmentFilters from './ProjectAssignmentFilters'

import { useProjectAssignment } from '../hooks/useProjectAsignment.h'

interface Props {
	open: boolean

	onClose: () => void
}

const AddProjectsModal: FC<Props> = ({ open, onClose }) => {
	const {
		search,
		setSearch,

		code,
		setCode,

		selectedUserIds,
		selectedProject,

		setLoading,
	} = useProjectAssignment()

	// =========================================================
	// 🔹 EVENTS
	// =========================================================

	const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
		setCode(event.target.value)
	}

	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value)
	}

	const handleSave = async () => {
		try {
			setLoading(true)

			console.log('[PROJECT_ASSIGNMENT] save assignment', {
				project: selectedProject,
				users: selectedUserIds,
			})

			// TODO:
			// await proyectViewAdapter.assignVisibleUsers(...)
		} finally {
			setLoading(false)

			onClose()
		}
	}

	// =========================================================
	// 🔹 GUARD
	// =========================================================

	if (!open) {
		return null
	}

	// =========================================================
	// 🔹 RENDER
	// =========================================================

	return (
		<div className="add-projects-modal">
			<div className="add-projects-modal__backdrop" onClick={onClose} />

			<div className="add-projects-modal__content">
				{/* ===================================================== */}
				{/* 🔹 HEADER */}
				{/* ===================================================== */}

				<div className="add-projects-modal__header">
					<div>
						<h2>Agregar proyectos</h2>

						<p>Seleccioná uno o varios proyectos para agregar.</p>
					</div>

					<button type="button" onClick={onClose}>
						<span className="material-icons">close</span>
					</button>
				</div>

				{/* ===================================================== */}
				{/* 🔹 FILTERS */}
				{/* ===================================================== */}

				<ProjectAssignmentFilters />

				{/* ===================================================== */}
				{/* 🔹 SEARCH */}
				{/* ===================================================== */}

				<div className="add-projects-modal__search">
					<div className="add-projects-modal__search-field">
						<span className="material-icons">tag</span>

						<input type="text" placeholder="Buscar por código" value={code} onChange={handleCodeChange} />
					</div>

					<div className="add-projects-modal__search-field">
						<span className="material-icons">search</span>

						<input type="text" placeholder="Buscar por nombre" value={search} onChange={handleSearchChange} />
					</div>
				</div>

				{/* ===================================================== */}
				{/* 🔹 LIST */}
				{/* ===================================================== */}

				<SelectableProjectList />

				{/* ===================================================== */}
				{/* 🔹 FOOTER */}
				{/* ===================================================== */}

				<div className="add-projects-modal__footer">
					<button type="button" className="add-projects-modal__save" onClick={handleSave}>
						<span className="material-icons">save</span>

						<span>Guardar proyectos</span>
					</button>
				</div>
			</div>
		</div>
	)
}

export default AddProjectsModal
