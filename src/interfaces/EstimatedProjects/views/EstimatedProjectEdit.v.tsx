import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { EstimatedProjectCreateForm } from '../components/EstimatedProjectCreateForm'

export const EstimatedProjectEdit: FC = () => {
	const { id } = useParams<{ id: string }>()
	const editingId = id ? Number(id) : null

	return (
		<div className="estimated-project-create">
			<EstimatedProjectCreateForm editingId={Number.isFinite(editingId) ? editingId : null} />
		</div>
	)
}

export default EstimatedProjectEdit
