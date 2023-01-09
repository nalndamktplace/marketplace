import axios from 'axios'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'

import { ethers } from 'ethers'
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";

import Page from '../components/hoc/Page/Page'

import Contracts from '../connections/contracts'

import Stars from '../components/ui/Stars/Stars'
import Button from '../components/ui/Buttons/Button'
import ListModal from '../components/modal/List/List'
import QuoteModal from '../components/modal/Quote/QuoteModal'
import ReviewModal from '../components/modal/Review/ReviewModal'
import PurchaseModal from '../components/modal/Purchase/Purchase'
import ShareListModal from '../components/modal/ShareList/ShareList'

import Wallet from '../connections/wallet'

import GaTracker from '../trackers/ga-tracker'
import { BASE_URL } from '../config/env'
import { isFilled, isNotEmpty, isUsable } from '../helpers/functions'

import { setSnackbar } from '../store/actions/snackbar'
import { hideSpinner, showSpinner } from '../store/actions/spinner'
import { hideModal, showModal, SHOW_LIST_MODAL, SHOW_PURCHASE_MODAL, SHOW_QUOTE_MODAL, SHOW_REVIEW_MODAL, SHOW_SHARE_MODAL } from '../store/actions/modal'

import useIsLoggedIn from '../hook/useIsLoggedIn'

import BackgroundBook from '../assets/images/background-book.svg'
import {ReactComponent as LikeIcon} from '../assets/icons/like.svg'
import {ReactComponent as CartIcon} from "../assets/icons/cart-add.svg"
import {ReactComponent as PrintIcon} from "../assets/icons/print.svg"
import {ReactComponent as QuoteIcon} from "../assets/icons/quote.svg"
import {ReactComponent as UsersIcon} from "../assets/icons/users.svg"
import {ReactComponent as ReviewIcon} from "../assets/icons/message.svg"
import {ReactComponent as SynopsisIcon} from "../assets/icons/text.svg"
import {ReactComponent as LanguageIcon} from "../assets/icons/language.svg"
import {ReactComponent as BlockQuoteIcon} from "../assets/icons/block-quote.svg"
import {ReactComponent as LiveReadersIcon} from "../assets/icons/live_readers.svg"
import {ReactComponent as ExternalLinkIcon} from "../assets/icons/external-link.svg"
import {ReactComponent as TotalReadTimeIcon} from "../assets/icons/total_read_time.svg"

import {useWeb3AuthContext} from '../contexts/SocialLoginContext'

