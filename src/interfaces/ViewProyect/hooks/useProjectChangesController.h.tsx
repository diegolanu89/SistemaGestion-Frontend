// hooks/useProjectChangesController.h.ts

import { useEffect, useMemo, useState } from 'react'

import { useProyectViewContext } from './useProyectViewContext.h'

import { ChangeRequestDto, CreateChangeRequestDto, UpdateChangeRequestDto, ChangeRequestStatus } from '../models/IChange.m'

import { changeRequestAdapter } from '../services/ChangeAdapter.s'

/* =========================================================
🔹 EMPTY FORM
========================================================= */

const EMPTY_FORM: CreateChangeRequestDto = {
	code: '',

	title: '',

	description: '',

	requestedBy: '',

	requestedDate: '',

	status: 'propuesto',

	bacHoursIncrement: 0,

	bacCostIncrement: 0,

	approvedBy: '',

	approvedDate: '',
}

/* =========================================================
🔹 STATUS OPTIONS
========================================================= */

export const STATUS_OPTIONS: ChangeRequestStatus[] = ['propuesto', 'aprobado', 'rechazado', 'implementado']

/* =========================================================
🔹 APROBACIÓN
========================================================= */

// aprobacoin es 2do paso de otro usuario: se carga cuando se aprueba/implementa el cambio.
const APPROVAL_STATUSES: ChangeRequestStatus[] = ['aprobado', 'implementado']

export const isApprovalStatus = (status: ChangeRequestStatus): boolean => APPROVAL_STATUSES.includes(status)

/* =========================================================
🔹 NORMALIZACIÓN + VALIDACIÓN
========================================================= */

// mando null o trim en fecchas vacias
const cleanText = (value?: string | null): string | null => {
	const trimmed = (value ?? '').trim()

	return trimmed === '' ? null : trimmed
}

// Fecha de hoy default fecha de aprobación
const todayIso = (): string => {
	const now = new Date()

	const month = String(now.getMonth() + 1).padStart(2, '0')

	const day = String(now.getDate()).padStart(2, '0')

	return `${now.getFullYear()}-${month}-${day}`
}

const buildPayload = (data: CreateChangeRequestDto): CreateChangeRequestDto => {
	const approval = isApprovalStatus(data.status)

	return {
		code: (data.code ?? '').trim(),

		title: (data.title ?? '').trim(),

		description: cleanText(data.description),

		requestedBy: cleanText(data.requestedBy),

		requestedDate: data.requestedDate ? data.requestedDate : null,

		status: data.status,

		bacHoursIncrement: data.bacHoursIncrement ?? 0,

		bacCostIncrement: data.bacCostIncrement ?? 0,

		approvedBy: approval ? cleanText(data.approvedBy) : null,

		// En aprobado/implementado, si no se cargó fecha de aprobación, toma hoy.
		approvedDate: approval ? (cleanText(data.approvedDate) ?? todayIso()) : null,
	}
}

// codigo, título y fecha obligatorios. Aprobacion NO es requerida
const validateForm = (data: CreateChangeRequestDto): string | null => {
	if (!cleanText(data.code)) return 'El código es requerido.'

	if (!cleanText(data.title)) return 'El título es requerido.'

	if (!data.requestedDate) return 'La fecha de solicitud es requerida.'

	return null
}

/* =========================================================
🔹 HOOK
========================================================= */

