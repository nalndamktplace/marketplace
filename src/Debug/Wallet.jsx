import React, { useEffect, useState } from 'react'
import Button from '../components/ui/Buttons/Button'
import Wallet from '../connections/wallet'

const WalletDebugPage = props => {

	const [Signer, setSigner] = useState(null)
	const [Address, setAddress] = useState(null)
	const [Provider, setProvider] = useState(null)
	const [WalletInstance, setWalletInstance] = useState(null)

	const walletConnectHanlder = () => {
		Wallet.connectWallet().then(res => {
			setSigner(res.signer)
			setAddress(res.address)
			setProvider(res.provider)
			setWalletInstance(res.wallet)
		})
	}

	const getWalletAddress = () => {
		Wallet.getAccountAddress(Provider)
	}

	return (
		<React.Fragment>
			<Button onClick={()=>walletConnectHanlder()}>Connect Wallet</Button>
			<Button onClick={()=>Wallet.disconnectWallet()}>Disconnect Wallet</Button>
			<Button onClick={()=>getWalletAddress(Signer)}>Get Wallet Address</Button>
			<Button onClick={()=>Wallet.getAccounts(Provider)}>Get Accounts</Button>
			<Button onClick={()=>Wallet.getChainID(Signer)}>Get ChainID</Button>
			<Button onClick={()=>Wallet.getSigner()}>Get Signer</Button>
			<Button onClick={()=>Wallet.getProvider()}>Get Provider</Button>
			<Button onClick={()=>Wallet.getBalance()}>Get Balance</Button>
			<Button onClick={()=>Wallet.getNetworks()}>Get Networks</Button>
			<Button onClick={()=>Wallet.signMessage()}>Sign Message</Button>
		</React.Fragment>
	)
}

export default WalletDebugPage