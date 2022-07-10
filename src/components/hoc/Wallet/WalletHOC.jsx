import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Wallet from '../../../connections/wallet'

import { setWallet } from '../../../store/actions/wallet'

import { useSelector } from 'react-redux'
import { isWalletConnected } from '../../../helpers/functions'

const WalletHOC = props => {

	const dispatch = useDispatch()

	const WalletState = useSelector(state => state.WalletState)

	useEffect(() => {
		if(Wallet.web3Modal.cachedProvider){
			Wallet.connectWallet().then(res => {
				dispatch(setWallet({ wallet: res.wallet, provider: res.provider, signer: res.signer, address: res.address }))
			}).catch(err => { })
		}
	}, [dispatch])

	useEffect(() => {
		if(isWalletConnected(WalletState)){
			WalletState.wallet.wallet.on("accountsChanged", accounts => console.log({accounts}))
			WalletState.wallet.wallet.on("chainChanged", chainId => console.log({chainId}))
			WalletState.wallet.wallet.on("disconnect", () => console.log("Wallet Disconnected"))
		}
		return () => {
			if(isWalletConnected(WalletState)){
				WalletState.wallet.wallet.on("accountsChanged", accounts => console.log({accounts}))
				WalletState.wallet.wallet.on("chainChanged", chainId => console.log({chainId}))
				WalletState.wallet.wallet.on("disconnect", () => console.log("Wallet Disconnected"))
			}
		}
	}, [WalletState])

	return null
}

export default WalletHOC