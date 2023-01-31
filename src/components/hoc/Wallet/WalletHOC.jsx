import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BASE_URL } from '../../../config/env'

import { setSnackbar } from '../../../store/actions/snackbar'
import { showSpinner, hideSpinner } from '../../../store/actions/spinner'

import { isUserLoggedIn } from '../../../helpers/functions'
import useWallet from '../../../hook/useWallet'

const WalletHOC = props => {
	
	const wallet = useWallet()
	const dispatch = useDispatch()

	const UserState = useSelector(state => state.UserState)

	useEffect(() => {
		if(isUserLoggedIn(UserState) && wallet.isConnected()){
			dispatch(showSpinner())
			axios({
				url: BASE_URL+'/api/user/wallet',
				method: 'POST',
				headers: {
					'address': wallet.getAddress(),
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
	}, [dispatch, UserState])

	return null
}

export default WalletHOC