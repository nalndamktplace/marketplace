import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Modal from '../../hoc/Modal/Modal'
import Button from '../../ui/Buttons/Button'
import Backdrop from '../../hoc/Backdrop/Backdrop'

import GaTracker from '../../../trackers/ga-tracker'

import { setSnackbar } from '../../../store/actions/snackbar'
import { isFilled, isUsable } from '../../../helpers/functions'
import { hideSpinner, showSpinner } from '../../../store/actions/spinner'
import { SHOW_PURCHASE_MODAL } from '../../../store/actions/modal'

import { ReactComponent as CloseIcon } from "../../../assets/icons/close-icon.svg"

import { BASE_URL } from '../../../config/env'

const PurchaseModal = ({onOldBookPurchase,onNewBookPurchase,data}) => {

	const dispatch = useDispatch()

	const UserState = useSelector(state => state.UserState)
	const ModalState = useSelector(state => state.ModalState)

	const [Show, setShow] = useState(false)
	const [Offers, setOffers] = useState([])
	const [Loading, setLoading] = useState(false)
	const [ShowOffers, setShowOffers] = useState(0)
	const [ActiveOffer, setActiveOffer] = useState(null)

	const renderOffers = () => {
		let offersDOM = []
		if(isFilled(Offers)){
			Offers.forEach(offer => {
				offer.previous_owner === ActiveOffer?.previous_owner?
					offersDOM.push(
						<div className="purchase__wrapper__content__offers__item purchase__wrapper__content__offers__item--active" key={offer.book_address+'-'+offer.order_id}>
							<p className='utils__margin__bottom--n utils__d__flex utils__align__center'>Price:&nbsp;{offer.price===0?"FREE":<><img src='https://imagedelivery.net/yOWneHxM1h9mu46Te3Yjwg/59c27d12-e4eb-4f74-7a6e-b33ba6537600/icon48' style={{width: 20, height: 20, objectFit: 'contain'}} alt="USDC"/>&nbsp;{isUsable(offer.price)?parseFloat(offer.price).toFixed(2):null}</>}</p>
							<p className='utils__margin__bottom--n'>DA Score: {isUsable(offer.da_score)?parseFloat(offer.da_score).toFixed(2):null}</p>
							<p className='utils__margin__bottom--n'>Seller: {offer.previous_owner}</p>
						</div>
					)
				:
					offersDOM.push(
						<div onClick={()=>setActiveOffer(offer)} className="purchase__wrapper__content__offers__item" key={offer.book_address+'-'+offer.order_id}>
							<p className='utils__margin__bottom--n utils__d__flex utils__align__center'>Price:&nbsp;{offer.price===0?"FREE":<><img src='https://imagedelivery.net/yOWneHxM1h9mu46Te3Yjwg/59c27d12-e4eb-4f74-7a6e-b33ba6537600/icon48' style={{width: 20, height: 20, objectFit: 'contain'}} alt="USDC"/>&nbsp;{isUsable(offer.price)?parseFloat(offer.price).toFixed(2):null}</>}</p>
							<p className='utils__margin__bottom--n'>DA Score: {isUsable(offer.da_score)?parseFloat(offer.da_score).toFixed(2):null}</p>
							<p className='utils__margin__bottom--n'>Seller: {offer.previous_owner}</p>
						</div>
					)
			})
		}
		if(offersDOM.length===0) offersDOM.push(<div className="typo__color--n600 utils__d__flex utils__justify__center">No Offers</div>)
		return offersDOM
	}

	const getClasses = () => {
		let classes = ["purchase purchase__wrapper"]
		if (Show) classes.push("purchase__wrapper--open")
		else classes.push("purchase__wrapper--close")
		return classes.join(" ")
	}

	const getLowestPrice = () => {
		if(isFilled(Offers)){
			const offers = Offers.sort((offera, offerb) => {
				return offera.price > offerb.price
			})
			return parseFloat(offers[0].price).toFixed(2)
		}
	}

	const onOldPurchaseHandler = () => {
		if(isUsable(ActiveOffer))onOldBookPurchase(ActiveOffer)
		else dispatch(setSnackbar({show: true, message: "Please select an old copy.", type: 3}))
	}

	useEffect(() => {
		window.document.documentElement.style.overflowY = Show ? "hidden" : "auto"
	}, [Show])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		if(ModalState.show === true && ModalState.type === SHOW_PURCHASE_MODAL){
			GaTracker('modal_view_purchase')
			setShow(true)
		}
		else setShow(false)
	}, [ModalState])

	useEffect(() => {
		if(Show === true && isUsable(data)){
			axios({
				url: BASE_URL+'/api/book/list',
				method: 'GET',
				headers: {
					'user-id': UserState.user.uid,
					'authorization': `Bearer ${UserState.tokens.acsTkn.tkn}`
				},
				params: {
					bookAddress: data.book_address
				}
			}).then(res => {
				if(res.status === 200) setOffers(res.data)
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [Show, dispatch, data, UserState])

	return (
		<Backdrop show={Show}>
			<div className={getClasses()}>
				<div className="purchase__wrapper__header">
					<div className="purchase__wrapper__header__title typo__head--6 typo__transform--capital">{data.title.toLowerCase()}</div>
					<div className="purchase__wrapper__header__close-button">
						<div onClick={()=>setShow(false)}><CloseIcon width={20} height={20}/></div>
					</div>
				</div>
				<div className="purchase__wrapper__content">
					{ShowOffers?
						<div className="purchase__wrapper__content__offers">
							<div className='typo__body typo__body--2 utils__d__flex purchase__wrapper__content__offers__count'>{Offers.length} offer(s) starting from&nbsp;{data.price===0?"FREE":<><img src='https://imagedelivery.net/yOWneHxM1h9mu46Te3Yjwg/59c27d12-e4eb-4f74-7a6e-b33ba6537600/icon48' style={{width: 20, height: 20, objectFit: 'contain'}} alt="USDC"/>&nbsp;{getLowestPrice()}</>}</div>
							<div className="purchase__wrapper__content__offers__list">
								{renderOffers()}
							</div>
							<div className="purchase__wrapper__content__offers__cta">
								<Button type='secondary' onClick={()=>setShowOffers(false)} className="purchase__wrapper__content__offers__cta__button">Back</Button>
								<Button type='primary' onClick={()=>onOldPurchaseHandler()} className="purchase__wrapper__content__offers__cta__button">Purchase</Button>
							</div>
						</div>
					:
						<div className="purchase__wrapper__content__options">
							<div className="purchase__wrapper__content__options__item" onClick={()=>onNewBookPurchase()}>
								<p className='typo__body utils__d__flex typo__align--center'>Purchase new copy for</p>
								<h5 className='typo__head typo__head--4 typo__transform--upper utils__d__flex utils__align__center'>{data.price===0?"FREE":<><img src='https://imagedelivery.net/yOWneHxM1h9mu46Te3Yjwg/59c27d12-e4eb-4f74-7a6e-b33ba6537600/icon48' style={{width: 32, height: 32, objectFit: 'contain'}} alt="USDC"/>&nbsp;{parseFloat(data.price).toFixed(2)}</>}</h5>
							</div>
							<div className="purchase__wrapper__content__options__item" onClick={()=>setShowOffers(true)}>
								<p className='typo__body utils__d__flex typo__align--center'>Old copies start from</p>
								<h5 className='typo__head typo__head--4 typo__transform--upper utils__d__flex utils__align__center'>{data.price===0?"FREE":<><img src='https://imagedelivery.net/yOWneHxM1h9mu46Te3Yjwg/59c27d12-e4eb-4f74-7a6e-b33ba6537600/icon48' style={{width: 32, height: 32, objectFit: 'contain'}} alt="USDC"/>&nbsp;{getLowestPrice()}</>}</h5>
							</div>
						</div>
					}
				</div>
			</div>
		</Backdrop>
	)
}

export default PurchaseModal