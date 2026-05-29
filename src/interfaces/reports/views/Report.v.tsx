import { FC } from 'react'
import ReportsCards from '../components/ReportCard'
import ReportsHeader from '../components/ReportHeader'

export const Reports: FC = () => {
	return (
		<div className="reports">
			<ReportsHeader />

			<ReportsCards />
		</div>
	)
}

export default Reports
