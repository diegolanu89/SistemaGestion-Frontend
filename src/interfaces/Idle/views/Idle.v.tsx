import { memo } from 'react'
import FeatureGrid from '../components/FeatureGrid'

const Idle = memo(() => {
	return (
		<div className="idle">
			<FeatureGrid />
		</div>
	)
})

export default Idle
