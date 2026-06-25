// hooks/useProyectEditForm.h.ts

import { useState } from 'react'
import { UpdateProjectIntakeDto } from '../models/ProyectDTO.m'
import { proyectAdapter } from '../services/ProyectAdapter.s'
import { useProyectContext } from './useProyectContext.h'
import { ApiError } from '../../base/services/HttpClient.s'

const extractMessage = (raw: string): string => {
	const idx = raw.indexOf(': {')
	if (idx !== -1) {
		try {
			const parsed = JSON.parse(raw.slice(idx + 2)) as { message?: string }
			if (parsed.message) return parsed.message
		} catch { /* ignore */ }
	}
	return raw
}

export const useProyectEditForm = () => {
	const { selectedProject, refetch, closeEdit, setEditStatus, setEditMessage } = useProyectContext()

	const [form, setForm] = useState<UpdateProjectIntakeDto>({})
	const [submitting, setSubmitting] = useState(false)
	const [validationErrors, setValidationErrors] = useState<string[]>([])
	const [backendError, setBackendError] = useState<string | null>(null)

	const update =
		<K extends keyof UpdateProjectIntakeDto>(key: K) =>
		(value: UpdateProjectIntakeDto[K]) =>
			setForm((prev) => ({ ...prev, [key]: value }))

	const submit = async () => {
		if (!selectedProject) return

		try {
			setSubmitting(true)
			setEditStatus('loading')
			setEditMessage(null)
			setValidationErrors([])
			setBackendError(null)

			await proyectAdapter.update(selectedProject.Id, form)

			setEditStatus('success')
			setEditMessage('Proyecto actualizado correctamente')

			await refetch()

			setTimeout(() => {
				closeEdit()
				setEditStatus('idle')
				setEditMessage(null)
			}, 1200)
		} catch (error) {
			if (error instanceof ApiError && error.errors.length > 0) {
				setValidationErrors(error.errors)
				setEditStatus('idle')
				setEditMessage(null)
			} else {
				const lines: string[] = [error instanceof Error ? error.message : 'Error al actualizar el proyecto']
				if (error instanceof ApiError && error.detail) lines.push(extractMessage(error.detail))
				setBackendError(lines.join('\n'))
				setEditStatus('error')
				setEditMessage('Error al actualizar el proyecto')

				setTimeout(() => {
					setEditStatus('idle')
					setEditMessage(null)
				}, 2500)
			}
		} finally {
			setSubmitting(false)
		}
	}

	return {
		form,
		setForm,
		update,
		submit,
		submitting,
		validationErrors,
		backendError,
	}
}
