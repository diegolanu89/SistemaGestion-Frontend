import { createContext, useContext } from 'react'
import { IProjectAssignmentContext } from '../models/IProjectAsignment.m'

export const projectAssignmentContext = createContext<IProjectAssignmentContext | null>(null)

export const useProjectAssignment = (): IProjectAssignmentContext => {
	const context = useContext(projectAssignmentContext)

	if (!context) {
		throw new Error('useProjectAssignment must be used within ProjectAssignmentProvider')
	}

	return context
}
