import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Wallet from '../../../connections/wallet'

import { BASE_URL } from '../../../config/env'

import { setWallet } from '../../../store/actions/wallet'
import { setSnackbar } from '../../../store/actions/snackbar'
import { showSpinner, hideSpinner } from '../../../store/actions/spinner'

import { isUserLoggedIn, isWalletConnected } from '../../../helpers/functions'
import GaTracker from '../../../trackers/ga-tracker'

const WalletHOC = props => {
	const dispatch = useDispatch()

	const UserState = useSelector(state => state.UserState)
	const WalletState = useSelector(state => state.WalletState)

	// useEffect(() => {
	// 	if(isUserLoggedIn(UserState) && Wallet.web3Modal.cachedProvider){
	// 		Wallet.connectWallet().then(res => {
	// 			GaTracker('event_walletHoc_wallet_connect')
	// 			dispatch(setWallet({ wallet: res.wallet, provider: res.provider, signer: res.signer, address: res.address }))
	// 		}).catch(err => { })
	// 	}
	// }, [dispatch, UserState])

	// useEffect(() => {
	// 	if(isWalletConnected(WalletState)){
	// 		WalletState.wallet.wallet.on("accountsChanged", accounts => {GaTracker('event_walletHoc_account_changed');console.log({accounts})})
	// 		WalletState.wallet.wallet.on("chainChanged", chainId => {GaTracker('event_walletHoc_chain_changed');console.log({chainId})})
	// 		WalletState.wallet.wallet.on("disconnect", () => {GaTracker('event_walletHoc_wallet_disconnect');console.log("Wallet Disconnected")})
	// 	}
	// 	return () => {
	// 		if(isWalletConnected(WalletState)){
	// 			WalletState.wallet.wallet.on("accountsChanged", accounts => {GaTracker('event_walletHoc_account_changed');console.log({accounts})})
	// 			WalletState.wallet.wallet.on("chainChanged", chainId => {GaTracker('event_walletHoc_chain_changed');console.log({chainId})})
	// 			WalletState.wallet.wallet.on("disconnect", () => {GaTracker('event_walletHoc_wallet_disconnect');console.log("Wallet Disconnected")})
	// 		}
	// 	}
	// }, [WalletState])

	// useEffect(() => {
	// 	if(isUserLoggedIn(UserState) && isWalletConnected(WalletState)){
	// 		dispatch(showSpinner())
	// 		axios({
	// 			url: BASE_URL+'/api/user/wallet',
	// 			method: 'POST',
	// 			headers: {
	// 				'address': WalletState.wallet.address,
	// 				'user-id': UserState.user.uid,
	// 				'authorization': `Bearer ${UserState.tokens.acsTkn.tkn}`
	// 			}
	// 		}).then(res => {
	// 			if(res.status === 200) dispatch(setSnackbar({show: true, message: "Wallet Connected!", type: 1}))
	// 			else dispatch(setSnackbar('ERROR'))
	// 		}).catch(err => {
	// 			dispatch(setSnackbar('ERROR'))
	// 		}).finally(() => {
	// 			dispatch(hideSpinner())
	// 		})
	// 	}
	// }, [WalletState, dispatch, UserState])

	return null
}

export default WalletHOC