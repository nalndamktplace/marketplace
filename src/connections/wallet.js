import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

import { isUsable } from '../helpers/functions'
import providerOptions from './providerOptions'

import { ChainId } from '@biconomy/core-types'

import SmartAccount from '@biconomy/smart-account'
import SocialLogin from '@biconomy/web3-auth'

import { setSmartAccount } from '../store/actions/bwallet'
import { useWeb3AuthContext } from '../contexts/SocialLoginContext'

async function Wallet(provider, dispatch) {
    const walletProvider = new ethers.providers.Web3Provider(provider)

    // Initialize the Smart Account

    let options = {
        activeNetworkId: ChainId.POLYGON_MUMBAI,
        supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
    }

    let smartAccount = new SmartAccount(walletProvider, options)
    smartAccount = await smartAccount.init()
    dispatch(setSmartAccount({ smartAccount }))
    const smartAccountSigner = smartAccount.signer
    const address = smartAccount.address
    console.log('address', address)
    const checkBalance = async () => {
        const balanceParams = {
            chainId: ChainId.POLYGON_MUMBAI, // chainId of your choice
            eoaAddress: smartAccount.address,
            tokenAddresses: ['0xfEc014B41506430F055ceff9A007e690D409b304'],
        }
        const balFromSdk = await smartAccount.getAlltokenBalances(balanceParams)
        console.info('getAlltokenBalances', balFromSdk)

        const usdBalFromSdk = await smartAccount.getTotalBalanceInUsd(balanceParams)
        console.info('getTotalBalanceInUsd', usdBalFromSdk)
    }
    checkBalance()
}

export default Wallet
