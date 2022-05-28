import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import Wallet from "../../../connections/wallet"

import { isUsable } from "../../../helpers/functions"

import { setWallet } from "../../../store/actions/wallet"
import { hideSpinner, showSpinner } from "../../../store/actions/spinner"
import { setSnackbar } from "../../../store/actions/snackbar"

const ProtectedRoute = ({element}) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const WalletState = useSelector(state=>state.WalletState)

	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(()=>{
		if(isUsable(WalletState.wallet)){
			setIsAuthenticated(true)
		} else {
			(async ()=>{
				try{
					dispatch(showSpinner())
					Wallet.connectWallet().then(res => {
						dispatch(setWallet(res))
						dispatch(setSnackbar({show: true, message: "Wallet connected.", type: 1}))
					}).catch(err => {
						console.error({err})
						dispatch(setSnackbar({show: true, message: "Error while connecting to wallet", type: 4}))
					}).finally(() => dispatch(hideSpinner()))
				} catch(e) {
					navigate("/")
				}
			})()
		}
	},[WalletState, dispatch, navigate])

	return <>{isAuthenticated && element }</>
}

export default ProtectedRoute
