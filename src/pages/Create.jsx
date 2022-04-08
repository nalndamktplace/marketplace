import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Contracts from '../connections/contracts'
import { IpfsClient } from '../connections/ipfs'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

const CreateNftPage = props => {

	const dispatch = useDispatch()

	const [Loading, setLoading] = useState(false)
	const [FileUrl, setFileUrl] = useState(null)
	const [FormInput, setFormInput] = useState({price: '', name: '', description: '', file: null})

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
			const { name, description, price } = FormInput
			if (!name || !description || !price || !fileUrl) return
			const data = JSON.stringify({ name, description, image: fileUrl })
			IpfsClient.add(data).then(res => {
				const url = `https://ipfs.infura.io/ipfs/${res.path}`
				Contracts.listNftForSales(url, FormInput).then(res => {
					console.log({res})
					setLoading(false)
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
		<div className="flex justify-center">
			<div className="w-1/2 flex flex-col pb-12">
				<input placeholder="Asset Name" className="mt-8 border rounded p-4" onChange={e => setFormInput({ ...FormInput, name: e.target.value })} />
				<textarea placeholder="Asset Description" className="mt-2 border rounded p-4" onChange={e => setFormInput({ ...FormInput, description: e.target.value })} />
				<input placeholder="Asset Price in Eth" className="mt-2 border rounded p-4" onChange={e => setFormInput({ ...FormInput, price: e.target.value })} />
				<input type="file" name="Asset" className="my-4" onChange={e => setFormInput({...FormInput, file: e.target.files[0] })} />
				{ FileUrl && (
					<img className="rounded mt-4" width="350" src={FileUrl} alt="nft" />
				) }
				<button onClick={listNFTForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">Create NFT</button>
			</div>
		</div>
	)
}

export default CreateNftPage