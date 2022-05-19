import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from 'react-router'

import Page from '../components/hoc/Page/Page'
import PrimaryButton from '../components/ui/Buttons/Primary'
import InputField from '../components/ui/Input/Input'

import Contracts from '../connections/contracts'

import { IpfsClient } from '../connections/ipfs'
import { isFilled, isUsable } from '../helpers/functions'
import { hideSpinner, showSpinner } from '../store/actions/spinner'
import { BASE_URL } from '../config/env'
import { setSnackbar } from '../store/actions/snackbar'
import { MARKET_CONTRACT_ADDRESS } from '../config/contracts'

const CreateNftPage = props => {

	const GENRES = ['fantasy', 'science fiction', 'adventure', 'romance', 'mystery', 'horror', 'thriller', 'historical fiction', 'children\'s fiction', 'autobiography', 'biography', 'cooking', 'art', 'selfhelp', 'inspirational', 'health & fitness', 'history', 'humor', 'business', 'travel']
	const LANGUAGES = ['AF - Afrikaans', 'SQ - Albanian', 'AR - Arabic', 'HY - Armenian', 'AS - Assamese', 'AZ - Azerbaijani', 'BE - Belarusian', 'BN - Bengali']

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [Loading, setLoading] = useState(false)
	const [CoverUrl, setCoverUrl] = useState(null)
	const [WalletAddress, setWalletAddress] = useState(null)
	const [FormInput, setFormInput] = useState({ name: '', author: '', cover: null, book: null, genres: [], price: '', pages: '', publication: '', isbn: '', attributes: [], synopsis: '', language: '', published: '' })

	useEffect(() => { if(isUsable(FormInput.cover)) setCoverUrl(URL.createObjectURL(FormInput.cover)) }, [FormInput])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		setLoading(true)
		Contracts.Wallet.getWalletAddress().then(address => {
			if(isUsable(address)) setWalletAddress(address)
			else dispatch(setSnackbar({show: true, message: "Unable to connect to wallet.", type: 3}))
		}).catch(err => {
			console.error({err})
		}).finally(() => {
			setLoading(false)
		})
	}, [dispatch])

	async function listNFTForSale() {
		setLoading(true)
		IpfsClient.add(
			FormInput.book,
			{ progress: prog => console.log(`received: ${prog}`) }
		).then(res => {
			const bookUrl = `https://ipfs.infura.io/ipfs/${res.path}`
			IpfsClient.add(
				FormInput.cover,
				{ progress: (prog) => console.log(`received: ${prog}`) }
			).then(res1 => {
				const coverUrl = `https://ipfs.infura.io/ipfs/${res1.path}`
				const { name, author, cover, book, genres, price, pages, publication, isbn, attributes, synopsis, language, published } = FormInput
				if(isFilled(name) && isFilled(author) && isUsable(cover) && isUsable(book) && isFilled(pages) && isFilled(publication) && isFilled(isbn)){
					const data = JSON.stringify({ name, author, cover: coverUrl, book: bookUrl, price})
					IpfsClient.add(data).then(res2 => {
						const url = `https://ipfs.infura.io/ipfs/${res2.path}`
						Contracts.listNftForSales(WalletAddress, url, price).then(tx => {
							const bookAddress = tx.events[0].address
							const newOwner = tx.events[0].args.newOwner
							const previousOwner = tx.events[0].args.previousOwner
							const status = tx.status
							const txHash = tx.transactionHash
							if(isUsable(bookAddress) && isUsable(newOwner) && newOwner === MARKET_CONTRACT_ADDRESS && isUsable(status) && status === 1 && isUsable(txHash)){
								axios({
									url: BASE_URL+'/api/book/publish',
									method: 'POST',
									data: { ipfsPath: res2.path, name, author, cover: coverUrl, book: bookUrl, genres: JSON.stringify(genres.sort((a,b) => a>b)), price, pages, publication, isbn, attributes: JSON.stringify(attributes), synopsis, language, published, publisherAddress: WalletAddress, bookAddress, previousOwner, newOwner, status, txHash}
								}).then(res4 => {
									if(res4.status === 200){
										setLoading(false)
										navigate('/account')
									}
									else {
										dispatch(setSnackbar('ERROR'))
										console.log({err: res})
									}
								})
								.catch(err => {
									dispatch(setSnackbar('NOT200'))
									setLoading(false)
									console.log({err})
								})
							}
							else{
								setLoading(false)
								if(!isUsable(txHash)) dispatch(setSnackbar({show: true, message: "The transaction to mint eBook failed.", type: 3}))
								else dispatch(setSnackbar({show: true, message: `The transaction to mint eBook failed.\ntxhash: ${txHash}`, type: 3}))
							}
						}).catch((err => {
							dispatch(setSnackbar('NOT200'))
							console.log({err})
							setLoading(false)
						}))
					}).catch(err => {
						dispatch(setSnackbar('NOT200'))
						setLoading(false)
						console.log({err})
					})
				}
				else{
					dispatch(setSnackbar({show: true, message: "Incomplete details", type: 3}))
					setLoading(false)
				}
			}).catch(err => {
				dispatch(setSnackbar('NOT200'))
				setLoading(false)
				console.log({err})
			})
		}).catch(err => {
			dispatch(setSnackbar('NOT200'))
			setLoading(false)
			console.log({err})
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
					<InputField type="string" label="book author" onChange={e => setFormInput({ ...FormInput, author: e.target.value })} />
					<InputField type="file" label="cover" accept='image/*' onChange={e => setFormInput({ ...FormInput, cover: e.target.files[0] })} />
					<InputField type="file" label="book" accept='application/pdf' onChange={e => setFormInput({ ...FormInput, book: e.target.files[0] })} />
					<InputField type="string" label="price in NALNDA" onChange={e => setFormInput({ ...FormInput, price: e.target.value })} />
					<InputField type="list" label="genres" listType={'multiple'} minLimit={3} maxLimit={5} values={GENRES} value={FormInput.genres} onSave={values => setFormInput({ ...FormInput, genres: values })} />
					<InputField type="number" label="number of print pages" onChange={e => setFormInput({ ...FormInput, pages: e.target.value })} />
					<InputField type="string" label="publication" onChange={e => setFormInput({ ...FormInput, publication: e.target.value })} />
					<InputField type="string" label="isbn" onChange={e => setFormInput({ ...FormInput, isbn: e.target.value })} />
					<InputField type="text" label="synopsis" lines={8} onChange={e => setFormInput({ ...FormInput, synopsis: e.target.value })} />
					<InputField type="list" label="language" listType={'single'} values={LANGUAGES} value={FormInput.language} onSave={value => setFormInput({ ...FormInput, language: value })} />
					<InputField type="date" label="published" onChange={e => setFormInput({ ...FormInput, published: e.target.value })} />
					<PrimaryButton label={"Create EBook"} onClick={()=>listNFTForSale()} />
				</div>
				<div className="create__data__preview">
					<div className='create__data__preview__item'onClick={()=>{}}>
						{isUsable(CoverUrl)?<img className='create__data__preview__item__cover' src={CoverUrl} alt={FormInput.name+" cover"} />:<div className="create__data__preview__item__cover"/>}
						<div className="create__data__preview__item__data">
							<p className='create__data__preview__item__data__author typo__body typo__body--2'>{FormInput.author}</p>
							<p className='create__data__preview__item__data__name typo__body typo__body--2'>{FormInput.name}</p>
						</div>
						<div className="create__data__preview__item__action">
							<div onClick={()=>{}}>{isFilled(FormInput.price)?"Buy":null}</div>
							<p className='create__data__preview__item__action__price typo__body typo__body--2'>{isFilled(FormInput.price)?FormInput.price+" NALNDA":null}</p>
						</div>
					</div>
				</div>
			</div>
		</Page>
	)
}

export default CreateNftPage