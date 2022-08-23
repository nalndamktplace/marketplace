import React from 'react'
import { useSelector } from 'react-redux'

import { Grid } from 'react-spinners-css'
import GaTracker from '../../../trackers/ga-tracker'

const Spinner = () => {

	const SpinnerState = useSelector(state => state.SpinnerState)

	const getClasses = () => {
		let classes = ["spinner"]
		if(SpinnerState.show){ 
			GaTracker('event_spinner_show')
			classes.push("spinner--show")
		}
		return classes.join(" ")
	}

	return (
		<div className={getClasses()}>
			<div className="spinner__container">
				<Grid color='#00a2e8'/>
			</div>
		</div>
	)
}

export default Spinner