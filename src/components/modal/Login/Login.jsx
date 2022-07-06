import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import axios from 'axios'
import { useGoogleLogin,  } from '@react-oauth/google'

import { BASE_URL } from '../../../config/env'
import { setSnackbar } from '../../../store/actions/snackbar'
import { showSpinner, hideSpinner } from '../../../store/actions/spinner'
import { hideModal, SHOW_LOGIN_MODAL } from '../../../store/actions/modal'

import Modal from '../../hoc/Modal/Modal'
import Backdrop from '../../hoc/Backdrop/Backdrop'

import GoogleIcon from '../../../assets/icons/google.png'
import { setUser } from '../../../store/actions/user'

const LoginModal = () => {

	const dispatch = useDispatch()

	const UserState = useSelector(state => state.UserState)
	const ModalState = useSelector(state => state.ModalState)

	const [Show, setShow] = useState(false)
	const [Loading, setLoading] = useState(false)

	const loginHandler = useGoogleLogin({
		onSuccess: tokenRes => {
			setLoading(true)
			axios({
				url: BASE_URL+'/api/user/oauth/google/verify',
				method: 'POST',
				data: tokenRes
			}).then(res => {
				if(res.status === 200){
					dispatch(hideModal())
					const userData = res.data
					dispatch(setUser(userData))
					dispatch(setSnackbar({show: true, message: "Welcome!", type: 1}))
				}
				else dispatch(setSnackbar('NOT200'))
			})
			.catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		},
		onError: tokenErr => console.error({tokenErr}),
		flow: 'auth-flow',
		ux_mode: 'popup'
	})

	useEffect(() => {
		if(ModalState.show && ModalState.type === SHOW_LOGIN_MODAL) setShow(true)
		else setShow(false)
	}, [ModalState])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	return(
		<Backdrop show={Show}>
			<Modal title='Login' open={Show}>
				<p className='typo typo__subtitle utils__margin__bottom--m'>Login to continue to Nalnda Marketplace</p>
				<div onClick={()=>loginHandler()} className='button button--outline-white typo typo__act utils__width--fill'>
					<img src={GoogleIcon} alt={'Google'} className='button__icon'/>
					Continue with Google
				</div>
			</Modal>
		</Backdrop>
	)
}

export default LoginModal