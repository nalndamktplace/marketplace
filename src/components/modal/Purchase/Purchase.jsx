import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Modal from '../../hoc/Modal/Modal'
import Backdrop from '../../hoc/Backdrop/Backdrop'
import PrimaryButton from '../../ui/Buttons/Primary'

import { isUsable } from '../../../helpers/functions'
import { setSnackbar } from '../../../store/actions/snackbar'
import { hideSpinner, showSpinner } from '../../../store/actions/spinner'
import { hideModal, SHOW_PURCHASE_MODAL } from '../../../store/actions/modal'

import { BASE_URL } from '../../../config/env'

const PurchaseModal = props => {

	const dispatch = useDispatch()

	const ModalState = useSelector(state => state.ModalState)

	const [Show, setShow] = useState(false)
	const [Offers, setOffers] = useState([])
	const [Loading, setLoading] = useState(false)
	const [ActiveTab, setActiveTab] = useState(0)

	const modalCloseHandler = state => { if(state === false) dispatch(hideModal()) }

	useEffect(() => { console.log({Offers}) }, [Offers])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		if(ModalState.show === true && ModalState.type === SHOW_PURCHASE_MODAL) setShow(true)
		else setShow(false)
	}, [ModalState])

	useEffect(() => {
		if(Show === true && isUsable(props.data)){
			axios({
				url: BASE_URL+'/api/book/list',
				method: 'GET',
				params: {
					bookAddress: props.data.book_address
				}
			}).then(res => {
				if(res.status === 200) setOffers(res.data)
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [Show, dispatch, props])

	const renderTabs = () => {
		switch (ActiveTab) {
			case 1:
				return
			default:
				return (
					<React.Fragment>
						<div className="modal__purchase__data__book">
							<div className="modal__purchase__data__book__cover">
								<img src={props.data.cover} alt={props.data.title + ' cover'}/>
							</div>
							<div className="modal__purchase__data__book__info">
								<p className='utils__margin__bottom--n typo__transform--capital'>{props.data.title}</p>
								<p className='utils__margin__bottom--n typo__body--3 typo__transform--upper'>{props.data.author}</p>
								<p className='utils__margin__bottom--n typo__body--2 typo__transform--upper'>{props.data.price}&nbsp;NALNDA</p>
							</div>
						</div>
						<div className="modal__purchase__data__cta">
							<PrimaryButton onClick={() => props.onNewBookPurchase()} label="Buy Now"/>
						</div>
					</React.Fragment>
				)
		}
	}
	
	const getTabsClasses = tab => {
		let classes = ['modal__purchase__tabs__item', 'typo__act typo__act--2']
		if(tab === ActiveTab) classes.push('modal__purchase__tabs__item--active')
		else classes.push('utils__cursor--pointer')
		return classes.join(' ')
	}

	return (
		<Backdrop show={Show}>
			<Modal title='Purchase eBook' open={Show} toggleModal={modalCloseHandler}>
				<div className="modal__purchase">
					<div className="modal__purchase__tabs">
						<div onClick={()=>setActiveTab(0)} className={getTabsClasses(0)}>
							New Copy
						</div>
						<div onClick={()=>setActiveTab(1)} className={getTabsClasses(1)}>
							Old Copy
						</div>
					</div>
					<div className="modal__purchase__data">
						{renderTabs()}
					</div>
				</div>
			</Modal>
		</Backdrop>
	)
}

export default PurchaseModal