import { ethers } from "ethers"
import Web3Modal from "web3modal"

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
		connection = await web3Modal.connect()
		provider = new ethers.providers.Web3Provider(connection) 
		signer = provider.getSigner()
		return connection 
	},
	disconnectWallet: async () => {
		if(web3Modal.cachedProvider) 
			await web3Modal.clearCachedProvider()
	},
	getSigner: () => {
		return signer
	},
	getProvider: () => {
		return provider
	},
	getAccountAddress: async () => {
		console.log({address: await signer.getAddress()})
		const address = await signer.getAddress()
		return(address)
	}
}

export default Wallet 