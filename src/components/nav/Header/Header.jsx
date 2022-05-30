import React, { useState,useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { setSnackbar } from '../../../store/actions/snackbar'
import { isFilled, isUsable } from '../../../helpers/functions'
import { clearWallet, setWallet } from '../../../store/actions/wallet'
import { hideSpinner, showSpinner } from '../../../store/actions/spinner'
import { GaExternalTracker,GaSocialTracker } from '../../../trackers/ga-tracker.js'

import Wallet from "../../../connections/wallet"
import Dropdown from '../../ui/Dropdown/Dropdown'
import PrimaryButton from '../../ui/Buttons/Primary'

import Logo from '../../../assets/logo/solid.svg'
import {ReactComponent as UserIcon} from '../../../assets/icons/user.svg'
import {ReactComponent as GithubIcon} from "../../../assets/icons/github.svg"
import {ReactComponent as MediumIcon} from "../../../assets/icons/medium.svg"
import {ReactComponent as CompassIcon} from "../../../assets/icons/compass.svg"
import {ReactComponent as TwitterIcon} from "../../../assets/icons/twitter.svg"
import {ReactComponent as BackIcon} from "../../../assets/icons/back-arrow.svg"
import {ReactComponent as CloseIcon} from "../../../assets/icons/close-icon.svg"
import {ReactComponent as TelegramIcon} from "../../../assets/icons/telegram.svg"
import {ReactComponent as FileTextIcon} from "../../../assets/icons/file-text.svg"
import {ReactComponent as PlusSquareIcon} from "../../../assets/icons/plus-square.svg"

const Header = props => {

	const dispatch = useDispatch()
	const location = useLocation()
	const navigate = useNavigate()

	const WalletState = useSelector(state=>state.WalletState)

	const [Loading, setLoading] = useState(false)
	const [MenuOpen, setMenuOpen] = useState(false)
	const [SubMenuOpen, setSubMenuOpen] = useState(false)
	const [ActiveSubMenu, setActiveSubMenu] = useState(null)

	const NAV_ITEMS = [
		{ id: "NI1",title: "Explore" ,url: "/explore",uri: null, icon: CompassIcon ,action: null, subMenu: null },
		{ id: "NI2",title: "Publish" ,url: "/create" ,uri: null, icon: PlusSquareIcon ,action: null, subMenu: null },
		{ id: "NI3",title: "Resources",url: null ,uri: null, icon: FileTextIcon   ,action: null,
			subMenu: [
				{id: "NI3SMI1",title: "Blog" ,url: null,uri: "https://nalndamktplace.medium.com/",icon: null,action: null,},
				{id: "NI3SMI2",title: "Whitepaper",url: null,uri: "https://docs.nalnda.com/" ,icon: null,action: null,},
			],
		},
		{ id: "NI4",title: "Account", url: null,uri: null,icon: UserIcon,action: null,
			subMenu: [
				{id: "NI4SMI1",title: "Profile",url: "/profile",uri: null,icon: null,action: null,},
				// {id: "NI4SMI2",title: "Wallet", url: null ,uri: null,icon: null,action: () => isUsable(WalletState.wallet)?WalletState.wallet.sequence.openWallet():null,},
				{id: "NI4SMI3",title: "Library",url: "/account",uri: null,icon: null,action: null},
				{id: "NI4SMI4",title: "Logout", url: "/" ,uri: null,icon: null,action: () => {handleWalletDisconnect()}},
			],
		},
	]
	const SOCIAL_LINKS = [
		{name:"twitter",url:"https://twitter.com/nalndamktplace",icon:<TwitterIcon />},
		{name:"medium",url:"https://nalndamktplace.medium.com",icon:<MediumIcon />},
		{name:"telegram",url:"https://t.me/nalndamktplace",icon:<TelegramIcon />},
		{name:"github",url:"https://github.com/nalndamktplace",icon:<GithubIcon />}
	]

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [dispatch, Loading])

	useEffect(()=>{
		MenuOpen && window.scrollTo(0,0)
		window.document.documentElement.style.overflowY = MenuOpen ? "hidden" : "auto"
	},[MenuOpen])

	const getClasses = () => {
		let classes = ['header']
		if(location !== "/") classes.push("header--bg")
		return classes.join(" ")
	}

	const toggleMenu = () => {
		SubMenuOpen && setSubMenuOpen(false)
		setMenuOpen(old => !old)
	}

	const toggleSubMenu = () => { setSubMenuOpen(old => !old) }

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

	const getSubMenuClasses = () => {
		let classes = ['header__menu__phone__container__submenu']
		if(SubMenuOpen) classes.push('header__menu__phone__container__submenu--open')
		return classes.join(' ')
	}

	const menuItemClickHandler = navItem => {
		if(isUsable(navItem.action)) {
			setMenuOpen(false)
			navItem.action()
		} else if(isUsable(navItem.url)) {
			setMenuOpen(false)
			navigate(navItem.url)
		} else if(isUsable(navItem.uri)){
			window.open(navItem.uri, "_blank")
			setMenuOpen(false)
			GaExternalTracker(navItem.title)
		} else if(isUsable(navItem.subMenu)){
			setActiveSubMenu(navItem)
			setSubMenuOpen(true)
		}
	}

	const renderNavItems = ResponsiveMode => {
		const renderContent = (navItem) => {
			if(isUsable(navItem.icon)) 
				return (<>
					<navItem.icon></navItem.icon>
					<span>{navItem.title}</span>
				</>)
			return navItem.title
		}

		const renderDropdownItems = (subMenu) => {
			let itemsDOM = []
			subMenu.forEach(navItem => {
				itemsDOM.push(<div onClick={()=>menuItemClickHandler(navItem)} key={navItem.id} className='dropdown__options__item'>{renderContent(navItem)}</div>)
			})
			return itemsDOM
		}

		const renderDropdown = (navItem) => {
			if(isUsable(navItem.subMenu) && isFilled(navItem.subMenu)) return <Dropdown title={navItem.id === "NI4" ? <navItem.icon /> : navItem.title} options={renderDropdownItems(navItem.subMenu)}/>
			else return navItem.title
		}

		let itemsDOM = []
		NAV_ITEMS.forEach(navItem => {
			if(!isUsable(WalletState.wallet) && (navItem.id === "NI2" || navItem.id === "NI4")) return
			if(ResponsiveMode){
				if(isUsable(navItem.icon)) itemsDOM.push(<div onClick={()=>menuItemClickHandler(navItem)} key={navItem.id} className='header__menu__phone__container__item typo__head typo__head--4 utils__cursor--pointer'>{renderContent(navItem)}</div>)
				else itemsDOM.push(<div onClick={()=>menuItemClickHandler(navItem)} key={navItem.id} className='header__menu__phone__container__item typo__head typo__head--4 utils__cursor--pointer'>{renderContent(navItem)}</div>)
			}
			else itemsDOM.push(<div onClick={()=>menuItemClickHandler(navItem)} key={navItem.id} className='header__menu__part__item typo__body utils__cursor--pointer'>{renderDropdown(navItem)}</div>)
		})
		return itemsDOM
	}

	const renderSubMenuItems = (item) => {
		if(!item && !item.subMenu) return "" 
		const renderContent = (navItem) => {
			if(isUsable(navItem.icon)) 
				return (<>
					<navItem.icon></navItem.icon>
					<span>{navItem.title}</span>
				</>)
			return navItem.title
		}
		let itemsDOM = []
		item.subMenu.forEach(navItem => {
			itemsDOM.push(<div onClick={()=>menuItemClickHandler(navItem)} key={navItem.id} className='header__menu__phone__container__item typo__head typo__head--4 utils__cursor--pointer'>{renderContent(navItem)}</div>)
		})
		return itemsDOM
	}

	const renderSocialIcons = () => {
		const domItems = []
		SOCIAL_LINKS.forEach(item => domItems.push(
			<div key={item.name} onClick={()=>{GaSocialTracker(item.name);window.open(item.url, "_blank")}} className="header__menu__phone__container__socials__item">
				{item.icon}
			</div>))
		return domItems
	}

	useEffect(() => {
		(async ()=>{
			if (Wallet.web3Modal.cachedProvider){
				Wallet.connectWallet().then(res => {
					dispatch(setWallet(res.selectedAddress))
				}).catch(err => {
					console.error({err})
					dispatch(setSnackbar({show: true, message: "Error while connecting to wallet", type: 4}))
				})
			}
		})()
	}, [dispatch])

	const handleWalletConnect = () => {
		setLoading(true)
		Wallet.connectWallet().then(res => {
			dispatch(setWallet(res.selectedAddress))
			dispatch(setSnackbar({show: true, message: "Wallet connected.", type: 1}))
		}).catch(err => {
			console.error({err})
			dispatch(setSnackbar({show: true, message: "Error while connecting to wallet", type: 4}))
		}).finally(() => setLoading(false))
	}

	const handleWalletDisconnect = () => {
		setLoading(true)
		Wallet.disconnectWallet().then(res => {
			window.localStorage.clear()
			dispatch(clearWallet())
			navigate('/')
			dispatch(setSnackbar({show: true, message: "Wallet disconnected.", type: 1}))
		}).catch(err => {
			console.error({err})
			dispatch(setSnackbar({show: true, message: "Error while disconnecting wallet.", type: 4}))
		}).finally(() => setLoading(false))
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
					{!isUsable(WalletState.wallet) && <PrimaryButton label="Connect Wallet" onClick={()=>{handleWalletConnect()}}/>}
				</div>
			</div>
			<div className={getMenuIconClasses()} onClick={()=>toggleMenu()}>
				<div/><div/><div/>
			</div>
			<div className={getMenuClasses()}>
				<div className='header__menu__phone__container'>
					<div className='header__menu__phone__container__header'>
						<div className='header__menu__phone__container__header__title typo__head--5'>Menu</div>
						<div className='header__menu__phone__container__header__backbtn' onClick={()=>{toggleMenu()}}><CloseIcon /></div>
					</div>
					
					{renderNavItems(true)}

					<div className={getSubMenuClasses()}>
						<div className='header__menu__phone__container__submenu__header' >
							<div className='header__menu__phone__container__submenu__header__backbtn' onClick={()=>{toggleSubMenu()}}><BackIcon /></div>
							<div className='header__menu__phone__container__submenu__header__title typo__head--5'>{ ActiveSubMenu && ActiveSubMenu.title }</div>
						</div>
						{SubMenuOpen && ActiveSubMenu && renderSubMenuItems(ActiveSubMenu)}
					</div>

					<div className='header__menu__phone__container__spacer'></div>
					{!isUsable(WalletState.wallet) && <PrimaryButton label="Connect Wallet" onClick={()=>{handleWalletConnect()}}/>}
					<div className='header__menu__phone__container__socials'>
						{renderSocialIcons()}
					</div>
				</div>
			</div>
		</header>
	)
}

export default Header
