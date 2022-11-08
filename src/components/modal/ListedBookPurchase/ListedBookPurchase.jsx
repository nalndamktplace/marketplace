import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Backdrop from '../../hoc/Backdrop/Backdrop'

import GaTracker from '../../../trackers/ga-tracker'

import { isFilled, isUsable } from '../../../helpers/functions'
import { hideSpinner, showSpinner } from '../../../store/actions/spinner'
import { SHOW_PURCHASE_MODAL } from '../../../store/actions/modal'

import { ReactComponent as CloseIcon } from "../../../assets/icons/close-icon.svg"
import { ReactComponent as Error404Icon } from "../../../assets/icons/error-404.svg"


const ListedBookPurchaseModal = ({onOldBookPurchase,data}) => {

	const dispatch = useDispatch()

	const ModalState = useSelector(state => state.ModalState)

	const [Show, setShow] = useState(false)
	const [Offers, setOffers] = useState([])
	const [Loading, setLoading] = useState(false)
	const getClasses = () => {
		let classes = ["purchase purchase__wrapper"]
		if (Show) classes.push("purchase__wrapper--open")
		else classes.push("purchase__wrapper--close")
		return classes.join(" ")
	}

	const onOldPurchaseHandler = () => {
		onOldBookPurchase(data)
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
			const offerArray = [];
			offerArray.push(data)
			setOffers(offerArray)
		}
	}, [Show, data])

	return (
		<Backdrop show={Show}>
			<div className={getClasses()}>
				<div className="purchase__wrapper__header">
					<div className="purchase__wrapper__header__close-button">
						<div onClick={()=>setShow(false)}><CloseIcon width={20} height={20}/></div>
					</div>
				</div>
				<div className="purchase__wrapper__content">
						<div className="purchase__wrapper__content__options">
							{isFilled(Offers)
								?
								<div className="purchase__wrapper__content__options__item" onClick={()=>onOldPurchaseHandler()}>
									<p className='typo__body utils__d__flex typo__align--center'>Buy Copy at</p>
									<h5 className='typo__head typo__head--4 typo__transform--upper utils__d__flex utils__align__center'>{data.price===0?"FREE":<><img src='https://imagedelivery.net/yOWneHxM1h9mu46Te3Yjwg/59c27d12-e4eb-4f74-7a6e-b33ba6537600/icon48' style={{width: 32, height: 32, objectFit: 'contain'}} alt="USDC"/>&nbsp;{data.price}</>}</h5>
								</div>
								:
								<div className="purchase__wrapper__content__options__item">
									<p className='typo__body utils__d__flex typo__align--center'>No old copies available yet.</p>
									<h5 className='typo__head typo__head--4 typo__transform--upper utils__d__flex utils__align__center'>&nbsp;<Error404Icon height={32} width={32}/></h5>
								</div>
							}
						</div>
					{/* } */}
				</div>
			</div>
		</Backdrop>
	)
}

export default ListedBookPurchaseModal