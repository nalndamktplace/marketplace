import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router'

import Page from '../components/hoc/Page/Page'
import PrimaryButton from '../components/ui/Buttons/Primary'

import { hideSpinner, showSpinner } from '../store/actions/spinner'
import { isUsable } from '../helpers/functions'

import TargetIcon from '../assets/icons/target.svg'
import PrintIcon from '../assets/icons/print.svg'
import BarcodeIcon from '../assets/icons/barcode.svg'

const BookPage = props => {

	const params = useLocation()
	const dispatch = useDispatch()

	const [NFT, setNFT] = useState(null)
	const [Loading, setLoading] = useState(false)

	useEffect(() => {
		console.log({params})
		setLoading(true)
		setNFT(params.state)
	}, [params])

	useEffect(() => {
		if(isUsable(NFT)) setLoading(false)
	}, [NFT])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

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
									<PrimaryButton label={'Buy Now'}/>
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
									<p className='book__data__container__desc__summary__head typo__body--3'>ISBN code</p>
									<p className='book__data__container__desc__summary__data'>{NFT.isbn}</p>
									<p className='book__data__container__desc__summary__head typo__body--3'>language</p>
									<p className='book__data__container__desc__summary__data'>{NFT.language}</p>
									<p className='book__data__container__desc__summary__head typo__body--3'>price</p>
									<p className='book__data__container__desc__summary__data'>{NFT.price}</p>
									<p className='book__data__container__desc__summary__head typo__body--3'>print pages</p>
									<p className='book__data__container__desc__summary__data'>{NFT.print}</p>
									<p className='book__data__container__desc__summary__head typo__body--3'>publication</p>
									<p className='book__data__container__desc__summary__data'>{NFT.publication}</p>
									<p className='book__data__container__desc__summary__head typo__body--3'>publication date</p>
									<p className='book__data__container__desc__summary__data'>{NFT.publication_date}</p>
									<p className='book__data__container__desc__summary__head typo__body--3'>rating</p>
									<p className='book__data__container__desc__summary__data'>{NFT.rating}</p>
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

// Contract Address like Open Sea
// Create Add Cover on right
// No NFT graphic GIF
