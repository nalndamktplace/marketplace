import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"

import Wallet from "../../../connections/wallet"

import { setSnackbar } from "../../../store/actions/snackbar"
import { clearWallet, setWallet } from "../../../store/actions/wallet"
import { showSpinner, hideSpinner } from '../../../store/actions/spinner'

import Button from "../../ui/Buttons/Button"
import Dropdown from "../../ui/Dropdown/Dropdown"
import SideNavbar from "../SideNavbar/SideNavbar"

import Constants from '../../../config/constants'
import GaTracker from "../../../trackers/ga-tracker"
import { getData } from "../../../helpers/storage"
import { BASE_URL } from '../../../config/env'
import { isFilled } from "../../../helpers/functions"
import { isUsable, isUserLoggedIn, isWalletConnected } from "../../../helpers/functions"

import { foundUser, unsetUser } from "../../../store/actions/user"
import { showModal, SHOW_LOGIN_MODAL } from "../../../store/actions/modal"

import Logo from "../../../assets/logo/logo.png" 
import {ReactComponent as UserIcon} from '../../../assets/icons/user.svg'
import {ReactComponent as USDCIcon} from "../../../assets/icons/usdc.svg"
import {ReactComponent as GridIcon} from "../../../assets/icons/layout-grid.svg"
import {ReactComponent as SearchIcon} from "../../../assets/icons/search.svg"
import {ReactComponent as CompassIcon} from "../../../assets/icons/compass.svg"
import {ReactComponent as PlusSquareIcon} from "../../../assets/icons/plus-square.svg"

