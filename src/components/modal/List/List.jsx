import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Modal from '../../hoc/Modal/Modal'
import Button from '../../ui/Buttons/Button'
import Backdrop from '../../hoc/Backdrop/Backdrop'
import InputField from '../../ui/Input/Input'

import { hideModal, SHOW_LIST_MODAL } from '../../../store/actions/modal'
import GaTracker from '../../../trackers/ga-tracker'
import { isUsable } from '../../../helpers/functions'
import axios from 'axios'
import { BASE_URL } from '../../../config/env'

const ListModal = ({book, userCopy, onListHandler}) => {
	const dispatch = useDispatch()

	const UserState = useSelector(state => state.UserState)
	const ModalState = useSelector(state => state.ModalState)

	const [FulcrumLoading, setFulcrumLoading] = useState(false)
	const [Show, setShow] = useState(false)
	const [ListPrice, setListPrice] = useState("")
	const [Royalty, setRoyalty] = useState(null)

	useEffect(() => {
		if(ModalState.show === true && ModalState.type === SHOW_LIST_MODAL){
			GaTracker('modal_view_list_books')
			setShow(true)
		}
		else setShow(false)
	}, [ModalState])

	useEffect(()=>{
		setFulcrumLoading(true)
				axios({
					url: `${BASE_URL}/api/book/fulcrum`,
					headers: {
						'user-id': UserState.user.uuid,
						'authorization': `Bearer ${UserState.tokens.acsTkn.tkn}`
					},
					params: { bookAddress: book.book_address }
				}).then(res => {
					if(res.status === 200) setRoyalty(res.data.royalty)
				}).catch(err => {
					console.error({err})
				}).finally(() => setFulcrumLoading(false))
	},[ModalState])

	useEffect(() => {
		if(Show && isUsable(book)){
			const timer = setInterval(() => {
				setFulcrumLoading(true)
				axios({
					url: `${BASE_URL}/api/book/fulcrum`,
					headers: {
						'user-id': UserState.user.uuid,
						'authorization': `Bearer ${UserState.tokens.acsTkn.tkn}`
					},
					params: { bookAddress: book.book_address }
				}).then(res => {
					if(res.status === 200) setRoyalty(res.data.royalty)
				}).catch(err => {
					console.error({err})
				}).finally(() => setFulcrumLoading(false))
			}, 1800000)
			return () => clearInterval(timer)
		}
	}, [book, UserState, Show])

	const modalCloseHandler = state => { if(state === false) dispatch(hideModal()) }

	const renderFulcrum = () => {
		if(FulcrumLoading === true) return "Refreshing..."
		if(isUsable(Royalty)) return `${Royalty}%`
		return "loading..."
	}

	return (
		isUsable(userCopy) && isUsable(book)?
			<Backdrop show={Show}>
				<Modal title='List eBook' open={Show} toggleModal={modalCloseHandler} cancellable>
					<p className='utils__margin__bottom--n typo__transform--capital'>Book: {book.title}</p>
					<p className='utils__margin__bottom--n typo__transform--capital'>Author: {book.author}</p>
					<p className='typo__transform--capital'>purchased at: {isUsable(userCopy.purchase_price)?parseFloat(userCopy.purchase_price).toFixed(2):null}</p>
					<p className='typo__transform--capital'>DA Score: {isUsable(userCopy.da_score)?parseFloat(userCopy.da_score).toFixed(2):null}</p>
					<p className='typo__transform--capital'>You'll Get {renderFulcrum()} of the sales proceedings.</p>
					<p className='typo__transform--capital'>Suggestive Selling Price: {userCopy?.suggestedPrice.toFixed(2)}</p>
					<InputField type="string" label="listing price in USDC" onChange={e => setListPrice(e.target.value)} />
					<div style={{flex: 1}}/>
					<Button type="primary" onClick={()=>onListHandler(ListPrice)}>List eBook</Button>
				</Modal>
			</Backdrop>:
		null
	)
}

export default ListModal