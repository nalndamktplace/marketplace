import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { isUsable } from '../helpers/functions'
import { setSnackbar } from '../store/actions/snackbar'
import { hideSpinner, showSpinner } from '../store/actions/spinner'
import { BASE_URL } from '../config/env'
import { EXPLORE_PAGE_FILTERS } from '../config/filters'
import axios from 'axios'
import Contracts from '../connections/contracts'
import Page from '../components/hoc/Page/Page'
import FilterPanel from '../components/ui/FilterPanel/FilterPanel'
import BookItem from '../components/ui/BookItem/BookItem'
import BooksShelf from '../assets/images/books-shelf.png'
import {ReactComponent as GridViewIcon} from "../assets/icons/layout-grid.svg"
import {ReactComponent as ListViewIcon} from "../assets/icons/layout-list.svg"
import {ReactComponent as FilterIcon} from "../assets/icons/filter.svg"
import Button from '../components/ui/Buttons/Button'
import Pagination from '../components/ui/Pagination/Pagination'

const ExplorePage = () => {

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const WalletState = useSelector(state => state.WalletState)

	const [Nfts, setNfts] = useState([])
	const [WalletAddress, setWalletAddress] = useState(null)
	const [Filters, setFilters] = useState({})
	const [Loading, setLoading] = useState(false)
	const [FiltersPanelOpen, setFiltersPanelOpen] = useState(false);
	const [layout, setLayout] = useState("GRID");
	const [currentPage, setCurrentPage] = useState(1);
	const [maxPage, setMaxPage] = useState(10);
	const location = useLocation();

	useEffect(()=>{
		console.log("location");
	},[location])

	useEffect(()=>{
		console.log(Filters);
	},[Filters])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => { loadNftHandler() }, [])

	useEffect(() => {
		setLoading(true)
		if(isUsable(WalletState)) setWalletAddress(WalletState.wallet)
		setLoading(false)
	}, [WalletState])

	const loadNftHandler = () => {
		setLoading(true)
		axios({
			url: BASE_URL + '/api/book/all',
			method: 'GET'
		}).then(res => {
			if(res.status === 200) setNfts(res.data)
			else dispatch(setSnackbar('NOT200'))
		}).catch(err => {
			dispatch(setSnackbar('ERROR'))
		}).finally(() => setLoading(false))
	}

	const buyHandler = nft => {
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

	const openHandler = nft => { navigate('/book', {state: nft}) }

	const renderNfts = () => {
		let nftDOM = []
		let nfts = Nfts
		nfts.forEach(nft => {
			nftDOM.push(<BookItem layout={layout} key={nft.id} book={nft} onBuy={()=>buyHandler(nft)} onOpen={()=>openHandler(nft)}/>);
		})
		return nftDOM
	}

	return (
		<Page noFooter={true} showRibbion={false} noPadding={true} fluid={true} containerClass={'explore'}>
			<div className="explore__data">
				<div className="explore__data__filter-panel-container" data-filter-open={FiltersPanelOpen}>
					<FilterPanel config={EXPLORE_PAGE_FILTERS} filters={Filters} setFilters={setFilters}/>
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
