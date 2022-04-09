import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Page from '../../components/hoc/Page/Page'
import Contracts from '../../connections/contracts'
import { isUsable } from '../../helpers/functions'
import { hideSpinner, showSpinner } from '../../store/actions/spinner'

const CreatorsDashboardPage = props => {

	const dispatch = useDispatch()

	const [Loading, setLoading] = useState(false)
	const [Nfts, setNfts] = useState([])
	const [NftsSold, setNftsSold] = useState([])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		setLoading(true)
		Contracts.loadNftsCreated().then(res => {
			setLoading(false)
			setNftsSold(res.filter(i => i.sold))
			setNfts(res)
		}).catch(err => {
			setLoading(false)
			console.log({err})
		})
	}, [])

	const renderNfts = nfts => {
		if(isUsable(nfts) && nfts.length>0){
			let nftDOM = []
			nfts.forEach(nft => {
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
		return <p>No NFTs</p>
	}

	return (
		<Page>
			<h3 className='typo__head typo__head--3'>NFTs Created</h3>
			{renderNfts(Nfts)}
			<h5 className="typo__head typo__head--5">NFTs Sold</h5>
			{renderNfts(NftsSold)}
		</Page>
	)
}

export default CreatorsDashboardPage