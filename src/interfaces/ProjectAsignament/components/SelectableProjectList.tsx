import { FC, useMemo } from 'react'

import SelectableProjectItem from './SelectableProjectItem'

import { useProjectAssignment } from '../hooks/useProjectAsignment.h'

import logger from '../../base/controllers/Logger.c'

import { LogTag } from '../../base/model/LogTag.m'

interface Props {
	search: string
	code: string
}

const SelectableProjectList: FC<Props> = ({ search, code }) => {
	const { projects } = useProjectAssignment()

	const filteredProjects = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase()

		const normalizedCode = code.trim().toLowerCase()

		const result = projects.filter((project) => {
			const projectName = project.name?.toLowerCase() ?? ''

			const projectCode = project.code?.toLowerCase() ?? ''

			const matchesName = normalizedSearch.length === 0 || projectName.includes(normalizedSearch)

			const matchesCode = normalizedCode.length === 0 || projectCode.includes(normalizedCode)

			return matchesName && matchesCode
		})

		logger.infoTag(LogTag.View, `[PROJECT_ASSIGNMENT] filtered ${result.length}/${projects.length} projects`)

		return result
	}, [projects, search, code])

	if (filteredProjects.length === 0) {
		logger.infoTag(LogTag.View, `[PROJECT_ASSIGNMENT] no projects found`)

		return (
			<div className="selectable-project-list selectable-project-list--empty">
				<span className="material-icons">search_off</span>

				<p>No se encontraron proyectos para los filtros ingresados.</p>
			</div>
		)
	}

	return (
		<div className="selectable-project-list">
			{filteredProjects.map((project) => (
				<SelectableProjectItem key={project.id} project={project} />
			))}
		</div>
	)
}

export default SelectableProjectList
