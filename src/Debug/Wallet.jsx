import React, { useEffect, useState } from 'react'
import Button from '../components/ui/Buttons/Button'
import Wallet from '../connections/wallet'

const WalletDebugPage = props => {

	const [Provider, setProvider] = useState(null)

	const walletConnectHanlder = async() => {
		setProvider(await Wallet.connectWallet())
	}

	const getWalletAddress = () => {
		Wallet.getAccountAddress(Provider)
	}

	return (
		<React.Fragment>
			<Button onClick={()=>walletConnectHanlder()}>Connect Wallet</Button>
			<Button onClick={()=>Wallet.disconnectWallet()}>Disconnect Wallet</Button>
			<Button onClick={()=>getWalletAddress()}>Get Wallet Address</Button>
			<Button onClick={()=>Wallet.getAccounts()}>Get Accounts</Button>
			<Button onClick={()=>Wallet.getChainID()}>Get ChainID</Button>
			<Button onClick={()=>Wallet.getSigner()}>Get Signer</Button>
			<Button onClick={()=>Wallet.getProvider()}>Get Provider</Button>
			<Button onClick={()=>Wallet.getBalance()}>Get Balance</Button>
			<Button onClick={()=>Wallet.getNetworks()}>Get Networks</Button>
			<Button onClick={()=>Wallet.signMessage()}>Sign Message</Button>
		</React.Fragment>
	)
}

export default WalletDebugPage