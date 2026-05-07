// hooks/useEtcController.h.ts

import { useCallback, useEffect } from 'react'
import { useEtcContext } from './useEtcContext.h'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { etcAdapter } from '../service/EtcAdapter'
import type { ValidateCapacityResponse } from '../model/IEtcApi.m'
import type { EtcEntryDto } from '../model/Etc.m'
import type { AllocationWireDto } from '../../EstimatedProjects/models/EstimatedProjectDTO.m'
import { estimatedProjectAdapter } from '../../EstimatedProjects/services/EstimatedProjectAdapter.s'

export const useEtcController = () => {
	const { projectId, entries, setEntries, setLoading, setErrors } = useEtcContext()

	// =========================
	// INITIAL LOAD
	// =========================

	useEffect(() => {
		let cancelled = false

		void (async () => {
			logger.infoTag(LogTag.Adapter, '[ETC] Initial load', {
				projectId,
			})

			setLoading(true)

			try {
				// =========================
				// CURRENT ETC
				// =========================

				const response = await etcAdapter.getByProject(projectId)

				const existing = response.records ?? []

				// =========================
				// IF ETC EXISTS
				// =========================

				if (existing.length > 0) {
					const mappedEntries: EtcEntryDto[] = existing.map(
						(record: { userName?: string | null; monthKey: string; monthLabel?: string | null; hours?: number | null }) => ({
							userName: record.userName ?? 'Sin usuario',

							monthKey: record.monthKey,

							monthLabel: record.monthLabel ?? record.monthKey,

							hours: Number(record.hours ?? 0),
						})
					)

					if (!cancelled) {
						setEntries(mappedEntries)
					}

					return
				}

				// =========================
				// FALLBACK → ALLOCATIONS
				// =========================

				const allocations: AllocationWireDto[] = await estimatedProjectAdapter.getAllocations(projectId)

				const allocationEntries: EtcEntryDto[] = allocations.map((allocation) => ({
					userName: allocation.user_name ?? 'Sin usuario',

					monthKey: allocation.month_key,

					monthLabel: allocation.month_label ?? allocation.month_key,

					hours: Number(allocation.hours ?? 0),
				}))

				if (!cancelled) {
					setEntries(allocationEntries)
				}
			} catch (e: unknown) {
				logger.errorTag(LogTag.Adapter, '[ETC] Initial load error', e)

				if (!cancelled) {
					setErrors([
						{
							message: 'Error al cargar ETC',
						},
					])
				}
			} finally {
				if (!cancelled) {
					setLoading(false)
				}
			}
		})()

		return () => {
			cancelled = true
		}
	}, [projectId, setEntries, setLoading, setErrors])

	// =========================
	// VALIDATE
	// =========================

	const validate = useCallback(async () => {
		logger.infoTag(LogTag.Adapter, '[ETC] Validate start', {
			projectId,
			entriesCount: entries.length,
		})

		setLoading(true)

		try {
			const res: ValidateCapacityResponse = await etcAdapter.validateCapacity({
				projectId,
				entries,
			})

			setErrors(res.errors ?? [])

			logger.infoTag(LogTag.Adapter, '[ETC] Validate result', {
				valid: res.valid,
				errors: res.errors?.length ?? 0,
			})
		} catch (e: unknown) {
			logger.errorTag(LogTag.Adapter, '[ETC] Validate error', e)

			setErrors([
				{
					message: 'Error al validar capacidad',
				},
			])
		} finally {
			setLoading(false)
		}
	}, [entries, projectId, setLoading, setErrors])

	// =========================
	// SAVE (BULK)
	// =========================

	const save = useCallback(async () => {
		logger.infoTag(LogTag.Adapter, '[ETC] Save start', {
			projectId,
			entriesCount: entries.length,
		})

		setLoading(true)

		try {
			const res = await etcAdapter.storeBulk({
				projectId,
				entries,
			})

			logger.infoTag(LogTag.Adapter, '[ETC] Save success', {
				created: res.records.length,
			})

			setErrors([])
		} catch (e: unknown) {
			logger.errorTag(LogTag.Adapter, '[ETC] Save error', e)

			setErrors([
				{
					message: 'Error al guardar ETC',
				},
			])
		} finally {
			setLoading(false)
		}
	}, [entries, projectId, setLoading, setErrors])

	// =========================
	// SNAPSHOT
	// =========================

	const snapshot = useCallback(async () => {
		logger.infoTag(LogTag.Adapter, '[ETC] Snapshot start', {
			projectId,
			entriesCount: entries.length,
		})

		setLoading(true)

		try {
			const res = await etcAdapter.createSnapshot(projectId, {
				entries,
			})

			logger.infoTag(LogTag.Adapter, '[ETC] Snapshot success', {
				version: res.snapshot.version,
			})

			setErrors([])
		} catch (e: unknown) {
			logger.errorTag(LogTag.Adapter, '[ETC] Snapshot error', e)

			setErrors([
				{
					message: 'Error al generar snapshot',
				},
			])
		} finally {
			setLoading(false)
		}
	}, [entries, projectId, setLoading, setErrors])

	return {
		validate,
		save,
		snapshot,
	}
}
