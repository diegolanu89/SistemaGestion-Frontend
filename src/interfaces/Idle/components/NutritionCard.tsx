// views/Idle/components/NutritionCard.tsx
import React, { memo } from 'react'
import { Card, CardActionArea, CardContent, Typography, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { IDLE_CONFIG } from '../models/Idle.m'
import { motionMui, myMotion } from '../../base/utils/motions'
import type { Theme } from '@mui/material/styles'

const MotionCard = motionMui(Card)

const NutritionCard: React.FC = memo(() => {
	const navigate = useNavigate()
	const { title, description, route, icon: Icon } = IDLE_CONFIG.nutritionCard

	return (
		<MotionCard
			variant="outlined"
			initial={{ opacity: 0, y: 24, scale: 0.96 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
			sx={{
				height: 140,
				display: 'flex',
				transition: (theme: Theme) =>
					theme.transitions.create(['transform', 'box-shadow'], {
						duration: theme.transitions.duration.short,
					}),
				'&:hover': {
					transform: 'translateY(-2px) scale(1.01)',
					boxShadow: (theme: Theme) => theme.shadows[6],
				},
				'&:focus-within': {
					boxShadow: (theme: Theme) => theme.shadows[6],
				},
			}}
		>
			<CardActionArea onClick={() => navigate(route)} aria-label={`Ir al módulo de ${title}`} sx={{ display: 'flex', alignItems: 'stretch' }}>
				{/* Panel visual */}
				<Box
					sx={{
						width: { xs: '38%', sm: '34%', md: '32%' },
						minWidth: 120,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						background: (theme) =>
							theme.palette.mode === 'light'
								? 'linear-gradient(135deg, rgba(25,118,210,0.18), rgba(25,118,210,0.05))'
								: 'linear-gradient(135deg, rgba(144,202,249,0.18), rgba(144,202,249,0.05))',
						borderRight: (theme) => `1px solid ${theme.palette.divider}`,
					}}
				>
					<myMotion.div initial={{ scale: 0.7, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}>
						<Icon sx={{ fontSize: 54, color: 'primary.main' }} />
					</myMotion.div>
				</Box>

				{/* Contenido */}
				<Box sx={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
					<CardContent sx={{ py: 2, px: 2 }}>
						<Typography variant="h6" component="h3" gutterBottom noWrap>
							{title}
						</Typography>

						<Typography
							variant="body2"
							color="text.secondary"
							sx={{
								display: '-webkit-box',
								WebkitLineClamp: 2,
								WebkitBoxOrient: 'vertical',
								overflow: 'hidden',
							}}
						>
							{description}
						</Typography>
					</CardContent>
				</Box>
			</CardActionArea>
		</MotionCard>
	)
})

export default NutritionCard
