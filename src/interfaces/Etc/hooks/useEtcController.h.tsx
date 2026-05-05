// hooks/useEtcController.h.ts

import { useCallback } from 'react'
import { useEtcContext } from './useEtcContext.h'
import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { etcAdapter } from '../service/EtcAdapter'
import type { ValidateCapacityResponse } from '../model/IEtcApi.m'

export const useEtcController = () => {
	const { projectId, entries, setLoading, setErrors } = useEtcContext()

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

			// 🔥 opcional: limpiar errores si guardó OK
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

			// 🔥 opcional: limpiar errores
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
