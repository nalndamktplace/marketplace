import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Modal from '../../hoc/Modal/Modal'
import Button from '../../ui/Buttons/Button'
import Backdrop from '../../hoc/Backdrop/Backdrop'
import InputField from '../../ui/Input/Input'

import { hideModal, SHOW_LIST_MODAL } from '../../../store/actions/modal'
import GaTracker from '../../../trackers/ga-tracker'

const ListModal = props => {
	const dispatch = useDispatch()

	const ModalState = useSelector(state => state.ModalState)

	const [Show, setShow] = useState(false)
	const [ListPrice, setListPrice] = useState("")

	useEffect(() => {
		if(ModalState.show === true && ModalState.type === SHOW_LIST_MODAL){
			GaTracker('modal_view_list_books')
			setShow(true)
		}
		else setShow(false)
	}, [ModalState])

	const modalCloseHandler = state => { if(state === false) dispatch(hideModal()) }

	return (
		<Backdrop show={Show}>
			<Modal title='List eBook' open={Show} toggleModal={modalCloseHandler} cancellable>
				<p className='utils__margin__bottom--n typo__transform--capital'>Book: {props.data.title}</p>
				<p className='utils__margin__bottom--n typo__transform--capital'>Author: {props.data.author}</p>
				<p className='typo__transform--capital'>DA Score: {props.data.da_score}</p>
				<InputField type="string" label="listing price in USDC" onChange={e => setListPrice(e.target.value)} />
				<div style={{flex: 1}}/>
				<Button type="primary" onClick={()=>props.onListHandler(ListPrice)}>List eBook</Button>
			</Modal>
		</Backdrop>
	)
}

export default ListModal