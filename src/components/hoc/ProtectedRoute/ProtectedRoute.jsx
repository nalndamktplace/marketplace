import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import useWallet from "../../../hook/useWallet"
import { isUserLoggedIn} from "../../../helpers/functions"

import { setSnackbar } from '../../../store/actions/snackbar'
import { showModal, SHOW_SELECT_WALLET_MODEL } from "../../../store/actions/modal"

const ProtectedRoute = ({element}) => {
	const wallet = useWallet()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const UserState = useSelector(state => state.UserState)

	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(()=>{
		if(isUserLoggedIn(UserState)){
			if(wallet.isConnected()) setIsAuthenticated(true)
			else dispatch(showModal(SHOW_SELECT_WALLET_MODEL))
		}
		else{
			dispatch(setSnackbar('NOT_LOGGED_IN'))
			navigate('/')
		}
	},[dispatch, UserState, wallet, navigate])

	return <>{isAuthenticated && element }</>
}

export default ProtectedRoute
