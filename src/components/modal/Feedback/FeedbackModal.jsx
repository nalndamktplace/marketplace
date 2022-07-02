import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'

import Modal from '../../hoc/Modal/Modal'
import Button from '../../ui/Buttons/Button'
import InputField from '../../ui/Input/Input'
import Backdrop from '../../hoc/Backdrop/Backdrop'

import { hideModal, SHOW_FEEDBACK_MODAL } from '../../../store/actions/modal'

import GaTracker from '../../../trackers/ga-tracker'
import { FEEDBACK_CATEGORIES } from '../../../config/feedbackCategory'
import { isUsable } from '../../../helpers/functions'
import { BASE_URL } from '../../../config/env'
import axios from 'axios'
import { setSnackbar } from '../../../store/actions/snackbar'


const FeedbackModal = ({}) => {

	const dispatch = useDispatch()
    const [FeedbackForm, setFeedbackForm] = useState({category:"",feedback:""});
	const [WalletAddress, setWalletAddress] = useState();
	const ModalState = useSelector(state => state.ModalState)
	const WalletState = useSelector(state => state.WalletState)
    const [Show, setShow] = useState(false)

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
		axios({
			url: `${BASE_URL}/api/user/feedback`,
			method: 'POST',
			data : {
				userAddress : WalletAddress,
				category : FeedbackForm.category,
				feedback : FeedbackForm.feedback
			}
		}).then(res => {
			if(res.status === 200) dispatch(setSnackbar({show: true, message: "Thanks for Feedback", type: 1}))
		}).catch(err => {dispatch(setSnackbar('ERROR'))})
    }

	return (
		<Backdrop show={Show}>
			<Modal title='Feedback' open={Show} toggleModal={modalCloseHandler}>
                <InputField type="select"  label="Category" options={FEEDBACK_CATEGORIES} value={FeedbackForm.category} onChange={e => setFeedbackForm({ ...FeedbackForm, category: e.target.value })} />
                <InputField type="text" label="Feedback" value={FeedbackForm.feedback} onChange={e => setFeedbackForm({ ...FeedbackForm, feedback: e.target.value })} />
                <Button className='utils__margin__top--m' type="primary" onClick={()=>feedbackHandler()} >SUBMIT</Button>
			</Modal>
		</Backdrop>
	)
}

export default FeedbackModal