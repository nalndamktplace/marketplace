import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'

import { polygonMumbai } from '@wagmi/chains'
import { useWeb3Modal } from '@web3modal/react'
import { useAccount, useBalance, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi'

import { hideSpinner, showSpinner } from '../store/actions/spinner'

import { USDC_ADDRESS } from '../config/constants'

const useWallet = () => {
	const dispatch = useDispatch()

	const w3mModal = useWeb3Modal()
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
		getBalance: () => w3mBalance.data,
		disconnect: () => w3mDisconnect.disconnect(),
		getAddress: () => w3mAccount.address(),
		isConnected: () => w3mAccount.isConnected,
		getNetwork: () => w3mNetwork.chains,
		switchNetwork: networkId => w3mSwitchNetwork.switchNetwork(networkId),
		// switchNetworkToMumbai: () => w3mSwitchNetwork.switchNetwork(polygonMumbai.id),
		switchNetworkToMumbai: () => w3mSwitchNetwork.switchNetwork(80001),
	}
}

export default useWallet
