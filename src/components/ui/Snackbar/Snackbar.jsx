import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { unsetSnackbar } from '../../../store/actions/snackbar'

import CloseIconSuccess from '../../../assets/icons/close-green.svg'
import CloseIconInfo from '../../../assets/icons/close-blue.svg'
import CloseIconWarn from '../../../assets/icons/close-yellow.svg'
import CloseIconDanger from '../../../assets/icons/close-red.svg'

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

	const getSnackbarIcon = () => {
		switch (SnackbarState.type) {
			case 1: return CloseIconSuccess
			case 2:	return CloseIconInfo
			case 3: return CloseIconWarn
			case 4: return CloseIconDanger
			default: return CloseIconSuccess
		}
	}

	return (
		<div className={getSnackbarClasses()}>
			<p className={getSnackbarMessageClasses()}>{SnackbarState.message}</p>
			<img onClick={closeSnackbar} className='snackbar__icon' src={getSnackbarIcon()} alt={"Close"}/>
		</div>
	)
}

export default Snackbar