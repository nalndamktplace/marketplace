import axios from 'axios'
import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setSnackbar } from '../store/actions/snackbar'
import { isFilled, isUsable } from '../helpers/functions'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

import { BASE_URL } from '../config/env'
import { EXPLORE_PAGE_FILTERS } from '../config/filters'

import Page from '../components/hoc/Page/Page'
import Contracts from '../connections/contracts'
import Button from '../components/ui/Buttons/Button'
import BookItem from '../components/ui/BookItem/BookItem'
import Pagination from '../components/ui/Pagination/Pagination'
import FilterPanel from '../components/ui/FilterPanel/FilterPanel'

import BooksShelf from '../assets/images/books-shelf.png'
import {ReactComponent as FilterIcon} from "../assets/icons/filter.svg"
import {ReactComponent as GridViewIcon} from "../assets/icons/layout-grid.svg"
import {ReactComponent as ListViewIcon} from "../assets/icons/layout-list.svg"
import GaTracker from '../trackers/ga-tracker'

const ExplorePage = () => {

	const DEFAULT_FILTERS = [{key: 'market', value: 'new', type: 'tab'}, {key: 'price', value: null, type: 'range'}, {key: 'genres', value: [], type: 'multiselect'}, {key: 'orderby', value: null, type: 'select'}]

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const WalletState = useSelector(state => state.WalletState)

	const [Nfts, setNfts] = useState([])
	const [WalletAddress, setWalletAddress] = useState(null)
	const [Filters, setFilters] = useState(DEFAULT_FILTERS)
	const [Loading, setLoading] = useState(false)
	const [FiltersPanelOpen, setFiltersPanelOpen] = useState(false)
	const [layout, setLayout] = useState("GRID")
	const [currentPage, setCurrentPage] = useState(1)
	const [maxPage, setMaxPage] = useState(10)
	const [AllNfts, setAllNfts] = useState([])

	useEffect(() => { GaTracker('page_view_explore') }, [])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		setLoading(true)
		axios({
			url: BASE_URL + '/api/book/all',
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
		if(isUsable(WalletState)) setWalletAddress(WalletState.wallet)
		setLoading(false)
	}, [WalletState])

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
							filter.value.forEach(filterValue => nfts.forEach(nft => { if(nft.genres.indexOf(filterValue)>-1 && tempNfts.filter(tempNft => tempNft["id"] === nft.id).length<1) tempNfts.push(nft) }) )
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

	const buyHandler = nft => {
		GaTracker('event_explore_purchase_book')
		setLoading(true)
		Contracts.purchaseNft(WalletAddress, nft.book_address, nft.price.toString()).then(res => {
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
		navigate('/book', {state: nft})
	}

	const renderNfts = () => {
		let nftDOM = []
		Nfts.forEach(nft => {
			nftDOM.push(<BookItem layout={layout} key={nft.id} book={nft} onBuy={()=>buyHandler(nft)} onOpen={()=>openHandler(nft)}/>)
		})
		return nftDOM
	}

	return (
		<Page noFooter={true} showRibbion={false} noPadding={true} fluid={true} containerClass={'explore'}>
			<div className="explore__data">
				<div className="explore__data__filter-panel-container" data-filter-open={FiltersPanelOpen}>
					<FilterPanel config={EXPLORE_PAGE_FILTERS} defaults={DEFAULT_FILTERS} filters={Filters} setFilters={setFilters}/>
				</div>
				<div className="explore__data__books" data-filter-open={FiltersPanelOpen}> 
					<div className="explore__data__books__header">
						<div className='explore__data__books__header__filter'>
							<Button type="icon" onClick={()=>setFiltersPanelOpen(s=>!s)}><FilterIcon fill={FiltersPanelOpen?"currentColor":"transparent"} /></Button>
							<div className="typo__color--n500">Found <span className="typo__color--n700" style={{fontWeight:"500"}}>{Nfts.length}</span> results</div>
						</div>
						<div className="explore__data__books__header__layout">
							<Button className="account__data__books__header__layout__button" onClick={()=>setLayout("LIST")}><ListViewIcon/><span>List</span></Button>
							<Button className="account__data__books__header__layout__button" onClick={()=>setLayout("GRID")}><GridViewIcon/><span>GRID</span></Button>
						</div>
					</div>
					<div className="explore__data__books__wrapper" data-layout={layout}>
						{isUsable(Nfts) && Nfts.length > 0
							? 	renderNfts()
							: 	<div className='explore__data__books__empty'>
									<img src={BooksShelf} alt="books shelf" className="explore__data__books__image" />
									<h4 className="typo__head typo__head--4">No eBooks yet</h4>
								</div>
						}
						<div className="explore__data__books__wrapper__pagination">
							<Pagination max={maxPage} current={currentPage} onPageChange={(p)=>setCurrentPage(p)} />
						</div>
					</div>
					
				</div>
			</div>
		</Page>
	)
}

export default ExplorePage
