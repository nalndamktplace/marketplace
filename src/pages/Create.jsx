import axios from 'axios'
import moment from 'moment'
import { useDispatch } from "react-redux"
import { useNavigate } from 'react-router'
import React, { useEffect, useState } from 'react'

import Page from '../components/hoc/Page/Page'
import InputField from '../components/ui/Input/Input'
import PrimaryButton from '../components/ui/Buttons/Primary'

import Contracts from '../connections/contracts'
import { IpfsClient } from '../connections/ipfs'

import { setSnackbar } from '../store/actions/snackbar'
import { isFilled, isUsable } from '../helpers/functions'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

import { BASE_URL } from '../config/env'
import { PRIMARY_MARKET_CONTRACT_ADDRESS } from '../config/contracts'
import {ReactComponent as USDCIcon} from "../assets/icons/usdc-icon.svg"

const CreateNftPage = props => {

	const GENRES = ['fantasy', 'science fiction', 'adventure', 'romance', 'mystery', 'horror', 'thriller', 'historical fiction', 'children\'s fiction', 'autobiography', 'biography', 'cooking', 'art', 'selfhelp', 'inspirational', 'health & fitness', 'history', 'humor', 'business', 'travel']
	const LANGUAGES = ['ES - Espanol', 'EN - English', 'HN - Hindi']

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [Loading, setLoading] = useState(false)
	const [CoverUrl, setCoverUrl] = useState(null)
	const [WalletAddress, setWalletAddress] = useState(null)
	const [FormInput, setFormInput] = useState({ name: '', author: '', cover: null, preview: null, book: null, genres: [], price: '', pages: '', publication: '', isbn: '', attributes: [], synopsis: '', language: '', published: '', secondarySalesCopies: '', secondarySalesDate: '', primarySales: '', secondaryFrom: moment().add(90, 'days')})

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

	useEffect(()=>{
		console.log(FormInput);
	},[FormInput])

	async function listNFTForSale() {
		setLoading(true)

		let formData = new FormData();
		formData.append("book",FormInput.book)
		formData.append("cover",FormInput.cover)
		formData.append("bookTitle",FormInput.title)

		axios({
			url : BASE_URL + "/api/book/submarine",
			method : "POST",
			data : formData
		}).then(res => {
			const bookUrl = res.data.book.url ;
			const coverUrl = res.data.cover.url
			console.log(res.data);
			const { name, author, cover, book, genres, price, pages, publication, attributes, synopsis, language, published, primarySales, secondaryFrom } = FormInput
			if(isFilled(name) && isFilled(author) && isUsable(cover) && isUsable(book) && isFilled(pages) && isFilled(publication)){				
				Contracts.listNftForSales(WalletAddress, coverUrl, price).then(tx => {
					const bookAddress = tx.events[0].address
					const newOwner = tx.events[0].args.newOwner
					const previousOwner = tx.events[0].args.previousOwner
					const status = tx.status
					const txHash = tx.transactionHash
					if(isUsable(bookAddress) && isUsable(newOwner) && newOwner === PRIMARY_MARKET_CONTRACT_ADDRESS && isUsable(status) && status === 1 && isUsable(txHash)){
						let formData = new FormData()
						formData.append("epub", FormInput.preview)
						formData.append("ipfsPath", name)
						formData.append("name", name)
						formData.append("author", author)
						formData.append("cover", coverUrl)
						formData.append("book", bookUrl)
						formData.append("genres", JSON.stringify(genres.sort((a,b) => a>b)))
						formData.append("price", price)
						formData.append("pages", pages)
						formData.append("publication", publication)
						formData.append("attributes", JSON.stringify(attributes))
						formData.append("synopsis", synopsis)
						formData.append("language", language)
						formData.append("published", published)
						formData.append("minPrimarySales", primarySales)
						formData.append("secondarySalesFrom", secondaryFrom)
						formData.append("publisherAddress", WalletAddress)
						formData.append("bookAddress", bookAddress)
						formData.append("previousOwner", previousOwner)
						formData.append("newOwner", newOwner)
						formData.append("status", status)
						formData.append("txHash", txHash)
						axios({
							url: BASE_URL+'/api/book/publish',
							method: 'POST',
							data: formData
						}).then(res4 => {
							if(res4.status === 200){
								setLoading(false)
								navigate('/account', {state: {tab: 'created'}})
							}
							else {
								dispatch(setSnackbar('ERROR'))
							}
						})
						.catch(err => {
							dispatch(setSnackbar('NOT200'))
							setLoading(false)
						})
					}
					else{
						setLoading(false)
						if(!isUsable(txHash)) dispatch(setSnackbar({show: true, message: "The transaction to mint eBook failed.", type: 3}))
						else dispatch(setSnackbar({show: true, message: `The transaction to mint eBook failed.\ntxhash: ${txHash}`, type: 3}))
					}
				}).catch((err => {
					dispatch(setSnackbar('NOT200'))
					setLoading(false)
				}))
			}
			else{
				dispatch(setSnackbar({show: true, message: "Incomplete details", type: 3}))
				setLoading(false)
			}
		}).catch(err => {
			dispatch(setSnackbar('NOT200'))
			setLoading(false)
		})
	}

	return (
		<Page noFooter={true} containerClass={'create create__bg'}>
			<div className="create__head">
				<h3 className='typo__head typo__head--2'>Publish eBook</h3>
			</div>
			<div className="create__data">
				<div className="create__data__form utils__padding__bottom--s">
					<InputField type="string" label="book name" onChange={e => setFormInput({ ...FormInput, name: e.target.value })} description="Enter name of the book"/>
					<InputField type="string" label="book author" onChange={e => setFormInput({ ...FormInput, author: e.target.value })} description="Enter name of the author"/>
					<p className='typo__head typo__head--2 utils__margin__top--m utils__margin__bottom--s'>Upload Files</p>
					<InputField type="file" label="cover" accept='image/*' onChange={e => setFormInput({ ...FormInput, cover: e.target.files[0] })} description="Upload a picture of book cover. File types supported: JPG, PNG, GIF, SVG, WEBP"/>
					<InputField type="file" label="preview" accept='application/epub+zip' onChange={e => setFormInput({ ...FormInput, preview: e.target.files[0] })} description="Upload a sample of book for preview. File types supported: EPUB"/>
					<InputField type="file" label="book" accept='application/epub+zip' onChange={e => setFormInput({ ...FormInput, book: e.target.files[0] })} description="Upload a book. File types supported: EPUB"/>
					<p className='typo__head typo__head--2 utils__margin__top--m utils__margin__bottom--s'>Meta Data</p>
					<InputField type="string" label="price in USDC" onChange={e => setFormInput({ ...FormInput, price: e.target.value })} description="Price of book in USDC"/>
					<InputField type="list" label="genres" listType={'multiple'} minLimit={1} maxLimit={5} values={GENRES} value={FormInput.genres} onSave={values => setFormInput({ ...FormInput, genres: values })} placeholder="e.g., Action, Adventure" description="Select genres for the book. Max 5 genres can be selected"/>
					<InputField type="number" label="number of print pages" onChange={e => setFormInput({ ...FormInput, pages: e.target.value })} description="Enter number of pages in the book"/>
					<InputField type="string" label="publication" onChange={e => setFormInput({ ...FormInput, publication: e.target.value })} description="Enter name of the publisher"/>
					<InputField type="text" label="synopsis" lines={8} onChange={e => setFormInput({ ...FormInput, synopsis: e.target.value })} description="Write a brief description about the book"/>
					<InputField type="list" label="language" listType={'single'} values={LANGUAGES} value={FormInput.language} onSave={value => setFormInput({ ...FormInput, language: value })} description="Select the language of the book"/>
					<InputField type="date" label="published" onChange={e => setFormInput({ ...FormInput, published: e.target.value })} description="Enter when book was published"/>
					<p className='typo__head typo__head--2 utils__margin__top--m utils__margin__bottom--s'>Secondary Sales Conditions</p>
					<InputField type="number" label="min. number of primary sales" onChange={e => setFormInput({ ...FormInput, primarySales: e.target.value })} description="How many books to be sold as primary sales before secondary sale starts"/>
					<InputField type="date" label="open on" min={moment().add(90, 'days')} onChange={e => setFormInput({ ...FormInput, secondaryFrom: e.target.value })} description="From when to start secondary sales"/>
					<div className="create__data__form__cta">
						<PrimaryButton label={"Publish"} onClick={()=>listNFTForSale()} />
					</div>
				</div>
				<div className="create__data__preview">
					<div className="create__data__preview__container">
						<p className='typo__head typo__head--4 utils__margin__bottom--s'>Preview</p>
						<div className='create__data__preview__item'onClick={()=>{}}>
							{isUsable(CoverUrl)?<img className='create__data__preview__item__cover' src={CoverUrl} alt={FormInput.name+" cover"} />:<div className="create__data__preview__item__cover"/>}
							<div className="create__data__preview__item__data">
								<p className='create__data__preview__item__data__author typo__body typo__body--2'>{FormInput.author}</p>
								<p className='create__data__preview__item__data__name typo__body typo__body--2'>{FormInput.name}</p>
							</div>
							<div className="create__data__preview__item__action">
								<div onClick={()=>{}}>{isFilled(FormInput.price)?"Buy":null}</div>
								<p className='create__data__preview__item__action__price typo__body typo__body--2 utils__d__flex utils__align__center'>{isFilled(FormInput.price)?<>{FormInput.price}<USDCIcon width={20} height={20} fill='currentColor'/></>:null}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Page>
	)
}

export default CreateNftPage