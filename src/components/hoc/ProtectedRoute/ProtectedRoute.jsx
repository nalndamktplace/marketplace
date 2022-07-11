import axios from 'axios'
import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import Wallet from "../../../connections/wallet"

import { isUsable, isUserLoggedIn, isWalletConnected } from "../../../helpers/functions"
import { setWallet } from "../../../store/actions/wallet"
import { setSnackbar } from "../../../store/actions/snackbar"
import { hideSpinner, showSpinner } from "../../../store/actions/spinner"

import { BASE_URL } from '../../../config/env'
import { setUser } from '../../../store/actions/user'
import { useCallback } from 'react'

const ProtectedRoute = ({element}) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const UserState = useSelector(state => state.UserState)
	const WalletState = useSelector(state => state.WalletState)

	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(()=>{
		if(isUserLoggedIn(UserState)){
			if(isWalletConnected(WalletState)) setIsAuthenticated(true)
			else {
				dispatch(showSpinner())
				Wallet.connectWallet().then(res => {
					dispatch(setWallet({ wallet: res.wallet, provider: res.provider, signer: res.signer, address: res.address }))
					setIsAuthenticated(true)
				}).catch(err => {
					dispatch(setSnackbar({show: true, message: "Error while connecting to wallet", type: 4}))
					navigate('/')
				}).finally(() => dispatch(hideSpinner()))
			}
		}
		else{
			dispatch(setSnackbar('NOT_LOGGED_IN'))
			navigate('/')
		}
	},[WalletState, dispatch, navigate, UserState])

	return <>{isAuthenticated && element }</>
}

export default ProtectedRoute
