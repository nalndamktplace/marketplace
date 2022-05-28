import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import Wallet from "../../../connections/wallet"

import { isUsable } from "../../../helpers/functions"

import { SET_WALLET } from "../../../store/actions/wallet"

const ProtectedRoute = ({element}) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const WalletState = useSelector(state=>state.WalletState)

	useEffect(()=>{
		if(isUsable(WalletState.wallet)){
			setIsAuthenticated(true)
		} else {
			(async ()=>{
				try{
					await Wallet.connectWallet()
					dispatch({data:Wallet.getSigner(),type:SET_WALLET})
				} catch(e) {
					navigate("/")
				}
			})()
		}
	},[WalletState, dispatch, navigate])

	return <>{isAuthenticated && element }</>
}

export default ProtectedRoute
