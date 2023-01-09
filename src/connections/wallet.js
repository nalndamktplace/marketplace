import { ethers } from 'ethers'

import { ChainId } from '@biconomy/core-types'

import SmartAccount from '@biconomy/smart-account'

import { setSmartAccount } from '../store/actions/bwallet'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

async function Wallet(provider, dispatch) {
	dispatch(showSpinner())
	const walletProvider = new ethers.providers.Web3Provider(provider)

	// Initialize the Smart Account
	let options = {
		activeNetworkId: ChainId.POLYGON_MUMBAI,
		supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
	}

	let smartAccount = new SmartAccount(walletProvider, options)
	smartAccount = await smartAccount.init()
	dispatch(setSmartAccount({ smartAccount }))
	const smartAccountSigner = smartAccount.signer
	const address = smartAccount.address
	console.log('address', address)
	dispatch(hideSpinner())
	const checkBalance = async () => {
		const balanceParams = {
			chainId: ChainId.POLYGON_MUMBAI, // chainId of your choice
			eoaAddress: smartAccount.address,
			tokenAddresses: ['0xfEc014B41506430F055ceff9A007e690D409b304'],
		}
		const balFromSdk = await smartAccount.getAlltokenBalances(balanceParams)
		console.info('getAlltokenBalances', balFromSdk)

		const usdBalFromSdk = await smartAccount.getTotalBalanceInUsd(balanceParams)
		console.info('getTotalBalanceInUsd', usdBalFromSdk)
	}
	checkBalance()
}

export default Wallet
