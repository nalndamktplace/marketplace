import axios from 'axios'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import Page from '../components/hoc/Page/Page'
import InputField from '../components/ui/Input/Input'
import PrimaryButton from '../components/ui/Buttons/Primary'

import Contracts from '../connections/contracts'

import ListModal from '../components/modal/List/List'
import PurchaseModal from '../components/modal/Purchase/Purchase'

import Wallet from '../connections/wallet'

import { setWallet } from '../store/actions/wallet'
import { setSnackbar } from '../store/actions/snackbar'
import { hideSpinner, showSpinner } from '../store/actions/spinner'
import { isFilled, isNotEmpty, isUsable } from '../helpers/functions'
import { hideModal, showModal, SHOW_LIST_MODAL, SHOW_PURCHASE_MODAL } from '../store/actions/modal'

import PrintIcon from '../assets/icons/print.svg'
import TargetIcon from '../assets/icons/target.svg'
import CartAddIcon from '../assets/icons/cart-add.svg'
import StarEmptyIcon from '../assets/icons/star-empty.svg'
import StarFilledIcon from '../assets/icons/star-filled.svg'
import BackgroundBook from '../assets/images/background-book.svg'
import StarFilledHalfIcon from '../assets/icons/star-filled-half.svg'
import StarEmptyHalfRtlIcon from '../assets/icons/star-empty-half-rtl.svg'
import {ReactComponent as LikeIcon} from '../assets/icons/like.svg'
import {ReactComponent as USDCIcon} from "../assets/icons/usdc-icon.svg"
import {ReactComponent as QuoteIcon} from "../assets/icons/quote.svg"

import { BASE_URL } from '../config/env'

