import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import React, { useEffect, useState } from 'react'

import Contracts from '../connections/contracts'

import Page from '../components/hoc/Page/Page'
import InputField from '../components/ui/Input/Input'

import { isUsable } from '../helpers/functions'
import { setSnackbar } from '../store/actions/snackbar'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

import FilterIcon from '../assets/icons/filter.svg'
import BooksShelf from '../assets/images/books-shelf.png'
import {ReactComponent as USDCIcon} from "../assets/icons/usdc-icon.svg"

import { BASE_URL } from '../config/env'
import Wallet from '../connections/wallet'

const ExplorePage = props => {

	const FILTERS = [{ name: 'genres', type: 'options', values: ['adventure', 'art', 'autobiography', 'biography', 'business', 'children\'s fiction', 'cooking', 'fantasy', 'health & fitness', 'historical fiction', 'history', 'horror', 'humor', 'inspirational', 'mystery', 'romance', 'selfhelp', 'science fiction', 'thriller', 'travel'] }, { name: 'price', type: 'range', min: 0, max: 1000, step: 10 }]

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const WalletState = useSelector(state => state.WalletState.wallet)

	const [Nfts, setNfts] = useState([])
	const [WalletAddress, setWalletAddress] = useState(null)
	const [Filters, setFilters] = useState(false)
	const [Loading, setLoading] = useState(false)
	const [ActiveFilters, setActiveFilters] = useState([{name: 'genres', active: null},{name: 'price', active: null}])
	const [PriceRange, setPriceRange] = useState(null)

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => { loadNftHandler() }, [])

	useEffect(() => {
		setLoading(true)
		Wallet.getAccountAddress().then(res => {
			setWalletAddress(res)
		}).catch(err => {
			console.error({err})
			dispatch(setSnackbar({show: true, message: "Unable to get wallet address", type: 4}))
		}).finally(() => setLoading(false))
	}, [dispatch])

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

		if(ActiveFilters.indexOf(v => isUsable(v['active']))){
			const activeFilters = ActiveFilters.filter(v => isUsable(v['active']))
			activeFilters.forEach(filter => {
				switch (filter.name) {
					case 'status':
						if(filter.active === 0) nfts = nfts.filter(v => v.sold)
						else if(filter.active === 1) nfts = nfts.filter(v => !v.sold)
						break
					case 'price':
						if(isUsable(filter.active)) nfts = nfts.filter(v => v.price <= filter.active)
						break
					case 'genres':
						nfts = nfts.filter(v => {
							if(isUsable(v.genres)) return v.genres.indexOf(FILTERS.filter(v => v.name === 'genres')[0].values[filter.active]) > -1
							else {
								return false
							}
						})
						break
					default:
				}
			})
		}

		nfts.forEach(nft => {
			nftDOM.push(
				<div className='explore__data__books__item' key={nft.tokenId} onClick={()=>openHandler(nft)}>
					<img className='explore__data__books__item__cover' src={nft.cover} alt={nft.name} />
					<div className="explore__data__books__item__data">
						<p className='explore__data__books__item__data__author typo__body typo__body--2'>{nft.author}</p>
						<p className='explore__data__books__item__data__name typo__body typo__body--2'>{nft.title}</p>
					</div>
					<div className="explore__data__books__item__action">
						<div onClick={()=>buyHandler(nft)}>Buy</div>
						<p className='explore__data__books__item__action__price typo__body typo__body--2 utils__d__flex utils__align__center'>{nft.price}&nbsp;<USDCIcon width={20} height={20} fill="currentColor"/></p>
					</div>
				</div>
			)
		})
		return nftDOM
	}

	const filterHandler = (filter, index) => {
		setActiveFilters(old => {
			const activeFilter = old.filter(v => v['name'] === filter.name)
			const otherFilters = old.filter(v => v['name'] !== filter.name)
			if(filter.type === 'options'){
				if(isUsable(activeFilter) && activeFilter.length === 1 && activeFilter[0].active === index) return [...otherFilters, {name: filter.name, active: null}]
				return [...otherFilters, {name: filter.name, active: index}]
			}
			else if(filter.type === 'range'){
				setPriceRange(index)
				return [...otherFilters, {name: filter.name, active: index}]
			}
		})
	}

	const renderFilters = () => {

		const renderFilterValues = filter => {
			let valuesDOM = []
			filter.values.forEach((value, index) => {
				const activeFilter = ActiveFilters.filter(v => v['name'] === filter.name)
				if(isUsable(activeFilter) && activeFilter.length === 1 && activeFilter[0].active === index)
					valuesDOM.push( <div onClick={()=>filterHandler(filter, index)} className="typo__body--2 typo__align--center explore__data__filters__item__grid__item explore__data__filters__item__grid__item--active" key={filter.name+index.toString()}>{value}</div> )
				else valuesDOM.push( <div onClick={()=>filterHandler(filter, index)} className="typo__body--2 typo__align--center explore__data__filters__item__grid__item" key={filter.name+index.toString()}>{value}</div> )
			} )
			return valuesDOM
		}

		let filtersDOM = []
		FILTERS.forEach((filter, index) => {
			if(filter.type === 'options') filtersDOM.push(
				<div className="explore__data__filters__item" key={"filter"+index.toString()}>
					<div className="explore__data__filters__item__head"><h6 className="typo__head typo__head--6">{filter.name}</h6></div>
					<div className="explore__data__filters__item__grid">{renderFilterValues(filter)}</div>
				</div>
			)
			else if(filter.type === 'range') filtersDOM.push(
				<div className="explore__data__filters__item" key={"filter"+index.toString()}>
					<div className="explore__data__filters__item__head"><h6 className="typo__head typo__head--6">{filter.name}</h6></div>
					<p className="typo__body typo__body--2">{isUsable(PriceRange)?"≤ "+PriceRange+" USDC":"Showing all books"}</p>
					<InputField type="range" min={filter.min} max={filter.max} step={filter.step} onChange={e=>filterHandler(filter, e.target.value)}/>
				</div>
			)
		})
		return filtersDOM
	}

	return (
		<Page noFooter={true} fluid={true} containerClass={'explore'}>
			<div className="explore__head">
				<h3 className='typo__head typo__head--3'>Explore eBooks</h3>
			</div>
			<div className="explore__data">
				<div className={Filters?"explore__data__filters explore__data__filters--expanded":"explore__data__filters"} onClick={()=>setFilters(old => !old)}>
					<div className="explore__data__filters__head explore__data__filters__item">
						<img className='explore__data__filters__head__icon' src={FilterIcon} alt="filters"/>
						<h6 className="typo__head typo__head--6">Filters</h6>
					</div>
					{renderFilters()}
				</div>
				{isUsable(Nfts) && Nfts.length>0?
					<div className="explore__data__books">
						<div className="explore__data__books__wrapper">
							{renderNfts()}
						</div>
					</div>
					:
					<div className="explore__data__books account__data__books--empty">
						<img src={BooksShelf} alt="books shelf" className="explore__data__books__image" />
						<h4 className="typo__head typo__head--4">No eBooks yet</h4>
					</div>
				}
			</div>
		</Page>
	)
}

export default ExplorePage
