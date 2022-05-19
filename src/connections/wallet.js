/*
import { sequence } from '0xsequence'
const wallet = new sequence.Wallet()
const Wallet = {
	connect : () => {return (
		wallet.connect({
			app: 'Nalnda Marketplace',
			authorize: true,
			settings: {
				theme: "light",
				includedPaymentProviders: ["moonpay", "ramp"],
				defaultFundingCurrency: "matic",
				lockFundingCurrencyToDefault: false,
			}
		}))
	},
	open: () => {
		wallet.openWallet()
	},
	disconnect: () => {
		wallet.disconnect()
	},
	getSigner: () => {
		return wallet.getSigner()
	}
}

export default Wallet
*/
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import providerOptions from "./providerOptions";

const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
});

let provider;
let connection;

const Wallet = {
    web3Modal,
    connectWallet: async () => {
        connection = await web3Modal.connect();
		provider   = new ethers.providers.Web3Provider(connection) ;
		return connection ;
    },
    disconnectWallet: async () => {
		if(web3Modal.cachedProvider) 
			await web3Modal.clearCachedProvider()
	},
    getSigner: () => {
        return provider.getSigner();
    },
    getProvider: () => {
        return provider;
    },
};

export default Wallet ;