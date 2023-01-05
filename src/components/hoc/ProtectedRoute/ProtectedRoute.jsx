import { useNavigate } from "react-router"
import { useEffect, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"

import Wallet from "../../../connections/wallet"

import { isUserLoggedIn, isWalletConnected } from "../../../helpers/functions"
import { setWallet } from "../../../store/actions/wallet"
import { setSnackbar } from "../../../store/actions/snackbar"
import { hideSpinner, showSpinner } from "../../../store/actions/spinner"
import { isUsable } from "../../../helpers/functions"

import { useWeb3AuthContext } from "../../../contexts/SocialLoginContext"

const ProtectedRoute = ({element}) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const {
		address,
		connect,
		provider,
	} = useWeb3AuthContext();

	const UserState = useSelector(state => state.UserState)
	const BWalletState = useSelector(state => state.BWalletState)

	const [isAuthenticated, setIsAuthenticated] = useState(false)

	const loginHandler = async () => {
		connect();
	}

	const connectWallet = useCallback(
		() => {
			if(!address){
				loginHandler();
			}
			Wallet(provider, dispatch);
		},[dispatch]
	)

	useEffect(()=>{
		if(isUserLoggedIn(UserState)){
			if(isUsable(BWalletState.smartAccount)){
				setIsAuthenticated(true)
			} 
			else {
				connectWallet();
			}
		}
		else{
			dispatch(setSnackbar('NOT_LOGGED_IN'))
			navigate('/')
		}
	},[BWalletState, dispatch, navigate, UserState])

	return <>{isAuthenticated && element }</>
}

export default ProtectedRoute
