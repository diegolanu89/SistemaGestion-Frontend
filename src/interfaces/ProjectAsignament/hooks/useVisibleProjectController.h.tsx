import { useEffect, useState, useMemo } from 'react'

import { useProjectAssignment } from './useProjectAsignment.h'

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'

import { ProjectDto } from '../../ViewProyect/models/ProyectViewDTO.m'

import { proyectViewAdapter } from '../../ViewProyect/services/ProyectViewAdapter.s'

interface SelectOption {
	value: string
	label: string
}

export const useVisibleProjectsController = () => {
	const { assignedProjects } = useProjectAssignment()

	const [allProjects, setAllProjects] = useState<ProjectDto[]>([])

	// Filter state
	const [search, setSearch] = useState('')
	const [client, setClient] = useState('all')
	const [code, setCode] = useState('')
	const [status, setStatus] = useState('all')

	useEffect(() => {
		const loadProjects = async () => {
			try {
				if (assignedProjects.length === 0) {
					setAllProjects([])
					return
				}

				const projectIds = assignedProjects.map((project) => Number(project.project_id))

				logger.infoTag(LogTag.View, `[VISIBLE_PROJECTS] loading ${projectIds.length} project details`)

				const detailedProjects = await Promise.all(projectIds.map((id) => proyectViewAdapter.getById(id)))

				setAllProjects(detailedProjects)

				logger.infoTag(LogTag.View, `[VISIBLE_PROJECTS] loaded ${detailedProjects.length} project details`)
			} catch (error: unknown) {
				logger.errorTag(LogTag.View, error instanceof Error ? error.message : String(error))

				setAllProjects([])
			}
		}

		void loadProjects()
	}, [assignedProjects])

	// Dropdown options derived from loaded projects
	const clientOptions = useMemo<SelectOption[]>(() => {
		const vals = Array.from(new Set(allProjects.map((p) => p.clientName).filter(Boolean)))
		return [{ value: 'all', label: 'Todos' }, ...vals.map((v) => ({ value: String(v), label: String(v) }))]
	}, [allProjects])

const statusOptions = useMemo<SelectOption[]>(() => {
		const vals = Array.from(new Set(allProjects.map((p) => p.status).filter(Boolean)))
		return [{ value: 'all', label: 'Todos' }, ...vals.map((v) => ({ value: String(v), label: String(v) }))]
	}, [allProjects])

	// Client-side filtered list
	const projects = useMemo<ProjectDto[]>(() => {
		return allProjects.filter((p) => {
			if (search && !p.name?.toLowerCase().includes(search.toLowerCase())) return false
			if (client !== 'all' && p.clientName !== client) return false
			if (code && !p.code?.toLowerCase().includes(code.toLowerCase())) return false
			if (status !== 'all' && p.status !== status) return false
			return true
		})
	}, [allProjects, search, client, code, status])

	const clearFilters = () => {
		setSearch('')
		setClient('all')
		setCode('')
		setStatus('all')
	}

	const hasFilters = search !== '' || client !== 'all' || code !== '' || status !== 'all'

	return {
		projects,
		totalCount: allProjects.length,
		search,
		setSearch,
		client,
		setClient,
		code,
		setCode,
		status,
		setStatus,
		clearFilters,
		hasFilters,
		clientOptions,
		statusOptions,
	}
}
