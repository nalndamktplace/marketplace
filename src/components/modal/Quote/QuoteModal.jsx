import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'

import Modal from '../../hoc/Modal/Modal'
import Button from '../../ui/Buttons/Button'
import InputField from '../../ui/Input/Input'
import Backdrop from '../../hoc/Backdrop/Backdrop'

import { hideModal, SHOW_QUOTE_MODAL } from '../../../store/actions/modal'
import GaTracker from '../../../trackers/ga-tracker'

const QuoteModal = ({QuotesForm,setQuotesForm,quoteHandler}) => {
	const dispatch = useDispatch()

	const ModalState = useSelector(state => state.ModalState)
    const [Show, setShow] = useState(false)

	useEffect(() => {
		if(ModalState.show === true && ModalState.type === SHOW_QUOTE_MODAL){
			GaTracker('modal_view_quote')
			setShow(true)
		}
		else setShow(false)
	}, [ModalState])

	const modalCloseHandler = state => { if(state === false) dispatch(hideModal()) }

	return (
		<Backdrop show={Show}>
			<Modal title='Write Quote' open={Show} toggleModal={modalCloseHandler} cancellable>
                <InputField type="string" label="quote" value={QuotesForm.quote} onChange={e => setQuotesForm({ ...QuotesForm, quote: e.target.value })} />
				<Button className='utils__margin__top--m utils__margin__left--auto' type="primary" onClick={()=>quoteHandler()} >submit</Button>
			</Modal>
		</Backdrop>
	)
}

export default QuoteModal