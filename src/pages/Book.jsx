import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import axios from 'axios'

import Page from '../components/hoc/Page/Page'
import InputField from '../components/ui/Input/Input'
import PrimaryButton from '../components/ui/Buttons/Primary'

import Contracts from '../connections/contracts'

import ListModal from '../components/modal/List/List'
import PurchaseModal from '../components/modal/Purchase/Purchase'

import { BASE_URL } from '../config/env'
import { setSnackbar } from '../store/actions/snackbar'
import { hideSpinner, showSpinner } from '../store/actions/spinner'
import { isFilled, isNotEmpty, isUsable } from '../helpers/functions'
import { hideModal, showModal, SHOW_LIST_MODAL, SHOW_PURCHASE_MODAL } from '../store/actions/modal'

import LikeIcon from '../assets/icons/like.svg'
import LikedIcon from '../assets/icons/liked.svg'
import PrintIcon from '../assets/icons/print.svg'
import TargetIcon from '../assets/icons/target.svg'
import CartAddIcon from '../assets/icons/cart-add.svg'
import StarEmptyIcon from '../assets/icons/star-empty.svg'
import StarFilledIcon from '../assets/icons/star-filled.svg'
import BackgroundBook from '../assets/images/background-book.svg'
import StarFilledHalfIcon from '../assets/icons/star-filled-half.svg'
import StarEmptyHalfRtlIcon from '../assets/icons/star-empty-half-rtl.svg'

