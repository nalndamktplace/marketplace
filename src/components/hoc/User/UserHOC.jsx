import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import axios from 'axios'
import moment from 'moment'

import { clearWallet } from '../../../store/actions/wallet'
import { setSnackbar } from '../../../store/actions/snackbar'
import { setUser, unsetUser } from '../../../store/actions/user'
import { hideSpinner, showSpinner } from '../../../store/actions/spinner'

import { USER_STATE } from '../../../config/constants'
import { BASE_URL } from '../../../config/env'
import { getData, logout } from '../../../helpers/storage'
import { isUserLoggedIn, isUsable } from '../../../helpers/functions'
import GaTracker from '../../../trackers/ga-tracker'

import { useWeb3AuthContext } from '../../../contexts/SocialLoginContext'
import { useSmartAccountContext } from '../../../contexts/SmartAccountContext'
import { showModal, SHOW_SELECT_WALLET_MODEL } from '../../../store/actions/modal'

const UserHOC = props => {
	const dispatch = useDispatch()

	const UserState = useSelector(state => state.UserState)

	const [Loading, setLoading] = useState(false)

	const { loading: scwLoading } = useSmartAccountContext()
	const { address, loading: eoaLoading, userInfo, provider, getUserInfo } = useWeb3AuthContext()

	useEffect(() => {
		if(eoaLoading) setLoading(true)
		else setLoading(false)
	}, [eoaLoading])

	useEffect(() => {
		if(scwLoading) setLoading(true)
		else setLoading(false)
	}, [scwLoading])

	useEffect(() => {
		if (address) {
			setLoading(true)
			getUserInfo()
		}
	}, [address])

	useEffect(() => {
		if (Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		GaTracker('event_userHoc_login')
		if (address && isUsable(userInfo)) {
			let subSocial = userInfo.typeOfLogin
			if (subSocial == 'google') subSocial = 'google-oauth2'
			let sub = subSocial + '|' + userInfo.email
			let given_name, family_name
			if (userInfo.name.search(' ') != -1) {
				given_name = userInfo.name.split(' ')[0]
				family_name = userInfo.name.split(' ')[1]
			} else {
				given_name = userInfo.name
				family_name = ''
			}

			let picture = userInfo.profileImage
			let nickName = userInfo.email.split('@')[0]
			const userData = {
				email: userInfo.email,
				email_verified: true,
				given_name,
				family_name,
				locale: 'en',
				name: userInfo.name,
				nickName,
				picture,
				sub,
			}
			setLoading(true)
			axios({
				url: `${BASE_URL}/api/user/oauth/login`,
				method: 'POST',
				data: userData,
			})
				.then(async res => {
					if (res.status === 200) {
						dispatch(setUser(res.data))
						dispatch(showModal(SHOW_SELECT_WALLET_MODEL))
					}
				})
				.catch(err => {
					dispatch(setSnackbar('ERROR'))
				})
				.finally(() => setLoading(false))
		}
	}, [address, userInfo, dispatch])

	useEffect(() => {
		if (!isUserLoggedIn(UserState)) {
			const userData = getData(USER_STATE)
			if (isUserLoggedIn(userData)) {
				const accessTokenExpiry = userData.tokens.acsTkn.exp
				if (moment(accessTokenExpiry).diff(moment()) < 0) {
					GaTracker('event_userHoc_jwt_expire')
					dispatch(unsetUser())
					dispatch(clearWallet())
					dispatch(setSnackbar({ show: true, message: 'You have been logged out.', type: 3 }))
					logout()
				}
			}
		}
	}, [UserState, dispatch])

	return null
}

export default UserHOC
