import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'

import Page from '../components/hoc/Page/Page'
import PrimaryButton from '../components/ui/Buttons/Primary'
import SecondaryButton from '../components/ui/Buttons/Secondary'

import Contracts from '../connections/contracts'

import { useDispatch } from 'react-redux'
import { setSnackbar } from '../store/actions/snackbar'
import { isFilled } from '../helpers/functions'

import { BASE_URL } from '../config/env'

import HeroBackground from '../assets/images/background-hero.png'

const IndexPage = props => {

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [Nft, setNft] = useState(null)
	const [Collections, setCollections] = useState([])
	const [CollectionBooks, setCollectionBooks] = useState([])

	useEffect(() => {
		console.log({CollectionBooks})
	}, [CollectionBooks])

	useEffect(() => {
		Contracts.loadNfts().then(res => {
			setNft(res[res.length-1])
		}).catch(err => {
			console.log({err})
		})
	}, [])

	useEffect(() => {
		axios({
			url: BASE_URL+'/api/collections',
			method: 'GET'
		}).then(res => {
			if(res.status === 200) setCollections(res.data)
			else dispatch(setSnackbar('NOT200'))
		}).catch(err => {
			console.log({err})
			dispatch(setSnackbar('ERROR'))
		})
	}, [dispatch])

	useEffect(() => {
		if(isFilled(Collections)){
			Collections.forEach(collection => {
				axios({
					url: BASE_URL+'/api/collections/books?cid='+collection.id,
					method: 'GET'
				}).then(res => {
					if(res.status === 200) setCollectionBooks(old => [...old, {id: collection.id, order: collection.order, name: collection.name, books: res.data}])
					else dispatch(setSnackbar('NOT200'))
				}).catch(err => {
					console.log({err})
					dispatch(setSnackbar('ERROR'))
				})
			})
		}
	}, [Collections, dispatch])

	return (
		<Page containerClass='index'>
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
					<div className='index__book__container__item'>
						<img className='index__book__container__item__cover' src={Nft.cover} alt={Nft.name} />
						<div className="index__book__container__item__data">
							<p className='index__book__container__item__data__author typo__body typo__body--2'>{Nft.author}</p>
							<p className='index__book__container__item__data__name typo__body typo__body--2'>{Nft.name}</p>
						</div>
					</div>
				</div>:null}
			</div>
		</Page>
	)
}

export default IndexPage