const BookPage = props => {

	const TABS = [{id: 'TAB01', label: 'Synopsis'}, {id: 'TAB02', label: 'reviews'}]

	const params = useLocation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [Wallet, setWallet] = useState(null)
	const [Loading, setLoading] = useState(false)
	const [ActiveTab, setActiveTab] = useState('TAB01')
	// NFT
	const [NFT, setNFT] = useState(null)
	const [Owner, setOwner] = useState(null)
	const [Listed, setListed] = useState(null)
	const [Created, setCreated] = useState(null)
	// Likes
	const [Likes, setLikes] = useState(0)
	const [Liked, setLiked] = useState(false)
	// Reviews
	const [Rating, setRating] = useState(0)
	const [Review, setReview] = useState(null)
	const [Reviews, setReviews] = useState([])
	const [TotalReveiws, setTotalReveiws] = useState(0)
	const [ReviewForm, setReviewForm] = useState({title: '', body: '', rating: 0})

	useEffect(() => {
		if(isUsable(NFT)){
			setLoading(true)
			axios({
				url: BASE_URL+'/api/book/reviews?bid='+NFT.id,
				method: 'GET'
			}).then(res => {
				setLoading(false)
				if(res.status === 200){
					setReviews(res.data.reviews)
					setRating(res.data.rating)
					setTotalReveiws(res.data.total)
				}
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				setLoading(false)
				dispatch(setSnackbar('ERROR'))
			})
		}
	}, [NFT, dispatch])

	useEffect(() => {
		if(isUsable(NFT) && isUsable(Wallet)){
			setLoading(true)
			axios({
				url: BASE_URL+'/api/book/reviewed?bid='+NFT.id+'&uid='+Wallet,
				method: 'GET'
			}).then(res => {
				setLoading(false)
				if(res.status === 200){
					if(isNotEmpty(res.data)) setReview(res.data)
				}
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				setLoading(false)
				dispatch(setSnackbar('ERROR'))
			})
		}
	}, [NFT, Wallet, dispatch])

	useEffect(() => {
		if(isUsable(NFT)){
			setLoading(true)
			axios({
				url: BASE_URL+'/api/book/likes?bid='+NFT.id,
				method: 'GET'
			}).then(res => {
				if(res.status === 200) setLikes(res.data.likes)
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally( () => setLoading(false))
		}
	}, [NFT, dispatch])

	useEffect(() => {
		if(isUsable(NFT) && isUsable(Wallet)){
			setLoading(true)
			axios({
				url: BASE_URL+'/api/book/liked?bid='+NFT.id+'&uid='+Wallet,
				method: 'GET'
			}).then(res => {
				if(res.status === 200) setLiked(res.data.liked)
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [NFT, Wallet, dispatch])

	useEffect(() => {
		setLoading(true)
		Contracts.Wallet.getWalletAddress().then(res => {
			setLoading(false)
			if(isUsable(res)) setWallet(res)
		}).catch(err =>{ setLoading(false) })
	}, [])

	useEffect(() => { if(isUsable(Review)) setReviewForm({title: Review.title, body: Review.body, rating: Review.rating}) }, [Review])

	useEffect(() => {
		if(isUsable(Wallet)){
			setLoading(true)
			const book = params.state
			if(book.new_owner === Wallet) setOwner(true)
			else setOwner(false)
			if(book.publisher_address === Wallet) setCreated(true)
			else setCreated(false)
			setNFT(params.state)
			axios({
				url: BASE_URL+'/api/book/owner',
				method: 'GET',
				params: {
					ownerAddress: Wallet,
					bookAddress: book.book_address
				}
			}).then(res => { if(res.status === 200) setOwner(true)
			}).catch(err => {
				if(!isUsable(err.response.status))
					console.error({err})
			}).finally(() => setLoading(false))
		}
	}, [params, dispatch, Wallet])

	useEffect(() => { if(isUsable(NFT) && isUsable(Created) && isUsable(Owner)) setLoading(false) }, [NFT, Created, Owner])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	const unlistHandler = () => {}

	const listHandler = () => { dispatch(showModal(SHOW_LIST_MODAL)) }

	const onListHandler = listPrice => {
		setLoading(true)
		Contracts.listBookToMarketplace(NFT.book_address, NFT.tokenId, listPrice).then(res => {
			console.log({res})
			setLoading(true)
			axios({
				url: BASE_URL + '/api/book/list',
				method: 'POST',
				data: {
					ownerAddress: Wallet,
					bookAddress: NFT.book_address,
					bookPrice: listPrice
				}
			}).then(res => {
				if(res.status === 200){
					setListed(true)
					dispatch(hideModal())
					dispatch(setSnackbar({show: true, message: "Book listed on marketplace.", type: 1}))
				}
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				console.error({err})
				dispatch(setSnackbar('ERROR'))
			}).finally( ()=> { setLoading(false) })
		}).catch(err => {
			console.error({err})
			dispatch(setSnackbar('ERROR'))
		}).finally(() => setLoading(false))
	}

	const readHandler = () => { navigate('/account/reader', {state: {book: NFT, preview: false}}) }

	const previewHandler = () => { navigate('/book/preview', {state: {book: NFT, preview: true}}) }

	const purchaseHandler = () => { dispatch(showModal(SHOW_PURCHASE_MODAL)) }

	const purchaseNewCopyHandler = () => {
		setLoading(true)
		Contracts.purchaseNft(Wallet, NFT.book_address, NFT.price.toString()).then(res => {
			dispatch(setSnackbar({show: true, message: "Book purchased.", type: 1}))
			dispatch(hideModal())
			const tokenId = Number(res.events.filter(event => event.eventSignature === "Transfer(address,address,uint256)")[0].args[2]._hex)
			axios({
				url: BASE_URL+'/api/book/purchase',
				method: 'POST',
				data: {ownerAddress: Wallet, bookAddress: NFT.book_address, tokenId}
			}).then(res => {
				if(res.status === 200) setOwner(true)
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
			axios({ url: BASE_URL+'/api/book/copies', method: 'POST', data: { bookAddress: NFT.book_address, copies: tokenId } }).then(res => {
				if(res.status !== 200) dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			})
		}).catch(err => {
			setLoading(false)
			if(err.code === 4001)
				dispatch(setSnackbar({show: true, message: "Transaction denied by user.", type: 3}))
			else dispatch(setSnackbar('ERROR'))
		})
	}

	const purchaseOldCopyHandler = () => {
		setLoading(true)
		Contracts.buyListedCover(NFT.address, "1", NFT.price).then(res => {
			console.log({res})
		}).catch(err => {
			console.error({err})
		}).finally( () => {
			setLoading(false)
		})
	}

	const likeHandler = likeState => {
		setLiked(likeState)
		if(likeState) setLikes(old => old+1)
		else setLikes(old => old-1)
		axios({
			url: BASE_URL+'/api/book/likes',
			method: 'POST',
			data: {
				bid: NFT.id,
				uid: Wallet,
				likedState: likeState
			}
		}).then(res => {
			setLoading(false)
			if(res.status !== 200) dispatch(setSnackbar('NOT200'))
		}).catch(err => {
			setLoading(false)
			dispatch(setSnackbar('ERROR'))
		})
	}

	const renderTabs = () => {
		let tabsDOM = []
		TABS.forEach(tab => {
			tabsDOM.push(
				<div onClick={()=>setActiveTab(tab.id)} className={tab.id === ActiveTab?"book__data__container__desc__tabs__container__item book__data__container__desc__tabs__container__item--active":"book__data__container__desc__tabs__container__item utils__cursor--pointer"} key={tab.id}>
					<h5 className="typo__head typo__head--5">{tab.label}</h5>
				</div>
			)
		})
		return tabsDOM
	}

	const renderTabData = () => {
		switch (ActiveTab) {
			case 'TAB01':
				return <p className="typo__body">{NFT.synopsis}</p>
			case 'TAB02':
				const renderStarsInput = () => {
					let starsDOM = []
					for (let i = 1; i <= 5; i++) {
						if(i <= ReviewForm.rating) starsDOM.push(<div key={'STAR'+i} className="book__data__container__desc__tabs__data__review__rating__item">
								<img src={StarFilledIcon} alt="star" className="book__data__container__desc__tabs__data__review__rating__item__icon" />
								<div onClick={()=>setReviewForm({ ...ReviewForm, rating: i-0.5})} className="book__data__container__desc__tabs__data__review__rating__item__trigger"/>
								<div onClick={()=>setReviewForm({ ...ReviewForm, rating: i})} className="book__data__container__desc__tabs__data__review__rating__item__trigger"/>
							</div>)
						else if(ReviewForm.rating < i && ReviewForm.rating > i-1) starsDOM.push(<div key={'STAR'+i} className="book__data__container__desc__tabs__data__review__rating__item">
								<img src={StarFilledHalfIcon} alt="half star" className="book__data__container__desc__tabs__data__review__rating__item__icon book__data__container__desc__tabs__data__review__rating__item__icon--half" />
								<img src={StarEmptyHalfRtlIcon} alt="half star" className="book__data__container__desc__tabs__data__review__rating__item__icon book__data__container__desc__tabs__data__review__rating__item__icon--half" />
								<div onClick={()=>setReviewForm({ ...ReviewForm, rating: i-0.5})} className="book__data__container__desc__tabs__data__review__rating__item__trigger"/>
								<div onClick={()=>setReviewForm({ ...ReviewForm, rating: i})} className="book__data__container__desc__tabs__data__review__rating__item__trigger"/>
							</div>)
						else starsDOM.push(<div key={'STAR'+i} className="book__data__container__desc__tabs__data__review__rating__item">
								<img src={StarEmptyIcon} alt="empty star" className="book__data__container__desc__tabs__data__review__rating__item__icon" />
								<div onClick={()=>setReviewForm({ ...ReviewForm, rating: i-0.5})} className="book__data__container__desc__tabs__data__review__rating__item__trigger"/>
								<div onClick={()=>setReviewForm({ ...ReviewForm, rating: i})} className="book__data__container__desc__tabs__data__review__rating__item__trigger"/>
							</div>)
					}
					return starsDOM
				}
				const renderStars = rating => {
					let starsDOM = []
					for (let i = 1; i <= 5; i++) {
						if(i <= rating) starsDOM.push(<div key={'STAR'+i} className="book__data__container__desc__tabs__data__reviews__item__rating__item">
								<img src={StarFilledIcon} alt="star" className="book__data__container__desc__tabs__data__reviews__item__rating__item__icon" />
							</div>)
						else if(rating < i && rating > i-1) starsDOM.push(<div key={'STAR'+i} className="book__data__container__desc__tabs__data__reviews__item__rating__item">
								<img src={StarFilledHalfIcon} alt="half star" className="book__data__container__desc__tabs__data__reviews__item__rating__item__icon book__data__container__desc__tabs__data__reviews__item__rating__item__icon--half" />
								<img src={StarEmptyHalfRtlIcon} alt="half star" className="book__data__container__desc__tabs__data__reviews__item__rating__item__icon book__data__container__desc__tabs__data__reviews__item__rating__item__icon--half" />
							</div>)
						else starsDOM.push(<div key={'STAR'+i} className="book__data__container__desc__tabs__data__reviews__item__rating__item">
								<img src={StarEmptyIcon} alt="empty star" className="book__data__container__desc__tabs__data__reviews__item__rating__item__icon" />
							</div>)
					}
					return starsDOM
				}

				const renderReviews = reviews => {
					let reviewsDOM = []
					if(isFilled(reviews)) reviews.forEach(review => reviewsDOM.push(
						<div className="book__data__container__desc__tabs__data__reviews__item">
							<div className="book__data__container__desc__tabs__data__reviews__item__rating">
								{renderStars(review.rating)}
								<p className="book__data__container__desc__tabs__data__reviews__item__rating__time typo__cap typo__cap--2">{review.reviewed_at.substring(0,review.reviewed_at.indexOf('T'))}</p>
							</div>
							<p className="book__data__container__desc__tabs__data__reviews__item__head typo__body typo__transform--upper">{review.title}</p>
							<p className="book__data__container__desc__tabs__data__reviews__item__body typo__body typo__body--2">{review.body}</p>
						</div>))
					return reviewsDOM
				}
				
				return <React.Fragment>
					{isUsable(Review)?null
						:<div className="book__data__container__desc__tabs__data__review">
							<div className="book__data__container__desc__tabs__data__review__rating">{renderStarsInput()}</div>
							<InputField type="string" label="title" value={ReviewForm.title} onChange={e => setReviewForm({ ...ReviewForm, title: e.target.value })} />
							<InputField type="text" label="body" value={ReviewForm.body} onChange={e => setReviewForm({ ...ReviewForm, body: e.target.value })} />
							<PrimaryButton onClick={()=>reviewHandler()} label="submit"/>
						</div>}
					<div className="book__data__container__desc__tabs__data__reviews">
						{renderReviews(Reviews)}
					</div>
				</React.Fragment>
			default:
				break;
		}
	}

	const reviewHandler = () => {
		setLoading(true)
		axios({
			url: BASE_URL+'/api/book/reviews',
			method: 'POST',
			data: {
				review: {...ReviewForm},
				uid: Wallet,
				bid: NFT.id
			}
		}).then(res => {
			setLoading(false)
			if(res.status !== 200) dispatch(setSnackbar('NOT200'))
		}).catch(err => {
			setLoading(false)
			dispatch(setSnackbar('ERROR'))
		})
	}

	return (
		<Page>
			<div className="book__bg">
				<img src={BackgroundBook} alt="background"/>
			</div>
			{isUsable(NFT)?
				<React.Fragment>
					<div className="book__data">
						<div className="book__data__background">
						</div>
						<div className="book__data__container">
							<div>
								<div className='book__data__container__cover'>
									<img className='book__data__container__cover__container' src={NFT.cover} alt={NFT.name} />
								</div>
								<div className='book__data__container__meta'>
									<h3 className="typo__head typo__head--3 typo__transform--capital">{NFT.title}</h3>
									<h5 className="typo__head typo__head--5">{NFT.author}</h5>
									<div className="book__data__container__meta__row">
										<div className="book__data__container__meta__row__item">
											<p className="book__data__container__meta__row__item__head typo__body typo__body--2">publication</p>
											<img src={TargetIcon} alt="publisher icon" className="book__data__container__meta__row__item__icon" />
											<p className="book__data__container__meta__row__item__value typo__body">{NFT.publication}</p>
										</div>
										<div className="book__data__container__meta__row__item">
											<p className="book__data__container__meta__row__item__head typo__body typo__body--2">print pages</p>
											<img src={PrintIcon} alt="pages icon" className="book__data__container__meta__row__item__icon" />
											<p className="book__data__container__meta__row__item__value typo__body">{NFT.print}</p>
										</div>
										<div className="book__data__container__meta__row__item">
											<p className="book__data__container__meta__row__item__head typo__body typo__body--2">Copies Sold</p>
											<img src={CartAddIcon} alt="ISBN icon" className="book__data__container__meta__row__item__icon" />
											<p className="book__data__container__meta__row__item__value typo__body">{NFT.copies || "-"}</p>
										</div>
									</div>
								</div>
							</div>
							<div className='book__data__container__desc'>
								<div className="book__data__container__desc__cta">
									{Listed
										?
											<PrimaryButton label={'Unlist'} onClick={()=>unlistHandler()}/>
										:Created||Owner
											?<React.Fragment>
												<PrimaryButton label={'Read'} onClick={()=>readHandler()}/>
												<PrimaryButton label={'List'} onClick={()=>listHandler()}/>
											</React.Fragment>
											:<React.Fragment>
												<PrimaryButton label={'Preview'} onClick={()=>previewHandler()}/>
												<PrimaryButton label={'Buy Now'} onClick={()=>purchaseHandler()}/>
											</React.Fragment>
									}
								</div>
								<div className="book__data__container__desc__row">
									<div className="book__data__container__desc__interacts">
										<div className="book__data__container__desc__interacts__space"/>
										<div className="book__data__container__desc__interacts__item">
											{Liked?<img onClick={()=>likeHandler(false)} className='book__data__container__desc__interacts__item__icon utils__cursor--pointer' src={LikedIcon} alt="liked"/>:<img onClick={()=>likeHandler(true)} className='book__data__container__desc__interacts__item__icon' src={LikeIcon} alt="like"/>}
											<p>{Likes}</p>
										</div>
										<div className="book__data__container__desc__interacts__item">
											<img onClick={()=>setActiveTab('TAB02')} className='book__data__container__desc__interacts__item__icon' src={StarFilledIcon} alt="rating"/>
											<p>{Rating}&nbsp;({TotalReveiws})</p>
										</div>
									</div>
								</div>
								<div className="book__data__container__desc__row book__data__container__desc__row--fluid">
									<div className="book__data__container__desc__summary">
										<p className='book__data__container__desc__summary__head typo__body--3'>contract address</p>
										<p className='book__data__container__desc__summary__data utils__cursor--pointer' onClick={()=>window.open(`https://mumbai.polygonscan.com/address/${NFT.book_address}`, "_blank")}>{(NFT.book_address||"").slice(0,4)}…{(NFT.book_address||"").slice((NFT.contract||"").length-4)}</p>
										<p className='book__data__container__desc__summary__head typo__body--3'>DA score</p>
										<p className='book__data__container__desc__summary__data'>{NFT.da_score}</p>
										<p className='book__data__container__desc__summary__head typo__body--3'>genres</p>
										<p className='book__data__container__desc__summary__data typo__transform--capital'>{JSON.parse(NFT.genres).join(', ')}</p>
										{/* <p className='book__data__container__desc__summary__head typo__body--3'>ISBN Code</p>
										<p className='book__data__container__desc__summary__data'>{NFT.isbn}</p> */}
										<p className='book__data__container__desc__summary__head typo__body--3'>language</p>
										<p className='book__data__container__desc__summary__data'>{NFT.language}</p>
										<p className='book__data__container__desc__summary__head typo__body--3'>price</p>
										<p className='book__data__container__desc__summary__data'>{NFT.price}&nbsp;NALNDA</p>
										<p className='book__data__container__desc__summary__head typo__body--3'>publication date</p>
										<p className='book__data__container__desc__summary__data'>{NFT.publication_date.substring(0, NFT.publication_date.indexOf('T'))}</p>
										{/* <p className='book__data__container__desc__summary__head typo__body--3'>rating</p>
										<p className='book__data__container__desc__summary__data'>{NFT.rating}</p> */}
									</div>
									<div className="book__data__container__desc__tabs">
										<div className="book__data__container__desc__tabs__container">
											{renderTabs()}
										</div>
										<div className="book__data__container__desc__tabs__data">
											{renderTabData()}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<PurchaseModal data={NFT} onNewBookPurchase={()=>purchaseNewCopyHandler()} onOldBookPurchase={()=>purchaseOldCopyHandler()}/>
					<ListModal data={NFT} onListHandler={listPrice=>onListHandler(listPrice)} />
				</React.Fragment>
				:null
			}
		</Page>
	)
}

export default BookPage
