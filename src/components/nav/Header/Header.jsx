import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'

import { isUsable } from '../../../helpers/functions'
import { GaExternalTracker } from '../../../trackers/ga-tracker.js'

import { setWallet } from '../../../store/actions/wallet'
import { setSnackbar } from '../../../store/actions/snackbar'
import { hideSpinner, showSpinner } from '../../../store/actions/spinner'

import Logo from '../../../assets/logo/solid.svg'
import UserIcon from '../../../assets/icons/user.svg'
import WalletIcon from '../../../assets/icons/wallet.svg'

import SequenceWallet from '../../../connections/wallet'

const Header = props => {

	const handleWallet = () => { WalletConnected?disconectWallet():connectWallet() }

	const NAV_ITEMS = [
		{id: 'NI1', title: "Explore", url: "/explore", uri: null, icon: null, action: null},
		{id: 'NI2', title: "ITO", url: "/ito", uri: null, icon: null, action: null},
		{id: 'NI3', title: "Book Pool", url: "/pool", uri: null, icon: null, action: null},
		{id: 'NI4', title: "Profile", url: "/account", uri: null, icon: UserIcon, action: null},
		{id: 'NI5', title: "My Wallet", url: null, uri: null, icon: WalletIcon, action: handleWallet},
	]

	const dispatch = useDispatch()
	const navigate = useNavigate()
	const location = useLocation()

	const [MenuOpen, setMenuOpen] = useState(false)
	const [Wallet, saveWallet] = useState(null)
	const [WalletConnected, setWalletConnected] = useState(false)

	useEffect(() => { setWalletConnected(isUsable(Wallet)) }, [Wallet])

	const connectWallet = () => {
		dispatch(showSpinner())
		const connectDetails = SequenceWallet.connect()
		connectDetails.then(res => {
			dispatch(hideSpinner())
			if(res.connected === true){
				saveWallet(res)
				SequenceWallet.open()
				dispatch(setWallet(res))
			}
		})
		.catch(err => {
			dispatch(hideSpinner())
			dispatch(setSnackbar('ERROR'))
			console.error({err})
		})
	}

	const disconectWallet = () => {
		SequenceWallet.open()
		// dispatch(showSpinner())
		// saveWallet(null)
		// dispatch(clearWallet())
		// SequenceWallet.disconnect()
		// dispatch(hideSpinner())
	}

	const getClasses = () => {
		let classes = ['header']
		if(location !== "/") classes.push("header--bg")
		return classes.join(" ")
	}

	const toggleMenu = () => {
		setMenuOpen(old => !old)
	}

	const getMenuIconClasses = () => {
		let classes = ['header__menu__icon']
		if(MenuOpen) classes.push('header__menu__icon--open')
		return classes.join(' ')
	}

	const getMenuClasses = () => {
		let classes = ['header__menu__phone']
		if(MenuOpen) classes.push('header__menu__phone--open')
		return classes.join(' ')
	}

	const menuItemClickHandler = navItem => {
		setMenuOpen(false)
		if(isUsable(navItem.action)) navItem.action()
		else if(isUsable(navItem.url)) navigate(navItem.url)
		else{
			window.open(navItem.uri, "_blank")
			GaExternalTracker(navItem.title)
		}
	}

	const renderNavItems = ResponsiveMode => {

		const renderContent = (navItem) => {
			if(isUsable(navItem.icon)) return <img src={navItem.icon} alt={navItem.title}/>
			return navItem.title
		}

		let itemsDOM = []
		NAV_ITEMS.forEach(navItem => {
			if(ResponsiveMode)
				itemsDOM.push(<div onClick={()=>menuItemClickHandler(navItem)} key={navItem.id} className='header__menu__phone__container__item typo__head typo__head--4 utils__cursor--pointer'>{renderContent(navItem)}</div>)
			else itemsDOM.push(<div onClick={()=>menuItemClickHandler(navItem)} key={navItem.id} className='header__menu__part__item typo__body utils__cursor--pointer'>{renderContent(navItem)}</div>)
		})
		return itemsDOM
	}

	return (
		<header className={getClasses()}>
			<div className='header__menu'>
				<div className='header__menu__part'>
					<div onClick={()=>navigate('/')} className='header__menu__part__logo utils__cursor--pointer' >
						<img className='header__menu__part__logo' src={Logo} alt="Nalnda" />
					</div>
				</div>
			</div>
			<div className="header__menu">
				<div className='header__menu__part'>
				</div>
			</div>
			<div className='header__menu'>
				<div className='header__menu__part'>
					{renderNavItems(false)}
				</div>
			</div>
			<div className={getMenuIconClasses()} onClick={()=>toggleMenu()}>
				<div/><div/><div/>
			</div>
			<div className={getMenuClasses()} onClick={()=>toggleMenu()}>
				<div className='header__menu__phone__container'>
					{renderNavItems(true)}
				</div>
			</div>
		</header>
	)
}

export default Header
