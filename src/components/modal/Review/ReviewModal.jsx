import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'

import Modal from '../../hoc/Modal/Modal'
import Button from '../../ui/Buttons/Button'
import InputField from '../../ui/Input/Input'
import Backdrop from '../../hoc/Backdrop/Backdrop'

import { hideModal, SHOW_REVIEW_MODAL } from '../../../store/actions/modal'

import StarEmptyIcon from '../../../assets/icons/star-empty.svg'
import StarFilledIcon from '../../../assets/icons/star-filled.svg'
import StarFilledHalfIcon from '../../../assets/icons/star-filled-half.svg'
import StarEmptyHalfRtlIcon from '../../../assets/icons/star-empty-half-rtl.svg'
import GaTracker from '../../../trackers/ga-tracker'

const ReviewModal = ({ReviewForm,setReviewForm,reviewHandler}) => {

	const dispatch = useDispatch()

	const ModalState = useSelector(state => state.ModalState)

    const [Show, setShow] = useState(false)

	useEffect(() => {
		if(ModalState.show === true && ModalState.type === SHOW_REVIEW_MODAL){
			GaTracker('modal_view_review')
			setShow(true)
		}
		else setShow(false)
	}, [ModalState])

	const modalCloseHandler = state => { if(state === false) dispatch(hideModal()) }

    const renderStarsInput = () => {
        let starsDOM = []
        for (let i = 1; i <= 5; i++) {
            if(i <= ReviewForm.rating) starsDOM.push(<div key={'STAR'+i} className="book__data__container__desc__tabs__data__review__rating__item">
                    <img src={StarFilledIcon} alt="star" className="book__data__container__desc__tabs__data__review__rating__item__icon" />
                    <div onClick={()=>setReviewForm({ ...ReviewForm, rating: i-0.5})} className="book__data__container__desc__tabs__data__review__rating__item__trigger"/>
                    <div onClick={()=>setReviewForm({ ...ReviewForm, rating: i})} className="book__data__container__desc__tabs__data__review__rating__item__trigger"/>
                </div>)
            else if(ReviewForm.rating < i && ReviewForm.rating > i-1) starsDOM.push(<div key={'STAR'+i} className="book__data__container__desc__tabs__data__review__rating__item">
                    <img src={StarFilledHalfIcon} alt="half star" className="book__data__container__desc__tabs__data__review__rating__item__icon book__data__container__desc__tabs__data__review__rating__item__icon--half" />
                    <img src={StarEmptyHalfRtlIcon} alt="half star" className="book__data__container__desc__tabs__data__review__rating__item__icon book__data__container__desc__tabs__data__review__rating__item__icon--half" />
                    <div onClick={()=>setReviewForm({ ...ReviewForm, rating: i-0.5})} className="book__data__container__desc__tabs__data__review__rating__item__trigger"/>
                    <div onClick={()=>setReviewForm({ ...ReviewForm, rating: i})} className="book__data__container__desc__tabs__data__review__rating__item__trigger"/>
                </div>)
            else starsDOM.push(<div key={'STAR'+i} className="book__data__container__desc__tabs__data__review__rating__item">
                    <img src={StarEmptyIcon} alt="empty star" className="book__data__container__desc__tabs__data__review__rating__item__icon" />
                    <div onClick={()=>setReviewForm({ ...ReviewForm, rating: i-0.5})} className="book__data__container__desc__tabs__data__review__rating__item__trigger"/>
                    <div onClick={()=>setReviewForm({ ...ReviewForm, rating: i})} className="book__data__container__desc__tabs__data__review__rating__item__trigger"/>
                </div>)
        }
        return starsDOM
    }

	return (
		<Backdrop show={Show}>
			<Modal title='Review' open={Show} toggleModal={modalCloseHandler} cancellable>
                <div className="book__data__container__desc__tabs__data__review__rating">{renderStarsInput()}</div>
                <InputField type="string" label="title" value={ReviewForm.title} onChange={e => setReviewForm({ ...ReviewForm, title: e.target.value })} />
                <InputField type="text" label="body" value={ReviewForm.body} onChange={e => setReviewForm({ ...ReviewForm, body: e.target.value })} />
                <Button className='utils__margin__top--m' type="primary" onClick={()=>reviewHandler()} >submit</Button>
			</Modal>
		</Backdrop>
	)
}

export default ReviewModal