const BookPage = props => {

	const TABS = [{id: 'TAB01', label: 'Synopsis', icon : <SynopsisIcon />}, {id: 'TAB02', label: 'reviews',icon : <ReviewIcon />}, {id: 'TAB03', label: 'quotes',icon:<BlockQuoteIcon/>}]

	const params = useParams()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const isLoggedIn = useIsLoggedIn()

	const {
		address,
		connect,
		provider,
	} = useWeb3AuthContext();

	const UserState = useSelector(state => state.UserState)
	const BWalletState = useSelector(state=> state.BWalletState)

	const [WalletAddress, setWalletAddress] = useState(null)
	const [Loading, setLoading] = useState(false)
	const [ActiveTab, setActiveTab] = useState('TAB01')
	// NFT
	const [NFT, setNFT] = useState(null)
	const [Owner, setOwner] = useState(null)
	const [Listed, setListed] = useState(null)
	const [UserCopy, setUserCopy] = useState(null)
	const [Published, setPublished] = useState(null)
	// ListedNFT
	const [bookID, setBookID] = useState(null)
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
	const [Quote, setQuote] = useState(null)
	const [Quotes, setQuotes] = useState([])
	const [QuotesForm, setQuotesForm] = useState({quote: ''})
	// live reader count
	const [totalReaders, setTotalReaders] = useState(0)
	const [liveReaderCount, setLiveReaderCount] = useState(0)
	const [totalReadTime, setTotalReadTime] = useState(0)
	// tabs
	const TabContainerRef = useRef();

	useEffect(() => { GaTracker('page_view_book') }, [])

	useEffect(() => {
		if(ActiveTab === 'TAB01') GaTracker('tab_view_book_synopsis')
		else if(ActiveTab === 'TAB02') GaTracker('tab_view_book_reviews')
		else GaTracker('tab_view_book_quotes')
	}, [ActiveTab])

	useEffect(() => { if(isUsable(NFT)) setListed(NFT.listed === 1?true:false) }, [NFT])

	const getReviews = useCallback(
		() => {
			if(isUsable(NFT)){
				setLoading(true)
				axios({
					url: `${BASE_URL}/api/book/reviews`,
					method: 'GET',
					params: {
						bookAddress: NFT.book_address
					}
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
		},
		[NFT, dispatch],
	)
	
	const getUserReview = useCallback(
		() => {
			if(isUsable(NFT) && isUsable(WalletAddress)){
				setLoading(true)
				axios({
					url: `${BASE_URL}/api/book/reviewed`,
					method: 'GET',
					params: {
						bookAddress: NFT.book_address,
						ownerAddress: WalletAddress
					}
				}).then(res => {
					if(res.status === 200){
						if(isNotEmpty(res.data))
							setReview(res.data)}
				}).catch(err => {
					dispatch(setSnackbar('ERROR'))
				}).finally(() => setLoading(false))
			}
		},
		[NFT, WalletAddress, dispatch],
	)

	const getQuotes = useCallback(
		() => {
			if(isUsable(NFT)){
				setLoading(true)
				axios({
					url: `${BASE_URL}/api/book/quotes`,
					method: 'GET',
					params: {
						bookAddress: NFT.book_address
					}
				}).then(res => {
					if(res.status === 200) setQuotes(res.data)
					else if(res.status === 204) {}
					else dispatch(setSnackbar('NOT200'))
				}).catch(err => {
					dispatch(setSnackbar('ERROR'))
				}).finally(() => setLoading(false))
			}
		},
		[NFT, dispatch],
	)

	const getUserQuote = useCallback(
		() => {
			if(isUsable(NFT) && isUsable(WalletAddress)){
				setLoading(true)
				axios({
					url: `${BASE_URL}/api/book/quoted`,
					method: 'GET',
					params: {
						bookAddress: NFT.book_address,
						ownerAddress: WalletAddress
					}
				}).then(res => {
					if(res.status === 200){
						if(isNotEmpty(res.data))
							setQuote(res.data)
					}
				}).catch(err => {
					dispatch(setSnackbar('ERROR'))
				}).finally(() => setLoading(false))
			}
		},
		[NFT, WalletAddress, dispatch],
	)

	useEffect(() => { getReviews() }, [getReviews])

	useEffect(() => { getUserReview() }, [getUserReview])

	useEffect(() => { getQuotes() }, [getQuotes])

	useEffect(() => { getUserQuote() }, [getUserQuote])

	useEffect(() => {
		if(isUsable(NFT)){
			setLoading(true)
			axios({
				url: `${BASE_URL}/api/book/likes`,
				method: 'GET',
				params: {
					bookAddress: NFT.book_address
				}
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
				url: `${BASE_URL}/api/book/liked`,
				method: 'GET',
				params: {
					bookAddress: NFT.book_address,
					ownerAddress: WalletAddress
				}
			}).then(res => {
				if(res.status === 200) setLiked(res.data.liked)
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [NFT, WalletAddress, dispatch])

	useEffect(() => {
		if(isUsable(NFT)){
			setLoading(true)
			axios({
				url: `${BASE_URL}/api/reader/total-reader-count`,
				method: 'GET',
				params: { bookAddress: NFT.book_address }
			}).then(res => {
				if(res.status === 200) setTotalReaders(res.data.total_readers)
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [NFT, dispatch])

	useEffect(() => {
		if(isUsable(NFT)){
			setLoading(true)
			axios({
				url: `${BASE_URL}/api/reader/count`,
				method: 'GET',
				params: { bookAddress: NFT.book_address }
			}).then(res => {
				if(res.status === 200) setLiveReaderCount(res.data.reader_count)
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [NFT, dispatch])

	useEffect(() => {
		if(isUsable(NFT)){
			setLoading(true)
			axios({
				url: `${BASE_URL}/api/reader/total-read-time`,
				method: 'GET',
				params: { bookAddress: NFT.book_address }
			}).then(res => {
				if(res.status === 200) setTotalReadTime(res.data.total_read_time)
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [NFT, dispatch])

	useEffect(() => {
		setLoading(true)
		if(isUsable(BWalletState.smartAccount)){
			setWalletAddress(BWalletState.smartAccount.address)
		} 
		
		setLoading(false)
	}, [BWalletState])

	useEffect(() => { if(isUsable(Review)) setReviewForm({title: Review.title, body: Review.body, rating: Review.rating}) }, [Review])
	useEffect(() => {
        const bookID = params.bookID
        axios({
            url: `${BASE_URL}/api/book`,
            method: 'GET',
            params: {
                id: bookID
            }
        }).then(res=>{
            setNFT(res.data[0])
        })
	}, [params])
	
	useEffect(() =>{
		if(isUsable(WalletAddress) && isUsable(NFT)){
			setLoading(true)
			const book = NFT
			if(book.new_owner === WalletAddress) setOwner(true)
			else setOwner(false)
			if(book.publisher_address === WalletAddress) setPublished(true)
			else setPublished(false)
			axios({
				url: BASE_URL+'/api/book/owner',
				method: 'GET',
				params: {
					ownerAddress: WalletAddress,
					bookAddress: book.book_address
				}
			}).then(res => { if(res.status === 200) setOwner(true)
			}).catch(err => {
			}).finally(() => setLoading(false))
		} }, [NFT, params, dispatch, WalletAddress]
	)

	useEffect(() => { if(isUsable(NFT) && isUsable(Published) && isUsable(Owner)) setLoading(false) }, [NFT, Published, Owner])

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(()=>{
		let activeTabElement = document.getElementById("BOOK_PAGE_" + ActiveTab);
		if(!isUsable(activeTabElement)) return ;
		if(!isUsable(TabContainerRef.current)) return;
		TabContainerRef.current.style.setProperty("--marker-x",activeTabElement.offsetLeft);
	},[ActiveTab])

	useEffect(() => {
		if(Owner){
			axios({
				url: `${BASE_URL}/api/user/book`,
				method: 'GET',
				headers: {
					'user-id': UserState.user.uid,
					'address': BWalletState.smartAccount.address,
					'authorization': `Bearer ${UserState.tokens.acsTkn.tkn}`
				},
				params: {walletAddress: BWalletState.smartAccount.address, bookAddress: NFT.book_address}
			}).then(res => {
				if(res.status === 200) {
					setUserCopy(res.data)
					setListed(res.data.listed)
				}
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			})
		}
	}, [Owner, UserState, BWalletState, dispatch, NFT])

	const loginHandler = async () => {
		connect();
	}

	const walletStatus = () => {
		if (isUsable(BWalletState.smartAccount)) {
			setWalletAddress(BWalletState.smartAccount.address)
			return true
		}
		else {
			if (!address) {
				loginHandler();
			}
			Wallet(provider, dispatch);
		}
	}

	const unlistHandler = () => {
		GaTracker('event_book_unlist')
		if(isUsable(WalletAddress)){
			setLoading(true)
			axios({
				url: BASE_URL + '/api/user/book/listed',
				method: 'GET',
				headers: {
					'user-id': UserState.user.uid,
					'authorization': `Bearer ${UserState.tokens.acsTkn.tkn}`
				},
				params: {
					ownerAddress: WalletAddress,
					tokenId: UserCopy.token_id,
					bookAddress: NFT.book_address
				}
			}).then(res => {
				if(res.status === 200){
					setLoading(true)
					const orderId = res.data.order_id
					Contracts.unlistBookFromMarketplace(orderId, BWalletState.smartAccount.signer).then(res => {
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
						if(isUsable(err.reason)){
							if(err.reason.includes('NFT not yet listed / already sold')) dispatch(setSnackbar({show: true, message: "eBook already sold or not listed.", type: 3}))
						}
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
		dispatch(showModal(SHOW_LIST_MODAL))
		if(moment(NFT.secondary_sales_from).isSame(moment()) || moment(NFT.secondary_sales_from).isBefore(moment())) dispatch(showModal(SHOW_LIST_MODAL))
		else if(moment(NFT.secondary_sales_from).isAfter(moment())) dispatch(setSnackbar({show: true, message: `Secondary Sales will open only after ${moment(NFT.secondary_sales_from).format('D MMM, YYYY')}.`, type: 2}))
	}

	// TODO: Compatible for Biconomy wallet
	const onListHandler = listPrice => {
		GaTracker('event_book_list')
		if(isUsable(WalletAddress)){
			setLoading(true)
			Contracts.listBookToMarketplace(NFT.book_address, UserCopy.token_id, listPrice, BWalletState.smartAccount.signer).then(res => {
				setLoading(true)
				const orderId = parseInt(res.events.filter(event => event.event === 'CoverListed')[0].args[0]._hex)
				axios({
					url: BASE_URL + '/api/book/list',
					method: 'POST',
					data: {
						ownerAddress: WalletAddress,
						bookAddress: NFT.book_address,
						bookPrice: listPrice,
						bookOrderId: orderId,
						bookTokenId: UserCopy.token_id
					}
				}).then(res => {
					if(res.status === 200){
						setListed(true)
						dispatch(hideModal())
						dispatch(setSnackbar({show: true, message: "Book listed on marketplace.", type: 1}))
						if(res.data){
							setBookID(res.data)
							dispatch(showModal(SHOW_SHARE_MODAL))
						}
					}
					else dispatch(setSnackbar('NOT200'))
				}).catch(err => {
					dispatch(setSnackbar('ERROR'))
				}).finally( ()=> { setLoading(false) })
			}).catch(err => {
				if(isUsable(err.reason)){
					if(err.reason.includes("Can't list the cover at this time")) dispatch(setSnackbar({show: true, message: "Please wait for some more time before listing the book.", type: 3}))
					else if(err.reason.includes("Listing for this book is disabled")) dispatch(setSnackbar({show: true, message: "Listing this book is not allowed right now. Please try again later.", type: 3}))
					else if(err.reason.includes("Seller should own the NFT to list")) dispatch(setSnackbar({show: true, message: "Book is already listed. Please contact us on support@nalnda.com", type: 3}))
				}
				else dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}

	const readHandler = async () => {
		GaTracker('event_book_read')
		setLoading(true)
		try {
			// axios({
			// 	url: `${BASE_URL}/api/verify`,
			// 	method: 'GET',
			// 	params: {
			// 		bookAddress: NFT.book_address,
			// 		ownerAddress: WalletAddress
			// 	}
			// }).then(res => {
			// 	if(res.status === 200){
			// 		const messageToSign = res.data
			// 		Wallet.signMessage(BWalletState.smartAccount.signer, JSON.stringify(messageToSign)).then(res => {
			// 			if(res.isValid === true){
			// 				axios({
			// 					url : BASE_URL + '/api/verify',
			// 					method : "POST",
			// 					headers: {
			// 						'address': BWalletState.smartAccount.address,
			// 						'user-id': UserState.user.uid,
			// 						'authorization': `Bearer ${UserState.tokens.acsTkn.tkn}`
			// 					},
			// 					data : {
			// 						accountAddress: WalletAddress,
			// 						bookAddress: NFT.book_address,
			// 						signedData: res.signedData,
			// 						cid : NFT.book.slice(NFT.book.lastIndexOf("/")+1),
			// 					}
			// 				}).then(res=>{
			// 					if(res.status === 200) {
			// 						GaTracker('navigate_book_reader')
			// 						navigate('/library/reader', {state: {book: {...NFT, url: res.data.url}, preview: false}}) 
			// 					}
			// 					else dispatch(setSnackbar({show:true,message : "Error", type : 4}))
			// 				}).catch(err => { dispatch(setSnackbar('ERROR'))
			// 				}).finally( () => setLoading(false))
			// 			}
			// 			else dispatch(setSnackbar({show: true, message: "Could not verify the authenticity of the signature.", type: 3}))
			// 		})
			// 	}
			// 	else dispatch(setSnackbar('NOT200'))
			// })
			axios({
				url: `${BASE_URL}/api/verify/mobile`,
				method: 'POST',
				headers: {
					'address': BWalletState.smartAccount.address,
					'user-id': UserState.user.uid,
					'authorization': `Bearer ${UserState.tokens.acsTkn.tkn}`
				},
				data: {
					bookAddress: NFT.book_address,
					ownerAddress: BWalletState.smartAccount.address
				}
			}).then(res => {
				if(res.status === 200){
					GaTracker('navigate_book_reader')
					navigate('/library/reader', {
						state: {
							book: {
								...NFT,
								url: `${res.data.base}?token=${res.data.token}&cid=${res.data.cid}&fileName=${res.data.fileName}`
							}
						}
					})
				}
			})
		} catch (err) {
			setLoading(false)
		}
	}

	const previewHandler = () => {
		GaTracker('navigate_book_preview')
		navigate('/book/preview', {state: {book: NFT, preview: true}})
	}

	const purchaseHandler = () => isLoggedIn?dispatch(showModal(SHOW_PURCHASE_MODAL)):dispatch(setSnackbar('NOT_LOGGED_IN'))

	const reviewModalHandler = () => isLoggedIn?dispatch(showModal(SHOW_REVIEW_MODAL)):dispatch(setSnackbar('NOT_LOGGED_IN'))

	const quoteModalHandler = () => isLoggedIn?dispatch(showModal(SHOW_QUOTE_MODAL)):dispatch(setSnackbar('NOT_LOGGED_IN'))

	const purchaseNewCopyHandler = () => {
		const purchase = async() => {
			try{
				const approveErc721Interface = new ethers.utils.Interface(['function approve(address spender, uint256 amount)'])
				const address = BWalletState.smartAccount.address
				const approveData = approveErc721Interface.encodeFunctionData( 'approve', [NFT.book_address, ethers.utils.parseUnits(NFT.price.toString(), 6)] )
				const approveTx = { to: "0xdA5289fCAAF71d52a80A254da614a192b693e977", data: approveData }
				const safeMintErc721Interface = new ethers.utils.Interface(['function safeMint(address to)'])
				const safeMintData = safeMintErc721Interface.encodeFunctionData( 'safeMint', [address] )
				const safeMintTx = { to: NFT.book_address, data: safeMintData }
				BWalletState.smartAccount.on('txMined', response => {
					const logs = response.receipt.logs.filter(log => log.address === NFT.book_address && log.topics.length === 4 && isFilled(log.topics.filter(topic => topic === keccak256(toUtf8Bytes("Transfer(address,address,uint256)")) && isFilled(log.topics[log.topics.length-1]))) )
					if(isFilled(logs)){
						const tokenId = parseInt(logs[0].topics[logs[0].topics.length-1])
						axios({
							url: BASE_URL+'/api/book/purchase',
							method: 'POST',
							data: {ownerAddress: address, bookAddress: NFT.book_address, tokenId, purchasePrice: NFT.price}
						}).then(res => {
							if(res.status === 200){
								setOwner(true)
								dispatch(hideModal())
							}
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
					}
				})
				BWalletState.smartAccount.on('error', response => {
					setLoading(false)
					dispatch(setSnackbar('ERROR'))
					console.error({error: response})
				})
				const transactions = [approveTx, safeMintTx]
				const feeQuotes = await BWalletState.smartAccount.prepareRefundTransactionBatch({ transactions })
				const transaction = await BWalletState.smartAccount.createRefundTransactionBatch({ transactions, feeQuote: feeQuotes[1] })
				await BWalletState.smartAccount.sendTransaction({
					tx: transaction,
					gasLimit: { hex: "0x4C4B40", type: "hex" }
				})
			} catch (error) {
				setLoading(false)
				console.error({error})
				dispatch(setSnackbar('ERROR'))
			}
		}
		GaTracker('event_book_purchase_new')
		setLoading(true)
		if(isUsable(WalletAddress)) purchase()
		else dispatch(setSnackbar({show: true, message: "Please connect your WEB3 wallet.", type: 3}))
	}

	const purchaseOldCopyHandler = offer => {
		GaTracker('event_book_purchase_old')
		if(walletStatus()){
			setLoading(true)
			Contracts.buyListedCover(offer.order_id, offer.price, BWalletState.smartAccount.signer).then(res => {
				axios({
					url: BASE_URL+'/api/book/purchase/secondary',
					method: 'POST',
					data: {
						newOwnerAddress: WalletAddress,
						previousOwnerAddress: offer.previous_owner,
						bookAddress: offer.book_address,
						tokenId: offer.token_id,
						purchasePrice: offer.price,
						orderId: offer.order_id,
						daScore: offer.da_score
					}
				}).then(res => {
					if(res.status === 200){
						dispatch(hideModal())
						setOwner(true)
					}
					else dispatch(setSnackbar('NOT200'))
				}).catch(err => {
					dispatch(setSnackbar('ERROR'))
				}).finally(() => setLoading(false))
			}).catch(err => {
				setLoading(false)
			})
		}
	}

	const likeHandler = () => {
		if(walletStatus()){
			if(Owner){
				if(!Liked){
					setLikes(old => old+1)
					GaTracker('event_book_like')
				}
				else{
					setLikes(old => old-1)
					GaTracker('event_book_unlike')
				}
				axios({
					url: `${BASE_URL}/api/book/likes`,
					method: 'POST',
					data: {
						bookAddress: NFT.book_address,
						ownerAddress: WalletAddress,
						likedState: !Liked
					}
				}).then(res => {
					if(res.status === 200) setLiked(old => !old)
					else dispatch(setSnackbar('NOT200'))
				}).catch(err => {
					dispatch(setSnackbar('ERROR'))
				}).finally( () => setLoading(false) )
			}
			else dispatch(setSnackbar({show: true, message: "Only owners can like a book.", type: 3}))
		}
		else dispatch(setSnackbar({show: true, message: "Please login first.", type: 3}))
	}

	const renderGrid = () => {
		return (
			<div className='book__data__container__desc__summary__grid typo__color--n700'>
				<div className='book__data__container__desc__summary__grid__item'>
					<LanguageIcon />
					<div className='book__data__container__desc__summary__grid__item__data'>{NFT.language}</div>
				</div>
				<div className='book__data__container__desc__summary__grid__item'>
					<UsersIcon />
					<div className='book__data__container__desc__summary__grid__item__data'>{totalReaders} readers</div>
				</div>
				<div className='book__data__container__desc__summary__grid__item'>
					<LiveReadersIcon />
					<div className='book__data__container__desc__summary__grid__item__data'>{liveReaderCount} people reading</div>
				</div>
				<div className='book__data__container__desc__summary__grid__item'>
					<TotalReadTimeIcon />
					<div className='book__data__container__desc__summary__grid__item__data'>{Math.ceil(totalReadTime / 60)} minutes</div>
				</div>
			</div>
		)
	}

	const renderTabs = () => {
		let tabsDOM = []
		TABS.forEach(tab => {
			tabsDOM.push(
				<div onClick={()=>setActiveTab(tab.id)} id={"BOOK_PAGE_"+tab.id} className={tab.id === ActiveTab?"book__data__container__desc__tabs__container__item book__data__container__desc__tabs__container__item--active":"book__data__container__desc__tabs__container__item utils__cursor--pointer"} key={tab.id}>
					{isUsable(tab.icon) && tab.icon}
					<h5 className="typo__head typo__head--6 typo__transform--capital">{tab.label}</h5>
				</div>
			)
		})
		return tabsDOM
	}

	const renderTabData = () => {
		switch (ActiveTab) {
			case 'TAB01':
				return <p className="typo--break-spaces typo__body typo__color--n600">{NFT.synopsis}</p>
			case 'TAB02':
				const renderReviews = reviews => {
					let reviewsDOM = []
					if(isFilled(reviews)) reviews.forEach(review => reviewsDOM.push(
						<div className="book__data__container__desc__tabs__data__reviews__item">
							<div className="book__data__container__desc__tabs__data__reviews__item__header__head typo__head typo__head--6">{review.title}</div>
							<div className="book__data__container__desc__tabs__data__reviews__item__header">
								<Stars rating={review.rating} size={'small'}/>
								<div className="book__data__container__desc__tabs__data__reviews__item__header__time typo__color--n500">{moment(review.reviewed_at).format("D MMM, YYYY")}</div>
							</div>
							<div className="book__data__container__desc__tabs__data__reviews__item__body typo__body typo__body--2">{review.body}</div>
						</div>))
					return reviewsDOM
				}
				return <React.Fragment>
					{ !isUsable(Review) && Owner ?
						<div className="book__data__container__desc__tabs__data__action">
							<div className="book__data__container__desc__tabs__data__action__icon">
								<ReviewIcon width={32} height={32} stroke="currentColor"/>
							</div>
							<div className="book__data__container__desc__tabs__data__action__label typo__head--6">Write a Review</div>
							<Button type="primary" onClick={()=>reviewModalHandler()}>Review</Button>
						</div>
					:null}
					<div className="book__data__container__desc__tabs__data__reviews">
						{renderReviews(Reviews)}
						{Reviews?.length === 0 ? <div className='book__data__container__desc__tabs__data__empty'>No Reviews</div> : ""}
					</div>
				</React.Fragment>
			case 'TAB03':
				const renderQuotes = quotes => {
					let quotesDOM = []
					quotes.forEach((quote,i) => {
						quotesDOM.push(
							<div key={i} className='book__data__container__desc__tabs__data__quotes__item'>
								<div className="book__data__container__desc__tabs__data__quotes__item__icon">
									<QuoteIcon width={32} height={32}  stroke="currentColor"/>
								</div>
								<div className="book__data__container__desc__tabs__data__quotes__item__body typo__body">
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
					{ !isUsable(Quote) && ( Published || Owner ) ?
						<div className="book__data__container__desc__tabs__data__action">
							<div className="book__data__container__desc__tabs__data__action__icon">
								<BlockQuoteIcon width={32} height={32} stroke="currentColor"/>
							</div>
							<div className="book__data__container__desc__tabs__data__action__label typo__head--6">Write a Quote</div>
							<Button type="primary" onClick={()=>quoteModalHandler()}>Quote</Button>
						</div>
					:null}
					<div className="book__data__container__desc__tabs__data__quotes">
						{renderQuotes(Quotes)}
						{Quotes?.length === 0 ? <div className='book__data__container__desc__tabs__data__empty'>No Quotes</div> : ""}
					</div>
				</React.Fragment>
			default:
				break
		}
	}

	const reviewHandler = () => {
		GaTracker('event_book_review')
		if(isUsable(WalletAddress)){
			if(isNotEmpty(ReviewForm.body) && isNotEmpty(ReviewForm.rating) && isNotEmpty(ReviewForm.title)){
				setLoading(true)
				axios({
					url: `${BASE_URL}/api/book/reviews`,
					method: 'POST',
					data: {
						review: {...ReviewForm},
						bookAddress: NFT.book_address,
						ownerAddress: WalletAddress
					}
				}).then(res => {
					if(res.status === 200) {
						dispatch(hideModal())
						getUserReview()
						getReviews()
					}
					else dispatch(setSnackbar('NOT200'))
				}).catch(err => {
					setLoading(false)
					dispatch(setSnackbar('ERROR'))
				})
			}
			else dispatch(setSnackbar({show: true, message: "Please fill the review.", type: 3}))
		}
		else dispatch(setSnackbar({show: true, message: "Please login first", type: 3}))
	}

	const quoteHandler = () => {
		GaTracker('event_book_quote')
		if(isUsable(WalletAddress)){
			if(isNotEmpty(QuotesForm.quote)){
				setLoading(true)
				axios({
					url: `${BASE_URL}/api/book/quotes`,
					method: 'POST',
					data: {
						quote: {body:QuotesForm.quote},
						bookAddress: NFT.book_address,
						ownerAddress: WalletAddress
					}
				}).then(res => {
					if(res.status === 200){
						dispatch(hideModal())
						getUserQuote()
						getQuotes()
					}
					else dispatch(setSnackbar('NOT200'))
				}).catch(err => {
					setLoading(false)
					dispatch(setSnackbar('ERROR'))
				})
			}
			else dispatch(setSnackbar({show: true, message: "Please enter the quote.", type: 3}))
		}
		else dispatch(setSnackbar({show: true, message: "Please login first", type: 3}))
	}

	return (
		<>
		<Helmet>
			<meta name="Book's Page" content='Buy & Read the book you like'/>
		</Helmet>
		<Page>
			<div className="book__bg">
				<img src={BackgroundBook} alt="background" loading="lazy"/>
			</div>
			{isUsable(NFT)?
				<>
					<div className="book__data">
						<div className="book__data__background"/>
						<div className="book__data__container">
							<div>
								<div className='book__data__container__cover'>
									<img className='book__data__container__cover__image' src={NFT.cover_display_url?NFT.cover_display_url:NFT.cover_public_url?NFT.cover_public_url:NFT.cover} alt={NFT.name}/>
								</div>
								<div className='book__data__container__meta'>
									<h3 className="typo__color--n700 typo__head typo__head--3 typo__transform--capital">{NFT.title}</h3>
									<h5 className="typo__color--n500 typo__head typo__head--6 typo__transform--upper">{NFT.author}</h5>
									{Owner||Published?null:<div className='book__data__container__meta__price typo-head--6 typo__act typo__color--success'>{NFT.price===0?"FREE":<><img src='https://imagedelivery.net/yOWneHxM1h9mu46Te3Yjwg/59c27d12-e4eb-4f74-7a6e-b33ba6537600/icon48' style={{width: 20, height: 20, objectFit: 'contain'}} alt="USDC"/>&nbsp;{NFT.price}</>}</div>}
									<div className="book__data__container__meta__rating">
										<div className="book__data__container__meta__rating__stars">
											<Stars size={'small'} rating={Rating}/>
										</div>
										<div className='book__data__container__meta__rating__count typo__body'>
											{TotalReveiws} reviews
										</div>
									</div>
									<div className="book__data__container__meta__cta">
										{Listed
											?
												<Button type="primary" size="lg" onClick={()=>unlistHandler()}>Unlist</Button>
											:Published
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
										<div className="book__data__container__desc__summary__contract" onClick={()=>window.open(`https://mumbai.polygonscan.com/address/${NFT.book_address}`, "_blank")}>
											<div className='book__data__container__desc__summary__contract__data'>
												<div className='book__data__container__desc__summary__contract__label typo__color--n700'>Contract Address</div>
												<div className='book__data__container__desc__summary__contract__value typo__color--n500'>{(NFT.book_address||"").slice(0,12)}…{(NFT.book_address||"").slice((NFT.contract||"").length-10)}</div>
											</div>
											<div className='book__data__container__desc__summary__contract__icon'>
												<ExternalLinkIcon width={24} height={24}/>
											</div>
										</div>
										<div className='book__data__container__desc__summary__head typo__color--n700'>Genres</div>
										<div className='book__data__container__desc__summary__chips typo__transform--capital'>{JSON.parse(NFT.genres).map(g=><div className="book__data__container__desc__summary__chips__item">{g}</div>)}</div>
										<div className='book__data__container__desc__summary__head typo__color--n700'>Prefered Age Group</div>
										<div className='book__data__container__desc__summary__chips typo__transform--capital'>{JSON.parse(NFT.age_group).map(g=><div className="book__data__container__desc__summary__chips__item">{g}</div>)}</div>
										{renderGrid()}
									</div>
								</div>
								<div className="book__data__container__desc__right">
									<div className="book__data__container__desc__interacts">
										<div className="book__data__container__desc__interacts__item">
											<div className='typo__subtitle typo__color--n500'>Likes</div>
											<LikeIcon width={24} height={24} className="book__data__container__desc__interacts__item__icon" stroke={Liked?"#ff5722":"currentColor"} fill={Liked?"#ff5722":"transparent"} onClick={ ()=>likeHandler() }/>
											<div className='typo__head--5 typo__color--n600'>{Likes||"0"}</div>
										</div>
										<div className="book__data__container__desc__interacts__item">
											<div className='typo__subtitle typo__color--n500'>Reviews</div>
											<ReviewIcon width={24} height={24} stroke="currentColor"/>
											<div className='typo__head--5 typo__color--n600'>{TotalReveiws||"0"}</div>
										</div>
										<div className="book__data__container__desc__interacts__item">
											<div className='typo__subtitle typo__color--n500'>Pages</div>
											<PrintIcon width={24} height={24} stroke="currentColor"/>
											<div className='typo__head--5 typo__color--n600'>{NFT.print||"00"}</div>
										</div>
										<div className="book__data__container__desc__interacts__item">
											<div className='typo__subtitle typo__color--n500'>Sold</div>
											<CartIcon width={24} height={24} stroke="currentColor"/>
											<div className='typo__head--5 typo__color--n600'>{NFT.copies||"00"}</div>
										</div>
									</div>
									<div className="book__data__container__desc__tabs">
										<div ref={TabContainerRef} className="book__data__container__desc__tabs__container">
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
					<ListModal book={NFT} userCopy={UserCopy} onListHandler={listPrice=>onListHandler(listPrice)} />
					<ReviewModal ReviewForm={ReviewForm} setReviewForm={setReviewForm} reviewHandler={reviewHandler}/>
					<QuoteModal QuotesForm={QuotesForm} setQuotesForm={setQuotesForm} quoteHandler={quoteHandler}/>
					<ShareListModal bookID={bookID} />
				</>
				:null
			}
		</Page>
		</>
	)
}

export default BookPage
