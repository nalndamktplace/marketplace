import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import React, { useEffect, useState } from 'react'

import Page from '../components/hoc/Page/Page'
import Button from '../components/ui/Buttons/Button'

import { isFilled, isUsable } from '../helpers/functions'
import { setSnackbar } from '../store/actions/snackbar'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

import {ReactComponent as USDCIcon} from "../assets/icons/usdc-icon.svg"

import { BASE_URL } from '../config/env'
import GaTracker from '../trackers/ga-tracker'

const IndexPage = props => {

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [IsLoading, setIsLoading] = useState(false)
	const [Highlights, setHighlights] = useState([])
	const [Collections, setCollections] = useState([])
	const [CollectionBooks, setCollectionBooks] = useState([])
	const [Genres, setGenres] = useState([])

	useEffect(() => { GaTracker('page_view_index') }, [])

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
			if(res.status === 200) setHighlights(res.data)
		}).catch(err => {
		}).finally(() => setIsLoading(false))
	}, [dispatch])

	useEffect(() => {
		setIsLoading(true)
		axios({
			url: BASE_URL+'/api/collections/genres',
			method: 'GET'
		}).then(res => {
			if(res.status === 200) setGenres(res.data)
		}).catch(err => {
		}).finally(() => setIsLoading(false))
	}, [])

	useEffect(() => {
		setCollections([])
		setIsLoading(true)
		axios({
			url: BASE_URL+'/api/collections',
			method: 'GET'
		}).then(res => {
			if(res.status === 200) setCollections(res.data)
		}).catch(err => {
		}).finally(() => setIsLoading(false))
	}, [dispatch])

	useEffect(() => {
		if(isFilled(Collections)){
			setCollectionBooks([])
			Collections.forEach(collection => {
				setIsLoading(true)
				axios({
					url: BASE_URL+'/api/collections/books?cid='+collection.id,
					method: 'GET'
				}).then(res => {
					if(res.status === 200) setCollectionBooks(old => [...old, {id: collection.id, order: collection.order, name: collection.name, books: res.data}])
					else dispatch(setSnackbar('NOT200'))
				}).catch(err => {
					// Do Nothing
				}).finally(() => setIsLoading(false))
			})
		}
	}, [Collections, dispatch])

	const openHandler = nft => {
		GaTracker('navigate_index_book')
		navigate('/book', {state: nft})
	}

	const renderGenres = () => {

		const renderNfts = (books,collection) => {
			let booksDOM = []

			const getPriceTagClass = (book) => {
				let classes = ["index__collection__books__item__data__price typo-head--6"]
				if(book.price === 0) classes.push("index__collection__books__item__data__price--free")
				return classes.join(" ")
			}

			if(isFilled(books)){
				books.forEach(book => {
					booksDOM.push(
						<div className="index__collection__books__item" key={book.id+'|'+collection.id} onClick={()=>openHandler(book)}>
							<img src={book.cover} alt={book.name} className="index__collection__books__item__cover" />
							<div className="index__collection__books__item__data">
								<div className={getPriceTagClass(book)}>{book.price===0?"FREE":<><USDCIcon stroke='currentColor' width={24} height={24}/>{book.price}</>}</div>
								<p className='index__collection__books__item__data__name typo__head typo__head--6'>
									{(book?.title||"").slice(0,40)}
									{book?.title?.length > 40 && "..."}
								</p>
								<p className='index__collection__books__item__data__author typo__subtitle'>{book.author}</p>
							</div>
						</div>
					)
				})
			}
			return booksDOM
		}

		let collectionsDOM = []
		if(isFilled(Genres)){
			Genres.forEach(collection => {
				collectionsDOM.push(
					<div className="index__collection" key={collection.id}>
						<div className="index__collection__header">
							<h4 className="typo__head typo__head--4 index__collection__header__title typo__transform--capital">
								{collection.name}
							</h4>
							{/* <Button>
								<span>View more</span> <ArrowRight width={24} height={24} />
							</Button> */}
						</div>
						
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
					<img className='index__book__container__item__cover' src={highlight.cover} alt={highlight.title} />
				</div>
			)
		})
		return highlightsDOM
	}

	const renderCollections2 = () => {

		const renderCollection = collection => {
			let collectionDOM = []
			if(isUsable(collection) && isFilled(collection.books)){
				collection.books.forEach(book => {
					if(collectionDOM.length<3)
						collectionDOM.push(<img src={book.cover} alt={book.title} className="index__featured__container__row__item__container__image"/>)
				})
			}
			return collectionDOM
		}

		let collectionsDOM = []
		if(isFilled(CollectionBooks)){
			CollectionBooks.sort((a,b) => a.order > b.order).forEach(collection => {
				collectionsDOM.push(
					<div onClick={()=>navigate('/collection', {state: {id: collection.id, name: collection.name}})} className="index__featured__container__row__item" key={collection.id}>
						<div className="index__featured__container__row__item__container">
							{renderCollection(collection)}
						</div>
						<div className="index__featured__container__row__item__title typo__head--5 typo__transform--capital">{collection.name}</div>
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
				</div>
				<div className="index__content">
					<div className="index__content__container">
						<h1 className="typo__head typo__head--2 typo__weight--heavy typo__color--white typo__transform--capital">experience<br/> books beyond<br/> reading</h1>
						<h3 className="typo__head typo__head--4 typo__transform--capital typo__color--white">decentralised marketplace for NFT based <span style={{textTransform: 'none'}}>eBooks</span>.</h3>
						<div className="index__content__container__row">
							<Button size="xl" type="white" onClick={() => navigate('/explore')}>Explore</Button>
							<Button size="xl" type="outline-white" onClick={() => navigate('/publish')}>Publish</Button>
						</div>
					</div>
				</div>
				<div className="index__book">
					<div className="index__book__container">
						{renderHighlights()}
					</div>
				</div>
			</div>
			<div className="index__featured">
				<div className="index__featured__container">
					<div className="index__featured__container__row">
						{renderCollections2()}
					</div>
				</div>
			</div>
			<div className="index__section">
				{renderGenres()}
			</div>
		</Page>
	)
}

export default IndexPage
