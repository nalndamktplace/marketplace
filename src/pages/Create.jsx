import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'

import Page from '../components/hoc/Page/Page'
import PrimaryButton from '../components/ui/Buttons/Primary'
import InputField from '../components/ui/Input/Input'

import Contracts from '../connections/contracts'

import { IpfsClient } from '../connections/ipfs'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

const CreateNftPage = props => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [Loading, setLoading] = useState(false)
	const [FileUrl, setFileUrl] = useState(null)
	const [FormInput, setFormInput] = useState({price: '', name: '', description: '', file: null, attributes: [], genres: ''})

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	async function listNFTForSale() {
		setLoading(true)
		IpfsClient.add(
			FormInput.file,
			{ progress: (prog) => console.log(`received: ${prog}`) }
		).then(res => {
			const fileUrl = `https://ipfs.infura.io/ipfs/${res.path}`
			setFileUrl(fileUrl)
			const { name, description, price, attributes, genres } = FormInput
			if (!name || !description || !price || !fileUrl) return
			const data = JSON.stringify({
				name: name,
				description: description,
				genres: genres.toLowerCase(),
				attributes: attributes,
				image: fileUrl
			})
			IpfsClient.add(data).then(res => {
				const url = `https://ipfs.infura.io/ipfs/${res.path}`
				Contracts.listNftForSales(url, FormInput).then(res => {
					setLoading(false)
					navigate('/account')
				}).catch((err => {
					console.log({err})
					setLoading(false)
				}))
			}).catch(err => {
				setLoading(false)
				console.log('Error uploading file: ', err)
			})
		}).catch(err => {
			setLoading(false)
			console.log('Error uploading file: ', err)
		})
	}

	return (
		<Page noFooter={true}>
			<div className="create__head">
				<h3 className='typo__head typo__head--3'>Create EBook</h3>
			</div>
			<div className="create__data">
				<div className="create__data__form">
					<InputField type="string" label="book name" onChange={e => setFormInput({ ...FormInput, name: e.target.value })} />
					<InputField type="string" label="book author" onChange={e => setFormInput({ ...FormInput, description: e.target.value })} />
					<InputField type="string" label="genres" onChange={e => setFormInput({ ...FormInput, genres: e.target.value })} />
					<InputField type="number" label="price in ETH" onChange={e => setFormInput({ ...FormInput, price: e.target.value })} />
					<InputField type="file" label="cover" accept='image/*' onChange={e => setFormInput({ ...FormInput, file: e.target.files[0] })} />
					<InputField type="file" label="book" accept='application/pdf' />
					<PrimaryButton label={"Create EBook"} onClick={()=>listNFTForSale()} />
				</div>
				<div className="create__data__preview">
					{FileUrl?<img src={FileUrl} alt="nft" />:null}
				</div>
			</div>
		</Page>
	)
}

export default CreateNftPage