// src/interfaces/AppBar/components/UserMenu.tsx

import { useRef, useEffect, useMemo, useState } from 'react'

import AvatarImage from '../avatar/AvatarImage'

import { AppBarController } from '../../controllers/AppBarController.c'

import { useAuth } from '../../../Login/hooks/useAuth.h'

interface Props {
	controller: AppBarController
}

type PermissionMatrix = {
	module: string
	permissions: string[]
}

export const UserMenu = ({ controller }: Props) => {
	const { user } = useAuth()

	const state = controller.getMenuState()

	const labels = controller.getLabels()

	const menuRef = useRef<HTMLDivElement | null>(null)

	// ==========================
	// 🔹 MODAL
	// ==========================

	const [isPermissionsOpen, setIsPermissionsOpen] = useState(false)

	// ==========================
	// 🔹 OUTSIDE CLICK
	// ==========================

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (!menuRef.current) {
				return
			}

			const target = event.target as Node

			// 🔥 si clickea fuera del menu
			if (!menuRef.current.contains(target)) {
				controller.closeMenu()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [controller])

	// ==========================
	// 🔹 PERMISSION MATRIX
	// ==========================

	const permissionMatrix = useMemo<PermissionMatrix[]>(() => {
		const perms = user?.profilePermissions?.permissions

		if (!perms || perms.length === 0) return []

		const ACTION_LABELS: Record<number, string[]> = {
			1: ['Leer'],
			2: ['Leer', 'Editar'],
			3: ['Leer', 'Editar', 'Crear'],
		}

		const grouped = new Map<string, Set<string>>()

		for (const p of perms) {
			if (!grouped.has(p.moduleCode)) {
				grouped.set(p.moduleCode, new Set())
			}

			const labels = ACTION_LABELS[p.action.level] ?? [`Nivel ${p.action.level}`]

			for (const label of labels) {
				grouped.get(p.moduleCode)!.add(label)
			}
		}

		return Array.from(grouped.entries()).map(([module, actions]) => ({
			module,
			permissions: Array.from(actions),
		}))
	}, [user])

	return (
		<>
			<div className="user-menu" ref={menuRef}>
				{/* ========================== */}
				{/* TRIGGER */}
				{/* ========================== */}

				<button className="user-menu__trigger" onClick={controller.openMenu} aria-label="Abrir menú usuario">
					<AvatarImage />
				</button>

				{/* ========================== */}
				{/* DROPDOWN */}
				{/* ========================== */}

				{state.anchorEl && (
					<div className="user-menu__dropdown">
						{/* ========================== */}
						{/* HEADER */}
						{/* ========================== */}

						<div className="user-menu__header">
							<AvatarImage />

							<div className="user-menu__identity">
								<span className="user-menu__name">{user?.name}</span>

								<span className="user-menu__email">{user?.email}</span>

								<div className="user-menu__meta">
									{user?.profileName && (
										<span className="user-menu__role">
											<span className="material-icons">badge</span>
											{user.profileName}
										</span>
									)}

									<button className="user-menu__permissions-button" onClick={() => setIsPermissionsOpen(true)}>
										<span className="material-icons">shield</span>

										<span>Ver permisos</span>
									</button>
								</div>
							</div>
						</div>

						<div className="user-menu__divider" />

						{/* ========================== */}
						{/* ITEMS */}
						{/* ========================== */}

						<button className="user-menu__item" onClick={controller.goHome}>
							{labels.HOME}
						</button>

						<div className="user-menu__divider" />

						<button className="user-menu__item user-menu__item--danger" onClick={controller.logout}>
							{labels.LOGOUT}
						</button>
					</div>
				)}
			</div>

			{/* ========================== */}
			{/* 🔹 PERMISSIONS MODAL */}
			{/* ========================== */}

			{isPermissionsOpen && (
				<div className="permissions-modal" onClick={() => setIsPermissionsOpen(false)}>
					<div className="permissions-modal__content" onClick={(e) => e.stopPropagation()}>
						{/* ========================== */}
						{/* HEADER */}
						{/* ========================== */}

						<div className="permissions-modal__header">
							<div>
								<h2 className="permissions-modal__title">Matriz de permisos</h2>

								<p className="permissions-modal__subtitle">Accesos habilitados para el usuario actual</p>
							</div>

							<button className="permissions-modal__close" onClick={() => setIsPermissionsOpen(false)}>
								<span className="material-icons">close</span>
							</button>
						</div>

						{/* ========================== */}
						{/* MATRIX */}
						{/* ========================== */}

						<div className="permissions-modal__matrix">
							{permissionMatrix.length === 0 ? (
								<p className="permissions-modal__empty">No hay permisos asignados para este perfil.</p>
							) : (
								permissionMatrix.map((group) => (
									<div key={group.module} className="permissions-modal__card">
										<div className="permissions-modal__module">
											<span className="material-icons">lock</span>

											<span>{group.module}</span>
										</div>

										<div className="permissions-modal__badges">
											{group.permissions.map((permission) => (
												<span key={permission} className="permissions-modal__badge">
													{permission}
												</span>
											))}
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			)}
		</>
	)
}
