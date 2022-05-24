import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL } from '../../../config/env'
import { isUsable } from '../../../helpers/functions'
import { hideModal, SHOW_PURCHASE_MODAL } from '../../../store/actions/modal'
import { setSnackbar } from '../../../store/actions/snackbar'
import { hideSpinner, showSpinner } from '../../../store/actions/spinner'
import Backdrop from '../../hoc/Backdrop/Backdrop'
import Modal from '../../hoc/Modal/Modal'
import PrimaryButton from '../../ui/Buttons/Primary'

const PurchaseModal = props => {

	const dispatch = useDispatch()

	const ModalState = useSelector(state => state.ModalState)

	const [Show, setShow] = useState(false)
	const [Offers, setOffers] = useState([])
	const [Loading, setLoading] = useState(false)

	const modalCloseHandler = state => {
		if(state === false) dispatch(hideModal())
	}

	useEffect(() => {
		console.log({ModalState})
	}, [ModalState])

	useEffect(() => {
		console.log({Offers})
	}, [Offers])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		if(ModalState.show === true && ModalState.type === SHOW_PURCHASE_MODAL) setShow(true)
		else setShow(false)
	}, [ModalState])

	useEffect(() => {
		console.log({Show})
		if(Show === true && isUsable(props.data)){
			axios({
				url: BASE_URL+'/api/book/list',
				method: 'GET',
				params: {
					bookAddress: props.data.book_address
				}
			}).then(res => {
				console.log({res: res.data})
				if(res.status === 200) setOffers(res.data)
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				console.error({err})
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [Show, dispatch, props])

	return (
		<Backdrop show={Show}>
			<Modal title='Purchase eBook' open={Show} toggleModal={modalCloseHandler}>
				<React.Fragment>
				<PrimaryButton label={'Buy New'} onClick={() => {props.onNewBookPurchase()}}/>
				<PrimaryButton label={'Buy Old'} onClick={() => {props.onOldBookPurchase()}}/>
				</React.Fragment>
			</Modal>
		</Backdrop>
	)
}

export default PurchaseModal