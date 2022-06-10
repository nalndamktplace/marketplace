import axios from 'axios'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import Page from '../components/hoc/Page/Page'
import InputField from '../components/ui/Input/Input'

import Contracts from '../connections/contracts'

import ListModal from '../components/modal/List/List'
import PurchaseModal from '../components/modal/Purchase/Purchase'
import ReviewModal from '../components/modal/Review/ReviewModal'

import Wallet from '../connections/wallet'

import { setWallet } from '../store/actions/wallet'
import { setSnackbar } from '../store/actions/snackbar'
import { hideSpinner, showSpinner } from '../store/actions/spinner'
import { isFilled, isNotEmpty, isUsable } from '../helpers/functions'
import { hideModal, showModal, SHOW_LIST_MODAL, SHOW_PURCHASE_MODAL, SHOW_QUOTE_MODAL, SHOW_REVIEW_MODAL } from '../store/actions/modal'

import StarEmptyIcon from '../assets/icons/star-empty.svg'
import StarFilledIcon from '../assets/icons/star-filled.svg'
import StarFilledHalfIcon from '../assets/icons/star-filled-half.svg'
import StarEmptyHalfRtlIcon from '../assets/icons/star-empty-half-rtl.svg'
import BackgroundBook from '../assets/images/background-book.svg'
import {ReactComponent as LikeIcon} from '../assets/icons/like.svg'
import {ReactComponent as USDCIcon} from "../assets/icons/usdc-icon.svg"
import {ReactComponent as QuoteIcon} from "../assets/icons/quote.svg"
import {ReactComponent as ReviewIcon} from "../assets/icons/message.svg"
import {ReactComponent as ExternalLinkIcon} from "../assets/icons/external-link.svg"
import {ReactComponent as CartIcon} from "../assets/icons/cart-add.svg"
import {ReactComponent as PrintIcon} from "../assets/icons/print.svg"
import {ReactComponent as SynopsisIcon} from "../assets/icons/text.svg"
import {ReactComponent as BlockQuoteIcon} from "../assets/icons/block-quote.svg"

import { BASE_URL } from '../config/env'
import Button from '../components/ui/Buttons/Button'
import QuoteModal from '../components/modal/Quote/QuoteModal'

