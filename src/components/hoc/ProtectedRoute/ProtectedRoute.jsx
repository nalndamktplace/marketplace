import axios from 'axios'
import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import Wallet from "../../../connections/wallet"

import { isUsable } from "../../../helpers/functions"
import { setWallet } from "../../../store/actions/wallet"
import { setSnackbar } from "../../../store/actions/snackbar"
import { hideSpinner, showSpinner } from "../../../store/actions/spinner"

import { BASE_URL } from '../../../config/env'
import { setUser } from '../../../store/actions/user'
import { useCallback } from 'react'

const ProtectedRoute = ({element}) => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const WalletState = useSelector(state => state.WalletState)

	const [isAuthenticated, setIsAuthenticated] = useState(false)

	const login = useCallback((walletAddress) => {
		axios({
			url: BASE_URL+'/api/user/login',
			method: 'POST',
			headers: {
				'address': walletAddress
			}
		}).then(res => {
			if(res.status === 200) dispatch(setUser(res.data))
		}).catch(err => {
		}).finally( () => {
			dispatch(setSnackbar({show: true, message: "Wallet connected.", type: 1}))
			setIsAuthenticated(true)
		})
	}, [dispatch])

	useEffect(()=>{
		if(isUsable(WalletState.support) && WalletState.support === true && isUsable(WalletState.wallet.provider)){
			login(WalletState.wallet.address)
		}
		else {
			dispatch(showSpinner())
			Wallet.connectWallet().then(res => {
				dispatch(setWallet({ wallet: res.wallet, provider: res.provider, signer: res.signer, address: res.address }))
				login(res.address)
			}).catch(err => {
				dispatch(setSnackbar({show: true, message: "Error while connecting to wallet", type: 4}))
				navigate('/')
			}).finally(() => dispatch(hideSpinner()))
		}
	},[WalletState, dispatch, navigate, login])

	return <>{isAuthenticated && element }</>
}

export default ProtectedRoute
