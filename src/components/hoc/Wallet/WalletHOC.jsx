import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Wallet from '../../../connections/wallet'

import { setUser } from '../../../store/actions/user'
import { setWallet } from '../../../store/actions/wallet'

import { BASE_URL } from '../../../config/env'

const WalletHOC = props => {

	const dispatch = useDispatch()

	useEffect(() => {
		if(Wallet.web3Modal.cachedProvider){
			Wallet.connectWallet().then(res => {
				dispatch(setWallet({ wallet: res.wallet, provider: res.provider, signer: res.signer, address: res.address }))
				axios({
					url: BASE_URL+'/api/user/login',
					method: 'POST',
					headers: {
						'address': res.address 
					}
				}).then(res => {
					if(res.status === 200) dispatch(setUser(res.data))
				}).catch(err => {
				}).finally( () => {
				})
			}).catch(err => {
				// navigate('/')
			})
		}
	}, [dispatch])

	return null
}

export default WalletHOC