const BookPage = props => {

	const TABS = [{id: 'TAB01', label: 'Synopsis', icon : <SynopsisIcon />}, {id: 'TAB02', label: 'reviews',icon : <ReviewIcon />}, {id: 'TAB03', label: 'quotes',icon:<BlockQuoteIcon/>}]

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
	useEffect(() => { console.log(NFT)}, [NFT])

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

	const readHandler = async () => { 
		try {
			let messageToSign = await axios.get(BASE_URL + '/api/verify?bid='+NFT.book_address);
			console.log(messageToSign.data);
			// todo replace with web3modal
			const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
			const account = accounts[0];
			const signedData = await window.ethereum.request({
				method: "personal_sign",
				params: [JSON.stringify(messageToSign.data), account, messageToSign.data.id],
				// params: [`To verify you own the NFT in question, you must sign this message. \nThe NFT contract address is: \n${messageToSign.data.contract} \nThe verification id is: \n${messageToSign.data.id}`, account, messageToSign.data.id],
			});
			console.log(signedData);
			axios({
				url : BASE_URL + '/api/verify',
				method : "POST",
				data : {
					accountAddress:account,
					bookAddress: NFT.book_address,
					signedData,
					cid : NFT.book.slice(NFT.book.lastIndexOf("/")+1)
				}
			}).then(res=>{
				if(res.status === 200) {
					console.log("RESPONSE",res.data);
					navigate('/account/reader', {state: {book: {...NFT,submarineURL:res.data.url}, preview: false}}) 
				} else {
					dispatch(setSnackbar({show:true,message : "Error", type : 4}))
				}
			}).catch(err => {
				console.error(err);
			});
			
			
		} catch (err) {
			console.error(err);
		}
		navigate('/account/reader', {state: {book: NFT, preview: false}}) 
	}

	const previewHandler = () => { navigate('/book/preview', {state: {book: NFT, preview: true}}) }

	const purchaseHandler = () => { dispatch(showModal(SHOW_PURCHASE_MODAL)) }

	const reviewModalHandler = () => { dispatch(showModal(SHOW_REVIEW_MODAL)) }

	const quoteModalHandler = () => { dispatch(showModal(SHOW_QUOTE_MODAL)) }

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
					{isUsable(tab.icon) && tab.icon}
					<h5 className="typo__head typo__head--5">{tab.label}</h5>
				</div>
			)
		})
		return tabsDOM
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

	const renderTabData = () => {
		switch (ActiveTab) {
			case 'TAB01':
				return <p className="typo__body typo__body--2 typo__color--n600">{NFT.synopsis}</p>
			case 'TAB02':

				const renderReviews = reviews => {
					let reviewsDOM = []
					if(isFilled(reviews)) reviews.forEach(review => reviewsDOM.push(
						<div className="book__data__container__desc__tabs__data__reviews__item">
							<div className="book__data__container__desc__tabs__data__reviews__item__header">
								<div className="book__data__container__desc__tabs__data__reviews__item__header__head typo__head--4 typo__transform--upper">{review.title}</div>
								<div className="book__data__container__desc__tabs__data__reviews__item__header__time typo__color--n500">{moment(review.reviewed_at).format("D MMM, YYYY")}</div>
							</div>
							<div className="book__data__container__desc__tabs__data__reviews__item__rating">
								{renderStars(review.rating)}
							</div>
							<div className="book__data__container__desc__tabs__data__reviews__item__body typo__body typo__body--2">{review.body}</div>
						</div>))
					return reviewsDOM
				}
				
				return <>
					{ (!isUsable(Review) && (Created||Owner)) || true && (
						<div className="book__data__container__desc__tabs__data__action">
							<div className="book__data__container__desc__tabs__data__action__icon">
								<ReviewIcon width={32} height={32} stroke="currentColor"/>
							</div>
							<div className="book__data__container__desc__tabs__data__action__label typo__head--6">Write a Review</div>
							<Button type="primary" onClick={()=>reviewModalHandler()}>Review</Button>
						</div>
					)}
					<div className="book__data__container__desc__tabs__data__reviews">
						{renderReviews(Reviews)}
					</div>
				</>
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
				
				return <>
					{ (!isUsable(Review) && (Created||Owner)) || true && (
						<div className="book__data__container__desc__tabs__data__action">
							<div className="book__data__container__desc__tabs__data__action__icon">
								<BlockQuoteIcon width={32} height={32} stroke="currentColor"/>
							</div>
							<div className="book__data__container__desc__tabs__data__action__label typo__head--6">Write a Quote</div>
							<Button type="primary" onClick={()=>quoteModalHandler()}>Quote</Button>
						</div>
					)}
					<div className="book__data__container__desc__tabs__data__quotes">
						{renderQuotes(Quotes)}
					</div>
				</>
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

	const getPriceTagClass = (book) => {
		let classes = ["book__data__container__meta__price typo-head--6"]
		if(book.price === 0) classes.push("book__data__container__meta__price--free")
		return classes.join(" ");
	}

	return (
		<Page>
			<div className="book__bg">
				<img src={BackgroundBook} alt="background"/>
			</div>
			{isUsable(NFT)?
				<>
					<div className="book__data">
						<div className="book__data__background"></div>
						<div className="book__data__container">
							<div>
								<div className='book__data__container__cover'>
									<img className='book__data__container__cover__image' src={NFT.cover} alt={NFT.name} />
								</div>
								<div className='book__data__container__meta'>
									<h3 className="typo__color--n700 typo__head typo__head--3 typo__transform--capital">{NFT.title}</h3>
									<h5 className="typo__color--n500 typo__head typo__head--5">{NFT.author}</h5>
									<div className={getPriceTagClass(NFT)}>{NFT.price===0?"FREE":<><USDCIcon stroke='currentColor' strokeWidth={1}  width={24} height={24} fill='currentColor'/>{NFT.price}</>}</div>
									<div className="book__data__container__meta__rating">
										<div className="book__data__container__meta__rating__stars">
											{renderStars(Rating)}
										</div>
										<div className='book__data__container__meta__rating__count'>
											out of {TotalReveiws} reviews
										</div>
									</div>
									<div className="book__data__container__meta__cta">
										{Listed
											?
												<Button type="primary" size="lg" onClick={()=>unlistHandler()}>Unlist</Button>
											:Created
												?<>
													<Button type="primary" size="lg" onClick={()=>readHandler()}>Read</Button>
												</>
												:Owner
													?<>
														<Button type="primary" size="lg" onClick={()=>readHandler()}>Read</Button>
														<Button onClick={()=>listHandler()}>List</Button>
													</>
													:<>
														<Button type="primary" size="lg" onClick={()=>purchaseHandler()}>Buy Now</Button>
														<Button onClick={()=>previewHandler()}>Preview</Button>
													</>
										}
									</div>
								</div>
							</div>
							<div className='book__data__container__desc'>
								<div className="book__data__container__desc__left">
									<div className="book__data__container__desc__summary">
										<div className="book__data__container__desc__summary__contract">
											<div className='book__data__container__desc__summary__contract__data'>
												<div className='book__data__container__desc__summary__contract__label typo__color--n700'>Contract Address</div>
												<div className='book__data__container__desc__summary__contract__value typo__color--n700' onClick={()=>window.open(`https://mumbai.polygonscan.com/address/${NFT.book_address}`, "_blank")}>{(NFT.book_address||"").slice(0,4)}…{(NFT.book_address||"").slice((NFT.contract||"").length-4)}</div>
											</div>
											<div className='book__data__container__desc__summary__contract__icon'>
												<ExternalLinkIcon />
											</div>
										</div>
										<div className='book__data__container__desc__summary__head typo__color--n700'>Genres</div>
										<div className='book__data__container__desc__summary__chips typo__transform--capital'>{JSON.parse(NFT.genres).map(g=><div className="book__data__container__desc__summary__chips__item">{g}</div>)}</div>
										<div className='book__data__container__desc__summary__head typo__color--n700'>Language</div>
										<div className='book__data__container__desc__summary__data'>{NFT.language}</div>
										<div className='book__data__container__desc__summary__head typo__color--n700'>Price</div>
										<div className='book__data__container__desc__summary__data utils__d__flex utils__align__center'>{NFT.price}&nbsp;<USDCIcon width={24} height={24} fill='currentColor'/></div>
										<div className='book__data__container__desc__summary__head typo__color--n700'>Publication date</div>
										<div className='book__data__container__desc__summary__data'>{moment(NFT.publication_date).add(6, 'h').format("D MMM, YYYY")}</div>
									</div>
								</div>
								<div className="book__data__container__desc__right">
									<div className="book__data__container__desc__interacts">
										<div className="book__data__container__desc__interacts__item">
											<LikeIcon width={32} height={32} className="book__data__container__desc__interacts__item__icon" stroke="currentColor" fill={Liked?"#ff5722":"transparent"} onClick={()=>(Created||Owner) && likeHandler(!Liked)}/>
											<div className='typo__head--6 typo__color--n500'>Likes</div>
											<div className='typo__head--3 typo__color--n600'>{Likes||"0"}</div>
										</div>
										<div className="book__data__container__desc__interacts__item">
											<ReviewIcon width={32} height={32} stroke="currentColor"/>
											<div className='typo__head--6 typo__color--n500'>Reviews</div>
											<div className='typo__head--3 typo__color--n600'>{TotalReveiws||"0"}</div>
										</div>
										<div className="book__data__container__desc__interacts__item">
											<PrintIcon width={32} height={32} stroke="currentColor"/>
											<div className='typo__head--6 typo__color--n500'>Print Pages</div>
											<div className='typo__head--3 typo__color--n600'>{NFT.print||"00"}</div>
										</div>
										<div className="book__data__container__desc__interacts__item">
											<CartIcon width={32} height={32} stroke="currentColor"/>
											<div className='typo__head--6 typo__color--n500'>Sold</div>
											<div className='typo__head--3 typo__color--n600'>{NFT.copies||"00"}</div>
										</div>
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
					<ReviewModal ReviewForm={ReviewForm} setReviewForm={setReviewForm} reviewHandler={reviewHandler}/>
					<QuoteModal QuotesForm={QuotesForm} setQuotesForm={setQuotesForm} quoteHandler={quoteHandler}/>
				</>
				:null
			}
		</Page>
	)
}

export default BookPage
