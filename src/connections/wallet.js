import { ethers } from "ethers"
import { sequence } from '0xsequence'
import Web3Modal from '@0xsequence/web3modal'
import { configureLogger } from '@0xsequence/utils'

import GaTracker from '../trackers/ga-tracker'

import providerOptions from "./providerOptions"

// Switch this to DEBUG to debug the wallet
configureLogger({ logLevel: 'DISABLED' })

const web3Modal = new Web3Modal({
	cacheProvider: true,
	providerOptions,
})

const Wallet = {
	web3Modal,
	connectWallet: async () => {
		if (web3Modal.cachedProvider) web3Modal.clearCachedProvider()
		GaTracker('event_wallet_connection_connect')
		const wallet = await web3Modal.connect()
		const localProvider = new ethers.providers.Web3Provider(wallet)
		if (wallet.sequence) localProvider.sequence = wallet.sequence
		const provider = localProvider
		const signer = provider.getSigner()
		const address = await signer.getAddress()
		return {wallet, provider, signer, address}
	},
	disconnectWallet: async (provider) => {
		GaTracker('event_wallet_connection_disconnect')
		web3Modal.clearCachedProvider()
		if (provider && provider.sequence) {
			const wallet = provider.sequence
			wallet.disconnect()
		}
	},
	getChainID: async (signer) => {
		return signer.getChainId()
	},
	getAccountAddress: async (signer) => {
		GaTracker('event_wallet_connection_get_address')
		return await signer.getAddress()
	},
	getAccounts: async (provider) => {
		GaTracker('event_wallet_connection_get_accounts')
		return await provider.listAccounts()
	},
	getSigner: async (provider) => {
		GaTracker('event_wallet_connection_get_signer')
		return provider.getSigner()
	},
	getProvider: async() => {
		GaTracker('event_wallet_connection_get_provider')
		const wallet = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(wallet)
		if (wallet.sequence) provider.sequence = wallet.sequence
		return provider
	},
	getBalance: async (provider) => {
		const signer = provider.getSigner()
		const account = await signer.getAddress()
		const balanceChk1 = await provider.getBalance(account)
		const balanceChk2 = await signer.getBalance()
		return balanceChk1.toString()
	},
	getNetworks: async (provider) => {
		return await provider.getNetwork()
	},
	signMessage: async (provider, message) => {
		const signer = await provider.getSigner()
		const sig = await signer.signMessage(message)
		const isValid = await sequence.utils.isValidMessageSignature(await signer.getAddress(), message, sig, provider)
		return {signedData: sig, isValid: isValid}
	}
}

export default Wallet 