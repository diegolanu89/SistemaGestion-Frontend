import { useState } from 'react'
import { CreateProjectIntakeDto } from '../models/ProyectDTO.m'
import { proyectAdapter } from '../services/ProyectAdapter.s'
import { useProyectContext } from './useProyectContext.h'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { ProyectCreateLogMessages, ProyectCreateMessages } from '../models/EProyectCreateMessage.m'

type FormState = {
	projectType?: string
	projectName?: string

	secondaryProjectNumber?: string
	registrationDate?: string | null
	clientId?: number | null

	categoryCode?: string | null
	projectStatusCode?: string | null

	businessStatusDate?: string | null
	estimatedEndDate?: string | null
	actualEndDate?: string | null

	commercialStatus?: string | null
	leaderName?: string | null
	observations?: string | null

	requiresClockifyCreation: boolean
}

export const useProyectCreateForm = () => {
	const { refetch, closeCreate, setCreateStatus, setCreateMessage } = useProyectContext()

	const [form, setForm] = useState<FormState>({
		projectType: '',
		projectName: '',
		requiresClockifyCreation: false,
	})

	const [submitting, setSubmitting] = useState(false)

	// ==========================
	// UPDATE FORM
	// ==========================
	const update =
		<K extends keyof FormState>(key: K) =>
		(value: FormState[K]) =>
			setForm((prev) => ({ ...prev, [key]: value }))

	// ==========================
	// MAP DTO (PascalCase)
	// ==========================
	const mapToCreateDto = (): CreateProjectIntakeDto => ({
		ProjectType: form.projectType!,
		ProjectName: form.projectName!,

		SecondaryProjectNumber: form.secondaryProjectNumber ?? undefined,
		RegistrationDate: form.registrationDate ?? undefined,
		ClientId: form.clientId ?? undefined,

		CategoryCode: form.categoryCode ?? undefined,
		ProjectStatusCode: form.projectStatusCode ?? undefined,

		BusinessStatusDate: form.businessStatusDate ?? undefined,
		EstimatedEndDate: form.estimatedEndDate ?? undefined,
		ActualEndDate: form.actualEndDate ?? undefined,

		CommercialStatus: form.commercialStatus ?? undefined,
		LeaderName: form.leaderName ?? undefined,
		Observations: form.observations ?? undefined,

		RequiresClockifyCreation: form.requiresClockifyCreation,
	})

	// ==========================
	// SUBMIT
	// ==========================
	const submit = async (): Promise<void> => {
		if (!form.projectType || !form.projectName) return

		const payload = mapToCreateDto()

		logger.infoTag(LogTag.Maps, ProyectCreateLogMessages.SUBMIT_START, payload)

		try {
			setSubmitting(true)
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
