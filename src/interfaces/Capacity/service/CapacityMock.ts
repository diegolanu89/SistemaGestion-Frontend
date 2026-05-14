import { ICapacity } from '../model/ICapacity.m'
import { CapacityLimitsRequestDto, CapacityLimitsResponseDto, ValidateCapacityRequestDto, ValidateCapacityResponseDto } from '../models/CapacityDTO.m'

export class CapacityMock implements ICapacity {
	async validateCapacity(_req: ValidateCapacityRequestDto): Promise<ValidateCapacityResponseDto> {
		return {
			valid: true,
			errors: [],
		}
	}

	async getCapacityLimits(_req: CapacityLimitsRequestDto): Promise<CapacityLimitsResponseDto> {
		return {
			limits: [],
		}
	}
}
