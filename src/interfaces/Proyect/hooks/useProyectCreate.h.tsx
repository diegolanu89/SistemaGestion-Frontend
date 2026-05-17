import { useState, useEffect } from 'react'
import { CreateProjectIntakeDto } from '../models/ProyectDTO.m'
import { proyectAdapter } from '../services/ProyectAdapter.s'
import { useProyectContext } from './useProyectContext.h'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { ProyectCreateLogMessages, ProyectCreateMessages } from '../models/EProyectCreateMessage.m'
import { ApiError } from '../../base/services/HttpClient.s'

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
	leaderClockifyUserId?: number | null
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

	const [validationErrors, setValidationErrors] = useState<string[]>([])

	const [nextNumber, setNextNumber] = useState<string>('')
	const [loadingNextNumber, setLoadingNextNumber] = useState(false)

	useEffect(() => {
		if (!form.projectType) {
			setNextNumber('')
			return
		}

		let cancelled = false

		void (async () => {
			setLoadingNextNumber(true)
			try {
				const result = await proyectAdapter.getNextNumber(form.projectType!)
				if (!cancelled) setNextNumber(result)
			} catch (error) {
				logger.errorTag(LogTag.Adapter, '[PROYECT] getNextNumber error', error as Error)
				if (!cancelled) setNextNumber('')
			} finally {
				if (!cancelled) setLoadingNextNumber(false)
			}
		})()

		return () => {
			cancelled = true
		}
	}, [form.projectType])

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
		LeaderClockifyUserId: form.leaderClockifyUserId ?? undefined,
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
			setValidationErrors([])

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

			if (error instanceof ApiError && error.errors.length > 0) {
				setValidationErrors(error.errors)
				setCreateStatus('idle')
				setCreateMessage(null)
			} else {
				setCreateStatus('error')
				setCreateMessage(ProyectCreateMessages.ERROR)

				setTimeout(() => {
					setCreateStatus('idle')
					setCreateMessage(null)
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
		nextNumber,
		loadingNextNumber,
	}
}
