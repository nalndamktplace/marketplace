import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Wallet from '../../../connections/wallet'
import useWallet from '../../../hook/useWallet'
import { useWeb3AuthContext } from '../../../contexts/SocialLoginContext'
import { hideModal, SHOW_SELECT_WALLET_MODEL } from '../../../store/actions/modal'

import Backdrop from '../../hoc/Backdrop/Backdrop'

const SelectWalletModal = () => {

	const { provider } = useWeb3AuthContext()

	const wallet = useWallet()
	const dispatch = useDispatch()

    const ModalState = useSelector(state => state.ModalState)

    const [Show, setShow] = useState(false)

	const biconomyWalletHandler = async () => {
		dispatch(hideModal())
		await Wallet(provider, dispatch)
		wallet.getAddress()
	}

	const walletConnectHandler = () => {
		dispatch(hideModal())
		wallet.connect()
		wallet.getAddress()
	}

    const getClasses = () => {
		let classes = ["select-wallet select-wallet__wrapper"]
		if (Show) classes.push("select-wallet__wrapper--open")
		else classes.push("select-wallet__wrapper--close")
		return classes.join(" ")
	}

	useEffect(() => {
		if(ModalState.show === true && ModalState.type === SHOW_SELECT_WALLET_MODEL) setShow(true)
		else setShow(false)
	}, [ModalState])

    return (
        <Backdrop show={Show}>
			<div className={getClasses()}>
				<div className="select-wallet__wrapper__header">
					<div className="select-wallet__wrapper__header__title typo__head--6 typo__transform--capital">Do you have any existing crypto wallet?</div>
				</div>
				<div className="select-wallet__wrapper__content">
                    <div className="select-wallet__wrapper__content__option" onClick={biconomyWalletHandler}>
						<div>I need a new wallet</div>
					</div>
                    <div className="select-wallet__wrapper__content__option" onClick={walletConnectHandler}>
						<div>Yes I have a wallet</div>
					</div>
				</div>
			</div>
		</Backdrop>
    )

}

export default SelectWalletModal