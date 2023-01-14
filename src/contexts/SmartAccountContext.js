import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import SmartAccount from '@biconomy/smart-account'
import { SmartAccountState, SmartAccountVersion } from '@biconomy/core-types'
import { supportedChains, activeChainId } from '../config/wallet'
import { useWeb3AuthContext } from './SocialLoginContext'
import { USDC_ADDRESS } from '../config/constants'

export const ChainId = {
	MAINNET: 1, // Ethereum
	GOERLI: 5,
	POLYGON_MUMBAI: 80001,
	POLYGON_MAINNET: 137,
}

export const SmartAccountContext = React.createContext({
	wallet: null,
	state: null,
	balance: {
		totalBalanceInUsd: 0,
		alltokenBalances: [],
	},
	loading: false,
	isFetchingBalance: false,
	selectedAccount: null,
	smartAccountsArray: [],
	setSelectedAccount: () => {},
	getSmartAccount: () => Promise.resolve(''),
	getSmartAccountBalance: () => Promise.resolve(''),
	getWalletBalance: () => Promise.resolve(''),
})
export const useSmartAccountContext = () => useContext(SmartAccountContext)

// Provider
export const SmartAccountProvider = ({ children }) => {
	const { provider, address } = useWeb3AuthContext()
	const [wallet, setWallet] = useState(null)
	const [state, setState] = useState(null)
	const [selectedAccount, setSelectedAccount] = useState(null)
	const [smartAccountsArray, setSmartAccountsArray] = useState([])
	const [balance, setBalance] = useState({
		totalBalanceInUsd: 0,
		alltokenBalances: [],
	})
	const [isFetchingBalance, setIsFetchingBalance] = useState(false)
	const [loading, setLoading] = useState(false)

	const getSmartAccount = useCallback(async () => {
		if (!provider || !address) return 'Wallet not connected'

		try {
			setLoading(true)
			const walletProvider = new ethers.providers.Web3Provider(provider)
			console.log('walletProvider', walletProvider)
			// New instance, all config params are optional
			const wallet = new SmartAccount(walletProvider, {
				activeNetworkId: activeChainId,
				supportedNetworksIds: supportedChains,
				networkConfig: [
					{
						chainId: ChainId.POLYGON_MUMBAI,
						dappAPIKey: 'KW8u8Hxug.e88a2f4a-8448-42e8-8af1-50f09681a19c',
					},
					{
						chainId: ChainId.POLYGON_MAINNET,
						// dappAPIKey: todo
					},
				],
			})
			console.log('wallet', wallet)

			// Wallet initialization to fetch wallet info
			const smartAccount = await wallet.init()
			setWallet(wallet)
			console.info('smartAccount', smartAccount)

			smartAccount.on('txHashGenerated', response => {
				console.log('txHashGenerated event received in AddLP via emitter', response)
			})

			smartAccount.on('txHashChanged', response => {
				console.log('txHashChanged event received in AddLP via emitter', response)
			})

			smartAccount.on('txMined', response => {
				console.log('txMined event received in AddLP via emitter', response)
			})

			smartAccount.on('error', response => {
				console.log('error event received in AddLP via emitter', response)
			})

			// get all smart account versions available and update in state
			const { data } = await smartAccount.getSmartAccountsByOwner({
				chainId: activeChainId,
				owner: address,
			})
			console.info('getSmartAccountsByOwner', data)
			const accountData = []
			for (let i = 0; i < data.length; ++i) {
				accountData.push(data[i])
			}
			setSmartAccountsArray(accountData)
			// set the first wallet version as default
			if (accountData.length) {
				wallet.setSmartAccountVersion(accountData[0].version)
				setSelectedAccount(accountData[0])
			}

			// get address, isDeployed and other data
			const state = await smartAccount.getSmartAccountState()
			setState(state)
			console.info('getSmartAccountState', state)

			setLoading(false)
			return ''
		} catch (error) {
			setLoading(false)
			console.error({ getSmartAccount: error })
			return error.message
		}
	}, [provider, address])

	const getSmartAccountBalance = async () => {
		if (!provider || !address) return 'Wallet not connected'
		if (!state || !wallet) return 'Init Smart Account First'

		try {
			setIsFetchingBalance(true)
			// ethAdapter could be used like this
			// const bal = await wallet.ethersAdapter().getBalance(state.address);
			// console.log(bal);
			// you may use EOA address my goerli SCW 0x1927366dA53F312a66BD7D09a88500Ccd16f175e
			const balanceParams = {
				chainId: activeChainId,
				eoaAddress: state.address,
				tokenAddresses: [USDC_ADDRESS],
			}
			const balFromSdk = await wallet.getAlltokenBalances(balanceParams)
			console.info('getAlltokenBalances', balFromSdk)

			const usdBalFromSdk = await wallet.getTotalBalanceInUsd(balanceParams)
			console.info('getTotalBalanceInUsd', usdBalFromSdk)
			setBalance({
				totalBalanceInUsd: usdBalFromSdk.data.totalBalance,
				alltokenBalances: balFromSdk.data,
			})
			setIsFetchingBalance(false)
			return ''
		} catch (error) {
			setIsFetchingBalance(false)
			console.error({ getSmartAccountBalance: error })
			return error.message
		}
	}

	const getWalletBalance = async () => {
		if (!provider || !address) return 'Wallet not connected'
		if (!state || !wallet) return 'Init Smart Account First'

		try {
			setIsFetchingBalance(true)
			const balanceParams = {
				chainId: ChainId.POLYGON_MUMBAI,
				eoaAddress: state.address,
				tokenAddresses: [USDC_ADDRESS],
			}
			const balances = await wallet.getAlltokenBalances(balanceParams)
			const usdc = balances.data.filter(token => token.contract_address === USDC_ADDRESS)[0]
			usdc.balance = ethers.utils.formatUnits(usdc?.balance, 'mwei')
			setIsFetchingBalance(false)
			return usdc
		} catch (error) {
			setIsFetchingBalance(false)
			console.error({ getWalletBalance: error })
			return error.message
		}
	}

	useEffect(() => {
		if (wallet && selectedAccount) {
			console.log('setSmartAccountVersion', selectedAccount)
			wallet.setSmartAccountVersion(selectedAccount.version)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedAccount])

	return (
		<SmartAccountContext.Provider
			value={{
				wallet,
				state,
				balance,
				loading,
				isFetchingBalance,
				selectedAccount,
				smartAccountsArray,
				setSelectedAccount,
				getSmartAccount,
				getSmartAccountBalance,
				getWalletBalance,
			}}>
			{children}
		</SmartAccountContext.Provider>
	)
}
