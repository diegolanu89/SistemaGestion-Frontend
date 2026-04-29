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
		Id: 0,
		ProjectType: '',
		ProjectName: '',
		RequiresClockifyCreation: false,
		IsActive: true,
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
		ProjectType: form.ProjectType!,
		ProjectName: form.ProjectName!,

		SecondaryProjectNumber: form.SecondaryProjectNumber ?? undefined,
		RegistrationDate: form.RegistrationDate ?? undefined,
		ClientId: form.ClientId ?? undefined,
		CategoryCode: form.CategoryCode ?? undefined,
		ProjectStatusCode: form.ProjectStatusCode ?? undefined,
		BusinessStatusDate: form.BusinessStatusDate ?? undefined,
		EstimatedEndDate: form.EstimatedEndDate ?? undefined,
		ActualEndDate: form.ActualEndDate ?? undefined,
		CommercialStatus: form.CommercialStatus ?? undefined,
		LeaderName: form.LeaderName ?? undefined,
		Observations: form.Observations ?? undefined,

		RequiresClockifyCreation: form.RequiresClockifyCreation,
	})

	// ==========================
	// SUBMIT
	// ==========================
	const submit = async (): Promise<void> => {
		if (!form.ProjectType || !form.ProjectName) return

		const payload = mapToCreateDto()

		logger.infoTag(LogTag.Maps, ProyectCreateLogMessages.SUBMIT_START, payload)

		try {
			setCreateStatus('loading')
			setCreateMessage(null)

			const result = await proyectAdapter.create(payload)

			logger.infoTag(LogTag.Adapter, `${ProyectCreateLogMessages.SUBMIT_SUCCESS} -> id=${result.Id}`, result)

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