const BookPage = props => {

	const TABS = [{id: 'TAB01', label: 'Synopsis'}, {id: 'TAB02', label: 'reviews'}, {id: 'TAB03', label: 'quotes'}]

	const params = useLocation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const WalletState = useSelector(state => state.WalletState)

	const [WalletAddress, setWalletAddress] = useState(null)
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
	// Quotes
	const [Quote, setQuote] = useState(null);
	const [Quotes, setQuotes] = useState([]);
	const [QuotesForm, setQuotesForm] = useState({quote: ''})

	useEffect(() => { if(isUsable(NFT)) setListed(NFT.listed === 1?true:false) }, [NFT])

	useEffect(() => {
		if(isUsable(NFT)){
			setLoading(true)
			axios({
				url: BASE_URL+'/api/book/reviews?bid='+NFT.id,
				method: 'GET'
			}).then(res => {
				if(res.status === 200){
					setReviews(res.data.reviews)
					setRating(res.data.rating)
					setTotalReveiws(res.data.total)
				}
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [NFT, dispatch])

	useEffect(() => {
		if(isUsable(NFT) && isUsable(WalletAddress)){
			setLoading(true)
			axios({
				url: BASE_URL+'/api/book/reviewed?bid='+NFT.id+'&uid='+WalletAddress,
				method: 'GET'
			}).then(res => {
				if(res.status === 200) if(isNotEmpty(res.data)) setReview(res.data)
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [NFT, dispatch, WalletAddress])

	useEffect(() => {
		if(isUsable(NFT)){
			setLoading(true)
			axios({
				url: BASE_URL+'/api/book/quotes',
				method: 'GET',
				params: {
					bid: NFT.id
				}
			}).then(res => {
				if(res.status === 200) setQuotes(res.data)
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [NFT, dispatch])

	useEffect(() => {
		if(isUsable(NFT) && isUsable(Wallet)){
			setLoading(true)
			axios({
				url: BASE_URL+'/api/book/quoted?bid='+NFT.id+'&uid='+Wallet,
				method: 'GET'
			}).then(res => {
				if(res.status === 200) if(isNotEmpty(res.data)) setQuote(res.data)
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [NFT, WalletAddress, dispatch])

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
		if(isUsable(NFT) && isUsable(WalletAddress)){
			setLoading(true)
			axios({
				url: BASE_URL+'/api/book/liked?bid='+NFT.id+'&uid='+WalletAddress,
				method: 'GET'
			}).then(res => {
				if(res.status === 200) setLiked(res.data.liked)
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [NFT, WalletAddress, dispatch])

	useEffect(() => {
		setLoading(true)
		if(isUsable(WalletState.wallet)) setWalletAddress(WalletState.wallet)
		setLoading(false)
	}, [WalletState])

	useEffect(() => { if(isUsable(Review)) setReviewForm({title: Review.title, body: Review.body, rating: Review.rating}) }, [Review])

	useEffect(() => {
		setNFT(params.state)
		if(isUsable(WalletAddress)){
			setLoading(true)
			const book = params.state
			if(book.new_owner === WalletAddress) setOwner(true)
			else setOwner(false)
			if(book.publisher_address === WalletAddress) setCreated(true)
			else setCreated(false)
			axios({
				url: BASE_URL+'/api/book/owner',
				method: 'GET',
				params: {
					ownerAddress: WalletAddress,
					bookAddress: book.book_address
				}
			}).then(res => { if(res.status === 200) setOwner(true)
			}).catch(err => {
				if(!isUsable(err.response.status))
					console.error({err})
			}).finally(() => setLoading(false))
		}
	}, [params, dispatch, WalletAddress])

	useEffect(() => { if(isUsable(NFT) && isUsable(Created) && isUsable(Owner)) setLoading(false) }, [NFT, Created, Owner])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	const walletStatus = () => {
		if(isUsable(WalletState.support) && WalletState.support === true && isUsable(WalletState.wallet)){
			setWalletAddress(WalletState.wallet)
			return true
		}
		else if(!isUsable(WalletState.support) || WalletState.support === false){
			window.open("https://metamask.io/download/", '_blank')
			return false
		}
		else {
			setLoading(true)
			Wallet.connectWallet().then(res => {
				setWalletAddress(res.selectedAddress)
				dispatch(setWallet(res.selectedAddress))
				dispatch(setSnackbar({show: true, message: "Wallet connected.", type: 1}))
				return true
			}).catch(err => {
				console.error({err})
				dispatch(setSnackbar({show: true, message: "Error while connecting to wallet", type: 4}))
				return false
			}).finally(() => setLoading(false))
		}
	}

	const unlistHandler = () => {
		if(isUsable(WalletAddress)){
			setLoading(true)
			axios({
				url: BASE_URL + '/api/user/book/listed',
				method: 'GET',
				params: {
					ownerAddress: WalletAddress,
					tokenId: NFT.tokenId,
					bookAddress: NFT.book_address
				}
			}).then(res => {
				if(res.status === 200){
					setLoading(true)
					const orderId = res.data.order_id
					Contracts.unlistBookFromMarketplace(orderId).then(res => {
						setLoading(true)
						axios({
							url: BASE_URL + '/api/book/unlist',
							method: 'POST',
							data: {
								ownerAddress: WalletAddress,
								bookAddress: NFT.book_address,
							}
						}).then(res => {
							if(res.status === 200){
								setListed(false)
								dispatch(hideModal())
								dispatch(setSnackbar({show: true, message: "Book unlisted from marketplace.", type: 1}))
							}
							else dispatch(setSnackbar('NOT200'))
						}).catch(err => {
							dispatch(setSnackbar('ERROR'))
						}).finally( ()=> { setLoading(false) })
					}).catch(err => {
						setLoading(false)
						if(err.data.message === 'execution reverted: NalndaBooksSecondarySales: NFT not yet listed / already sold!')
							dispatch(setSnackbar({show: true, message: "eBook already sold or not listed.", type: 3}))
						else dispatch(setSnackbar('ERROR'))
					})
				}
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				setLoading(false)
				dispatch(setSnackbar('ERROR'))
			})
		}
	}

	const listHandler = () => {
		if(NFT.copies >= NFT.min_primary_sales && (moment(NFT.secondary_sales_from).isSame(moment()) || moment(NFT.secondary_sales_from).isBefore(moment()))) dispatch(showModal(SHOW_LIST_MODAL))
		else if(NFT.copies < NFT.min_primary_sales) dispatch(setSnackbar({show: true, message: `Secondary Sales will open only after ${NFT.min_primary_sales} copies have been sold.`, type: 2}))
		else if(moment(NFT.secondary_sales_from).isAfter(moment())) dispatch(setSnackbar({show: true, message: `Secondary Sales will open only after ${moment(NFT.secondary_sales_from).format('D MMM, YYYY')}.`, type: 2}))
	}

	const onListHandler = listPrice => {
		if(isUsable(WalletAddress)){
			setLoading(true)
			Contracts.listBookToMarketplace(NFT.book_address, NFT.tokenId, listPrice).then(res => {
				setLoading(true)
				const orderId = parseInt(res.events.filter(event => event.event === 'CoverListed')[0].args[0]._hex)
				axios({
					url: BASE_URL + '/api/book/list',
					method: 'POST',
					data: {
						ownerAddress: WalletAddress,
						bookAddress: NFT.book_address,
						bookPrice: listPrice,
						bookOrderId: orderId
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
	}

	const readHandler = () => { navigate('/account/reader', {state: {book: NFT, preview: false}}) }

	const previewHandler = () => { navigate('/book/preview', {state: {book: NFT, preview: true}}) }

	const purchaseHandler = () => { dispatch(showModal(SHOW_PURCHASE_MODAL)) }

	const purchaseNewCopyHandler = () => {
		if(walletStatus()){
			setLoading(true)
			Contracts.purchaseNft(WalletAddress, NFT.book_address, NFT.price.toString()).then(res => {
				dispatch(setSnackbar({show: true, message: "Book purchased.", type: 1}))
				dispatch(hideModal())
				const tokenId = Number(res.events.filter(event => event.eventSignature === "Transfer(address,address,uint256)")[0].args[2]._hex)
				axios({
					url: BASE_URL+'/api/book/purchase',
					method: 'POST',
					data: {ownerAddress: WalletAddress, bookAddress: NFT.book_address, tokenId}
				}).then(res => {
					if(res.status === 200) setOwner(true)
					else dispatch(setSnackbar('NOT200'))
				}).catch(err => {
					dispatch(setSnackbar('ERROR'))
				}).finally(() => setLoading(false))
				axios({
					url: BASE_URL+'/api/book/copies',
					method: 'POST',
					data: {bookAddress: NFT.book_address, copies: tokenId}
				}).then(res => {
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
	}

	const purchaseOldCopyHandler = offer => {
		if(walletStatus()){
			setLoading(true)
			Contracts.buyListedCover(offer.order_id, offer.price).then(res => {
				axios({
					url: BASE_URL+'/api/book/purchase/secondary',
					method: 'POST',
					data: {
						newOwnerAddress: WalletAddress,
						previousOwnerAddress: offer.previous_owner,
						bookAddress: offer.book_address,
						tokenId: offer.token_id
					}
				}).then(res => {
					if(res.status === 200) setOwner(true)
					else dispatch(setSnackbar('NOT200'))
				}).catch(err => {
					console.error({err})
					dispatch(setSnackbar('ERROR'))
				}).finally(() => setLoading(false))
			}).catch(err => {
				setLoading(false)
				console.error({err})
			})
		}
	}

	const likeHandler = likeState => {
		if(walletStatus()){
			setLiked(likeState)
			if(likeState) setLikes(old => old+1)
			else setLikes(old => old-1)
			axios({
				url: BASE_URL+'/api/book/likes',
				method: 'POST',
				data: {
					bid: NFT.id,
					uid: WalletAddress,
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
								<p className="book__data__container__desc__tabs__data__reviews__item__rating__time typo__cap typo__cap--2">{moment(review.reviewed_at).format("D MMM, YYYY")}</p>
							</div>
							<p className="book__data__container__desc__tabs__data__reviews__item__head typo__body typo__transform--upper">{review.title}</p>
							<p className="book__data__container__desc__tabs__data__reviews__item__body typo__body typo__body--2">{review.body}</p>
						</div>))
					return reviewsDOM
				}
				
				return <React.Fragment>
					{ !isUsable(Review) && (Created||Owner) && (
						<div className="book__data__container__desc__tabs__data__review">
							<div className="book__data__container__desc__tabs__data__review__rating">{renderStarsInput()}</div>
							<InputField type="string" label="title" value={ReviewForm.title} onChange={e => setReviewForm({ ...ReviewForm, title: e.target.value })} />
							<InputField type="text" label="body" value={ReviewForm.body} onChange={e => setReviewForm({ ...ReviewForm, body: e.target.value })} />
							<PrimaryButton onClick={()=>reviewHandler()} label="submit"/>
						</div>
					)}
					<div className="book__data__container__desc__tabs__data__reviews">
						{renderReviews(Reviews)}
					</div>
				</React.Fragment>
			case 'TAB03':
				const renderQuotes = quotes => {
					let quotesDOM = []
					quotes.forEach((quote,i) => {
						quotesDOM.push(
							<div key={i} className='book__data__container__desc__tabs__data__quotes__item'>
								<div className="book__data__container__desc__tabs__data__quotes__item__icon">
									<QuoteIcon width={32} height={32} fill="currentColor"/>
								</div>
								<div className="book__data__container__desc__tabs__data__quotes__item__body">
									{quote.body}
								</div>
								<div className="book__data__container__desc__tabs__data__quotes__item__time typo__cap typo__cap--2">
									{moment(quote.created_at).format("D MMM, YYYY") || "-"}
								</div>
							</div>
						)
					})
					return quotesDOM
				}
				
				return <React.Fragment>
					{ !isUsable(Quote) && (Created||Owner) && (
						<div className="book__data__container__desc__tabs__data__quote">
							<InputField type="string" label="quote" value={QuotesForm.quote} onChange={e => setQuotesForm({ ...QuotesForm, quote: e.target.value })} />
							<PrimaryButton onClick={()=>quoteHandler()} label="submit"/>
						</div>
					)}
					<div className="book__data__container__desc__tabs__data__quotes">
						{renderQuotes(Quotes)}
					</div>
				</React.Fragment>
			default:
				break
		}
	}

	const reviewHandler = () => {
		if(isUsable(WalletAddress)){
			setLoading(true)
			axios({
				url: BASE_URL+'/api/book/reviews',
				method: 'POST',
				data: {
					review: {...ReviewForm},
					uid: WalletAddress,
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
	}

	const quoteHandler = () => {
		if(!QuotesForm.quote) return;
		setLoading(true)
		axios({
			url: BASE_URL+'/api/book/quotes',
			method: 'POST',
			data: {
				quote: {body:QuotesForm.quote},
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
											<p className="book__data__container__meta__row__item__head typo__body typo__body--2">Sold</p>
											<img src={CartAddIcon} alt="ISBN icon" className="book__data__container__meta__row__item__icon" />
											<p className="book__data__container__meta__row__item__value typo__body">{NFT.copies}</p>
										</div>
									</div>
								</div>
							</div>
							<div className='book__data__container__desc'>
								<div className="book__data__container__desc__cta">
									{Listed
										?
											<PrimaryButton label={'Unlist'} onClick={()=>unlistHandler()}/>
										:Created
											?<React.Fragment>
												<PrimaryButton label={'Read'} onClick={()=>readHandler()}/>
											</React.Fragment>
											:Owner
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
											{/* {Liked?<img onClick={()=>likeHandler(false)} className='book__data__container__desc__interacts__item__icon' src={LikedIcon} alt="liked"/>:<img onClick={()=>likeHandler(true)} className='book__data__container__desc__interacts__item__icon' src={LikeIcon} alt="like"/>} */}
											<LikeIcon className="book__data__container__desc__interacts__item__icon" fill={Liked?"#ff5722":"transparent"} onClick={()=>(Created||Owner) && likeHandler(!Liked)}/>
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
										<p className='book__data__container__desc__summary__data utils__d__flex utils__align__center'>{NFT.price}&nbsp;<USDCIcon width={24} height={24} fill='currentColor'/></p>
										<p className='book__data__container__desc__summary__head typo__body--3'>publication date</p>
										<p className='book__data__container__desc__summary__data'>{moment(NFT.publication_date).add(6, 'h').format("D MMM, YYYY")}</p>
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
					<PurchaseModal data={NFT} onNewBookPurchase={()=>purchaseNewCopyHandler()} onOldBookPurchase={offer=>purchaseOldCopyHandler(offer)}/>
					<ListModal data={NFT} onListHandler={listPrice=>onListHandler(listPrice)} />
				</React.Fragment>
				:null
			}
		</Page>
	)
}

export default BookPage
