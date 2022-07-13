import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import axios from 'axios'
import moment from 'moment'
import { useAuth0 } from '@auth0/auth0-react'

import { clearWallet } from '../../../store/actions/wallet'
import { setSnackbar } from '../../../store/actions/snackbar'
import { setUser, unsetUser } from '../../../store/actions/user'
import { hideSpinner, showSpinner } from '../../../store/actions/spinner'

import Constants from '../../../config/constants'
import { BASE_URL } from '../../../config/env'
import { getData, logout } from '../../../helpers/storage'
import { isUsable, isUserLoggedIn } from '../../../helpers/functions'

const UserHOC = props => {

	const Auth0 = useAuth0()

	const dispatch = useDispatch()

	const UserState = useSelector(state => state.UserState)

	const [Loading, setLoading] = useState(false)

	useEffect(() => {
		if(isUsable(Auth0.error)) dispatch(setSnackbar('ERROR'))
	}, [Auth0.error, dispatch])

	useEffect(() => {
		if(Loading || Auth0.isLoading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, Auth0.isLoading, dispatch])

	useEffect(() => {
		if(Auth0.isAuthenticated && isUsable(Auth0.user)){
			setLoading(true)
			axios({
				url: `${BASE_URL}/api/user/oauth/login`,
				method: 'POST',
				data: Auth0.user
			}).then(res => {
				if(res.status === 200) {
					dispatch(setUser(res.data))
				}
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [Auth0.isAuthenticated ,Auth0.user, dispatch])

	useEffect(() => {
		if(!isUserLoggedIn(UserState)){
			const userData = getData(Constants.USER_STATE)
			if(isUserLoggedIn(userData)){
				const accessTokenExpiry = userData.tokens.acsTkn.exp
				if(moment(accessTokenExpiry).diff(moment())<0){
					Auth0.logout()
					dispatch(unsetUser())
					dispatch(clearWallet())
					dispatch(setSnackbar({show: true, message: "You have been logged out.", type: 3}))
					logout()
				}
			}
		}
	}, [UserState, dispatch, Auth0])

	return null
}

export default UserHOC