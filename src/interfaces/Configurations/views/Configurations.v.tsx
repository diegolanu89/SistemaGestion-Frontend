import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ClockifyUsersTab from '../components/ClockifyUsersTab'
import UserLeadersTab from '../components/UserLeadersTab'
import WorkingDaysCalendarTab from '../components/WorkingDaysCalendarTab'
import VacacionesTab from '../components/VacacionesTab'
import UsuariosTab from '../components/UsuariosTab'
import PermissionsTab from '../components/PermissionsTab'

type TabType = 'usuarios-clocky' | 'leaders' | 'calendar' | 'vacaciones' | 'usuarios' | 'permisos'

const TABS: Array<{ id: TabType; label: string; icon: string }> = [
	{ id: 'usuarios-clocky', label: 'Usuarios clocky', icon: '🕒' },

	{ id: 'leaders', label: 'Líderes', icon: '👥' },

	{ id: 'calendar', label: 'Días Laborales', icon: '📅' },

	{ id: 'vacaciones', label: 'Carga de Vacaciones', icon: '🏖️' },

	{ id: 'usuarios', label: 'Usuarios app', icon: '👤' },

	{ id: 'permisos', label: 'Perfiles y Permisos', icon: '🔐' },
]

const ConfigurationsView: React.FC = () => {
	const navigate = useNavigate()

	const [activeTab, setActiveTab] = useState<TabType>('usuarios-clocky')

	return (
		<div className="configurations">
			<div className="configurations__header">
				<div className="configurations__header-left">
					<button className="configurations__back-btn" onClick={() => navigate('/home')} data-tooltip="Volver al inicio">
						<span className="material-icons">arrow_back</span>
					</button>

					<div className="configurations__titles">
						<h1 className="configurations__title">Configuraciones</h1>

						<p className="configurations__description">Administración de usuarios, líderes, días laborales, vacaciones, perfiles y permisos del sistema.</p>
					</div>
				</div>
			</div>

			<div className="configurations__tabs">
				{TABS.map((tab) => (
					<button
						key={tab.id}
						className={`configurations__tab${activeTab === tab.id ? ' configurations__tab--active' : ''}`}
						onClick={() => setActiveTab(tab.id)}
					>
						<span className="configurations__tab-icon">{tab.icon}</span>

						<span className="configurations__tab-label">{tab.label}</span>
					</button>
				))}
			</div>

			<div className="configurations__content">
				{activeTab === 'usuarios-clocky' && <ClockifyUsersTab />}

				{activeTab === 'leaders' && <UserLeadersTab />}

				{activeTab === 'calendar' && <WorkingDaysCalendarTab />}

				{activeTab === 'vacaciones' && <VacacionesTab />}

				{activeTab === 'usuarios' && <UsuariosTab />}

				{activeTab === 'permisos' && <PermissionsTab />}
			</div>
		</div>
	)
}

export default ConfigurationsView
