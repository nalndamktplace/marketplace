import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Button from '../../ui/Buttons/Button'
import Backdrop from '../../hoc/Backdrop/Backdrop'

import GaTracker from '../../../trackers/ga-tracker'

import { hideSpinner, showSpinner } from '../../../store/actions/spinner'
import { SHOW_PURCHASE_MODAL } from '../../../store/actions/modal'

import { ReactComponent as CloseIcon } from "../../../assets/icons/close-icon.svg"

import { ChainId } from '@biconomy/core-types'
import { ethers } from 'ethers'
import PriceTag from '../../ui/Tags/Price'
import { USDC_ADDRESS } from '../../../config/constants'

const PurchaseModal = ({onOldBookPurchase,onNewBookPurchase,data}) => {

	const dispatch = useDispatch()

	const UserState = useSelector(state => state.UserState)
	const ModalState = useSelector(state => state.ModalState)
	const BWalletState = useSelector(state => state.BWalletState)

	const [Show, setShow] = useState(false)
	const [Loading, setLoading] = useState(false)
	const [WalletData, setWalletData] = useState(null)

	const getBalance = useCallback(
		async () => {
			const balanceParams = {
				chainId: ChainId.POLYGON_MUMBAI,
				eoaAddress: BWalletState.smartAccount.address,
				tokenAddresses: [USDC_ADDRESS],
			}
			const balances = await BWalletState.smartAccount.getAlltokenBalances(balanceParams)
			const usdc = balances.data.filter(token => token.contract_address === USDC_ADDRESS)[0]
			usdc.balance = ethers.utils.formatUnits(usdc?.balance, "mwei")
			setWalletData(usdc)
		},
		[BWalletState.smartAccount],
	)

	const getClasses = () => {
		let classes = ["purchase purchase__wrapper"]
		if (Show) classes.push("purchase__wrapper--open")
		else classes.push("purchase__wrapper--close")
		return classes.join(" ")
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
			getBalance()
		}
		else setShow(false)
	}, [ModalState, BWalletState, getBalance])

	return (
		<Backdrop show={Show}>
			<div className={getClasses()}>
				<div className="purchase__wrapper__header">
					<div className="purchase__wrapper__header__title typo__head--6 typo__transform--capital">Checkout</div>
					<div className="purchase__wrapper__header__close-button">
						<div onClick={()=>setShow(false)}><CloseIcon width={20} height={20}/></div>
					</div>
				</div>
				<div className="purchase__wrapper__content">
					<div className="">Title: {data.title}</div>
					<PriceTag label={"price"} price={data.price}/>
					<PriceTag label={"your balance"} price={WalletData?.balance}/>
					<PriceTag label={"balance after purchase"} price={parseFloat(WalletData?.balance - data.price).toFixed(6)}/>
					<br/>
					<Button type="primary" onClick={()=>onNewBookPurchase()}>Purchase</Button>
				</div>
			</div>
		</Backdrop>
	)
}

export default PurchaseModal