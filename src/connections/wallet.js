import { ethers } from "ethers"
import Web3Modal from "web3modal"
import { isUsable } from '../helpers/functions'

import providerOptions from "./providerOptions"

import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";
import SocialLogin from "@biconomy/web3-auth";

// const web3Modal = new Web3Modal({
// 	cacheProvider: true,
// 	network: "polygon",
// 	providerOptions
// })



// const Wallet = {
// web3Modal,
// connectWallet: async () => {
// 	const provider = await web3Modal.connect()
// 	const ethersProvider = new ethers.providers.Web3Provider(provider)
// 	if (isUsable(provider.sequence)) ethersProvider.sequence = provider.sequence
// 	const signer = ethersProvider.getSigner()
// 	const address = await signer.getAddress()
// 	const balance = (await ethersProvider.getBalance("fEc014B41506430F055ceff9A007e690D409b304")).toNumber()
// 	console.log({balance})
// 	const network = (await ethersProvider.getNetwork()).chainId
// 	console.log({network})
// 	const accounts = (await ethersProvider.listAccounts())
// 	console.log({accounts})
// 	return {wallet: ethersProvider, provider, signer, address, network, accounts}
// },

// connectWallet: async () =>{
// 	const { provider } =  await web3Modal.connect();
// 	const walletProvider = new ethers.providers.Web3Provider(provider)

// 	let options = {
// 		activeNetworkId: ChainId.POLYGON_MUMBAI,
// 		supportedNetworksIds: [  ChainId.POLYGON_MUMBAI]}

// 	let smartAccount = new SmartAccount(walletProvider, options);
// 	smartAccount = await smartAccount.init();
// 	const address = smartAccount.address;
// 	console.log('address', address);

// },
// disconnectWallet: async () => {
// 	web3Modal.clearCachedProvider()
// },
// signMessage: async (signer, message) => {
// 	const sig = await signer.signMessage(message)
// 	return {signedData: sig, isValid: true}
// }

// }

async function Wallet() {

	// init wallet
	const socialLoginSDK = new SocialLogin();
	await socialLoginSDK.init('0x5');    // Enter the network id in init() parameter
	socialLoginSDK.showConnectModal();

	// show connect modal
	socialLoginSDK.showWallet();

	if (!socialLoginSDK?.web3auth?.provider) return;
	const provder = new ethers.providers.Web3Provider(
		socialLoginSDK.web3auth.provider,
	);
	const accounts = await provder.listAccounts();
	console.log("EOA address", accounts)

	// // get signature
	// const signature = const a = await socialLoginSDK.whitelistUrl('https://yourdomain.com');

	// // pass while initialization
	// const socialLoginSDK = await socialLoginSDK.init(ethers.utils.hexValue(5), {
	// 	'http://localhost:3001': signature
	// });

	// const { provider } = await web3Modal.connect();
	const walletProvider = new ethers.providers.Web3Provider(provider)

	let options = {
		activeNetworkId: ChainId.POLYGON_MUMBAI,
		supportedNetworksIds: [ChainId.POLYGON_MUMBAI]
	}

	let smartAccount = new SmartAccount(walletProvider, options);
	smartAccount = await smartAccount.init();
	const address = smartAccount.address;
	console.log('address', address);

}



export default Wallet