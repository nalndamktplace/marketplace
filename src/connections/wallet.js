import { ethers } from "ethers"
import Web3Modal from "web3modal"

import GaTracker from '../trackers/ga-tracker'

import providerOptions from "./providerOptions"

const web3Modal = new Web3Modal({
	cacheProvider: true,
	providerOptions,
})

let signer
let provider
let connection

const Wallet = {
	web3Modal,
	connectWallet: async () => {
		GaTracker('event_wallet_connection_connect')
		connection = await web3Modal.connect()
		provider = new ethers.providers.Web3Provider(connection) 
		signer = provider.getSigner()
		return connection 
	},
	disconnectWallet: async () => {
		GaTracker('event_wallet_connection_disconnect')
		if(web3Modal.cachedProvider) 
			await web3Modal.clearCachedProvider()
	},
	getSigner: () => {
		GaTracker('event_wallet_connection_get_signer')
		return signer
	},
	getProvider: () => {
		GaTracker('event_wallet_connection_get_provider')
		return provider
	},
	getAccountAddress: async () => {
		GaTracker('event_wallet_connection_get_address')
		const address = await signer.getAddress()
		return(address)
	}
}

export default Wallet 