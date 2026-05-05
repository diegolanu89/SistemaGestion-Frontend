// components/EtcGrid.tsx

import { FC } from 'react'
import { useEtcContext } from '../hooks/useEtcContext.h'

export const EtcGrid: FC = () => {
	const { entries, updateEntry } = useEtcContext()

	return (
		<div className="etc-grid">
			{entries.map((e, i) => (
				<div key={i} className="etc-row">
					<span>{e.userName}</span>
					<span>{e.monthLabel}</span>

					<input type="number" value={e.hours} onChange={(ev) => updateEntry(i, Number(ev.target.value))} />
				</div>
			))}
		</div>
	)
}
