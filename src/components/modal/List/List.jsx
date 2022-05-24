import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideModal, SHOW_LIST_MODAL } from '../../../store/actions/modal'
import Backdrop from '../../hoc/Backdrop/Backdrop'
import Modal from '../../hoc/Modal/Modal'
import PrimaryButton from '../../ui/Buttons/Primary'
import InputField from '../../ui/Input/Input'

const ListModal = props => {
	const dispatch = useDispatch()

	const ModalState = useSelector(state => state.ModalState)

	const [Show, setShow] = useState(false)
	const [ListPrice, setListPrice] = useState("")

	useEffect(() => {
		if(ModalState.show === true && ModalState.type === SHOW_LIST_MODAL) setShow(true)
		else setShow(false)
	}, [ModalState])

	const modalCloseHandler = state => { if(state === false) dispatch(hideModal()) }

	return (
		<Backdrop show={Show}>
			<Modal title='List eBook' open={Show} toggleModal={modalCloseHandler}>
				<p className='utils__margin__bottom--n typo__transform--capital'>Book: {props.data.title}</p>
				<p className='utils__margin__bottom--n typo__transform--capital'>Author: {props.data.author}</p>
				<p className='typo__transform--capital'>DA Score: {props.data.da_score}</p>
				<InputField type="string" label="listing price in NALNDA" onChange={e => setListPrice(e.target.value)} />
				<div style={{flex: 1}}/>
				<PrimaryButton label="List eBook" onClick={()=>props.onListHandler(ListPrice)}/>
			</Modal>
		</Backdrop>
	)
}

export default ListModal