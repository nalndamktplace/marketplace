import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { isUsable } from '../../../helpers/functions'
import { setSnackbar } from '../../../store/actions/snackbar'
import { web3IsNotSupported, web3IsSupported } from '../../../store/actions/wallet'
import GaTracker from '../../../trackers/ga-tracker'

const WalletHOC = props => {

	const dispatch = useDispatch()

	useEffect(() => {
		if(isUsable(window.ethereum)){
			dispatch(web3IsSupported())

			// const getAccount = async () => {
			// 	try{
			// 		const accounts = await window.ethereum.enable()
			// 		if(accounts.length>0){
			// 			const account = accounts[0]
			// 			dispatch(setWallet(account))
			// 		}
			// 	} catch (error) {
			// 		console.error({error})
			// 		if(error.indexOf('wallet_requestPermissions')>-1) dispatch(setSnackbar({show: true, message: "Please connect a wallet.", type: 3}))
			// 		else dispatch(setSnackbar({show: true, message: error,type: 4}))
			// 	}
			// }

			// const onAccountChange = () => {
			// 	GaTracker('event_wallet_change')
			// 	getAccount()
			// }

			// window.ethereum.on('connect', (connectInfo) => { })

			window.ethereum.on('chainChanged', (chainId) => {
				GaTracker('event_wallet_chain_change')
				// We recommend reloading the page unless you have good reason not to.
				if(chainId !== "0x13881"){
					let chain
					if(chainId === "0x1") chain = "Main Network"
					else if(chainId === "0x3") chain = "Ropsten Network"
					else if(chainId === "0x2a") chain = "Kava Network"
					else if(chainId === "0x4") chain = "Rinkeby Network"
					else if(chainId === "0x5") chain = "Goerli Network"
					else chain = null
					dispatch(setSnackbar({show: true, message: (chain!==null?`You are currently on ${chain}. `:null)+"Please switch to Mumbai Test Network to continue.", type: 3}))
				}
			})

			// window.ethereum.on('accountsChanged', () => onAccountChange())

			return () => {
				// window.ethereum.removeListener('accountsChanged', () => onAccountChange())
				window.ethereum.removeListener('chainChanged', ()=>{})
			}
		}
		else dispatch(web3IsNotSupported())
	}, [dispatch])

	return null
}

export default WalletHOC