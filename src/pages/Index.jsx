import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import Page from '../components/hoc/Page/Page'
import PrimaryButton from '../components/ui/Buttons/Primary'
import SecondaryButton from '../components/ui/Buttons/Secondary'

import Contracts from '../connections/contracts'

import { setSnackbar } from '../store/actions/snackbar'
import { isFilled, isUsable } from '../helpers/functions'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

import { BASE_URL } from '../config/env'

import HeroBackground from '../assets/images/background-hero.png'
import Wallet from '../connections/wallet'
import { SET_WALLET } from '../store/actions/wallet'

const IndexPage = props => {

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [IsLoading, setIsLoading] = useState(false)
	const [Highlights, setHighlights] = useState([])
	const [Collections, setCollections] = useState([])
	const [CollectionBooks, setCollectionBooks] = useState([])
	const WalletState = useSelector(state=>state.WalletState);

	useEffect(() => {
		if(IsLoading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [dispatch, IsLoading])

	useEffect(() => {
		setIsLoading(true)
		axios({
			url: BASE_URL+'/api/collections/highlights',
			method: 'GET'
		}).then(res => {
			setIsLoading(false)
			if(res.status === 200) setHighlights(res.data)
			else dispatch(setSnackbar('NOT200'))
		}).catch(err => {
			setIsLoading(false)
			dispatch(setSnackbar('ERROR'))
		})
	}, [dispatch])

	useEffect(() => {
		setIsLoading(true)
		axios({
			url: BASE_URL+'/api/collections',
			method: 'GET'
		}).then(res => {
			setIsLoading(false)
			if(res.status === 200) setCollections(res.data)
			else dispatch(setSnackbar('NOT200'))
		}).catch(err => {
			setIsLoading(false)
			dispatch(setSnackbar('ERROR'))
		})
	}, [dispatch])

	useEffect(() => {
		if(isFilled(Collections)){
			setIsLoading(true)
			Collections.forEach(collection => {
				setIsLoading(true)
				axios({
					url: BASE_URL+'/api/collections/books?cid='+collection.id,
					method: 'GET'
				}).then(res => {
					setIsLoading(false)
					if(res.status === 200) setCollectionBooks(old => [...old, {id: collection.id, order: collection.order, name: collection.name, books: res.data}])
					else dispatch(setSnackbar('NOT200'))
				}).catch(err => {
					setIsLoading(false)
					dispatch(setSnackbar('ERROR'))
				})
			})
		}
	}, [Collections, dispatch])

	const openHandler = nft => { navigate('/book', {state: nft}) }

	const renderCollections = () => {

		const renderNfts = (books,collection) => {
			let booksDOM = []
			if(isFilled(books)){
				books.forEach(book => {
					booksDOM.push(
						<div className="index__collection__books__item" key={book.id+'|'+collection.id} onClick={()=>openHandler(book)}>
							<img src={book.cover} alt={book.name} className="index__collection__books__item__cover" />
							<div className="index__collection__books__item__data">
								<p className='index__collection__books__item__data__author typo__body typo__body--2'>{book.author}</p>
								<p className='index__collection__books__item__data__name typo__body typo__body--2'>{book.title}</p>
							</div>
						</div>
					)
				})
			}
			return booksDOM
		}

		let collectionsDOM = []
		if(isFilled(CollectionBooks)){
			CollectionBooks.sort((a,b)=> a.order<b.order).forEach(collection => {
				collectionsDOM.push(
					<div className="index__collection" key={collection.id}>
						<h4 className="typo__head typo__head--4 index__collection__head typo__transform--capital">{collection.name}</h4>
						<div className="index__collection__books">
							<div className="index__collection__books__wrapper">
								{renderNfts(collection.books, collection)}
							</div>
						</div>
					</div>
				)
			})
		}
		return collectionsDOM
	}

	const renderHighlights = () => {
		let highlightsDOM = []
		Highlights.forEach(highlight => {
			highlightsDOM.push(
				<div key={highlight.id} className='index__book__container__item' onClick={()=>openHandler(highlight)}>
					<img className='index__book__container__item__cover' src={highlight.cover} alt={highlight.name} />
					<div className="index__book__container__item__data">
						<p className='index__book__container__item__data__author typo__body typo__body--2'>{highlight.author}</p>
						<p className='index__book__container__item__data__name typo__body typo__body--2'>{highlight.name}</p>
					</div>
				</div>
			)
		})
		return highlightsDOM
	}

	const handleCreate = async () => {
		if(isUsable(WalletState.wallet)){
			navigate('/create');
		} else {
			await Wallet.connectWallet();
			dispatch({data:Wallet.getSigner(),type:SET_WALLET});
			navigate('/create');
		}
	}
	
	return (
		<Page containerClass='index'>
			<div className="index__hero">
				<div className="index__bg">
					<img src={HeroBackground} alt="Background"/>
				</div>
				<div className="index__content">
					<div className="index__content__container">
						<h1 className="typo__display typo__transform--capital typo__color--white">experience books<br/>beyond reading</h1>
						<h3 className="typo__head typo__head--3 typo__transform--capital typo__color--white">decentralised marketplace for NFT based ebooks.</h3>
						<div className="index__content__container__row">
							<PrimaryButton theme={2} onClick={()=>navigate('/explore')} label="Explore"/>
							<SecondaryButton theme={2} onClick={()=>{handleCreate()}} label="Create"/>
						</div>
					</div>
				</div>
				<div className="index__book">
					<div className="index__book__container">
						{renderHighlights()}
					</div>
				</div>
			</div>
			<div className="index__section">
				{renderCollections()}
			</div>
		</Page>
	)
}

export default IndexPage
