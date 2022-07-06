import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'

import Modal from '../../hoc/Modal/Modal'
import Button from '../../ui/Buttons/Button'
import InputField from '../../ui/Input/Input'
import Backdrop from '../../hoc/Backdrop/Backdrop'

import { hideModal, SHOW_FEEDBACK_MODAL } from '../../../store/actions/modal'

import GaTracker from '../../../trackers/ga-tracker'
import { FEEDBACK_CATEGORIES } from '../../../config/feedbackCategory'
import { isFilled, isUsable } from '../../../helpers/functions'
import { BASE_URL } from '../../../config/env'
import axios from 'axios'
import { setSnackbar } from '../../../store/actions/snackbar'


const FeedbackModal = () => {

	const dispatch = useDispatch()

	const UserState = useSelector(state => state.UserState)
	const ModalState = useSelector(state => state.ModalState)
	const WalletState = useSelector(state => state.WalletState)

    const [Show, setShow] = useState(false)
    const [FeedbackForm, setFeedbackForm] = useState({category:FEEDBACK_CATEGORIES[0].id,feedback:""});
	const [WalletAddress, setWalletAddress] = useState();

	useEffect(() => {
		if(isUsable(WalletState.wallet.provider)) setWalletAddress(WalletState.wallet.address)
	}, [WalletState])

	useEffect(() => {
		if(ModalState.show === true && ModalState.type === SHOW_FEEDBACK_MODAL){
			GaTracker('modal_view_feedback')
			setShow(true)
		}
		else setShow(false)
	}, [ModalState])

	const modalCloseHandler = state => { if(state === false) dispatch(hideModal()) }

    const feedbackHandler = () => {
		if(!isUsable(WalletAddress)){
			dispatch(setSnackbar({show: true, message: "Please connect your wallet to send feedback", type: 4}));
			return;
		}
		if(!isFilled(UserState.user.uid) || !isFilled(WalletAddress)){
			dispatch(setSnackbar({show: true, message: "Please login first.", type: 2}))
			return
		}
		if(isFilled(FeedbackForm.feedback) && FeedbackForm.feedback.length>1000){
			dispatch(setSnackbar({show: true, message: "Feedback cannot be longer than 1,000 characters.", type: 3}))
			return
		}
		axios({
			url: `${BASE_URL}/api/user/feedback`,
			method: 'POST',
			headers: {
				'address': WalletAddress,
				'user-id': UserState.user.uid
			},
			data : {
				userAddress : WalletAddress,
				category : FeedbackForm.category,
				feedback : FeedbackForm.feedback
			}
		}).then(res => {
			if(res.status === 200) {
				setFeedbackForm({category: FEEDBACK_CATEGORIES[0].id, feedback:''})
				dispatch(setSnackbar({show: true, message: "Thanks for Feedback", type: 1}))
				dispatch(hideModal())
			}
		}).catch(err => {
			dispatch(setSnackbar('ERROR'))
		})
    }

	return (
		<Backdrop show={Show}>
			<Modal title='Feedback' open={Show} toggleModal={modalCloseHandler} cancellable>
                <InputField type="select"  label="Category" options={FEEDBACK_CATEGORIES} value={FeedbackForm.category} onChange={e => setFeedbackForm({ ...FeedbackForm, category: e.target.value })} />
                <InputField type="text" label={`Feedback (${FeedbackForm.feedback.length}/1000)`} value={FeedbackForm.feedback} onChange={e => {e.target.value.length<1001?setFeedbackForm({ ...FeedbackForm, feedback: e.target.value }):dispatch(setSnackbar({show: true, message: "Feedback cannot be longer than 1,000 characters.", type: 3}))}} />
                <Button className='utils__margin__top--m' type="primary" onClick={()=>feedbackHandler()} >SUBMIT</Button>
			</Modal>
		</Backdrop>
	)
}

export default FeedbackModal