import { useState } from 'react'
import { ProjectIntakeRecordDto, CreateProjectIntakeDto } from '../models/ProyectDTO.m'
import { proyectAdapter } from '../services/ProyectAdapter.s'
import { useProyectContext } from './useProyectContext.h'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { ProyectCreateLogMessages, ProyectCreateMessages } from '../models/EProyectCreateMessage.m'

export const useProyectCreateForm = () => {
	const { refetch, closeCreate, setCreateStatus, setCreateMessage } = useProyectContext()

	const [form, setForm] = useState<ProjectIntakeRecordDto>({
		id: 0,
		projectType: '',
		projectName: '',
		requiresClockifyCreation: false,
		isActive: true,
	})

	// ==========================
	// UPDATE FORM
	// ==========================
	const update =
		<K extends keyof ProjectIntakeRecordDto>(key: K) =>
		(value: ProjectIntakeRecordDto[K]) =>
			setForm((prev) => ({ ...prev, [key]: value }))

	// ==========================
	// MAP DTO
	// ==========================
	const mapToCreateDto = (): CreateProjectIntakeDto => ({
		projectType: form.projectType!,
		projectName: form.projectName!,

		secondaryProjectNumber: form.secondaryProjectNumber ?? undefined,
		registrationDate: form.registrationDate ?? undefined,
		clientId: form.clientId ?? undefined,
		categoryCode: form.categoryCode ?? undefined,
		projectStatusCode: form.projectStatusCode ?? undefined,
		businessStatusDate: form.businessStatusDate ?? undefined,
		estimatedEndDate: form.estimatedEndDate ?? undefined,
		actualEndDate: form.actualEndDate ?? undefined,
		commercialStatus: form.commercialStatus ?? undefined,
		leaderName: form.leaderName ?? undefined,
		observations: form.observations ?? undefined,

		requiresClockifyCreation: form.requiresClockifyCreation,
	})

	// ==========================
	// SUBMIT
	// ==========================
	const submit = async (): Promise<void> => {
		if (!form.projectType || !form.projectName) return

		const payload = mapToCreateDto()

		logger.infoTag(LogTag.Maps, ProyectCreateLogMessages.SUBMIT_START, payload)

		try {
			setCreateStatus('loading')
			setCreateMessage(null)

			const result = await proyectAdapter.create(payload)

			logger.infoTag(LogTag.Adapter, `${ProyectCreateLogMessages.SUBMIT_SUCCESS} -> id=${result.id}`, result)

			setCreateStatus('success')
			setCreateMessage(ProyectCreateMessages.SUCCESS)

			await refetch()

			setTimeout(() => {
				closeCreate()
				setCreateStatus('idle')
				setCreateMessage(null)
			}, 1200)
		} catch (error) {
			logger.errorTag(LogTag.Adapter, ProyectCreateLogMessages.SUBMIT_ERROR, error as Error)

			setCreateStatus('error')
			setCreateMessage(ProyectCreateMessages.ERROR)

			setTimeout(() => {
				setCreateStatus('idle')
				setCreateMessage(null)
			}, 2500)
		}
	}

	return {
		form,
		update,
		submit,
	}
}
