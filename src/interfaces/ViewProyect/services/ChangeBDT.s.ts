// services/ChangeRequestBDT.s.ts

import logger from '../../base/controllers/Logger.c'
import { LogTag } from '../../base/model/LogTag.m'
import { HttpClient } from '../../base/services/HttpClient.s'
import { ChangeRequestInterface, ChangeRequestDto, CreateChangeRequestDto, UpdateChangeRequestDto } from '../models/IChange.m'

const PROJECTS_URL = `${import.meta.env.VITE_API_URL}/projects`

const CHANGE_REQUESTS_URL = `${import.meta.env.VITE_API_URL}/change-requests`

export class ChangeRequestBDT implements ChangeRequestInterface {
	/* =====================================================
	🔹 GET BY PROJECT
	===================================================== */

	async getByProject(projectId: number): Promise<ChangeRequestDto[]> {
		logger.infoTag(LogTag.Adapter, `[CHANGE_REQUEST][BDT] getByProject -> ${projectId}`)

		return await HttpClient.request<ChangeRequestDto[]>(`${PROJECTS_URL}/${projectId}/change-requests`)
	}

	/* =====================================================
	🔹 CREATE
	===================================================== */

	async create(projectId: number, dto: CreateChangeRequestDto): Promise<ChangeRequestDto> {
		logger.infoTag(LogTag.Adapter, `[CHANGE_REQUEST][BDT] create -> ${projectId}`)

		const response = await HttpClient.request<{
			message: string

			change_request: ChangeRequestDto
		}>(`${PROJECTS_URL}/${projectId}/change-requests`, {
			method: 'POST',

			body: JSON.stringify(dto),
		})

		return response.change_request
	}

	/* =====================================================
	🔹 UPDATE
	===================================================== */

	async update(projectId: number, changeId: number, dto: UpdateChangeRequestDto): Promise<ChangeRequestDto> {
		logger.infoTag(LogTag.Adapter, `[CHANGE_REQUEST][BDT] update -> ${projectId} | ${changeId}`)

		const response = await HttpClient.request<{
			message: string

			change_request: ChangeRequestDto
		}>(`${PROJECTS_URL}/${projectId}/change-log/${changeId}`, {
			method: 'PUT',

			body: JSON.stringify(dto),
		})

		return response.change_request
	}

	/* =====================================================
	🔹 PATCH
	===================================================== */

	async patch(changeId: number, dto: UpdateChangeRequestDto): Promise<ChangeRequestDto> {
		logger.infoTag(LogTag.Adapter, `[CHANGE_REQUEST][BDT] patch -> ${changeId}`)

		const response = await HttpClient.request<{
			message: string

			change_request: ChangeRequestDto
		}>(`${CHANGE_REQUESTS_URL}/${changeId}`, {
			method: 'PATCH',

			body: JSON.stringify(dto),
		})

		return response.change_request
	}

	/* =====================================================
	🔹 DELETE
	===================================================== */

	async delete(projectId: number, changeId: number): Promise<void> {
		logger.infoTag(LogTag.Adapter, `[CHANGE_REQUEST][BDT] delete -> ${projectId} | ${changeId}`)

		await HttpClient.request(`${PROJECTS_URL}/${projectId}/change-log/${changeId}`, {
			method: 'DELETE',
		})
	}
}
