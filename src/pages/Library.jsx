import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import Wallet from '../connections/wallet'
import { setWallet } from '../store/actions/wallet'
import { setSnackbar } from '../store/actions/snackbar'
import { isFilled, isUsable, isUserLoggedIn } from '../helpers/functions'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

import Page from '../components/hoc/Page/Page'
import Button from '../components/ui/Buttons/Button'
import FilterPanel from '../components/ui/FilterPanel/FilterPanel'

import { BASE_URL } from '../config/env'
import { ACCOUNT_PAGE_FILTERS } from '../config/filters'

import BookItem from '../components/ui/BookItem/BookItem'
import {ReactComponent as FilterIcon} from "../assets/icons/filter.svg"
import {ReactComponent as GridViewIcon} from "../assets/icons/layout-grid.svg"
import {ReactComponent as ListViewIcon} from "../assets/icons/layout-list.svg"
import GaTracker from '../trackers/ga-tracker'

import { useWeb3AuthContext } from '../contexts/SocialLoginContext'

const LibraryPage = props => {

	const {
		connect,
		address,
		provider,
	} = useWeb3AuthContext();

	const DEFAULT_FILTERS = [{key: 'price', value: null, type: 'range'}, {key: 'genres', value: [], type: 'multiselect'}, {key: 'age_group', value: [], type: 'multiselect'}, {key: 'orderby', value: null, type: 'select'}, {key: 'decayscore', value: null, type: 'range'}]

	const params = useLocation()
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const UserState = useSelector(state => state.UserState)
	const BWalletState = useSelector(state => state.BWalletState)

	const [Nfts, setNfts] = useState([])
	const [AllNfts, setAllNfts] = useState([])
	const [Filters, setFilters] = useState(DEFAULT_FILTERS)
	const [Loading, setLoading] = useState(false)
	const [ActiveTab, setActiveTab] = useState(0)
	const [WalletAddress, setWalletAddress] = useState(null)
	const [FiltersPanelOpen, setFiltersPanelOpen] = useState(false)
	const [layout, setLayout] = useState(window.innerWidth<600?"LIST":"GRID")
	const [maxPrice, setMaxPrice] = useState(100);

	useEffect(() => { GaTracker('page_view_account') }, [])

	useEffect(() => {
		if(ActiveTab === 0) GaTracker('tab_view_account_owned')
		else GaTracker('tab_view_account_published')
	}, [ActiveTab])
	
	const loginHandler = async () => {
		connect();
	}

	const connectWallet = useCallback(
		() => {
			if(!address){
				loginHandler();
			}
			Wallet(provider, dispatch);
		},[dispatch]
	)

	useEffect(() => {
		GaTracker('event_library_filter')
		let nfts = AllNfts
		if(isUsable(nfts)){
			Filters.forEach(filter => {
				switch (filter.type) {
					case 'range':
						if(isUsable(filter.value))
						nfts = nfts.filter(nft => nft[filter.key] <= filter.value)
						break
					case 'multiselect':
						if(isFilled(filter.value)){
							let tempNfts = []
							filter.value.forEach(filterValue => nfts.forEach(nft => { if(nft[filter.key].indexOf(filterValue)>-1 && tempNfts.filter(tempNft => tempNft["id"] === nft.id).length<1) tempNfts.push(nft) }) )
							nfts = tempNfts
						}
						break
					case 'select':
						if(filter.key === 'orderby'){
							switch (filter.value) {
								case 'PRICE_L_H':
									nfts.sort((a,b) => a.price<b.price)
									break
								case 'PRICE_H_L':
									nfts.sort((a,b) => a.price>b.price)
									break
								case 'RATING_L_H':
									nfts.sort((a,b) => a.rating<b.rating)
									break
								case 'RATING_H_L':
									nfts.sort((a,b) => a.rating>b.rating)
									break
								default:
									break
							}
						}
						break
					default:
						break
				}
			})
			setNfts(nfts)
		}
	}, [Filters, AllNfts])

	useEffect(() => {
		if(isUsable(params.state)){
			const tab = params.state.tab
			if(tab === 'published') setActiveTab(1)
			else setActiveTab(0)
		}
	}, [params])

	useEffect(() => {
		setLoading(true)
		if(isUsable(BWalletState.smartAccount)) setWalletAddress(BWalletState.smartAccount.address)
		else connectWallet()
		setLoading(false)
	}, [BWalletState, connectWallet])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		if(isUserLoggedIn(UserState)){
			setLoading(true)
			if(ActiveTab === 0)
				axios({
					url: BASE_URL+'/api/user/books/owned',
					method: 'GET',
					headers: {
						'user-id': UserState.user.uid,
						'authorization': `Bearer ${UserState.tokens.acsTkn.tkn}`
					},
					params: {userAddress: WalletAddress}
				}).then(res => {
					if(res.status === 200) setAllNfts(res.data)
					else dispatch(setSnackbar('NOT200'))
				}).catch(err => {
					dispatch(setSnackbar('ERROR'))
				}).finally(() => setLoading(false))
			else if(ActiveTab === 1)
				axios({
					url: BASE_URL+'/api/user/books/published',
					method: 'GET',
					headers: {
						'user-id': UserState.user.uid,
						'authorization': `Bearer ${UserState.tokens.acsTkn.tkn}`
					},
					params: {userAddress: WalletAddress}
				}).then(res => {
					if(res.status === 200) setAllNfts(res.data)
					else dispatch(setSnackbar('NOT200'))
				}).catch(err => {
					dispatch(setSnackbar('ERROR'))
				}).finally(() => setLoading(false))
		}
	}, [ActiveTab, WalletAddress, dispatch, UserState])

	useEffect(()=>{
		if(!isFilled(AllNfts)) return ;
		let maxNftPrice = Math.max(...AllNfts.map(nft => nft.price));
		maxNftPrice = Math.ceil(maxNftPrice / 10) * 10 ; 
		setMaxPrice(maxNftPrice||100)
	},[AllNfts])

	const readHandler = async (NFT) => {
		setLoading(true)
		try {
			axios({
				url: `${BASE_URL}/api/verify`,
				method: 'GET',
				params: {
					bookAddress: NFT.book_address,
					ownerAddress: WalletAddress
				}
			}).then(res => {
				if(res.status === 200){
					const messageToSign = res.data
					Wallet.signMessage(BWalletState.smartAccount.signer, JSON.stringify(messageToSign)).then(res => {
						if(res.isValid === true){
							axios({
								url : BASE_URL + '/api/verify',
								method : "POST",
								data : {
									accountAddress: WalletAddress,
									bookAddress: NFT.book_address,
									signedData: res.signedData,
									cid : NFT.book.slice(NFT.book.lastIndexOf("/")+1),
								}
							}).then(res=>{
								if(res.status === 200) {
									GaTracker('navigate_book_reader')
									navigate('/library/reader', {state: {book: {...NFT,submarineURL:res.data.url}, preview: false}}) 
								} else {
									dispatch(setSnackbar({show:true,message : "Error", type : 4}))
								}
							}).catch(err => {
							}).finally( () => setLoading(false))
						}
						else dispatch(setSnackbar({show: true, message: "Could not verify the authenticity of the signature.", type: 3}))
					})
				}
				else dispatch(setSnackbar('NOT200'))
			})
		} catch (err) {
			setLoading(false)
		}
	}

	const openHandler = nft => {
		GaTracker('navigate_account_book')
		navigate(`/book/${nft.id}`)
	}

	const renderNfts = () => {
		let nftDOM = []
		let nfts = Nfts
		nfts.forEach(nft => { nftDOM.push(<BookItem state={nft.publisher_address===WalletAddress?'publisher':'owned'} layout={layout} key={nft.id} book={nft} onRead={()=>readHandler(nft)} onOpen={()=>openHandler(nft)}/>) })
		return nftDOM
	}

	return (
		<>
			<Helmet>
				<meta name='Library' content='Explore library of  books' />
			</Helmet>
			<Page noFooter={true} showRibbion={false} noPadding={true} fluid={true} containerClass={'explore'}>
			<div className="account__data">
				<div className="account__data__filter-panel-container" data-filter-open={FiltersPanelOpen}>
					<FilterPanel maxPrice={maxPrice} setFiltersPanelOpen={setFiltersPanelOpen} config={ACCOUNT_PAGE_FILTERS} defaults={DEFAULT_FILTERS} filters={Filters} setFilters={setFilters}/>
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
							: 	<div className='account__data__books__wrapper__empty'>
									<img src='https://imagedelivery.net/yOWneHxM1h9mu46Te3Yjwg/fb06196e-29ca-4c59-9460-6fdbd43fa700/square240' alt="books shelf" className="account__data__books__wrapper__image" loading="lazy"/>
									<h4 className="typo__head typo__head--4">No eBooks yet</h4>
								</div>
						}
					</div>
					
				</div>
			</div>
		</Page>
		</>
	)
}

export default LibraryPage
