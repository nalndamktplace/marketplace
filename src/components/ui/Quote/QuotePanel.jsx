import axios from "axios"
import moment from 'moment'
import { useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"

import GaTracker from '../../../trackers/ga-tracker'
import { isUsable } from "../../../helpers/functions"
import { setSnackbar } from "../../../store/actions/snackbar"
import { showSpinner, hideSpinner } from '../../../store/actions/spinner'
import { BASE_URL } from "../../../config/env"

import {ReactComponent as BookmarkIcon} from '../../../assets/icons/bookmark.svg'
import {ReactComponent as CommentIcon} from '../../../assets/icons/comment.svg'
import {ReactComponent as QuoteIcon} from "../../../assets/icons/quote.svg"
import {ReactComponent as ShareIcon} from '../../../assets/icons/share.svg'
import {ReactComponent as UserIcon} from '../../../assets/icons/user.svg'
import {ReactComponent as LikeIcon} from '../../../assets/icons/thumbs-up.svg'
import {ReactComponent as DislikeIcon} from '../../../assets/icons/thumbs-down.svg'
import {ReactComponent as SendIcon} from '../../../assets/icons/send.svg'

const QuotePanel = ({mobileView, preview, rendition, bookMeta, addCommentRef, onRemove=()=>{}, hideModal=()=>{}}) => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const UserState = useSelector(state => state.UserState)
	const WalletState = useSelector(state => state.WalletState)

	const [WalletAddress, setWalletAddress] = useState(null)
	const [Loading, setLoading] = useState(false)
	const [Quotes, setQuotes] = useState([])
    const [Comments, setComments] = useState([])
    const [postComment, setPostComment] = useState('')
   

	useEffect(() => {
		if(Loading) dispatch(showSpinner())
		else dispatch(hideSpinner())
	}, [Loading, dispatch])

	useEffect(() => {
		if(!isUsable(mobileView) || mobileView === false){
			if(isUsable(preview) && !preview){
				if(isUsable(WalletState.wallet.provider)) setWalletAddress(WalletState.wallet.address)
				else navigate(-1)
			}
		}
	}, [WalletState, navigate, preview, mobileView])


	useEffect(() => { 
		if(isUsable(preview) && !preview && isUsable(bookMeta) && isUsable(WalletAddress) && isUsable(rendition)){
			setLoading(true)
			axios({
				url: `${BASE_URL}/api/book/quotes`,
				method: 'GET',
				params: {
                    bookAddress: bookMeta.book_address,
                    ownerAddress: WalletAddress
				}
			}).then(res => {
				if(res.status === 200) {
					setQuotes(res.data)
				}
				else dispatch(setSnackbar('NOT200'))
			}).catch(err => {
				dispatch(setSnackbar('ERROR'))
			}).finally(() => setLoading(false))
		}
	}, [bookMeta, WalletAddress, dispatch, rendition, preview])


useEffect(() => {
    Quotes.map(quote=>{
        axios({
            url: `${BASE_URL}/api/book/quotes/comments`,
            method: 'GET',
            params: {
                bookAddress: bookMeta.book_address,
                quoteId: quote.book_id
            }
        }).then(res => {
            if (res.status === 200) {
              setComments([...Comments, res.data])
            }
            else dispatch(setSnackbar('NOT200'))
        })
    })
   
},[bookMeta, WalletAddress, dispatch, rendition, preview, Quotes])


const addComment = (quoteId)=> {
    GaTracker('event_commentpanel_post')
        if(postComment.length>2){
            axios({
                url: `${BASE_URL}/api/book/quotes/comments`,
                method: 'POST',
                headers: {
					'user-id': UserState.user.uid
				},
                data: {
                    bookAddress: bookMeta.book_address,
                    quoteId: quoteId,
                    comment: postComment,
                }
            }).then(res => {
                if(res.status === 200) {
                   console.log("successful")
                   dispatch(hideModal())
                   setPostComment("")
                } 
                else dispatch(setSnackbar('NOT200'))
            }).catch(err => {
                dispatch(setSnackbar('ERROR'))
            }).finally(() => setLoading(false))

        }
    }



    const renderQuotes = () => {
        let quotesDOM = []
        if(!isUsable(rendition)) return ""
		if(!isUsable(bookMeta)) return ""
        Quotes.forEach((quote,i) => {
            quotesDOM.push(
                <div>
                <div key={i} className='quotes__item'>
                    <div className="quotes__item__icon">
                        <QuoteIcon width={32} height={32}  stroke="currentColor"/>
                    </div>
                    <div className="quotes__item__body typo__body">
                        {quote.body}
                    </div>
                    <div className="quotes__item__time typo__cap typo__cap--2">
                        {moment(quote.created_at).format("D MMM, YYYY") || "-"}
                    </div>
                </div>
                <div class="quotes__item__section"></div>
                <div className='quotes__item__section__icons'>
                <div className='quotes__item__section__icon__action'><LikeIcon height={24} width={24} /></div>
                <div className='quotes__item__section__icon__action'><DislikeIcon height={24} width={24} /></div>
                <div className='quotes__item__section__icon'> <CommentIcon height={24} width={24} /> 2  </div>
                <div className='quotes__item__section__icon__action'><ShareIcon height={24} width={24} /> Share </div>
                <div className='quotes__item__section__icon__action'><BookmarkIcon height={24} width={24} />Save</div>
                </div>
                    <div className='quotes__item__section__comment-div'>
                        <input id={i}  value={postComment} onChange={e => setPostComment(e.target.value)} className="quotes__item__section__comment-div__input" type="text" placeholder="Add a comment..." />
                            <a id={i} onClick={()=>addComment(quote.book_id)} className='quotes__item__section__comment-div__action'><SendIcon/></a>
                    </div>
                {Comments.map(comments => comments[0].quote_id == quote.book_id? renderComments(comments) : null )}
                </div>
            )
        })
        return quotesDOM
    }

    const renderComments = (comments) => {
        console.log(Comments)
        let commentsDOM = []
        comments.forEach((comment,i) => {
            commentsDOM.push(
                <div key={i} className='quotes__comments'>
                    <div className="quotes__comments__icon">
                        <UserIcon width={22} height={24} stroke="currentColor" />
                        <div className='quotes__comments__text'>{comment.uid}</div>
                    </div>
                    
                    <div className="quotes__comments__body typo__body">
                        {comment.comment}
                    </div>
                    {comment.thread? renderThreads(comment.thread) : null }
                </div>
            )
        })
        return commentsDOM
    }

    const renderThreads = (threads) =>{
        let threadsDOM = []
        threads.forEach((thread,i) => {
            threadsDOM.push(
                <div key={i} className='quotes__comments__thread'>
                    <div className="quotes__comments__icon">
                        <UserIcon width={22} height={24} stroke="currentColor" />
                        <div className='quotes__comments__text'>{thread.uid}</div>
                    </div>
                    
                    <div className="quotes__comments__body typo__body">
                        {thread.comment}
                    </div>
                </div>
            )
        })
        return threadsDOM
    }


	return <div className="panel panel__annotation"> {renderQuotes()} </div> ;
}

export default QuotePanel
