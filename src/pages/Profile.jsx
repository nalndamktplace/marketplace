import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import Page from '../components/hoc/Page/Page'
import Contracts from '../connections/contracts'
import { isUsable } from '../helpers/functions'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

const ProfilePage = props => {

	const dispatch = useDispatch()

	const [Nfts, setNfts] = useState([])
	const [Loading, setLoading] = useState(false)

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		setLoading(true)
		Contracts.loadMyNfts().then(res => {
			setLoading(false)
			setNfts(res)
		}).catch(err => {
			setLoading(false)
			console.log({err})
		})
	}, [])

	const renderNfts = () => {
		if(isUsable(Nfts) && Nfts.length>0){
			let nftDOM = []
			Nfts.forEach(nft => {
				nftDOM.push(
					<div>
						<img src={nft.image} alt={nft.name} />
						<p>{nft.name}</p>
						<p>{nft.description}</p>
						<p>{nft.price}&nbsp;ETH</p>
					</div>
				)
			})
			return nftDOM
		}
		return <p>No NFTs Yet</p>
	}

	return (
		<Page>
			<h3 className='typo__head typo__head--3'>Explore Collections</h3>
			{renderNfts()}
		</Page>
	)
}

export default ProfilePage