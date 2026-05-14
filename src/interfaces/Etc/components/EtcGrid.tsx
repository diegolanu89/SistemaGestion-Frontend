// components/EtcGrid.tsx

import { FC } from 'react'

import { useEtcContext } from '../hooks/useEtcContext.h'

export const EtcGrid: FC = () => {
	const { entries, updateEntry } = useEtcContext()

	return (
		<div className="etc-grid">
			<div className="etc-grid__table-wrapper">
				<table className="etc-grid__table">
					<thead>
						<tr>
							<th>RECURSO</th>
							<th>MES</th>
							<th>HORAS ETC</th>
						</tr>
					</thead>

					<tbody>
						{entries.map((e, i) => (
							<tr key={`${e.userName}-${e.monthKey}-${i}`} className="etc-grid__row">
								<td>
									<div className="etc-grid__user">
										<div className="etc-grid__avatar">{e.userName.charAt(0).toUpperCase()}</div>

										<span className="etc-grid__user-name">{e.userName}</span>
									</div>
								</td>

								<td>
									<span className="etc-grid__month">{e.monthLabel}</span>
								</td>

								<td>
									<div className="etc-grid__hours">
										<input
											type="number"
											min={0}
											step={1}
											value={e.hours}
											onChange={(ev) => updateEntry(i, Number(ev.target.value))}
											className="etc-grid__input"
										/>

										<span className="etc-grid__hours-label">hs</span>
									</div>
								</td>
							</tr>
						))}

						{entries.length === 0 && (
							<tr>
								<td colSpan={3} className="etc-grid__empty">
									No hay registros ETC
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}
