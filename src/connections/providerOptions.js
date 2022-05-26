import { sequence } from "0xsequence"
// import WalletConnectProvider from "@walletconnect/web3-provider"
// import CoinbaseWalletSDK from "@coinbase/wallet-sdk"

const providerOptions = {
	sequence: {
		package: sequence,
		options: {
			appName: "Nalnda",
			defaultNetwork: "mumbai",
		},
	},
	// walletconnect: {
	//	 package: WalletConnectProvider,
	//	 options: {
	//		 infuraId: "INFURA_ID",
	//	 },
	// },
	// coinbasewallet: {
	// 	package: CoinbaseWalletSDK,
	// 	options: {
	// 		appName: "Nalnda",
	// 		rpc: process.env.REACT_APP_CONTRACTS_URI,
	// 		chainId: 1337,
	// 		darkMode: false,
	// 	},
	// },
}

export default providerOptions
