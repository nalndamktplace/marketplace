import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import Page from '../components/hoc/Page/Page'
import PrimaryButton from '../components/ui/Buttons/Primary'
import SecondaryButton from '../components/ui/Buttons/Secondary'

import Contracts from '../connections/contracts'

const IndexPage = props => {

	const navigate = useNavigate()

	const [Nft, setNft] = useState(null)

	useEffect(() => {
		Contracts.loadNfts().then(res => {
			setNft(res[res.length-1])
		}).catch(err => {
			console.log({err})
		})
	}, [])
	

	return (
		<Page containerClass='index'>
			<div className="index__content">
				<div className="index__content__container">
					<h2 className="typo__head typo__head--1 typo__transform--capital">experience books<br/>beyond reading</h2>
					<h4 className="typo__head typo__head--4 typo__transform--capital">decentralised marketplace for NFT based ebooks.</h4>
					<div className="index__content__container__row">
						<PrimaryButton onClick={()=>navigate('/explore')} label="Explore"/>
						<SecondaryButton onClick={()=>navigate('/create')} label="Create"/>
					</div>
				</div>
			</div>
			<div className="index__book">
				{Nft?<div className="index__book__container">
					<div className='index__book__container__item'>
						<img className='index__book__container__item__cover' src={Nft.image} alt={Nft.name} />
						<div className="index__book__container__item__data">
							<p className='index__book__container__item__data__author typo__body typo__body--2'>{Nft.description}</p>
							<p className='index__book__container__item__data__name typo__body typo__body--2'>{Nft.name}</p>
						</div>
					</div>
				</div>:null}
			</div>
		</Page>
	)
}

export default IndexPage