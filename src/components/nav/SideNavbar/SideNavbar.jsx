import { useNavigate } from "react-router"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"

import { useAuth0 } from "@auth0/auth0-react"

import Button from "../../ui/Buttons/Button"

import GaTracker from "../../../trackers/ga-tracker"
import { hideSpinner, showSpinner } from "../../../store/actions/spinner"
import { isUsable, isUserLoggedIn, isWalletConnected } from "../../../helpers/functions"

import {ReactComponent as CloseIcon} from "../../../assets/icons/close-icon.svg"
import {ReactComponent as GithubIcon} from "../../../assets/icons/github.svg"
import {ReactComponent as MediumIcon} from "../../../assets/icons/medium.svg"
import {ReactComponent as TwitterIcon} from "../../../assets/icons/twitter.svg"
import {ReactComponent as TelegramIcon} from "../../../assets/icons/telegram.svg"
import {ReactComponent as ArrowLeftIcon} from "../../../assets/icons/arrow-left.svg"


import {useWeb3AuthContext} from '../../../contexts/SocialLoginContext'

const SideNavbar = ({MenuOpen,setMenuOpen,BWalletState,toggleMenu,handleWalletConnect,NAV_ITEMS}) => {

	const {
		address,
		loading: eoaLoading,
		userInfo,
		connect,
		disconnect,
		getUserInfo,
		provider,
	} = useWeb3AuthContext();
	const dispatch = useDispatch()
    const navigate = useNavigate()

	const UserState = useSelector(state => state.UserState)

    const [SubMenuOpen, setSubMenuOpen] = useState(false)
	const [ActiveSubMenu, setActiveSubMenu] = useState(null)

    const SOCIAL_LINKS = [
		{name:"twitter",uri:"https://twitter.com/nalndamktplace",icon:<TwitterIcon />},
		{name:"medium",uri:"https://nalndamktplace.medium.com",icon:<MediumIcon />},
		{name:"telegram",uri:"https://t.me/nalndamktplace",icon:<TelegramIcon />},
		{name:"github",uri:"https://github.com/nalndamktplace",icon:<GithubIcon />}
	]

	const loginHandler = async () => {
		connect();
	}

	useEffect(()=>{
		MenuOpen && window.scrollTo(0,0)
		window.document.documentElement.style.overflowY = MenuOpen ? "hidden" : "auto"
	},[MenuOpen]) 

    const menuItemClickHandler = navItem => {
		if(isUsable(navItem.action)) {
			GaTracker('event_sidenavbar_action')
			setMenuOpen(false)
			navItem.action()
		} else if(isUsable(navItem.url)) {
			setMenuOpen(false)
			GaTracker('navigate_sidenav_'+navItem.title)
			navigate(navItem.url)
		} else if(isUsable(navItem.uri)){
			window.open(navItem.uri, "_blank")
			setMenuOpen(false)
			GaTracker('external_link_sidenav_'+navItem.title)
		} else if(isUsable(navItem.subMenu)){
			setActiveSubMenu(navItem)
			setSubMenuOpen(true)
		}
	}

	const getMenuClasses = () => {
		let classes = ['side-navbar']
		if(MenuOpen) classes.push('side-navbar--open')
		return classes.join(' ')
	}

    const getSubMenuClasses = () => {
		let classes = ['side-navbar__container__submenu']
		if(SubMenuOpen) classes.push('side-navbar__container__submenu--open')
		return classes.join(' ')
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
			if(navItem.id === "NI4SMI2" && BWalletState.smartAccount){}
			else if(navItem.id === "NI4SMI3" && !BWalletState.smartAccount){}
			else itemsDOM.push(<div onClick={()=>{menuItemClickHandler(navItem);setSubMenuOpen(false)}} key={navItem.id} className='side-navbar__container__item typo__head typo__head--4 utils__cursor--pointer'>{renderContent(navItem)}</div>)
		})
		return itemsDOM
	}

    const renderSocialIcons = () => {
		const domItems = []
		SOCIAL_LINKS.forEach(item => domItems.push(
			<div key={item.name} onClick={()=>{GaTracker('social_link_'+item.name);window.open(item.uri, "_blank")}} className="side-navbar__container__socials__item">
				{item.icon}
			</div>))
		return domItems
	}

    const toggleSubMenu = () => { setSubMenuOpen(old => !old) }

	const renderNavItems = () => {
		const domElements = []
		NAV_ITEMS.forEach(item => {
			if(!isUserLoggedIn(UserState) && item.id === "NI4") return
			domElements.push(
				<div key={item.id} className="side-navbar__container__item typo__act utils__cursor--pointer" onClick={()=>menuItemClickHandler(item)}>
					{isUsable(item.icon) && <item.icon/>}
					<span>{item.title}</span>
				</div>
			)
		})
		return domElements
	}

	// useEffect(() => {
	// 	if(Auth0.isLoading) dispatch(showSpinner())
	// 	else dispatch(hideSpinner())
	// }, [Auth0.isLoading, dispatch])

    return (
        <div className={getMenuClasses()}>
            <div className="side-navbar__container">
                <div className="side-navbar__container__header">
                    <div className="side-navbar__container__header__title typo__head--5">Menu</div>
                    <div className="side-navbar__container__header__backbtn" onClick={toggleMenu}>
                        <CloseIcon />
                    </div>
                </div>

                {renderNavItems()}

                <div className={getSubMenuClasses()}>
                    <div className="side-navbar__container__submenu__header">
                        <div className="side-navbar__container__submenu__header__backbtn" onClick={toggleSubMenu}>
                            <ArrowLeftIcon />
                        </div>
                        <div className="side-navbar__container__submenu__header__title typo__head--5">
                            {ActiveSubMenu && ActiveSubMenu.title}
                        </div>
                    </div>
                    {SubMenuOpen && ActiveSubMenu && renderSubMenuItems(ActiveSubMenu)}
                </div>
				<div className="side-navbar__container__spacer"></div>
                {!isUserLoggedIn(UserState)? (<Button type="primary" size="xl" onClick={()=>loginHandler()}>Login</Button>):null}
                <div className="side-navbar__container__socials">{renderSocialIcons()}</div>
            </div>
        </div>
    )
}

export default SideNavbar
