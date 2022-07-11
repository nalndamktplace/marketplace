import { ethers } from "ethers"
import Web3Modal from "web3modal"
import { isUsable } from '../helpers/functions'

import providerOptions from "./providerOptions"

const web3Modal = new Web3Modal({
	cacheProvider: true,
	network: "polygon",
	providerOptions
})

const Wallet = {
	web3Modal,
	connectWallet: async () => {
		const provider = await web3Modal.connect()
		const ethersProvider = new ethers.providers.Web3Provider(provider)
		if (isUsable(provider.sequence)) ethersProvider.sequence = provider.sequence
		const signer = ethersProvider.getSigner()
		const address = await signer.getAddress()
		const balance = (await ethersProvider.getBalance("fEc014B41506430F055ceff9A007e690D409b304")).toNumber()
		console.log({balance})
		const network = (await ethersProvider.getNetwork()).chainId
		console.log({network})
		const accounts = (await ethersProvider.listAccounts())
		console.log({accounts})
		return {wallet: ethersProvider, provider, signer, address, network, accounts}
	},
	disconnectWallet: async () => {
		web3Modal.clearCachedProvider()
	},
	signMessage: async (signer, message) => {
		const sig = await signer.signMessage(message)
		return {signedData: sig, isValid: true}
	}

}

export default Wallet