import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import Page from '../components/hoc/Page/Page'
import Contracts from '../connections/contracts'
import { isUsable } from '../helpers/functions'
import { setSnackbar } from '../store/actions/snackbar'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

const ExplorePage = props => {

	const dispatch = useDispatch()

	const [Nfts, setNfts] = useState([])
	const [Loading, setLoading] = useState(false)

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => { loadNftHandler() }, [])

	const loadNftHandler = () => {
		setLoading(true)
		Contracts.loadNfts().then(res => {
			setLoading(false)
			setNfts(res)
		}).catch(err => {
			setLoading(false)
			console.log({err})
		})
	}

	const buyHandler = nft => {
		setLoading(true)
		Contracts.buyNft(nft).then(res => {
			setLoading(false)
			dispatch(setSnackbar({show: true, message: "Book purchased.", type: 1}))
			loadNftHandler()
		}).catch(err => {
			setLoading(false)
			if(err.code === 4001)
				dispatch(setSnackbar({show: true, message: "Transaction denied by user.", type: 3}))
			console.log({err})
		})
	}

	const renderNfts = () => {
		if(isUsable(Nfts) && Nfts.length>0){
			let nftDOM = []
			Nfts.forEach(nft => {
				nftDOM.push(
					<div className='explore__data__books__item'>
						<img className='explore__data__books__item__cover' src={nft.image} alt={nft.name} />
						<div className="explore__data__books__item__data">
							<p className='explore__data__books__item__data__author typo__body typo__body--2'>{nft.description}</p>
							<p className='explore__data__books__item__data__name typo__body typo__body--2'>{nft.name}</p>
						</div>
						<div className="explore__data__books__item__action">
							<div onClick={()=>buyHandler(nft)}>Buy</div>
							<p className='explore__data__books__item__action__price typo__body typo__body--2'>{nft.price}&nbsp;ETH</p>
						</div>
					</div>
				)
			})
			return nftDOM
		}
		return <p>No NFTs Yet</p>
	}

	return (
		<Page noFooter={true} fluid={true} containerClass={'explore'}>
			<div className="explore__head">
				<h3 className='typo__head typo__head--3'>Explore Collection</h3>
			</div>
			<div className="explore__data">
				<div className="explore__data__books">
					<div className="explore__data__books__wrapper">
						{renderNfts()}
					</div>
				</div>
			</div>
		</Page>
	)
}

export default ExplorePage