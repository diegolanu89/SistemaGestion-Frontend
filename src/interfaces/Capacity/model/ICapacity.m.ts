import { ValidateCapacityRequestDto, ValidateCapacityResponseDto, CapacityLimitsRequestDto, CapacityLimitsResponseDto } from './CapacityDto.m'

export interface ICapacity {
	validateCapacity(req: ValidateCapacityRequestDto): Promise<ValidateCapacityResponseDto>

	getCapacityLimits(req: CapacityLimitsRequestDto): Promise<CapacityLimitsResponseDto>
}
