import { ethers } from "ethers"
import Web3Modal from "web3modal"
import { isUsable } from '../helpers/functions'
import providerOptions from "./providerOptions"

import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";
import SocialLogin from "@biconomy/web3-auth";

async function Wallet(setSDK) {

	// init wallet
	const socialLoginSDK = new SocialLogin();
	await socialLoginSDK.init('0x13881');    
	socialLoginSDK.showConnectModal();

	// show connect modal
	socialLoginSDK.showWallet();
	console.log(socialLoginSDK)

	if (!socialLoginSDK?.web3auth?.provider) return;
	const provider = new ethers.providers.Web3Provider(
		socialLoginSDK.web3auth.provider,
	);
	const accounts = await provider.listAccounts();
	console.log("EOA address", accounts)

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