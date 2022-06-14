import { useState } from "react"
import { useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"

import Wallet from "../../../connections/wallet"

import { isUsable } from "../../../helpers/functions"
import { setSnackbar } from "../../../store/actions/snackbar"
import { GaExternalTracker } from "../../../trackers/ga-tracker"
import { clearWallet, setWallet } from "../../../store/actions/wallet"

import Button from "../../ui/Buttons/Button"
import SideNavbar from "../SideNavbar/SideNavbar"
import Dropdown from "../../ui/Dropdown/Dropdown"

import Logo from "../../../assets/logo/logo.png" 
import {ReactComponent as UserIcon} from '../../../assets/icons/user.svg'
import {ReactComponent as SearchIcon} from "../../../assets/icons/search.svg"
import {ReactComponent as CompassIcon} from "../../../assets/icons/compass.svg"
import {ReactComponent as FileTextIcon} from "../../../assets/icons/file-text.svg"
import {ReactComponent as PlusSquareIcon} from "../../../assets/icons/plus-square.svg"

const Header = ({showRibbion=true,noPadding=false}) => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const WalletState = useSelector(state=>state.WalletState)

	const [Loading, setLoading] = useState(false)
	const [MenuOpen, setMenuOpen] = useState(false)
	const [SubMenuOpen, setSubMenuOpen] = useState(false)
	const [ActiveSubMenu, setActiveSubMenu] = useState(null)

	const handleWalletConnect = () => {
		if(isUsable(WalletState.support) && WalletState.support === true && isUsable(WalletState.wallet)){
			return true
		}
		else if(!isUsable(WalletState.support) || WalletState.support === false){
			window.open("https://metamask.io/download/", '_blank')
			return false
		}
		else {
			setLoading(true)
			Wallet.connectWallet().then(res => {
				dispatch(setWallet(res.selectedAddress))
				dispatch(setSnackbar({show: true, message: "Wallet connected.", type: 1}))
				return true
			}).catch(err => {
				console.error({err})
				dispatch(setSnackbar({show: true, message: "Error while connecting to wallet", type: 4}))
				return false
			}).finally(() => setLoading(false))
		}
	}

	const NAV_ITEMS = [
		{ id: "NI1",title: "Explore" ,url: "/explore",uri: null, icon: CompassIcon ,action: null, subMenu: null },
		{ id: "NI2",title: "Publish" ,url: "/create" ,uri: null, icon: PlusSquareIcon ,action: null, subMenu: null },
		{ id: "NI3",title: "Resources",url: null ,uri: null, icon: FileTextIcon ,action: null,
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
	];

	const RIBBION_ITEMS = [
		{ id : "RI1",search:"?collection=bestselling" , title : "Bestsellers"},
		{ id : "RI2",search:"?collection=bestoffiction" , title : "Fiction"},
		{ id : "RI3",search:"?collection=bestofnonfiction" , title : "Non-Fiction"},
		{ id : "RI4",search:"?collection=newrelease" , title : "New Release"}
	]

	const toggleMenu = () => {
		SubMenuOpen && setSubMenuOpen(false)
		setMenuOpen(old => !old)
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

	const renderNavItems = () => {
		const domElements = [] ;
		NAV_ITEMS.forEach(item => {
			if(!isUsable(WalletState.wallet) && item.id === "NI4") return ;
			if(isUsable(item.subMenu)){
				const subMenuitems = [] ;
				item.subMenu.forEach(navItem => {
					subMenuitems.push(
						<div onClick={()=>menuItemClickHandler(navItem)} key={navItem.id} className='header__content__navbar__link__subitem typo__head--6'>
							{isUsable(navItem.icon) && <item.icon/>}
							{navItem.id !== "NI4" && <span>{navItem.title}</span>}
						</div>
					)
				});
				domElements.push(
					<Dropdown 
						key={item.id}
						button={<div key={item.id} className="header__content__navbar__link" onClick={()=>menuItemClickHandler(item)}>
							{isUsable(item.icon) && <item.icon/>}
							{item.id !== "NI4" && <span>{item.title}</span>}
						</div>}
						options={subMenuitems}
					/>
				)
			} else {
				domElements.push(
					<div key={item.id} className="header__content__navbar__link" onClick={()=>menuItemClickHandler(item)}>
						{isUsable(item.icon) && <item.icon/>}
						{item.id !== "NI4" && <span>{item.title}</span>}
					</div>
				)
			}
			
		})
		return domElements ;
	}

	const getSubMenuClasses = () => {
		let classes = ['header__content__menu']
		if(MenuOpen) classes.push('header__content__menu--open')
		return classes.join(' ')
	}

	return (
		<header className="header" data-nopadding={noPadding}>
			<div className="header__content">
				<div className="header__content__logo utils__cursor--pointer" onClick={()=>navigate('/')}>
					<img className="header__content__logo__image" src={Logo} alt={'N'}/>
					<div className="header__content__logo__name typo__logo">NALNDA</div>
				</div>
				<div className="header__content__search">
					<input className="header__content__search__input" type="text" placeholder="Search books and authors"/>
					<div className="header__content__search__icon">
						<SearchIcon width={24} height={24} stroke="currentColor"/>
					</div>
				</div>
				<div className="header__content__navbar">
					{renderNavItems()}
					{!isUsable(WalletState.wallet) && <Button type="primary" size="lg" onClick={handleWalletConnect}>CONNECT WALLET</Button>}
				</div>
				<div className={getSubMenuClasses()} onClick={()=>toggleMenu()}>
					<div/><div/><div/>
				</div>
			</div>
			{showRibbion && <div className="header__ribbion">
				<div className="header__ribbion__item header__ribbion__item--label">Browse Categories</div>
				{ RIBBION_ITEMS.map(item=><div key={item.id} onClick={()=>navigate({pathname:'/explore',search: item.search})} className="header__ribbion__item">{item.title}</div>)}
			</div>}
			<SideNavbar 
				MenuOpen={MenuOpen} 
				setMenuOpen={setMenuOpen}
				WalletState={WalletState}
				handleWalletConnect={handleWalletConnect}
				handleWalletDisconnect={handleWalletDisconnect}
				toggleMenu={toggleMenu}
				NAV_ITEMS={NAV_ITEMS}
			/>
		</header>
	)
}

export default Header
