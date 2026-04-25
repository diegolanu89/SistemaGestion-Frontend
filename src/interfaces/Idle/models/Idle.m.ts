// src/interfaces/Idle/models/IdleConfig.ts
import slide1 from '../../../images/idle/idleCrosfit.jpg'
import slide2 from '../../../images/idle/idleFood.jpg'
import slide3 from '../../../images/idle/idleRun.jpg'
import slide4 from '../../../images/idle/idleSalad.jpg'

import slideTravel1 from '../../../images/idle/IdleTravel1.jpg'
import slideTravel2 from '../../../images/idle/IdleTravel2.jpg'
import slideTravel3 from '../../../images/idle/IdleTravel3.jpg'
import slideTravel4 from '../../../images/idle/IdleTravel4.jpg'
import slideTravel5 from '../../../images/idle/IdleTravel5.jpg'
import slideTravel6 from '../../../images/idle/IdleTravel6.jpg'
import slideTravel7 from '../../../images/idle/IdleTravel7.jpg'

import RestaurantIcon from '@mui/icons-material/Restaurant'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'

export const IDLE_CONFIG = {
	images: [slide1, slide2, slide3, slide4],
	imagesTravel: [slideTravel1, slideTravel2, slideTravel3, slideTravel4, slideTravel5, slideTravel6, slideTravel7],
	// =========================
	// TRACKFIT
	// =========================
	nutritionCard: {
		title: 'Nutrición',
		description: 'Planes, registro de comidas, objetivos calóricos y métricas.',
		route: '/nutricion',
		icon: RestaurantIcon,
		gradientLight: 'linear-gradient(135deg, rgba(25,118,210,0.18), rgba(25,118,210,0.05))',
		gradientDark: 'linear-gradient(135deg, rgba(144,202,249,0.18), rgba(144,202,249,0.05))',
		iconColor: 'primary.main',
	},

	trainingCard: {
		title: 'Training / TrackFit',
		description: 'Rutinas, seguimiento, historial y progresión.',
		route: '/training',
		icon: FitnessCenterIcon,
		gradientLight: 'linear-gradient(135deg, rgba(156,39,176,0.12), rgba(156,39,176,0.05))',
		gradientDark: 'linear-gradient(135deg, rgba(206,147,216,0.18), rgba(206,147,216,0.08))',
		iconColor: 'secondary.main',
	},

	// =========================
	// TRAVEL
	// =========================
	travelCard: {
		title: 'Travel',
		description: 'Gestión de viajes, reservas, itinerarios y experiencias.',
		route: '/travel',
		icon: FlightTakeoffIcon,
		gradientLight: 'linear-gradient(135deg, rgba(255,193,7,0.20), rgba(255,193,7,0.06))',
		gradientDark: 'linear-gradient(135deg, rgba(255,224,130,0.20), rgba(255,224,130,0.06))',
		iconColor: 'warning.main',
	},

	// =========================
	// GRID
	// =========================
	featureGrid: {
		title: 'Menú principal',
		titleVariant: 'h5',
		titleWeight: 600,
		titleMarginBottom: 2,
		maxWidth: 'lg',
		paddingY: { xs: 3, md: 5 },
		gap: 2,
		fadeInTime: 400,
		desktopItemWidth: '45%',
	},
}
