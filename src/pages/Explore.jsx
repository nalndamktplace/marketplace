import axios from 'axios'
import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'

import { setSnackbar } from '../store/actions/snackbar'
import { isFilled, isUsable } from '../helpers/functions'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

import { BASE_URL } from '../config/env'
import { EXPLORE_PAGE_FILTERS } from '../config/filters'

import Page from '../components/hoc/Page/Page'
import Contracts from '../connections/contracts'
import Button from '../components/ui/Buttons/Button'
import BookItem from '../components/ui/BookItem/BookItem'
import FilterPanel from '../components/ui/FilterPanel/FilterPanel'
import { showModal, SHOW_SEARCH_MODAL } from '../store/actions/modal'
import SearchModal from '../components/modal/Search/SearchModal'

import {ReactComponent as FilterIcon} from "../assets/icons/filter.svg"
import {ReactComponent as SearchIcon} from "../assets/icons/search.svg"
import GaTracker from '../trackers/ga-tracker'

const ExplorePage = () => {

	const DEFAULT_FILTERS = [{key: 'price', value: null, type: 'range'}, {key: 'genres', value: [], type: 'multiselect'}, {key: 'age_group', value: [], type: 'multiselect'}, {key: 'orderby', value: null, type: 'select'}]

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const BWalletState = useSelector(state => state.BWalletState)

	const [Nfts, setNfts] = useState([])
	const [WalletAddress, setWalletAddress] = useState(null)
	const [Filters, setFilters] = useState(DEFAULT_FILTERS)
	const [Loading, setLoading] = useState(false)
	const [FiltersPanelOpen, setFiltersPanelOpen] = useState(false)
	const [AllNfts, setAllNfts] = useState([])
	const [maxPrice, setMaxPrice] = useState(100);
	const buyHandler = nft => {
		GaTracker('event_explore_purchase_new')
		setLoading(true)
		Contracts.purchaseNft(WalletAddress, nft.book_address, nft.price.toString(), BWalletState.smartAccount.signer).then(res => {
			dispatch(setSnackbar({show: true, message: "Book purchased.", type: 1}))
			const tokenId = Number(res.events.filter(event => event.eventSignature === "Transfer(address,address,uint256)")[0].args[2]._hex)
			axios({
				url: BASE_URL+'/api/book/purchase',
				method: 'POST',
				data: {ownerAddress: WalletAddress, bookAddress: nft.book_address, tokenId}
			}).then(res => {
				if(res.status !== 200) dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
			axios({ url: BASE_URL+'/api/book/copies', method: 'POST', data: { bookAddress: nft.book_address, copies: tokenId } }).then(res => {
				if(res.status !== 200) dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			})
		}).catch(err => {
			setLoading(false)
			if(err.code === 4001)
				dispatch(setSnackbar({show: true, message: "Transaction denied by user.", type: 3}))
			else dispatch(setSnackbar('ERROR'))
		})
	}

	const openHandler = nft => {
		GaTracker('navigate_explore_book')
		navigate(`/book/${nft.id}`)
	}

	const renderNfts = () => {
		let nftDOM = []
		Nfts.forEach(nft => {
			nftDOM.push(<BookItem layout={window.innerWidth<600?"LIST":"GRID"} key={nft.id} book={nft} onBuy={()=>buyHandler(nft)} onOpen={()=>openHandler(nft)}/>)
		})
		return nftDOM
	}

	useEffect(() => { GaTracker('page_view_explore') }, [])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		setLoading(true)
		axios({
			url: BASE_URL + '/api/book',
			method: 'GET'
		}).then(res => {
			if(res.status === 200) setAllNfts(res.data)
			else dispatch(setSnackbar('NOT200'))
		}).catch(err => {
			dispatch(setSnackbar('ERROR'))
		}).finally(() => setLoading(false))
	}, [dispatch])

	useEffect(() => {
		setLoading(true)
		if(isUsable(BWalletState.smartAccount)) setWalletAddress(BWalletState.smartAccount.address)
		setLoading(false)
	}, [BWalletState])

	useEffect(() => {
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

	useEffect(()=>{
		if(!isFilled(AllNfts)) return ;
		let maxNftPrice = Math.max(...AllNfts.map(nft => nft.price));
		maxNftPrice = Math.ceil(maxNftPrice / 10) * 10 ; 
		setMaxPrice(maxNftPrice||100)
	},[AllNfts])

	const onSearch = () => {
		dispatch(showModal(SHOW_SEARCH_MODAL));
	}

	return (
		<>
			<Helmet>
			<meta name='Explore' content='Explore exciting books' />
		</Helmet>
		<Page noFooter={true} showRibbion={false} noPadding={true} fluid={true} containerClass={'explore'}>
			<div className="explore__data">
				<div className="explore__data__filter-panel-container" data-filter-open={FiltersPanelOpen}>
					<FilterPanel maxPrice={maxPrice} setFiltersPanelOpen={setFiltersPanelOpen} config={EXPLORE_PAGE_FILTERS} defaults={DEFAULT_FILTERS} filters={Filters} setFilters={setFilters}/>
				</div>
				<div className="explore__data__books" data-filter-open={FiltersPanelOpen}> 
					<div className="explore__data__books__header">
						<div className='explore__data__books__header__filter'>
							<Button type="icon" onClick={()=>setFiltersPanelOpen(s=>!s)}><FilterIcon fill={FiltersPanelOpen?"currentColor":"transparent"} /></Button>
							<div className="typo__body typo__color--n500">Found <span className="typo__color--n700" style={{fontWeight:"500"}}>{Nfts.length}</span> results</div>
						</div>{
							window.innerWidth<600?<div className="explore__data__books__header__layout">
							<Button className="account__data__books__header__layout__button typo__act" onClick={()=>onSearch()} ><SearchIcon/></Button>
						</div>:null
						}
						
					</div>
					<div className="explore__data__books__wrapper" data-layout={window.innerWidth<600?"LIST":"GRID"}>
						{isUsable(Nfts) && Nfts.length > 0
							? 	renderNfts()
							: 	<div className='explore__data__books__wrapper__empty'>
									<img src='https://imagedelivery.net/yOWneHxM1h9mu46Te3Yjwg/fb06196e-29ca-4c59-9460-6fdbd43fa700/square240' alt="books shelf" className="explore__data__books__wrapper__image" loading="lazy"/>
									<h4 className="typo__head typo__head--4">No eBooks yet</h4>
								</div>
						}
					</div>
					
				</div>
			</div>
			<SearchModal/>
		</Page>
		</>
	)
}

export default ExplorePage
