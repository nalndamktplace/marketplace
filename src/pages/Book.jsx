import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'

import Page from '../components/hoc/Page/Page'
import PrimaryButton from '../components/ui/Buttons/Primary'

import Contracts from '../connections/contracts'

import { isUsable } from '../helpers/functions'
import { setSnackbar } from '../store/actions/snackbar'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

import PrintIcon from '../assets/icons/print.svg'
import TargetIcon from '../assets/icons/target.svg'
import BarcodeIcon from '../assets/icons/barcode.svg'

const BookPage = props => {

	const params = useLocation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [NFT, setNFT] = useState(null)
	const [Created, setCreated] = useState(null)
	const [Owner, setOwner] = useState(null)
	const [Loading, setLoading] = useState(false)

	useEffect(() => {
		setLoading(true)
		Contracts.loadMyNfts().then(res => {
			if(isUsable(res)){
				if(res.length>0) res.forEach(book => {
					if(params.state.tokenId === book.tokenId) setOwner(true)
					else setOwner(false)
				})
				else setOwner(false)
			}
		}).catch(err => {
			console.log({err})
			dispatch(setSnackbar('ERROR'))
		})
		Contracts.loadNftsCreated().then(res => {
			if(isUsable(res)){
				if(res.length>0) res.forEach(book => {
					if(params.state.tokenId === book.tokenId) setCreated(true)
					else setCreated(false)
				})
				else setCreated(false)
			}
		}).catch(err => {
			console.log({err})
			dispatch(setSnackbar('ERROR'))
		})
		setNFT(params.state)
	}, [params, dispatch])

	useEffect(() => { if(isUsable(NFT) && isUsable(Created) && isUsable(Owner)) setLoading(false) }, [NFT, Created, Owner])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	const readHandler = () => { navigate('/account/reader', {state: NFT}) }

	const purchaseHandler = () => {
		setLoading(true)
		Contracts.buyNft(NFT).then(res => {
			setLoading(false)
			dispatch(setSnackbar({show: true, message: "Book purchased.", type: 1}))
			Contracts.loadMyNfts().then(res => { if(isUsable(res) && res.length>0) res.forEach(book => { if(params.state.contract === book.contract) setOwner(true) }) }).catch(err => console.log({err}))
		}).catch(err => {
			setLoading(false)
			if(err.code === 4001)
				dispatch(setSnackbar({show: true, message: "Transaction denied by user.", type: 3}))
			else dispatch(setSnackbar('ERROR'))
			console.log({err})
		})
	}

	return (
		<Page>
			{
				isUsable(NFT)?
				<React.Fragment>
					<div className="book__data">
						<div className="book__data__background">
						</div>
						<div className="book__data__container">
							<div>
								<div className='book__data__container__cover'>
									<img className='book__data__container__cover__container' src={NFT.cover} alt={NFT.name} />
								</div>
								<div className='book__data__container__meta'>
									<h3 className="typo__head typo__head--3 typo__transform--capital">{NFT.name}</h3>
									<h5 className="typo__head typo__head--5">{NFT.author}</h5>
									<div className="book__data__container__meta__row">
										<div className="book__data__container__meta__row__item">
											<p className="book__data__container__meta__row__item__head typo__body typo__body--2">publication</p>
											<img src={TargetIcon} alt="publisher icon" className="book__data__container__meta__row__item__icon" />
											<p className="book__data__container__meta__row__item__value typo__body">{NFT.publication}</p>
										</div>
										<div className="book__data__container__meta__row__item">
											<p className="book__data__container__meta__row__item__head typo__body typo__body--2">print pages</p>
											<img src={PrintIcon} alt="pages icon" className="book__data__container__meta__row__item__icon" />
											<p className="book__data__container__meta__row__item__value typo__body">{NFT.print}</p>
										</div>
										<div className="book__data__container__meta__row__item">
											<p className="book__data__container__meta__row__item__head typo__body typo__body--2">ISBN code</p>
											<img src={BarcodeIcon} alt="ISBN icon" className="book__data__container__meta__row__item__icon" />
											<p className="book__data__container__meta__row__item__value typo__body">{NFT.isbn}</p>
										</div>
									</div>
								</div>
							</div>
							<div className='book__data__container__desc'>
								<div className="book__data__container__desc__cta">
									{Created||Owner
										?<PrimaryButton label={'Read'} onClick={()=>readHandler()}/>
										:<PrimaryButton label={'Buy Now'} onClick={()=>purchaseHandler()}/>
									}
								</div>
								<div className="book__data__container__desc__summary">
									<p className='book__data__container__desc__summary__head typo__body--3'>category</p>
									<p className='book__data__container__desc__summary__data'>{NFT.category}</p>
									<p className='book__data__container__desc__summary__head typo__body--3'>contract address</p>
									<p className='book__data__container__desc__summary__data'>{NFT.contract}</p>
									<p className='book__data__container__desc__summary__head typo__body--3'>DA score</p>
									<p className='book__data__container__desc__summary__data'>{NFT.da_score}</p>
									<p className='book__data__container__desc__summary__head typo__body--3'>genres</p>
									<p className='book__data__container__desc__summary__data'>{NFT.genres}</p>
									<p className='book__data__container__desc__summary__head typo__body--3'>language</p>
									<p className='book__data__container__desc__summary__data'>{NFT.language}</p>
									<p className='book__data__container__desc__summary__head typo__body--3'>price</p>
									<p className='book__data__container__desc__summary__data'>{NFT.price}</p>
									<p className='book__data__container__desc__summary__head typo__body--3'>publication date</p>
									<p className='book__data__container__desc__summary__data'>{NFT.publication_date.substring(0, NFT.publication_date.indexOf('T'))}</p>
									{/* <p className='book__data__container__desc__summary__head typo__body--3'>rating</p>
									<p className='book__data__container__desc__summary__data'>{NFT.rating}</p> */}
								</div>
								<div className="book__data__container__desc__tabs">
									<div className="book__data__container__desc__tabs__container">
										<div className="book__data__container__desc__tabs__container__item">
											<h5 className="typo__head typo__head--5">synopsis</h5>
										</div>
									</div>
									<div className="book__data__container__desc__tabs__data">
										<p className="typo__body">{NFT.synopsis}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="book__data__container__space">&nbsp;</div>
				</React.Fragment>
				:null
			}
		</Page>
	)
}

export default BookPage
