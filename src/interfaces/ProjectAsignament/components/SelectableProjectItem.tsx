// components/SelectableProjectItem.tsx

import { FC } from 'react'

import { useProjectAssignment } from '../hooks/useProjectAsignment.h'

import { ProjectDto } from '../../ViewProyect/models/ProyectViewDTO.m'

interface Props {
	project: ProjectDto
}

const SelectableProjectItem: FC<Props> = ({ project }) => {
	const { assignedProjects, setAssignedProjects } = useProjectAssignment()

	// =========================================================
	// 🔹 CHECKED
	// =========================================================

	const checked = assignedProjects.some((item) => item.id === project.id)

	// =========================================================
	// 🔹 TOGGLE
	// =========================================================

	const toggleProject = () => {
		if (checked) {
			setAssignedProjects((previous) => previous.filter((item) => item.id !== project.id))

			return
		}

		setAssignedProjects((previous) => [...previous, project])
	}

	// =========================================================
	// 🔹 RENDER
	// =========================================================

	return (
		<div className={`selectable-project-item ${checked ? 'is-selected' : ''}`} onClick={toggleProject}>
			<input type="checkbox" checked={checked} readOnly />

			<div>
				<h3>{project.name}</h3>

				<p>
					{project.clientName ?? 'Sin cliente'} • {project.code ?? 'Sin código'}
				</p>
			</div>
		</div>
	)
}

export default SelectableProjectItem
