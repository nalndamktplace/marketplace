import { ethers } from "ethers"
import Web3Modal from "web3modal"

import providerOptions from "./providerOptions"

const web3Modal = new Web3Modal({
	cacheProvider: true,
	providerOptions,
})

let provider
let connection

const Wallet = {
	web3Modal,
	connectWallet: async () => {
		connection = await web3Modal.connect()
		provider = new ethers.providers.Web3Provider(connection) 
		return connection 
	},
	disconnectWallet: async () => {
		if(web3Modal.cachedProvider) 
			await web3Modal.clearCachedProvider()
	},
	getSigner: () => {
		return provider.getSigner()
	},
	getProvider: () => {
		return provider
	},
}

export default Wallet 