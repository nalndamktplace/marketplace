import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'

import { polygonMumbai } from '@wagmi/chains'
import { useWeb3Modal } from '@web3modal/react'
import { useAccount, useBalance, useDisconnect, useNetwork, useSigner, useSwitchNetwork } from 'wagmi'

import { hideSpinner, showSpinner } from '../store/actions/spinner'

import { USDC_ADDRESS } from '../config/constants'
import { useSelector } from 'react-redux'
import { isUsable } from '../helpers/functions'
import axios from 'axios'
import { BASE_URL } from '../config/env'

const useWallet = () => {
	const UserState = useSelector(state => state.UserState)
	const BWalletState = useSelector(state => state.BWalletState)

	const dispatch = useDispatch()

	const w3mModal = useWeb3Modal()
	const w3mSigner = useSigner()
	const w3mAccount = useAccount()
	const w3mBalance = useBalance({ address: USDC_ADDRESS })
	const w3mNetwork = useNetwork()
	const w3mDisconnect = useDisconnect()
	const w3mSwitchNetwork = useSwitchNetwork()

	const [Loading, setLoading] = useState(false)

	useEffect(() => {
		if (Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => (w3mAccount.isConnecting || w3mAccount.isReconnecting ? setLoading(true) : setLoading(false)), [w3mAccount])
	useEffect(() => (w3mBalance.isLoading || w3mBalance.isFetching || w3mBalance.isRefetching ? setLoading(true) : setLoading(false)), [w3mBalance])
	useEffect(() => (w3mDisconnect.isLoading ? setLoading(true) : setLoading(false)), [w3mDisconnect])

	return {
		connect: () => w3mModal.open(),
		getBalance: async () => {
			const bal = await axios(`${BASE_URL}/api/user/wallet/balance`, {
				headers: {
					address: w3mAccount.isConnected ? w3mAccount.address : isUsable(BWalletState.smartAccount) ? BWalletState.smartAccount.address : null,
					'user-id': UserState.user.uid,
					authorization: `Bearer ${UserState.tokens.acsTkn.tkn}`,
				},
			})
			if (bal.status === 200) {
				console.log({ balance: bal.data })
				return bal.data
			} else return null
		},
		disconnect: () => w3mDisconnect.disconnect(),
		getAddress: () => (w3mAccount.isConnected ? w3mAccount.address : isUsable(BWalletState.smartAccount) ? BWalletState.smartAccount.address : null),
		isConnected: () => w3mAccount.isConnected || isUsable(BWalletState.smartAccount),
		getNetwork: () => w3mNetwork.chains,
		getSigner: () => w3mSigner.data,
		switchNetwork: networkId => w3mSwitchNetwork.switchNetwork(networkId),
		switchNetworkToMumbai: () => w3mSwitchNetwork.switchNetwork(polygonMumbai.id),
	}
}

export default useWallet
