import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setWallet } from '../../../store/actions/wallet'
import Wallet from '../../../connections/wallet'

const WalletHOC = props => {

	const dispatch = useDispatch()

	useEffect(() => {
		if(Wallet.web3Modal.cachedProvider){
			Wallet.connectWallet().then(res => {
				dispatch(setWallet({ wallet: res.wallet, provider: res.provider, signer: res.signer, address: res.address }))
			}).catch(err => {
				// navigate('/')
				// console.error({err})
			})
		}
	}, [dispatch])

	return null
}

export default WalletHOC