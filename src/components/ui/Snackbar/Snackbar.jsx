import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { unsetSnackbar } from '../../../store/actions/snackbar'

import {ReactComponent as CloseIcon} from '../../../assets/icons/close-icon.svg'
import GaTracker from '../../../trackers/ga-tracker'

const Snackbar = props => {

	const dispatch = useDispatch()

	const SnackbarState = useSelector(state => state.SnackbarState)

	useEffect(() => {
		if(SnackbarState.show){
			const timeout = setTimeout(() => {
				dispatch(unsetSnackbar())
			}, 7500)
			return ()=>clearTimeout(timeout)
		}
	}, [SnackbarState, dispatch])
	

	const closeSnackbar = () => { dispatch(unsetSnackbar()) }

	const getSnackbarClasses = () => {
		let classes = ['snackbar']
		if(SnackbarState.show === false) classes.push('snackbar--hidden') 
		else GaTracker('event_snackbar_show')
		return classes.join(" ")
	}

	const getSnackbarMessageClasses = () => {
		let classes = ['typo typo__body']
		switch (SnackbarState.type) {
			case 1:
				classes.push('typo__color--success')
				break
			case 2:
				classes.push('typo__color--info')
				break
			case 3:
				classes.push('typo__color--warning')
				break
			case 4:
				classes.push('typo__color--danger')
				break
			default:
				return classes.join(" ")
		}
		return classes.join(" ")
	}

	const getCloseIconClasses = () => {
		let classes = ['snackbar__icon']
		switch (SnackbarState.type) {
			case 1: classes.push('typo__color--success'); break
			case 2:	classes.push('typo__color--info'); break
			case 3: classes.push('typo__color--warning'); break
			case 4: classes.push('typo__color--danger'); break
			default: classes.push('typo__color--info'); break
		}
		return classes.join(' ')
	}

	return (
		<div className={getSnackbarClasses()}>
			<p className={getSnackbarMessageClasses()}>{SnackbarState.message}</p>
			<CloseIcon onClick={closeSnackbar} className={getCloseIconClasses()}/>
		</div>
	)
}

export default Snackbar