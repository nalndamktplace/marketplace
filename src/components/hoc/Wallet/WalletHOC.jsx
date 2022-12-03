import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Wallet from '../../../connections/wallet'

import { BASE_URL } from '../../../config/env'

import { setWallet } from '../../../store/actions/wallet'
import { setSnackbar } from '../../../store/actions/snackbar'
import { showSpinner, hideSpinner } from '../../../store/actions/spinner'

import { isUserLoggedIn, isWalletConnected, isUsable } from '../../../helpers/functions'
import GaTracker from '../../../trackers/ga-tracker'

const WalletHOC = props => {
	
	const dispatch = useDispatch()

	const UserState = useSelector(state => state.UserState)
	const BWalletState = useSelector(state => state.BWalletState)

	useEffect(() => {
		if(isUserLoggedIn(UserState) && isUsable(BWalletState.smartAccount)){
			dispatch(showSpinner())
			axios({
				url: BASE_URL+'/api/user/wallet',
				method: 'POST',
				headers: {
					'address': BWalletState.smartAccount.address,
					'user-id': UserState.user.uid,
					'authorization': `Bearer ${UserState.tokens.acsTkn.tkn}`
				}
			}).then(res => {
				if(res.status === 200) dispatch(setSnackbar({show: true, message: "Wallet Connected!", type: 1}))
				else dispatch(setSnackbar('ERROR'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => {
				dispatch(hideSpinner())
			})
		}
	}, [BWalletState, dispatch, UserState])

	return null
}

export default WalletHOC