import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import React, { useCallback, useEffect, useState } from 'react'

import Wallet from '../connections/wallet'

import Page from '../components/hoc/Page/Page'
import InputField from '../components/ui/Input/Input'

import { isUsable } from '../helpers/functions'
import { setWallet } from '../store/actions/wallet'
import { setSnackbar } from '../store/actions/snackbar'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

import FilterIcon from '../assets/icons/filter.svg'
import BooksShelf from '../assets/images/books-shelf.png'
import {ReactComponent as USDCIcon} from "../assets/icons/usdc-icon.svg";

import { BASE_URL } from '../config/env'

const AccountPage = props => {

	const FILTERS = [
		[{ name: 'genres', type: 'options', values: ['adventure', 'art', 'autobiography', 'biography', 'business', 'children\'s fiction', 'cooking', 'fantasy', 'health & fitness', 'historical fiction', 'history', 'horror', 'humor', 'inspirational', 'mystery', 'romance', 'selfhelp', 'science fiction', 'thriller', 'travel'] }, { name: 'price', type: 'range', min: 0, max: 1000, step: 10 }],
		[{ name: 'genres', type: 'options', values: ['adventure', 'art', 'autobiography', 'biography', 'business', 'children\'s fiction', 'cooking', 'fantasy', 'health & fitness', 'historical fiction', 'history', 'horror', 'humor', 'inspirational', 'mystery', 'romance', 'selfhelp', 'science fiction', 'thriller', 'travel'] }, { name: 'status', type: 'options', values: ['sold', 'listed'] }, { name: 'price', type: 'range', min: 0, max: 1000, step: 10 }],
	]

	const params = useLocation()
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const WalletState = useSelector(state => state.WalletState.wallet)

	const [Nfts, setNfts] = useState([])
	const [Filters, setFilters] = useState(false)
	const [Loading, setLoading] = useState(false)
	const [ActiveTab, setActiveTab] = useState(0)
	const [WalletAddress, setWalletAddress] = useState(null)
	const [ActiveFilters, setActiveFilters] = useState([{name: 'status', active: null},{name: 'price', active: null}])
	const [PriceRange, setPriceRange] = useState(null)

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
							if(isUsable(v.genres)) return v.genres.indexOf(FILTERS[ActiveTab].filter(v => v.name === 'genres')[0].values[filter.active]) > -1
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
				<div className='account__data__books__item' key={nft.tokenId} onClick={()=>openHandler(nft)}>
					<img className='account__data__books__item__cover' src={nft.cover} alt={nft.name} />
					<div className="account__data__books__item__data">
						{ActiveTab!==1?<p className='account__data__books__item__data__author typo__body typo__body--2'>{nft.author}</p>:null}
						<p className='account__data__books__item__data__name typo__body typo__body--2'>{nft.title}</p>
					</div>
					<div className="account__data__books__item__action">
						<div onClick={()=>readHandler(nft)}>Read</div>
						<p className='account__data__books__item__action__price typo__body typo__body--2 utils__d__flex utils__align__center'>{nft.price}&nbsp;<USDCIcon width={20} height={20} fill="currentColor"/></p>
					</div>
				</div>
			)
		})
		return nftDOM
	}

	const renderTabs = () => {
		let tabs = ['library', 'published']
		let tabsDOM = []
		tabs.forEach((tab, index) => {
			if(index === ActiveTab) tabsDOM.push(
				<div key={tab} className="account__tabs__item">
					<p className="account__tabs__item__label account__tabs__item__label--active typo__body">{tab}</p>
				</div>
			)
			else tabsDOM.push(
				<div key={tab} onClick={()=>setActiveTab(index)} className="account__tabs__item">
					<p className="account__tabs__item__label typo__body">{tab}</p>
				</div>
			)
		})
		return tabsDOM
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
				valuesDOM.push( <div onClick={()=>filterHandler(filter, index)} className="typo__body--2 typo__align--center account__data__filters__item__grid__item account__data__filters__item__grid__item--active" key={filter.name+index.toString()}>{value}</div> )
				else valuesDOM.push( <div onClick={()=>filterHandler(filter, index)} className="typo__body--2 typo__align--center account__data__filters__item__grid__item" key={filter.name+index.toString()}>{value}</div> )
			} )
			return valuesDOM
		}

		let filtersDOM = []
		FILTERS[ActiveTab].forEach((filter, index) => {
			if(filter.type === 'options') filtersDOM.push(
				<div className="account__data__filters__item" key={"filter"+index.toString()}>
					<div className="account__data__filters__item__head"><h6 className="typo__head typo__head--6">{filter.name}</h6></div>
					<div className="account__data__filters__item__grid">{renderFilterValues(filter)}</div>
				</div>
			)
			else if(filter.type === 'range') filtersDOM.push(
				<div className="account__data__filters__item" key={"filter"+index.toString()}>
					<div className="account__data__filters__item__head"><h6 className="typo__head typo__head--6">{filter.name}</h6></div>
					<p className="typo__body typo__body--2">{isUsable(PriceRange)?"≤ "+PriceRange:"Showing all books"}</p>
					<InputField type="range" min={filter.min} max={filter.max} step={filter.step} onChange={e=>filterHandler(filter, e.target.value)}/>
				</div>
			)
		})
		return filtersDOM
	}

	return (
		<Page noFooter={true} fluid={true} containerClass={'explore'}>
			<div className="account__head">
				<h3 className='typo__head typo__head--3'>{WalletAddress?WalletAddress:"John Doe"}</h3>
			</div>
			<div className="account__tabs">
				{renderTabs()}
			</div>
			<div className="account__data">
				<div className={Filters?"account__data__filters account__data__filters--expanded":"account__data__filters"} onClick={()=>setFilters(old => !old)}>
					<div className="account__data__filters__head account__data__filters__item">
						<img className='account__data__filters__head__icon' src={FilterIcon} alt="filters"/>
						<h6 className="typo__head typo__head--6">Filters</h6>
					</div>
					{renderFilters()}
				</div>
				{isUsable(Nfts) && Nfts.length>0?
					<div className="account__data__books">
						<div className="account__data__books__wrapper">
							{renderNfts()}
						</div>
					</div>
					:
					<div className="account__data__books account__data__books--empty">
						<img src={BooksShelf} alt="books shelf" className="account__data__books__image" />
						<h4 className="typo__head typo__head--4">No eBooks yet</h4>
					</div>
				}
			</div>
		</Page>
	)
}

export default AccountPage