import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import Wallet from "../../../connections/wallet"

import { isUsable } from "../../../helpers/functions"
import { setWallet } from "../../../store/actions/wallet"
import { setSnackbar } from "../../../store/actions/snackbar"
import { hideSpinner, showSpinner } from "../../../store/actions/spinner"

const ProtectedRoute = ({element}) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const WalletState = useSelector(state=>state.WalletState)

	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(()=>{
		if(isUsable(WalletState.support) && WalletState.support === true && isUsable(WalletState.wallet.provider)){
			setIsAuthenticated(true)
		}
		else if(!isUsable(WalletState.support) || WalletState.support === false){
			dispatch(setSnackbar({show: true, message: "Your browser does not supports web3.", type: 2}))
			navigate('/')
		}
		else {
			dispatch(showSpinner())
			Wallet.connectWallet().then(res => {
				dispatch(setWallet({ wallet: res.wallet, provider: res.provider, signer: res.signer, address: res.address }))
				dispatch(setSnackbar({show: true, message: "Wallet connected.", type: 1}))
				setIsAuthenticated(true)
			}).catch(err => {
				console.error({err})
				dispatch(setSnackbar({show: true, message: "Error while connecting to wallet", type: 4}))
				navigate('/')
			}).finally(() => dispatch(hideSpinner()))
		}
	},[WalletState, dispatch, navigate])

	return <>{isAuthenticated && element }</>
}

export default ProtectedRoute
