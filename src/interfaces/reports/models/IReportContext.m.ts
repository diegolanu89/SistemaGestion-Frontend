// models/IReportsContext.m.ts

import { Dispatch, SetStateAction } from 'react'

export interface IReportsContext {
	loading: boolean

	setLoading: Dispatch<SetStateAction<boolean>>
}
