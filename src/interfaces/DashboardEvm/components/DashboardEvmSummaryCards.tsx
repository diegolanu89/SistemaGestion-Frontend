import { FC } from 'react'
import { MetricCard } from '../../base/components/MetricCard/MetricCard'
import { DashboardEvmSummary } from '../hooks/useDashboardEvmController.h'

interface Props {
	summary: DashboardEvmSummary
}

const formatHours = (value: number): string => value.toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export const DashboardEvmSummaryCards: FC<Props> = ({ summary }) => (
	<section className="metric-card-grid dashboard-evm__summary">
		<MetricCard variant="primary" label="Total Proyectos" value={summary.totalProjects} />

		<MetricCard variant="accent" label="BAC Total" value={formatHours(summary.bacTotal)} unit="horas" />

		<MetricCard variant="info" label="AC Total" value={formatHours(summary.acTotal)} unit="horas" />

		<MetricCard variant="warning" label="ETC Total" value={formatHours(summary.etcTotal)} unit="horas" />

		<MetricCard variant="secondary" label="EAC Total" value={formatHours(summary.eacTotal)} unit="horas" />

		<MetricCard variant="success" label="VAC Total" value={formatHours(summary.vacTotal)} unit="horas" />
	</section>
)
