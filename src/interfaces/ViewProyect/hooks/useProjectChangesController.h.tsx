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

	const handleCreate = async () => {
		try {
			setChangeRequestsLoading(true)

			setChangeRequestsError(null)

			const created = await changeRequestAdapter.create(projectId, form)

			setChangeRequests((prev) => [created, ...prev])

			setForm(EMPTY_FORM)

			setActionMessage('Control de cambio registrado correctamente.')
		} catch (error) {
			console.error(error)

			setChangeRequestsError('Error al registrar control de cambio.')
		} finally {
			setChangeRequestsLoading(false)
		}
	}

	/* =====================================================
	🔹 UPDATE
	===================================================== */

	const handleUpdate = async () => {
		try {
			if (!editingId) return

			setChangeRequestsLoading(true)

			setChangeRequestsError(null)

			const payload: UpdateChangeRequestDto = {
				title: form.title,

				description: form.description,

				status: form.status,

				bacHoursIncrement: form.bacHoursIncrement,

				bacCostIncrement: form.bacCostIncrement,

				approvedBy: form.approvedBy,

				approvedDate: form.approvedDate,
			}

			const updated = await changeRequestAdapter.update(projectId, editingId, payload)

			setChangeRequests((prev) => prev.map((item) => (item.id === editingId ? updated : item)))

			setActionMessage('Control de cambio actualizado correctamente.')

			handleCancelEdit()
		} catch (error) {
			console.error(error)

			setChangeRequestsError('Error al actualizar control de cambio.')
		} finally {
			setChangeRequestsLoading(false)
		}
	}

	/* =====================================================
	🔹 SUBMIT
	===================================================== */

	const handleSubmit = async () => {
		if (editingId) {
			await handleUpdate()

			return
		}

		await handleCreate()
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
