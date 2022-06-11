import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import React, { useCallback, useEffect, useState } from 'react'
import Wallet from '../connections/wallet'
import Page from '../components/hoc/Page/Page'
import { isUsable } from '../helpers/functions'
import { setWallet } from '../store/actions/wallet'
import { setSnackbar } from '../store/actions/snackbar'
import { hideSpinner, showSpinner } from '../store/actions/spinner'
import BooksShelf from '../assets/images/books-shelf.png'
import { BASE_URL } from '../config/env'
import Button from '../components/ui/Buttons/Button'
import Pagination from '../components/ui/Pagination/Pagination'
import FilterPanel from '../components/ui/FilterPanel/FilterPanel'
import { ACCOUNT_PAGE_FILTERS } from '../config/filters'
import BookItem from '../components/ui/BookItem/BookItem'
import {ReactComponent as GridViewIcon} from "../assets/icons/layout-grid.svg"
import {ReactComponent as ListViewIcon} from "../assets/icons/layout-list.svg"
import {ReactComponent as FilterIcon} from "../assets/icons/filter.svg"

const AccountPage = props => {

	const params = useLocation()
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const WalletState = useSelector(state => state.WalletState.wallet)

	const [Nfts, setNfts] = useState([])
	const [Filters, setFilters] = useState(false)
	const [Loading, setLoading] = useState(false)
	const [ActiveTab, setActiveTab] = useState(0)
	const [WalletAddress, setWalletAddress] = useState(null)
	const [FiltersPanelOpen, setFiltersPanelOpen] = useState(false);
	const [layout, setLayout] = useState("GRID");
	const [currentPage, setCurrentPage] = useState(1);
	const [maxPage, setMaxPage] = useState(10);
	
	const connectWallet = useCallback(
		() => {
			Wallet.connectWallet().then(res => {
				dispatch(setWallet(res.selectedAddress))
				dispatch(setSnackbar({show: true, message: "Wallet connected.", type: 1}))
			}).catch(err => {
				console.error({err})
				dispatch(setSnackbar({show: true, message: "Error while connecting to wallet", type: 4}))
			}).finally(() => setLoading(false))
		},[dispatch],
	)

	useEffect(() => {
		if(isUsable(params.state)){
			const tab = params.state.tab
			if(tab === 'created') setActiveTab(1)
			else setActiveTab(0)
		}
	}, [params])

	useEffect(() => {
		setLoading(true)
		if(isUsable(WalletState))
			setWalletAddress(WalletState)
		else connectWallet()
		setLoading(false)
	}, [WalletState, connectWallet])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		setLoading(true)
		if(ActiveTab === 0)
			axios({
				url: BASE_URL+'/api/user/books/owned',
				method: 'GET',
				params: {userAddress: WalletAddress}
			}).then(res => {
				if(res.status === 200) setNfts(res.data)
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		else if(ActiveTab === 1)
			axios({
				url: BASE_URL+'/api/user/books/created',
				method: 'GET',
				params: {userAddress: WalletAddress}
			}).then(res => {
				if(res.status === 200) setNfts(res.data)
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
	}, [ActiveTab, WalletAddress, dispatch])

	const readHandler = nft => { navigate('/account/reader', {state: nft}) }

	const openHandler = nft => { navigate('/book', {state: nft}) }

	const renderNfts = () => {
		let nftDOM = []
		let nfts = Nfts
		nfts.forEach(nft => {
			nftDOM.push(<BookItem layout={layout} key={nft.id} book={nft} onRead={()=>readHandler(nft)} onOpen={()=>openHandler(nft)}/>);
		})
		return nftDOM
	}

	return (
		<Page noFooter={true} showRibbion={false} noPadding={true} fluid={true} containerClass={'explore'}>
			<div className="account__data">
				<div className="account__data__filter-panel-container" data-filter-open={FiltersPanelOpen}>
					<FilterPanel config={ACCOUNT_PAGE_FILTERS} filters={Filters} setFilters={setFilters}/>
				</div>
				<div className="account__data__books" data-filter-open={FiltersPanelOpen}> 
					<div className="account__data__books__header">
						<div className='account__data__books__header__filter'>
							<Button type="icon" onClick={()=>setFiltersPanelOpen(s=>!s)}><FilterIcon fill={FiltersPanelOpen?"currentColor":"transparent"} /></Button>
							<div className="account__data__books__header__filter__tabs">
								<div onClick={()=>setActiveTab(0)} className="account__data__books__header__filter__tabs__item typo__head--6" data-state={ActiveTab===0}>Library</div>
								<div onClick={()=>setActiveTab(1)} className="account__data__books__header__filter__tabs__item typo__head--6" data-state={ActiveTab===1}>Published</div>
							</div>
						</div>
						<div className="account__data__books__header__layout">
							<Button className="account__data__books__header__layout__button" onClick={()=>setLayout("LIST")}><ListViewIcon/><span>List</span></Button>
							<Button className="account__data__books__header__layout__button" onClick={()=>setLayout("GRID")}><GridViewIcon/><span>GRID</span></Button>
						</div>
					</div>
					<div className="account__data__books__wrapper" data-layout={layout}>
						{isUsable(Nfts) && Nfts.length > 0
							? 	renderNfts()
							: 	<div className='account__data__books__empty'>
									<img src={BooksShelf} alt="books shelf" className="account__data__books__image" />
									<h4 className="typo__head typo__head--4">No eBooks yet</h4>
								</div>
						}
						<div className="account__data__books__wrapper__pagination">
							<Pagination max={maxPage} current={currentPage} onPageChange={(p)=>setCurrentPage(p)} />
						</div>
					</div>
					
				</div>
			</div>
		</Page>
	)
}

export default AccountPage