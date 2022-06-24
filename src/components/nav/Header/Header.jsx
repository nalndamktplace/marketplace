import axios from "axios"
import jc from 'json-cycle'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"

import Wallet from "../../../connections/wallet"

import { isUsable } from "../../../helpers/functions"
import { setSnackbar } from "../../../store/actions/snackbar"
import GaTracker from "../../../trackers/ga-tracker"
import { clearWallet, setWallet } from "../../../store/actions/wallet"

import Button from "../../ui/Buttons/Button"
import Dropdown from "../../ui/Dropdown/Dropdown"
import SideNavbar from "../SideNavbar/SideNavbar"

import { isFilled } from "../../../helpers/functions"
import { showSpinner, hideSpinner } from '../../../store/actions/spinner'

import { BASE_URL } from '../../../config/env'

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
	const [SearchQuery, setSearchQuery] = useState('')
	const [SearchResults, setSearchResults] = useState([])
	const [Collections, setCollections] = useState([])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		setCollections([])
		axios({
			url: BASE_URL+'/api/collections',
			method: 'GET'
		}).then(res => {
			if(res.status === 200) setCollections(res.data)
		}).catch(err => {})
	}, [])

	useEffect(() => {
		if(SearchQuery.length>3 && SearchQuery.length<16){
			setLoading(true)
			axios({
				url: BASE_URL+'/api/book/search',
				method: 'GET',
				params: {query: SearchQuery}
			}).then(res => {
				if(res.status === 200)
					setSearchResults(res.data)
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [dispatch, SearchQuery])

	const handleWalletConnect = () => {
		if(isUsable(WalletState.support) && WalletState.support === true && isUsable(WalletState.wallet.provider)){
			return true
		}
		else {
			Wallet.connectWallet().then(res => {
				dispatch(setWallet({ wallet: res.wallet, provider: jc.decycle(res.provider), signer: res.signer, address: res.address }))
				dispatch(setSnackbar({show: true, message: "Wallet connected.", type: 1}))
				return true
			}).catch(err => {
				dispatch(setSnackbar({show: true, message: "Error while connecting to wallet", type: 4}))
				return false
			})
		}
	}

	const NAV_ITEMS = [
		{ id: "NI1",title: "Explore" ,url: "/explore",uri: null, icon: CompassIcon ,action: null, subMenu: null },
		{ id: "NI2",title: "Publish" ,url: "/publish" ,uri: null, icon: PlusSquareIcon ,action: null, subMenu: null },
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
			GaTracker('navigate_header_'+navItem.title)
			navigate(navItem.url)
		} else if(isUsable(navItem.uri)){
			window.open(navItem.uri, "_blank")
			setMenuOpen(false)
			GaTracker('external_link_header_'+navItem.title)
		} else if(isUsable(navItem.subMenu)){
			setActiveSubMenu(navItem)
			setSubMenuOpen(true)
		}
	}

	const handleWalletDisconnect = () => {
		GaTracker('event_header_wallet_disconnect')
		Wallet.disconnectWallet(WalletState.wallet.provider).then(res => {
			dispatch(clearWallet())
			navigate('/')
			dispatch(setSnackbar({show: true, message: "Wallet disconnected.", type: 1}))
		}).catch(err => {
			dispatch(setSnackbar({show: true, message: "Error while disconnecting wallet.", type: 4}))
		})
	}

	const renderNavItems = () => {
		const domElements = []
		NAV_ITEMS.forEach(item => {
			if(!isUsable(WalletState.wallet.provider) && item.id === "NI4") return
			if(isUsable(item.subMenu)){
				const subMenuitems = []
				item.subMenu.forEach(navItem => {
					subMenuitems.push(
						<div onClick={()=>menuItemClickHandler(navItem)} key={navItem.id} className='header__content__navbar__link__subitem typo__head--6'>
							{isUsable(navItem.icon) && <item.icon/>}
							{navItem.id !== "NI4" && <span>{navItem.title}</span>}
						</div>
					)
				})
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
		return domElements
	}

	const getSubMenuClasses = () => {
		let classes = ['header__content__menu']
		if(MenuOpen) classes.push('header__content__menu--open')
		return classes.join(' ')
	}

	const renderSearchResults = () => {
		let searchResultsDOM = []
		if(isFilled(SearchResults))
			SearchResults.forEach(result => {
				searchResultsDOM.push(
					<div onClick={() => {navigate('/book', {state: result}); setSearchQuery('')}} className="header__content__search__result" key={result.id}>
						<img src={result.cover} alt={result.title+"'s Cover"} className="header__content__search__result__cover"/>
						<div className="header__content__search__result__info">
							<div className='header__content__search__result__info__author typo__body typo__body--2'>{result.author}</div>
							<div className='header__content__search__result__info__name typo__body typo__body--2'>{result.title}</div>
						</div>
					</div>
				)
			})
		else return(
			<div className="header__content__search__result--none">
				Your search did not match any books.
				Suggestions:
				<ul>
					<li>Make sure that all words are spelled correctly.</li>
					<li>Try different keywords.</li>
					<li>Try more general keywords.</li>
				</ul>
			</div>
		)
		return searchResultsDOM
	}

	const getSearchBarClasses = () => {
		let classes = ["header__content__search dropdown"]
		if(isFilled(SearchQuery) && SearchQuery.length>3) classes.push("dropdown--open")
		return classes.join(' ')
	}

	const getSearchResultsClasses = () => {
		let classes = ["dropdown__options"]
		if(isFilled(SearchQuery) && SearchQuery.length>3) classes.push("dropdown__options--open")
		return classes.join(' ')
	}

	return (
		<header className="header" data-nopadding={noPadding}>
			<div className="header__content">
				<div className="header__content__logo utils__cursor--pointer" onClick={()=>navigate('/')}>
					<img className="header__content__logo__image" src={Logo} alt={'N'}/>
					<div className="header__content__logo__name typo__logo">NALNDA</div>
				</div>
				<div className={getSearchBarClasses()}>
					<input value={SearchQuery} onChange={e => setSearchQuery(e.target.value)} className="header__content__search__input" type="text" placeholder="Search books and authors"/>
					<div className="header__content__search__icon">
						<SearchIcon width={24} height={24} stroke="currentColor"/>
					</div>
					<div className={getSearchResultsClasses()}>
						{renderSearchResults()}
					</div>
				</div>
				<div className="header__content__navbar">
					{renderNavItems()}
					{!isUsable(WalletState.wallet.provider) && <Button type="primary" size="lg" onClick={handleWalletConnect}>CONNECT WALLET</Button>}
				</div>
				<div className={getSubMenuClasses()} onClick={()=>toggleMenu()}>
					<div/><div/><div/>
				</div>
			</div>
			{showRibbion && isFilled(Collections) && <div className="header__ribbion">
				{/* <div className="header__ribbion__item header__ribbion__item--label">Browse Categories</div> */}
				{ Collections.map(collection=><div key={collection.id} onClick={()=>navigate('/collection', {state: {id: collection.id, name: collection.name}})} className="header__ribbion__item typo__transform--capital">{collection.name}</div>)}
				</div>
			}
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
