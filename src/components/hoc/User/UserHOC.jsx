import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setUser, unsetUser } from '../../../store/actions/user'

import { useSelector } from 'react-redux'
import { isUserLoggedIn } from '../../../helpers/functions'
import { getData, logout } from '../../../helpers/storage'
import Constants from '../../../config/constants'
import moment from 'moment'
import { useNavigate } from 'react-router'
import { clearWallet } from '../../../store/actions/wallet'
import { setSnackbar } from '../../../store/actions/snackbar'
import { useAuth0 } from '@auth0/auth0-react'

const UserHOC = props => {

	const { user, isAuthenticated, isLoading } = useAuth0();

	const dispatch = useDispatch()

	const UserState = useSelector(state => state.UserState)

	useEffect(() => {
		console.log({user})
	}, [user])

	useEffect(() => {
		if(!isUserLoggedIn(UserState)){
			const userData = getData(Constants.USER_STATE)
			if(isUserLoggedIn(userData)){
				const accessTokenExpiry = userData.tokens.acsTkn.exp
				if(moment(accessTokenExpiry).diff(moment())<0){
					dispatch(unsetUser())
					dispatch(clearWallet())
					dispatch(setSnackbar({show: true, message: "You have been logged out.", type: 3}))
					logout()
				}
			}
		}
	}, [UserState, dispatch])

	return null
}

export default UserHOC