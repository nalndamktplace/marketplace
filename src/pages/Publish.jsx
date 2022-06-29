import axios from 'axios'
import moment from 'moment'
import { useNavigate } from 'react-router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"

import Page from '../components/hoc/Page/Page'
import InputField from '../components/ui/Input/Input'

import GaTracker from '../trackers/ga-tracker'
import Contracts from '../connections/contracts'

import { setSnackbar } from '../store/actions/snackbar'
import { isFilled, isUsable } from '../helpers/functions'
import { hideSpinner, showSpinner } from '../store/actions/spinner'

import Button from '../components/ui/Buttons/Button'
import ProgressBar from '../components/ui/ProgressBar/ProgressBar'

import { ReactComponent as USDCIcon } from "../assets/icons/usdc-icon.svg"
import { ReactComponent as ImagePlaceholder } from "../assets/icons/image.svg"

import { GENRES } from '../config/genres'
import { BASE_URL } from '../config/env'
import { LANGUAGES } from '../config/languages'
import { AGE_GROUPS } from '../config/ages'

const PublishNftPage = props => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const WalletState = useSelector(state => state.WalletState)

	const [Loading, setLoading] = useState(false)
	const [CoverUrl, setCoverUrl] = useState(null)
	const [WalletAddress, setWalletAddress] = useState(null)
	const [FormInput, setFormInput] = useState({ name: '', author: '', cover: null, preview: null, book: null, genres: [], ageGroup: '', price: '', pages: '', publication: '', isbn: '', attributes: [], synopsis: '', language: '', published: '', secondarySalesDate: '', primarySales: '', secondaryFrom: moment().add(90, 'days')})
	const [formProgress, setFormProgress] = useState(0)

	useEffect(() => { GaTracker('page_view_publish') }, [])

	useEffect(() => { if(isUsable(FormInput.cover)) setCoverUrl(URL.createObjectURL(FormInput.cover)) }, [FormInput])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		setLoading(true)
		if(isUsable(WalletState.wallet.provider)) setWalletAddress(WalletState.wallet.address)
		setLoading(false)
	}, [WalletState])

	useEffect(()=>{
		let filled = Object.values(FormInput).filter(v => !(v===""||v?.length===0||v===null)).length - 1
		setFormProgress(filled/13)
	},[FormInput])

	async function listNFTForSale() {
		GaTracker('event_publish_list')

		setLoading(true)

		let formData = new FormData()
		formData.append("book",FormInput.book)
		formData.append("cover",FormInput.cover)
		formData.append("bookTitle",FormInput.title)
		formData.append("synopsis", FormInput.synopsis)

		axios({
			url : BASE_URL + "/api/book/submarine",
			method : "POST",
			data : formData
		}).then(res => {
			const bookUrl = res.data.book.url
			const coverUrl = res.data.cover.url
			const { name, author, cover, book, genres, ageGroup, price, pages, publication, attributes, synopsis, language, published, secondaryFrom } = FormInput
			const secondaryFromInDays = Math.round(moment.duration(FormInput.secondaryFrom - moment()).asDays())
			let genreIDs = []
			genres.forEach(genre => genreIDs.push(GENRES.indexOf(genre).toString()))
			const languageId = LANGUAGES.indexOf(language).toString()
			if(isUsable(languageId) && isUsable(genreIDs) && !isNaN(secondaryFromInDays) && isFilled(name) && isFilled(author) && isUsable(cover) && isUsable(book) && isFilled(pages) && isFilled(publication)){
				Contracts.listNftForSales(WalletAddress, coverUrl, price, secondaryFromInDays, languageId, genreIDs, WalletState.wallet.signer).then(tx => {
					const bookAddress = tx.events.filter(event => event['event'] === "OwnershipTransferred")[0].address
					const status = tx.status
					const txHash = tx.transactionHash
					if(isUsable(bookAddress) && isUsable(status) && status === 1 && isUsable(txHash)){
						let formData = new FormData()
						formData.append("epub", FormInput.preview)
						formData.append("ipfsPath", name)
						formData.append("name", name)
						formData.append("author", author)
						formData.append("cover", coverUrl)
						formData.append("book", bookUrl)
						formData.append("genres", JSON.stringify(genres.sort((a,b) => a>b)))
						formData.append("ageGroup", ageGroup)
						formData.append("price", price)
						formData.append("pages", pages)
						formData.append("publication", publication)
						formData.append("attributes", JSON.stringify(attributes))
						formData.append("synopsis", synopsis.replace(/<[^>]+>/g, ''))
						formData.append("language", language)
						formData.append("published", published)
						formData.append("secondarySalesFrom", secondaryFrom)
						formData.append("publisherAddress", WalletAddress)
						formData.append("bookAddress", bookAddress)
						formData.append("txHash", txHash)
						axios({
							url: BASE_URL+'/api/book/publish',
							method: 'POST',
							data: formData
						}).then(res4 => {
							if(res4.status === 200){
								setLoading(false)
								navigate('/account', {state: {tab: 'published'}})
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
		<Page noFooter={true} containerClass={'publish publish__bg'}>
			<div className="publish__data">
				<div className="publish__data__form utils__padding__bottom--s">
					<h3 className='typo__head typo__head--3 utils__margin__top--m utils__margin__bottom--s typo__color--n700'>Publish eBook</h3>
					<InputField type="string" label="book name" onChange={e => setFormInput({ ...FormInput, name: e.target.value })} description="Enter name of the book"/>
					<InputField type="string" label="book author" onChange={e => setFormInput({ ...FormInput, author: e.target.value })} description="Enter name of the author"/>
					<h3 className='typo__head typo__head--3 utils__margin__top--m utils__margin__bottom--s typo__color--n700'>Upload Files</h3>
					<InputField type="file" label="cover" accept='image/*' onChange={e => setFormInput({ ...FormInput, cover: e.target.files[0] })} description="Upload a picture of book cover. File types supported: JPG, PNG, GIF, SVG, WEBP"/>
					<InputField type="file" label="preview" accept='application/epub+zip' onChange={e => setFormInput({ ...FormInput, preview: e.target.files[0] })} description="Upload a sample of book for preview. File types supported: EPUB"/>
					<InputField type="file" label="book" accept='application/epub+zip' onChange={e => setFormInput({ ...FormInput, book: e.target.files[0] })} description="Upload a book. File types supported: EPUB"/>
					<h3 className='typo__head typo__head--3 utils__margin__top--m utils__margin__bottom--s typo__color--n700'>Meta Data</h3>
					<InputField type="number" label="price in USDC" onChange={e => setFormInput({ ...FormInput, price: e.target.value })} description="Price of book in USDC"/>
					<InputField type="list" label="genres" listType={'multiple'} minLimit={1} maxLimit={5} values={GENRES} value={FormInput.genres} onSave={values => setFormInput({ ...FormInput, genres: values })} placeholder="e.g., Action, Adventure" description="Select genres for the book. Max 5 genres can be selected"/>
					<InputField type="list" label="age group" listType={'single'} values={AGE_GROUPS} value={FormInput.ageGroup} onSave={value => setFormInput({ ...FormInput, ageGroup: value })} placeholder="e.g., Youth (15-24 years)" description="Select the most appropriate age group for the book."/>
					<InputField type="number" label="number of print pages" onChange={e => setFormInput({ ...FormInput, pages: e.target.value })} description="Enter number of pages in the book"/>
					<InputField type="string" label="publication" onChange={e => setFormInput({ ...FormInput, publication: e.target.value })} description="Enter name of the publisher"/>
					<InputField type="text" label="synopsis" lines={8} onChange={e => setFormInput({ ...FormInput, synopsis: e.target.value })} description="Write a brief description about the book"/>
					<InputField type="list" label="language" listType={'single'} values={LANGUAGES} value={FormInput.language} onSave={value => setFormInput({ ...FormInput, language: value })} description="Select the language of the book"/>
					<InputField type="date" label="published" onChange={e => setFormInput({ ...FormInput, published: e.target.value })} description="Enter when book was published"/>
					<h3 className='typo__head typo__head--3 utils__margin__top--m utils__margin__bottom--s typo__color--n700'>Secondary Sales Conditions</h3>
					<InputField type="date" label="open on" min={moment().add(90, 'days')} onChange={e => setFormInput({ ...FormInput, secondaryFrom: e.target.value })} description="From when to start secondary sales"/>
				</div>
				<div className="publish__data__preview">
					<div className="publish__data__preview__container">
						<h3 className='typo__head typo__head--3 utils__margin__top--n utils__margin__bottom--s typo__color--n700'>Preview</h3>
						<div className='publish__data__preview__book' onClick={()=>{}}>
							<div className="publish__data__preview__book__cover">
								{	isUsable(CoverUrl)
									?<img className='publish__data__preview__book__cover__img' src={CoverUrl} alt={FormInput.name+" cover"} />
									: <div className='publish__data__preview__book__cover__placeholder'>
										<ImagePlaceholder stroke='currentColor'/>
										<span className='utils__margin__top--m'>Book Cover</span>
									</div>
								}
							</div>
							<div className="publish__data__preview__book__data">
								<div className="publish__data__preview__book__data__title  typo__head--4">{FormInput.name}</div>
								<div className="publish__data__preview__book__data__author typo__head--6">{FormInput.author}</div>
								{FormInput.price && <div className="publish__data__preview__book__data__price"><USDCIcon stroke="currentColor" width={24} height={24}/><span>{FormInput.price}</span></div>}
								{FormInput.language && <div className="publish__data__preview__book__data__field">
									<div className="publish__data__preview__book__data__field__label typo__head--6">Language</div>
									<div className="publish__data__preview__book__data__field__value">{FormInput.language}</div>
								</div>}
								{isFilled(FormInput.genres) && <div className="publish__data__preview__book__data__field">
									<div className="publish__data__preview__book__data__field__label typo__head--6">Genres</div>
									<div className="publish__data__preview__book__data__field__chips">
										{FormInput.genres.map(item => <div key={item} className="publish__data__preview__book__data__field__chips__item">{item}</div>)}
									</div>
								</div>}
								{FormInput.publication && <div className="publish__data__preview__book__data__field">
									<div className="publish__data__preview__book__data__field__label typo__head--6">Publication</div>
									<div className="publish__data__preview__book__data__field__value">{FormInput.publication}</div>
								</div>}
							</div>
						</div>
						<div className='publish__data__preview__progress'>
							<div className='publish__data__preview__progress__container'>
								<div className='publish__data__preview__progress__container__value typo__color--n700'>{Math.round(formProgress*100)}%</div>
								<ProgressBar progress={formProgress}/>
							</div>
							<Button type="primary" disabled={formProgress!==1} size="lg" onClick={()=>listNFTForSale()}>Publish</Button>
						</div>
					</div>
				</div>
			</div>
		</Page>
	)
}

export default PublishNftPage