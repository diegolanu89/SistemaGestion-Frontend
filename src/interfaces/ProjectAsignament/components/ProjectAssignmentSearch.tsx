// components/ProjectAssignmentSearch.tsx

import { FC, useEffect, useState } from 'react'

import { useProjectAssignment } from '../hooks/useProjectAsignment.h'

const DEBOUNCE_MS = 500

const ProjectAssignmentSearch: FC = () => {
	const {
		search,
		setSearch,

		code,
		setCode,
	} = useProjectAssignment()

	// =========================================================
	// 🔹 LOCAL STATE
	// =========================================================

	const [localSearch, setLocalSearch] = useState(search)

	const [localCode, setLocalCode] = useState(code)

	const [isSearchingName, setIsSearchingName] = useState(false)

	const [isSearchingCode, setIsSearchingCode] = useState(false)

	// =========================================================
	// 🔹 SYNC
	// =========================================================

	useEffect(() => {
		setLocalSearch(search)
	}, [search])

	useEffect(() => {
		setLocalCode(code)
	}, [code])

	// =========================================================
	// 🔹 SEARCH NAME
	// =========================================================

	useEffect(() => {
		if (localSearch === search) {
			setIsSearchingName(false)

			return
		}

		setIsSearchingName(true)

		const timer = setTimeout(() => {
			setSearch(localSearch)

			setIsSearchingName(false)
		}, DEBOUNCE_MS)

		return () => clearTimeout(timer)
	}, [localSearch, search, setSearch])

	// =========================================================
	// 🔹 SEARCH CODE
	// =========================================================

	useEffect(() => {
		if (localCode === code) {
			setIsSearchingCode(false)

			return
		}

		setIsSearchingCode(true)

		const timer = setTimeout(() => {
			setCode(localCode)

			setIsSearchingCode(false)
		}, DEBOUNCE_MS)

		return () => clearTimeout(timer)
	}, [localCode, code, setCode])

	// =========================================================
	// 🔹 RENDER
	// =========================================================

	return (
		<div className="project-assignment-search">
			{/* ================================================= */}
			{/* 🔹 CODE */}
			{/* ================================================= */}

			<div className="project-assignment-search__group">
				<label className="project-assignment-search__label">Búsqueda por código</label>

				<div className="project-assignment-search__control">
					<span className="material-icons project-assignment-search__icon">tag</span>

					<input
						className="project-assignment-search__input"
						type="text"
						placeholder="Buscar por código"
						value={localCode}
						onChange={(event) => setLocalCode(event.target.value)}
					/>

					{isSearchingCode && (
						<div className="project-assignment-search__loader">
							<span className="material-icons spin">autorenew</span>
						</div>
					)}
				</div>
			</div>

			{/* ================================================= */}
			{/* 🔹 NAME */}
			{/* ================================================= */}

			<div className="project-assignment-search__group">
				<label className="project-assignment-search__label">Búsqueda por nombre</label>

				<div className="project-assignment-search__control">
					<span className="material-icons project-assignment-search__icon">search</span>

					<input
						className="project-assignment-search__input"
						type="text"
						placeholder="Buscar por nombre"
						value={localSearch}
						onChange={(event) => setLocalSearch(event.target.value)}
					/>

					{isSearchingName && (
						<div className="project-assignment-search__loader">
							<span className="material-icons spin">autorenew</span>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default ProjectAssignmentSearch
