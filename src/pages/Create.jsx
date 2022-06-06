import axios from 'axios'
import moment from 'moment'
import { useNavigate } from 'react-router'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"

import Page from '../components/hoc/Page/Page'
import InputField from '../components/ui/Input/Input'
import PrimaryButton from '../components/ui/Buttons/Primary'

import Contracts from '../connections/contracts'
import { IpfsClient } from '../connections/ipfs'

import { setSnackbar } from '../store/actions/snackbar'
import { isFilled, isNotEmpty, isUsable } from '../helpers/functions'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

import { BASE_URL } from '../config/env'
import { PRIMARY_MARKET_CONTRACT_ADDRESS } from '../config/contracts'

import { ReactComponent as USDCIcon } from "../assets/icons/usdc-icon.svg"
import { ReactComponent as ImagePlaceholder } from "../assets/icons/image.svg"
import ProgressBar from '../components/ui/ProgressBar/ProgressBar'

const CreateNftPage = props => {

	const GENRES = ['fantasy', 'science fiction', 'adventure', 'romance', 'mystery', 'horror', 'thriller', 'historical fiction', 'children\'s fiction', 'autobiography', 'biography', 'cooking', 'art', 'selfhelp', 'inspirational', 'health & fitness', 'history', 'humor', 'business', 'travel']
	const LANGUAGES = ['ES - Espanol', 'EN - English', 'HN - Hindi']

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const WalletState = useSelector(state => state.WalletState)

	const [Loading, setLoading] = useState(false)
	const [CoverUrl, setCoverUrl] = useState(null)
	const [WalletAddress, setWalletAddress] = useState(null)
	const [FormInput, setFormInput] = useState({ name: '', author: '', cover: null, preview: null, book: null, genres: [], price: '', pages: '', publication: '', isbn: '', attributes: [], synopsis: '', language: '', published: '', secondarySalesCopies: '', secondarySalesDate: '', primarySales: '', secondaryFrom: moment().add(90, 'days')})
	const [formProgress, setFormProgress] = useState(0);

	useEffect(() => { if(isUsable(FormInput.cover)) setCoverUrl(URL.createObjectURL(FormInput.cover)) }, [FormInput])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		setLoading(true)
		if(isUsable(WalletState)) setWalletAddress(WalletState.wallet)
		setLoading(false)
	}, [WalletState])

	useEffect(()=>{
		let filled = Object.values(FormInput).filter(v => !(v===""||v?.length===0||v===null)).length ;
		setFormProgress(filled/14);
	},[FormInput])

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
				const { name, author, cover, book, genres, price, pages, publication, attributes, synopsis, language, published, primarySales, secondaryFrom } = FormInput
				if(isFilled(name) && isFilled(author) && isUsable(cover) && isUsable(book) && isFilled(pages) && isFilled(publication)){
					const data = JSON.stringify({ name, author, cover: coverUrl, book: bookUrl, price})
					IpfsClient.add(data).then(res2 => {
						const url = `https://ipfs.infura.io/ipfs/${res2.path}`
						Contracts.listNftForSales(WalletAddress, url, price).then(tx => {
							const bookAddress = tx.events[0].address
							const newOwner = tx.events[0].args.newOwner
							const previousOwner = tx.events[0].args.previousOwner
							const status = tx.status
							const txHash = tx.transactionHash
							if(isUsable(bookAddress) && isUsable(newOwner) && newOwner === PRIMARY_MARKET_CONTRACT_ADDRESS && isUsable(status) && status === 1 && isUsable(txHash)){
								let formData = new FormData()
								formData.append("epub", FormInput.preview)
								formData.append("ipfsPath", res2.path)
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
					}).catch(err => {
						dispatch(setSnackbar('NOT200'))
						setLoading(false)
					})
				}
				else{
					dispatch(setSnackbar({show: true, message: "Incomplete details", type: 3}))
					setLoading(false)
				}
			}).catch(err => {
				dispatch(setSnackbar('NOT200'))
				setLoading(false)
			})
		}).catch(err => {
			dispatch(setSnackbar('NOT200'))
			setLoading(false)
		})
	}

	return (
		<Page noFooter={true} containerClass={'create create__bg'}>
			<div className="create__data">
				<div className="create__data__form utils__padding__bottom--s">
					<h3 className='typo__head typo__head--3 utils__margin__top--m utils__margin__bottom--s'>Publish eBook</h3>
					<InputField type="string" label="book name" onChange={e => setFormInput({ ...FormInput, name: e.target.value })} description="Enter name of the book"/>
					<InputField type="string" label="book author" onChange={e => setFormInput({ ...FormInput, author: e.target.value })} description="Enter name of the author"/>
					<h3 className='typo__head typo__head--3 utils__margin__top--m utils__margin__bottom--s'>Upload Files</h3>
					<InputField type="file" label="cover" accept='image/*' onChange={e => setFormInput({ ...FormInput, cover: e.target.files[0] })} description="Upload a picture of book cover. File types supported: JPG, PNG, GIF, SVG, WEBP"/>
					<InputField type="file" label="preview" accept='application/epub+zip' onChange={e => setFormInput({ ...FormInput, preview: e.target.files[0] })} description="Upload a sample of book for preview. File types supported: EPUB"/>
					<InputField type="file" label="book" accept='application/epub+zip' onChange={e => setFormInput({ ...FormInput, book: e.target.files[0] })} description="Upload a book. File types supported: EPUB"/>
					<h3 className='typo__head typo__head--3 utils__margin__top--m utils__margin__bottom--s'>Meta Data</h3>
					<InputField type="number" label="price in USDC" onChange={e => setFormInput({ ...FormInput, price: e.target.value })} description="Price of book in USDC"/>
					<InputField type="list" label="genres" listType={'multiple'} minLimit={1} maxLimit={5} values={GENRES} value={FormInput.genres} onSave={values => setFormInput({ ...FormInput, genres: values })} placeholder="e.g., Action, Adventure" description="Select genres for the book. Max 5 genres can be selected"/>
					<InputField type="number" label="number of print pages" onChange={e => setFormInput({ ...FormInput, pages: e.target.value })} description="Enter number of pages in the book"/>
					<InputField type="string" label="publication" onChange={e => setFormInput({ ...FormInput, publication: e.target.value })} description="Enter name of the publisher"/>
					<InputField type="text" label="synopsis" lines={8} onChange={e => setFormInput({ ...FormInput, synopsis: e.target.value })} description="Write a brief description about the book"/>
					<InputField type="list" label="language" listType={'single'} values={LANGUAGES} value={FormInput.language} onSave={value => setFormInput({ ...FormInput, language: value })} description="Select the language of the book"/>
					<InputField type="date" label="published" onChange={e => setFormInput({ ...FormInput, published: e.target.value })} description="Enter when book was published"/>
					<h3 className='typo__head typo__head--3 utils__margin__top--m utils__margin__bottom--s'>Secondary Sales Conditions</h3>
					<InputField type="number" label="min. number of primary sales" onChange={e => setFormInput({ ...FormInput, primarySales: e.target.value })} description="How many books to be sold as primary sales before secondary sale starts"/>
					<InputField type="date" label="open on" min={moment().add(90, 'days')} onChange={e => setFormInput({ ...FormInput, secondaryFrom: e.target.value })} description="From when to start secondary sales"/>
					{/* <div className="create__data__form__cta">
						<PrimaryButton label={"Publish"} onClick={()=>listNFTForSale()} />
					</div> */}
				</div>
				<div className="create__data__preview">
					<div className="create__data__preview__container">
						<h3 className='typo__head typo__head--3 utils__margin__top--m utils__margin__bottom--s'>Preview</h3>
						<div className='create__data__preview__book' onClick={()=>{}}>
							<div className="create__data__preview__book__cover">
								{	isUsable(CoverUrl)
									?<img className='create__data__preview__book__cover__img' src={CoverUrl} alt={FormInput.name+" cover"} />
									: <div className='create__data__preview__book__cover__placeholder'>
										<ImagePlaceholder stroke='currentColor'/>
										<span className='utils__margin__top--m'>Select a image for the book cover</span>
									</div>
								}
							</div>
							<div className="create__data__preview__book__data">
								<div className="create__data__preview__book__data__title  typo__head--4">{FormInput.name}</div>
								<div className="create__data__preview__book__data__author typo__head--6">{FormInput.author}</div>
								{FormInput.price && <div className="create__data__preview__book__data__price"><USDCIcon fill="currentColor" width={24} height={24}/><span>{FormInput.price}</span></div>}
								{FormInput.language && <div className="create__data__preview__book__data__field">
									<div className="create__data__preview__book__data__field__label typo__head--6">Language</div>
									<div className="create__data__preview__book__data__field__value">{FormInput.language}</div>
								</div>}
								{isFilled(FormInput.genres) && <div className="create__data__preview__book__data__field">
									<div className="create__data__preview__book__data__field__label typo__head--6">Genres</div>
									<div className="create__data__preview__book__data__field__chips">
										{FormInput.genres.map(item => <div key={item} className="create__data__preview__book__data__field__chips__item">{item}</div>)}
									</div>
								</div>}
								{FormInput.publication && <div className="create__data__preview__book__data__field">
									<div className="create__data__preview__book__data__field__label typo__head--6">Publication</div>
									<div className="create__data__preview__book__data__field__value">{FormInput.publication}</div>
								</div>}
							</div>
						</div>
						<div className='create__data__preview__progress'>
							<div className='create__data__preview__progress__container'>
								<div className='create__data__preview__progress__container__value'>{Math.round(formProgress*100)}%</div>
								<ProgressBar progress={formProgress}/>
							</div>
							<PrimaryButton disabled={formProgress!==1} label={"Publish"} onClick={()=>listNFTForSale()} />
						</div>
					</div>
				</div>
			</div>
		</Page>
	)
}

export default CreateNftPage