const Header = ({showRibbion=true,noPadding=false}) => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const UserState = useSelector(state=>state.UserState)
	const WalletState = useSelector(state=>state.WalletState)

	const [Loading, setLoading] = useState(false)
	const [MenuOpen, setMenuOpen] = useState(false)
	const [SubMenuOpen, setSubMenuOpen] = useState(false)
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

	const connectWallet = (walletAddress) => {
		console.log("linking wallet to account")
		setLoading(true)
		axios({
			url: BASE_URL+'/api/user/wallet',
			method: 'POST',
			headers: {
				'address': walletAddress,
				'user-id': UserState.user.uid
			}
		}).then(res => {
			console.log("wallet linked to account")
			if(res.status === 200) dispatch(setSnackbar({show: true, message: "Wallet Connected!", type: 1}))
			else dispatch(setSnackbar('ERROR'))
		}).catch(err => {
			console.log("unable to link wallet")
			console.error({err})
			dispatch(setSnackbar('ERROR'))
		}).finally(() => {
			setLoading(false)
			console.log("wallet linking done")
		})
	}

	const loginHandler = () => {
		dispatch(showSpinner())
		const localData = getData(Constants.USER_STATE)
		if(isUserLoggedIn(localData)) {
			dispatch(foundUser(localData))
			dispatch(setSnackbar({show: true, message: "Welcome Back.", type: 1}))
		}
		else dispatch(showModal(SHOW_LOGIN_MODAL))
		dispatch(hideSpinner())
	}

	const handleWalletConnect = () => {
		console.log("connecting wallet")
		if(isUsable(WalletState.support) && WalletState.support === true && isUsable(WalletState.wallet.provider)){
			console.log("using prev connection")
			connectWallet(WalletState.wallet.address)
		}
		else {
			console.log("creating new connection")
			Wallet.connectWallet().then(res => {
				console.log("new connection successful")
				dispatch(setWallet({ wallet: res.wallet, provider: res.provider, signer: res.signer, address: res.address }))
				connectWallet(res.address)
			}).catch(err => {
				console.log("new connection failed")
				dispatch(setSnackbar({show: true, message: "Error while connecting to wallet", type: 4}))
			})
		}
	}

	const NAV_ITEMS = [
		{ id: "NI1",title: "Explore" ,url: "/explore",uri: null, icon: CompassIcon ,action: null, subMenu: null },
		{ id: "NI2",title: "Publish" ,url: "/publish" ,uri: null, icon: PlusSquareIcon ,action: null, subMenu: null },
		{ id: "NI3",title: "Resources",url: null ,uri: null, icon: GridIcon ,action: null,
			subMenu: [
				{id: "NI3SMI1",title: "Blog" ,url: null,uri: "https://nalndamktplace.medium.com/",icon: null,action: null,},
				{id: "NI3SMI2",title: "Whitepaper",url: null,uri: "https://docs.nalnda.com/" ,icon: null,action: null,},
			],
		},
		{ id: "NI4",title: "Account", url: null,uri: null,icon: UserIcon,action: null,
			subMenu: [
				{id: "NI4SMI1",title: "Profile",url: "/profile",uri: null,icon: null,action: null,},
				{id: "NI4SMI2",title: "Connect Wallet", url: null ,uri: null,icon: null,action: () => handleWalletConnect(),},
				{id: "NI4SMI3",title: "Wallet", url: null ,uri: null,icon: null,action: () => isUsable(WalletState.wallet.wallet)?WalletState.wallet.wallet.sequence.openWallet():null,},
				{id: "NI4SMI4",title: "Library",url: "/library",uri: null,icon: null,action: null},
				{id: "NI4SMI5",title: "Logout", url: "/" ,uri: null,icon: null,action: () => {logOutHandler()}},
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

	const logOutHandler = () => {
		handleWalletDisconnect()
		dispatch(unsetUser())
	}

	const renderNavItems = () => {
		const domElements = []
		NAV_ITEMS.forEach(item => {
			if(!isUserLoggedIn(UserState) && item.id === "NI4") return
			if(isUsable(item.subMenu)){
				const subMenuitems = []
				item.subMenu.forEach(navItem => {
					if(navItem.id === "NI4SMI2" && isWalletConnected(WalletState)){}
					else if(navItem.id === "NI4SMI3" && !isWalletConnected(WalletState)){}
					else subMenuitems.push(
						<div onClick={()=>menuItemClickHandler(navItem)} key={navItem.id} className='header__content__navbar__link__subitem typo__act typo__transform--capital'>
							{isUsable(navItem.icon) && <item.icon/>}
							{navItem.id !== "NI4" && <span>{navItem.title}</span>}
						</div>
					)
				})
				domElements.push(
					<Dropdown 
						key={item.id}
						button={<div key={item.id} className="header__content__navbar__link typo__act typo__transform--capital" onClick={()=>menuItemClickHandler(item)}>
							{isUsable(item.icon) && <item.icon/>}
							{item.id !== "NI4" && <span>{item.title}</span>}
						</div>}
						options={subMenuitems}
					/>
				)
			} else {
				domElements.push(
					<div key={item.id} className="header__content__navbar__link typo__act typo__transform--capital" onClick={()=>menuItemClickHandler(item)}>
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
							<div className='header__content__search__result__info__name typo__head typo__subtitle typo__transform--capital'>{result.title}</div>
							<div className='header__content__search__result__info__author typo__subtitle typo__subtitle--2 typo__transform--upper'>{result.author}</div>
							<div className='index__collection__books__item__data__price typo__act typo__color--success'>{result.price===0?"FREE":<><USDCIcon stroke='currentColor' width={20} height={20}/>{result.price}</>}</div>
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

	useEffect(() => {
		console.log({WalletState})
	}, [WalletState])

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
					{!isUserLoggedIn(UserState) && <Button type="primary" size="lg" onClick={loginHandler}>Log In</Button>}
				</div>
				<div className={getSubMenuClasses()} onClick={()=>toggleMenu()}>
					<div/><div/><div/>
				</div>
			</div>
			{showRibbion && isFilled(Collections) && <div className="header__ribbion">
				{Collections.map(collection=><div key={collection.id} onClick={()=>navigate('/collection', {state: {id: collection.id, name: collection.name}})} className="header__ribbion__item typo__transform--capital">{collection.name}</div>)}
				</div>
			}
			<SideNavbar MenuOpen={MenuOpen} setMenuOpen={setMenuOpen} WalletState={WalletState} loginHandler={loginHandler} handleWalletConnect={handleWalletConnect} handleWalletDisconnect={handleWalletDisconnect} toggleMenu={toggleMenu} NAV_ITEMS={NAV_ITEMS} />
		</header>
	)
}

export default Header
