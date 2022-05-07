import React, { useState,useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { isFilled, isUsable } from '../../../helpers/functions'
import { GaExternalTracker,GaSocialTracker } from '../../../trackers/ga-tracker.js'

import Logo from '../../../assets/logo/solid.svg'
import {ReactComponent as UserIcon} from '../../../assets/icons/user.svg'
import {ReactComponent as PlusSquareIcon} from "../../../assets/icons/plus-square.svg" ;
import {ReactComponent as CompassIcon} from "../../../assets/icons/compass.svg" ;
import {ReactComponent as FileTextIcon} from "../../../assets/icons/file-text.svg" ;
import {ReactComponent as MediumIcon} from "../../../assets/icons/medium.svg" ;
import {ReactComponent as TwitterIcon} from "../../../assets/icons/twitter.svg" ;
import {ReactComponent as TelegramIcon} from "../../../assets/icons/telegram.svg" ;
import {ReactComponent as GithubIcon} from "../../../assets/icons/github.svg" ;
import {ReactComponent as BackIcon} from "../../../assets/icons/back-arrow.svg" ;
import {ReactComponent as CloseIcon} from "../../../assets/icons/close-icon.svg" ;

import PrimaryButton from '../../ui/Buttons/Primary'
import Dropdown from '../../ui/Dropdown/Dropdown'
import { CLEAR_WALLET, SET_WALLET } from '../../../store/actions/wallet'
import { hideSpinner, showSpinner } from '../../../store/actions/spinner'
import Web3Modal from "web3modal"
import { ethers } from 'ethers'
import providerOptions from '../../../connections/providerOptions'
import SecondaryButton from '../../ui/Buttons/Secondary'

// import { setWallet } from '../../../store/actions/wallet'
// import { setSnackbar } from '../../../store/actions/snackbar'
// import { hideSpinner, showSpinner } from '../../../store/actions/spinner'
// import WalletIcon from '../../../assets/icons/wallet.svg'
// import SequenceWallet from '../../../connections/wallet'

const web3Modal = new Web3Modal({
	cacheProvider: true,
	providerOptions
});

const Header = props => {
	// const handleWallet = () => { WalletConnected?disconectWallet():connectWallet() }
	const [ActiveSubMenu, setActiveSubMenu] = useState(null);
	const WalletState = useSelector(state=>state.WalletState);
	const dispatch = useDispatch();
	// console.log(WalletState);
	const NAV_ITEMS = [
		{ id: "NI1",title: "Explore"  ,url: "/explore",uri: null, icon: CompassIcon    ,action: null, subMenu: null },
		{ id: "NI2",title: "Publish"  ,url: "/create" ,uri: null, icon: PlusSquareIcon ,action: null, subMenu: null },
		{ id: "NI3",title: "Resources",url: null      ,uri: null, icon: FileTextIcon   ,action: null,
			subMenu: [
				{id: "NI3SMI1",title: "Blog"      ,url: null,uri: "https://nalndamktplace.medium.com/",icon: null,action: null,},
				{id: "NI3SMI2",title: "Whitepaper",url: null,uri: "https://docs.nalnda.com/"          ,icon: null,action: null,},
			],
		},
		{ id: "NI4",title: "Account", url: null,uri: null,icon: UserIcon,action: null,
			subMenu: [
				{id: "NI4SMI1",title: "Profile",url: "/profile",uri: null,icon: null,action: null,},
				{id: "NI4SMI2",title: "Wallet", url: "/wallet" ,uri: null,icon: null,action: null,},
				{id: "NI4SMI3",title: "Library",url: "/account",uri: null,icon: null,action: null},
				{id: "NI4SMI4",title: "Logout", url: "/"       ,uri: null,icon: null,action: () => {disconnectWallet()}},
			],
		},
	];
	const navigate = useNavigate()
	const location = useLocation()
	const [MenuOpen, setMenuOpen] = useState(false)
	const [SubMenuOpen, setSubMenuOpen] = useState(false);

	/*
	const dispatch = useDispatch()
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
		dispatch(showSpinner())
		saveWallet(null)
		dispatch(clearWallet())
		SequenceWallet.disconnect()
		dispatch(hideSpinner())
	}
	*/
	
	useEffect(()=>{
		MenuOpen && window.scrollTo(0,0);
		window.document.documentElement.style.overflowY = MenuOpen ? "hidden" : "auto" ;
	},[MenuOpen]);

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
			setActiveSubMenu(navItem);
			setSubMenuOpen(true);
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
			else return navItem.title ;
		}

		let itemsDOM = []
		NAV_ITEMS.forEach(navItem => {
			if(!isUsable(WalletState.wallet) && (navItem.id === "NI2" || navItem.id === "NI4")) return ;
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
	};
	const [provider, setProvider] = useState(null);

	useEffect(() => {
		if (web3Modal.cachedProvider) connectWallet();
	}, []);

	useEffect(() => {
        if (provider?.on) {
            const handleAccountsChanged = (accounts) => {
                console.log("accountsChanged", accounts);
				if(!isFilled(accounts)){
					disconnectWallet();
				}
            };

            // const handleDisconnect = () => {
            //     console.log("disconnect");
            //     disconnectWallet();
            // };

            provider.on("accountsChanged", handleAccountsChanged);
            // provider.on("disconnect", handleDisconnect);
            return () => {
                if (provider.removeListener) {
                    provider.removeListener("accountsChanged", handleAccountsChanged);
                    // provider.removeListener("disconnect", handleDisconnect);
                }
            };
        }
    }, [provider]);

	const connectWeb3Modal = async () => {
		if (web3Modal.cachedProvider) {
		  web3Modal.clearCachedProvider()
		}
		connectWallet()
	}

	// TODO Move them to external file
	// ! REPLACE WITH PROPER METHOD
	const connectWallet = async () => {
		// dispatch(showSpinner()) 
		try{
			const connection = await web3Modal.connect()
			const provider = new ethers.providers.Web3Provider(connection)
			setProvider(connection);
			// todo set signer as wallet
			const signer = provider.getSigner()
			const address = await signer.getAddress()
			dispatch({data:address,type:SET_WALLET})
		} catch(e) {
			console.error(e);
			// TODO add toast message
		}
		// dispatch(hideSpinner())
	}

	// ! REPLACE WITH PROPER METHOD
	const disconnectWallet = async () => {
		dispatch(showSpinner())
		try{
    		await web3Modal.clearCachedProvider()
			dispatch({type:CLEAR_WALLET})
			dispatch(hideSpinner())
		} catch(e) {
			console.error(e);
			dispatch(hideSpinner())
			// TODO add toast message
		}
	};

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
					{!isUsable(WalletState.wallet) && <PrimaryButton label="Connect Wallet" onClick={()=>{connectWeb3Modal()}}/>}
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
					{!isUsable(WalletState.wallet) && <PrimaryButton label="Connect Wallet" onClick={()=>{connectWeb3Modal()}}/>}
					<div className='header__menu__phone__container__socials'>
						<div onClick={()=>{GaSocialTracker('twitter');window.open("https://twitter.com/nalndamktplace", "_blank")}} className="header__menu__phone__container__socials__item">
							<TwitterIcon />
						</div>
						<div onClick={()=>{GaSocialTracker('medium');window.open("https://nalndamktplace.medium.com", "_blank")}} className="header__menu__phone__container__socials__item">
							<MediumIcon />
						</div>
						<div onClick={()=>{GaSocialTracker('telegram');window.open("https://t.me/nalndamktplace", "_blank")}} className="header__menu__phone__container__socials__item">
							<TelegramIcon />
						</div>
						<div onClick={()=>{GaSocialTracker('github');window.open("https://github.com/nalndamktplace", "_blank")}} className="header__menu__phone__container__socials__item">
							<GithubIcon />
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}

export default Header
