/* eslint-disable @typescript-eslint/no-unused-vars */
// hooks/useProyectEditForm.h.ts

import { useState } from 'react'
import { UpdateProjectIntakeDto } from '../models/ProyectDTO.m'
import { proyectAdapter } from '../services/ProyectAdapter.s'
import { useProyectContext } from './useProyectContext.h'

export const useProyectEditForm = () => {
	const { selectedProject, refetch, closeEdit, setEditStatus, setEditMessage } = useProyectContext()

	const [form, setForm] = useState<UpdateProjectIntakeDto>({})
	const [submitting, setSubmitting] = useState(false)

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
			setEditStatus('error')
			setEditMessage('Error al actualizar el proyecto')
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
	}
}
