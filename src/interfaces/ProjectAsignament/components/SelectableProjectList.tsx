// components/SelectableProjectList.tsx

import { FC } from 'react'

import SelectableProjectItem from './SelectableProjectItem'

import { useProjectAssignment } from '../hooks/useProjectAsignment.h'

const SelectableProjectList: FC = () => {
	const { projects } = useProjectAssignment()

	// =========================================================
	// 🔹 EMPTY
	// =========================================================

	if (projects.length === 0) {
		return (
			<div className="selectable-project-list selectable-project-list--empty">
				<span className="material-icons">folder_off</span>

				<p>No hay proyectos disponibles.</p>
			</div>
		)
	}

	// =========================================================
	// 🔹 RENDER
	// =========================================================

	return (
		<div className="selectable-project-list">
			{projects.map((project) => (
				<SelectableProjectItem key={project.id} project={project} />
			))}
		</div>
	)
}

export default SelectableProjectList
