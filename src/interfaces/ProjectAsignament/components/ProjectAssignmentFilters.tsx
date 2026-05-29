// components/ProjectAssignmentFilters.tsx

import { FC } from 'react'

import { useProjectAssignment } from '../hooks/useProjectAsignment.h'

import { ProjectAssignmentFilter } from '../models/IProjectAsignment.m'

const ProjectAssignmentFilters: FC = () => {
	const { selectedFilters, setSelectedFilters } = useProjectAssignment()

	// =========================================================
	// 🔹 TOGGLE
	// =========================================================

	const toggleFilter = (value: ProjectAssignmentFilter) => {
		setSelectedFilters((previous) => {
			if (previous.includes(value)) {
				return previous.filter((item) => item !== value)
			}

			return [...previous, value]
		})
	}

	// =========================================================
	// 🔹 FILTERS
	// =========================================================

	const filters: {
		label: string
		value: ProjectAssignmentFilter
		icon: string
		description: string
	}[] = [
		{
			label: 'Clientes',
			value: 'clients',
			icon: 'business',
			description: 'Información de clientes',
		},
		{
			label: 'Proyectos',
			value: 'projects',
			icon: 'folder',
			description: 'Listado de proyectos asignados',
		},
		{
			label: 'Usuarios',
			value: 'users',
			icon: 'groups',
			description: 'Usuarios relacionados',
		},
		{
			label: 'Time Entries',
			value: 'time_entries',
			icon: 'schedule',
			description: 'Información de imputaciones',
		},
	]

	// =========================================================
	// 🔹 RENDER
	// =========================================================

	return (
		<div className="project-assignment-filters">
			{filters.map((filter) => {
				const checked = selectedFilters.includes(filter.value)

				return (
					<button
						key={filter.value}
						type="button"
						className={`project-assignment-filters__item ${checked ? 'is-selected' : ''}`}
						onClick={() => toggleFilter(filter.value)}
					>
						{/* ===================================== */}
						{/* 🔹 CHECKBOX */}
						{/* ===================================== */}

						<div className="project-assignment-filters__checkbox">{checked && <span className="material-icons">check</span>}</div>

						{/* ===================================== */}
						{/* 🔹 CONTENT */}
						{/* ===================================== */}

						<div className="project-assignment-filters__content">
							<div className="project-assignment-filters__top">
								<span className="material-icons project-assignment-filters__icon">{filter.icon}</span>

								<span className="project-assignment-filters__title">{filter.label}</span>
							</div>

							<p className="project-assignment-filters__description">{filter.description}</p>
						</div>
					</button>
				)
			})}
		</div>
	)
}

export default ProjectAssignmentFilters
