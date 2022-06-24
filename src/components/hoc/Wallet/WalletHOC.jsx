import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

import { isFilled, isUsable } from '../../../helpers/functions'
import { setSnackbar } from '../../../store/actions/snackbar'
import { setWallet, web3IsNotSupported, web3IsSupported } from '../../../store/actions/wallet'
import GaTracker from '../../../trackers/ga-tracker'
import jc from 'json-cycle'

const WalletHOC = props => {

	const dispatch = useDispatch()

	const WalletState = useSelector(state => state.WalletState)

	// useEffect(() => {
	// 	if(!isUsable(WalletState.wallet.provider)){
	// 		if(isFilled(localStorage.getItem('wallet'))){
	// 			dispatch(setWallet({ wallet: jc.retrocycle(JSON.parse(localStorage.getItem('wallet'))), provider: jc.retrocycle(JSON.parse(localStorage.getItem('provider'))), signer: jc.retrocycle(JSON.parse(localStorage.getItem('signer'))), address: JSON.parse(localStorage.getItem('address')) }))
	// 		}
	// 	}
	// }, [WalletState, dispatch])

	// useEffect(() => {
		// if(isUsable(window.ethereum)){
		// 	dispatch(web3IsSupported())

			// const getAccount = async () => {
			// 	try{
			// 		const accounts = await window.ethereum.enable()
			// 		if(accounts.length>0){
			// 			const account = accounts[0]
			// 			dispatch(setWallet(account))
			// 		}
			// 	} catch (error) {
			// 		if(error.indexOf('wallet_requestPermissions')>-1) dispatch(setSnackbar({show: true, message: "Please connect a wallet.", type: 3}))
			// 		else dispatch(setSnackbar({show: true, message: error,type: 4}))
			// 	}
			// }

			// const onAccountChange = () => {
			// 	GaTracker('event_wallet_change')
			// 	getAccount()
			// }

			// window.ethereum.on('connect', (connectInfo) => { })

			// window.ethereum.on('chainChanged', (chainId) => {
			// 	GaTracker('event_wallet_chain_change')
			// 	// We recommend reloading the page unless you have good reason not to.
			// 	if(chainId !== "0x13881"){
			// 		let chain
			// 		if(chainId === "0x1") chain = "Main Network"
			// 		else if(chainId === "0x3") chain = "Ropsten Network"
			// 		else if(chainId === "0x2a") chain = "Kava Network"
			// 		else if(chainId === "0x4") chain = "Rinkeby Network"
			// 		else if(chainId === "0x5") chain = "Goerli Network"
			// 		else chain = null
			// 		dispatch(setSnackbar({show: true, message: (chain!==null?`You are currently on ${chain}. `:null)+"Please switch to Mumbai Test Network to continue.", type: 3}))
			// 	}
			// })

			// window.ethereum.on('accountsChanged', () => onAccountChange())

			// return () => {
				// window.ethereum.removeListener('accountsChanged', () => onAccountChange())
				// window.ethereum.removeListener('chainChanged', ()=>{})
			// }
		// }
		// else dispatch(web3IsNotSupported())
	// }, [dispatch])

	return null
}

export default WalletHOC