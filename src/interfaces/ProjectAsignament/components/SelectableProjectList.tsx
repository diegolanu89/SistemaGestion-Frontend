import { FC } from 'react'

import SelectableProjectItem from './SelectableProjectItem'

import { ProjectDto } from '../../ViewProyect/models/ProyectViewDTO.m'

interface Props {
	projects: ProjectDto[]
}

const SelectableProjectList: FC<Props> = ({ projects }) => {
	if (projects.length === 0) {
		return (
			<div className="selectable-project-list selectable-project-list--empty">
				<span className="material-icons">search_off</span>

				<p>No se encontraron proyectos para los filtros ingresados.</p>
			</div>
		)
	}

	return (
		<div className="selectable-project-list">
			{projects.map((project) => (
				<SelectableProjectItem key={project.id} project={project} />
			))}
		</div>
	)
}

export default SelectableProjectList
