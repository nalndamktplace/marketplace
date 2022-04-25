import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import Web3Modal from "web3modal"

import Contracts from '../connections/contracts'

import Page from '../components/hoc/Page/Page'

import { isUsable } from '../helpers/functions'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

import FilterIcon from '../assets/icons/filter.svg'
import InputField from '../components/ui/Input/Input'

const ethers = require('ethers')

const AccountPage = props => {

	const FILTERS = [
		[{ name: 'genres', type: 'options', values: ['crime', 'action', 'selfhelp', 'drama', 'romance', 'comedy', 'satire', 'fiction'] }, { name: 'price', type: 'range', min: 0, max: 0.05, step: 0.00001}],
		[{ name: 'genres', type: 'options', values: ['crime', 'action', 'selfhelp', 'drama', 'romance', 'comedy', 'satire', 'fiction'] }, { name: 'status', type: 'options', values: ['sold', 'listed'] }, { name: 'price', type: 'range', min: 0, max: 0.05, step: 0.00001}],
	]

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [Nfts, setNfts] = useState([])
	const [Filters, setFilters] = useState(false)
	const [Loading, setLoading] = useState(false)
	const [ActiveTab, setActiveTab] = useState(0)
	const [Wallet, setWallet] = useState(null)
	const [ActiveFilters, setActiveFilters] = useState([{name: 'status', active: null},{name: 'price', active: null}])
	const [PriceRange, setPriceRange] = useState(null)

	useEffect(() => { getWalletAddress() }, [])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		setLoading(true)
		if(ActiveTab === 0)
			Contracts.loadMyNfts().then(res => {
				setLoading(false)
				setNfts(res)
			}).catch(err => {
				setLoading(false)
				console.log({err})
			})
		else if(ActiveTab === 1)
			Contracts.loadNftsCreated().then(res => {
				setLoading(false)
				setNfts(res)
			}).catch(err => {
				setLoading(false)
				console.log({err})
			})
	}, [ActiveTab])

	const getWalletAddress = async () => {
		setLoading(true)
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()
		signer.getAddress().then(res => {
			setWallet(res)
			setLoading(false)
		}).catch(err => {
			setLoading(false)
			console.log({err})
		})
	}

	const readHandler = nft => { navigate('/account/reader', {state: nft}) }

	const openHandler = nft => { navigate('/book', {state: nft}) }

	const renderNfts = () => {
		if(isUsable(Nfts) && Nfts.length>0){
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
									console.log({noGenres: v})
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
							{ActiveTab!==1?<p className='account__data__books__item__data__author typo__body typo__body--2'>{nft.description}</p>:null}
							<p className='account__data__books__item__data__name typo__body typo__body--2'>{nft.name}</p>
						</div>
						<div className="account__data__books__item__action">
							<div onClick={()=>readHandler(nft)}>Read</div>
							<p className='account__data__books__item__action__price typo__body typo__body--2'>{nft.price}&nbsp;ETH</p>
						</div>
					</div>
				)
			})
			return nftDOM
		}
		return <p>No NFTs Yet</p>
	}

	const renderTabs = () => {
		let tabs = ['library', 'created']
		let tabsDOM = []
		tabs.forEach((tab, index) => {
			if(index === ActiveTab) tabsDOM.push(
				<div className="account__tabs__item">
					<p className="account__tabs__item__label account__tabs__item__label--active typo__body">{tab}</p>
				</div>
			)
			else tabsDOM.push(
				<div onClick={()=>setActiveTab(index)} className="account__tabs__item">
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
					valuesDOM.push( <div onClick={()=>filterHandler(filter, index)} className="account__data__filters__item__grid__item account__data__filters__item__grid__item--active" key={filter.name+index.toString()}>{value}</div> )
				else valuesDOM.push( <div onClick={()=>filterHandler(filter, index)} className="account__data__filters__item__grid__item" key={filter.name+index.toString()}>{value}</div> )
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
				<h3 className='typo__head typo__head--3'>{Wallet?Wallet:"John Doe"}</h3>
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
				<div className="account__data__books">
					<div className="account__data__books__wrapper">
						{renderNfts()}
					</div>
				</div>
			</div>
		</Page>
	)
}

export default AccountPage