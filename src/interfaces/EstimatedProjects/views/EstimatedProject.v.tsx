import { FC } from 'react'
import { EstimatedProjectHeader } from '../components/EstimatedProjectHeader'
import { EstimatedProjectTable } from '../components/EstimatedProjectTable'

export const EstimatedProject: FC = () => {
	return (
		<div className="estimated-project">
			<EstimatedProjectHeader />
			<EstimatedProjectTable />
		</div>
	)
}

export default EstimatedProject
