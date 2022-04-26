import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import axios from 'axios'

import Page from '../components/hoc/Page/Page'
import PrimaryButton from '../components/ui/Buttons/Primary'
import SecondaryButton from '../components/ui/Buttons/Secondary'

import Contracts from '../connections/contracts'

import { setSnackbar } from '../store/actions/snackbar'
import { isFilled } from '../helpers/functions'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

import { BASE_URL } from '../config/env'

import HeroBackground from '../assets/images/background-hero.png'

const IndexPage = props => {

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [Nft, setNft] = useState(null)
	const [IsLoading, setIsLoading] = useState(false)
	const [Collections, setCollections] = useState([])
	const [CollectionBooks, setCollectionBooks] = useState([])

	useEffect(() => {
		if(IsLoading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [dispatch, IsLoading])

	useEffect(() => {
		setIsLoading(true)
		Contracts.loadNfts().then(res => {
			setIsLoading(false)
			setNft(res[res.length-1])
		}).catch(err => {
			setIsLoading(false)
			console.log({err})
		})
	}, [])

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
			console.log({err})
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
					console.log({err})
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

	return (
		<Page containerClass='index'>
			<div className="index__hero">
				<div className="index__bg">
					<img src={HeroBackground} alt="Background"/>
				</div>
				<div className="index__content">
					<div className="index__content__container">
						<h2 className="typo__display typo__transform--capital typo__color--white">experience books<br/>beyond reading</h2>
						<h4 className="typo__head typo__head--4 typo__transform--capital typo__color--white">decentralised marketplace for NFT based ebooks.</h4>
						<div className="index__content__container__row">
							<PrimaryButton theme={2} onClick={()=>navigate('/explore')} label="Explore"/>
							<SecondaryButton theme={2} onClick={()=>navigate('/create')} label="Create"/>
						</div>
					</div>
				</div>
				<div className="index__book">
					{Nft?<div className="index__book__container">
						<div className='index__book__container__item' onClick={()=>openHandler(Nft)}>
							<img className='index__book__container__item__cover' src={Nft.cover} alt={Nft.name} />
							<div className="index__book__container__item__data">
								<p className='index__book__container__item__data__author typo__body typo__body--2'>{Nft.author}</p>
								<p className='index__book__container__item__data__name typo__body typo__body--2'>{Nft.name}</p>
							</div>
						</div>
					</div>:null}
				</div>
			</div>
			<div className="index__section">
				{renderCollections()}
			</div>
		</Page>
	)
}

export default IndexPage