export const useProjectChangesController = (projectId: number, open: boolean) => {
	const {
		changeRequests,
		setChangeRequests,

		changeRequestsLoading,
		setChangeRequestsLoading,

		changeRequestsError,
		setChangeRequestsError,
	} = useProyectViewContext()

	/* =====================================================
	🔹 LOCAL STATE
	===================================================== */

	const [form, setForm] = useState<CreateChangeRequestDto>(EMPTY_FORM)

	const [editingId, setEditingId] = useState<number | null>(null)

	const [actionMessage, setActionMessage] = useState<string | null>(null)

	/* =====================================================
	🔹 LOAD
	===================================================== */

	useEffect(() => {
		if (!open) return

		const load = async () => {
			try {
				setChangeRequestsLoading(true)

				setChangeRequestsError(null)

				const response = await changeRequestAdapter.getByProject(projectId)

				setChangeRequests(response)
			} catch (error) {
				console.error(error)

				setChangeRequestsError('Error al cargar controles de cambio.')
			} finally {
				setChangeRequestsLoading(false)
			}
		}

		void load()
	}, [open, projectId])

	/* =====================================================
	🔹 AUTO CLEAR MESSAGE
	===================================================== */

	useEffect(() => {
		if (!actionMessage) return

		const timeout = setTimeout(() => {
			setActionMessage(null)
		}, 4000)

		return () => clearTimeout(timeout)
	}, [actionMessage])

	/* =====================================================
	🔹 TOTALS
	===================================================== */

	const totalHours = useMemo(() => {
		return changeRequests.reduce(
			(acc, current) => acc + (current.bacHoursIncrement ?? 0),

			0
		)
	}, [changeRequests])

	const totalCost = useMemo(() => {
		return changeRequests.reduce(
			(acc, current) => acc + (current.bacCostIncrement ?? 0),

			0
		)
	}, [changeRequests])

	/* =====================================================
	🔹 CREATE
	===================================================== */

	const handleCreate = async (): Promise<boolean> => {
		const validationError = validateForm(form)

		if (validationError) {
			setChangeRequestsError(validationError)

			return false
		}

		try {
			setChangeRequestsLoading(true)

			setChangeRequestsError(null)

			const created = await changeRequestAdapter.create(projectId, buildPayload(form))

			setChangeRequests((prev) => [created, ...prev])

			setForm(EMPTY_FORM)

			setActionMessage('Control de cambio registrado correctamente.')

			return true
		} catch (error) {
			console.error(error)

			setChangeRequestsError('Error al registrar control de cambio.')

			return false
		} finally {
			setChangeRequestsLoading(false)
		}
	}

	/* =====================================================
	🔹 UPDATE
	===================================================== */

	const handleUpdate = async (): Promise<boolean> => {
		if (!editingId) return false

		const validationError = validateForm(form)

		if (validationError) {
			setChangeRequestsError(validationError)

			return false
		}

		try {
			setChangeRequestsLoading(true)

			setChangeRequestsError(null)

			// El modal de edición permite editar todo.
			const payload: UpdateChangeRequestDto = buildPayload(form)

			const updated = await changeRequestAdapter.update(projectId, editingId, payload)

			setChangeRequests((prev) => prev.map((item) => (item.id === editingId ? updated : item)))

			setActionMessage('Control de cambio actualizado correctamente.')

			handleCancelEdit()

			return true
		} catch (error) {
			console.error(error)

			setChangeRequestsError('Error al actualizar control de cambio.')

			return false
		} finally {
			setChangeRequestsLoading(false)
		}
	}

	/* =====================================================
	🔹 SUBMIT
	===================================================== */

	const handleSubmit = async (): Promise<boolean> => {
		if (editingId) {
			return await handleUpdate()
		}

		return await handleCreate()
	}

	/* =====================================================
	🔹 DELETE
	===================================================== */

	const handleDelete = async (changeId: number) => {
		try {
			setChangeRequestsLoading(true)

			setChangeRequestsError(null)

			await changeRequestAdapter.delete(projectId, changeId)

			setChangeRequests((prev) => prev.filter((x) => x.id !== changeId))

			setActionMessage('Control de cambio eliminado correctamente.')
		} catch (error) {
			console.error(error)

			setChangeRequestsError('Error al eliminar control de cambio.')
		} finally {
			setChangeRequestsLoading(false)
		}
	}

	/* =====================================================
	🔹 EDIT
	===================================================== */

	const handleEdit = (item: ChangeRequestDto) => {
		setEditingId(item.id)

		setForm({
			code: item.code,

			title: item.title,

			description: item.description ?? '',

			requestedBy: item.requestedBy ?? '',

			requestedDate: item.requestedDate,

			status: item.status,

			bacHoursIncrement: item.bacHoursIncrement ?? 0,

			bacCostIncrement: item.bacCostIncrement ?? 0,

			approvedBy: item.approvedBy ?? '',

			approvedDate: item.approvedDate ?? '',
		})
	}

	/* =====================================================
	🔹 CANCEL EDIT
	===================================================== */

	const handleCancelEdit = () => {
		setEditingId(null)

		setForm(EMPTY_FORM)
	}

	/* =====================================================
	🔹 RETURN
	===================================================== */

	return {
		/* =========================================
		🔹 STATE
		========================================= */

		changeRequests,

		changeRequestsLoading,

		changeRequestsError,

		form,

		setForm,

		editingId,

		actionMessage,

		/* =========================================
		🔹 TOTALS
		========================================= */

		totalHours,

		totalCost,

		/* =========================================
		🔹 ACTIONS
		========================================= */

		handleSubmit,

		handleCreate,

		handleUpdate,

		handleDelete,

		handleEdit,

		handleCancelEdit,

		/* =========================================
		🔹 CONFIG
		========================================= */

		STATUS_OPTIONS,
	}
}
